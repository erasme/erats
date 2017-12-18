namespace Ui {
	export interface TextAreaFieldInit extends LBoxInit {
		textHolder?: string;
		value?: string;
	}

	export class TextAreaField extends LBox {
		textarea: TextArea;
		graphic: TextBgGraphic;
		textholder: Label;

		constructor(init?: TextAreaFieldInit) {
			super(init);
			this.addEvents('change');

			this.padding = 3;

			this.graphic = new TextBgGraphic();
			this.append(this.graphic);

			this.textholder = new Label();
			this.textholder.opacity = 0.5;
			this.textholder.horizontalAlign = 'center';
			this.textholder.margin = 3;
			this.append(this.textholder);

			this.textarea = new TextArea();
			this.textarea.margin = 4;
			this.textarea.fontSize = 16;
			this.append(this.textarea);

			this.connect(this.textarea, 'focus', this.onTextAreaFocus);
			this.connect(this.textarea, 'blur', this.onTextAreaBlur);
			this.connect(this.textarea, 'change', this.onTextAreaChange);

			if (init) {
				if (init.textHolder !== undefined)
					this.textHolder = init.textHolder;	
				if (init.value !== undefined)
					this.value = init.value;
			}	
		}

		set textHolder(text: string) {
			this.textholder.text = text;
		}

		get value(): string {
			return this.textarea.value;
		}

		set value(value: string) {
			this.textarea.value = value;
			if ((value === undefined) || (value === ''))
				this.textholder.show();
			else
				this.textholder.hide();
		}

		protected onTextAreaFocus() {
			this.textholder.hide();
			this.graphic.hasFocus = true;
		}

		protected onTextAreaBlur() {
			if (this.value === '')
				this.textholder.show();
			this.graphic.hasFocus = false;
		}

		protected onTextAreaChange(entry, value) {
			this.fireEvent('change', this, value);
		}
	}
}	

