namespace Ui {
    export interface ProgressBarInit extends ContainerInit {
        value?: number | 'infinite';
        orientation?: 'horizontal' | 'vertical';
    }

    export class ProgressBar extends Container implements ProgressBarInit {
        private _value: number | 'infinite' = 0;
        readonly bar: Rectangle;
        private background: Rectangle;
        private clock: Anim.Clock;
        private _orientation: 'horizontal' | 'vertical' = 'horizontal';

        constructor(init?: ProgressBarInit) {
            super(init);
            this.background = new Ui.Rectangle({ width: 4, height: 4 });
            this.appendChild(this.background);
            this.bar = new Ui.Rectangle({ width: 4, height: 4 });
            this.appendChild(this.bar);
            if (init) {
                if (init.orientation !== undefined)
                    this.orientation = init.orientation;
                if (init.value !== undefined)
                    this.value = init.value;
            }

            this.clock = new Anim.Clock({
                repeat: 'forever', duration: 2,
                ontimeupdate: e => {
                    let p = e.progress;
                    let p2 = (p > 0.5) ? 2 - 2 * p : 2 * p;
                    if (this.orientation == 'horizontal') {
                        let x = p2 * (this.layoutWidth - this.bar.layoutWidth);
                        this.bar.transform = new Ui.Matrix().translate(x, 0);
                    }
                    else {
                        let y = (1 - p2) * (this.layoutHeight - this.bar.layoutHeight);
                        this.bar.transform = new Ui.Matrix().translate(0, y);
                    }
                }
            });
        }

        get value(): number | 'infinite' {
            return this._value;
        }

        set value(value: number | 'infinite') {
            if (value != this._value) {
                this._value = value;
                if (value == 'infinite' && this.isVisible)
                    this.clock.begin();
                else {
                    this.clock.stop();
                    this.bar.transform = new Ui.Matrix().translate(0,0);
                }
                if (typeof this._value == 'number')
                    this._value = Math.max(0, Math.min(1, this._value));
                this.invalidateArrange();
            }
        }

        get orientation(): 'horizontal' | 'vertical' {
            return this._orientation;
        }

        set orientation(value: 'horizontal' | 'vertical') {
            if (this._orientation != value) {
                this._orientation = value;
                this.invalidateMeasure();
            }
        }
        
        protected measureCore(width: number, height: number) {
            let minHeight = 0;
            let minWidth = 0;

            let size = this.bar.measure(width, height);
            minHeight = Math.max(size.height, minHeight);
            minWidth = Math.max(size.width, minWidth);

            size = this.background.measure(width, height);
            minHeight = Math.max(size.height, minHeight);
            minWidth = Math.max(size.width, minWidth);

            if (this.orientation == 'horizontal')
                return { width: Math.max(minWidth, 8), height: minHeight };
            else
                return { width: minWidth, height: Math.max(minHeight, 8) };
        }

        protected arrangeCore(width: number, height: number) {
            this.background.arrange(0, 0, width, height);

            let barWidth = (this.orientation == 'horizontal' ? width : height) * (typeof this.value == 'number' ? this.value : 0.2);
            barWidth = Math.floor(barWidth);
            if (barWidth < 2)
                this.bar.hide();
            else {
                this.bar.show();
                if (this.orientation == 'horizontal')
                    this.bar.arrange(0, 0, barWidth, height);
                else
                    this.bar.arrange(0, height - barWidth, width, barWidth);
            }
        }

        protected onVisible() {
            super.onVisible();
            if (this.value == 'infinite')
                this.clock.begin();
        }

        protected onHidden() {
            super.onHidden();
            if (this.value == 'infinite')
                this.clock.stop();
        }

        protected onStyleChange() {
            let radius = this.getStyleProperty('radius');
            this.bar.radius = radius;
            this.bar.fill = this.getStyleProperty('foreground');
            this.background.radius = radius;
            this.background.fill = this.getStyleProperty('background');
        }

        static style: object = {
            background: '#e1e1e1',
            foreground: '#07a0e5',
            color: '#999999',
            radius: 0
        }
    }
}

