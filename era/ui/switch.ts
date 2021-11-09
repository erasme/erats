namespace Ui {
    export interface SwitchInit extends ContainerInit {
        value?: boolean;
        onchanged?: (event: { target: Switch, value: boolean }) => void;
    }

    export class Switch extends Container {
        private _value: boolean = false;
        private pos: number = 0;
        private graphic: SimpleButtonBackground;
        private barBackground: Rectangle;
        private pressWatcher: PressWatcher;
        private bar: Rectangle;
        private button: Rectangle;
        private alignClock?: Anim.Clock;
        private speed: number = 0;
        private animNext: number = 0;
        private animStart: number = 0;
        private ease: Anim.EasingFunction;
        readonly changed = new Core.Events<{ target: Switch, value: boolean }>();
        set onchanged(value: (event: { target: Switch, value: boolean }) => void) { this.changed.connect(value); }

        constructor(init?: SwitchInit) {
            super(init);

            this.role = 'checkbox';
            this.drawing.setAttribute('aria-checked', 'false');

            this.focusable = true;
            this.drawing.style.cursor = 'pointer';

            this.graphic = new SimpleButtonBackground();
            this.appendChild(this.graphic);
            this.barBackground = new Rectangle({ width: 4, height: 14, radius: 7 });
            this.appendChild(this.barBackground);

            this.bar = new Rectangle({ width: 4, height: 14, radius: 7 });
            this.appendChild(this.bar);

            this.pressWatcher = new PressWatcher({
                element: this,
                ondowned: () => this.onDown(),
                onupped: () => this.onUp(),
                onpressed: () => this.value = !this.value
            });
            this.focused.connect(() => this.updateColors());
            this.blurred.connect(() => this.updateColors());

            this.button = new Rectangle({ radius: 10, width: 20, height: 20, margin: 10 });
            this.button.drawing.style.boxShadow = '0px 0px 2px rgba(0,0,0,0.5)';
            this.appendChild(this.button);

            this.ease = new Anim.PowerEase({ mode: 'out' });

            if (init) {
                if (init.value !== undefined)
                    this.value = init.value;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
            }
        }

        get value(): boolean {
            return this._value;
        }

        set value(value: boolean) {
            if (this._value !== value) {
                this._value = value;
                this.updateColors();
                if (this.isLoaded) {
                    if (this._value)
                        this.startAnimation(4);
                    else
                        this.startAnimation(-4);
                }
                else
                    this.pos = this._value ? 1 : 0;
                this.drawing.setAttribute('aria-checked', this.value.toString());
                this.changed.fire({ target: this, value: this._value });
            }
        }

        //
        // Set a title for the current element
        //
        set title(title: string) {
            this.drawing.setAttribute('title', title);
        }

        //
        // Return the title of the current element
        //
        get title(): string {
            return this.drawing.getAttribute('title') as string;
        }

        private updatePos() {
            let width = this.layoutWidth;
            let height = this.layoutHeight;
            let max = width - (this.button.layoutWidth + this.button.marginLeft + this.button.marginRight);
            this.button.arrange(
                max * this.pos, 0,
                this.button.measureWidth, this.button.measureHeight
            )
            this.bar.arrange(
                this.button.marginLeft + (this.button.layoutWidth / 2),
                (height - this.bar.measureHeight) / 2,
                max * this.pos, this.bar.measureHeight);
        }

        private getForeground() {
            return Ui.Color.create(this.value ? this.getStyleProperty('activeForeground') : this.getStyleProperty('foreground'));
        }

        private getBarBackground() {
            let yuv = Color.create(this.getStyleProperty('barBackground')).getYuv();
            let deltaY = 0;
            if (this.pressWatcher.isDown)
                deltaY = -0.30;

            return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
        }

        private getBorder() {
            if(this.hasFocus && !this.isMouseFocus)
                return Color.create(this.getStyleProperty('focusBackgroundBorder'));
            else
                return Color.create(this.getStyleProperty('backgroundBorder'));
        }

        private getBackground() {
            return Color.create(this.getStyleProperty('background'));
        }

        private updateColors() {
            this.bar.fill = this.getForeground().addA(-0.6);
            this.barBackground.fill = this.getBarBackground();
            this.button.fill = this.getForeground();
            this.graphic.border = this.getBorder();
            this.graphic.background = this.getBackground();
        }

        private onDown() {
            this.stopAnimation();
            this.updateColors();
        }

        private onUp() {
            this.updateColors();
        }

        private startAnimation(speed: number) {
            this.stopAnimation();
            this.speed = speed;
            this.animStart = this.pos;

            if (this.speed > 0)
                this.animNext = 1;
            else
                this.animNext = 0;

            if (this.animStart !== this.animNext) {
                this.alignClock = new Anim.Clock({ duration: 'forever', target: this });
                this.alignClock.timeupdate.connect((e) => this.onAlignTick(e.target, e.progress, e.deltaTick));
                this.alignClock.begin();
            }
            else {
                if (this._value !== (this.animNext === 1)) {
                    this._value = (this.animNext === 1);
                    this.button.fill = this.getForeground();
                    this.changed.fire({ target: this, value: this._value });
                }
            }
        }

        private stopAnimation() {
            if (this.alignClock !== undefined) {
                this.alignClock.stop();
                this.alignClock = undefined;
            }
        }

        private onAlignTick(clock: Anim.Clock, progress: number, delta: number) {
            if (delta === 0)
                return;

            let relprogress = (clock.time * this.speed) / (this.animNext - this.animStart);
            if (relprogress >= 1) {
                if (this.alignClock)
                    this.alignClock.stop();
                this.alignClock = undefined;
                relprogress = 1;
                if (this._value != (this.animNext === 1)) {
                    this._value = (this.animNext === 1);
                    this.button.fill = this.getForeground();
                    this.changed.fire({ target: this, value: this._value });
                }
            }
            relprogress = this.ease.ease(relprogress);
            this.pos = (this.animStart + relprogress * (this.animNext - this.animStart));
            this.updatePos();
        }

        protected measureCore(width: number, height: number) {
            let buttonSize = this.button.measure(0, 0);
            let size = buttonSize;
            let res = this.barBackground.measure(buttonSize.width * 1.75, 0);
            if (res.width > size.width)
                size.width = res.width;
            if (res.height > size.height)
                size.height = res.height;
            res = this.bar.measure(buttonSize.width * 1.75, 0);
            if (res.width > size.width)
                size.width = res.width;
            if (res.height > size.height)
                size.height = res.height;
            if (buttonSize.width * 1.75 > size.width)
                size.width = buttonSize.width * 1.75;
            return size;
        }

        protected arrangeCore(width: number, height: number) {
            this.button.arrange(0, (height - this.button.measureHeight) / 2, this.button.measureWidth, this.button.measureHeight);
            this.barBackground.arrange(
                this.button.marginLeft + (this.button.layoutWidth / 2),
                (height - this.barBackground.measureHeight) / 2,
                width - (this.button.layoutWidth + this.button.marginLeft + this.button.marginRight), this.barBackground.measureHeight);
            this.graphic.arrange(0, 0, width, height);
            this.updatePos();
        }

        protected onStyleChange() {
            this.updateColors();

            this.graphic.borderWidth = parseInt(this.getStyleProperty('borderWidth'));
            this.graphic.radius = parseInt(this.getStyleProperty('borderRadius'));
        }

        protected onDisable() {
            super.onDisable();
            this.button.opacity = 0.2;
            this.drawing.style.cursor = 'inherit';
        }

        protected onEnable() {
            super.onEnable();
            this.button.opacity = 1;
            this.drawing.style.cursor = 'pointer';
        }

        static style: object = {
            radius: 0,
            borderWidth: 1,
            background: 'rgba(250,250,250,0)',
            barBackground: '#e1e1e1',
            backgroundBorder: 'rgba(250,250,250,0)',
            foreground: '#757575',
            activeForeground: '#07a0e5',
            focusBackgroundBorder: '#21d3ff',
            borderRadius: 4
        }
    }
}


