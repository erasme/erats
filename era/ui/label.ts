namespace Ui {

	export interface LabelInit extends ElementInit {
		text?: string;
		fontSize?: number;
		fontFamily?: string;
		fontWeight?: string | number;
		color?: Color | string;
		orientation?: Orientation;
	}

	export interface LabelStyle {
		color: Color;
		fontSize: number;
		fontFamily: string;
		fontWeight: string;
	}

	export class Label extends Element implements LabelInit {
		private _text: string = '';
		private _orientation: Orientation = 'horizontal';
		private _fontSize: number = undefined;
		private _fontFamily: string = undefined;
		private _fontWeight: string | number = undefined;
		private _color: Color = undefined;
		labelDrawing: any;
		private textMeasureValid: boolean = false;
		private textWidth: number = 0;
		private textHeight: number = 0;

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
					this.labelDrawing.innerText = this._text;
				this.textMeasureValid = false;
				this.invalidateMeasure();
			}
		}

		set fontSize(fontSize: number) {
			if (this._fontSize !== fontSize) {
				this._fontSize = fontSize;
				this.labelDrawing.style.fontSize = this.fontSize + 'px';
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

		set fontWeight(fontWeight: string | number) {
			if (this._fontWeight !== fontWeight) {
				this._fontWeight = fontWeight;
				this.labelDrawing.style.fontWeight = this.fontWeight;
				this.textMeasureValid = false;
				this.invalidateMeasure();
			}
		}

		get fontWeight(): string | number {
			if (this._fontWeight !== undefined)
				return this._fontWeight;
			else
				return this.getStyleProperty('fontWeight');
		}

		set color(color: Color | string) {
			if (this._color !== color) {
				this._color = Color.create(color);
				if (Core.Navigator.supportRgba)
					this.labelDrawing.style.color = this.getColor().getCssRgba();
				else
					this.labelDrawing.style.color = this.getColor().getCssHtml();
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
			this.labelDrawing.style.fontFamily = this.fontFamily;
			this.labelDrawing.style.fontWeight = this.fontWeight;
			if (Core.Navigator.supportRgba)
				this.labelDrawing.style.color = this.getColor().getCssRgba();
			else
				this.labelDrawing.style.color = this.getColor().getCssHtml();
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

		measureCore(width: number, height: number) {
			if (!this.textMeasureValid) {
				this.textMeasureValid = true;
				let size = Ui.Label.measureText(this._text, this.fontSize, this.fontFamily, this.fontWeight);
				this.textWidth = size.width;
				this.textHeight = size.height;
			}
			if (this._orientation === 'vertical')
				return { width: this.textHeight, height: this.textWidth };
			else
				return { width: this.textWidth, height: this.textHeight };
		}

		arrangeCore(width, height) {
			let matrix;
			if (this._orientation == 'vertical') {
				matrix = Ui.Matrix.createTranslate(this.labelDrawing.offsetHeight, 0);
				matrix.rotate(90);
				if (Core.Navigator.isIE) {
					this.labelDrawing.style.msTransform = matrix.toString();
					this.labelDrawing.style.msTransformOrigin = '0% 0%';
				}
				else if (Core.Navigator.isGecko) {
					this.labelDrawing.style.MozTransform = 'matrix(' + matrix.svgMatrix.a.toFixed(4) + ', ' + matrix.svgMatrix.b.toFixed(4) + ', ' + matrix.svgMatrix.c.toFixed(4) + ', ' + matrix.svgMatrix.d.toFixed(4) + ', ' + matrix.svgMatrix.e.toFixed(0) + 'px, ' + matrix.svgMatrix.f.toFixed(0) + 'px)';
					this.labelDrawing.style.MozTransformOrigin = '0% 0%';
				}
				else if (Core.Navigator.isWebkit) {
					this.labelDrawing.style.webkitTransform = matrix.toString();
					this.labelDrawing.style.webkitTransformOrigin = '0% 0%';
				}
				else if (Core.Navigator.isOpera) {
					this.labelDrawing.style.OTransform = matrix.toString();
					this.labelDrawing.style.OTransformOrigin = '0% 0%';
				}
			}
			else {
				if (Core.Navigator.isIE && ('removeProperty' in this.labelDrawing))
					this.labelDrawing.style.removeProperty('-ms-transform');
				else if (Core.Navigator.isGecko)
					this.labelDrawing.style.removeProperty('-moz-transform');
				else if (Core.Navigator.isWebkit)
					this.labelDrawing.style.removeProperty('-webkit-transform');
				else if (Core.Navigator.isOpera)
					this.labelDrawing.style.removeProperty('-o-transform');
			}
		}

		static measureBox: any = undefined;
		static measureContext: any = undefined;

		static measureTextCanvas(text, fontSize, fontFamily, fontWeight) {
			if (Ui.Label.measureBox === undefined)
				this.createMeasureCanvas();
			Ui.Label.measureContext.font = 'normal ' + fontWeight + ' ' + fontSize + 'px ' + fontFamily;
			let res = Ui.Label.measureContext.measureText(text);
			res.height = fontSize;
			return res;
		}

		static createMeasureCanvas() {
			let measureWindow = window;
			if (Core.Navigator.isIE || Core.Navigator.isGecko)
				measureWindow = Ui.App.getRootWindow();

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
			Ui.Label.measureBox.setAttribute('width', 10, null);
			Ui.Label.measureBox.setAttribute('height', 10, null);
			measureWindow.document.body.appendChild(Ui.Label.measureBox);
			Ui.Label.measureContext = Ui.Label.measureBox.getContext('2d');
		}
	
		static isFontAvailable(fontFamily: string, fontWeight) {
			let i;
			if (!Core.Navigator.supportCanvas)
				return true;
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

		static measureTextHtml(text, fontSize, fontFamily, fontWeight) {
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

		static createMeasureHtml() {
			let measureWindow = window;
			if (Core.Navigator.isIE || Core.Navigator.isGecko)
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

		static measureText(text, fontSize, fontFamily, fontWeight) {
			if ((text === '') ||  (text === undefined))
				return { width: 0, height: 0 };
			if (Core.Navigator.supportCanvas)
				return Ui.Label.measureTextCanvas(text, fontSize, fontFamily, fontWeight);
			else
				return Ui.Label.measureTextHtml(text, fontSize, fontFamily, fontWeight);
		}

		static style: LabelStyle = {
			color: Color.create('#444444'),
			fontSize: 16,
			fontFamily: 'Sans-serif',
			fontWeight: 'normal'
		}
	}
}

