namespace Ui {

    export type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' |
        '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

    export type TextTransform = 'none' | 'uppercase' | 'lowercase';

    export type TextAlign = 'left' | 'right' | 'center' | 'justify';

    export interface LabelInit extends ElementInit {
        text?: string;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: FontWeight;
        color?: Color | string;
        orientation?: Orientation;
        textTransform?: TextTransform;
        textAlign?: TextAlign;
    }

    export interface LabelStyle {
        color: Color;
        fontSize: number;
        fontFamily: string;
        fontWeight: FontWeight;
    }

    export class Label extends Element implements LabelInit {
        private _text: string = '';
        private _orientation: Orientation = 'horizontal';
        private _fontSize?: number;
        private _fontFamily?: string;
        private _fontWeight?: FontWeight;
        private _color?: Color;
        labelDrawing!: HTMLElement;
        private textMeasureValid: boolean = false;
        private textWidth: number = 0;
        private textHeight: number = 0;
        private _textTransform?: TextTransform;
        private _textAlign?: TextAlign;

        constructor(init?: LabelInit) {
            super(init);
            if (!init || init.verticalAlign == undefined)
                this.verticalAlign = 'center';
            if (!init || init.horizontalAlign == undefined)
                this.horizontalAlign = 'center';
            if (!init || init.selectable == undefined)
                this.selectable = false;
            if (init) {
                if (init.text !== undefined)
                    this.text = init.text;
                if (init.fontSize !== undefined)
                    this.fontSize = init.fontSize;
                if (init.fontFamily !== undefined)
                    this.fontFamily = init.fontFamily;
                if (init.fontWeight !== undefined)
                    this.fontWeight = init.fontWeight;
                if (init.color !== undefined)
                    this.color = init.color;
                if (init.orientation !== undefined)
                    this.orientation = init.orientation;
                if (init.textTransform !== undefined)
                    this.textTransform = init.textTransform;
                if (init.textAlign !== undefined)
                    this.textAlign = init.textAlign;
            }
        }

        get text(): string {
            return this._text;
        }

        set text(text: string) {
            if (this._text != text) {
                this._text = text;
                if ('textContent' in this.labelDrawing)
                    this.labelDrawing.textContent = this._text;
                else
                    (this.labelDrawing as any).innerText = this._text;
                this.textMeasureValid = false;
                this.invalidateMeasure();
            }
        }

        set fontSize(fontSize: number) {
            if (this._fontSize !== fontSize) {
                this._fontSize = fontSize;
                this.labelDrawing.style.fontSize = this.fontSize + 'px';
                this.labelDrawing.style.lineHeight = this.fontSize + 'px';
                this.textMeasureValid = false;
                this.invalidateMeasure();
            }
        }

        get fontSize(): number {
            if (this._fontSize !== undefined)
                return this._fontSize;
            else
                return this.getStyleProperty('fontSize');
        }

        set fontFamily(fontFamily: string) {
            if (this._fontFamily !== fontFamily) {
                this._fontFamily = fontFamily;
                this.labelDrawing.style.fontFamily = this.fontFamily;
                this.textMeasureValid = false;
                this.invalidateMeasure();
            }
        }

        get fontFamily(): string {
            if (this._fontFamily !== undefined)
                return this._fontFamily;
            else
                return this.getStyleProperty('fontFamily');
        }

        set fontWeight(fontWeight: FontWeight) {
            if (this._fontWeight !== fontWeight) {
                this._fontWeight = fontWeight;
                this.labelDrawing.style.fontWeight = this.fontWeight;
                this.textMeasureValid = false;
                this.invalidateMeasure();
            }
        }

        get fontWeight(): FontWeight {
            if (this._fontWeight !== undefined)
                return this._fontWeight;
            else
                return this.getStyleProperty('fontWeight');
        }

        set textTransform(textTransform: TextTransform) {
            if (this._textTransform !== textTransform) {
                this._textTransform = textTransform;
                this.labelDrawing.style.textTransform = this.textTransform;
                this.textMeasureValid = false;
                this.invalidateMeasure();
            }
        }

