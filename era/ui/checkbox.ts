namespace Ui {
	export interface CheckBoxInit extends PressableInit {
		value?: boolean;
		text?: string;
		content?: Element;
		onchanged?: (event: { target: CheckBox, value: boolean }) => void;
		ontoggled?: (event: { target: CheckBox }) => void;
		onuntoggled?: (event: { target: CheckBox}) => void;
	}

	export class CheckBox extends Pressable implements CheckBoxInit {
		private graphic: CheckBoxGraphic;
		private contentBox: Element;
		private hbox: HBox;
		private _content: Element;
		private _text: string;
		private _isToggled: boolean = false;
		readonly changed = new Core.Events<{ target: CheckBox, value: boolean }>();
		set onchanged(value: (event: { target: CheckBox, value: boolean }) => void) { this.changed.connect(value); }
		readonly toggled = new Core.Events<{ target: CheckBox }>();
		set ontoggled(value: (event: { target: CheckBox }) => void) { this.toggled.connect(value); }
		readonly untoggled = new Core.Events<{ target: CheckBox}>();
		set onuntoggled(value: (event: { target: CheckBox }) => void) { this.untoggled.connect(value); }


		constructor(init?: CheckBoxInit) {
			super(init);

			this.role = 'checkbox';
			this.drawing.setAttribute('aria-checked', 'false');

			this.padding = 2;

			this.hbox = new Ui.HBox();
			this.append(this.hbox);
		
			this.graphic = new CheckBoxGraphic();
			this.hbox.append(this.graphic);

			this.downed.connect(() => this.onCheckBoxDown());
			this.upped.connect(() => this.onCheckBoxUp());
			this.focused.connect(() => this.onCheckFocus());
			this.blurred.connect(() => this.onCheckBlur());
			this.pressed.connect(() => this.onCheckPress());

			if (init) {
				if (init.value !== undefined)
					this.value = init.value;
				if (init.text !== undefined)
					this.text = init.text;
				if (init.content !== undefined)
					this.content = init.content;
				if (init.onchanged)
					this.changed.connect(init.onchanged);
				if (init.ontoggled)
					this.toggled.connect(init.ontoggled);
				if (init.onuntoggled)
					this.untoggled.connect(init.onuntoggled);
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
					this.contentBox = new Ui.Text({ margin: 8, text: this._text, verticalAlign: 'center' });
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
					this.contentBox = new Ui.LBox({ padding: 8, verticalAlign: 'center' });
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
				this.toggled.fire({ target: this });
				this.graphic.setIsChecked(true);
				this.graphic.setColor(this.getStyleProperty('activeColor'));
				this.changed.fire({ target: this, value: true });
			}
		}

		protected onUntoggle() {
			if (this._isToggled) {
				this._isToggled = false;
				this.drawing.setAttribute('aria-checked', 'false');
				this.untoggled.fire({ target: this });
				this.graphic.setIsChecked(false);
				this.graphic.setColor(this.getStyleProperty('color'));
				this.changed.fire({ target: this, value: false });
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


