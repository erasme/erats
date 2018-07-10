namespace Ui {
    export interface FrameInit extends CanvasElementInit {
        frameWidth?: number;
        fill?: Color | LinearGradient | string;
        radius?: number;
        radiusTopLeft?: number;
        radiusTopRight?: number;
        radiusBottomLeft?: number;
        radiusBottomRight?: number;
    }

    export class Frame extends CanvasElement implements FrameInit {
        private _fill: Color | LinearGradient = new Color();
        private _radiusTopLeft: number = 0;
        private _radiusTopRight: number = 0;
        private _radiusBottomLeft: number = 0;
        private _radiusBottomRight: number = 0;
        private _frameWidth: number = 10;

        constructor(init?: FrameInit) {
            super(init);
            if (init) {
                if (init.frameWidth !== undefined)
                    this.frameWidth = init.frameWidth;
                if (init.fill !== undefined)
                    this.fill = init.fill;
                if (init.radius !== undefined)
                    this.radius = init.radius;
                if (init.radiusTopLeft !== undefined)
                    this.radiusTopLeft = init.radiusTopLeft;
                if (init.radiusTopRight !== undefined)
                    this.radiusTopRight = init.radiusTopRight;
                if (init.radiusBottomLeft !== undefined)
                    this.radiusBottomLeft = init.radiusBottomLeft;
                if (init.radiusBottomRight !== undefined)
                    this.radiusBottomRight = init.radiusBottomRight;
            }
        }

        get frameWidth(): number {
            return this._frameWidth;
        }

        set frameWidth(frameWidth: number) {
            if (frameWidth != this._frameWidth) {
                this._frameWidth = frameWidth;
                this.invalidateDraw();
            }
        }

        set fill(fill: Color | LinearGradient | string) {
            if (this._fill != fill) {
                if (typeof (fill) === 'string')
                    fill = Color.create(fill);
                this._fill = fill;
                this.invalidateDraw();
            }
        }

        set radius(radius: number) {
            this.radiusTopLeft = radius;
            this.radiusTopRight = radius;
            this.radiusBottomLeft = radius;
            this.radiusBottomRight = radius;
        }

        get radiusTopLeft(): number {
            return this._radiusTopLeft;
        }

        set radiusTopLeft(radiusTopLeft: number) {
            if (this._radiusTopLeft != radiusTopLeft) {
                this._radiusTopLeft = radiusTopLeft;
                this.invalidateDraw();
            }
        }

        get radiusTopRight(): number {
            return this._radiusTopRight;
        }

        set radiusTopRight(radiusTopRight: number) {
            if (this._radiusTopRight != radiusTopRight) {
                this._radiusTopRight = radiusTopRight;
                this.invalidateDraw();
            }
        }

        get radiusBottomLeft(): number {
            return this._radiusBottomLeft;
        }

        set radiusBottomLeft(radiusBottomLeft: number) {
            if (this._radiusBottomLeft != radiusBottomLeft) {
                this._radiusBottomLeft = radiusBottomLeft;
                this.invalidateDraw();
            }
        }

        get radiusBottomRight(): number {
            return this._radiusBottomRight;
        }

        set radiusBottomRight(radiusBottomRight: number) {
            if (this._radiusBottomRight != radiusBottomRight) {
                this._radiusBottomRight = radiusBottomRight;
                this.invalidateDraw();
            }
        }

        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let topLeft = this._radiusTopLeft;
            let topRight = this._radiusTopRight;
            if (topLeft + topRight > w) {
                topLeft = w / 2;
                topRight = w / 2;
            }
            let bottomLeft = this._radiusBottomLeft;
            let bottomRight = this._radiusBottomRight;
            if (bottomLeft + bottomRight > w) {
                bottomLeft = w / 2;
                bottomRight = w / 2;
            }
            if (topLeft + bottomLeft > h) {
                topLeft = h / 2;
                bottomLeft = h / 2;
            }
            if (topRight + bottomRight > h) {
                topRight = h / 2;
                bottomRight = h / 2;
            }

            ctx.beginPath();
            ctx.roundRect(0, 0, w, h, topLeft, topRight, bottomRight, bottomLeft);
            ctx.roundRect(this._frameWidth, this._frameWidth, w - (this._frameWidth * 2), h - (this._frameWidth * 2), Math.max(0, topLeft - this.frameWidth), Math.max(0, topRight - this.frameWidth), Math.max(0, bottomRight - this.frameWidth), Math.max(0, bottomLeft - this.frameWidth), true);
            ctx.closePath();
            if (this._fill instanceof Color)
                ctx.fillStyle = (this._fill as Color).getCssRgba();
            else if (this._fill instanceof LinearGradient)
                ctx.fillStyle = (this._fill as LinearGradient).getCanvasGradient(ctx, w, h);
            ctx.fill();
        }
    }
}
