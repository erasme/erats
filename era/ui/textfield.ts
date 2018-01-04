namespace Ui {
	export interface TextFieldInit extends LBoxInit {
		textHolder?: string;
		passwordMode?: boolean;
		value?: string;
	}

	export class TextField extends LBox {
		private entry: Entry;
		private graphic: TextBgGraphic;
		private textholder: Label;

		constructor(init?: TextFieldInit) {
			super(init);
			this.addEvents('change', 'validate');

			this.padding = 0;
		
			this.graphic = new TextBgGraphic();
			this.append(this.graphic);

			this.textholder = new Label();
			this.textholder.opacity = 0.5;
			this.textholder.horizontalAlign = 'left';
			this.textholder.margin = 5;
			this.textholder.marginLeft = 10;
			this.textholder.marginRight = 10;
			this.append(this.textholder);

			this.entry = new Ui.Entry();
			this.entry.margin = 5;
			this.entry.marginLeft = 10;
			this.entry.marginRight = 10;
			this.entry.fontSize = 16;
			this.connect(this.entry, 'focus', this.onEntryFocus);
			this.connect(this.entry, 'blur', this.onEntryBlur);
			this.append(this.entry);

			this.connect(this.entry, 'change', this.onEntryChange);
			this.connect(this.entry, 'validate', () => this.fireEvent('validate', this));
			if (init) {
				if (init.textHolder !== undefined)
					this.textHolder = init.textHolder;
				if (init.passwordMode !== undefined)
					this.passwordMode = init.passwordMode;
				if (init.value !== undefined)
					this.value = init.value;	
			}
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

