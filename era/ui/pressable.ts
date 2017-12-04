namespace Ui {

	export class PressWatcher extends Core.Object {
		private element: Ui.Element;
		private press: (watcher: PressWatcher) => void;
		private down: (watcher: PressWatcher) => void;
		private up: (watcher: PressWatcher) => void;
		private activate: (watcher: PressWatcher) => void;
		private delayedpress: (watcher: PressWatcher) => void;
		private _isDown: boolean = false;
		private lastTime: number = undefined;
		private delayedTimer: Core.DelayedTask;
		x?: number;
		y?: number;
		altKey?: boolean;
		shiftKey?: boolean;
		ctrlKey?: boolean;

		constructor(init: {
			element: Ui.Element,
			press?: (watcher: PressWatcher) => void,
			down?: (watcher: PressWatcher) => void,
			up?: (watcher: PressWatcher) => void,
			activate?: (watcher: PressWatcher) => void,
			delayedpress?: (watcher: PressWatcher) => void
		}) {
			super();
			this.assign(init);

			// handle pointers
			this.connect(this.element, 'ptrdown', this.onPointerDown);

			// handle keyboard
			this.connect(this.element.drawing, 'keydown', this.onKeyDown);
			this.connect(this.element.drawing, 'keyup', this.onKeyUp);
		}
	
		get isDown(): boolean {
			return this._isDown;
		}

		protected onPointerDown(event: PointerEvent) {
			if (this.element.isDisabled || this._isDown)
				return;
			if (event.pointer.type == 'mouse' && event.pointer.button != 0)
				return;
		
			let watcher = event.pointer.watch(this);
			this.connect(watcher, 'move', ()  => {
				if (watcher.pointer.getIsMove())
					watcher.cancel();
			});
			this.connect(watcher, 'up', (event: PointerEvent) => {
				this.onUp();
				let x = event.pointer.getX();
				let y = event.pointer.getY();
				let altKey = event.pointer.getAltKey();
				let shiftKey = event.pointer.getShiftKey();
				let ctrlKey = event.pointer.getCtrlKey();
				this.onPress(x, y, altKey, shiftKey, ctrlKey);

				watcher.capture();
				watcher.cancel();
			});
			this.connect(watcher, 'cancel', () => this.onUp());
			this.onDown();
		}

		protected onKeyDown(event: KeyboardEvent) {
			let key = event.which;
			if (!this.element.isDisabled && key == 13) {
				event.preventDefault();
				event.stopPropagation();
				this.onDown();
			}
		}

		protected onKeyUp(event: KeyboardEvent) {
			let key = event.which;
			if (!this.element.isDisabled && this._isDown && (key == 13)) {
				event.preventDefault();
				event.stopPropagation();
				this.onUp();
				this.onPress(undefined, undefined, event.altKey, event.shiftKey, event.ctrlKey);
			}
		}

		protected onDown() {
			this._isDown = true;
			if (this.down)
				this.down(this);
		}

		protected onUp() {
			this._isDown = false;
			if (this.up)
				this.up(this);
		}

		protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
			this.x = x; this.y = y;
			this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
			if (this.press)
				this.press(this);

			// test for activate signal
			let currentTime = (new Date().getTime()) / 1000;
			if ((this.lastTime !== undefined) && (currentTime - this.lastTime < 0.30)) {
				this.onActivate(x, y);
				if (this.delayedTimer != undefined) {
					this.delayedTimer.abort();
					this.delayedTimer = undefined;
				}
			}
			else {
				this.delayedTimer = new Core.DelayedTask(this, 0.30, () => {
					this.onDelayedPress(x, y, altKey, shiftKey, ctrlKey);
				});
			}
			this.lastTime = currentTime;
		}

		protected onActivate(x?: number, y?: number) {
			if (this.activate)
				this.activate(this);	
		}

		protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
			this.x = x; this.y = y;
			this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
			if (this.delayedTimer) {
				if (!this.delayedTimer.isDone)
					this.delayedTimer.abort();	
				this.delayedTimer = undefined;
			}	
			if (this.delayedpress)
				this.delayedpress(this);
		}
	}


	export interface PressableInit extends OverableInit {
		lock: boolean;
	}

	export class Pressable extends Overable implements PressableInit
	{
		private _lock: boolean = false;
		private _isDown: boolean = false;
		private lastTime: number = undefined;
		private delayedTimer: Core.DelayedTask;

		constructor(init?: Partial<PressableInit>) {
			super();
			this.addEvents('press', 'down', 'up', 'activate', 'delayedpress');

			this.drawing.style.cursor = 'pointer';

			this.focusable = true;
			this.role = 'button';

			// handle pointers
			this.connect(this, 'ptrdown', this.onPointerDown);

			// handle keyboard
			this.connect(this.drawing, 'keydown', this.onKeyDown);
			this.connect(this.drawing, 'keyup', this.onKeyUp);

			if (init)
				this.assign(init);
		}
	
		get isDown(): boolean {
			return this._isDown;
		}

		set lock(lock: boolean) {
			this._lock = lock;
			if (lock)
				this.drawing.style.cursor = '';
			else
				this.drawing.style.cursor = 'pointer';
		}

		get lock(): boolean {
			return this._lock;
		}

		press() {
			this.onPress();
		}

		activate() {
			this.onActivate();
		}

		protected onPointerDown(event: PointerEvent) {
			if (this.isDisabled || this._isDown || this._lock)
				return;
			if (event.pointer.type == 'mouse' && event.pointer.button != 0)
				return;
		
			let watcher = event.pointer.watch(this);
			this.connect(watcher, 'move', ()  => {
				if (watcher.pointer.getIsMove())
					watcher.cancel();
			});
			this.connect(watcher, 'up', (event: PointerEvent) => {
				this.onUp();
				let x = event.pointer.getX();
				let y = event.pointer.getY();
				let altKey = event.pointer.getAltKey();
				let shiftKey = event.pointer.getShiftKey();
				let ctrlKey = event.pointer.getCtrlKey();
				this.onPress(x, y, altKey, shiftKey, ctrlKey);

				watcher.capture();
				watcher.cancel();
			});
			this.connect(watcher, 'cancel', () => this.onUp());
			this.onDown();
		}

		protected onKeyDown(event: KeyboardEvent) {
			let key = event.which;
			if ((key == 13) && !this.isDisabled && !this._lock) {
				event.preventDefault();
				event.stopPropagation();
				this.onDown();
			}
		}

		protected onKeyUp(event: KeyboardEvent) {
			let key = event.which;
			if ((this._isDown) && (key == 13) && !this.isDisabled && !this._lock) {
				event.preventDefault();
				event.stopPropagation();
				this.onUp();
				this.onPress(undefined, undefined, event.altKey, event.shiftKey, event.ctrlKey);
			}
		}

		protected onDown() {
			this._isDown = true;
			this.fireEvent('down', this);
		}

		protected onUp() {
			this._isDown = false;
			this.fireEvent('up', this);
		}

		protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
			this.fireEvent('press', this, x, y, altKey, shiftKey, ctrlKey);

			// test for activate signal
			let currentTime = (new Date().getTime()) / 1000;
			if ((this.lastTime !== undefined) && (currentTime - this.lastTime < 0.30)) {
				this.onActivate(x, y);
				if (this.delayedTimer != undefined) {
					this.delayedTimer.abort();
					this.delayedTimer = undefined;
				}
			}
			else {
				this.delayedTimer = new Core.DelayedTask(this, 0.30, () => {
					this.onDelayedPress(x, y, altKey, shiftKey, ctrlKey);
				});
			}
			this.lastTime = currentTime;
		}

		protected onActivate(x?: number, y?: number) {
			this.fireEvent('activate', this);
		}

		protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
			if (this.delayedTimer) {
				if (!this.delayedTimer.isDone)
					this.delayedTimer.abort();	
				this.delayedTimer = undefined;
			}	
			this.fireEvent('delayedpress', this, x, y, altKey, shiftKey, ctrlKey);
		}

		protected onDisable() {
			super.onDisable();
			this.drawing.style.cursor = '';
		}

		protected onEnable() {
			super.onEnable();
			if (this._lock)
				this.drawing.style.cursor = '';
			else
				this.drawing.style.cursor = 'pointer';
		}
	}
}	
