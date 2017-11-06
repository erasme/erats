namespace Ui
{
	export interface DropEffect {
		action: string;
		text?: string;
		dragicon?: string;
		primary?: boolean;
		secondary?: boolean;
	}

	export type DropEffectFunc = (data: any, dataTransfer: DragDataTransfer) => DropEffect[];

	export interface DropBoxInit extends LBoxInit {
	}

	export class DropBox extends LBox {
		watchers: DragWatcher[] = undefined;
		allowedTypes: { type: string | Function, effect: DropEffect[] | DropEffectFunc }[] = undefined;

		constructor(init?: Partial<DropBoxInit>) {
			super(init);
			this.addEvents('drageffect', 'dragenter', 'dragleave', 'drop', 'dropfile');
			this.watchers = [];
			this.connect(this, 'dragover', this.onDragOver);
		}

		addType(type: string | Function, effects: string | string[] | DropEffect[] | DropEffectFunc) {
			if (typeof (type) === 'string')
				type = type.toLowerCase();
			if (this.allowedTypes == undefined)
				this.allowedTypes = [];
			if (typeof (effects) === 'string')
				effects = [effects];
			if (typeof (effects) !== 'function') {
				for (let i = 0; i < effects.length; i++) {
					let effect = effects[i];
					if (typeof (effect) === 'string')
						effect = { action: effect };
					if (!('text' in effect)) {
						if (effect.action === 'copy')
							effect.text = 'Copier';
						else if (effect.action === 'move')
							effect.text = 'Déplacer';
						else if (effect.action === 'link')
							effect.text = 'Lier';
						else
							effect.text = effect.action;
					}
					if (!('dragicon' in effect))
						effect.dragicon = 'drag' + effect.action;
					effects[i] = effect;
				}
				this.allowedTypes.push({ type: type, effect: effects as DropEffect[] });
			}
			else
				this.allowedTypes.push({ type: type, effect: effects as DropEffectFunc });
		}

		protected onDragOver(event: DragEvent) {
			// test if we already captured this dataTransfer
			let found = false;
			for (let i = 0; !found && (i < this.watchers.length); i++)
				found = (this.watchers[i].getDataTransfer() === event.dataTransfer);

			if (!found) {
				// get allowed effect for the given dataTransfer
				let effect = this.onDragEffect(event.dataTransfer);
				if ((effect !== undefined) && (effect.length > 0)) {
					// capture the dataTransfer
					let watcher = event.dataTransfer.capture(this, effect);
					this.watchers.push(watcher);
					this.connect(watcher, 'move', this.onWatcherMove);
					this.connect(watcher, 'drop', this.onWatcherDrop);
					this.connect(watcher, 'leave', this.onWatcherLeave);
					event.stopImmediatePropagation();

					this.onWatcherEnter(watcher);
				}
			}
			// we are already interrested
			else
				event.stopImmediatePropagation();
		}

		protected onWatcherEnter(watcher: DragWatcher): void {
			this.onDragEnter(watcher.getDataTransfer());
		}

		protected onWatcherMove(watcher: DragWatcher): void {
		}

		protected onWatcherDrop(watcher: DragWatcher, effect, x: number, y: number): void {
			let point = this.pointFromWindow(new Point(x, y));
			this.onDrop(watcher.getDataTransfer(), effect, point.getX(), point.getY());
		}

		protected onWatcherLeave(watcher: DragWatcher): void {
			let found = false;
			let i = 0;
			for (; !found && (i < this.watchers.length); i++) {
				found = (this.watchers[i] === watcher);
			}
			i--;
			if (found)
				this.watchers.splice(i, 1);
			if (this.watchers.length === 0)
				this.onDragLeave();
		}

		getAllowedTypesEffect(dataTransfer: DragDataTransfer): DropEffect[] {
			if (this.allowedTypes !== undefined) {
				let data = dataTransfer.getData();
				let effect = undefined;
				for (let i = 0; (effect === undefined) && (i < this.allowedTypes.length); i++) {
					let type = this.allowedTypes[i];
					if (typeof (type.type) === 'string') {
						if (type.type === 'all')
							effect = type.effect;
						else if (data instanceof DragNativeData) {
							if ((type.type === 'files') && data.hasFiles())
								effect = type.effect;
							else if (((type.type === 'text') || (type.type === 'text/plain')) && data.hasTypes('text/plain', 'text'))
								effect = type.effect;
							else if (data.hasType(type.type))
								effect = type.effect;
						}
					}
					else if (data instanceof type.type)
						effect = type.effect;
				}
				if (typeof (effect) === 'function') {
					let effects = this.onDragEffectFunction(dataTransfer, effect);

					for (let i = 0; i < effects.length; i++) {
						let effect = effects[i];
						if (typeof (effect) === 'string')
							effect = { action: effect };
						if (!('text' in effect)) {
							if (effect.action === 'copy')
								effect.text = 'Copier';
							else if (effect.action === 'move')
								effect.text = 'Déplacer';
							else if (effect.action === 'link')
								effect.text = 'Lier';
							else if (effect.action === 'run')
								effect.text = 'Exécuter';
							else if (effect.action === 'play')
								effect.text = 'Jouer';
							else
								effect.text = effect.action;
						}
						if (!('dragicon' in effect))
							effect.dragicon = 'drag' + effect.action;
						effects[i] = effect;
					}
					effect = effects;
				}
				if (effect === undefined)
					effect = [];
				return effect;
			}
			else
				return [];
		}

		//
		// Override to allow a drop for the given dataTransfer.
		// This method return the possible allowed effect [move|copy|link|...] in an array
		//
		protected onDragEffect(dataTransfer: DragDataTransfer) {
			let dragEvent = new Ui.DragEvent();
			dragEvent.setType('drageffect');
			dragEvent.setBubbles(false);
			dragEvent.dataTransfer = dataTransfer;
			dragEvent.dispatchEvent(this);
			let effectAllowed = dragEvent.effectAllowed;
			if (effectAllowed !== undefined)
				return dragEvent.effectAllowed;
			else
				return this.getAllowedTypesEffect(dataTransfer);
		}

		protected onDragEffectFunction(dataTransfer: DragDataTransfer, func: DropEffectFunc): DropEffect[] {
			return func(dataTransfer.getData(), dataTransfer);
		}

		//
		// Override to get the drop when it happends. The default
		// action is to raise the 'drop' event.
		//
		protected onDrop(dataTransfer: DragDataTransfer, dropEffect, x: number, y: number) {
			let done = false;
			if (!this.fireEvent('drop', this, dataTransfer.getData(), dropEffect, x, y, dataTransfer)) {
				let data = dataTransfer.getData();
				if (data instanceof DragNativeData && data.hasFiles()) {
					let files = data.getFiles();
					done = true;
					for (let i = 0; i < files.length; i++)
						done = done && this.fireEvent('dropfile', this, files[i], dropEffect, x, y);
				}
			}
			else
				done = true;
			return done;
		}

		//
		// Override to do something when the first allowed drag enter the element.
		// The default action is to raise the 'dragenter' event
		//	
		protected onDragEnter(dataTransfer: DragDataTransfer): void {
			this.fireEvent('dragenter', this, dataTransfer.getData());
		}

		//
		// Override to do something when the last allowed drag leave the element.
		// The default action is to raise the 'dragleave' event
		//	
		protected onDragLeave(): void {
			this.fireEvent('dragleave', this);
		}
	}
}	

