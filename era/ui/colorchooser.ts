namespace Ui {

    export class CheckerBoard extends Ui.CanvasElement {
        private _size = 10;

        constructor() {
            super();
            this.clipToBounds = true;
        }

        get size() {
            return this._size;
        }

        set size(value: number) {
            if (value != this._size) {
                this._size = value;
                this.invalidateDraw();
            }
        }

        protected updateCanvas(ctx: Ui.CanvasRenderingContext2D) {
            let nx = Math.ceil(this.layoutWidth / this.size);
            let ny = Math.ceil(this.layoutHeight / this.size);
            for (let y = 0; y < ny; y++) {
                for (let x = 0; x < nx; x++) {
                    ctx.fillStyle = (x + y) % 2 ? 'black' : '#999999';
                    ctx.fillRect(x * this.size, y * this.size, this.size, this.size);
                }
            }
        }
    }

    export class ColorSlider extends Ui.Slider {

        protected updateColors() {
            this.bar.fill = 'rgba(0,0,0,0)';
            this.background.drawing.style.background = 'linear-gradient(to right, hsl(0, 100%, 50%), hsl(60,100%,50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(270, 100%, 50%), hsl(359, 100%, 50%))';
            this.buttonContent.fill = Ui.Color.createFromHsl(this.value * 360, 1, 0.5, 1);
        }

        protected updateValue() {
            super.updateValue();
            this.updateColors();
        }
    }

    export interface ColorChooserInit extends Ui.HBoxInit {
        alpha?: boolean;
        value?: Ui.Color | string;
        onchanged?: (event: { target: ColorChooser, value: Ui.Color }) => void;
    }

    export class ColorChooser extends Ui.HBox {
        _value = new Ui.Color();
        colorRect: Ui.Rectangle;
        hSlider = new ColorSlider();
        sSlider: Form.SliderField;
        lSlider: Form.SliderField;
        aSlider: Form.SliderField;
        field: Form.TextField;
        lock: boolean = false;
        alpha: boolean = false;
        changed = new Core.Events<{ target: ColorChooser, value: Ui.Color }>();

        constructor(init?: ColorChooserInit) {
            super(init);

            this.spacing = 10;

            this.colorRect = new Ui.Rectangle({ width: 80, height: 80 });
            this.append(new Ui.LBox().assign({
                content: [
                    new CheckerBoard().assign({
                        opacity: 0.4
                    }),
                    this.colorRect
                ]
            }));

            let vbox = new Ui.VBox();
            this.append(vbox, true);

            vbox.append(new Ui.VBox().assign({
                content: [
                    new Ui.Text().assign({ text: 'Couleur' }),
                    this.hSlider.assign({
                        marginLeft: 10,
                        onchanged: () => this.sliderChanged()
                    })
                ]
            }));
            this.sSlider = new window.Form.SliderField({
                title: 'Saturation', onchanged: e => this.sliderChanged()
            });
            vbox.append(this.sSlider);
            this.lSlider = new window.Form.SliderField({
                title: 'Lumière', onchanged: e => this.sliderChanged()
            });
            vbox.append(this.lSlider);

            this.aSlider = new window.Form.SliderField({
                title: 'Transparence', onchanged: e => this.sliderChanged()
            });

            this.field = new window.Form.TextField({
                title: 'HTML', width: 200,
                onchanged: e => {
                    if (this.lock)
                        return;
                    try {
                        this.lock = true;
                        this._value = Ui.Color.parse(this.field.value);
                        this.updateColor();
                        this.updateSliders();
                        this.changed.fire({ target: this, value: this._value });
                    }
                    catch (e) { }
                    this.lock = false;
                }
            });
            vbox.append(this.field);

            if (init) {
                if (init.alpha) {
                    this.alpha = init.alpha;
                    vbox.insertBefore(this.aSlider, this.field);
                }
                if (init.value !== undefined)
                    this.value = init.value;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
            }
            if (!init || !init.value)
                this.value = 'black';
        }

        private sliderChanged() {
            if (this.lock)
                return;
            let hsla = {
                h: this.hSlider.value * 360,
                s: this.sSlider.value,
                l: this.lSlider.value,
                a: this.aSlider.value
            };
            this._value = Ui.Color.createFromHsl(hsla.h, hsla.s, hsla.l, hsla.a);
            this.updateColor();
            this.updateField();
            this.changed.fire({ target: this, value: this._value });
        }

        private updateColor() {
            this.colorRect.fill = this._value;
        }

        private updateSliders() {
            let hsla = this._value.getHsla();
            this.hSlider.value = hsla.h / 360;
            this.sSlider.value = hsla.s;
            this.lSlider.value = hsla.l;
            this.aSlider.value = hsla.a;
        }

        private updateField() {
            this.field.value = this._value.getCssHtml(this.alpha);
        }

        set value(value: Ui.Color | string) {
            this.lock = true;
            try {
                this._value = Ui.Color.create(value);
                this.updateColor();
                this.updateSliders();
                this.updateField();
            }
            catch (e) { }
            this.lock = false;
        }

        get value(): Ui.Color | string {
            return this._value;
        }
    }

    export interface ColorButtonInit extends Ui.ButtonInit {
        value?: Ui.Color;
        alpha?: boolean;
        palette?: Array<Ui.Color | string>;
        onchanged?: (event: { target: ColorButton, value: Ui.Color }) => void;
    }

    export class ColorButton extends Ui.Button {
        color = new Ui.Color();
        alpha: boolean = false;
        private rect: Ui.Rectangle;
        private _palette!: Array<Ui.Color>;
        changed = new Core.Events<{ target: ColorButton, value: Ui.Color }>();
        set onchanged(value: (e:{ target: ColorButton, value: Ui.Color }) => void) { this.changed.connect(value) };

        constructor(init?: ColorButtonInit) {
            super(init);
            this.rect = new Ui.Rectangle({ verticalAlign: 'center' });
            this.value = new Ui.Color();
            this.setIconOrElement(new Ui.LBox().assign({
                content: [
                    new CheckerBoard().assign({
                        opacity: 0.4
                    }),
                    this.rect
                ]
            }));
            this.pressed.connect(() => this.onColorButtonPress());
            this.palette = new Array<Ui.Color>();
            if (init) {
                if (init.value !== undefined)
                    this.value = init.value;
                if (init.palette !== undefined)
                    this.palette = init.palette.map(color => Ui.Color.create(color));
                if (init.alpha !== undefined)
                    this.alpha = init.alpha;
            }
        }

        set palette(palette: Array<Ui.Color>) {
            this._palette = palette.map(color => Ui.Color.create(color));
        }

        get palette(): Array<Ui.Color> {
            return this._palette;
        }

        set value(color: Ui.Color) {
            this.color = color;
            this.rect.fill = this.color;
            this.changed.fire({ target: this, value: this.color });
        }

        get value() {
            return this.color;
        }

        private onColorButtonPress() {
            let popup = new Ui.MenuPopup();
            let lbox = new Ui.LBox({ padding: 10 });
            popup.content = lbox;

            let vbox = new Ui.VBox({ spacing: 10 });
            lbox.content = vbox;

            let colorChooser = new ColorChooser({
                value: this.color, alpha: this.alpha,
                onchanged: e => this.value = e.value
            });
            vbox.append(colorChooser);

            if (this.palette.length > 0) {
                let flow = new Ui.Flow({ spacing: 5 });
                vbox.prepend(flow);

                for (let color of this.palette) {
                    flow.append(new Ui.Pressable({
                        content: new Ui.Rectangle({ width: 32, height: 32, fill: color }),
                        onpressed: () => { colorChooser.value = color; this.value = color; }
                    }));
                }
            }

            popup.openElement(this, 'left');
        }

        protected onStyleChange() {
            super.onStyleChange();
            let size = this.getStyleProperty('iconSize');
            this.rect.width = size;
            this.rect.height = size;
        }
    }
}