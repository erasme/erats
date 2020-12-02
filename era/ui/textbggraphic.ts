namespace Ui
{
    export class TextBgGraphic extends CanvasElement
    {
        private textHasFocus: boolean = false;

        set hasFocus(hasFocus: boolean) {
            if (this.textHasFocus !== hasFocus) {
                this.textHasFocus = hasFocus;
                this.invalidateDraw();
            }
        }

        private get background(): Color {
            let color;
            if (this.textHasFocus)
                color = Ui.Color.create(this.getStyleProperty('focusBackground'));
            else
                color = Ui.Color.create(this.getStyleProperty('background'));
            return color;
        }

        private get backgroundBorder(): Color {
            if (this.textHasFocus)
                return Color.create(this.getStyleProperty('focusBackgroundBorder'));
            else
                return Color.create(this.getStyleProperty('backgroundBorder'));	
        }

        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;

            let radius = this.getStyleProperty('radius');
            radius = Math.max(0, Math.min(radius, Math.min(w / 2, h / 2)));
            let borderWidth = this.getStyleProperty('borderWidth');
            ctx.lineWidth = borderWidth;
        
            let lh = Math.max(8, h - 4 - 16);
    
            // handle disable
            if (this.isDisabled)
                ctx.globalAlpha = 0.2;
        
            ctx.fillStyle = this.background.getCssRgba();
            ctx.beginPath();

            ctx.roundRect(0 + borderWidth / 2, 0 + borderWidth / 2, w - borderWidth, h - borderWidth, radius, radius, radius, radius);

            /*ctx.moveTo(0, h-lh-4);
            ctx.lineTo(0, h-4);
            ctx.lineTo(w, h-4);
            ctx.lineTo(w, h-8-4+borderWidth);
            ctx.lineTo(w-borderWidth, h-8-4+borderWidth);
            ctx.lineTo(w-borderWidth, h-4-borderWidth);
            ctx.lineTo(borderWidth, h-4-borderWidth);
            ctx.lineTo(borderWidth, h-lh-4);*/

            /*ctx.moveTo(0, h-4);
            ctx.lineTo(w, h-4);
            ctx.lineTo(w, h-4-borderWidth);
            ctx.lineTo(0, h-4-borderWidth);*/
            ctx.closePath();
            ctx.fill();
            if (borderWidth > 0) {
                ctx.strokeStyle = this.backgroundBorder.getCssRgba();
                ctx.stroke();
            }
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

        static style: TextBgGraphicStyle = {
            radius: 2,
            borderWidth: 1,
            background: Color.create('rgba(120,120,120,0.2)'),
            focusBackground: Color.create('rgba(33,211,255,0.4)'),
            backgroundBorder: Color.create('rgba(60,60,60,0.2)'),
            focusBackgroundBorder: Color.create('rgba(60,60,60,0.2)')
        }
    }

    export interface TextBgGraphicStyle {
        radius: number;
        borderWidth: number;
        background: Color;
        focusBackground: Color;
        backgroundBorder: Color;
        focusBackgroundBorder: Color;
    }
}