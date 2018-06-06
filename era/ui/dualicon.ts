
namespace Ui {
    export interface DualIconInit extends CanvasElementInit {
        icon?: string;
        fill?: Color;
        stroke?: Color;
        strokeWidth?: number;
    }

    export class DualIcon extends CanvasElement
    {
        private _icon?: string;
        private _fill?: Color;
        private _stroke?: Color;
        private _strokeWidth?: number;

        constructor(init?: DualIconInit) {
            super(init);
            if (init) {
                if (init.icon !== undefined)
                    this.icon = init.icon;
                if (init.fill !== undefined)
                    this.fill = init.fill;
                if (init.stroke !== undefined)
                    this.stroke = init.stroke;
                if (init.strokeWidth !== undefined)
                    this.strokeWidth = init.strokeWidth;	
            }
        }

        set icon(icon: string) {
            this._icon = icon;
            this.invalidateDraw();
        }

        get fill(): Color {
            if (this._fill === undefined)
                return Ui.Color.create(this.getStyleProperty('fill'));
            else
                return this._fill;
        }
    
        set fill(fill: Color) {
            this._fill = fill;
            this.invalidateDraw();
        }

        get stroke(): Color {
            if (this._stroke === undefined)
                return Ui.Color.create(this.getStyleProperty('stroke'));
            else
                return this._stroke;
        }
            
        set stroke(stroke: Color) {
            this._stroke = stroke;
            this.invalidateDraw();
        }

        get strokeWidth(): number {
            if (this._strokeWidth === undefined)
                return this.getStyleProperty('strokeWidth');
            else
                return this._strokeWidth;
        }

        set strokeWidth(strokeWidth: number) {
            this._strokeWidth = strokeWidth;
            this.invalidateDraw();
        }

        updateCanvas(ctx) {
            if (!this._icon)
                return;	
            let strokeWidth = this.strokeWidth;
            ctx.save();
            let scale = Math.min(this.layoutWidth, this.layoutHeight) / 48;
            ctx.scale(scale, scale);
            ctx.translate(strokeWidth, strokeWidth);
            let scale2 = (48 - (strokeWidth * 2)) / 48;
            ctx.scale(scale2, scale2);
            let path = Icon.getPath(this._icon);
            if (path == undefined)
                throw `Icon '${this._icon}' NOT AVAILABLE for DualIcon`;
            ctx.svgPath(path);
            ctx.strokeStyle = this.stroke.getCssRgba();
            ctx.lineWidth = strokeWidth * 2;
            ctx.stroke();
            ctx.fillStyle = this.fill.getCssRgba();
            ctx.fill();
            ctx.restore();
        }

        static style:any = {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2
        }
    }
}


