namespace Ui
{
	export interface PressableInit extends OverableInit {
		lock: boolean;
	}

	export class Pressable extends Overable implements PressableInit
	{
		private _lock: boolean = false;
		private _isDown: boolean = false;
		private lastTime: number = undefined;

		constructor(init?: Partial<PressableInit>) {
			super();
			this.addEvents('press', 'down', 'up', 'activate');

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
		
			let watcher = event.pointer.watch(this);
			this.connect(watcher, 'move', function () {
				if (watcher.pointer.getIsMove())
					watcher.cancel();
			});
			this.connect(watcher, 'up', function (event) {
				this.onUp();
				this.onPress(event.pointer.getX(), event.pointer.getY());

				// test for activate signal
				let currentTime = (new Date().getTime()) / 1000;
				if ((this.lastTime !== undefined) && (currentTime - this.lastTime < 0.30))
					this.onActivate(event.pointer.getX(), event.pointer.getY());
				this.lastTime = currentTime;

				watcher.capture();
				watcher.cancel();
			});
			this.connect(watcher, 'cancel', function () {
				this.onUp();
			});
			this.onDown();
		}

		protected onKeyDown(event) {
			let key = event.which;
			if ((key == 13) && !this.isDisabled && !this._lock) {
				event.preventDefault();
				event.stopPropagation();
				this.onDown();
			}
		}

		protected onKeyUp(event) {
			let key = event.which;
			if ((this._isDown) && (key == 13) && !this.isDisabled && !this._lock) {
				event.preventDefault();
				event.stopPropagation();
				this.onUp();
				this.onPress();
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

		protected onPress(x?: number, y?: number) {
			this.fireEvent('press', this, x, y);
		}

		protected onActivate() {
			this.fireEvent('activate', this);
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