        get textTransform(): TextTransform {
            if (this._textTransform !== undefined)
                return this._textTransform;
            else
                return this.getStyleProperty('textTransform');
        }

        get textAlign(): TextAlign {
            if (this._textAlign !== undefined)
                return this._textAlign;
            else
                return this.getStyleProperty('textAlign');
        }

        set textAlign(textAlign: TextAlign) {
            if (this._textAlign !== textAlign) {
                this._textAlign = textAlign;
                this.drawing.style.textAlign = this.textAlign;
            }
        }

        set color(color: Color | string) {
            if (this._color !== color) {
                this._color = Color.create(color);
                this.labelDrawing.style.color = this.getColor().getCssRgba();
            }
        }

        private getColor(): Color {
            if (this._color !== undefined)
                return this._color;
            else
                return Ui.Color.create(this.getStyleProperty('color'));
        }

        get orientation(): Orientation {
            return this._orientation;
        }

        set orientation(orientation: Orientation) {
            if (this._orientation != orientation) {
                this._orientation = orientation;
                this.invalidateMeasure();
            }
        }

        onStyleChange() {
            this.labelDrawing.style.fontSize = this.fontSize + 'px';
            this.labelDrawing.style.lineHeight = this.fontSize + 'px';
            this.labelDrawing.style.fontFamily = this.fontFamily;
            this.labelDrawing.style.fontWeight = this.fontWeight;
            this.labelDrawing.style.textTransform = this.textTransform;
            this.labelDrawing.style.textAlign = this.textAlign;
            this.labelDrawing.style.color = this.getColor().getCssRgba();
            this.textMeasureValid = false;
            this.invalidateMeasure();
        }

        renderDrawing() {
            this.labelDrawing = document.createElement('div');
            this.labelDrawing.style.whiteSpace = 'nowrap';
            this.labelDrawing.style.display = 'inline';
            this.labelDrawing.style.position = 'absolute';
            this.labelDrawing.style.left = '0px';
            this.labelDrawing.style.top = '0px';
            return this.labelDrawing;
        }

        invalidateTextMeasure() {
            if (this.textMeasureValid) {
                this.textMeasureValid = false;
                this.invalidateMeasure();
            }
        }

        measureCore(width: number, height: number) {
            if (!this.textMeasureValid) {
                this.textMeasureValid = true;
                let text = this._text;
                if (this.textTransform == 'uppercase')
                    text = text.toUpperCase();
                else if (this.textTransform == 'lowercase')
                    text = text.toLowerCase();
                let size = Ui.Label.measureText(text, this.fontSize, this.fontFamily, this.fontWeight);
                this.textWidth = size.width;
                this.textHeight = size.height;
            }
            if (this._orientation === 'vertical')
                return { width: this.textHeight, height: this.textWidth };
            else
                return { width: this.textWidth, height: this.textHeight };
        }

        arrangeCore(width, height) {
            if (this._orientation == 'vertical') {
                let matrix = Ui.Matrix.createTranslate(this.labelDrawing.offsetHeight, 0);
                matrix = matrix.rotate(90);
                this.labelDrawing.style.transform = matrix.toString();
                this.labelDrawing.style.transformOrigin = '0% 0%';
            }
            else {
                this.labelDrawing.style.removeProperty('transform');
            }
        }

        static measureBox: any = undefined;
        static measureContext: any = undefined;

        private static measureTextCanvas(text, fontSize, fontFamily, fontWeight) {
            if (Ui.Label.measureBox === undefined)
                this.createMeasureCanvas();
            Ui.Label.measureContext.font = 'normal ' + fontWeight + ' ' + fontSize + 'px ' + fontFamily;
            let res = Ui.Label.measureContext.measureText(text);
            res.height = fontSize;
            return res;
        }

