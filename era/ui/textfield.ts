namespace Ui {
	export interface TextFieldInit extends LBoxInit {
		textHolder: string;
		passwordMode: boolean;
		value: string;
	}

	export class TextField extends LBox {
		private entry: Entry;
		private graphic: TextBgGraphic;
		private textholder: Label;

		constructor(init?: Partial<TextFieldInit>) {
			super();
			this.addEvents('change');

			this.padding = 0;
		
			this.graphic = new TextBgGraphic();
			this.append(this.graphic);

			this.textholder = new Label();
			this.textholder.opacity = 0.5;
			this.textholder.horizontalAlign = 'center';
			this.textholder.margin = 3;
			this.append(this.textholder);

			this.entry = new Ui.Entry();
			this.entry.margin = 5;
			this.entry.fontSize = 16;
			this.connect(this.entry, 'focus', this.onEntryFocus);
			this.connect(this.entry, 'blur', this.onEntryBlur);
			this.append(this.entry);

			this.connect(this.entry, 'change', this.onEntryChange);
			if (init)
				this.assign(init);
		}

		set textHolder(text: string) {
			this.textholder.text = text;
		}

		set passwordMode(passwordMode: boolean) {
			this.entry.passwordMode = passwordMode;
		}

		get value(): string {
			return this.entry.value;
		}

		set value(value: string) {
			this.entry.value = value;
			if ((value === undefined) || (value === ''))
				this.textholder.show();
			else
				this.textholder.hide();
		}

		private onEntryFocus() {
			this.textholder.hide();
			this.graphic.hasFocus = true;
		}

		private onEntryBlur() {
			if (this.value === '')
				this.textholder.show();
			this.graphic.hasFocus = false;
		}

		private onEntryChange(entry, value) {
			this.fireEvent('change', this, value);
		}
	}
}	

