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
		lock: boolean = false;

		constructor(init: {
			element: Ui.Element,
			press?: (watcher: PressWatcher) => void,
			down?: (watcher: PressWatcher) => void,
			up?: (watcher: PressWatcher) => void,
			activate?: (watcher: PressWatcher) => void,
			delayedpress?: (watcher: PressWatcher) => void
		}) {
			super();
			this.element = init.element;
			if (init.press)
				this.press = init.press;
			if (init.down)
				this.down = init.down;
			if (init.up)
				this.up = init.up;
			if (init.activate)
				this.activate = init.activate;
			if (init.delayedpress)
				this.delayedpress = init.delayedpress;	

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
			if (this.lock || this.element.isDisabled || this._isDown)
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
			if (!this.lock && !this.element.isDisabled && key == 13) {
				event.preventDefault();
				event.stopPropagation();
				this.onDown();
			}
		}

		protected onKeyUp(event: KeyboardEvent) {
			let key = event.which;
			if (!this.lock && !this.element.isDisabled && this._isDown && (key == 13)) {
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
				this.delayedTimer = new Core.DelayedTask(0.30, () => {
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
		lock?: boolean;
		onpress?: (pressable: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) => void;
		ondown?: (pressable: Pressable) => void;
		onup?: (pressable: Pressable) => void;
		onactivate?: (pressable: Pressable, x?: number, y?: number) => void;
		ondelayedpress?: (pressable: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) => void;
	}

	export class Pressable extends Overable implements PressableInit {
		private pressWatcher: PressWatcher;

		constructor(init?: PressableInit) {
			super(init);
			this.addEvents('press', 'down', 'up', 'activate', 'delayedpress');

			this.drawing.style.cursor = 'pointer';

			this.focusable = true;
			this.role = 'button';

			this.pressWatcher = new PressWatcher({
				element: this,
				press: (watcher) => this.onPress(watcher.x, watcher.y, watcher.altKey, watcher.shiftKey, watcher.ctrlKey),
				down: (watcher) => this.onDown(),
				up: (watcher) => this.onUp(),
				activate: (watcher) => this.onActivate(watcher.x, watcher.y),
				delayedpress: (watcher) => this.onDelayedPress(watcher.x, watcher.y, watcher.altKey, watcher.shiftKey, watcher.ctrlKey)
			});

			if (init) {
				if (init.lock !== undefined)
					this.lock = init.lock;
				if (init.onpress !== undefined)
					this.connect(this, 'press', init.onpress);
				if (init.ondown !== undefined)
					this.connect(this, 'down', init.ondown);
				if (init.onup !== undefined)
					this.connect(this, 'up', init.onup);
				if (init.onactivate !== undefined)
					this.connect(this, 'activate', init.onactivate);
				if (init.ondelayedpress !== undefined)
					this.connect(this, 'delayedpress', init.ondelayedpress);
			}
		}
	
		get isDown(): boolean {
			return this.pressWatcher.isDown;
		}

		set lock(lock: boolean) {
			this.pressWatcher.lock = lock;
			if (lock)
				this.drawing.style.cursor = '';
			else
				this.drawing.style.cursor = 'pointer';
		}

		get lock(): boolean {
			return this.pressWatcher.lock;
		}

		press() {
			this.onPress();
		}

		activate() {
			this.onActivate();
		}

		protected onDown() {
			this.fireEvent('down', this);
		}

		protected onUp() {
			this.fireEvent('up', this);
		}

		protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
			this.fireEvent('press', this, x, y, altKey, shiftKey, ctrlKey);
		}

		protected onActivate(x?: number, y?: number) {
			this.fireEvent('activate', this);
		}

		protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
			this.fireEvent('delayedpress', this, x, y, altKey, shiftKey, ctrlKey);
		}

		protected onDisable() {
			super.onDisable();
			this.drawing.style.cursor = '';
		}

		protected onEnable() {
			super.onEnable();
			if (this.lock)
				this.drawing.style.cursor = '';
			else
				this.drawing.style.cursor = 'pointer';
		}
	}
}	
