namespace Ui
{
    export interface HtmlInit extends ElementInit {
        html?: string;
        text?: string;
        textAlign?: string;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string;
        interLine?: number;
        wordWrap?: string;
        whiteSpace?: string;
        color?: Color | string;
        onlink?: (event: {target: Html, ref: string }) => void;
    }

    export class Html extends Element implements HtmlInit
    {
        protected htmlDrawing: HTMLElement;
        private bindedOnImageLoad: any = undefined;
        private _fontSize: number = undefined;
        private _fontFamily: string = undefined;
        private _fontWeight: any = undefined;
        private _color: any = undefined;
        private _textAlign: string = undefined;
        private _interLine: number = undefined;
        private _wordWrap: string = undefined;
        private _whiteSpace: string = undefined;
        readonly link = new Core.Events<{target: Html, ref: string }>();
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
    
        getElements(tagName) {
            let res = [];
            this.searchElements(tagName.toUpperCase(), this.htmlDrawing, res);
            return res;
        }
    
        searchElements(tagName, element, res) {
            for (let i = 0; i < element.childNodes.length; i++) {
                let child = element.childNodes[i];
                if (('tagName' in child) && (child.tagName.toUpperCase() == tagName))
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
        
        get html(): string {
            return this.htmlDrawing.innerHTML;
        }

        set html(html) {
            // update HTML content
            this.htmlDrawing.innerHTML = html;
            // watch for load events
            let tab = this.getElements('IMG');
            for (let i = 0; i < tab.length; i++)
                tab[i].onload = this.bindedOnImageLoad;
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
    
        get textAlign(): string {
            if (this._textAlign !== undefined)
                return this._textAlign;
            else
                return this.getStyleProperty('textAlign');
        }

        set textAlign(textAlign: string) {
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
    
        get fontWeight() {
            if (this._fontWeight !== undefined)
                return this._fontWeight;
            else
                return this.getStyleProperty('fontWeight');
        }
    
        set fontWeight(fontWeight) {
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
                this.drawing.style.lineHeight = this.interLine;
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

        set color(color: Color | string) {
            if (this._color !== color) {
                this._color = Color.create(color);
                if (Core.Navigator.supportRgba)
                    this.drawing.style.color = this._color.getCssRgba();
                else
                    this.drawing.style.color = this._color.getCssHtml();
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
                event.preventDefault();
                event.stopPropagation();
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
            if (Core.Navigator.supportRgba)
                this.drawing.style.color = this.getColor().getCssRgba();
            else
                this.drawing.style.color = this.getColor().getCssHtml();
            this.drawing.style.lineHeight = this.interLine;
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
            //console.log(this+'.measureCore('+width+','+height+') clientWidth: '+this.htmlDrawing.clientWidth+' '+this.drawing.innerHTML);
            this.htmlDrawing.style.width = '';
            this.htmlDrawing.style.height = '';
            // if client width is bigger than the constraint width, set the htmlDrawing
            // width and test again. This will allow (for ex) word wrap to try to reduce the width
            let measureWidth: number;
            if (this.htmlDrawing.clientWidth == width)
                measureWidth = width;
            
            //if (this.htmlDrawing.clientWidth >= width) {
            //	this.htmlDrawing.style.width = width + 'px';
            //	measureWidth = width;
            //}
            // if the clientWidth is less than the available one, take it and add 1
            // because the returned clientWidth is an integer value but the real one
            // is a floating value in Chrome. And this floating point value is Math.floor
            else
                measureWidth = Math.max(this.htmlDrawing.clientWidth, this.htmlDrawing.scrollWidth) + 1;
            return {
                width: measureWidth,
                height: this.htmlDrawing.clientHeight
            };
        }

        protected arrangeCore(width: number, height: number) {
            //		console.log(this+'.arrangeCore('+width+','+height+')');
            //		this.htmlDrawing.style.width = width+'px';// '100%';
            // add 1px to the width because of Chrome pixel bug
            this.htmlDrawing.style.width = width.toString() + 'px';
            //this.htmlDrawing.style.height = height + 'px';
        }

        static style: object = {
            color: 'black',
            fontSize: 16,
            fontFamily: 'Sans-serif',
            fontWeight: 'normal',
            textAlign: 'left',
            wordWrap: 'normal',
            whiteSpace: 'normal',
            interLine: 1
        }
    }
}	
    