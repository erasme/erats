namespace Ui {
    export interface RadioBoxInit extends PressableInit {
        value?: boolean;
        text?: string;
        content?: Element;
        group?: RadioGroup;
        onchanged?: (event: { target: RadioBox, value: boolean }) => void;
        ontoggled?: (event: { target: RadioBox }) => void;
        onuntoggled?: (event: { target: RadioBox }) => void;
    }

    export class RadioBox extends Pressable implements RadioBoxInit {
        private bg = new SimpleButtonBackground();
        private graphic: RadioBoxGraphic;
        private contentBox: Element | undefined;
        private hbox: HBox;
        private _content: Element | undefined;
        private _text: string | undefined;
        private _group: RadioGroup;
        private _isToggled: boolean = false;
        readonly changed = new Core.Events<{ target: RadioBox, value: boolean }>();
        set onchanged(value: (event: { target: RadioBox, value: boolean }) => void) { this.changed.connect(value); }
        readonly toggled = new Core.Events<{ target: RadioBox }>();
        set ontoggled(value: (event: { target: RadioBox }) => void) { this.toggled.connect(value); }
        readonly untoggled = new Core.Events<{ target: RadioBox }>();
        set onuntoggled(value: (event: { target: RadioBox }) => void) { this.untoggled.connect(value); }

        constructor(init?: RadioBoxInit) {
            super(init);

            this.role = 'radio';
            this.drawing.setAttribute('aria-checked', 'false');

            this.append(this.bg.assign({
                radius: 0
            }));

            this.hbox = new Ui.HBox().assign({ margin: 2 });
            this.append(this.hbox);

            this.graphic = new RadioBoxGraphic();
            this.hbox.append(this.graphic);

            this.downed.connect(() => this.onRadioDown());
            this.upped.connect(() => this.onRadioUp());
            this.focused.connect(() => this.onRadioFocus());
            this.blurred.connect(() => this.onRadioBlur());
            this.pressed.connect(() => this.onRadioPress());

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
                if (init.group)
                    this.group = init.group;
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

        get text(): string | undefined {
            return this._text;
        }

        set text(text: string | undefined) {
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
                        this.hbox.remove(this.contentBox!);
                        this._content = undefined;
                    }
                    this._text = text;
                    this.contentBox = new Ui.Text({ margin: 8, text: this._text, verticalAlign: 'center' });
                    this.hbox.append(this.contentBox, true);
                }
            }
        }

        get content(): Element | undefined {
            return this._content;
        }

        set content(content: Element | undefined) {
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
                    this.hbox.remove(this.contentBox!);
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

        get group(): RadioGroup {
            return this._group;
        }

        set group(group: RadioGroup) {
            if(this.group != group) {
                if(this.group)
                    this.group.remove(this);

                this._group = group;
                group.add(this)
            }
        }

        toggle() {
            this.onToggle();
        }

        untoggle() {
            this.onUntoggle();
        }

        private onRadioPress() {
            if (!this._isToggled)
                this.onToggle();
        }

        protected onToggle() {
            if (!this._isToggled) {
                this._isToggled = true;
                this.drawing.setAttribute('aria-checked', 'true');
                this.toggled.fire({ target: this });
                this.graphic.isChecked = true;
                this.graphic.color = this.getStyleProperty('activeColor');
                this.changed.fire({ target: this, value: true });
            }
        }

        protected onUntoggle() {
            if (this._isToggled) {
                this._isToggled = false;
                this.drawing.setAttribute('aria-checked', 'false');
                this.untoggled.fire({ target: this });
                this.graphic.isChecked = false;
                this.graphic.color = this.getStyleProperty('color');
                this.changed.fire({ target: this, value: false });
            }
        }

        protected onRadioFocus() {
            if (!this.getIsMouseFocus()) {
                this.graphic.color = this.getStyleProperty('focusColor');
                this.bg.border = this.getStyleProperty('focusBackgroundBorder');
            }
        }

        protected onRadioBlur() {
            if (this._isToggled)
                this.graphic.color = this.getStyleProperty('activeColor');
            else
                this.graphic.color = this.getStyleProperty('color');
            this.bg.border = this.getStyleProperty('backgroundBorder');
        }

        protected onRadioDown() {
            this.graphic.isDown = true;
        }

        protected onRadioUp() {
            this.graphic.isDown = false;
        }

        protected onStyleChange() {
            if (this.hasFocus) {
                this.graphic.color = this.getStyleProperty('focusColor');
                this.bg.border = this.getStyleProperty('focusBackgroundBorder');
            }
            else {
                this.bg.border = this.getStyleProperty('backgroundBorder');
                if (this._isToggled)
                    this.graphic.color = this.getStyleProperty('activeColor');
                else
                    this.graphic.color = this.getStyleProperty('color');
            }
            this.graphic.activeColor = this.getStyleProperty('activeColor');
            this.graphic.borderWidth = this.getStyleProperty('radioWidth');
            this.bg.borderWidth = parseInt(this.getStyleProperty('borderWidth'));
            this.bg.background = this.getStyleProperty('background');
        }

        static style: object = {
            borderWidth: 0,
            radioWidth: 2,
            color: '#444444',
            activeColor: '#07a0e5',
            focusColor: '#21d3ff',
            checkColor: '#ffffff',
            background: 'rgba(250,250,250,0)',
            backgroundBorder: 'rgba(250,250,250,0)',
            focusBackgroundBorder: '#21d3ff'
        }
    }

    export class RadioGroup extends Core.Object {
        readonly content: Core.HashTable<RadioBox> = {};
        private _current?: RadioBox;

        readonly changed = new Core.Events<{ target: RadioGroup }>();
        set onchanged(value: (event: { target: RadioGroup }) => void) { this.changed.connect(value); }

        get current(): RadioBox | undefined {
            return this._current;
        }

        set current(radio: RadioBox | undefined) {
            if(this.current == radio) return;
            if(radio && !radio.isToggled)
                radio.toggle();
            if(radio == undefined && this.current && this.current.isToggled )
                this.current.untoggle();
            this._current = radio;
            this.changed.fire({ target: this });
        }

        get children(): Array<RadioBox> {
            return Object.keys(this.content).map(prop => this.content[prop]);
        }

        add(radio: RadioBox) {
            if (Object.keys(this.content).map(prop => this.content[prop]).indexOf(radio) !== -1) return;
            let handler = radio.toggled.connect(e => this.onRadioSelected(e));
            this.content[handler] = radio;
        }

        remove(radio: RadioBox) {
            if (radio == undefined) return;
            let index = Object.keys(this.content).map(prop => this.content[prop]).indexOf(radio);
            if (index === -1) return;
            let realIndex = Number(Object.keys(this.content)[index]);
            radio.toggled.disconnect(realIndex);
            if(this.content[realIndex].isToggled)
                this.current = undefined;
            delete (this.content[realIndex]);
        }

        onRadioSelected(event: { target: RadioBox }) {
            if (this.current && this.current.isToggled)
                this.current.untoggle();
            this.current = event.target;
        }
    }
}
