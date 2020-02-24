namespace Ui {
    export interface TextFieldInit extends LBoxInit {
        textHolder?: string;
        passwordMode?: boolean;
        value?: string;
        captureValidated?: boolean;
        onchanged?: (event: { target: TextField, value: string }) => void;
        onvalidated?: (event: { target: TextField }) => void;
    }

    export class TextField extends LBox {
        readonly entry: Entry;
        private graphic: TextBgGraphic;
        private textholder: Label;
        readonly changed = new Core.Events<{ target: TextField, value: string }>();
        set onchanged(value: (event: { target: TextField, value: string }) => void) { this.changed.connect(value); }
        readonly validated = new Core.Events<{ target: TextField }>();
        set onvalidated(value: (event: { target: TextField }) => void) { this.validated.connect(value); }

        constructor(init?: TextFieldInit) {
            super(init);

            this.graphic = new TextBgGraphic();
            this.append(this.graphic);

            this.textholder = new Label({
                opacity: 0.5,
                horizontalAlign: 'left', verticalAlign: 'top',
                marginTop: 11, marginBottom: 7,
                marginLeft: 10, marginRight: 10
            });
            this.append(this.textholder);

            this.entry = new Ui.Entry({
                margin: 7,
                marginLeft: 10,
                marginRight: 10,
                fontSize: 16
            });
            this.entry.focused.connect(() => this.onEntryFocus());
            this.entry.blurred.connect(() => this.onEntryBlur());
            this.append(this.entry);

            this.entry.changed.connect((e) => this.onEntryChange(e.target, e.value));
            this.entry.validated.connect(() => this.validated.fire({ target: this }));
            if (init) {
                if (init.textHolder !== undefined)
                    this.textHolder = init.textHolder;
                if (init.passwordMode !== undefined)
                    this.passwordMode = init.passwordMode;
                if (init.value !== undefined)
                    this.value = init.value;
                if (init.captureValidated !== undefined)
                    this.captureValidated = init.captureValidated;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
                if (init.onvalidated)
                    this.validated.connect(init.onvalidated);
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
            if (((value === undefined) || (value === '')) && !this.entry.hasFocus)
                this.textholder.show();
            else
                this.textholder.hide();
        }

        get captureValidated(): boolean {
            return this.entry.captureValidated;
        }

        set captureValidated(value: boolean) {
            this.entry.captureValidated = value;
        }

        get inputMode() {
            return this.entry.inputMode;
        }

        /**
         * Possible values supported according to mozilla
         * "none", "text", "decimal", "numeric", "tel", "search", "email", "url"
         */
        set inputMode(value: string) {
            this.entry.inputMode = value;
        }

        get autocomplete(): string {
            return this.entry.autocomplete;
        }

        set autocomplete(value: string) {
            this.entry.autocomplete = value;
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
            this.changed.fire({ target: this, value: value });
        }
    }
}

