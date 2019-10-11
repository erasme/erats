namespace Ui {

    export class NativeScrollableContent extends Container {
        private _content: Ui.Element | undefined;
        private scrollDiv!: HTMLDivElement;
        readonly scrolled = new Core.Events<{ target: NativeScrollableContent, offsetX: number, offsetY: number }>();
        set onscrolled(value: (event: { target: NativeScrollableContent, offsetX: number, offsetY: number }) => void) { this.scrolled.connect(value); }

        constructor() {
            super();
            this.focusable = false;
            this.containerDrawing = this.scrollDiv;
        }

        renderDrawing(): HTMLDivElement {
            let drawing = super.renderDrawing();
            drawing.style.overflow = 'hidden';
            this.scrollDiv = document.createElement('div');
            this.scrollDiv.style.position = 'absolute';
            this.scrollDiv.style.top = '0px';
            this.scrollDiv.style.left = '0px';
            this.scrollDiv.style.right = `-${NativeScrollableContent.nativeScrollBarWidth}px`;
            this.scrollDiv.style.bottom = `-${NativeScrollableContent.nativeScrollBarHeight}px`;
            this.scrollDiv.style.overflow = 'scroll';
            // added for Chrome performance problem
            this.scrollDiv.style.setProperty('will-change', 'transform');
            // added for Chrome performance problem
            this.scrollDiv.style.setProperty('transform', 'translateZ(0)');
            // added for iOS to allow scrolling
            this.scrollDiv.style.setProperty('-webkit-overflow-scrolling', 'touch');
            this.scrollDiv.onscroll = () => this.onScroll();
            drawing.appendChild(this.scrollDiv);
            return drawing;
        }

        get content(): Ui.Element | undefined {
            return this._content;
        }

        set content(value: Ui.Element | undefined) {
            if (value !== this._content) {
                if (this._content !== undefined)
                    this.removeChild(this._content);
                this._content = value;
                if (this._content)
                    this.appendChild(this._content);
            }
        }

        get offsetX(): number {
            return this.scrollDiv.scrollLeft;
        }

        get offsetY(): number {
            return this.scrollDiv.scrollTop;
        }

        stopInertia() {
        }

        setOffset(x: number, y: number) {
            this.scrollDiv.scrollLeft = x;
            this.scrollDiv.scrollTop = y;
        }

        get contentWidth(): number {
            return this._content ? this._content.layoutWidth + this._content.marginLeft + this._content.marginRight : 0;
        }

        get contentHeight(): number {
            return this._content ? this._content.layoutHeight + this._content.marginTop + this._content.marginBottom : 0;
        }

        protected measureCore(width: number, height: number) {
            let size = { width: 0, height: 0 };
            if (this._content)
                size = this._content.measure(width, height);
            return size;
        }

        protected arrangeCore(width: number, height: number) {
            super.arrangeCore(Math.max(width, this.measureWidth), Math.max(height, this.measureHeight));
            if (this._content)
                this._content.arrange(0, 0, Math.max(width, this._content.measureWidth), Math.max(height, this._content.measureHeight));
        }

        protected onScroll() {
            this.scrolled.fire({ target: this, offsetX: this.offsetX, offsetY: this.offsetY });
        }

        getInverseLayoutTransform(): Ui.Matrix {
            return Ui.Matrix.createTranslate(-this.scrollDiv.scrollLeft, -this.scrollDiv.scrollTop).multiply(super.getInverseLayoutTransform());
        }

        getLayoutTransform(): Ui.Matrix {
            return super.getLayoutTransform().multiply(Ui.Matrix.createTranslate(this.scrollDiv.scrollLeft, this.scrollDiv.scrollTop));
        }

        static nativeScrollBarWidth = 0;
        static nativeScrollBarHeight = 0;

        static initialize() {
            let div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.display = 'block';
            div.style.opacity = '0';
            div.style.width = '100px';
            div.style.height = '100px';
            div.style.overflow = 'scroll';
            if (document.body == null)
                document.body = document.createElement('body');
            document.body.appendChild(div);
            NativeScrollableContent.nativeScrollBarWidth = 100 - div.clientWidth;
            NativeScrollableContent.nativeScrollBarHeight = 100 - div.clientHeight;
            document.body.removeChild(div);
        }
    }

    NativeScrollableContent.initialize();

    export interface NativeScrollableInit extends ContainerInit {
        content?: Element | undefined;
        scrollHorizontal?: boolean;
        scrollVertical?: boolean;
    }

    export class NativeScrollable extends Ui.Container {
        private contentBox: NativeScrollableContent;
        private _scrollHorizontal: boolean = true;
        private _scrollVertical: boolean = true;
        scrollbarHorizontalBox!: Ui.Movable;
        scrollbarVerticalBox!: Ui.Movable;
        showShadows: boolean = false;
        lock: boolean = false;
        isOver: boolean = false;
        protected showClock?: Anim.Clock;
        offsetX: number = 0;
        offsetY: number = 0;
        relativeOffsetX: number = 0;
        relativeOffsetY: number = 0;
        viewWidth: number = 0;
        viewHeight: number = 0;
        contentWidth: number = 0;
        contentHeight: number = 0;
        scrollLock: boolean = false;
        scrollbarVerticalNeeded: boolean = false;
        scrollbarHorizontalNeeded: boolean = false;
        scrollbarVerticalHeight: number = 0;
        scrollbarHorizontalWidth: number = 0;
        readonly scrolled = new Core.Events<{ target: NativeScrollable, offsetX: number, offsetY: number }>();
        set onscrolled(value: (event: { target: NativeScrollable, offsetX: number, offsetY: number }) => void) { this.scrolled.connect(value); }

        constructor(init?: NativeScrollableInit) {
            super(init);
            this.clipToBounds = true;
            this.contentBox = new NativeScrollableContent();
            this.contentBox.scrolled.connect(() => this.onScroll());
            this.appendChild(this.contentBox);

            new Ui.OverWatcher({
                element: this,
                onentered: () => {
                    this.isOver = true;
                    this.autoShowScrollbars();
                },
                onleaved: () => {
                    this.isOver = false;
                    this.autoHideScrollbars();
                }
            });
            this.setScrollbarHorizontal(new Ui.Movable());
            this.setScrollbarVertical(new Ui.Movable());

            if (init) {
                if (init.content !== undefined)
                    this.content = init.content;
                if (init.scrollHorizontal !== undefined)
                    this.scrollHorizontal = init.scrollHorizontal;
                if (init.scrollVertical !== undefined)
                    this.scrollVertical = init.scrollVertical;
            }
        }

        set content(content: Ui.Element | undefined) {
            this.contentBox.content = content;
        }

        get content(): Ui.Element | undefined {
            return this.contentBox.content;
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

        setScrollbarVertical(scrollbarVertical: Ui.Movable) {
            if (this.scrollbarVerticalBox) {
                this.scrollbarVerticalBox.downed.disconnect(this.autoShowScrollbars);
                this.scrollbarVerticalBox.upped.disconnect(this.autoHideScrollbars);
                this.scrollbarVerticalBox.moved.disconnect(this.onScrollbarVerticalMove);
                this.removeChild(this.scrollbarVerticalBox);
            }
            if (scrollbarVertical) {
                this.scrollbarVerticalBox = scrollbarVertical;
                this.scrollbarVerticalBox.opacity = 0;
                this.scrollbarVerticalBox.moveHorizontal = false;
                this.scrollbarVerticalBox.downed.connect(this.autoShowScrollbars);
                this.scrollbarVerticalBox.upped.connect(this.autoHideScrollbars);
                this.scrollbarVerticalBox.moved.connect(this.onScrollbarVerticalMove);
                this.appendChild(this.scrollbarVerticalBox);
                if (NativeScrollableContent.nativeScrollBarHeight == 0)
                    this.scrollbarVerticalBox.hide(true);
            }
        }

        setScrollbarHorizontal(scrollbarHorizontal: Ui.Movable) {
            if (this.scrollbarHorizontalBox) {
                this.scrollbarHorizontalBox.downed.disconnect(this.autoShowScrollbars);
                this.scrollbarHorizontalBox.upped.disconnect(this.autoHideScrollbars);
                this.scrollbarHorizontalBox.moved.disconnect(this.onScrollbarHorizontalMove);
                this.removeChild(this.scrollbarHorizontalBox);
            }
            if (scrollbarHorizontal) {
                this.scrollbarHorizontalBox = scrollbarHorizontal;
                this.scrollbarHorizontalBox.opacity = 0;
                this.scrollbarHorizontalBox.moveVertical = false;
                this.scrollbarHorizontalBox.downed.connect(this.autoShowScrollbars);
                this.scrollbarHorizontalBox.upped.connect(this.autoHideScrollbars);
                this.scrollbarHorizontalBox.moved.connect(this.onScrollbarHorizontalMove);
                this.appendChild(this.scrollbarHorizontalBox);
                if (NativeScrollableContent.nativeScrollBarWidth == 0)
                    this.scrollbarHorizontalBox.hide(true);
            }
        }

        setOffset(offsetX?: number, offsetY?: number, absolute: boolean = false, align: boolean = false) {

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

            if (align) {
                offsetX = Math.round(offsetX);
                offsetY = Math.round(offsetY);
            }
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

        autoShowScrollbars = () => {
            if (this.showClock === undefined) {
                this.showClock = new Anim.Clock({ duration: 'forever' });
                this.showClock.timeupdate.connect((e) => this.onShowBarsTick(e.target, e.progress, e.deltaTick));
                this.showClock.begin();
            }
        }

        autoHideScrollbars = () => {
            if (this.isOver)
                return;
            if (this.showClock === undefined) {
                this.showClock = new Anim.Clock({ duration: 'forever' });
                this.showClock.timeupdate.connect((e) => this.onShowBarsTick(e.target, e.progress, e.deltaTick));
                this.showClock.begin();
            }
        }

        protected onShowBarsTick(clock: Anim.Clock, progress: number, delta: number) {
            let show = this.isOver;
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
                if (this.showClock)
                    this.showClock.stop();
                this.showClock = undefined;
            }
        }

        protected onScroll() {
            this.updateOffset();
            this.scrolled.fire({ target: this, offsetX: this.offsetX, offsetY: this.offsetY });
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

            if (this.scrollbarVerticalNeeded) {
                if (this.scrollbarVerticalBox) {
                    this.scrollbarVerticalHeight = Math.max((this.viewHeight / this.contentHeight) * this.viewHeight, this.scrollbarVerticalBox.measureHeight);
                    this.scrollbarVerticalBox.arrange(this.layoutWidth - this.scrollbarVerticalBox.measureWidth, 0,
                        this.scrollbarVerticalBox.measureWidth, this.scrollbarVerticalHeight);
                    if (NativeScrollableContent.nativeScrollBarHeight != 0)
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

                    if (NativeScrollableContent.nativeScrollBarWidth != 0)
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

        protected onScrollbarHorizontalMove = () => {
            if (this.scrollLock)
                return;
            let totalWidth = this.viewWidth - this.scrollbarHorizontalBox!.layoutWidth;
            let offsetX = Math.min(1, Math.max(0, this.scrollbarHorizontalBox!.positionX / totalWidth));
            this.setOffset(offsetX, undefined, false, true);
            this.scrollbarHorizontalBox!.setPosition(offsetX * totalWidth, undefined);
        }

        protected onScrollbarVerticalMove = () => {
            if (this.scrollLock)
                return;
            let totalHeight = this.viewHeight - this.scrollbarVerticalBox!.layoutHeight;
            let offsetY = Math.min(1, Math.max(0, this.scrollbarVerticalBox!.positionY / totalHeight));
            this.setOffset(undefined, offsetY, false, true);
            this.scrollbarVerticalBox!.setPosition(undefined, offsetY * totalHeight);
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
            if (!this.scrollVertical || Ui.App.isPrint)
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

    }

    export interface NativeScrollingAreaInit extends NativeScrollableInit {
    }

    export class NativeScrollingArea extends NativeScrollable {

        private horizontalScrollbar: Ui.Scrollbar;
        private verticalScrollbar: Ui.Scrollbar;

        constructor(init?: NativeScrollableInit) {
            super(init);
            this.horizontalScrollbar = new Ui.Scrollbar('horizontal');
            this.setScrollbarHorizontal(this.horizontalScrollbar);

            this.verticalScrollbar = new Ui.Scrollbar('vertical');
            this.setScrollbarVertical(this.verticalScrollbar);
        }

        protected onStyleChange() {
            let radius = this.getStyleProperty('radius');
            this.horizontalScrollbar.radius = radius;
            this.verticalScrollbar.radius = radius;

            let color = this.getStyleProperty('color');
            this.horizontalScrollbar.fill = color;
            this.verticalScrollbar.fill = color;
        }

        static style: any = {
            color: 'rgba(50,50,50,0.7)',
            radius: 0
        }
    }
}