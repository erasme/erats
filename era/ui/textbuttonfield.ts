namespace Ui {
	export class TextFieldButton extends Button {
		style: object = {
			padding: 6,
			iconSize: 22,
			background: 'rgba(250,250,250,0)',
			backgroundBorder: 'rgba(140,140,140,0)'
		}
	}

	export interface TextButtonFieldInit extends FormInit {
		textHolder: string;
		widthText: number;
		buttonIcon: string;
		buttonText: string;
		value: string;
	}

	export class TextButtonField extends Form {
		protected graphic: TextBgGraphic;
		protected entry: Entry;
		protected _textholder: Label;
		protected button: TextFieldButton;

		constructor(init?: Partial<TextButtonFieldInit>) {
			super();
			this.addEvents('change', 'validate', 'buttonpress');

			this.padding = 3;
		
			this.graphic = new TextBgGraphic();
			this.append(this.graphic);

			this._textholder = new Label({ opacity: 0.5, horizontalAlign: 'center', margin: 3 });
			this.append(this._textholder);

			var hbox = new HBox();
			this.append(hbox);

			this.entry = new Entry({ margin: 4, fontSize: 16 });
			this.connect(this.entry, 'focus', this.onEntryFocus);
			this.connect(this.entry, 'blur', this.onEntryBlur);
			hbox.append(this.entry, true);

			this.connect(this.entry, 'change', this.onEntryChange);
		
			this.button = new TextFieldButton({ orientation: 'horizontal', margin: 1 });
			hbox.append(this.button);
		
			this.connect(this, 'submit', this.onFormSubmit);
			this.connect(this.button, 'press', this.onButtonPress);
			if (init)
				this.assign(init);
		}

		set textHolder(text: string) {
			this._textholder.text = text;
		}

		set widthText(nbchar: number) {
			this.entry.width = nbchar * 16 * 2 / 3;
		}

		set buttonIcon(icon: string) {
			this.button.icon = icon;
		}

		set buttonText(text: string) {
			this.button.text = text;
		}

		get textValue(): string {
			return this.entry.value;
		}

		set textValue(value: string) {
			this.entry.value = value;
		}

		get value(): string {
			return this.textValue;
		}

		set value(value: string) {
			this.textValue = value;
		}
	
		protected onButtonPress() {
			this.fireEvent('buttonpress', this);
			this.fireEvent('validate', this, this.value);
		}

		protected onEntryChange(entry: Entry, value: string) {
			this.fireEvent('change', this, value);
		}

		protected onFormSubmit() {
			this.fireEvent('validate', this, this.value);
		}

		protected onEntryFocus() {
			this._textholder.hide();
			this.graphic.hasFocus = true;
		}

		protected onEntryBlur() {
			if (this.value === '')
				this._textholder.show();
			this.graphic.hasFocus = false;
		}
	}
}	
