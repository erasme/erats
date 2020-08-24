namespace Ui {
    export class TextFieldButton extends Button {
        static style: object = {
            padding: 6,
            iconSize: 22,
            background: 'rgba(250,250,250,0)',
            backgroundBorder: 'rgba(140,140,140,0)'
        }
    }

    export interface TextButtonFieldInit extends FormInit {
        textHolder?: string;
        widthText?: number;
        buttonIcon?: string;
        buttonText?: string;
        value?: string;
        onchanged?: (event: { target: TextButtonField, value: string }) => void;
        onbuttonpressed?: (event: { target: TextButtonField }) => void;
        onvalidated?: (event: { target: TextButtonField, value: string }) => void;
    }

    export class TextButtonField extends Form {
        protected graphic: TextBgGraphic;
        protected entry: Entry;
        protected _textholder: Label;
        protected button: TextFieldButton;
        readonly changed = new Core.Events<{ target: TextButtonField, value: string }>();
        set onchanged(value: (event: { target: TextButtonField, value: string }) => void) { this.changed.connect(value); }
        readonly buttonpressed = new Core.Events<{ target: TextButtonField }>();
        set onbuttonpressed(value: (event: { target: TextButtonField }) => void) { this.buttonpressed.connect(value); }
        readonly validated = new Core.Events<{ target: TextButtonField, value: string }>()
        set onvalidated(value: (event: { target: TextButtonField, value: string }) => void) { this.validated.connect(value); }


        constructor(init?: TextButtonFieldInit) {
            super(init);
            this.padding = 0;

            this.graphic = new TextBgGraphic();
            this.append(this.graphic);

            this._textholder = new Label({
                opacity: 0.5, horizontalAlign: 'left', margin: 5,
                marginLeft: 10, marginRight: 10
            });
            this.append(this._textholder);

            var hbox = new HBox();
            this.append(hbox);

            this.entry = new Entry({
                margin: 5, marginLeft: 10, marginRight: 10, fontSize: 16
            });
            this.entry.focused.connect(() => this.onEntryFocus());
            this.entry.blurred.connect(() => this.onEntryBlur());
            hbox.append(this.entry, true);

            this.entry.changed.connect((e) => this.onEntryChange(e.target, e.value));

            this.button = new TextFieldButton({ orientation: 'horizontal', margin: 0 });
            hbox.append(this.button);

            this.submited.connect(() => this.onFormSubmit());
            this.button.pressed.connect(() => this.onButtonPress());
            if (init) {
                if (init.textHolder !== undefined)
                    this.textHolder = init.textHolder;
                if (init.widthText !== undefined)
                    this.widthText = init.widthText;
                if (init.buttonIcon !== undefined)
                    this.buttonIcon = init.buttonIcon;
                if (init.buttonText !== undefined)
                    this.buttonText = init.buttonText;
                if (init.value !== undefined)
                    this.value = init.value;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
                if (init.onbuttonpressed)
                    this.buttonpressed.connect(init.onbuttonpressed);
                if (init.onvalidated)
                    this.validated.connect(init.onvalidated);
            }
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
            if (value && value != '')
                this._textholder.hide();
        }

        get value(): string {
            return this.textValue;
        }

        set value(value: string) {
            this.textValue = value;
        }

        get autocomplete(): string {
            return this.entry.autocomplete;
        }

        set autocomplete(value: string) {
            this.entry.autocomplete = value;
        }

        get passwordMode(): boolean {
            return this.entry.passwordMode;
        }

        set passwordMode(value: boolean) {
            this.entry.passwordMode = value;
        }

        protected onButtonPress() {
            this.buttonpressed.fire({ target: this });
            this.validated.fire({ target: this, value: this.value });
        }

        protected onEntryChange(entry: Entry, value: string) {
            this.changed.fire({ target: this, value: value });
        }

        protected onFormSubmit() {
            this.validated.fire({ target: this, value: this.value });
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
