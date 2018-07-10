namespace Ui {
    export interface RectangleInit extends CanvasElementInit {
        fill?: Color | LinearGradient | string;
        radius?: number;
        radiusTopLeft?: number;
        radiusTopRight?: number;
        radiusBottomLeft?: number;
        radiusBottomRight?: number;
    }

    export class Rectangle extends Element implements RectangleInit {
        private _fill: Color | LinearGradient;
        private _radiusTopLeft: number = 0;
        private _radiusTopRight: number = 0;
        private _radiusBottomLeft: number = 0;
        private _radiusBottomRight: number = 0;

        constructor(init?: RectangleInit) {
            super(init);
            this._fill = new Ui.Color(0, 0, 0);
            if (init) {
                if (init.fill !== undefined)
                    this.fill = init.fill;
                if (init.radius !== undefined)
                    this.radius = init.radius;
                if (init.radiusTopLeft != undefined)
                    this.radiusTopLeft = init.radiusTopLeft;
                if (init.radiusTopRight !== undefined)
                    this.radiusTopRight = init.radiusTopRight;
                if (init.radiusBottomLeft !== undefined)
                    this.radiusBottomLeft = init.radiusBottomLeft;
                if (init.radiusBottomRight !== undefined)
                    this.radiusBottomRight = init.radiusBottomRight;
            }
        }

        set fill(fill: Color | LinearGradient | string) {
            if (this._fill !== fill) {
                if (typeof (fill) === 'string')
                    fill = Color.create(fill);
                this._fill = fill;
                if (this._fill instanceof Color)
                    this.drawing.style.background = this._fill.getCssRgba();
                else if (this._fill instanceof LinearGradient)
                    this.drawing.style.background = this._fill.getBackgroundImage();
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
            this._radiusTopLeft = radiusTopLeft;
            this.drawing.style.borderTopLeftRadius = `${radiusTopLeft}px`;
        }

        get radiusTopRight(): number {
            return this._radiusTopRight;
        }

        set radiusTopRight(radiusTopRight: number) {
            this._radiusTopRight = radiusTopRight;
            this.drawing.style.borderTopRightRadius = `${radiusTopRight}px`;
        }

        get radiusBottomLeft(): number {
            return this._radiusBottomLeft;
        }

        set radiusBottomLeft(radiusBottomLeft: number) {
            this._radiusTopRight = radiusBottomLeft;
            this.drawing.style.borderBottomLeftRadius = `${radiusBottomLeft}px`;
        }

        get radiusBottomRight(): number {
            return this._radiusBottomRight;
        }

        set radiusBottomRight(radiusBottomRight: number) {
            this._radiusTopRight = radiusBottomRight;
            this.drawing.style.borderBottomRightRadius = `${radiusBottomRight}px`;
        }
    }
}

