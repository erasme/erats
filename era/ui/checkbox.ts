namespace Ui {
	export interface CheckBoxInit extends PressableInit {
		value?: boolean;
		text?: string;
		content?: Element;
	}

	export class CheckBox extends Pressable implements CheckBoxInit {
		private graphic: CheckBoxGraphic;
		private contentBox: Element = undefined;
		private hbox: HBox;
		private _content: Element = undefined;
		private _text: string = undefined;
		private _isToggled: boolean = false;

		constructor(init?: CheckBoxInit) {
			super();
			this.addEvents('change', 'toggle', 'untoggle');

			this.role = 'checkbox';
			this.drawing.setAttribute('aria-checked', 'false');

			this.padding = 3;

			this.hbox = new Ui.HBox();
			this.append(this.hbox);
		
			this.graphic = new CheckBoxGraphic();
			this.hbox.append(this.graphic);

			this.connect(this, 'down', this.onCheckBoxDown);
			this.connect(this, 'up', this.onCheckBoxUp);
			this.connect(this, 'focus', this.onCheckFocus);
			this.connect(this, 'blur', this.onCheckBlur);
			this.connect(this, 'press', this.onCheckPress);

			if (init) {
				if (init.value !== undefined)
					this.value = init.value;
				if (init.text !== undefined)
					this.text = init.text;
				if (init.content !== undefined)
					this.content = init.content;	
			}
		}

		get isToggled() {
			return this._isToggled;
		}

		get value(): boolean {
			return this.isToggled;
		}

		set value(value: boolean) {
			if (value)
				this.toggle();
			else
				this.untoggle();
		}

		get text(): string {
			return this._text;
		}

		set text(text: string) {
			if (text === undefined) {
				if (this.contentBox !== undefined) {
					this.hbox.remove(this.contentBox);
					this.contentBox = undefined;
				}
				this._text = undefined;
				this._content = undefined;
			}
			else {
				if (this._text !== undefined) {
					this._text = text;
					(this.contentBox as Text).text = this._text;
				}
				else {
					if (this._content !== undefined) {
						this.hbox.remove(this.contentBox);
						this._content = undefined;
					}
					this._text = text;
					let t = new Ui.Text();
					t.margin = 8; t.text = this._text; t.verticalAlign = 'center';
					this.contentBox = t;
					this.hbox.append(this.contentBox, true);
				}
			}
		}

		get content(): Element {
			return this._content;
		}

		set content(content: Element) {
			if (content === undefined) {
				if (this.contentBox !== undefined) {
					this.hbox.remove(this.contentBox);
					this.contentBox = undefined;
				}
				this._text = undefined;
				this._content = undefined;
			}
			else {
				if (this._text !== undefined) {
					this.hbox.remove(this.contentBox);
					this._text = undefined;
				}
				if (this._content !== undefined)
					(this.contentBox as LBox).remove(this._content);
				else {
					let lb = new Ui.LBox();
					lb.padding = 8; lb.verticalAlign = 'center';
					this.contentBox = lb;
					this.hbox.append(this.contentBox);
				}
				this._content = content;
				(this.contentBox as LBox).append(this._content);
			}
		}

		toggle() {
			this.onToggle();
		}

		untoggle() {
			this.onUntoggle();
		}

		private onCheckPress() {
			if (!this._isToggled)
				this.onToggle();
			else
				this.onUntoggle();
		}
	
		protected onToggle() {
			if (!this._isToggled) {
				this._isToggled = true;
				this.drawing.setAttribute('aria-checked', 'true');
				this.fireEvent('toggle', this);
				this.graphic.setIsChecked(true);
				this.graphic.setColor(this.getStyleProperty('activeColor'));
				this.fireEvent('change', this, true);
			}
		}

		protected onUntoggle() {
			if (this._isToggled) {
				this._isToggled = false;
				this.drawing.setAttribute('aria-checked', 'false');
				this.fireEvent('untoggle', this);
				this.graphic.setIsChecked(false);
				this.graphic.setColor(this.getStyleProperty('color'));
				this.fireEvent('change', this, false);
			}
		}
	
		protected onCheckFocus() {
			if (!this.getIsMouseFocus())
				this.graphic.setColor(this.getStyleProperty('focusColor'));
		}
	
		protected onCheckBlur() {
			if (this._isToggled)
				this.graphic.setColor(this.getStyleProperty('activeColor'));
			else
				this.graphic.setColor(this.getStyleProperty('color'));
		}

		protected onCheckBoxDown() {
			this.graphic.setIsDown(true);
		}

		protected onCheckBoxUp() {
			this.graphic.setIsDown(false);
		}

		protected onStyleChange() {
			if (this.hasFocus)
				this.graphic.setColor(this.getStyleProperty('focusColor'));
			else {
				if (this._isToggled)
					this.graphic.setColor(this.getStyleProperty('activeColor'));
				else
					this.graphic.setColor(this.getStyleProperty('color'));
			}
			this.graphic.setCheckColor(this.getStyleProperty('checkColor'));
			this.graphic.setBorderWidth(this.getStyleProperty('borderWidth'));
			this.graphic.setRadius(this.getStyleProperty('radius'));
		}

		static style: object = {
			borderWidth: 2,
			color: '#444444',
			activeColor: '#07a0e5',
			focusColor: '#21d3ff',
			checkColor: '#ffffff',
			radius: 3
		}
	}
}	


