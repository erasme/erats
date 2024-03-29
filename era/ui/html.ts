namespace Ui {
    export interface HtmlInit extends ElementInit {
        html?: string;
        text?: string;
        textAlign?: TextAlign;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: FontWeight;
        interLine?: number;
        wordWrap?: string;
        wordBreak?: string;
        whiteSpace?: string;
        color?: Color | string;
        onlink?: (event: { target: Html, ref: string }) => void;
    }

    export class Html extends Element implements HtmlInit {
        captureLink = true;
        protected htmlDrawing!: HTMLElement;
        private bindedOnImageLoad: any = undefined;
        private _fontSize?: number;
        private _fontFamily?: string;
        private _fontWeight?: FontWeight;
        private _color: any = undefined;
        private _textAlign?: TextAlign;
        private _interLine?: number;
        private _wordWrap?: string;
        private _wordBreak?: string;
        private _whiteSpace?: string;
        readonly link = new Core.Events<{ target: Html, ref: string }>();
        set onlink(value: (event: { target: Html, ref: string }) => void) { this.link.connect(value); }

        constructor(init?: HtmlInit) {
            super(init);

            this.bindedOnImageLoad = this.onImageLoad.bind(this);
            this.drawing.addEventListener('click', (e) => this.onClick(e));
            // this.drawing.addEventListener('DOMSubtreeModified', (e) => this.onSubtreeModified(e));
            this.drawing.addEventListener('keypress', (e) => this.onKeyPress(e));
            if (init) {
                if (init.text !== undefined)
                    this.text = init.text;
                if (init.html !== undefined)
                    this.html = init.html;
                if (init.textAlign !== undefined)
                    this.textAlign = init.textAlign;
                if (init.fontSize !== undefined)
                    this.fontSize = init.fontSize;
                if (init.fontFamily !== undefined)
                    this.fontFamily = init.fontFamily;
                if (init.fontWeight !== undefined)
                    this.fontWeight = init.fontWeight;
                if (init.interLine !== undefined)
                    this.interLine = init.interLine;
                if (init.wordWrap !== undefined)
                    this.wordWrap = init.wordWrap;
                if (init.whiteSpace !== undefined)
                    this.whiteSpace = init.whiteSpace;
                if (init.color !== undefined)
                    this.color = init.color;
                if (init.onlink !== undefined)
                    this.link.connect(init.onlink);
            }
        }

        getElements(tagName: string) {
            let res = new Array<HTMLElement>();
            this.searchElements(tagName.toUpperCase(), this.htmlDrawing, res);
            return res;
        }

        searchElements(tagName: string, element: HTMLElement, res: HTMLElement[]) {
            for (let i = 0; i < element.childNodes.length; i++) {
                let child = element.childNodes[i];
                if (!(child instanceof HTMLElement))
                    continue;
                if (child.tagName.toUpperCase() == tagName)
                    res.push(child);
                this.searchElements(tagName, child, res);
            }
        }

        getParentElement(tagName, element) {
            do {
                if (('tagName' in element) && (element.tagName.toUpperCase() == tagName))
                    return element;
                if (element.parentNode == undefined)
                    return undefined;
                if (element.parentNode === this.drawing)
                    return undefined;
                element = element.parentNode;
            } while (true);
        }

        protected onSetHtml() {
        }

        get html(): string {
            return this.htmlDrawing.innerHTML;
        }

        private bindChildEvents() {
            // watch for load events
            let tab = this.getElements('IMG');
            for (let i = 0; i < tab.length; i++)
                tab[i].onload = this.bindedOnImageLoad;
        }

        set html(html) {
            // update HTML content
            this.htmlDrawing.innerHTML = html;
            this.onSetHtml();
            this.bindChildEvents();
            this.invalidateMeasure();
        }

        set htmlElement(htmlElement: HTMLElement) {
            while (this.htmlDrawing.firstChild)
                this.htmlDrawing.removeChild(this.htmlDrawing.firstChild);
            this.htmlDrawing.appendChild(htmlElement);
            this.onSetHtml();
            this.bindChildEvents();
            this.invalidateMeasure();
        }

        get text(): string {
            if ('innerText' in (this.htmlDrawing as any))
                return this.htmlDrawing.innerText;
            else
                return this.getTextContent(this.htmlDrawing);
        }

        set text(text: string) {
            if ('innerText' in this.htmlDrawing)
                this.htmlDrawing.innerText = text;
            else {
                // convert text to HTML to support newline like innerText
                let div = document.createElement('div');
                let content;
                div.textContent = text;
                content = div.textContent;
                let lines = content.split('\n');
                let content2 = '';
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] !== '') {
                        if (content2 !== '')
                            content2 += "<br>";
                        content2 += lines[i];
                    }
                }
                this.html = content2;
            }
            this.onSetHtml();
            this.invalidateMeasure();
        }

        private getTextContent(el) {
            let text = '';
            if (el.nodeType === 3)
                text += el.textContent;
            else if ((el.nodeType === 1) && ((el.nodeName == "BR") || (el.nodeName == "P")))
                text += '\n';
            if ('childNodes' in el) {
                for (let i = 0; i < el.childNodes.length; i++)
                    text += this.getTextContent(el.childNodes[i]);
            }
            return text;
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

        get fontSize(): number {
            if (this._fontSize !== undefined)
                return this._fontSize;
            else
                return this.getStyleProperty('fontSize');
        }

        set fontSize(fontSize: number) {
            if (this._fontSize !== fontSize) {
                this._fontSize = fontSize;
                this.drawing.style.fontSize = this.fontSize + 'px';
                this.invalidateMeasure();
            }
        }

        get fontFamily(): string {
            if (this._fontFamily !== undefined)
                return this._fontFamily;
            else
                return this.getStyleProperty('fontFamily');
        }

        set fontFamily(fontFamily: string) {
            if (this._fontFamily !== fontFamily) {
                this._fontFamily = fontFamily;
                this.drawing.style.fontFamily = this.fontFamily;
                this.invalidateMeasure();
            }
        }

        get fontWeight(): FontWeight {
            if (this._fontWeight !== undefined)
                return this._fontWeight;
            else
                return this.getStyleProperty('fontWeight');
        }

        set fontWeight(fontWeight: FontWeight) {
            if (this._fontWeight !== fontWeight) {
                this._fontWeight = fontWeight;
                this.drawing.style.fontWeight = this.fontWeight;
                this.invalidateMeasure();
            }
        }

        get interLine(): number {
            if (this._interLine !== undefined)
                return this._interLine;
            else
                return this.getStyleProperty('interLine');
        }

        set interLine(interLine: number) {
            if (this._interLine !== interLine) {
                this._interLine = interLine;
                this.drawing.style.lineHeight = this.interLine.toString();
                this.invalidateMeasure();
            }
        }

        get wordWrap(): string {
            if (this._wordWrap !== undefined)
                return this._wordWrap;
            else
                return this.getStyleProperty('wordWrap');
        }

        set wordWrap(wordWrap: string) {
            if (this._wordWrap !== wordWrap) {
                this._wordWrap = wordWrap;
                this.drawing.style.wordWrap = this.wordWrap;
                this.invalidateMeasure();
            }
        }

        get wordBreak(): string {
            if (this._wordBreak !== undefined)
                return this._wordBreak;
            else
                return this.getStyleProperty('wordBreak');
        }

        set wordBreak(wordBreak: string) {
            if (this._wordBreak !== wordBreak) {
                this._wordBreak = wordBreak;
                this.drawing.style.wordBreak = this.wordBreak;
                this.invalidateMeasure();
            }
        }

        get whiteSpace(): string {
            if (this._whiteSpace !== undefined)
                return this._whiteSpace;
            else
                return this.getStyleProperty('whiteSpace');
        }

        set whiteSpace(whiteSpace: string) {
            if (this._whiteSpace !== whiteSpace) {
                this._whiteSpace = whiteSpace;
                this.drawing.style.whiteSpace = this.whiteSpace;
                this.invalidateMeasure();
            }
        }

        protected getColor(): Color {
            if (this._color !== undefined)
                return this._color;
            else
                return Color.create(this.getStyleProperty('color'));
        }

        set color(color: Color | string | undefined) {
            if (this._color !== color) {
                if (color == undefined) {
                    this._color = undefined;
                    this.drawing.style.color = this.getColor().getCssRgba();
                }
                else {
                    this._color = Color.create(color);
                    this.drawing.style.color = this._color.getCssRgba();
                }
            }
        }

        protected onSubtreeModified(event) {
            this.invalidateMeasure();
        }

        protected onKeyPress(event: KeyboardEvent) {
            this.invalidateMeasure();
        }

        protected onImageLoad(event) {
            this.invalidateMeasure();
        }

        protected onClick(event) {
            let target = this.getParentElement('A', event.target);
            if (target !== undefined) {
                if (this.captureLink) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                this.link.fire({ target: this, ref: target.href });
            }
        }

        protected onVisible() {
            // HTML size might change when really visible in the DOM
            this.invalidateMeasure();
        }

        protected onStyleChange() {
            this.drawing.style.textAlign = this.textAlign;
            this.drawing.style.fontSize = this.fontSize + 'px';
            this.drawing.style.fontFamily = this.fontFamily;
            this.drawing.style.fontWeight = this.fontWeight;
            this.drawing.style.color = this.getColor().getCssRgba();
            this.drawing.style.lineHeight = this.interLine.toString();
            this.drawing.style.wordWrap = this.wordWrap;
        }

        protected renderDrawing() {
            let drawing = super.renderDrawing();
            this.htmlDrawing = document.createElement('div');
            this.htmlDrawing.style.outline = 'none';
            this.htmlDrawing.style.padding = '0px';
            this.htmlDrawing.style.margin = '0px';
            this.htmlDrawing.style.display = 'inline-block';
            this.htmlDrawing.style.width = '';
            drawing.appendChild(this.htmlDrawing);
            return drawing;
        }

        protected measureCore(width: number, height: number) {
            width = (this.width !== undefined) ? Math.max(width, this.width) : width;

            this.drawing.style.width = width + 'px';
            this.htmlDrawing.style.width = '';
            this.htmlDrawing.style.height = '';
            // if client width is bigger than the constraint width, set the htmlDrawing
            // width and test again. This will allow (for ex) word wrap to try to reduce the width
            let measureWidth: number;
            if (this.htmlDrawing.clientWidth == width)
                measureWidth = width;
            // if the clientWidth is less than the available one, take it and add 1
            // because the returned clientWidth is an integer value but the real one
            // is a floating value in Chrome. And this floating point value is Math.floor
            else
                measureWidth = Math.max(this.htmlDrawing.clientWidth, this.htmlDrawing.scrollWidth) + 1;
            let measureHeight = Math.max(this.htmlDrawing.clientHeight, this.fontSize);
            // restore the previous layout in case arrange will not be used
            this.htmlDrawing.style.width = `${this.layoutWidth}px`;
            this.htmlDrawing.style.height = `${this.layoutHeight}px`;
            return {
                width: measureWidth,
                height: measureHeight
            };
        }

        protected arrangeCore(width: number, height: number) {
            this.htmlDrawing.style.width = `${width}px`;
            this.htmlDrawing.style.height = `${height}px`;
        }

        static style: object = {
            color: 'black',
            fontSize: 16,
            fontFamily: 'Sans-serif',
            fontWeight: 'normal',
            textAlign: 'left',
            wordWrap: 'normal',
            wordBreak: 'normal',
            whiteSpace: 'normal',
            interLine: 1
        }
    }
}
