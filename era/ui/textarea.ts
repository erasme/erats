namespace Ui
{
	export class TextArea extends Element
	{
		private _fontSize: number = undefined;
		private _fontFamily: string = undefined;
		private _fontWeight: string = undefined;
		private _color: Color = undefined;
		private _value: string = '';

		constructor() {
			super();
			this.addEvents('change');
			this.selectable = true;
			this.focusable = true;

			// handle change
			this.connect(this.drawing, 'change', this.onChange);

			// handle paste
			this.connect(this.drawing, 'paste', this.onPaste);

			// handle keyboard
			this.connect(this.drawing, 'keydown', this.onKeyDown);
			this.connect(this.drawing, 'keyup', this.onKeyUp);
		}

		set fontSize(fontSize: number) {
			if (this._fontSize != fontSize) {
				this._fontSize = fontSize;
				this.drawing.style.fontSize = this.fontSize + 'px';
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
				this.drawing.style.fontFamily = this.fontFamily;
				this.invalidateMeasure();
			}
		}

		get fontFamily(): string {
			if (this._fontFamily !== undefined)
				return this._fontFamily;
			else
				return this.getStyleProperty('fontFamily');
		}

		set fontWeight(fontWeight: string) {
			if (this._fontWeight !== fontWeight) {
				this._fontWeight = fontWeight;
				this.drawing.style.fontWeight = this.fontWeight;
				this.invalidateMeasure();
			}
		}

		get fontWeight(): string {
			if (this._fontWeight !== undefined)
				return this._fontWeight;
			else
				return this.getStyleProperty('fontWeight');
		}

		set color(color: Color | string) {
			if (this._color !== color) {
				this._color = Ui.Color.create(color);
				if (Core.Navigator.supportRgba)
					this.drawing.style.color = this.getColor().getCssRgba();
				else
					this.drawing.style.color = this.getColor().getCssHtml();
			}
		}

		private getColor(): Color {
			if (this._color !== undefined)
				return this._color;
			else
				return Color.create(this.getStyleProperty('color'));
		}

		get value(): string {
			return this.drawing.value;
		}

		set value(value: string) {
			if ((value === null) || (value === undefined))
				this.drawing.value = '';
			else
				this.drawing.value = value;
			this.invalidateMeasure();
		}

		setOffset(offsetX: number, offsetY: number) {
			this.drawing.scrollLeft = offsetX;
			this.drawing.scrollTop = offsetY;
		}

		get offsetX(): number {
			return this.drawing.scrollLeft;
		}

		get offsetY(): number {
			return this.drawing.scrollTop;
		}
	
		protected onPaste(event) {
			event.stopPropagation();
			new Core.DelayedTask(this, 0, this.onAfterPaste);
		}

		protected onAfterPaste() {
			if (this.drawing.value != this._value) {
				this._value = this.drawing.value;
				this.fireEvent('change', this, this._value);
			}
		}
	
		protected onChange(event) {
			if (this.drawing.value != this._value) {
				this._value = this.drawing.value;
				this.fireEvent('change', this, this._value);
				this.invalidateMeasure();
			}
		}

		protected onKeyDown(event) {
			let key = event.which;
			// keep arrows + Del + Backspace for us only
			if ((key == 37) || (key == 39) || (key == 38) || (key == 40) || (key == 46) || (key == 8))
				event.stopPropagation();
		}

		protected onKeyUp(event) {
			let key = event.which;
			// keep arrows + Del + Backspace for us only
			if ((key == 37) || (key == 39) || (key == 38) || (key == 40) || (key == 46) || (key == 8))
				event.stopPropagation();
			// test if content changed
			if (this.drawing.value !== this._value) {
				this._value = this.drawing.value;
				this.fireEvent('change', this, this._value);
				this.invalidateMeasure();
			}
		}

		protected renderDrawing() {
			let drawing = document.createElement('textarea');
			drawing.setAttribute('rows', '1');
			drawing.setAttribute('cols', '1');

			drawing.style.opacity = '1';
			drawing.style.display = 'block';
			drawing.style.resize = 'none';
			drawing.style.overflow = 'hidden';
			drawing.style.border = '0px';
			drawing.style.margin = '0px';
			drawing.style.padding = '0px';
			drawing.style.outline = 'none';
			if (Core.Navigator.isIE)
				drawing.style.backgroundColor = 'rgba(255,255,255,0.01)';
			else
				drawing.style.background = 'none';
			if (Core.Navigator.isWebkit)
				drawing.style.webkitAppearance = 'none';
			drawing.style.fontSize = this.fontSize + 'px';
			drawing.style.fontFamily = this.fontFamily;
			drawing.style.fontWeight = this.fontWeight;
			if (Core.Navigator.supportRgba)
				drawing.style.color = this.getColor().getCssRgba();
			else
				drawing.style.color = this.getColor().getCssHtml();
			return drawing;
		}

		protected measureCore(width, height) {
			this.drawing.style.width = width + 'px';
			this.drawing.style.height = '0px';
			let size = { width: this.drawing.scrollWidth, height: Math.max(this.fontSize * 3 / 2, this.drawing.scrollHeight) };
			this.drawing.style.width = this.layoutWidth + 'px';
			this.drawing.style.height = this.layoutHeight + 'px';
			return size;
		}

		protected arrangeCore(width, height) {
			this.drawing.style.width = width + 'px';
			this.drawing.style.height = height + 'px';
		}
	
		protected onDisable() {
			super.onDisable();
			this.drawing.blur();
			this.drawing.style.cursor = 'default';
			this.drawing.disabled = true;
		}

		protected onEnable() {
			super.onEnable();
			this.drawing.style.cursor = 'auto';
			this.drawing.disabled = false;
		}

		protected onStyleChange() {
			this.drawing.style.fontSize = this.fontSize + 'px';
			this.drawing.style.fontFamily = this.fontFamily;
			this.drawing.style.fontWeight = this.fontWeight;
			if (Core.Navigator.supportRgba)
				this.drawing.style.color = this.getColor().getCssRgba();
			else
				this.drawing.style.color = this.getColor().getCssHtml();
			this.invalidateMeasure();
		}

		static style: TextAreaStyle = {
			color: new Ui.Color(),
			fontSize: 14,
			fontFamily: 'Sans-serif',
			fontWeight: 'normal'
		}
	}

	export interface TextAreaStyle {
		color: Color;
		fontSize: number;
		fontFamily: string;
		fontWeight: string;
	}
}	

