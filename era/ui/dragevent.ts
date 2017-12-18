namespace Ui
{
	export class DragEffectIcon extends DualIcon
	{
		protected onStyleChange() {
			let size = this.getStyleProperty('size');
			this.width = size;
			this.height = size;
		}

		static style: object = {
			fill: '#333333',
			stroke: '#ffffff',
			strokeWidth: 4,
			size: 16
		}
	}

	export class DragEvent extends Event
	{
		clientX: number = 0;
		clientY: number = 0;
		ctrlKey: boolean = false;
		altKey: boolean = false;
		shiftKey: boolean = false;
		metaKey: boolean = false;
		dataTransfer: DragDataTransfer = undefined;
		effectAllowed: string = undefined;

		private deltaX: number = 0;
		private deltaY: number = 0;

		constructor() {
			super();
		}

		preventDefault() {
		}
	}

	export class DragNativeData extends Core.Object
	{
		dataTransfer: any = undefined;

		constructor(dataTransfer) {
			super();
			this.dataTransfer = dataTransfer;
		}

		getTypes() {
			return this.dataTransfer.dataTransfer.types;
		}

		hasTypes(...args) {
			let types = this.getTypes();
			for (let i = 0; i < types.length; i++) {
				for (let i2 = 0; i2 < args.length; i2++)
					if (types[i].toLowerCase() === args[i2].toLowerCase())
						return true;
			}
			return false;
		}

		hasType(type) {
			return this.hasTypes(type);
		}

		hasFiles() {
			return this.hasType('files');
		}

		getFiles() {
			let files = [];
			for (let i = 0; i < this.dataTransfer.dataTransfer.files.length; i++)
				files.push(new Core.File({ fileApi: this.dataTransfer.dataTransfer.files[i] }));
			return files;
		}

		getData(type) {
			return this.dataTransfer.dataTransfer.getData(type);
		}
	}

	export class DragWatcher extends Core.Object {
		effectAllowed: any = undefined;
		dataTransfer: DragDataTransfer = undefined;
		element: Element;
		x: number = 0;
		y: number = 0;

		constructor(element: Element, dataTransfer: DragDataTransfer) {
			super();
			this.addEvents('drop', 'leave', 'move');

			this.dataTransfer = dataTransfer;
			this.element = element;
		}

		getPosition() {
			return new Point(this.x, this.y);
		}

		getElement() {
			return this.element;
		}

		getDataTransfer() {
			return this.dataTransfer;
		}

		getEffectAllowed() {
			return this.effectAllowed;
		}

		setEffectAllowed(effect) {
			this.effectAllowed = effect;
		}

		move(x: number, y: number) {
			this.x = x;
			this.y = y;
			this.fireEvent('move', this, x, y);
		}

		leave() {
			this.fireEvent('leave', this);
		}

		drop(dropEffect: string) {
			this.fireEvent('drop', this, dropEffect, this.x, this.y);
		}

		release() {
			this.dataTransfer.releaseDragWatcher(this);
		}
	}

	export interface DragDataTransfer {
		getPosition(): Point;
		getData(): any;
		capture(element: Element, effect): DragWatcher;
		releaseDragWatcher(dragWatcher: DragWatcher): void;
	}

	export class DragEmuDataTransfer extends Core.Object implements DragDataTransfer {
		draggable: Element;
		image: HTMLElement;
		imageEffect: DragEffectIcon;
		catcher: HTMLElement;
		startX: number = 0;
		startY: number = 0;
		dropX: number = 0;
		dropY: number = 0;
		x: number = 0;
		y: number = 0;
		startImagePoint: Point;
		overElement: Element;
		hasStarted: boolean = false;
		dragDelta: Point;

		effectAllowed: any;
		watcher: PointerWatcher;
		pointer: Pointer;
		dropEffect: any;
		dropEffectIcon: any;
		private _data: any;
		timer: Core.DelayedTask;
		dropFailsTimer: Anim.Clock;
		delayed: boolean = false;

		dragWatcher: DragWatcher;

		constructor(draggable: Element, x: number, y: number, delayed: boolean, pointer: Pointer) {
			super();
			this.addEvents('start', 'end');

			this.dropEffect = [];
			this.effectAllowed = [];
			this.draggable = draggable;
			this.startX = x;
			this.startY = y;
			this.delayed = delayed;
			this.pointer = pointer;
			this.watcher = this.pointer.watch(App.current);

			this.dragDelta = this.draggable.pointFromWindow(new Point(this.startX, this.startY));

			this.connect(this.watcher, 'move', this.onPointerMove);
			this.connect(this.watcher, 'up', this.onPointerUp);
			this.connect(this.watcher, 'cancel', this.onPointerCancel);

			//console.log(`DragEmuDataTransfer delay? ${delayed}`);

			if (this.delayed)
				this.timer = new Core.DelayedTask(0.5, this.onTimer);
			//else
			//	this.onTimer();
		}

		setData(data): void {
			this._data = data;
		}

		getData(): any {
			return this._data;
		}

		hasData(): boolean {
			return this._data !== undefined;
		}

		getPosition(): Point {
			return new Point(this.x, this.y);
		}

		getDragDelta(): Point {
			return this.dragDelta;
		}

		protected generateImage(element): HTMLElement {
			let res; let key; let child; let i;

			if (('tagName' in element) && (element.tagName.toUpperCase() == 'IMG')) {
				res = element.cloneNode(false);
				res.oncontextmenu = function (e) { e.preventDefault(); };
			}
			else if (('tagName' in element) && (element.tagName.toUpperCase() == 'CANVAS')) {
				res = document.createElement('img');
				res.oncontextmenu = function (e) { e.preventDefault(); };
				// copy styles (position)
				for (key in element.style)
					res.style[key] = element.style[key];
				res.setAttribute('src', (element as HTMLCanvasElement).toDataURL('image/png'));
			}
			else if (!Core.Navigator.isFirefox && (element.toDataURL !== undefined)) {
				res = document.createElement('img');
				res.oncontextmenu = function (e) { e.preventDefault(); };
				// copy styles (position)
				for (key in element.style)
					res.style[key] = element.style[key];
				res.setAttribute('src', element.toDataURL('image/png'));
			}
			else {
				res = element.cloneNode(false);
				if ('style' in res) {
					res.style.webkitUserSelect = 'none';
					// to disable the magnifier in iOS WebApp mode
					res.style.webkitUserCallout = 'none';
				}
				for (i = 0; i < element.childNodes.length; i++) {
					child = element.childNodes[i];
					res.appendChild(this.generateImage(child));
				}
			}
			if ('setAttribute' in res)
				res.setAttribute('draggable', false);

			res.onselectstart = function (e) {
				e.preventDefault();
				return false;
			};
			return res;
		}

		protected onTimer() {
			this.timer = undefined;
	
			this.fireEvent('start', this);

			if (this.hasData()) {
				this.hasStarted = true;

				this.image = document.createElement('div');
				this.image.style.touchAction = 'none';
				this.image.style.zIndex = '100000';
				this.image.style.position = 'absolute';

				let generateImage = (el: Element): HTMLElement => {
					let image = this.generateImage(el.drawing);
					// remove possible matrix transform
					if ('removeProperty' in image.style)
						image.style.removeProperty('transform');
					if (Core.Navigator.isIE && ('removeProperty' in image.style))
						image.style.removeProperty('-ms-transform');
					else if (Core.Navigator.isGecko)
						image.style.removeProperty('-moz-transform');
					else if (Core.Navigator.isWebkit)
						image.style.removeProperty('-webkit-transform');
					else if (Core.Navigator.isOpera)
						image.style.removeProperty('-o-transform');
					image.style.left = '0px';
					image.style.top = '0px';
					return image;
				};

				if (this._data instanceof Selection) {
					let sel = this._data as Selection;
					let els = sel.elements;
					for (let i = Math.max(0, els.length - 6); i < els.length; i++) {
						let invPos = els.length - (i + 1);
						let op = 0.1;
						if (invPos == 0)
							op = 1;
						else if (invPos == 1)
							op = 0.95;
						else if (invPos == 2)
							op = 0.7;	
						else if (invPos == 3)
							op = 0.5;
						else if (invPos == 4)
							op = 0.2;
						let image = generateImage(els[i]);
						image.style.left = `${invPos * 5}px`;
						image.style.top = `${invPos * 5}px`;
						image.style.opacity = op.toString();
						this.image.appendChild(image);
					}
				}
				else {
					let image = generateImage(this.draggable);
					this.image.appendChild(image);
				}	
			
				if (Core.Navigator.supportOpacity)
					this.image.style.opacity = '0.8';

				let ofs = this.delayed ? -10 : 0;

				this.startImagePoint = this.draggable.pointToWindow(new Point());

				this.image.style.left = (this.startImagePoint.x + ofs) + 'px';
				this.image.style.top = (this.startImagePoint.y + ofs) + 'px';

				// avoid IFrame problems for mouse
				if (this.watcher.pointer.getType() === 'mouse') {
					this.catcher = document.createElement('div');
					this.catcher.style.position = 'absolute';
					this.catcher.style.left = '0px';
					this.catcher.style.right = '0px';
					this.catcher.style.top = '0px';
					this.catcher.style.bottom = '0px';
					this.catcher.style.zIndex = '1000';
					document.body.appendChild(this.catcher);
				}

				document.body.appendChild(this.image);

				this.watcher.capture();
			}
			else {
				this.watcher.cancel();
			}
		}

		capture(element: Element, effect): DragWatcher {

			if ((this.dragWatcher !== undefined) && (this.dragWatcher.getElement() === element))
				throw ('Drag already captured by the given element');

			if (this.dragWatcher !== undefined)
				this.dragWatcher.leave();

			this.dragWatcher = new DragWatcher(element, this);
			this.dragWatcher.setEffectAllowed(effect);
			return this.dragWatcher;
		}

		releaseDragWatcher(dragWatcher: DragWatcher) {
			if (this.dragWatcher === dragWatcher) {
				this.dragWatcher.leave();
				this.dragWatcher = undefined;
			}
		}
	
		protected onPointerMove(watcher: PointerWatcher) {
			let deltaX; let deltaY; let delta; let dragEvent; let ofs;

			//console.log('onPointerMove isMove: ' + watcher.pointer.getIsMove());

			if (watcher.getIsCaptured()) {
				let clientX = watcher.pointer.getX();
				let clientY = watcher.pointer.getY();

				this.x = clientX;
				this.y = clientY;

				document.body.removeChild(this.image);
				if (this.catcher !== undefined)
					document.body.removeChild(this.catcher);

				let overElement = App.current.elementFromPoint(new Point(clientX, clientY));

				if (this.catcher !== undefined)
					document.body.appendChild(this.catcher);
				document.body.appendChild(this.image);

				deltaX = clientX - this.startX;
				deltaY = clientY - this.startY;
				ofs = this.delayed ? -10 : 0;

				this.image.style.left = (this.startImagePoint.x + deltaX + ofs) + 'px';
				this.image.style.top = (this.startImagePoint.y + deltaY + ofs) + 'px';

				if (overElement != undefined) {
					let oldDropEffectIcon = this.dropEffectIcon;
					//this.dropEffect = 'none';
					let dragEvent = new DragEvent();
					dragEvent.setType('dragover');
					dragEvent.clientX = clientX;
					dragEvent.clientY = clientY;
					dragEvent.dataTransfer = this;
					
					let effectAllowed = [];
					dragEvent.dispatchEvent(overElement);
					if (this.dragWatcher !== undefined)
						effectAllowed = this.dragWatcher.getEffectAllowed();

					if ((this.dragWatcher !== undefined) && !overElement.getIsChildOf(this.dragWatcher.getElement())) {
						this.dragWatcher.leave();
						this.dragWatcher = undefined;
					}

					if (this.dragWatcher !== undefined)
						this.dragWatcher.move(clientX, clientY);					
					
					this.dropEffect = DragEmuDataTransfer.getMatchingDropEffect(this.effectAllowed, effectAllowed,
						watcher.pointer.getType(), watcher.pointer.getCtrlKey(), watcher.pointer.getAltKey(),
						watcher.pointer.getShiftKey());	

					if (this.dropEffect.length > 1)
						this.dropEffectIcon = 'dragchoose';
					else if (this.dropEffect.length > 0)
						this.dropEffectIcon = this.dropEffect[0].dragicon;
					else
						this.dropEffectIcon = undefined;
					
					// handle the drop effect icon feedback
					if (this.dropEffectIcon !== oldDropEffectIcon) {
						if (this.imageEffect !== undefined) {
							this.imageEffect.isLoaded = false;
							this.image.removeChild(this.imageEffect.drawing);
							this.imageEffect = undefined;
						}
						if (this.dropEffectIcon !== undefined) {
							this.imageEffect = new DragEffectIcon();
							this.imageEffect.icon = this.dropEffectIcon;
							this.imageEffect.parent = App.current;
							this.imageEffect.isLoaded = true;
							this.imageEffect.parentVisible = true;
							this.imageEffect.setParentDisabled(false);

							let size = this.imageEffect.measure(0, 0);
							this.imageEffect.arrange(
								-size.width + (this.startX - this.startImagePoint.x - ofs),
								-size.height + (this.startY - this.startImagePoint.y - ofs), size.width, size.height);
							this.image.appendChild(this.imageEffect.drawing);
						}
					}
					this.overElement = overElement;
				}
				else
					this.overElement = undefined;

			}
			else {
				//	this.onTimer();

				if (watcher.pointer.getIsMove()) {
					if (this.delayed)
						watcher.cancel();
					else
						this.onTimer();	
				}
			}
		}

		protected onPointerUp(watcher: PointerWatcher) {
			//console.log('onPointerUp isCaptured: ' + watcher.getIsCaptured());
			this.disconnect(this.watcher, 'move', this.onPointerMove);
			this.disconnect(this.watcher, 'up', this.onPointerUp);
			this.disconnect(this.watcher, 'cancel', this.onPointerCancel);

			if (!watcher.getIsCaptured())
				watcher.cancel();
			else {
				// a dragWatcher is present, drop is possible
				if (this.dragWatcher !== undefined) {
					this.removeImage();
					this.dragWatcher.leave();
					// TODO handle the choice if needed
					if (this.dropEffect.length === 1)
						this.dragWatcher.drop(this.dropEffect[0].action);
					else if (this.dropEffect.length > 1) {
						// TODO
						let popup = new Popup();
						let vbox = new VBox();
						popup.content = vbox;
						for (let i = 0; i < this.dropEffect.length; i++) {
							let button = new Button();
							button.text = this.dropEffect[i].text;
							button['Ui.DragEvent.dropEffect'] = this.dropEffect[i];
							this.connect(button, 'press', function (b) {
								this.dragWatcher.drop(b['Ui.DragEvent.dropEffect'].action);
								popup.close();
							});
							vbox.append(button);
						}

						popup.openAt(this.x, this.y);
						//this.dragWatcher.drop(this.dropEffect);
					}
					//this.dragWatcher = undefined;
				}
				else {
					// start an animation to return the dragged element to its origin
					this.dropX = watcher.pointer.getX();
					this.dropY = watcher.pointer.getY();
					this.dropFailsTimer = new Anim.Clock({
						duration: 0.25, ease: new Anim.PowerEase({ mode: 'out' })
					});
					this.connect(this.dropFailsTimer, 'timeupdate', this.onDropFailsTimerUpdate);
					this.dropFailsTimer.begin();
				}
				this.fireEvent('end', this);
			}
		}

		protected onPointerCancel(watcher: PointerWatcher) {
			//console.log('onPointerCancel');
			if (this.timer !== undefined) {
				this.timer.abort();
				this.timer = undefined;
			}
		}

		protected removeImage() {
			document.body.removeChild(this.image);
			if (this.catcher !== undefined) {
				document.body.removeChild(this.catcher);
				this.catcher = undefined;
			}
		}

		protected onDropFailsTimerUpdate(clock, progress) {
			if (progress >= 1)
				this.removeImage();
			else {
				let deltaX = (this.dropX - this.startX) * (1 - progress);
				let deltaY = (this.dropY - this.startY) * (1 - progress);

				this.image.style.left = (this.startImagePoint.x + deltaX) + 'px';
				this.image.style.top = (this.startImagePoint.y + deltaY) + 'px';
			}
		}
		
		static getMergedEffectAllowed(effectAllowed1, effectAllowed2) {
			if ((effectAllowed1 === undefined) || (effectAllowed1 === 'all'))
				return effectAllowed2;
			else {
				let effectAllowed = [];

				for (let i = 0; i < effectAllowed1.length; i++) {
					for (let i2 = 0; i2 < effectAllowed2.length; i2++) {
						if (effectAllowed1[i] === effectAllowed2[i2].action)
							effectAllowed.push(effectAllowed2[i2]);
					}
				}
				return effectAllowed;
			}
		}

		static getMatchingDropEffect(srcEffectAllowed, dstEffectAllowed, pointerType, ctrlKey, altKey, shiftKey) {
			// filter with what the source support
			let effectAllowed = DragEmuDataTransfer.getMergedEffectAllowed(srcEffectAllowed, dstEffectAllowed);
			let dropEffect = effectAllowed;

			if (effectAllowed.length > 1) {
				// if the mouse is used let the choice using de keyboard controls
				if (pointerType === 'mouse') {
					if (!altKey) {
						// find the secondary choice if any
						if (ctrlKey) {
							for (let i = 0; i < effectAllowed.length; i++) {
								if (effectAllowed[i].secondary === true)
									dropEffect = [effectAllowed[i]];
							}
							// else if possible take the second 
							if ((dropEffect === effectAllowed) && (effectAllowed.length > 1))
								dropEffect = [effectAllowed[1]];
						}
						// else find the primary
						else {
							for (let i = 0; i < effectAllowed.length; i++) {
								if (effectAllowed[i].primary === true)
									dropEffect = [effectAllowed[i]];
							}
							// else find take the first one
							if (dropEffect === effectAllowed)
								dropEffect = [effectAllowed[0]];
						}
					}
				}
			}
			return dropEffect;
		}
	}

	export class DragNativeDataTransfer extends Core.Object implements DragDataTransfer {
		dataTransfer: any = undefined;
		dragWatcher: DragWatcher = undefined;
		nativeData: any = undefined;
		dropEffect: any = 'none';
		position: Point = undefined;

		constructor() {
			super();
			this.nativeData = new DragNativeData(this);
		}

		getPosition(): Point {
			return this.position;
		}

		setPosition(position: Point) {
			this.position = position;
		}

		getData() {
			return this.nativeData;
		}

		setDataTransfer(dataTransfer) {
			this.dataTransfer = dataTransfer;
		}

		capture(element: Element, effect) {
			if ((this.dragWatcher !== undefined) && (this.dragWatcher.getElement() === element))
				throw ('Drag already captured by the given element');

			if (this.dragWatcher !== undefined)
				this.dragWatcher.leave();

			this.dragWatcher = new DragWatcher(element, this);
			this.dragWatcher.setEffectAllowed(effect);
			return this.dragWatcher;
		}

		releaseDragWatcher(dragWatcher: DragWatcher) {
			if (this.dragWatcher === dragWatcher) {
				this.dragWatcher.leave();
				this.dragWatcher = undefined;
			}
		}
	}

	export class DragNativeManager extends Core.Object {
		app: App;
		dataTransfer: DragNativeDataTransfer;
		nativeTarget: any = undefined;

		constructor(app: App) {
			super();
			this.app = app;
			this.dataTransfer = new DragNativeDataTransfer();

			this.connect(this.app.drawing, 'dragover', this.onDragOver);
			this.connect(this.app.drawing, 'dragenter', this.onDragEnter);
			this.connect(this.app.drawing, 'dragleave', this.onDragLeave);
			this.connect(this.app.drawing, 'drop', this.onDrop);
		}

		protected onDragOver(event) {
			this.dataTransfer.setDataTransfer(event.dataTransfer);
			let point = new Point(event.clientX, event.clientY);
			this.dataTransfer.setPosition(point);

			let overElement = this.app.elementFromPoint(point);

			if (overElement !== undefined) {
				let dragEvent = new DragEvent();
				dragEvent.setType('dragover');
				dragEvent.clientX = event.clientX;
				dragEvent.clientY = event.clientY;
				dragEvent.dataTransfer = this.dataTransfer;
				
				dragEvent.dispatchEvent(overElement);

				if ((this.dataTransfer.dragWatcher !== undefined) &&
					!overElement.getIsChildOf(this.dataTransfer.dragWatcher.getElement())) {
					this.dataTransfer.dragWatcher.leave();
					this.dataTransfer.dragWatcher = undefined;
				}
			}

			if (this.dataTransfer.dragWatcher !== undefined) {
				let dropEffect = DragEmuDataTransfer.getMergedEffectAllowed(
					this.nativeToCustom(event.dataTransfer.effectAllowed), this.dataTransfer.dragWatcher.effectAllowed);
				this.dataTransfer.dragWatcher.move(event.clientX, event.clientY);
				event.dataTransfer.dropEffect = this.customToNative(dropEffect);
			}
			else
				event.dataTransfer.dropEffect = 'none';
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		}

		protected onDragEnter(e) {
			this.nativeTarget = e.target;
		}

		protected onDragLeave(e) {
			if (this.nativeTarget !== e.target)
				return;
			this.nativeTarget = undefined;
			
			if (this.dataTransfer.dragWatcher !== undefined) {
				this.dataTransfer.dragWatcher.leave();
				this.dataTransfer.dragWatcher = undefined;
			}
		}

		protected onDrop(event) {
			this.dataTransfer.setDataTransfer(event.dataTransfer);
			if (this.dataTransfer.dragWatcher !== undefined) {
				this.dataTransfer.dragWatcher.leave();
				let dropEffect = DragEmuDataTransfer.getMergedEffectAllowed(
					this.nativeToCustom(event.dataTransfer.effectAllowed), this.dataTransfer.dragWatcher.effectAllowed);
				event.dataTransfer.dropEffect = this.customToNative(dropEffect);
				if (dropEffect.length > 0)
					this.dataTransfer.dragWatcher.drop(dropEffect[0].action);
				this.dataTransfer.dragWatcher = undefined;
			}
			event.stopImmediatePropagation();
			event.preventDefault();
		}

		nativeToCustom(effectAllowed: string): string[] {
			if (effectAllowed === 'copy')
				return ['copy'];
			else if (effectAllowed === 'link')
				return ['link'];
			else if (effectAllowed === 'move')
				return ['move'];
			else if (effectAllowed === 'copyLink')
				return ['copy', 'link'];
			else if (effectAllowed === 'copyMove')
				return ['move', 'copy'];
			else if (effectAllowed === 'linkMove')
				return ['move', 'link'];
			else if (effectAllowed === 'all')
				return ['move', 'copy', 'link'];
		}

		customToNative(effectAllowed): string {
			let containsLink = false;
			let containsCopy = false;
			let containsMove = false;
			for (let i = 0; i < effectAllowed.length; i++) {
				if (effectAllowed[i].action === 'link')
					containsLink = true;
				else if (effectAllowed[i].action === 'move')
					containsMove = true;
				else if (effectAllowed[i].action === 'copy')
					containsCopy = true;
			}
			if (containsLink && containsCopy && containsMove)
				return 'all';
			else if (containsLink && containsCopy)
				return 'copyLink';
			else if (containsLink && containsMove)
				return 'linkMove';
			else if (containsMove && containsCopy)
				return 'copyMove';
			else if (containsLink)
				return 'link';
			else if (containsMove)
				return 'move';
			else if (containsCopy)
				return 'copy';
			else
				return 'none';
		}
	}
}
