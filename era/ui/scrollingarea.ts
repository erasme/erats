namespace Ui {

    export class Scrollbar extends Movable {
        private rect: Rectangle;
        private over: Overable;
        private clock?: Anim.Clock;
        private scale = 0;

        constructor(private orientation: Orientation) {
            super();
            this.cursor = 'inherit';
            this.focusable = false;
            this.over = new Overable();
            this.content = this.over;
            this.rect = new Rectangle();
            this.rect.transformOriginX = 1;
            this.rect.transformOriginY = 1;
            if (orientation == 'horizontal') {
                this.rect.width = 30; this.rect.height = 15;
                this.over.height = 15;
                this.rect.verticalAlign = 'bottom';
            }
            else {
                this.rect.width = 15; this.rect.height = 30;
                this.over.width = 15;
                this.rect.horizontalAlign = 'right';
            }
            this.over.content = this.rect;
            this.over.entered.connect(() => this.startAnim());
            this.over.leaved.connect(() => this.startAnim());
            this.downed.connect(() => this.startAnim());
            this.upped.connect(() => this.startAnim());
            this.updateScale();
        }

        set radius(radius: number) {
            this.rect.radius = radius;
        }

        set fill(color: Color) {
            this.rect.fill = color;
        }

        private startAnim() {
            if (this.clock == undefined) {
                this.clock = new Anim.Clock();
                this.clock.duration = 'forever';
                this.clock.timeupdate.connect((e) => this.onTick(e.target, e.progress, e.deltaTick));
                this.clock.begin();
            }
        }

        protected onTick(clock: Anim.Clock, progress: number, deltaTick: number) {
            let d = deltaTick * 30;

            let view = this.over.isOver || this.isDown;

            if (!view)
                d = -d;

            this.scale = Math.max(0 , Math.min(1,
                this.scale + (d / 10)));

            this.updateScale();

            if ((!view && this.scale == 0) || (view && this.scale == 1)) {
                if (this.clock)
                    this.clock.stop();
                this.clock = undefined;
            }
        }

        private updateScale() {
            let rs = (5 + this.scale * 10) / 15;
            if (this.orientation == 'vertical')
                this.rect.transform = Ui.Matrix.createScale(rs, 1);
            else
                this.rect.transform = Ui.Matrix.createScale(1, rs);
        }
    }

/*    export interface ScrollingAreaInit extends ScrollableInit {
    }

    export class ScrollingArea extends Scrollable implements ScrollingAreaInit {

        private horizontalScrollbar: Scrollbar;
        private verticalScrollbar: Scrollbar;

        constructor(init?: ScrollingAreaInit) {
            super(init);
            this.horizontalScrollbar = new Scrollbar('horizontal');
            this.setScrollbarHorizontal(this.horizontalScrollbar);

            this.verticalScrollbar = new Scrollbar('vertical');
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
    }*/

    export interface ScrollingAreaInit extends NativeScrollingAreaInit {
        maxScale?: number;
        content?: Element;
        inertia?: boolean;
        scrollHorizontal?: boolean;
        scrollVertical?: boolean;
        scale?: number;
        onscrolled?: (event: { target: NativeScrollable, offsetX: number, offsetY: number }) => void;
    }

    export class ScrollingArea extends NativeScrollingArea {
        constructor(init?: ScrollingAreaInit) {
            super(init);
            if (init) {
                if (init.content != undefined)
                    this.content = init.content;
                if (init.scrollHorizontal != undefined)
                    this.scrollHorizontal = init.scrollHorizontal;
                if (init.scrollVertical != undefined)
                    this.scrollVertical = init.scrollVertical;
                if (init.onscrolled != undefined)
                    this.scrolled.connect(init.onscrolled);
            }
        }
    }
}