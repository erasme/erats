namespace Ui
{
	export class CompactLabelContext extends Core.Object
	{
		text: string = '';
		fontSize: number = 16;
		fontFamily: string = 'Sans-Serif';
		fontWeight: string = 'normal';
		maxLine: number = Number.MAX_VALUE;
		interLine: number = 1;
		textAlign: string = 'left';
		width: number = Number.MAX_VALUE;
		drawLine: any = undefined;
		whiteSpace: 'pre-line' | 'nowrap' = 'pre-line'; // [pre-line|nowrap]
		wordWrap: 'normal' | 'break-word' = 'normal'; // [normal|break-word]
		textTransform: 'none' | 'lowercase' | 'uppercase' = 'none'; // [none|lowercase|uppercase]

		constructor() {
			super();
		}

		setDrawLine(func) {
			this.drawLine = func;
		}

		getWhiteSpace() {
			return this.whiteSpace;
		}

		setWhiteSpace(whiteSpace) {
			this.whiteSpace = whiteSpace;
		}

		getWordWrap() {
			return this.wordWrap;
		}

		setWordWrap(wordWrap) {
			this.wordWrap = wordWrap;
		}

		getMaxLine() {
			return this.maxLine;
		}

		setMaxLine(maxLine) {
			if (this.maxLine !== maxLine)
				this.maxLine = maxLine;
		}

		getTextAlign() {
			return this.textAlign;
		}

		setTextAlign(textAlign) {
			if (this.textAlign !== textAlign)
				this.textAlign = textAlign;
		}

		setInterLine(interLine) {
			if (this.interLine !== interLine)
				this.interLine = interLine;
		}

		getInterLine() {
			return this.interLine;
		}

		getText() {
			return this.text;
		}

		setText(text) {
			if (this.text !== text) {
				this.text = text;
			}
		}

		setFontSize(fontSize) {
			if (this.fontSize !== fontSize) {
				this.fontSize = fontSize;
			}
		}

		getFontSize() {
			return this.fontSize;
		}

		setFontFamily(fontFamily) {
			if (this.fontFamily !== fontFamily) {
				this.fontFamily = fontFamily;
			}
		}

		getFontFamily() {
			return this.fontFamily;
		}

		setFontWeight(fontWeight) {
			if (this.fontWeight !== fontWeight) {
				this.fontWeight = fontWeight;
			}
		}

		getFontWeight() {
			return this.fontWeight;
		}

		getTextTransform() {
			return this.textTransform;
		}

		setTextTransform(textTransform) {
			this.textTransform = textTransform;
		}

		getTransformedText() {
			if (this.textTransform === 'lowercase')
				return this.text.toLowerCase();
			else if (this.textTransform === 'uppercase')
				return this.text.toUpperCase();
			else
				return this.text;
		}

		flushLine(y, line, width, render, lastLine : boolean = false) {
			let size = Ui.Label.measureText(line, this.getFontSize(), this.getFontFamily(), this.getFontWeight());
			if (render) {
				let x;
				if (this.textAlign == 'left')
					x = 0;
				else if (this.textAlign == 'right')
					x = width - size.width;
				else
					x = (width - size.width) / 2;
			
				if (render)
					this.drawLine(x, y, line);
			}
			return size.height * ((lastLine === true) ? 1 : this.getInterLine());
		}

		updateFlow(width, render) {
			if (this.text === undefined)
				return { width: 0, height: 0 };

			let text = this.getTransformedText();
			let fontSize = this.getFontSize();
			let fontFamily = this.getFontFamily();
			let fontWeight = this.getFontWeight();

			let dotWidth = (Ui.Label.measureText('...', fontSize, fontFamily, fontWeight)).width;
			let y = 0;
			let x = 0;
			let line = '';
			let lineCount = 0;
			let maxWidth = 0;
			for (let i = 0; i < text.length; i++) {
				let size = Ui.Label.measureText(line + text.charAt(i), fontSize, fontFamily, fontWeight);
				if ((this.maxLine !== undefined) && (lineCount + 1 >= this.maxLine) && (size.width + dotWidth > width)) {
					y += this.flushLine(y, line + '...', width, render);
					if (x + dotWidth > maxWidth)
						maxWidth = x + dotWidth;
					return { width: maxWidth, height: y };
				}
				else if (size.width > width) {
					y += this.flushLine(y, line, width, render);
					lineCount++;
					if (x > maxWidth)
						maxWidth = x;
					line = text.charAt(i);
				}
				else
					line += text.charAt(i);
				x = size.width;
			}
			if (line !== '') {
				y += this.flushLine(y, line, width, render, true);
				if (x > maxWidth)
					maxWidth = x;
			}
			return { width: maxWidth, height: y };
		}

		updateFlowWords(width, render) {
			if (this.text == undefined)
				return { width: 0, height: 0 };
		
			let i; let lineWidth;
			let text = this.getTransformedText();
			let fontSize = this.getFontSize();
			let fontFamily = this.getFontFamily();
			let fontWeight = this.getFontWeight();

			let dotWidth = (Ui.Label.measureText('...', fontSize, fontFamily, fontWeight)).width;

			let words = [];
			let wordsSize = [];

			let tmpWords = text.split(' ');
			for (i = 0; i < tmpWords.length; i++) {
				let word = tmpWords[i];
				while (true) {
					let wordSize = (Ui.Label.measureText(word, fontSize, fontFamily, fontWeight)).width;
					if (wordSize < width) {
						words.push(word);
						wordsSize.push(wordSize);
						break;
					}
					else {
						// find the biggest possible word part but a least take 1 char
						let tmpWord = '';
						for (let i2 = 0; i2 < word.length; i2++) {
							if ((Ui.Label.measureText(tmpWord + word.charAt(i2), fontSize, fontFamily, fontWeight)).width < width)
								tmpWord += word.charAt(i2);
							else {
								// take a least 1 char to avoid infinite loops
								if (tmpWord === '')
									tmpWord = word.charAt(0);
								words.push(tmpWord);
								wordsSize.push((Ui.Label.measureText(tmpWord, fontSize, fontFamily, fontWeight)).width);
								word = word.substr(tmpWord.length, word.length - tmpWord.length);
								break;
							}
						}
					}
					if (word.length === 0)
						break;
				}
			}

			let spaceWidth = (Ui.Label.measureText('. .', fontSize, fontFamily, fontWeight)).width - (Ui.Label.measureText('..', fontSize, fontFamily, fontWeight)).width;

			let y = 0;
			let x = 0;
			let maxWidth = 0;
			let line = '';
			let lineCount = 0;
			for (i = 0; i < words.length; i++) {
				if (line !== '') {
					if (x + spaceWidth > width) {
						if (lineCount + 1 >= this.maxLine) {
							while (true) {
								lineWidth = (Ui.Label.measureText(line, fontSize, fontFamily, fontWeight)).width;
								if (lineWidth + dotWidth > width) {
									if (line.length <= 1) {
										line = '...';
										break;
									}
									line = line.substr(0, line.length - 1);
								}
								else {
									line += '...';
									break;
								}
							}
							y += this.flushLine(y, line, width, render);
							if (x > maxWidth)
								maxWidth = x;
							return { width: maxWidth, height: y };
						}
						y += this.flushLine(y, line, width, render);
						if (x > maxWidth)
							maxWidth = x;
						x = 0;
						lineCount++;
						line = '';
					}
					else {
						line += ' ';
						x += spaceWidth;
					}
				}
				if (x + wordsSize[i] > width) {
					if (lineCount + 1 >= this.maxLine) {
						while (true) {
							lineWidth = (Ui.Label.measureText(line, fontSize, fontFamily, fontWeight)).width;
							if (lineWidth + dotWidth > width) {
								if (line.length <= 1) {
									line = '...';
									break;
								}
								line = line.substr(0, line.length - 1);
							}
							else {
								line += '...';
								break;
							}
						}
						y += this.flushLine(y, line, width, render);
						if (x > maxWidth)
							maxWidth = x;
						return { width: maxWidth, height: y };
					}
					y += this.flushLine(y, line, width, render);
					lineCount++;
					if (x > maxWidth)
						maxWidth = x;
					x = wordsSize[i];
					line = words[i];
				}
				else {
					line += words[i];
					x += wordsSize[i];
				}
			}
			if (line !== '') {
				y += this.flushLine(y, line, width, render, true);
				if (x > maxWidth)
					maxWidth = x;
			}
			return { width: maxWidth, height: y };
		}

		drawText(width, render) {
			if (this.whiteSpace === 'nowrap') {
				let text = this.getTransformedText();
				let size = Ui.Label.measureText(text, this.fontSize, this.fontFamily, this.fontWeight);
				if (render)
					this.flushLine(0, text, width, true, true);
				return size;
			}
			else if (this.wordWrap === 'normal')
				return this.updateFlowWords(width, render);
			else
				return this.updateFlow(width, render);
		}
	}
	
	export interface CompactLabelInit extends ElementInit {
		maxLine?: number;
		text?: string;
		textAlign?: string;
		interLine?: number;
		fontSize?: number;
		fontFamily?: string;
		fontWeight?: string;
		whiteSpace?: string;
		wordWrap?: string;
		textTransform?: string;
		color?: Color;
	}

	export class CompactLabel extends Element implements CompactLabelInit
	{
		private _fontSize: number;
		private _fontFamily: string;
		private _fontWeight: string;
		private _color: any;
		private textDrawing: HTMLElement;
		private _maxLine: number;
		private _interLine: number;
		private _textAlign: string;
		isMeasureValid: boolean = false;
		isArrangeValid: boolean = false;
		lastMeasureWidth: number = 0;
		lastMeasureHeight: number = 0;
		lastAvailableWidth: number = 0;
		textContext: CompactLabelContext;
		private _whiteSpace: string;
		private _wordWrap: string ;
		private _textTransform: string;

		constructor(init?: CompactLabelInit) {
			super(init);
			if (!init || init.selectable == undefined)
				this.selectable = false;
			this.textContext = new Ui.CompactLabelContext();
			if (init) {
				if (init.maxLine !== undefined)
					this.maxLine = init.maxLine;	
				if (init.text !== undefined)
					this.text = init.text;	
				if (init.textAlign !== undefined)
					this.textAlign = init.textAlign;	
				if (init.interLine !== undefined)
					this.interLine = init.interLine;	
				if (init.fontSize !== undefined)
					this.fontSize = init.fontSize;
				if (init.fontFamily !== undefined)
					this.fontFamily = init.fontFamily;	
				if (init.fontWeight !== undefined)
					this.fontWeight = init.fontWeight;
				if (init.whiteSpace !== undefined)
					this.whiteSpace = init.whiteSpace;
				if (init.wordWrap !== undefined)
					this.wordWrap = init.wordWrap;	
				if (init.textTransform !== undefined)
					this.textTransform = init.textTransform;
				if (init.color !== undefined)
					this.color = init.color;	
			}
		}

		get maxLine(): number {
			if (this._maxLine !== undefined)
				return this._maxLine;
			else
				return this.getStyleProperty('maxLine');
		}

		set maxLine(maxLine: number) {
			this._maxLine = maxLine;
			this.textContext.setMaxLine(this.maxLine);
			this.invalidateMeasure();
		}

		get text(): string {
			return this.textContext.getText();
		}

		set text(text: string) {
			this.textContext.setText(text);
			this.isMeasureValid = false;
			this.invalidateMeasure();
		}
	
		get textAlign(): string {
			if (this._textAlign !== undefined)
				return this._textAlign;
			else
				return this.getStyleProperty('textAlign');
		}

		set textAlign(textAlign: string) {
			this._textAlign = textAlign;
			this.textContext.setTextAlign(this.textAlign);
			this.invalidateArrange();
		}

		get interLine(): number {
			if (this._interLine !== undefined)
				return this._interLine;
			else
				return this.getStyleProperty('interLine');
		}

		set interLine(interLine: number) {
			this._interLine = interLine;
			this.textContext.setInterLine(this.interLine);
			this.isMeasureValid = false;
			this.invalidateMeasure();
		}

		get fontSize(): number {
			if (this._fontSize !== undefined)
				return this._fontSize;
			else
				return this.getStyleProperty('fontSize');
		}

		set fontSize(fontSize: number) {
			this._fontSize = fontSize;
			this.isMeasureValid = false;
			this.textContext.setFontSize(this.fontSize);
			this.textDrawing.style.fontSize = this.fontSize + 'px';
			this.textDrawing.style.lineHeight = this.fontSize + 'px';
			this.invalidateMeasure();
		}

		get fontFamily(): string {
			if (this._fontFamily !== undefined)
				return this._fontFamily;
			else
				return this.getStyleProperty('fontFamily');
		}

		set fontFamily(fontFamily: string) {
			this._fontFamily = fontFamily;
			this.isMeasureValid = false;
			this.textContext.setFontFamily(this.fontFamily);
			this.textDrawing.style.fontFamily = this.fontFamily;
			this.invalidateMeasure();
		}

		get fontWeight() {
			if (this._fontWeight !== undefined)
				return this._fontWeight;
			else
				return this.getStyleProperty('fontWeight');
		}

		set fontWeight(fontWeight) {
			this._fontWeight = fontWeight;
			this.isMeasureValid = false;
			this.textContext.setFontWeight(fontWeight);
			this.textDrawing.style.fontWeight = this.fontWeight;
			this.invalidateMeasure();
		}

		get whiteSpace(): string {
			if (this._whiteSpace !== undefined)
				return this._whiteSpace;
			else
				return this.getStyleProperty('whiteSpace');
		}

		set whiteSpace(whiteSpace: string) {
			if (this._whiteSpace !== whiteSpace) {
				this.isMeasureValid = false;
				this._whiteSpace = whiteSpace;
				this.textContext.setWhiteSpace(this.whiteSpace);
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
				this.isMeasureValid = false;
				this._wordWrap = wordWrap;
				this.textContext.setWordWrap(this.wordWrap);
				this.invalidateMeasure();
			}
		}

		get textTransform(): string {
			if (this._textTransform !== undefined)
				return this._textTransform;
			else
				return this.getStyleProperty('textTransform');
		}

		set textTransform(textTransform: string) {
			if (this._textTransform !== textTransform) {
				this.isMeasureValid = false;
				this._textTransform = textTransform;
				this.textContext.setTextTransform(this.textTransform);
				this.invalidateMeasure();
			}
		}

		set color(color: Color) {
			if (this._color !== color) {
				this._color = color;
				if (Core.Navigator.supportRgba)
					this.textDrawing.style.color = this._color.getCssRgba();
				else
					this.textDrawing.style.color = this._color.getCssHtml();
			}
		}

		get color(): Color {
			if (this._color !== undefined)
				return this._color;
			else
				return Ui.Color.create(this.getStyleProperty('color'));
		}

		protected renderDrawing() {
			let drawing = super.renderDrawing();
			// create the container for all text rendering
			this.textDrawing = document.createElement('div');
			this.textDrawing.style.fontFamily = this.fontFamily;
			this.textDrawing.style.fontWeight = this.fontWeight;
			this.textDrawing.style.fontSize = this.fontSize + 'px';
			this.textDrawing.style.lineHeight = this.fontSize + 'px';
			if (Core.Navigator.supportRgba)	
				this.textDrawing.style.color = this.color.getCssRgba();
			else
				this.textDrawing.style.color = this.color.getCssHtml();
			this.textDrawing.style.position = 'absolute';
			this.textDrawing.style.left = '0px';
			this.textDrawing.style.top = '0px';
			drawing.appendChild(this.textDrawing);
			return drawing;
		}

		protected onStyleChange() {
			this.textDrawing.style.fontSize = this.fontSize + 'px';
			this.textDrawing.style.lineHeight = this.fontSize + 'px';
			this.textDrawing.style.fontFamily = this.fontFamily;
			this.textDrawing.style.fontWeight = this.fontWeight;
			if (Core.Navigator.supportRgba)
				this.textDrawing.style.color = this.color.getCssRgba();
			else
				this.textDrawing.style.color = this.color.getCssHtml();

			this.textContext.setMaxLine(this.maxLine);
			this.textContext.setTextAlign(this.textAlign);
			this.textContext.setFontSize(this.fontSize);
			this.textContext.setFontFamily(this.fontFamily);
			this.textContext.setFontWeight(this.fontWeight);
			this.textContext.setInterLine(this.interLine);
			this.textContext.setWhiteSpace(this.whiteSpace);
			this.textContext.setWordWrap(this.wordWrap);
			this.textContext.setTextTransform(this.textTransform);
			this.invalidateMeasure();
		}

		protected measureCore(width, height) {
			//console.log(this+'.measureCore('+width+','+height+') isMeasureValid: '+this.isMeasureValid+', lastMeasureWidth: '+this.lastMeasureWidth+', '+this.getText());

			if (!this.isMeasureValid || (this.lastAvailableWidth !== width)) {
				//console.log(this+'.measureCore('+width+','+height+') isMeasureValid: '+this.isMeasureValid+', lastMeasureWidth: '+this.lastMeasureWidth);
				this.lastAvailableWidth = width;
				let size = this.textContext.drawText(width, false);
				this.lastMeasureHeight = size.height;
				this.lastMeasureWidth = size.width;
				this.isMeasureValid = true;
				this.isArrangeValid = false;
			}
			//console.log(this+'.measureCore '+this.getText()+', need: '+this.lastMeasureWidth+','+this.lastMeasureHeight);
			return { width: this.lastMeasureWidth, height: this.lastMeasureHeight };
		}

		protected arrangeCore(width, height) {
			while (this.textDrawing.hasChildNodes())
				this.textDrawing.removeChild(this.textDrawing.firstChild);
			let textDrawing = this.textDrawing;
			this.textContext.setDrawLine(function (x, y, line) {
				let tspan = document.createElement('div');
				tspan.style.whiteSpace = 'nowrap';
				tspan.style.wordWrap = 'none';
				tspan.style.display = 'inline';
				tspan.style.position = 'absolute';
				tspan.style.left = x + 'px';
				tspan.style.top = y + 'px';
				if ('textContent' in tspan)
					tspan.textContent = line;
				else
					(tspan as any).innerText = line;
				textDrawing.appendChild(tspan);
			});
			this.textContext.drawText(width, true);
		}

		static style: object = {
			maxLine: Number.MAX_VALUE,
			color: new Color(0, 0, 0),
			fontSize: 16,
			fontFamily: 'sans-serif',
			fontWeight: 'normal',
			interLine: 1,
			textAlign: 'left',
			whiteSpace: 'pre-line',
			wordWrap: 'normal',
			textTransform: 'none'
		}
	}
}	
	