        private static createMeasureCanvas() {
            let measureWindow = window as Window;
            if (measureWindow.document.body === undefined) {
                let body = measureWindow.document.createElement('body');
                measureWindow.document.body = body;
            }
            Ui.Label.measureBox = measureWindow.document.createElement('canvas');
            Ui.Label.measureBox.style.visibility = 'hidden';
            Ui.Label.measureBox.style.position = 'absolute';
            Ui.Label.measureBox.style.left = '0px';
            Ui.Label.measureBox.style.top = '0px';
            Ui.Label.measureBox.style.outline = 'none';
            Ui.Label.measureBox.setAttribute('width', '10');
            Ui.Label.measureBox.setAttribute('height', '10');
            measureWindow.document.body.appendChild(Ui.Label.measureBox);
            Ui.Label.measureContext = Ui.Label.measureBox.getContext('2d');
        }

        static isFontAvailable(fontFamily: string, fontWeight: string) {
            let i;
            if (Ui.Label.measureBox === undefined)
                Ui.Label.createMeasureCanvas();
            let ctx = Ui.Label.measureContext;
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.clearRect(0, 0, 10, 10);
            ctx.textBaseline = 'top';
            //console.log('isFontAvailable('+fontFamily+','+fontWeight+')');
            // draw with the wanted font
            ctx.font = 'normal ' + fontWeight + ' 10px ' + fontFamily;
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.fillText('@', 0, 0);
            let wantedImageData = ctx.getImageData(0, 0, 10, 10);
            let empty = true;
            for (i = 0; empty && (i < wantedImageData.data.length); i += 4) {
                if (wantedImageData.data[i + 3] !== 0)
                    empty = false;
            }
            if (empty)
                return false;
            // draw with a local font
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.clearRect(0, 0, 10, 10);
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.font = 'normal ' + fontWeight + ' 10px Sans-Serif';
            ctx.fillText('@', 0, 0);
            let refImageData = ctx.getImageData(0, 0, 10, 10);
            // draw with wanted font fallback local font
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.clearRect(0, 0, 10, 10);
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.font = 'normal ' + fontWeight + ' 10px ' + fontFamily + ',Sans-Serif';
            ctx.fillText('@', 0, 0);
            // test if images are differents
            let imageData = ctx.getImageData(0, 0, 10, 10);
            for (i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i + 3] !== refImageData.data[i + 3])
                    return true;
            }
            return false;
        }

        private static measureTextHtml(text: string, fontSize: number, fontFamily: string, fontWeight: string) {
            if (Ui.Label.measureBox === undefined)
                this.createMeasureHtml();
            Ui.Label.measureBox.style.fontSize = fontSize + 'px';
            Ui.Label.measureBox.style.fontFamily = fontFamily;
            Ui.Label.measureBox.style.fontWeight = fontWeight;
            if ('textContent' in Ui.Label.measureBox)
                Ui.Label.measureBox.textContent = text;
            else
                Ui.Label.measureBox.innerText = text;
            return { width: Ui.Label.measureBox.offsetWidth, height: Ui.Label.measureBox.offsetHeight };
        }

        private static createMeasureHtml() {
            let measureWindow = window as Window;
            if (Core.Navigator.isGecko)
                measureWindow = Ui.App.getRootWindow();

            if (measureWindow.document.body === undefined) {
                let body = measureWindow.document.createElement('body');
                measureWindow.document.body = body;
            }
            Ui.Label.measureBox = measureWindow.document.createElement('div');
            Ui.Label.measureBox.style.whiteSpace = 'nowrap';
            Ui.Label.measureBox.style.position = 'absolute';
            Ui.Label.measureBox.style.left = '0px';
            Ui.Label.measureBox.style.top = '0px';
            Ui.Label.measureBox.style.position = 'absolute';
            Ui.Label.measureBox.style.display = 'inline';
            Ui.Label.measureBox.style.visibility = 'hidden';
            measureWindow.document.body.appendChild(Ui.Label.measureBox);
        }

        static measureText(text: string, fontSize: number, fontFamily: string, fontWeight: string): { width: number, height: number } {
            if ((text === '') || (text === undefined))
                return { width: 0, height: fontSize };
            return Ui.Label.measureTextCanvas(text, fontSize, fontFamily, fontWeight);
        }

        static style: object = {
            color: Color.create('#444444'),
            fontSize: 16,
            fontFamily: 'Sans-serif',
            fontWeight: 'normal',
            textTransform: 'none',
            textAlign: 'left'
        }
    }
}

