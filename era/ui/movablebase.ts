namespace Ui {
	export interface MovableBaseInit extends ContainerInit {
		lock?: boolean;
		inertia?: boolean;
		moveHorizontal?: boolean;
		moveVertical?: boolean;
		onupped?: (event: { target: MovableBase, speedX: number, speedY: number, deltaX: number, deltaY: number, cumulMove: number, abort: boolean }) => void;
		ondowned?: (event: { target: MovableBase }) => void;
		onmoved?: (event: { target: MovableBase }) => void;
	}

	export class MovableBase extends Container implements MovableBaseInit {
		private _moveHorizontal: boolean = true;
		private _moveVertical: boolean = true;
		protected posX: number = 0;
		protected posY: number = 0;
		protected speedX: number = 0;
		protected speedY: number = 0;
		protected startPosX: number = undefined;
		protected startPosY: number = undefined;
		protected inertiaClock: Anim.Clock = undefined;
		private _inertia: boolean = false;
		private _isDown: boolean = false;
		private _lock: boolean = false;
		protected isInMoveEvent: boolean = false;
		protected cumulMove: number = 0;
		readonly upped = new Core.Events<{ target: MovableBase, speedX: number, speedY: number, deltaX: number, deltaY: number, cumulMove: number, abort: boolean }>();
		readonly downed = new Core.Events<{ target: MovableBase }>();
		readonly moved = new Core.Events<{ target: MovableBase }>();

		constructor(init?: MovableBaseInit) {
			super(init);
			this.drawing.style.touchAction = 'none';
			this.ptrdowned.connect((e) => this.onPointerDown(e));
			if (init) {
				if (init.lock !== undefined)
					this.lock = init.lock;	
				if (init.inertia !== undefined)
					this.inertia = init.inertia;
				if (init.moveHorizontal !== undefined)
					this.moveHorizontal = init.moveHorizontal;	
				if (init.moveVertical !== undefined)
					this.moveVertical = init.moveVertical;	
				if (init.onupped)
					this.upped.connect(init.onupped);	
				if (init.ondowned)
					this.downed.connect(init.ondowned);
				if (init.onmoved)
					this.moved.connect(init.onmoved)
			}
		}

		set lock(lock: boolean) {
			this._lock = lock;
			if (lock)
				this.stopInertia();
		}

		get lock(): boolean {
			return this._lock;
		}

		get isDown(): boolean {
			return this._isDown;
		}

		get inertia(): boolean {
			return this._inertia;
		}

		set inertia(inertiaActive: boolean) {
			this._inertia = inertiaActive;
		}

		get moveHorizontal(): boolean {
			return this._moveHorizontal;
		}

		set moveHorizontal(moveHorizontal: boolean) {
			this._moveHorizontal = moveHorizontal;
			this.updateTouchAction();
		}

		get moveVertical(): boolean {
			return this._moveVertical;
		}

		set moveVertical(moveVertical: boolean) {
			this._moveVertical = moveVertical;
			this.updateTouchAction();
		}

		private updateTouchAction() {
			if (this._moveHorizontal && this._moveVertical)
				this.drawing.style.touchAction = 'none';
			else if (this._moveHorizontal)
				this.drawing.style.touchAction = 'pan-y';
			else if (this._moveVertical)
				this.drawing.style.touchAction = 'pan-x';
			else
				this.drawing.style.touchAction = 'auto';
		}

		setPosition(x?: number, y?: number, dontSignal: boolean = false) {
			if ((x !== undefined) && (this._moveHorizontal)) {
				if (isNaN(x))
					this.posX = 0;
				else
					this.posX = x;
			}
			if ((y !== undefined) && (this._moveVertical)) {
				if (isNaN(y))
					this.posY = 0;
				else
					this.posY = y;
			}
			if (!this.isInMoveEvent && !dontSignal) {
				this.isInMoveEvent = true;
				this.moved.fire({ target: this });
				this.onMove(this.posX, this.posY);
				this.isInMoveEvent = false;
			}
		}

		get positionX(): number {
			return this.posX;
		}

		get positionY(): number {
			return this.posY;
		}

		protected onMove(x: number, y: number) {
		}

		private onDown() {
			this.cumulMove = 0;
			this._isDown = true;
			this.downed.fire({ target: this });
		}

		private onUp(abort) {
			this._isDown = false;
			this.upped.fire({
				target: this, speedX: this.speedX, speedY: this.speedY,
				deltaX: (this.posX - this.startPosX),
				deltaY: (this.posY - this.startPosY),
				cumulMove: this.cumulMove,
				abort: abort
			});
		}

		private onPointerDown(event: PointerEvent) {
			if (this._isDown || this.isDisabled || this._lock)
				return;
			
			this.stopInertia();
			this.startPosX = this.posX;
			this.startPosY = this.posY;

			this.onDown();

			let cancelLock = false;
			let watcher = event.pointer.watch(this);
			watcher.moved.connect(() => {
				if (!watcher.getIsCaptured()) {
					if (watcher.pointer.getIsMove()) {

						let deltaObj = watcher.getDelta();
						let delta = Math.sqrt(deltaObj.x * deltaObj.x + deltaObj.y * deltaObj.y);

						this.setPosition(this.startPosX + deltaObj.x, this.startPosY + deltaObj.y);

						let deltaPosX = this.posX - this.startPosX;
						let deltaPosY = this.posY - this.startPosY;
						let deltaPos = Math.sqrt(deltaPosX * deltaPosX + deltaPosY * deltaPosY);

						let test = 0;
						if (delta > 0)
							test = deltaPos / delta;
						
						let testLevel = 0.7;
						// if mouse left button, directly capture. No valid move needed
						// to validate the pointer capture
						if (event.pointer.type == 'mouse' && event.pointer.button == 0)
							testLevel = 0;	
						
						if (test >= testLevel)
							watcher.capture();
						else {
							this.setPosition(this.startPosX, this.startPosY);
							watcher.cancel();
						}
					}
				}
				else {
					let delta = watcher.getDelta();
					this.setPosition(this.startPosX + delta.x, this.startPosY + delta.y);
				}
			});
			watcher.upped.connect(() => {
				this.cumulMove = watcher.pointer.getCumulMove();
				let speed = watcher.getSpeed();
				this.speedX = speed.x;
				this.speedY = speed.y;
				if (this.inertia)
					this.startInertia();
				this.onUp(false);
				cancelLock = true;
				watcher.cancel();
				cancelLock = false;
			});
			watcher.cancelled.connect(() => {
				if (!cancelLock)
					this.onUp(true);
			});
		}

		private startInertia() {
			if (this.inertiaClock == undefined) {
				this.inertiaClock = new Anim.Clock({ duration: 'forever', target: this });
				this.inertiaClock.timeupdate.connect((e) => {
					if (e.deltaTick === 0)
						return;

					let oldPosX = this.posX;
					let oldPosY = this.posY;

					let posX = this.posX + (this.speedX * e.deltaTick);
					let posY = this.posY + (this.speedY * e.deltaTick);
					this.setPosition(posX, posY);

					if ((this.posX == oldPosX) && (this.posY == oldPosY)) {
						this.stopInertia();
						return;
					}
					this.speedX -= this.speedX * e.deltaTick * 3;
					this.speedY -= this.speedY * e.deltaTick * 3;
					if (Math.abs(this.speedX) < 0.1)
						this.speedX = 0;
					if (Math.abs(this.speedY) < 0.1)
						this.speedY = 0;
					if ((this.speedX === 0) && (this.speedY === 0))
						this.stopInertia();
				});
				this.inertiaClock.begin();
			}
		}

		private stopInertia() {
			if (this.inertiaClock !== undefined) {
				this.inertiaClock.stop();
				this.inertiaClock = undefined;
			}
		}
	}
}	

