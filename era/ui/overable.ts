namespace Ui {

	export class OverWatcher extends Core.Object {
		private element: Ui.Element;
		private pointer: Pointer = undefined;
		private enter: (watcher: OverWatcher) => void;
		private leave: (watcher: OverWatcher) => void;

		constructor(init: { element: Ui.Element, enter?: (watcher: OverWatcher) => void, leave?: (watcher: OverWatcher) => void }) {
			super();
			this.enter = init.enter;
			this.leave = init.leave;

			this.element = init.element;
			this.connect(init.element, 'ptrmove', (event: PointerEvent) => {
				if (!this.element.isDisabled && (this.pointer == undefined)) {
					this.pointer = event.pointer;
					if (this.enter)
						this.enter(this);	
					this.connect(this.pointer, 'ptrmove', this.onPtrMove);
					this.connect(this.pointer, 'ptrup', this.onPtrUp);
				}
			});
		}

		private onPtrMove(pointer: Pointer) {
			if (!pointer.getIsInside(this.element))
				this.onPtrLeave(pointer);
		}

		private onPtrUp(pointer: Pointer) {
			if (pointer.type == 'touch')
				this.onPtrLeave(pointer);	
		}

		private onPtrLeave(pointer: Pointer) {
			this.disconnect(pointer, 'ptrmove', this.onPtrMove);
			this.disconnect(pointer, 'ptrup', this.onPtrUp);
			this.pointer = undefined;
			// leave
			if (this.leave)
				this.leave(this); 	
		}	

		get isOver(): boolean {
			return (this.pointer !== undefined);
		}
	}

	export interface OverableInit extends LBoxInit {
	}

	export class Overable extends LBox implements OverableInit {
		watcher: OverWatcher;

		constructor(init?: Partial<OverableInit>) {
			super();
			this.addEvents('enter', 'leave', 'move');
			this.watcher = new OverWatcher({
				element: this,
				enter: () => this.fireEvent('enter', this),
				leave: () => this.fireEvent('leave', this)
			});
			this.assign(init);
		}

		get isOver(): boolean {
			return this.watcher.isOver;
		}
	}
}	
