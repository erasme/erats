namespace Ui {

	export class TransformableWatcher extends Core.Object {
		element: Ui.Element;
		transform?: (watcher: TransformableWatcher, testOnly: boolean) => void;
		inertiastart?: (watcher: TransformableWatcher) => void;
		inertiaend?: (watcher: TransformableWatcher) => void;
		up?: (watcher: TransformableWatcher) => void;
		down?: (watcher: TransformableWatcher) => void;

		private _inertia: boolean = false;
		protected inertiaClock: Anim.Clock;

		private _isDown: boolean = false;
		private transformLock: boolean = false;

		private watcher1: PointerWatcher;
		private watcher2: PointerWatcher;

		private _angle: number = 0;
		private _scale: number= 1;
		private _translateX: number = 0;
		private _translateY: number = 0;

		private startAngle: number = 0;
		private startScale: number = 0;
		private startTranslateX: number = 0;
		private startTranslateY: number = 0;

		private _allowScale: boolean = true;
		private _minScale: number = 0.1;
		private _maxScale: number = 10;
		private _allowRotate: boolean = true;
		private _allowTranslate: boolean = true;
		private _allowLeftMouse: boolean = true;

		private speedX: number = 0;
		private speedY: number = 0;

		constructor(init: {
			element: Element,
			transform?: (watcher: TransformableWatcher, testOnly: boolean) => void,
			inertiastart?: (watcher: TransformableWatcher) => void,
			inertiaend?: (watcher: TransformableWatcher) => void,
			down?: (watcher: TransformableWatcher) => void,
			up?: (watcher: TransformableWatcher) => void,
			allowLeftMouse?: boolean;
			allowScale?: boolean;
			minScale?: number;
			maxScale?: number;
			allowRotate?: boolean;
			allowTranslate?: boolean;
			angle?: number;
			scale?: number;
			translateX?: number;
			translateY?: number;
			inertia?: boolean;
		}) {
			super();

			this.element = init.element;
			this.element.drawing.style.touchAction = 'none';

			if (init.transform != undefined)
				this.transform = init.transform;
			if (init.inertiastart != undefined)
				this.inertiastart = init.inertiastart;
			if (init.inertiaend != undefined)
				this.inertiaend = init.inertiaend;
			if (init.down != undefined)
				this.down = init.down;
			if (init.up != undefined)
				this.up = init.up;
			if (init.allowLeftMouse != undefined)
				this.allowLeftMouse = init.allowLeftMouse;
			if (init.allowScale != undefined)
				this.allowScale = init.allowScale;
			if (init.minScale != undefined)
				this.minScale = init.minScale;
			if (init.maxScale != undefined)
				this.maxScale = init.maxScale;
			if (init.allowRotate != undefined)
				this.allowRotate = init.allowRotate;
			if (init.allowTranslate != undefined)
				this.allowTranslate = init.allowTranslate;
			if (init.angle != undefined)
				this.angle = init.angle;
			if (init.scale != undefined)
				this.scale = init.scale
			if (init.translateX != undefined)
				this.translateX = init.translateX;
			if (init.translateY != undefined)
				this.translateY = init.translateY;
			if (init.inertia != undefined)
				this.inertia = init.inertia;

			this.element.setTransformOrigin(0, 0, true);

			this.element.ptrdowned.connect(e => this.onPointerDown(e));
			this.element.wheelchanged.connect(e => this.onWheel(e));
		}

		set allowLeftMouse(value: boolean) {
			this._allowLeftMouse = value;
		}

		set allowScale(allow: boolean) {
			this._allowScale = allow;
		}

		set minScale(minScale: number) {
			this._minScale = minScale;
		}

		set maxScale(maxScale: number) {
			this._maxScale = maxScale;
		}

		set allowRotate(allow: boolean) {
			this._allowRotate = allow;
		}

		set allowTranslate(allow: boolean) {
			this._allowTranslate = allow;
		}

		get isDown(): boolean {
			return this._isDown;
		}

		get isInertia(): boolean {
			return this.inertiaClock !== undefined;
		}

		get angle(): number {
			return this._angle;
		}

		set angle(angle: number) {
			this.setContentTransform(undefined, undefined, undefined, angle);
		}

		get scale(): number {
			return this._scale;
		}

		set scale(scale: number) {
			this.setContentTransform(undefined, undefined, scale, undefined);
		}

		get translateX(): number {
			return this._translateX;
		}

		set translateX(translateX: number) {
			this.setContentTransform(translateX, undefined, undefined, undefined);
		}

		get translateY(): number {
			return this._translateY;
		}

		set translateY(translateY: number) {
			this.setContentTransform(undefined, translateY, undefined, undefined);
		}

		private buildMatrix(translateX: number, translateY: number, scale: number, angle: number): Matrix {
			if (translateX === undefined)
				translateX = this._translateX;
			if (translateY === undefined)
				translateY = this._translateY;
			if (scale === undefined)
				scale = this._scale;
			if (angle === undefined)
				angle = this._angle;

			return Ui.Matrix.createTranslate(this.element.layoutWidth * this.element.transformOriginX, this.element.layoutHeight * this.element.transformOriginX).
				translate(translateX, translateY).
				scale(scale, scale).
				rotate(angle).
				translate(-this.element.layoutWidth * this.element.transformOriginX, -this.element.layoutHeight * this.element.transformOriginX);
		}

		get matrix(): Matrix {
/*			return Matrix.createTranslate(this.element.layoutWidth * this.element.transformOriginX, this.element.layoutHeight * this.element.transformOriginX).
				translate(this._translateX, this._translateY).
				scale(this._scale, this._scale).
				rotate(this._angle).
				translate(-this.element.layoutWidth * this.element.transformOriginX, -this.element.layoutHeight * this.element.transformOriginX);
*/			
			return (
				(new Matrix()).
				translate(this._translateX, this._translateY).
				scale(this._scale, this._scale).
				rotate(this._angle)
			);
		}

		getBoundaryBox(matrix) {
			if (matrix === undefined)
				matrix = this.matrix;
			let p1 = (new Ui.Point(0, 0)).multiply(matrix);
			let p2 = (new Ui.Point(this.element.layoutWidth, 0)).multiply(matrix);
			let p3 = (new Ui.Point(this.element.layoutWidth, this.element.layoutHeight)).multiply(matrix);
			let p4 = (new Ui.Point(0, this.element.layoutHeight)).multiply(matrix);

			let minX = Math.min(p1.x, Math.min(p2.x, Math.min(p3.x, p4.x)));
			let minY = Math.min(p1.y, Math.min(p2.y, Math.min(p3.y, p4.y)));
			let maxX = Math.max(p1.x, Math.max(p2.x, Math.max(p3.x, p4.x)));
			let maxY = Math.max(p1.y, Math.max(p2.y, Math.max(p3.y, p4.y)));

			return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
		}

		setContentTransform(translateX, translateY, scale, angle) {
			if (translateX === undefined)
				translateX = this._translateX;
			if (translateY === undefined)
				translateY = this._translateY;
			if (scale === undefined)
				scale = this._scale;
			if (angle === undefined)
				angle = this._angle;
			this._translateX = translateX;
			this._translateY = translateY;
			this._scale = scale;
			this._angle = angle;

			if (!this.transformLock) {
				this.transformLock = true;

				let testOnly = !(((this.watcher1 === undefined) || this.watcher1.getIsCaptured()) &&
					((this.watcher2 === undefined) || this.watcher2.getIsCaptured()));
				
				if (this.transform)
					this.transform(this, testOnly);

				this.transformLock = false;
			}
		}

		get inertia(): boolean {
			return this._inertia;
		}

		set inertia(inertiaActive: boolean) {
			this._inertia = inertiaActive;
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
	
		protected onPointerDown(event: PointerEvent) {
			if (!this._allowLeftMouse && event.pointerType == 'mouse' && event.pointer.button == 0)
				return;	

			this.stopInertia();

			if (this.watcher1 === undefined) {
				if (this._allowTranslate)
					this.onDown();
			
				let watcher = event.pointer.watch(this);
				this.watcher1 = watcher;
				watcher.moved.connect((e) => this.onPointerMove(e.target));
				watcher.upped.connect((e) => this.onPointerUp(e.target));
				watcher.cancelled.connect((e) => this.onPointerCancel(e.target));

				this.startAngle = this._angle;
				this.startScale = this._scale;
				this.startTranslateX = this._translateX;
				this.startTranslateY = this._translateY;
			}
			else if (this.watcher2 === undefined) {
				if (!this._allowTranslate)
					this.onDown();
			
				this.watcher1.pointer.setInitialPosition(this.watcher1.pointer.getX(), this.watcher1.pointer.getY());

				let watcher = event.pointer.watch(this);
				this.watcher2 = watcher;
				watcher.moved.connect((e) => this.onPointerMove(e.target));
				watcher.upped.connect((e) => this.onPointerUp(e.target));
				watcher.cancelled.connect((e) => this.onPointerUp(e.target));

				this.startAngle = this._angle;
				this.startScale = this._scale;
				this.startTranslateX = this._translateX;
				this.startTranslateY = this._translateY;
			}
		}

		protected onPointerMove(watcher) {
			let pos1; let pos2; let start1; let start2;
							
			// 2 fingers
			if ((this.watcher1 !== undefined) && (this.watcher2 !== undefined)) {

				if (!this.watcher1.getIsCaptured() && this.watcher1.pointer.getIsMove())
					this.watcher1.capture();
				if (!this.watcher2.getIsCaptured() && this.watcher2.pointer.getIsMove())
					this.watcher2.capture();
			
				pos1 = this.element.parent.pointFromWindow(new Point(this.watcher1.pointer.getX(), this.watcher1.pointer.getY()));
				pos2 = this.element.parent.pointFromWindow(new Point(this.watcher2.pointer.getX(), this.watcher2.pointer.getY()));

				start1 = this.element.parent.pointFromWindow(new Point(this.watcher1.pointer.getInitialX(), this.watcher1.pointer.getInitialY()));
				start2 = this.element.parent.pointFromWindow(new Point(this.watcher2.pointer.getInitialX(), this.watcher2.pointer.getInitialY()));

				let startVector:any = { x: start2.x - start1.x, y: start2.y - start1.y };
				let endVector:any = { x: pos2.x - pos1.x, y: pos2.y - pos1.y };
				startVector.norm = Math.sqrt((startVector.x * startVector.x) + (startVector.y * startVector.y));
				endVector.norm = Math.sqrt((endVector.x * endVector.x) + (endVector.y * endVector.y));

				let scale = endVector.norm / startVector.norm;

				startVector.x /= startVector.norm;
				startVector.y /= startVector.norm;

				endVector.x /= endVector.norm;
				endVector.y /= endVector.norm;

				let divVector = {
					x: (startVector.x * endVector.x + startVector.y * endVector.y),
					y: (startVector.y * endVector.x - startVector.x * endVector.y)
				};
				let angle = -(Math.atan2(divVector.y, divVector.x) * 180.0) / Math.PI;

				let deltaMatrix = Ui.Matrix.createTranslate(pos1.x - start1.x, pos1.y - start1.y).translate(start1.x, start1.y);
				if (this._allowScale) {
					if ((this._minScale !== undefined) || (this._maxScale !== undefined)) {
						let totalScale = this.startScale * scale;
						if ((this._minScale !== undefined) && (totalScale < this._minScale))
							totalScale = this._minScale;
						if ((this._maxScale !== undefined) && (totalScale > this._maxScale))
							totalScale = this._maxScale;
						scale = totalScale / this.startScale;
					}
					deltaMatrix = deltaMatrix.scale(scale, scale);
				}
				else
					scale = 1;
				if (this._allowRotate)
					deltaMatrix = deltaMatrix.rotate(angle);
				else
					angle = 0;
				deltaMatrix = deltaMatrix.translate(-start1.x, -start1.y);

				let origin = new Ui.Point(this.element.layoutWidth * this.element.transformOriginX, this.element.layoutHeight * this.element.transformOriginX);
				deltaMatrix = deltaMatrix.translate(origin.x, origin.y).
					translate(this.startTranslateX, this.startTranslateY).
					scale(this.startScale, this.startScale).
					rotate(this.startAngle).
					translate(-origin.x, -origin.y);
			
				origin = origin.multiply(deltaMatrix);

				this.setContentTransform(origin.x - this.element.layoutWidth * this.element.transformOriginX,
					origin.y - this.element.layoutHeight * this.element.transformOriginY,
					this.startScale * scale, this.startAngle + angle);
			}
			// 1 finger
			else if ((this.watcher1 !== undefined) && this._allowTranslate) {

				pos1 = this.element.parent.pointFromWindow(new Point(this.watcher1.pointer.getX(), this.watcher1.pointer.getY()));
				start1 = this.element.parent.pointFromWindow(new Point(this.watcher1.pointer.getInitialX(), this.watcher1.pointer.getInitialY()));

				let deltaX = pos1.x - start1.x;
				let deltaY = pos1.y - start1.y;
				let delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				this.setContentTransform(this.startTranslateX + (pos1.x - start1.x), this.startTranslateY + (pos1.y - start1.y),
					this.startScale, this.startAngle);
			
				let takenDeltaX = (this._translateX - this.startTranslateX);
				let takenDeltaY = (this._translateY - this.startTranslateY);
				let takenDelta = Math.sqrt(takenDeltaX * takenDeltaX + takenDeltaY * takenDeltaY);

				let test = 0;
				if (delta > 0)
					test = (takenDelta / delta);

				if (!this.watcher1.getIsCaptured() && this.watcher1.pointer.getIsMove() && (test > 0.7))
					this.watcher1.capture();
			
			}
		}

		protected onPointerCancel(watcher) {
			this.onPointerUp(watcher);
			this.stopInertia();

			// revert the changes
			this._angle = this.startAngle;
			this._scale = this.startScale;
			this._translateX = this.startTranslateX;
			this._translateY = this.startTranslateY;
		}

		protected onPointerUp(watcher) {
			if ((this.watcher1 !== undefined) && (this.watcher1 === watcher)) {
				if (this.watcher2 !== undefined) {
					this.watcher1.unwatch();
					this.watcher1 = this.watcher2;
					delete(this.watcher2);
					this.watcher1.pointer.setInitialPosition(this.watcher1.pointer.getX(), this.watcher1.pointer.getY());
					this.startAngle = this._angle;
					this.startScale = this._scale;
					this.startTranslateX = this._translateX;
					this.startTranslateY = this._translateY;
					if (!this._allowTranslate)
						this.onUp();
				}
				else {
					if (this._allowTranslate)
						this.onUp();
				
					let speed = this.watcher1.getSpeed();
					this.speedX = speed.x;
					this.speedY = speed.y;
					this.watcher1.unwatch();
					delete(this.watcher1);
					this.startInertia();
				}
			}
			if ((this.watcher2 !== undefined) && (this.watcher2 === watcher)) {
				this.watcher2.unwatch();
				delete(this.watcher2);
				this.watcher1.pointer.setInitialPosition(this.watcher1.pointer.getX(), this.watcher1.pointer.getY());
				this.startAngle = this._angle;
				this.startScale = this._scale;
				this.startTranslateX = this._translateX;
				this.startTranslateY = this._translateY;
				if (!this._allowTranslate)
					this.onUp();
			}
		}

		protected onWheel(event: WheelEvent) {
			let delta = 0;

			delta = event.deltaX + event.deltaY;

			if (event.altKey) {
				if (this._allowRotate) {
					let angle = delta / 5;
					let pos = this.element.parent.pointFromWindow(new Point(event.clientX, event.clientY));
					let origin = new Ui.Point(
						this.element.layoutX + this.element.layoutWidth * this.element.transformOriginX,
						this.element.layoutY + this.element.layoutHeight * this.element.transformOriginY);
					
					let deltaMatrix = Ui.Matrix.createTranslate(pos.x, pos.y).
						rotate(angle).
						translate(origin.x, origin.y).
						translate(-pos.x, -pos.y).
						translate(this._translateX, this._translateY).
						scale(this._scale, this._scale).
						rotate(this._angle).
						translate(-origin.x, -origin.y);

					let newOrigin = origin.multiply(deltaMatrix);
					this.setContentTransform(newOrigin.x - origin.x, newOrigin.y - origin.y,
						this._scale, this._angle + angle);
				}
			}
			else if (event.ctrlKey) {
				if (this._allowScale) {
					let scale = Math.pow(2, (Math.log(this._scale) / Math.log(2)) - delta / 60);
					if ((this._minScale !== undefined) && (scale < this._minScale))
						scale = this._minScale;
					if ((this._maxScale !== undefined) && (scale > this._maxScale))
						scale = this._maxScale;
					let deltaScale = scale / this._scale;

					let pos = this.element.parent.pointFromWindow(new Point(event.clientX, event.clientY));
					let origin = new Ui.Point(
						this.element.layoutX + this.element.layoutWidth * this.element.transformOriginX,
						this.element.layoutY + this.element.layoutHeight * this.element.transformOriginY);

					let deltaMatrix = Ui.Matrix.createTranslate(pos.x, pos.y).
						scale(deltaScale, deltaScale).
						translate(-pos.x, -pos.y).
						translate(origin.x, origin.y).
						translate(this._translateX, this._translateY).
						scale(this._scale, this._scale).
						rotate(this._angle).
						translate(-origin.x, -origin.y);
				
					let newOrigin = origin.multiply(deltaMatrix);
					this.setContentTransform(newOrigin.x - origin.x, newOrigin.y - origin.y,
						scale, this._angle);
				}
			}
			else
				return;

			event.stopPropagation();
		}

		startInertia() {
			if ((this.inertiaClock === undefined) && this.inertia) {
				this.inertiaClock = new Anim.Clock({ duration: 'forever', target: this.element });
				this.inertiaClock.timeupdate.connect((e) => this.onTimeupdate(e.target, e.progress, e.deltaTick));
				this.inertiaClock.begin();
				if (this.inertiastart)
					this.inertiastart(this);
			}
		}

		protected onTimeupdate(clock, progress, delta) {
			if (delta === 0)
				return;
		
			let oldTranslateX = this._translateX;
			let oldTranslateY = this._translateY;

			let translateX = this._translateX + (this.speedX * delta);
			let translateY = this._translateY + (this.speedY * delta);

			this.setContentTransform(translateX, translateY, undefined, undefined);

			if ((this._translateX === oldTranslateX) && (this._translateY === oldTranslateY)) {
				this.stopInertia();
				return;
			}
			this.speedX -= this.speedX * delta * 3;
			this.speedY -= this.speedY * delta * 3;

			if (Math.abs(this.speedX) < 0.1)
				this.speedX = 0;
			if (Math.abs(this.speedY) < 0.1)
				this.speedY = 0;
			if ((this.speedX === 0) && (this.speedY === 0))
				this.stopInertia();
		}
	
		stopInertia() {
			if (this.inertiaClock !== undefined) {
				this.inertiaClock.stop();
				delete(this.inertiaClock);
				// align to the nearest translate integer position
				// to avoid fuzzy graphics. Might be a bad idea when scale is used
				this.setContentTransform(Math.round(this._translateX), Math.round(this._translateY), undefined, undefined);

				if (this.inertiaend)
					this.inertiaend(this);
			}
		}
	}

	export interface TransformableInit {
		inertia?: boolean;
		allowLeftMouse?: boolean;
		allowScale?: boolean;
		minScale?: number;
		maxScale?: number;
		allowRotate?: boolean;
		allowTranslate?: boolean;
		angle?: number;
		scale?: number;
		translateX?: number;
		translateY?: number;
		content: Element;
		ondowned?: (event: { target: Transformable }) => void;
		onupped?: (event: { target: Transformable }) => void;
		ontransformed?: (event: { target: Transformable }) => void;
		oninertiastarted?: (event: { target: Transformable }) => void;
		oninertiaended?: (event: { target: Transformable }) => void;
	}

	export class Transformable extends LBox {
		private _inertia: boolean = false;
		protected inertiaClock: Anim.Clock;
		protected contentBox: LBox;

		private _isDown: boolean = false;
		private transformLock: boolean = false;

		private watcher1: PointerWatcher;
		private watcher2: PointerWatcher;

		private _angle: number = 0;
		private _scale: number= 1;
		private _translateX: number = 0;
		private _translateY: number = 0;

		private startAngle: number = 0;
		private startScale: number = 0;
		private startTranslateX: number = 0;
		private startTranslateY: number = 0;

		private _allowScale: boolean = true;
		private _minScale: number = 0.1;
		private _maxScale: number = 10;
		private _allowRotate: boolean = true;
		private _allowTranslate: boolean = true;
		private _allowLeftMouse: boolean = true;

		private speedX: number = 0;
		private speedY: number = 0;

		readonly downed = new Core.Events<{ target: Transformable }>();
		set ondowned(value: (event: { target: Transformable}) => void) { this.downed.connect(value); }
		readonly upped = new Core.Events<{ target: Transformable }>();
		set onupped(value: (event: { target: Transformable}) => void) { this.upped.connect(value); }
		readonly transformed = new Core.Events<{ target: Transformable }>();
		set ontransformed(value: (event: { target: Transformable}) => void) { this.transformed.connect(value); }
		readonly inertiastarted = new Core.Events<{ target: Transformable }>();
		set oninertiastarted(value: (event: { target: Transformable}) => void) { this.inertiastarted.connect(value); }
		readonly inertiaended = new Core.Events<{ target: Transformable }>();
		set oninertiaended(value: (event: { target: Transformable}) => void) { this.inertiaended.connect(value); }

		constructor(init?: TransformableInit) {
			super();
			this.focusable = true;
			this.drawing.style.touchAction = 'none';
			
			this.contentBox = new Ui.LBox();
			this.contentBox.setTransformOrigin(0, 0, true);
			this.appendChild(this.contentBox);

			this.ptrdowned.connect((e) => this.onPointerDown(e));

			this.wheelchanged.connect(e => this.onWheel(e));

			if (init) {
				if (init.inertia !== undefined)
					this.inertia = init.inertia;	
				if (init.allowLeftMouse !== undefined)
					this.allowLeftMouse = init.allowLeftMouse;	
				if (init.allowScale !== undefined)
					this.allowScale = init.allowScale;
				if (init.minScale !== undefined)
					this.minScale = init.minScale;	
				if (init.maxScale !== undefined)
					this.maxScale = init.maxScale;	
				if (init.allowRotate !== undefined)
					this.allowRotate = init.allowRotate;
				if (init.allowTranslate !== init.allowTranslate)
					this.allowTranslate = init.allowTranslate;	
				if (init.angle !== undefined)
					this.angle = init.angle;
				if (init.scale !== undefined)
					this.scale = init.scale;
				if (init.translateX !== undefined)
					this.translateX = init.translateX;
				if (init.translateY !== undefined)
					this.translateY = init.translateY;
				if (init.content !== undefined)
					this.content = init.content;
				if (init.ondowned)
					this.downed.connect(init.ondowned);	
				if (init.onupped)
					this.upped.connect(init.onupped);	
				if (init.ontransformed)
					this.transformed.connect(init.ontransformed);	
				if (init.oninertiastarted)
					this.inertiastarted.connect(init.oninertiastarted);	
				if (init.oninertiaended)
					this.inertiaended.connect(init.oninertiaended);
			}
		}

		set allowLeftMouse(value: boolean) {
			this._allowLeftMouse = value;
		}

		set allowScale(allow: boolean) {
			this._allowScale = allow;
		}

		set minScale(minScale: number) {
			this._minScale = minScale;
		}

		set maxScale(maxScale: number) {
			this._maxScale = maxScale;
		}

		set allowRotate(allow: boolean) {
			this._allowRotate = allow;
		}

		set allowTranslate(allow: boolean) {
			this._allowTranslate = allow;
		}

		get isDown(): boolean {
			return this._isDown;
		}

		get isInertia(): boolean {
			return this.inertiaClock !== undefined;
		}

		get angle(): number {
			return this._angle;
		}

		set angle(angle: number) {
			this.setContentTransform(undefined, undefined, undefined, angle);
		}

		get scale(): number {
			return this._scale;
		}

		set scale(scale: number) {
			this.setContentTransform(undefined, undefined, scale, undefined);
		}

		get translateX(): number {
			return this._translateX;
		}

		set translateX(translateX: number) {
			this.setContentTransform(translateX, undefined, undefined, undefined);
		}

		get translateY(): number {
			return this._translateY;
		}

		set translateY(translateY: number) {
			this.setContentTransform(undefined, translateY, undefined, undefined);
		}

		private buildMatrix(translateX: number, translateY: number, scale: number, angle: number): Matrix {
			if (translateX === undefined)
				translateX = this._translateX;
			if (translateY === undefined)
				translateY = this._translateY;
			if (scale === undefined)
				scale = this._scale;
			if (angle === undefined)
				angle = this._angle;

			return Ui.Matrix.createTranslate(this.layoutWidth * this.transformOriginX, this.layoutHeight * this.transformOriginX).
				translate(translateX, translateY).
				scale(scale, scale).
				rotate(angle).
				translate(-this.layoutWidth * this.transformOriginX, -this.layoutHeight * this.transformOriginX);
		}

		get matrix(): Matrix {
			return Ui.Matrix.createTranslate(this.layoutWidth * this.transformOriginX, this.layoutHeight * this.transformOriginX).
				translate(this._translateX, this._translateY).
				scale(this._scale, this._scale).
				rotate(this._angle).
				translate(-this.layoutWidth * this.transformOriginX, -this.layoutHeight * this.transformOriginX);
		}

		getBoundaryBox(matrix) {
			if (matrix === undefined)
				matrix = this.matrix;
			let p1 = (new Ui.Point(0, 0)).multiply(matrix);
			let p2 = (new Ui.Point(this.layoutWidth, 0)).multiply(matrix);
			let p3 = (new Ui.Point(this.layoutWidth, this.layoutHeight)).multiply(matrix);
			let p4 = (new Ui.Point(0, this.layoutHeight)).multiply(matrix);

			let minX = Math.min(p1.x, Math.min(p2.x, Math.min(p3.x, p4.x)));
			let minY = Math.min(p1.y, Math.min(p2.y, Math.min(p3.y, p4.y)));
			let maxX = Math.max(p1.x, Math.max(p2.x, Math.max(p3.x, p4.x)));
			let maxY = Math.max(p1.y, Math.max(p2.y, Math.max(p3.y, p4.y)));

			return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
		}

		setContentTransform(translateX, translateY, scale, angle) {
			if (translateX === undefined)
				translateX = this._translateX;
			if (translateY === undefined)
				translateY = this._translateY;
			if (scale === undefined)
				scale = this._scale;
			if (angle === undefined)
				angle = this._angle;
			this._translateX = translateX;
			this._translateY = translateY;
			this._scale = scale;
			this._angle = angle;

			if (!this.transformLock) {
				this.transformLock = true;
				this.transformed.fire({ target: this });

				let testOnly = !(((this.watcher1 === undefined) || this.watcher1.getIsCaptured()) &&
					((this.watcher2 === undefined) || this.watcher2.getIsCaptured()));

				this.onContentTransform(testOnly);
				this.transformLock = false;
			}
		}

		get inertia(): boolean {
			return this._inertia;
		}

		set inertia(inertiaActive: boolean) {
			this._inertia = inertiaActive;
		}

		protected onContentTransform(testOnly: boolean = false) {
			if (testOnly !== true)
				this.contentBox.transform = this.matrix;
		}

		protected onDown() {
			this._isDown = true;
			this.downed.fire({ target: this });
		}

		protected onUp() {
			this._isDown = false;
			this.upped.fire({ target: this });
		}
	
		protected onPointerDown(event: PointerEvent) {
			if (!this._allowLeftMouse && event.pointerType == 'mouse' && event.pointer.button == 0)
				return;	
			
			this.stopInertia();

			if (this.watcher1 === undefined) {
				if (this._allowTranslate)
					this.onDown();
			
				let watcher = event.pointer.watch(this);
				this.watcher1 = watcher;
				watcher.moved.connect(e => this.onPointerMove(e.target));
				watcher.upped.connect(e => this.onPointerUp(e.target));
				watcher.cancelled.connect(e => this.onPointerCancel(e.target));

				this.startAngle = this._angle;
				this.startScale = this._scale;
				this.startTranslateX = this._translateX;
				this.startTranslateY = this._translateY;
			}
			else if (this.watcher2 === undefined) {
				if (!this._allowTranslate)
					this.onDown();
			
				this.watcher1.pointer.setInitialPosition(this.watcher1.pointer.getX(), this.watcher1.pointer.getY());

				let watcher = event.pointer.watch(this);
				this.watcher2 = watcher;
				watcher.moved.connect(e => this.onPointerMove(e.target));
				watcher.upped.connect(e => this.onPointerUp(e.target));
				watcher.cancelled.connect(e => this.onPointerUp(e.target));

				this.startAngle = this._angle;
				this.startScale = this._scale;
				this.startTranslateX = this._translateX;
				this.startTranslateY = this._translateY;
			}
		}

		protected onPointerMove(watcher) {
			let pos1; let pos2; let start1; let start2;
			
			// 2 fingers
			if ((this.watcher1 !== undefined) && (this.watcher2 !== undefined)) {

				if (!this.watcher1.getIsCaptured() && this.watcher1.pointer.getIsMove())
					this.watcher1.capture();
				if (!this.watcher2.getIsCaptured() && this.watcher2.pointer.getIsMove())
					this.watcher2.capture();
			
				pos1 = this.pointFromWindow(new Point(this.watcher1.pointer.getX(), this.watcher1.pointer.getY()));
				pos2 = this.pointFromWindow(new Point(this.watcher2.pointer.getX(), this.watcher2.pointer.getY()));

				start1 = this.pointFromWindow(new Point(this.watcher1.pointer.getInitialX(), this.watcher1.pointer.getInitialY()));
				start2 = this.pointFromWindow(new Point(this.watcher2.pointer.getInitialX(), this.watcher2.pointer.getInitialY()));

				let startVector:any = { x: start2.x - start1.x, y: start2.y - start1.y };
				let endVector:any = { x: pos2.x - pos1.x, y: pos2.y - pos1.y };
				startVector.norm = Math.sqrt((startVector.x * startVector.x) + (startVector.y * startVector.y));
				endVector.norm = Math.sqrt((endVector.x * endVector.x) + (endVector.y * endVector.y));

				let scale = endVector.norm / startVector.norm;

				startVector.x /= startVector.norm;
				startVector.y /= startVector.norm;

				endVector.x /= endVector.norm;
				endVector.y /= endVector.norm;

				let divVector = {
					x: (startVector.x * endVector.x + startVector.y * endVector.y),
					y: (startVector.y * endVector.x - startVector.x * endVector.y)
				};
				let angle = -(Math.atan2(divVector.y, divVector.x) * 180.0) / Math.PI;

				let deltaMatrix = Ui.Matrix.createTranslate(pos1.x - start1.x, pos1.y - start1.y).translate(start1.x, start1.y);
				if (this._allowScale) {
					if ((this._minScale !== undefined) || (this._maxScale !== undefined)) {
						let totalScale = this.startScale * scale;
						if ((this._minScale !== undefined) && (totalScale < this._minScale))
							totalScale = this._minScale;
						if ((this._maxScale !== undefined) && (totalScale > this._maxScale))
							totalScale = this._maxScale;
						scale = totalScale / this.startScale;
					}
					deltaMatrix = deltaMatrix.scale(scale, scale);
				}
				else
					scale = 1;
				if (this._allowRotate)
					deltaMatrix = deltaMatrix.rotate(angle);
				else
					angle = 0;
				deltaMatrix = deltaMatrix.translate(-start1.x, -start1.y);

				let origin = new Ui.Point(this.layoutWidth * this.transformOriginX, this.layoutHeight * this.transformOriginX);
				deltaMatrix = deltaMatrix.translate(origin.x, origin.y).
					translate(this.startTranslateX, this.startTranslateY).
					scale(this.startScale, this.startScale).
					rotate(this.startAngle).
					translate(-origin.x, -origin.y);
			
				origin = origin.multiply(deltaMatrix);

				this.setContentTransform(origin.x - this.layoutWidth * this.transformOriginX,
					origin.y - this.layoutHeight * this.transformOriginY,
					this.startScale * scale, this.startAngle + angle);
			}
			// 1 finger
			else if ((this.watcher1 !== undefined) && this._allowTranslate) {

				pos1 = this.pointFromWindow(new Point(this.watcher1.pointer.getX(), this.watcher1.pointer.getY()));
				start1 = this.pointFromWindow(new Point(this.watcher1.pointer.getInitialX(), this.watcher1.pointer.getInitialY()));

				let deltaX = pos1.x - start1.x;
				let deltaY = pos1.y - start1.y;
				let delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				this.setContentTransform(this.startTranslateX + (pos1.x - start1.x), this.startTranslateY + (pos1.y - start1.y),
					this.startScale, this.startAngle);
			
				let takenDeltaX = (this._translateX - this.startTranslateX);
				let takenDeltaY = (this._translateY - this.startTranslateY);
				let takenDelta = Math.sqrt(takenDeltaX * takenDeltaX + takenDeltaY * takenDeltaY);

				let test = 0;
				if (delta > 0)
					test = (takenDelta / delta);

				if (!this.watcher1.getIsCaptured() && this.watcher1.pointer.getIsMove() && (test > 0.7))
					this.watcher1.capture();
			
			}
		}

		protected onPointerCancel(watcher) {
			this.onPointerUp(watcher);
			this.stopInertia();

			// revert the changes
			this._angle = this.startAngle;
			this._scale = this.startScale;
			this._translateX = this.startTranslateX;
			this._translateY = this.startTranslateY;
		}

		protected onPointerUp(watcher) {
			if ((this.watcher1 !== undefined) && (this.watcher1 === watcher)) {
				if (this.watcher2 !== undefined) {
					this.watcher1.unwatch();
					this.watcher1 = this.watcher2;
					delete(this.watcher2);
					this.watcher1.pointer.setInitialPosition(this.watcher1.pointer.getX(), this.watcher1.pointer.getY());
					this.startAngle = this._angle;
					this.startScale = this._scale;
					this.startTranslateX = this._translateX;
					this.startTranslateY = this._translateY;
					if (!this._allowTranslate)
						this.onUp();
				}
				else {
					if (this._allowTranslate)
						this.onUp();
				
					let speed = this.watcher1.getSpeed();
					this.speedX = speed.x;
					this.speedY = speed.y;
					this.watcher1.unwatch();
					delete(this.watcher1);
					this.startInertia();
				}
			}
			if ((this.watcher2 !== undefined) && (this.watcher2 === watcher)) {
				this.watcher2.unwatch();
				delete(this.watcher2);
				this.watcher1.pointer.setInitialPosition(this.watcher1.pointer.getX(), this.watcher1.pointer.getY());
				this.startAngle = this._angle;
				this.startScale = this._scale;
				this.startTranslateX = this._translateX;
				this.startTranslateY = this._translateY;
				if (!this._allowTranslate)
					this.onUp();
			}
		}

		protected onWheel(event: WheelEvent) {
			let delta = 0;

			delta = event.deltaX + event.deltaY;

			if (event.altKey) {
				if (this._allowRotate) {
					let angle = delta / 5;

					let pos = this.pointFromWindow(new Point(event.clientX, event.clientY));
					let origin = new Ui.Point(this.layoutWidth * this.transformOriginX, this.layoutHeight * this.transformOriginX);

					let deltaMatrix = Ui.Matrix.createTranslate(pos.x, pos.y).
						rotate(angle).
						translate(-pos.x, -pos.y).
						translate(origin.x, origin.y).
						translate(this._translateX, this._translateY).
						scale(this._scale, this._scale).
						rotate(this._angle).
						translate(-origin.x, -origin.y);

					origin = origin.multiply(deltaMatrix);

					this.setContentTransform(origin.x - this.layoutWidth * this.transformOriginX,
						origin.y - this.layoutHeight * this.transformOriginY,
						this._scale, this._angle + angle);
				}
			}
			else if (event.ctrlKey) {
				if (this._allowScale) {
					let scale = Math.pow(2, (Math.log(this._scale) / Math.log(2)) - delta / 60);
					if ((this._minScale !== undefined) && (scale < this._minScale))
						scale = this._minScale;
					if ((this._maxScale !== undefined) && (scale > this._maxScale))
						scale = this._maxScale;
				
					let deltaScale = scale / this._scale;

					let pos = this.pointFromWindow(new Point(event.clientX, event.clientY));
					let origin = new Ui.Point(this.layoutWidth * this.transformOriginX, this.layoutHeight * this.transformOriginX);

					let deltaMatrix = Ui.Matrix.createTranslate(pos.x, pos.y).
						scale(deltaScale, deltaScale).
						translate(-pos.x, -pos.y).
						translate(origin.x, origin.y).
						translate(this._translateX, this._translateY).
						scale(this._scale, this._scale).
						rotate(this._angle).
						translate(-origin.x, -origin.y);
				
					origin = origin.multiply(deltaMatrix);

					this.setContentTransform(origin.x - this.layoutWidth * this.transformOriginX,
						origin.y - this.layoutHeight * this.transformOriginY,
						scale, this._angle);
				}
			}
			else
				return;

			event.stopPropagation();
		}

		startInertia() {
			if ((this.inertiaClock === undefined) && this.inertia) {
				this.inertiaClock = new Anim.Clock({ duration: 'forever', target: this });
				this.inertiaClock.timeupdate.connect((e) => this.onTimeupdate(e.target, e.progress, e.deltaTick));
				this.inertiaClock.begin();
				this.inertiastarted.fire({ target: this });
			}
		}

		protected onTimeupdate(clock, progress, delta) {
			if (delta === 0)
				return;
		
			let oldTranslateX = this._translateX;
			let oldTranslateY = this._translateY;

			let translateX = this._translateX + (this.speedX * delta);
			let translateY = this._translateY + (this.speedY * delta);

			this.setContentTransform(translateX, translateY, undefined, undefined);

			if ((this._translateX === oldTranslateX) && (this._translateY === oldTranslateY)) {
				this.stopInertia();
				return;
			}
			this.speedX -= this.speedX * delta * 3;
			this.speedY -= this.speedY * delta * 3;

			if (Math.abs(this.speedX) < 0.1)
				this.speedX = 0;
			if (Math.abs(this.speedY) < 0.1)
				this.speedY = 0;
			if ((this.speedX === 0) && (this.speedY === 0))
				this.stopInertia();
		}
	
		stopInertia() {
			if (this.inertiaClock !== undefined) {
				this.inertiaClock.stop();
				delete(this.inertiaClock);
				// align to the nearest translate integer position
				// to avoid fuzzy graphics. Might be a bad idea when scale is used
				this.setContentTransform(Math.round(this._translateX), Math.round(this._translateY), undefined, undefined);

				this.inertiaended.fire({ target: this });
			}
		}

		get content(): Element {
			return this.contentBox.firstChild;
		}

		set content(content: Element) {
			this.contentBox.content = content;
		}

		protected arrangeCore(width, height) {
			super.arrangeCore(width, height);
			this.onContentTransform();
		}
	}
}	
