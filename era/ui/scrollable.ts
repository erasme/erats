namespace Ui
{
	export interface ScrollableInit extends ContainerInit
	{
		maxScale: number;
		content: Element;
		inertia: boolean;
		scrollHorizontal: boolean;
		scrollVertical: boolean;
		scale: number;
	}

	export class Scrollable extends Container implements ScrollableInit
	{
		private contentBox: ScrollableContent = undefined;
		private _scrollHorizontal: boolean = true;
		private _scrollVertical: boolean = true;
		scrollbarHorizontalBox: Movable;
		scrollbarVerticalBox: Movable;
		showShadows: boolean = false;
		lock: boolean = false;
		isOver: boolean = false;
		protected showClock: Anim.Clock = undefined;
		offsetX: number = 0;
		offsetY: number = 0;
		relativeOffsetX: number = 0;
		relativeOffsetY: number = 0;
		viewWidth: number = 0;
		viewHeight: number = 0;
		contentWidth: number = 0;
		contentHeight: number = 0;
		protected overWatcher: PointerWatcher = undefined;
		scrollLock: boolean = false;
		scrollbarVerticalNeeded: boolean = false;
		scrollbarHorizontalNeeded: boolean = false;
		scrollbarVerticalHeight: number = 0;
		scrollbarHorizontalWidth: number = 0;

		constructor(init?: Partial<ScrollableInit>) {
			super();
			this.addEvents('scroll');
			this.contentBox = new Ui.ScrollableContent();
			this.connect(this.contentBox, 'scroll', this.onScroll);
			this.connect(this.contentBox, 'down', this.autoShowScrollbars);
			this.connect(this.contentBox, 'inertiaend', this.autoHideScrollbars);
			this.appendChild(this.contentBox);

			this.connect(this, 'ptrmove', (event: PointerEvent) => {
				if (!this.isDisabled && !event.pointer.getIsDown() && (this.overWatcher === undefined)) {
					this.overWatcher = event.pointer.watch(this);
					this.isOver = true;
					// enter
					this.autoShowScrollbars();

					this.connect(this.overWatcher, 'move', () => {
						if (!this.overWatcher.getIsInside())
							this.overWatcher.cancel();
					});
					this.connect(this.overWatcher, 'down', () => {
						this.overWatcher.cancel();
					});
					this.connect(this.overWatcher, 'up', () => {
						this.overWatcher.cancel();
					});
					this.connect(this.overWatcher, 'cancel', () => {
						this.overWatcher = undefined;
						this.isOver = false;
						// leave
						this.autoHideScrollbars();
					});
				}
			});

			this.connect(this, 'wheel', this.onWheel);
			if (init)
				this.assign(init);
		}

		set maxScale(maxScale: number) {
			this.contentBox.maxScale = maxScale;
		}

		set content(content: Element) {
			this.setContent(content);
		}

		get content(): Element {
			return this.contentBox.content;
		}

		protected setContent(content: Element) {
			this.contentBox.content = content;
		}

		get inertia(): boolean {
			return this.contentBox.inertia;
		}

		set inertia(inertiaActive: boolean) {
			this.contentBox.inertia = inertiaActive;
		}

		get scrollHorizontal(): boolean {
			return this._scrollHorizontal;
		}
	
		set scrollHorizontal(scroll: boolean) {
			if (scroll !== this._scrollHorizontal) {
				this._scrollHorizontal = scroll;
				this.invalidateMeasure();
			}
		}

		get scrollVertical(): boolean {
			return this._scrollVertical;
		}

		set scrollVertical(scroll: boolean) {
			if (scroll !== this._scrollVertical) {
				this._scrollVertical = scroll;
				this.invalidateMeasure();
			}
		}

		setScrollbarVertical(scrollbarVertical: Movable) {
			if (this.scrollbarVerticalBox) {
				this.disconnect(this.scrollbarVerticalBox, 'down', this.autoShowScrollbars);
				this.disconnect(this.scrollbarVerticalBox, 'up', this.autoHideScrollbars);
				this.disconnect(this.scrollbarVerticalBox, 'move', this.onScrollbarVerticalMove);
				this.removeChild(this.scrollbarVerticalBox);
			}
			if (scrollbarVertical) {
				this.scrollbarVerticalBox = scrollbarVertical;
				this.scrollbarVerticalBox.opacity = 0;
				this.scrollbarVerticalBox.moveHorizontal = false;
				this.connect(this.scrollbarVerticalBox, 'down', this.autoShowScrollbars);
				this.connect(this.scrollbarVerticalBox, 'up', this.autoHideScrollbars);
				this.connect(this.scrollbarVerticalBox, 'move', this.onScrollbarVerticalMove);
				this.appendChild(this.scrollbarVerticalBox);
			}
		}

		setScrollbarHorizontal(scrollbarHorizontal: Movable) {
			if (this.scrollbarHorizontalBox) {
				this.disconnect(this.scrollbarHorizontalBox, 'down', this.autoShowScrollbars);
				this.disconnect(this.scrollbarHorizontalBox, 'up', this.autoHideScrollbars);
				this.disconnect(this.scrollbarHorizontalBox, 'move', this.onScrollbarHorizontalMove);
				this.removeChild(this.scrollbarHorizontalBox);
			}
			if (scrollbarHorizontal) {
				this.scrollbarHorizontalBox = scrollbarHorizontal;
				this.scrollbarHorizontalBox.opacity = 0;
				this.scrollbarHorizontalBox.moveVertical = false;
				this.connect(this.scrollbarHorizontalBox, 'down', this.autoShowScrollbars);
				this.connect(this.scrollbarHorizontalBox, 'up', this.autoHideScrollbars);
				this.connect(this.scrollbarHorizontalBox, 'move', this.onScrollbarHorizontalMove);
				this.appendChild(this.scrollbarHorizontalBox);
			}
		}
	
		setOffset(offsetX: number, offsetY: number, absolute: boolean = false) {

			if (absolute === undefined)
				absolute = false;
			if (offsetX === undefined)
				offsetX = this.offsetX;
			else if (!absolute)
				offsetX *= this.contentWidth - this.viewWidth;
			if (offsetY === undefined)
				offsetY = this.offsetY;
			else if (!absolute)
				offsetY *= this.contentHeight - this.viewHeight;

			if (offsetX < 0)
				offsetX = 0;
			else if (this.viewWidth + offsetX > this.contentWidth)
				offsetX = this.contentWidth - this.viewWidth;
			if (offsetY < 0)
				offsetY = 0;
			else if (this.viewHeight + offsetY > this.contentHeight)
				offsetY = this.contentHeight - this.viewHeight;

			if (this.contentWidth <= this.viewWidth)
				this.relativeOffsetX = 0;
			else
				this.relativeOffsetX = offsetX / (this.contentWidth - this.viewWidth);
			if (this.contentHeight <= this.viewHeight)
				this.relativeOffsetY = 0;
			else
				this.relativeOffsetY = offsetY / (this.contentHeight - this.viewHeight);

			if ((this.offsetX !== offsetX) || (this.offsetY !== offsetY)) {
				this.offsetX = offsetX;
				this.offsetY = offsetY;
				this.contentBox.setOffset(offsetX, offsetY);
				return true;
			}
			else
				return false;
		}

		getOffsetX() {
			return this.contentBox.offsetX;
		}

		getRelativeOffsetX() {
			return this.relativeOffsetX;
		}

		getOffsetY() {
			return this.contentBox.offsetY;
		}
	
		getRelativeOffsetY() {
			return this.relativeOffsetY;
		}

		get scale(): number {
			return this.contentBox.scale;
		}

		set scale(scale: number) {
			this.contentBox.scale = scale;
		}

		get isDown(): boolean {
			return this.contentBox.isDown;
		}

		get isInertia(): boolean {
			return this.contentBox.isInertia;
		}

		protected onWheel(event: WheelEvent) {
			if (this.setOffset(this.contentBox.offsetX + event.deltaX * 3, this.contentBox.offsetY + event.deltaY * 3, true)) {
				event.stopPropagation();
			}
		}

		autoShowScrollbars(): void {
			if (this.showClock === undefined) {
				this.showClock = new Anim.Clock({ duration: 'forever' });
				this.connect(this.showClock, 'timeupdate', this.onShowBarsTick);
				this.showClock.begin();
			}
		}

		autoHideScrollbars(): void {
			if (this.contentBox.isDown || this.contentBox.isInertia || this.isOver)
				return;
			if (this.showClock === undefined) {
				this.showClock = new Anim.Clock({ duration: 'forever' });
				this.connect(this.showClock, 'timeupdate', this.onShowBarsTick);
				this.showClock.begin();
			}
		}

		protected onShowBarsTick(clock: Anim.Clock, progress: number, delta: number) {
			let show = this.contentBox.isDown || this.contentBox.isInertia || this.isOver;
			if (this.scrollbarVerticalBox)
				show = show || this.scrollbarVerticalBox.isDown;
			if (this.scrollbarHorizontalBox)
				show = show || this.scrollbarHorizontalBox.isDown;
			let stop = false;
			let speed = 2;

			let opacity = this.scrollbarHorizontalBox.opacity;
			if (show) {
				opacity += (delta * speed);
				if (opacity >= 1) {
					opacity = 1;
					stop = true;
				}
			}
			else {
				opacity -= (delta * speed);
				if (opacity <= 0) {
					opacity = 0;
					stop = true;
				}
			}
			if (this.scrollbarHorizontalBox)
				this.scrollbarHorizontalBox.opacity = opacity;
			if (this.scrollbarVerticalBox)
				this.scrollbarVerticalBox.opacity = opacity;
			if (stop) {
				this.showClock.stop();
				this.showClock = undefined;
			}
		}

		protected onScroll() {
			this.updateOffset();
			this.fireEvent('scroll', this, this.offsetX, this.offsetY);
		}

		updateOffset() {
			if (this.contentBox === undefined)
				return;
		
			this.offsetX = this.contentBox.offsetX;
			this.offsetY = this.contentBox.offsetY;

			this.viewWidth = this.layoutWidth;
			this.viewHeight = this.layoutHeight;

			this.contentWidth = this.contentBox.contentWidth;
			this.contentHeight = this.contentBox.contentHeight;

			if (this.contentWidth <= this.viewWidth)
				this.relativeOffsetX = 0;
			else
				this.relativeOffsetX = this.offsetX / (this.contentWidth - this.viewWidth);
			if (this.contentHeight <= this.viewHeight)
				this.relativeOffsetY = 0;
			else
				this.relativeOffsetY = this.offsetY / (this.contentHeight - this.viewHeight);

			if (this.contentHeight > this.viewHeight)
				this.scrollbarVerticalNeeded = true;
			else
				this.scrollbarVerticalNeeded = false;
			if (this.contentWidth > this.viewWidth)
				this.scrollbarHorizontalNeeded = true;
			else
				this.scrollbarHorizontalNeeded = false;
	
			//		console.log('updateOffset content size: '+this.contentWidth+'x'+this.contentHeight+', scroll vert: '+this.scrollbarVerticalNeeded);

			
			if (this.scrollbarVerticalNeeded) {
				if (this.scrollbarVerticalBox) {
					this.scrollbarVerticalHeight = Math.max((this.viewHeight / this.contentHeight) * this.viewHeight, this.scrollbarVerticalBox.measureHeight);
					//			console.log('vert scroll bar size: '+this.scrollbarVerticalBox.measureWidth);
					this.scrollbarVerticalBox.arrange(this.layoutWidth - this.scrollbarVerticalBox.measureWidth, 0,
						this.scrollbarVerticalBox.measureWidth, this.scrollbarVerticalHeight);
					this.scrollbarVerticalBox.show();
				}	
			}
			else {
				if (this.scrollbarVerticalBox)
					this.scrollbarVerticalBox.hide();
				this.offsetY = 0;
			}
		
			
			if (this.scrollbarHorizontalNeeded) {
				if (this.scrollbarHorizontalBox) {
					this.scrollbarHorizontalWidth = Math.max((this.viewWidth / this.contentWidth) * this.viewWidth, this.scrollbarHorizontalBox.measureWidth);
					this.scrollbarHorizontalBox.arrange(0, this.layoutHeight - this.scrollbarHorizontalBox.measureHeight,
						this.scrollbarHorizontalWidth, this.scrollbarHorizontalBox.measureHeight);
					this.scrollbarHorizontalBox.show();
				}	
			}
			else {
				if (this.scrollbarHorizontalBox)
					this.scrollbarHorizontalBox.hide();
				this.offsetX = 0;
			}	

			this.scrollLock = true;
			if (this.scrollbarHorizontalNeeded) {
				let relOffsetX = this.offsetX / (this.contentWidth - this.viewWidth);
				if (relOffsetX > 1) {
					relOffsetX = 1;
					this.setOffset(relOffsetX, undefined);
				}
				if (this.scrollbarHorizontalBox)
					this.scrollbarHorizontalBox.setPosition((this.viewWidth - this.scrollbarHorizontalWidth) * relOffsetX, undefined);
			}
			if (this.scrollbarVerticalNeeded) {
				let relOffsetY = this.offsetY / (this.contentHeight - this.viewHeight);
				if (relOffsetY > 1) {
					relOffsetY = 1;
					this.setOffset(undefined, relOffsetY);
				}
				if (this.scrollbarVerticalBox)
					this.scrollbarVerticalBox.setPosition(undefined, (this.viewHeight - this.scrollbarVerticalHeight) * relOffsetY);
			}
			this.scrollLock = false;
		}

		protected onScrollbarHorizontalMove(movable: Movable) {
			if (this.scrollLock)
				return;
			let totalWidth = this.viewWidth - this.scrollbarHorizontalBox.layoutWidth;
			let offsetX = Math.min(1, Math.max(0, movable.positionX / totalWidth));
			this.setOffset(offsetX, undefined);
			movable.setPosition(offsetX * totalWidth, undefined);
		}

		protected onScrollbarVerticalMove(movable: Movable) {
			if (this.scrollLock)
				return;
			let totalHeight = this.viewHeight - this.scrollbarVerticalBox.layoutHeight;
			let offsetY = Math.min(1, Math.max(0, movable.positionY / totalHeight));
			this.setOffset(undefined, offsetY);
			movable.setPosition(undefined, offsetY * totalHeight);
		}

		protected onScrollIntoView(el: Element) {
			let matrix = Ui.Matrix.createTranslate(this.offsetX, this.offsetY).multiply(el.transformToElement(this));
			let p0 = (new Ui.Point(0, 0)).multiply(matrix);
			let p1 = (new Ui.Point(el.layoutWidth, el.layoutHeight)).multiply(matrix);

			// test if scroll vertical is needed
			if ((p0.y < this.offsetY) || (p0.y > this.offsetY + this.viewHeight) ||
				(p1.y > this.offsetY + this.viewHeight)) {
				if (Math.abs(this.offsetY + this.viewHeight - p1.y) < Math.abs(this.offsetY - p0.y))
					this.setOffset(this.offsetX, p1.y - this.viewHeight, true);
				else
					this.setOffset(this.offsetX, p0.y, true);
				this.contentBox.stopInertia();
			}
			// test if scroll horizontal is needed
			if ((p0.x < this.offsetX) || (p0.x > this.offsetX + this.viewWidth) ||
				(p1.x > this.offsetX + this.viewWidth)) {
				if (Math.abs(this.offsetX + this.viewWidth - p1.x) < Math.abs(this.offsetX - p0.x))
					this.setOffset(p1.x - this.viewWidth, this.offsetY, true);
				else
					this.setOffset(p0.x, this.offsetY, true);
				this.contentBox.stopInertia();
			}
			super.onScrollIntoView(el);
		}

		protected measureCore(width: number, height: number) {
			let size = { width: 0, height: 0 };

			if (this.scrollbarHorizontalBox)
				this.scrollbarHorizontalBox.measure(width, height);
			if (this.scrollbarVerticalBox)
				this.scrollbarVerticalBox.measure(width, height);

			let contentSize = this.contentBox.measure(width, height);
			if (contentSize.width < width)
				size.width = contentSize.width;
			else
				size.width = width;
			if (contentSize.height < height)
				size.height = contentSize.height;
			else
				size.height = height;
			if (!this.scrollVertical)
				size.height = contentSize.height;
			if (!this.scrollHorizontal)
				size.width = contentSize.width;
			return size;
		}

		protected arrangeCore(width: number, height: number) {
			this.viewWidth = width;
			this.viewHeight = height;
			this.contentBox.arrange(0, 0, this.viewWidth, this.viewHeight);
			this.contentWidth = this.contentBox.contentWidth;
			this.contentHeight = this.contentBox.contentHeight;
			this.updateOffset();
		}
	}
	
	export class ScrollableContent extends Transformable
	{
		private _contentWidth: number = 0;
		private _contentHeight: number = 0;

		constructor() {
			super();
			this.addEvents('scroll');

			this.clipToBounds = true;
			this.connect(this.drawing, 'scroll', () => {
				this.translateX -= this.drawing.scrollLeft;
				this.translateY -= this.drawing.scrollTop;
				this.drawing.scrollLeft = 0;
				this.drawing.scrollTop = 0;
				this.onContentTransform();
			});
			this.allowTranslate = true;
			this.allowRotate = false;
			this.minScale = 1;
			this.maxScale = 1;
			this.setTransformOrigin(0, 0);
			this.inertia = true;
		}

		get offsetX(): number {
			return -this.translateX;
		}

		get offsetY(): number {
			return -this.translateY;
		}

		setOffset(x: number, y: number) {
			this.setContentTransform(-x, -y, undefined, undefined);
		}

		get contentWidth(): number {
			return this._contentWidth;
		}

		get contentHeight(): number {
			return this._contentHeight;
		}

		protected arrangeCore(width: number, height: number) {
			super.arrangeCore(Math.max(width, this.measureWidth), Math.max(height, this.measureHeight));
			this.onContentTransform();
		}

		protected onContentTransform(testOnly: boolean = false) {
			let scale = this.scale;
			if (this.translateX > 0)
				this.translateX = 0;
			if (this.translateY > 0)
				this.translateY = 0;
		
			let viewWidth = this.layoutWidth;
			let viewHeight = this.layoutHeight;

			this._contentWidth = this.firstChild.layoutWidth * scale;
			this._contentHeight = this.firstChild.layoutHeight * scale;

			this.translateX = Math.max(this.translateX, -(this._contentWidth - viewWidth));
			this.translateY = Math.max(this.translateY, -(this._contentHeight - viewHeight));

			super.onContentTransform(testOnly);

			this._contentWidth = this.firstChild.layoutWidth * scale;
			this._contentHeight = this.firstChild.layoutHeight * scale;
			if (testOnly !== true) {
				this.fireEvent('scroll', this);
			}
		}
	}
}	
	
