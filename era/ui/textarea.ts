namespace Ui {
    export interface TextAreaInit extends ElementInit {
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string;
        color?: Color | string;
        value?: string;
    }

    export class TextArea extends Element {
        readonly drawing!: HTMLTextAreaElement;
        private _fontSize?: number;
        private _fontFamily?: string;
        private _fontWeight?: string;
        private _color?: Color;
        private _value: string = '';
        readonly changed = new Core.Events<{ target: TextArea, value: string }>();
        set onchanged(value: (event: { target: TextArea, value: string }) => void) { this.changed.connect(value); }

        constructor(init?: TextAreaInit) {
            super(init);
            this.selectable = true;
            this.focusable = true;

            // handle change
            this.drawing.addEventListener('input', (e) => this.onChange(e));

            // handle paste
            this.drawing.addEventListener('paste', (e) => this.onPaste(e));

            // handle keyboard
            this.drawing.addEventListener('keydown', (e) => this.onKeyDown(e));
            this.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));

            if (init) {
                if (init.fontSize !== undefined)
                    this.fontSize = init.fontSize;
                if (init.fontFamily !== undefined)
                    this.fontFamily = init.fontFamily;
                if (init.fontWeight !== undefined)
                    this.fontWeight = init.fontWeight;
                if (init.color !== undefined)
                    this.color = init.color;
                if (init.value !== undefined)
                    this.value = init.value;
            }
        }

        set fontSize(fontSize: number) {
            if (this._fontSize != fontSize) {
                this._fontSize = fontSize;
                this.drawing.style.fontSize = this.fontSize + 'px';
                this.invalidateMeasure();
            }
        }

        get fontSize(): number {
            if (this._fontSize !== undefined)
                return this._fontSize;
            else
                return this.getStyleProperty('fontSize');
        }

        set fontFamily(fontFamily: string) {
            if (this._fontFamily !== fontFamily) {
                this._fontFamily = fontFamily;
                this.drawing.style.fontFamily = this.fontFamily;
                this.invalidateMeasure();
            }
        }

        get fontFamily(): string {
            if (this._fontFamily !== undefined)
                return this._fontFamily;
            else
                return this.getStyleProperty('fontFamily');
        }

        set fontWeight(fontWeight: string) {
            if (this._fontWeight !== fontWeight) {
                this._fontWeight = fontWeight;
                this.drawing.style.fontWeight = this.fontWeight;
                this.invalidateMeasure();
            }
        }

        get fontWeight(): string {
            if (this._fontWeight !== undefined)
                return this._fontWeight;
            else
                return this.getStyleProperty('fontWeight');
        }

        set color(color: Color | string) {
            if (this._color !== color) {
                this._color = Ui.Color.create(color);
                this.drawing.style.color = this.getColor().getCssRgba();
            }
        }

        private getColor(): Color {
            if (this._color !== undefined)
                return this._color;
            else
                return Color.create(this.getStyleProperty('color'));
        }

        get value(): string {
            return this.drawing.value;
        }

        set value(value: string) {
            if ((value === null) || (value === undefined))
                this.drawing.value = '';
            else
                this.drawing.value = value;
            this.invalidateMeasure();
        }

        setOffset(offsetX: number, offsetY: number) {
            this.drawing.scrollLeft = offsetX;
            this.drawing.scrollTop = offsetY;
        }

        get offsetX(): number {
            return this.drawing.scrollLeft;
        }

        get offsetY(): number {
            return this.drawing.scrollTop;
        }

        protected onPaste(event) {
            event.stopPropagation();
            new Core.DelayedTask(0, () => this.onAfterPaste());
        }

        protected onAfterPaste() {
            if (this.drawing.value != this._value) {
                this._value = this.drawing.value;
                this.changed.fire({ target: this, value: this._value });
                this.invalidateMeasure();
            }
        }

        protected onChange(event) {
            if (this.drawing.value != this._value) {
                this._value = this.drawing.value;
                this.changed.fire({ target: this, value: this._value });
                this.invalidateMeasure();
            }
        }

        protected onKeyDown(event: KeyboardEvent) {
            let key = event.key;
            // keep arrows + Del + Backspace for us only
            if ((key == 'ArrowLeft') || (key == 'ArrowRight') || (key == 'ArrowUp') ||
                (key == 'ArrowDown') || (key == 'Delete') || (key == ' '))
                event.stopPropagation();
        }

        protected onKeyUp(event: KeyboardEvent) {
            let key = event.key;
            // keep arrows + Del + Backspace for us only
            if ((key == 'ArrowLeft') || (key == 'ArrowRight') || (key == 'ArrowUp') ||
                (key == 'ArrowDown') || (key == 'Delete') || (key == ' '))
                event.stopPropagation();
            // test if content changed
            if (this.drawing.value !== this._value) {
                this._value = this.drawing.value;
                this.changed.fire({ target: this, value: this._value });
                this.invalidateMeasure();
            }
        }

        protected renderDrawing() {
            let drawing = document.createElement('textarea');
            drawing.setAttribute('rows', '1');
            drawing.setAttribute('cols', '1');

            drawing.style.opacity = '1';
            drawing.style.display = 'block';
            drawing.style.resize = 'none';
            drawing.style.overflow = 'hidden';
            drawing.style.border = '0px';
            drawing.style.margin = '0px';
            drawing.style.padding = '0px';
            drawing.style.outline = 'none';
            drawing.style.background = 'none';
            if (Core.Navigator.isWebkit)
                drawing.style.webkitAppearance = 'none';
            drawing.style.fontSize = this.fontSize + 'px';
            drawing.style.fontFamily = this.fontFamily;
            drawing.style.fontWeight = this.fontWeight;
            drawing.style.color = this.getColor().getCssRgba();
            return drawing;
        }

        protected measureCore(width: number, height: number) {
            this.drawing.style.width = width + 'px';
            this.drawing.style.height = '';
            let size = { width: this.drawing.scrollWidth, height: Math.max(this.fontSize, this.drawing.scrollHeight) };
            //let size = { width: this.drawing.scrollWidth, height: Math.max(this.fontSize * 3 / 2, this.drawing.scrollHeight) };
            this.drawing.style.width = this.layoutWidth + 'px';
            this.drawing.style.height = this.layoutHeight + 'px';
            return size;
        }

        protected arrangeCore(width: number, height: number) {
            this.drawing.style.width = width + 'px';
            this.drawing.style.height = height + 'px';
        }

        protected onDisable() {
            super.onDisable();
            this.drawing.blur();
            this.drawing.style.cursor = 'default';
            this.drawing.disabled = true;
        }

        protected onEnable() {
            super.onEnable();
            this.drawing.style.cursor = 'auto';
            this.drawing.disabled = false;
        }

        protected onStyleChange() {
            this.drawing.style.fontSize = this.fontSize + 'px';
            this.drawing.style.fontFamily = this.fontFamily;
            this.drawing.style.fontWeight = this.fontWeight;
            this.drawing.style.color = this.getColor().getCssRgba();
            this.invalidateMeasure();
        }

        static style: TextAreaStyle = {
            color: new Ui.Color(),
            fontSize: 14,
            fontFamily: 'Sans-serif',
            fontWeight: 'normal'
        }
    }

    export interface TextAreaStyle {
        color: Color;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
    }
}

