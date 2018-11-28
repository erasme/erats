namespace Ui {
    export interface ProgressBarInit extends ContainerInit {
        value?: number | 'infinite';
    }

    export class ProgressBar extends Container implements ProgressBarInit {
        private _value: number | 'infinite' = 0;
        readonly bar: Rectangle;
        private background: Rectangle;
        private clock: Anim.Clock;

        constructor(init?: ProgressBarInit) {
            super(init);
            this.background = new Ui.Rectangle({ height: 4 });
            this.appendChild(this.background);
            this.bar = new Ui.Rectangle({ height: 4 });
            this.appendChild(this.bar);
            if (init) {
                if (init.value !== undefined)
                    this.value = init.value;
            }

            this.clock = new Anim.Clock({
                repeat: 'forever', duration: 2,
                ontimeupdate: e => {
                    let p = e.progress;
                    let p2 = (p > 0.5) ? 2 - 2 * p : 2 * p;
                    let x = p2 * (this.layoutWidth - this.bar.layoutWidth);

                    this.bar.transform = new Ui.Matrix().translate(x, 0);
                }
            });
        }

        set value(value: number | 'infinite') {
            if (value != this._value) {
                this._value = value;
                this.invalidateArrange();
            }
        }

        get value(): number | 'infinite' {
            return this._value;
        }

        protected measureCore(width: number, height: number) {
            let minHeight = 0;
            let minWidth = 0;
            let size;

            size = this.bar.measure(width, height);
            minHeight = Math.max(size.height, minHeight);
            minWidth = Math.max(size.width, minWidth);

            size = this.background.measure(width, height);
            minHeight = Math.max(size.height, minHeight);
            minWidth = Math.max(size.width, minWidth);

            return { width: Math.max(minWidth, 12), height: minHeight };
        }

        protected arrangeCore(width: number, height: number) {
            this.background.arrange(0, 0, width, height);

            let barWidth = width * (typeof this.value == 'number' ? this.value : 0.2);
            if (barWidth < 2)
                this.bar.hide();
            else {
                this.bar.show();
                this.bar.arrange(0, 0, barWidth, this.layoutHeight);
            }
            if (this.value == 'infinite') {
                this.clock.begin();
            } else {
                this.clock.stop();
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

