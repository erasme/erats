namespace Ui
{
	export interface PopupInit extends ContainerInit {
		preferredWidth: number;
		preferredHeight: number;
		autoClose: boolean;
	}

	export type AttachBorder = 'right' | 'left' | 'top' | 'bottom' | 'center';

	export class Popup extends Container implements PopupInit
	{
		popupSelection: Selection;
		background: PopupBackground;
		shadow: Pressable;
		shadowGraphic: Rectangle;
		contextBox: ContextBar;
		contentBox: LBox;
		scroll: ScrollingArea;
		posX: number = undefined;
		posY: number = undefined;
		attachedElement: Element = undefined;
		attachedBorder: AttachBorder = undefined;
		private _autoClose: boolean = true;
		private _preferredWidth: number = undefined;
		private _preferredHeight: number = undefined;
		openClock: Anim.Clock = undefined;
		isClosed: boolean = true;

		constructor(init?: Partial<PopupInit>) {
			super();
			this.addEvents('close');

			this.horizontalAlign = 'stretch';
			this.verticalAlign = 'stretch';

			this.popupSelection = new Selection();

			this.shadow = new Pressable();
			this.shadow.focusable = false;
			this.shadow.drawing.style.cursor = 'inherit';
			this.appendChild(this.shadow);

			this.shadowGraphic = new Rectangle();
			this.shadow.content = this.shadowGraphic;

			this.background = new PopupBackground();
			this.background.radius = 0;
			this.background.fill = '#f8f8f8';
			this.background.setTransformOrigin(0, 0);
			this.appendChild(this.background);

			this.contentBox = new LBox();
			this.contentBox.margin = 2;
			this.contentBox.setTransformOrigin(0, 0);
			this.appendChild(this.contentBox);

			this.scroll = new ScrollingArea();
			this.contentBox.append(this.scroll);

			this.contextBox = new ContextBar();
			this.contextBox.selection = this.popupSelection;
			this.contextBox.verticalAlign = 'top';
			this.contextBox.hide(true);
			this.contentBox.append(this.contextBox);

			this.connect(this.popupSelection, 'change', this.onPopupSelectionChange);

			// handle auto hide
			this.connect(this.shadow, 'press', this.onShadowPress);

			if (init)
				this.assign(init);
		}

		set preferredWidth(width: number) {
			this._preferredWidth = width;
			this.invalidateMeasure();
		}

		set preferredHeight(height: number) {
			this._preferredHeight = height;
			this.invalidateMeasure();
		}

		// implement a selection handler for Selectionable elements
		getSelectionHandler() {
			return this.popupSelection;
		}

		set autoClose(autoClose: boolean) {
			this._autoClose = autoClose;
		}

		get content(): Element {
			return this.scroll.content;
		}

		set content(content: Element) {
			this.scroll.content = content;
		}

		protected onWindowResize() {
//			if (this._autoClose && (this.posX !== undefined))
//				this.close();
		}

		protected onShadowPress() {
			if (this._autoClose)
				this.close();
		}

		protected onOpenTick(clock, progress, delta) {
			let end = (progress >= 1);

			if (this.isClosed)
				progress = 1 - progress;
		
			this.opacity = progress;

			let arrowBorder = this.background.arrowBorder;
			let arrowOffset = this.background.arrowOffset;

			if (arrowBorder === 'right') {
				this.background.transform = Matrix.createTranslate(20 * (1 - progress), 0);
				this.contentBox.transform = Matrix.createTranslate(20 * (1 - progress), 0);
			}
			else if (arrowBorder === 'left') {
				this.background.transform = Matrix.createTranslate(-20 * (1 - progress), 0);
				this.contentBox.transform = Matrix.createTranslate(-20 * (1 - progress), 0);
			}
			else if ((arrowBorder === 'top') || (arrowBorder === 'none')) {
				this.background.transform = Matrix.createTranslate(0, -20 * (1 - progress));
				this.contentBox.transform = Matrix.createTranslate(0, -20 * (1 - progress));
			}
			else if (arrowBorder === 'bottom') {
				this.background.transform = Matrix.createTranslate(0, 20 * (1 - progress));
				this.contentBox.transform = Matrix.createTranslate(0, 20 * (1 - progress));
			}

			if (end) {
				this.openClock.stop();
				this.openClock = undefined;
				if (this.isClosed) {
					App.current.removeDialog(this);
					this.enable();
				}
			}
		}

		protected onPopupSelectionChange(selection: Selection) {
			if (selection.elements.length === 0)
				this.contextBox.hide(true);
			else
				this.contextBox.show();
		}

		protected onStyleChange() {
			this.background.fill = this.getStyleProperty('background');
			this.shadowGraphic.fill = this.getStyleProperty('shadow');
		}

		protected onChildInvalidateMeasure(child: Element, type) {
			// Popup is a layout root and can handle layout (measure/arrange) for its children
			this.invalidateLayout();
		}

		protected onChildInvalidateArrange(child: Element) {
			// Popup is a layout root and can handle layout (measure/arrange) for its children
			this.invalidateLayout();
		}

		open() {
			this.openPosOrElement();
		}

		openAt(posX: number, posY: number) {
			this.openPosOrElement(posX, posY);
		}

		openElement(element: Element, position?: AttachBorder) {
			this.openPosOrElement(element, position);
		}

		private openPosOrElement(posX?, posY?) {
			if (this.isClosed) {
				App.current.appendDialog(this);
				this.isClosed = false;

				this.attachedElement = undefined;
				this.posX = undefined;
				this.posY = undefined;

				if ((typeof (posX) == 'object') && (posX instanceof Element)) {
					this.attachedElement = posX as Element;
					if ((posY !== undefined) && (typeof (posY) === 'string'))
						this.attachedBorder = posY as AttachBorder;
					let point = this.attachedElement.pointToWindow(
						new Point(this.attachedElement.layoutWidth, this.attachedElement.layoutHeight / 2));
					this.posX = point.x;
					this.posY = point.y;
				}
				else if ((posX !== undefined) && (posY !== undefined)) {
					this.posX = posX;
					this.posY = posY;
				}
				else {
					this.posX = undefined;
					this.posY = undefined;
				}
				if (this.openClock === undefined) {
					this.openClock = new Anim.Clock({
						duration: 1, target: this, speed: 5,
						ease: new Anim.PowerEase({ mode: 'out' })
					});
					this.connect(this.openClock, 'timeupdate', this.onOpenTick);
					// set the initial state
					this.opacity = 0;
					// the start of the animation is delayed to the next arrange
				}

				this.invalidateArrange();
				this.connect(window, 'resize', this.onWindowResize);
			}
		}

		close() {
			if (!this.isClosed) {
				this.isClosed = true;

				this.fireEvent('close', this);

				//App.current.removeDialog(this);
				this.disconnect(window, 'resize', this.onWindowResize);

				this.disable();
				if (this.openClock === undefined) {
					this.openClock = new Anim.Clock({
						duration: 1, target: this, speed: 5,
						ease: new Anim.PowerEase({ mode: 'out' })
					});
					this.connect(this.openClock, 'timeupdate', this.onOpenTick);
					this.openClock.begin();
				}
			}
		}

		protected measureCore(width: number, height: number) {
			let constraintWidth = Math.max(width - 40, 0);
			let constraintHeight = Math.max(height - 40, 0);

			//console.log(`Popup.measureCore(${width},${height})`);

			if ((this._preferredWidth !== undefined) && (this._preferredWidth < constraintWidth))
				constraintWidth = this._preferredWidth;
			if ((this._preferredHeight !== undefined) && (this._preferredHeight < constraintHeight))
				constraintHeight = this._preferredHeight;
		
			this.background.measure(constraintWidth, constraintHeight);
			let size = this.contentBox.measure(constraintWidth, constraintHeight);

			//console.log('contentBox = '+size.width+' x '+size.height);

			if ((this.posX !== undefined) || (this.attachedElement !== undefined))
				return { width: Math.max(50, size.width), height: Math.max(50, size.height) };
			else
				return { width: Math.max(width, size.width + 40), height: Math.max(height, size.height + 40) };
		}

		protected arrangeCore(width: number, height: number) {
			//console.log(`Popup.arrangeCore(${width},${height})`);

			// the delayed open animation
			if ((this.openClock !== undefined) && !this.openClock.isActive)
				this.openClock.begin();

			let x = 0; let y = 0; let point; let borders; let border; let i;

			//console.log(this+'.arrangeCore('+width+','+height+')');

			this.shadow.arrange(0, 0, width, height);

			// handle open center screen
			if (((this.posX === undefined) && (this.attachedElement === undefined)) || (width < 150) || (height < 150)) {
				this.setCenter(width, height);
			}
			// handle open at an element
			else if (this.attachedElement !== undefined) {
				borders = ['right', 'left', 'top', 'bottom', 'center'];
				if (this.attachedBorder !== undefined)
					borders.unshift(this.attachedBorder);
				for (i = 0; i < borders.length; i++) {
					border = borders[i];
					if (border === 'left') {
						point = this.attachedElement.pointToWindow(
							new Point(0, this.attachedElement.layoutHeight / 2));
						if (this.contentBox.measureWidth + 10 < point.x) {
							this.setLeft(point.x, point.y, width, height);
							break;
						}
					}
					else if (border === 'right') {
						point = this.attachedElement.pointToWindow(
							new Point(this.attachedElement.layoutWidth, this.attachedElement.layoutHeight / 2));
						if (this.contentBox.measureWidth + point.x + 10 < width) {
							this.setRight(point.x, point.y, width, height);
							break;
						}
					}
					else if (border === 'top') {
						point = this.attachedElement.pointToWindow(
							new Point(this.attachedElement.layoutWidth / 2, 0));
						if (this.contentBox.measureHeight + 10 < point.y) {
							this.setTop(point.x, point.y, width, height);
							break;
						}
					}
					else if (border === 'bottom') {
						point = this.attachedElement.pointToWindow(
							new Point(this.attachedElement.layoutWidth / 2, this.attachedElement.layoutHeight));
						if (this.contentBox.measureHeight + 10 + point.y < height) {
							this.setBottom(point.x, point.y, width, height);
							break;
						}
					}
					else {
						this.setCenter(width, height);
						break;
					}
				}
			}
			// handle open at a position
			else {
				borders = ['right', 'left', 'top', 'bottom', 'center'];
				if (this.attachedBorder !== undefined)
					borders.unshift(this.attachedBorder);
				for (i = 0; i < borders.length; i++) {
					border = borders[i];
					if (border === 'left') {
						if (this.contentBox.measureWidth + 10 < this.posX) {
							this.setLeft(this.posX, this.posY, width, height);
							break;
						}
					}
					else if (border === 'right') {
						if (this.contentBox.measureWidth + this.posX + 10 < width) {
							this.setRight(this.posX, this.posY, width, height);
							break;
						}
					}
					else if (border === 'top') {
						if (this.contentBox.measureHeight + 10 < this.posY) {
							this.setTop(this.posX, this.posY, width, height);
							break;
						}
					}
					else if (border === 'bottom') {
						if (this.contentBox.measureHeight + 10 + this.posY < height) {
							this.setBottom(this.posX, this.posY, width, height);
							break;
						}
					}
					else {
						this.setCenter(width, height);
						break;
					}
				}
			}
		}

		setRight(x, y, width, height) {
			let px = x + 10;
			let py = y - 30;

			this.background.arrowBorder = 'left';

			if (py + this.contentBox.measureHeight > height) {
				py = height - this.contentBox.measureHeight;

				let offset = y - py;
				if (offset > this.contentBox.measureHeight - 18)
					offset = this.contentBox.measureHeight - 18;
				this.background.arrowOffset = offset;
			}
			else
				this.background.arrowOffset = 30;
			this.background.arrange(px - 10, py, this.contentBox.measureWidth + 10, this.contentBox.measureHeight);
			this.contentBox.arrange(px, py, this.contentBox.measureWidth, this.contentBox.measureHeight);
		}

		setLeft(x, y, width, height) {
			let px = x - (10 + this.contentBox.measureWidth);
			let py = y - 30;

			this.background.arrowBorder = 'right';

			if (py + this.contentBox.measureHeight > height) {
				py = height - this.contentBox.measureHeight;

				let offset = y - py;
				if (offset > this.contentBox.measureHeight - 18)
					offset = this.contentBox.measureHeight - 18;
				this.background.arrowOffset = offset;
			}
			else
				this.background.arrowOffset = 30;
			this.background.arrange(px, py, this.contentBox.measureWidth + 10, this.contentBox.measureHeight);
			this.contentBox.arrange(px, py, this.contentBox.measureWidth, this.contentBox.measureHeight);
		}

		setTop(x, y, width, height) {
			let py = y - (this.contentBox.measureHeight);
			let px = x - 30;

			this.background.arrowBorder = 'bottom';

			if (px + this.contentBox.measureWidth > width) {
				px = width - this.contentBox.measureWidth;

				let offset = x - px;
				if (offset > this.contentBox.measureWidth - 18)
					offset = this.contentBox.measureWidth - 18;
				this.background.arrowOffset = offset;
			}
			else if (px < 2) {
				this.background.arrowOffset = x + 2;
				px = 2;
			}
			else
				this.background.arrowOffset = 30;
			this.background.arrange(px, py - 10, this.contentBox.measureWidth, this.contentBox.measureHeight + 10);
			this.contentBox.arrange(px, py - 10, this.contentBox.measureWidth, this.contentBox.measureHeight);
		}

		setBottom(x, y, width, height) {
			let py = y + 10;
			let px = x - 30;

			this.background.arrowBorder = 'top';

			if (px + this.contentBox.measureWidth > width) {
				px = width - this.contentBox.measureWidth;

				let offset = x - px;
				if (offset > this.contentBox.measureWidth - 18)
					offset = this.contentBox.measureWidth - 18;
				this.background.arrowOffset = offset;
			}
			else if (px < 2) {
				this.background.arrowOffset = x + 2;
				px = 2;
			}
			else
				this.background.arrowOffset = 30;
			this.background.arrange(px, py - 10, this.contentBox.measureWidth, this.contentBox.measureHeight + 10);
			this.contentBox.arrange(px, py, this.contentBox.measureWidth, this.contentBox.measureHeight);
		}

		setCenter(width, height) {
			this.background.arrowBorder = 'none';

			let x = (width - this.contentBox.measureWidth) / 2;
			let y = (height - this.contentBox.measureHeight) / 2;
			this.background.arrange(x, y, this.contentBox.measureWidth, this.contentBox.measureHeight);
			this.contentBox.arrange(x, y, this.contentBox.measureWidth, this.contentBox.measureHeight);
		}

		static style: any = {
			background: '#f8f8f8',
			shadow: 'rgba(0,0,0,0.15)'
		}
	}

	export class PopupBackground extends CanvasElement
	{
		private _radius: number = 8;
		private _fill: Color;
		private _arrowBorder: 'left'|'right'|'top'|'bottom'|'none' = 'left';
		private _arrowOffset: number = 30;
		private readonly arrowSize: number = 10;

		constructor() {
			super();
			this.fill = 'black';
		}

		get arrowBorder(): 'left'|'right'|'top'|'bottom'|'none' {
			return this._arrowBorder;
		}

		set arrowBorder(arrowBorder: 'left'|'right'|'top'|'bottom'|'none') {
			if (this._arrowBorder != arrowBorder) {
				this._arrowBorder = arrowBorder;
				this.invalidateArrange();
			}
		}

		get arrowOffset(): number {
			return this._arrowOffset;
		}

		set arrowOffset(offset: number) {
			if (this._arrowOffset != offset) {
				this._arrowOffset = offset;
				this.invalidateArrange();
			}
		}

		set radius(radius: number) {
			if (this._radius != radius) {
				this._radius = radius;
				this.invalidateArrange();
			}
		}

		set fill(fill: Color | string) {
			if (this._fill != fill) {
				this._fill = Color.create(fill);
				this.invalidateDraw();
			}
		}

		private genPath(width, height, radius, arrowBorder, arrowSize, arrowOffset) {
			let v1; let v2;
			if (arrowBorder == 'none') {
				v1 = width - radius;
				v2 = height - radius;
				return 'M' + radius + ',0 L' + v1 + ',0 Q' + width + ',0 ' + width + ',' + radius + ' L' + width + ',' + v2 + ' Q' + width + ',' + height + ' ' + v1 + ',' + height + ' L' + radius + ',' + height + ' Q0,' + height + ' 0,' + v2 + ' L0,' + radius + ' Q0,0 ' + radius + ',0 z';
			}
			else if (arrowBorder == 'left') {
				v1 = width - this._radius;
				v2 = height - this._radius;
				return 'M' + (radius + arrowSize) + ',0 L' + v1 + ',0 Q' + width + ',0 ' + width + ',' + radius + ' L' + width + ',' + v2 + ' Q' + width + ',' + height + ' ' + v1 + ',' + height + ' L' + (radius + arrowSize) + ',' + height + ' Q' + arrowSize + ',' + height + ' ' + arrowSize + ',' + v2 + ' L' + arrowSize + ',' + (arrowOffset + arrowSize) + ' L0,' + arrowOffset + ' L' + arrowSize + ',' + (arrowOffset - arrowSize) + ' L' + arrowSize + ',' + radius + ' Q' + arrowSize + ',0 ' + (radius + arrowSize) + ',0 z';
			}
			else if (arrowBorder == 'right') {
				v1 = width - (this._radius + arrowSize);
				v2 = height - this._radius;
				return 'M' + radius + ',0 L' + v1 + ',0 Q' + (width - arrowSize) + ',0 ' + (width - arrowSize) + ',' + radius + ' L' + (width - arrowSize) + ',' + (arrowOffset - arrowSize) + ' L' + width + ',' + arrowOffset + ' L' + (width - arrowSize) + ',' + (arrowOffset + arrowSize) + ' L ' + (width - arrowSize) + ',' + v2 + ' Q' + (width - arrowSize) + ',' + height + ' ' + v1 + ',' + height + ' L' + radius + ',' + height + ' Q0,' + height + ' 0,' + v2 + ' L0,' + radius + ' Q0,0 ' + radius + ',0 z';
			}
			else if (arrowBorder == 'top') {
				v1 = width - this._radius;
				v2 = height - this._radius;
				return 'M' + radius + ',' + arrowSize + ' L' + (arrowOffset - arrowSize) + ',' + arrowSize + ' L' + arrowOffset + ',0 L' + (arrowOffset + arrowSize) + ',' + arrowSize + ' L' + v1 + ',' + arrowSize + ' Q' + width + ',' + arrowSize + ' ' + width + ',' + (arrowSize + radius) + ' L' + width + ',' + v2 + ' Q' + width + ',' + height + ' ' + v1 + ',' + height + ' L' + radius + ',' + height + ' Q0,' + height + ' 0,' + v2 + ' L0,' + (arrowSize + radius) + ' Q0,' + arrowSize + ' ' + radius + ',' + arrowSize + ' z';
			}
			else if (arrowBorder == 'bottom') {
				v1 = width - this._radius;
				v2 = height - (this._radius + arrowSize);
				return 'M' + radius + ',0 L' + v1 + ',0 Q' + width + ',0 ' + width + ',' + radius + ' L' + width + ',' + v2 + ' Q' + width + ',' + (height - arrowSize) + ' ' + v1 + ',' + (height - arrowSize) + ' L ' + (arrowOffset + arrowSize) + ',' + (height - arrowSize) + ' L' + arrowOffset + ',' + height + ' L' + (arrowOffset - arrowSize) + ',' + (height - arrowSize) + ' L' + radius + ',' + (height - arrowSize) + ' Q0,' + (height - arrowSize) + ' 0,' + v2 + ' L0,' + radius + ' Q0,0 ' + radius + ',0 z';
			}
		}

		updateCanvas(ctx) {
			let width = this.layoutWidth;
			let height = this.layoutHeight;
		
			if (this.arrowBorder == 'none') {
				ctx.fillStyle = 'rgba(0,0,0,0.1)';
				ctx.fillRect(0, 0, width, height);
				ctx.fillStyle = 'rgba(0,0,0,0.5)';
				ctx.fillRect(1, 1, width - 2, height - 2);
				ctx.fillStyle = this._fill.getCssRgba();
				ctx.fillRect(2, 2, width - 4, height - 4);
			}
			else {
				ctx.fillStyle = 'rgba(0,0,0,0.1)';
				ctx.svgPath(this.genPath(width, height, this._radius, this.arrowBorder, this.arrowSize, this._arrowOffset));
				ctx.fill();
				ctx.save();
				ctx.fillStyle = 'rgba(0,0,0,0.5)';
				ctx.translate(1, 1);
				ctx.svgPath(this.genPath(width - 2, height - 2, this._radius - 1, this.arrowBorder, this.arrowSize - 1, this._arrowOffset - 1));
				ctx.fill();
				ctx.restore();
				ctx.fillStyle = this._fill.getCssRgba();
				ctx.translate(2, 2);
				ctx.svgPath(this.genPath(width - 4, height - 4, this._radius - 2, this.arrowBorder, this.arrowSize - 1, this._arrowOffset - 2));
				ctx.fill();
			}
		}
	}

	export interface MenuPopupInit extends PopupInit {
	}

	export class MenuPopup extends Popup implements MenuPopupInit
	{
		constructor(init?: Partial<MenuPopupInit>) {
			super();
			if (init)
				this.assign(init);
		}
	}

	export class MenuPopupSeparator extends Separator
	{
		constructor() {
			super();
		}
	}
}

