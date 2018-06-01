namespace Ui {

	export class OverWatcher extends Core.Object {
		private element: Ui.Element;
		private pointer?: Pointer;
		private enter?: (watcher: OverWatcher) => void;
		private leave?: (watcher: OverWatcher) => void;

		constructor(init: {
			element: Ui.Element,
			onentered?: (watcher: OverWatcher) => void,
			onleaved?: (watcher: OverWatcher) => void
		}) {
			super();
			if (init.onentered)
				this.enter = init.onentered;
			if (init.onleaved)
				this.leave = init.onleaved;

			this.element = init.element;
			init.element.ptrmoved.connect((event: PointerEvent) => {
				if (!this.element.isDisabled && (this.pointer == undefined)) {
					this.pointer = event.pointer;
					if (this.enter)
						this.enter(this);
					this.pointer.ptrmoved.connect(this.onPtrMove);
					this.pointer.ptrupped.connect(this.onPtrUp);
				}
			});
		}

		private onPtrMove = (e: { target: Pointer }) => {
			if (!e.target.getIsInside(this.element))
				this.onPtrLeave(e.target);
		}

		private onPtrUp = (e: { target: Pointer }) => {
			if (e.target.type == 'touch')
				this.onPtrLeave(e.target);	
		}

		private onPtrLeave(pointer: Pointer) {
			pointer.ptrmoved.disconnect(this.onPtrMove);
			pointer.ptrupped.disconnect(this.onPtrUp);
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
		onentered?: (event: { target: Overable }) => void;
		onleaved?: (event: { target: Overable }) => void;
		onmoved?: (event: { target: Overable }) => void;
	}

	export class Overable extends LBox implements OverableInit {
		watcher: OverWatcher;
		readonly entered = new Core.Events<{ target: Overable }>();
		set onentered(value: (event: { target: Overable }) => void) { this.entered.connect(value); }
		readonly leaved = new Core.Events<{ target: Overable }>();
		set onleaved(value: (event: { target: Overable }) => void) { this.leaved.connect(value); }
		readonly moved = new Core.Events<{ target: Overable }>();
		set onmoved(value: (event: { target: Overable }) => void) { this.moved.connect(value); }

		constructor(init?: OverableInit) {
			super(init);
			this.watcher = new OverWatcher({
				element: this,
				onentered: () => this.entered.fire({ target: this }),
				onleaved: () => this.leaved.fire({ target: this })
			});
			if (init) {
				if (init.onentered)
					this.entered.connect(init.onentered);
				if (init.onleaved)
					this.leaved.connect(init.onleaved);
				if (init.onmoved)
					this.moved.connect(init.onmoved);	
			}
		}

		get isOver(): boolean {
			return this.watcher.isOver;
		}
	}
}	
