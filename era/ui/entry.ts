namespace Ui
{
	export interface EntryInit extends ElementInit {
		passwordMode?: boolean;
		fontSize?: number;
		fontFamily?: string;
		fontWeight?: string;
		color?: Color | string;
		value?: string;
		onchanged?: (event: { target: Entry, value: string }) => void;
		onvalidated?: (event: { target: Entry, value: string }) => void;
	}

	export class Entry extends Element implements EntryInit
	{
		private _fontSize: number = undefined;
		private _fontFamily: string = undefined;
		private _fontWeight: string = undefined;
		private _color: Color = undefined;
		private _value: string = '';
		private _passwordMode: boolean = false;
		readonly changed = new Core.Events<{ target: Entry, value: string }>();
		readonly validated = new Core.Events<{ target: Entry, value: string }>();

		constructor(init?: EntryInit) {
			super(init);
			this.selectable = true;
			this.focusable = true;

			// handle change
			this.drawing.addEventListener('change', (e) => this.onChange(e));

			// handle paste
			this.drawing.addEventListener('paste', (e) => this.onPaste(e));

			// handle keyboard
			this.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));
			this.drawing.addEventListener('keydown', (e) => this.onKeyDown(e));
			
			if (init) {
				if (init.passwordMode !== undefined)
					this.passwordMode = init.passwordMode;
				if (init.fontSize !== undefined)
					this.fontSize = init.fontSize;	
				if (init.fontFamily !== undefined)
					this.fontFamily = init.fontFamily;
				if (init.fontWeight !== undefined)
					this.fontWeight = init.fontWeight;	
				if (init.color !== undefined)
					this.color = init.color;	
				if (init.value !== undefined)
					this.value = init.value;
				if (init.onchanged)
					this.changed.connect(init.onchanged);
				if (init.onvalidated)
					this.validated.connect(init.onvalidated);
			}
		}

		set passwordMode(passwordMode: boolean) {
			if (this._passwordMode != passwordMode) {
				this._passwordMode = passwordMode;
				if (this._passwordMode)
					this.drawing.setAttribute('type', 'password');
				else
					this.drawing.setAttribute('type', 'text');
			}
		}

		get fontSize(): number {
			if (this._fontSize != undefined)
				return this._fontSize;
			else
				return this.getStyleProperty('fontSize');
		}
		
		set fontSize(fontSize: number) {
			if (this._fontSize != fontSize) {
				this._fontSize = fontSize;
				this.drawing.style.fontSize = this.fontSize + 'px';
				this.invalidateMeasure();
			}
		}

		get fontFamily(): string {
			if (this._fontFamily != undefined)
				return this._fontFamily;
			else
				return this.getStyleProperty('fontFamily');
		}
		
		set fontFamily(fontFamily: string) {
			if (this._fontFamily != fontFamily) {
				this._fontFamily = fontFamily;
				this.drawing.style.fontFamily = this.fontFamily;
				this.invalidateMeasure();
			}
		}

		get fontWeight(): string {
			if (this._fontWeight != undefined)
				return this._fontWeight;
			else
				return this.getStyleProperty('fontWeight');
		}
		
		set fontWeight(fontWeight: string) {
			if (this._fontWeight != fontWeight) {
				this._fontWeight = fontWeight;
				this.drawing.style.fontWeight = this.fontWeight;
				this.invalidateMeasure();
			}
		}

		private getColor() {
			if (this._color != undefined)
				return this._color;
			else
				return Ui.Color.create(this.getStyleProperty('color'));
		}

		set color(color: Color | string) {
			if (this._color != color) {
				this._color = Ui.Color.create(color);
				if (Core.Navigator.supportRgba)
					this.drawing.style.color = this.getColor().getCssRgba();
				else
					this.drawing.style.color = this.getColor().getCssHtml();
			}
		}

		get value(): string {
			return this._value;
		}

		set value(value: string) {
			if (value == undefined)
				value = '';
			this._value = value;
			this.drawing.value = this._value;
		}

		private onPaste(event) {
			event.stopPropagation();
			new Core.DelayedTask(0, () => this.onAfterPaste());
		}

		private onAfterPaste() {
			if (this.drawing.value != this._value) {
				this._value = this.drawing.value;
				this.changed.fire({ target: this, value: this._value });
			}
		}

		private onChange(event) {
			if (this.drawing.value != this._value) {
				this._value = this.drawing.value;
				this.changed.fire({ target: this, value: this._value });
			}
		}

		private onKeyDown(event) {
			let key = event.which;
			// keep arrows + Del + Backspace for us only
			if ((key == 37) || (key == 39) || (key == 46) || (key == 8))
				event.stopPropagation();
		}

		private onKeyUp(event) {
			let key = event.which;
			// keep arrows + Del + Backspace for us only
			if ((key == 37) || (key == 39) || (key == 46) || (key == 8))
				event.stopPropagation();
			// check if value changed
			if (this.drawing.value !== this._value) {
				this._value = this.drawing.value;
				this.changed.fire({ target: this, value: this._value });
			}
			if (key == 13)
				this.validated.fire({ target: this, value: this._value });
		}

		renderDrawing() {
			let drawing = document.createElement('input');
			drawing.setAttribute('type', 'text');
			drawing.style.opacity = '1';
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
			drawing.style.color = this.getColor().getCssRgba();
			return drawing;
		}

		measureCore(width: number, height: number) {
			return { width: 8, height: (this.fontSize * 3 / 2) };
		}

		arrangeCore(width: number, height: number) {
			this.drawing.style.width = width + 'px';
			this.drawing.style.height = height + 'px';
			this.drawing.style.lineHeight = height + 'px';
		}

		onDisable() {
			super.onDisable();
			this.drawing.blur();
			this.drawing.style.cursor = 'default';
			this.drawing.disabled = true;
		}

		onEnable() {
			super.onEnable();
			this.drawing.style.cursor = 'auto';
			this.drawing.disabled = false;
		}

		onStyleChange() {
			this.drawing.style.fontSize = this.fontSize + 'px';
			this.drawing.style.fontFamily = this.fontFamily;
			this.drawing.style.fontWeight = this.fontWeight;
			if (Core.Navigator.supportRgba)
				this.drawing.style.color = this.getColor().getCssRgba();
			else
				this.drawing.style.color = this.getColor().getCssHtml();
			this.invalidateMeasure();
		}

		static style: object = {
			color: new Ui.Color(0, 0, 0),
			fontSize: 14,
			fontFamily: 'Sans-serif',
			fontWeight: 'normal'
		}
	}
}	
