namespace Ui {
    export class RadioBoxGraphic extends CanvasElement {
        private _isDown: boolean = false;
        private _isChecked: boolean = false;
        private _color: Color | undefined;
        private _activeColor: Color | undefined;
        private _borderWidth: number = 2;

        constructor() {
            super();
        }

        get isDown() {
            return this._isDown;
        }

        set isDown(isDown) {
            if (this.isDown != isDown) {
                this._isDown = isDown;
                this.invalidateDraw();
            }
        }

        get isChecked() {
            return this._isChecked;
        }

        set isChecked(isChecked) {
            if (this.isChecked != isChecked) {
                this._isChecked = isChecked;
                this.invalidateDraw();
            }
        }

        get color() {
            if (this._color)
                return this._color;
            return Ui.Color.create(this.getStyleProperty('color'));
        }

        set color(color) {
            if (this.color !== color) {
                this._color = Ui.Color.create(color);
                this.invalidateDraw();
            }
        }

        set borderWidth(borderWidth: number) {
            if (this._borderWidth !== borderWidth) {
                this._borderWidth = borderWidth;
                this.invalidateDraw();
            }
        }

        get borderWidth(): number { return this._borderWidth; }

        set activeColor(color) {
            if (this.activeColor !== color) {
                this._activeColor = Ui.Color.create(color);
                this.invalidateDraw();
            }
        }

        get activeColor() {
            let color = this._activeColor ? this._activeColor : Ui.Color.create(this.getStyleProperty('activeColor'));
            let deltaY = 0;
            if (this.isDown)
                deltaY = 0.20;
            let yuv = color.getYuv();
            return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
        }

        updateCanvas(ctx: CanvasRenderingContext2D) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let cx = w / 2;
            let cy = h / 2;

            let radius = Math.min(cx - 5, cy - 5);
            radius = Math.min(radius, 10);
            radius -= 1;

            // background
            if (this.isDown)
                ctx.globalAlpha = 0.8;

            // handle disable
            if (this.isDisabled)
                ctx.globalAlpha = 0.4;


            ctx.strokeStyle = this.color.getCssRgba();
            ctx.lineWidth = this.borderWidth;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();

            if (this.isChecked) {
                ctx.fillStyle = this.color.getCssRgba();
                ctx.beginPath();
                ctx.arc(cx, cy, radius / 2, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        measureCore(width: number, height: number) {
            return { width: 30, height: 30 };
        }

        onDisable() {
            this.invalidateDraw();
        }

        onEnable() {
            this.invalidateDraw();
        }

        onStyleChange() {
            this.invalidateDraw();
        }

        static style: RadioBoxGraphicStyle = {
            color: 'rgba(120,120,120,0.2)',
            activeColor: 'rgba(33,211,255,0.4)'
        }
    }

    export interface RadioBoxGraphicStyle {
        color: Color | string;
        activeColor: Color | string;
    }
}
