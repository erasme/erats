namespace Ui
{
    export interface ShapeInit extends CanvasElementInit {
        scale?: number;
        fill?: string | undefined | Color | LinearGradient;
        path?: string;
    }

    export interface ShapeStyle {
        color: string | undefined | Color | LinearGradient;
    }

    export class Shape extends CanvasElement implements ShapeInit
    {
        private _fill?: Color | LinearGradient;
        private _path?: string;
        private _scale: number = 1;

        constructor(init?: ShapeInit) {
            super(init);
            if (init) {
                if (init.scale !== undefined)
                    this.scale = init.scale;
                if (init.fill !== undefined)
                    this.fill = init.fill;
                if (init.path !== undefined)
                    this.path = init.path;
            }
        }

        set scale(scale: number) {
            if (this._scale != scale) {
                this._scale = scale;
                this.invalidateDraw();
            }
        }

        get fill(): Color | LinearGradient | string | undefined {
            if (this._fill === undefined)
                return Color.create(this.getStyleProperty('color'));
            else
                return this._fill;
        }

        set fill(fill: string | undefined | Color | LinearGradient) {
            if (this._fill !== fill) {
                if (typeof (fill) === 'string')
                    fill = Color.create(fill);
                this._fill = fill;
                this.invalidateDraw();
            }
        }

        set path(path: string) {
            if (this._path != path) {
                this._path = path;
                this.invalidateDraw();
            }
        }

        onStyleChange() {
            this.invalidateDraw();
        }

        updateCanvas(ctx) {
            if (this._path === undefined)
                return;

            if (this._scale != 1)
                ctx.scale(this._scale, this._scale);

            ctx.svgPath(this._path);

            let fill = this.fill;
            if (fill instanceof Color)
                ctx.fillStyle = fill.getCssRgba();
            else if (fill instanceof Ui.LinearGradient)
                ctx.fillStyle = fill.getCanvasGradient(ctx, this.layoutWidth, this.layoutHeight);
            ctx.fill();
        }

        static style: ShapeStyle = {
            color: '#444444'
        }
    }
}


