namespace Ui {
    export interface TextAreaFieldInit extends LBoxInit {
        textHolder?: string;
        value?: string;
        onchanged?: (event: { target: TextAreaField, value: string }) => void;
    }

    export class TextAreaField extends LBox {
        readonly textarea: TextArea;
        graphic: TextBgGraphic;
        textholder: Label;
        readonly changed = new Core.Events<{ target: TextAreaField, value: string }>();
        set onchanged(value: (event: { target: TextAreaField, value: string }) => void) { this.changed.connect(value); }

        constructor(init?: TextAreaFieldInit) {
            super(init);

            this.graphic = new TextBgGraphic();
            this.append(this.graphic);

            this.textholder = new Label({
                opacity: 0.5,
                horizontalAlign: 'left',
                margin: 7,
                marginLeft: 10,
                marginRight: 10
            });
            this.append(this.textholder);

            this.textarea = new TextArea({
                margin: 7,
                marginLeft: 10,
                marginRight: 10,
                fontSize: 16
            });
            this.append(this.textarea);

            this.textarea.focused.connect(() => this.onTextAreaFocus());
            this.textarea.blurred.connect(() => this.onTextAreaBlur());
            this.textarea.changed.connect((e) => this.onTextAreaChange(e.target, e.value));

            if (init) {
                if (init.textHolder !== undefined)
                    this.textHolder = init.textHolder;
                if (init.value !== undefined)
                    this.value = init.value;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
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

        protected onTextAreaChange(entry: TextArea, value: string) {
            this.changed.fire({ target: this, value: value });
        }
    }
}

