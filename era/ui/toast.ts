namespace Ui {

    export class Toaster extends Container {
        static current: Toaster;
        private arrangeClock?: Anim.Clock;

        constructor() {
            super();
            //this.margin = 10;
            this.eventsHidden = true;
            this.drawing.style.position = 'fixed';
            this.drawing.style.top = '0';
            this.drawing.style.left = '0';
        }

        appendToast(toast: Toast) {
            toast.newToast = true;
            if (this.children.length === 0)
                App.appendTopLayer(this);
            this.appendChild(toast);
        }

        removeToast(toast: Toast) {
            this.removeChild(toast);
            if (this.children.length === 0)
                App.removeTopLayer(this);
        }

        protected onArrangeTick(clock, progress, delta) {
            //console.log(this+'.onArrangeTick progress: '+progress+', last: '+this.lastLayoutY+', new: '+this.getLayoutY());
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i] as Toast;
                if (progress === 1) {
                    child.transform = undefined;
                    child.newToast = false;
                }
                else if (child.newToast !== true)
                    child.transform = (Matrix.createTranslate(
                        (child.lastLayoutX - child.layoutX) * (1 - progress),
                        (child.lastLayoutY - child.layoutY) * (1 - progress)));
            }
            if (progress === 1)
                this.arrangeClock = undefined;
        }

        invalidateArrange() {
            super.invalidateArrange();
            this.invalidateLayout();
        }

        invalidateMeasure() {
            super.invalidateMeasure();
            this.invalidateLayout();
        }

        protected measureCore(width: number, height: number) {
            let spacing = 10;
            let maxWidth = 0;
            let totalHeight = 0;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                let size = child.measure(0, 0);
                totalHeight += size.height;
                if (size.width > maxWidth)
                    maxWidth = size.width;
            }
            totalHeight += Math.max(0, this.children.length - 1) * spacing;
            return { width: maxWidth + 10, height: totalHeight + 10 };
        }

        protected arrangeCore(width: number, height: number) {
            let spacing = 10;
            let y = 0;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i] as Toast;
                child.lastLayoutX = child.layoutX;
                child.lastLayoutY = child.layoutY;
                y += child.measureHeight;
                child.arrange(10, height - (y + 10), this.measureWidth, child.measureHeight);
                y += spacing;
            }
            if (this.arrangeClock === undefined) {
                this.arrangeClock = new Anim.Clock({ duration: 1, speed: 5 });
                this.arrangeClock.timeupdate.connect((e) => this.onArrangeTick(e.target, e.progress, e.deltaTick));
                this.arrangeClock.begin();
            }
        }

        static appendToast(toast: Toast) {
            Ui.Toaster.current.appendToast(toast);
        }

        static removeToast(toast: Toast) {
            Ui.Toaster.current.removeToast(toast);
        }
    }

    export class Toast extends LBox {
        private _isClosed: boolean = true;
        private openClock?: Anim.Clock;
        private toastContentBox: LBox;
        newToast: boolean = false;
        lastLayoutX: number = 0;
        lastLayoutY: number = 0;
        lastLayoutWidth: number = 0;
        lastLayoutHeight: number = 0;
        readonly closed = new Core.Events<{ target: Toast }>();

        constructor() {
            super();

            let sha = new Ui.Shadow();
            sha.shadowWidth = 3; sha.radius = 1; sha.inner = false; sha.opacity = 0.4;
            this.append(sha);

            let r = new Rectangle();
            r.fill = '#303030'; r.width = 200; r.height = 30; r.margin = 2; r.opacity = 1;
            this.append(r);

            this.toastContentBox = new LBox();
            this.toastContentBox.margin = 10; this.toastContentBox.width = 200;
            this.append(this.toastContentBox);
        }

        get isClosed(): boolean {
            return this._isClosed;
        }

        open() {
            if (this._isClosed) {
                this._isClosed = false;

                if (this.openClock == undefined) {
                    this.openClock = new Anim.Clock({
                        duration: 1, target: this, speed: 5,
                        ease: new Anim.PowerEase({ mode: 'out' })
                    });
                    this.openClock.timeupdate.connect((e) => this.onOpenTick(e.target, e.progress, e.deltaTick));
                    // set the initial state
                    this.opacity = 0;
                    // the start of the animation is delayed to the next arrange
                }
                new Core.DelayedTask(2, () => this.close());
                Ui.Toaster.appendToast(this);
            }
        }

        close() {
            if (!this._isClosed) {
                this._isClosed = true;
                this.disable();
                if (this.openClock == undefined) {
                    this.openClock = new Anim.Clock({
                        duration: 1, target: this, speed: 5,
                        ease: new Anim.PowerEase({ mode: 'out' })
                    });
                    this.openClock.timeupdate.connect((e) => this.onOpenTick(e.target, e.progress, e.deltaTick));
                    this.openClock.begin();
                }
            }
        }

        protected onOpenTick(clock, progress, delta) {
            let end = (progress >= 1);

            if (this._isClosed)
                progress = 1 - progress;
        
            this.opacity = progress;
            this.transform = Matrix.createTranslate(-20 * (1 - progress), 0);

            if (end) {
                if (this.openClock)
                    this.openClock.stop();
                this.openClock = undefined;
                if (this._isClosed) {
                    this.enable();
                    this.closed.fire({ target: this });
                    Ui.Toaster.removeToast(this);
                }
            }
        }

        set content(content: Element) {
            this.toastContentBox.content = content;
        }

        protected arrangeCore(width: number, height: number) {
            super.arrangeCore(width, height);
            // the delayed open animation
            if ((this.openClock != undefined) && !this.openClock.isActive)
                this.openClock.begin();
        }

        static send(content: Element | string) {
            let toast = new Ui.Toast();
            if (typeof (content) === 'string') {
                let t = new Ui.Text();
                t.text = content as string;
                t.verticalAlign = 'center';
                t.fontWeight = 'bold';
                t.margin = 5;
                t.color = Color.create('#ffffff');
                content = t;
            }
            toast.content = content;
            toast.open();
        }
    }
}	

Ui.Toaster.current = new Ui.Toaster();