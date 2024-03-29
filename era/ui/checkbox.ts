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
        private bg = new SimpleButtonBackground();
        private graphic: CheckBoxGraphic;
        private contentBox: Element | undefined;
        private hbox: HBox;
        private _content: Element | undefined;
        private _text: string | undefined;
        private _isToggled: boolean = false;
        private rippleEffect: RippleEffect;
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

            this.append(this.bg.assign({
                radius: 0
            }));

            this.hbox = new Ui.HBox();
            this.append(this.hbox);

            let lbox = new Ui.LBox();
            this.hbox.append(lbox);

            this.graphic = new CheckBoxGraphic().assign({ margin: 2 });
            lbox.content = this.graphic;

            this.rippleEffect = new RippleEffect(lbox);
            this.rippleEffect.mode = 'INSIDE';

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

        get text(): string | undefined {
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
                    this.contentBox = new Ui.LBox().assign({ padding: 8, verticalAlign: 'center', resizable: true });
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
            this.rippleEffect.press();
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

        protected onCheckFocus() {
            if (!this.getIsMouseFocus()) {
                this.graphic.color = this.getStyleProperty('focusColor');
                this.bg.border = this.getStyleProperty('focusBackgroundBorder');
            }
        }

        protected onCheckBlur() {
            if (this._isToggled)
                this.graphic.color = this.getStyleProperty('activeColor');
            else
                this.graphic.color = this.getStyleProperty('color');
            this.bg.border = this.getStyleProperty('backgroundBorder');
        }

        protected onCheckBoxDown() {
            this.graphic.isDown = true;
            this.rippleEffect.down();
        }

        protected onCheckBoxUp() {
            this.graphic.isDown = false;
            this.rippleEffect.up();
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
            this.graphic.checkColor = this.getStyleProperty('checkColor');
            this.graphic.borderWidth = this.getStyleProperty('checkWidth');
            this.graphic.radius = this.getStyleProperty('radius');
            this.bg.borderWidth = parseInt(this.getStyleProperty('borderWidth'));
            this.bg.background = this.getStyleProperty('background');
            this.bg.radius = parseInt(this.getStyleProperty('borderRadius'));
        }

        static style: object = {
            borderWidth: 0,
            checkWidth: 2,
            color: '#444444',
            activeColor: '#07a0e5',
            focusColor: '#21d3ff',
            checkColor: '#ffffff',
            background: 'rgba(250,250,250,0)',
            backgroundBorder: 'rgba(250,250,250,0)',
            focusBackgroundBorder: '#21d3ff',
            radius: 3,
            borderRadius: 4
        }
    }
}


