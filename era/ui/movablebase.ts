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
        protected startPosX: number = 0;
        protected startPosY: number = 0;
        protected inertiaClock?: Anim.Clock;
        private _inertia: boolean = false;
        private _isDown: boolean = false;
        private _lock: boolean = false;
        private _pointerId?: number;
        private _touchCapture: false;
        protected isInMoveEvent: boolean = false;
        protected cumulMove: number = 0;
        protected history: { time: number, x: number, y: number }[] = [];
        readonly upped = new Core.Events<{ target: MovableBase, speedX: number, speedY: number, deltaX: number, deltaY: number, cumulMove: number, abort: boolean }>();
        set onupped(value: (event: { target: MovableBase, speedX: number, speedY: number, deltaX: number, deltaY: number, cumulMove: number, abort: boolean }) => void) { this.upped.connect(value); }
        readonly downed = new Core.Events<{ target: MovableBase }>();
        set ondowned(value: (event: { target: MovableBase }) => void) { this.downed.connect(value); }
        readonly moved = new Core.Events<{ target: MovableBase }>();
        set onmoved(value: (event: { target: MovableBase }) => void) { this.moved.connect(value); }

        constructor(init?: MovableBaseInit) {
            super(init);
            this.drawing.style.touchAction = 'none';
            //this.ptrdowned.connect((e) => this.onPointerDown(e));

            if ('PointerEvent' in window)
                this.drawing.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: false });
            else if ('TouchEvent' in window)
                this.drawing.addEventListener('touchstart', (e) => this.onTouchStart(e));
            else
                this.drawing.addEventListener('mousedown', (e) => this.onMouseDown(e));
            // Chrome dont prevent the click event, so block it to avoid conflict
            this.drawing.addEventListener('click', (e) => { e.stopImmediatePropagation(); e.preventDefault(); });

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

        private getSpeed() {
            if (this.history.length < 2)
                return { x: 0, y: 0 };
            else {
                let measure;
                let i = this.history.length;
                let now = this.history[--i];
                do {
                    measure = this.history[--i];
                }
                while ((i > 0) && ((now.time - measure.time) < 0.08));
                let deltaTime = now.time - measure.time;
                return {
                    x: (now.x - measure.x) / deltaTime,
                    y: (now.y - measure.y) / deltaTime
                };
            }
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
            this.history = [];
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

        private onTouchStart(event: TouchEvent) {
            if (this._isDown || this.isDisabled || this._lock)
                return;
            if (event.targetTouches.length != 1)
                return;

            let initialPosition = new Point(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
            this._pointerId = event.targetTouches[0].identifier;

            this.stopInertia();
            this.startPosX = this.posX;
            this.startPosY = this.posY;

            this.onDown();

            let onTouchMove = (e: TouchEvent) => {
                let touch: Touch | undefined;
                for (let i = 0; touch == undefined && i < e.touches.length; i++)
                    if (e.touches[i].identifier == this._pointerId)
                        touch = e.touches[i];
                if (!touch)
                    return;
                e.stopPropagation();
                e.preventDefault();
                let initial = this.pointFromWindow(initialPosition);
                let current = this.pointFromWindow(new Point(touch.clientX, touch.clientY));
                let delta = { x: current.x - initial.x, y: current.y - initial.y };

                // store an history for the inertia
                let time = (new Date().getTime()) / 1000;
                this.history.push({ time: time, x: this.startPosX + delta.x, y: this.startPosY + delta.y });
                while ((this.history.length > 2) && (time - this.history[0].time > Ui.Pointer.HISTORY_TIMELAPS)) {
                    this.history.shift();
                }

                this.setPosition(this.startPosX + delta.x, this.startPosY + delta.y);
            }
            let onTouchCancel = (e: TouchEvent) => {
                this.drawing.removeEventListener('touchmove', onTouchMove);
                this.drawing.removeEventListener('touchend', onTouchEnd);
                this.drawing.removeEventListener('touchcancel', onTouchCancel);
                this._pointerId = undefined;
                this.onUp(true);
            }
            let onTouchEnd = (e: TouchEvent) => {
                this.drawing.removeEventListener('touchmove', onTouchMove);
                this.drawing.removeEventListener('touchend', onTouchEnd);
                this.drawing.removeEventListener('touchcancel', onTouchCancel);
                this._pointerId = undefined;
                e.stopPropagation();
                e.preventDefault();

                if (this.history.length > 0) {
                    // store an history for the inertia
                    let time = (new Date().getTime()) / 1000;
                    this.history.push({ time: time, x: this.history[this.history.length - 1].x, y: this.history[this.history.length - 1].y });
                }

                let speed = this.getSpeed();
                this.speedX = speed.x;
                this.speedY = speed.y;
                if (this.inertia)
                    this.startInertia();
                this.onUp(false);
            }

            this.drawing.addEventListener('touchmove', onTouchMove, { passive: false });
            this.drawing.addEventListener('touchend', onTouchEnd, { passive: false });
            this.drawing.addEventListener('touchcancel', onTouchCancel, { passive: false });
        }

        private onPointerDown(event: PointerEvent) {
            if (this._isDown || this.isDisabled || this._lock)
                return;
            // allow only left button for mouse
            if (event.pointerType == 'mouse' && event.button != 0)
                return;
            let initialPosition = new Point(event.clientX, event.clientY);

            this.stopInertia();
            this.startPosX = this.posX;
            this.startPosY = this.posY;

            this.onDown();

            this._pointerId = event.pointerId;
            this.drawing.setPointerCapture(event.pointerId);

            let onPointerMove = (e: PointerEvent) => {
                if (e.pointerId != this._pointerId)
                    return;
                e.stopImmediatePropagation();
                e.preventDefault();
                let initial = this.pointFromWindow(initialPosition);
                let current = this.pointFromWindow(new Point(e.clientX, e.clientY));
                let delta = { x: current.x - initial.x, y: current.y - initial.y };

                // store an history for the inertia
                let time = (new Date().getTime()) / 1000;
                this.history.push({ time: time, x: this.startPosX + delta.x, y: this.startPosY + delta.y });
                while ((this.history.length > 2) && (time - this.history[0].time > Ui.Pointer.HISTORY_TIMELAPS)) {
                    this.history.shift();
                }

                this.setPosition(this.startPosX + delta.x, this.startPosY + delta.y);
            }
            let onPointerCancel = (e: PointerEvent) => {
                if (e.pointerId != this._pointerId)
                    return;
                this.drawing.removeEventListener('pointermove', onPointerMove);
                this.drawing.removeEventListener('pointercancel', onPointerCancel);
                this.drawing.removeEventListener('pointerup', onPointerUp);
                this.drawing.releasePointerCapture(event.pointerId);
                this._pointerId = undefined;
                e.stopImmediatePropagation();
                e.preventDefault();
                this.onUp(true);
            }
            let onPointerUp = (e: PointerEvent) => {
                if (e.pointerId != this._pointerId)
                    return;
                this.drawing.removeEventListener('pointermove', onPointerMove);
                this.drawing.removeEventListener('pointercancel', onPointerCancel);
                this.drawing.removeEventListener('pointerup', onPointerUp);
                this.drawing.releasePointerCapture(event.pointerId);
                this._pointerId = undefined;
                e.stopImmediatePropagation();
                e.preventDefault();

                let initial = this.pointFromWindow(initialPosition);
                let current = this.pointFromWindow(new Point(e.clientX, e.clientY));
                let delta = { x: current.x - initial.x, y: current.y - initial.y };

                // store an history for the inertia
                let time = (new Date().getTime()) / 1000;
                this.history.push({ time: time, x: this.startPosX + delta.x, y: this.startPosY + delta.y });
                let speed = this.getSpeed();
                this.speedX = speed.x;
                this.speedY = speed.y;
                if (this.inertia)
                    this.startInertia();
                this.onUp(false);
            }

            this.drawing.addEventListener('pointermove', onPointerMove);
            this.drawing.addEventListener('pointercancel', onPointerCancel);
            this.drawing.addEventListener('pointerup', onPointerUp);
            event.stopImmediatePropagation();
            event.preventDefault();
        }

        private onMouseDown(event: MouseEvent) {
            if (this._isDown || this.isDisabled || this._lock || event.button != 0)
                return;

            let initialPosition = new Point(event.clientX, event.clientY);

            this.stopInertia();
            this.startPosX = this.posX;
            this.startPosY = this.posY;

            this.onDown();

            let onMouseMove = (e: MouseEvent) => {
                if (e.button != 0)
                    return;
                e.stopPropagation();
                e.preventDefault();
                let initial = this.pointFromWindow(initialPosition);
                let current = this.pointFromWindow(new Point(e.clientX, e.clientY));
                let delta = { x: current.x - initial.x, y: current.y - initial.y };

                // store an history for the inertia
                let time = (new Date().getTime()) / 1000;
                this.history.push({ time: time, x: this.startPosX + delta.x, y: this.startPosY + delta.y });
                while ((this.history.length > 2) && (time - this.history[0].time > Ui.Pointer.HISTORY_TIMELAPS)) {
                    this.history.shift();
                }

                this.setPosition(this.startPosX + delta.x, this.startPosY + delta.y);
            }
            let onMouseUp = (e: MouseEvent) => {
                if (e.button != 0)
                    return;
                window.removeEventListener('mousemove', onMouseMove, true);
                window.removeEventListener('mouseup', onMouseUp, true);
                this._pointerId = undefined;
                e.stopPropagation();
                e.preventDefault();

                let initial = this.pointFromWindow(initialPosition);
                let current = this.pointFromWindow(new Point(e.clientX, e.clientY));
                let delta = { x: current.x - initial.x, y: current.y - initial.y };

                // store an history for the inertia
                let time = (new Date().getTime()) / 1000;
                this.history.push({ time: time, x: this.startPosX + delta.x, y: this.startPosY + delta.y });
                let speed = this.getSpeed();
                this.speedX = speed.x;
                this.speedY = speed.y;
                if (this.inertia)
                    this.startInertia();
                this.onUp(false);
            }

            window.addEventListener('mousemove', onMouseMove, true);
            window.addEventListener('mouseup', onMouseUp, true);
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

