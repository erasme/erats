namespace Ui
{
    export interface LoadingInit extends CanvasElementInit {
        value?: number | 'infinite';
    }

    export class Loading extends CanvasElement implements LoadingInit {
        private _value: number | 'infinite' = 'infinite';
        private clock: Anim.Clock;
        private ease: Anim.EasingFunction;

        constructor(init?: LoadingInit) {
            super(init);
            this.ease = new Anim.PowerEase({ mode: 'inout' });
            this.clock = new Anim.Clock({ repeat: 'forever', duration: 2 });
            this.clock.timeupdate.connect((e) => this.invalidateDraw());
        }

        protected onVisible() {
            super.onVisible();
            if (this._value == 'infinite')
                this.clock.begin();
        }

        protected onHidden() {
            super.onHidden();
            this.clock.stop();
        }

        protected updateCanvas(ctx: Ui.CanvasRenderingContext2D) {
            let p = this.clock.progress;
            if (p === undefined)
                p = 0;
            let p2 = (p > 0.8) ? (1 - ((p - 0.8) * 5)) : (p / 0.8);

            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let x = w / 2;
            let y = h / 2;
            let lineWidth = Math.max(2, Math.min(5, Math.min(w, h) * 5 / 60));
            let radius = ((Math.min(w, h) - lineWidth) / 2) - 5;
            let startAngle = Math.PI * 2 * p;
            if (p > 0.8)
                startAngle = Math.PI * 2 * p - (Math.PI * 2 * 5 * this.ease.ease(p2) / 6);
            let endAngle = startAngle + (Math.PI / 4) + (Math.PI * 2 * 5 * this.ease.ease(p2) / 6);

            if (this._value != 'infinite') {
                startAngle = 0;
                endAngle = Math.PI * 2 * this._value;
            }

            ctx.strokeStyle = Ui.Color.create(this.getStyleProperty('color')).getCssRgba();
            ctx.beginPath();
            ctx.arc(x, y, radius, startAngle, endAngle, false);
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }

        protected measureCore(width: number, height: number) {
            return { width: 30, height: 30 };
        }

        set value(value: number | 'infinite') {
            if (value != this._value) {
                this._value = value;
                if (value == 'infinite' && this.isVisible)
                    this.clock.begin();
                else
                    this.clock.stop();
                this.invalidateDraw();
            }
        }

        get value(): number | 'infinite' {
            return this._value;
        }

        static style: object = {
            color: new Ui.Color(0.27, 0.52, 0.9)
        }
    }
}	

