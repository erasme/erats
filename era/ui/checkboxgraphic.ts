namespace Ui
{
    export class CheckBoxGraphic extends CanvasElement
    {
        private _isDown: boolean = false;
        private _isChecked: boolean = false;
        private _color: Color | undefined;
        private _checkColor: Color | undefined;
        private _borderWidth: number = 2;
        private _radius: number = 3;

        constructor() {
            super();
        }

        get isDown() {
            return this._isDown;
        }

        set isDown(isDown: boolean) {
            if (this._isDown != isDown) {
                this._isDown = isDown;
                this.invalidateDraw();
            }
        }

        get isChecked() {
            return this._isChecked;
        }

        set isChecked(isChecked: boolean) {
            if (this._isChecked != isChecked) {
                this._isChecked = isChecked;
                this.invalidateDraw();
            }
        }

        get radius() {
            return this._radius;
        }

        set radius(radius: number) {
            if (this._radius !== radius) {
                this._radius = radius;
                this.invalidateDraw();
            }
        }

        get color() {
            if (this._color)
                return this._color;
            return Ui.Color.create(this.getStyleProperty('color'));
        }

        set color(value: Ui.Color) {
            this.setColor(value);
        }

        private getColor() {
            return this.color;
        }

        private setColor(color) {
            if (this._color !== color) {
                this._color = Ui.Color.create(color);
                this.invalidateDraw();
            }
        }

        get borderWidth() {
            return this._borderWidth;
        }

        set borderWidth(borderWidth: number) {
            if (this._borderWidth !== borderWidth) {
                this._borderWidth = borderWidth;
                this.invalidateDraw();
            }
        }

        get checkColor() {
            if (this._checkColor)
                return this._checkColor;
            return Ui.Color.create(this.getStyleProperty('checkColor'));
        }

        set checkColor(value: Ui.Color) {
            this.setCheckColor(value);
        }

        private setCheckColor(color) {
            if (this._checkColor !== color) {
                this._checkColor = Ui.Color.create(color);
                this.invalidateDraw();
            }
        }

        private getCheckColor() {
            let deltaY = 0;
            if (this.isDown)
                deltaY = 0.20;
            let yuv = this.checkColor.getYuv();
            return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
        }

        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let cx = w / 2;
            let cy = h / 2;

            let radius = Math.min(this.radius, 10);

            // background
            if (this.isDown)
                ctx.globalAlpha = 0.8;

            // handle disable
            if (this.isDisabled)
                ctx.globalAlpha = 0.4;

            if (!this.isChecked) {
                // border
                ctx.strokeStyle = this.getColor().getCssRgba();
                ctx.lineWidth = this.borderWidth;
                ctx.beginPath();
                ctx.roundRect(cx - 10 + this.borderWidth / 2, cy - 10 + this.borderWidth / 2, 20 - this.borderWidth, 20 - this.borderWidth, radius, radius, radius, radius);
                ctx.closePath();
                ctx.stroke();
            }
            else {
                // border
                ctx.fillStyle = this.getColor().getCssRgba();
                ctx.beginPath();
                ctx.roundRect(cx - 10, cy - 10, 20, 20, radius, radius, radius, radius);
                ctx.closePath();
                ctx.fill();

                ctx.globalAlpha = 1;

                // icon
                let iconSize = 20;
                let path = Ui.Icon.getPath('check');
                let scale = iconSize / 48;
                // icon
                ctx.save();
                ctx.translate((w - iconSize) / 2, (h - iconSize) / 2);
                ctx.scale(scale, scale);
                ctx.fillStyle = this.getCheckColor().getCssRgba();
                ctx.beginPath();
                ctx.svgPath(path);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        measureCore(width, height) {
            return { width: 30, height: 30 };
        }

        onDisable() {
            this.invalidateDraw();
        }

        onEnable() {
            this.invalidateDraw();
        }

        static style: CheckBoxGraphicStyle = {
            color: 'rgba(120,120,120,0.2)',
            checkColor: 'rgba(33,211,255,0.4)'
        }
    }

    export interface CheckBoxGraphicStyle {
        color: Color | string;
        checkColor: Color | string;
    }
}
