namespace Ui
{
    export class ButtonText extends CompactLabel { }

    export class ButtonBackground extends CanvasElement
    {
        private _borderWidth: number = 1;
        private _border: Color = undefined;
        private _background: Color = undefined;
        private _radius: number = 3;

        constructor() {
            super();
            this.border = 'black';
            this.background = 'white';
        }

        set borderWidth(borderWidth: number) {
            this._borderWidth = borderWidth;
            this.invalidateDraw();
        }

        set border(border: Color | string) {
            this._border = Color.create(border);
            this.invalidateDraw();
        }

        set radius(radius: number) {
            this._radius = radius;
            this.invalidateDraw();
        }

        set background(background: Color | string) {
            this._background = Color.create(background);
            this.invalidateDraw();
        }

        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;

            let radius = Math.min(this._radius, Math.min(w, h) / 2);

            ctx.beginPath();
            let br = Math.max(0, radius - this._borderWidth);
            ctx.roundRect(this._borderWidth, this._borderWidth,
                w - this._borderWidth * 2, h - this._borderWidth * 2,
                br, br, br, br);
            ctx.closePath();
            ctx.fillStyle = this._background.getCssRgba();
            ctx.fill();
            if (this._borderWidth > 0) {
                ctx.beginPath();
                ctx.roundRect(0, 0, w, h, radius, radius, radius, radius);
                ctx.roundRect(this._borderWidth, this._borderWidth,
                    w - this._borderWidth * 2, h - this._borderWidth * 2,
                    br, br, br, br, true);
                ctx.closePath();
                ctx.fillStyle = this._border.getCssRgba();
                ctx.fill();
            }
        }
    }

    /*export class ButtonIcon extends CanvasElement
    {
        private _badge: string = undefined;
        private _badgeColor: Color = undefined;
        private _badgeTextColor: Color = undefined;
        private _fill: Color = undefined;
        private _icon: string = 'eye';

        constructor() {
            super();
            this.fill = 'black';
            this.badgeColor = 'red';
            this.badgeTextColor = 'white';
        }

        get icon(): string {
            return this._icon;
        }

        set icon(icon: string) {
            this._icon = icon;
            this.invalidateDraw();
        }

        set badge(badge: string) {
            this._badge = badge;
            this.invalidateDraw();
        }

        set badgeColor(badgeColor: Color | string) {
            this._badgeColor = Color.create(badgeColor);
            this.invalidateDraw();
        }

        set badgeTextColor(badgeTextColor: Color | string) {
            this._badgeTextColor = Color.create(badgeTextColor);
            this.invalidateDraw();
        }

        set fill(fill: Color | string) {
            this._fill = Color.create(fill);
            this.invalidateDraw();
        }

        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let iconSize = Math.min(w, h);

            // icon
            ctx.save();
            ctx.translate((w - iconSize) / 2, (h - iconSize) / 2);

            if (this._badge !== undefined)
                Icon.drawIconAndBadge(ctx, this._icon, iconSize, this._fill.getCssRgba(),
                    this._badge, iconSize / 2.5,
                    this._badgeColor.getCssRgba(),
                    this._badgeTextColor.getCssRgba());
            else
                Icon.drawIcon(ctx, this._icon, iconSize, this._fill.getCssRgba());
            ctx.restore();
        }
    }*/

    export class ButtonBadge extends LBox
    {
        private _bg = new Rectangle();
        private _label = new Label();
        private _badge: string = undefined;
        private _badgeColor: Color = undefined;
        private _badgeTextColor: Color = undefined;

        constructor() {
            super();
            this._label.fontWeight = 'bold';
            this.content = [
                this._bg, this._label
            ]
            this.badgeColor = 'red';
            this.badgeTextColor = 'white';
        }

        set fontSize(value: number) {
            this._label.fontSize = value;
            this._label.margin = value / 4;
            this._bg.radius = value * 3 / 4;
        }

        set badge(badge: string) {
            this._badge = badge;
            this._label.text = badge;
        }

        set badgeColor(badgeColor: Color | string) {
            this._badgeColor = Color.create(badgeColor);
            this._bg.fill = this._badgeColor;
        }

        set badgeTextColor(badgeTextColor: Color | string) {
            this._badgeTextColor = Color.create(badgeTextColor);
            this._label.color = this._badgeTextColor;
        }
    }

    export class ButtonIcon extends Icon {}


    export interface ButtonInit extends PressableInit {
        text?: string | undefined;
        icon?: string | undefined;
        background?: Element;
        marker?: Element;
        isActive?: boolean;
        badge?: string;
        orientation?: Orientation;
    }

    export class Button extends Pressable implements ButtonInit	{
        private _isActive: boolean = false;
        private mainBox: HBox;
        private buttonPartsBox: Box;
        private _icon: Element;
        private _iconBox: LBox;
        private _text: Element;
        private _textBox: LBox;
        private _marker?: Element;
        private _badge?: string;
        private _badgeContent?: ButtonBadge;
        private bg: Element;
        private _orientation: Orientation;

        constructor(init?: ButtonInit) {
            super(init);
            this.bg = new ButtonBackground();
            this.content = this.bg;

            this.mainBox = new HBox();
            this.mainBox.verticalAlign = 'center';
            this.mainBox.horizontalAlign = 'stretch';
            this.append(this.mainBox);


            this.buttonPartsBox = new Box();
            this.mainBox.append(this.buttonPartsBox, true);

            this._textBox = new LBox();

            this._iconBox = new LBox();

            this.downed.connect(() => this.updateColors());
            this.upped.connect(() => this.updateColors());
            this.focused.connect(() => this.updateColors());
            this.blurred.connect(() => this.updateColors());
            this.entered.connect(() => this.updateColors());
            this.leaved.connect(() => this.updateColors());

            if (init) {
                if (init.text !== undefined)
                    this.text = init.text;
                if (init.icon !== undefined)
                    this.icon = init.icon;
                if (init.background !== undefined)
                    this.background = init.background;
                if (init.marker !== undefined)
                    this.marker = init.marker;
                if (init.isActive !== undefined)
                    this.isActive = init.isActive;
                if (init.badge !== undefined)
                    this.badge = init.badge;
                if (init.orientation !== undefined)
                    this.orientation = init.orientation;
            }
        }

        get background(): Element {
            return this.bg;
        }

        set background(bg: Element) {
            this.remove(this.bg);
            if (bg === undefined)
                this.bg = new ButtonBackground();
            else
                this.bg = bg;
            this.prepend(this.bg);
            this.onStyleChange();
        }

        get textBox(): Element {
            return this._textBox;
        }

        get text(): string | undefined {
            return (this._text instanceof ButtonText) ? (this._text as ButtonText).text : undefined;
        }

        set text(text: string | undefined) {
            this.setTextOrElement(text);
        }

        setTextOrElement(text: string | Element | undefined) {
            if (typeof (text) === 'string') {
                if (this._text !== undefined) {
                    if (this._text instanceof ButtonText)
                        this._text.text = text;
                    else {
                        this._text = new ButtonText();
                        (this._text as ButtonText).text = text;
                        (this._text as ButtonText).color = this.getForegroundColor();
                        this._textBox.content = this._text;
                    }
                }
                else {
                    this._text = new ButtonText();
                    (this._text as ButtonText).text = text;
                    (this._text as ButtonText).color = this.getForegroundColor();
                    this._textBox.content = this._text;
                }
            }
            else {
                this._text = text;
                if (this._text instanceof Element)
                    this._textBox.content = this._text;
                else if (this._text !== undefined) {
                    this._text = new ButtonText();
                    (this._text as ButtonText).text = this._text.toString();
                    (this._text as ButtonText).color = this.getForegroundColor();
                    this._textBox.content = this._text;
                }
            }
            this.updateVisibles();
        }

        get iconBox(): LBox {
            return this._iconBox;
        }

        get icon(): string | undefined {
            return (this._icon instanceof ButtonIcon) ? (this._icon as ButtonIcon).icon : undefined;
        }

        set icon(icon: string | undefined) {
            this.setIconOrElement(icon);
        }

        setIconOrElement(icon: Element | string | undefined) {
            if (typeof (icon) === 'string') {
                if (this._icon != undefined) {
                    if (this._icon instanceof ButtonIcon)
                        this._icon.icon = icon;
                    else {
                        let ic = new ButtonIcon();
                        this._icon = ic;
                        ic.icon = icon;
//                        ic.badge = this._badge;
                        ic.fill = this.getForegroundColor();
//                        ic.badgeColor = this.getStyleProperty('badgeColor');
//                        ic.badgeTextColor = this.getStyleProperty('badgeTextColor');
                        this.iconBox.content = this._icon;
                        if (this._badgeContent)
                            this.iconBox.append(this._badgeContent);
                    }
                }
                else {
                    let ic = new ButtonIcon();
                    this._icon = ic
                    ic.icon = icon;
//                    ic.badge = this._badge;
                    ic.fill = this.getForegroundColor();
//                    ic.badgeColor = this.getStyleProperty('badgeColor');
//                    ic.badgeTextColor = this.getStyleProperty('badgeTextColor');
                    this._iconBox.content = this._icon;
                    if (this._badgeContent)
                        this.iconBox.append(this._badgeContent);
                }
            }
            else {
                this._icon = icon as Element;
                this._iconBox.content = this._icon;
                if (this._badgeContent)
                    this.iconBox.append(this._badgeContent);
            }
            this.updateVisibles();
        }

        get marker(): Element {
            return this._marker;
        }

        set marker(marker: Element) {
            if (this._marker !== undefined)
                this.mainBox.remove(this._marker);
            this._marker = marker;
            this.mainBox.append(this._marker);
        }

        get isActive(): boolean {
            return this._isActive;
        }

        set isActive(isActive: boolean) {
            if (this._isActive !== isActive) {
                this._isActive = isActive;
                this.updateColors();
            }
        }

        get badge(): string {
            return this._badge;
        }

        set badge(text: string) {
            this._badge = text;
            if (!this._badgeContent) {
                this._badgeContent = new ButtonBadge().assign({
                    verticalAlign: 'top', horizontalAlign: 'right',
                    fontSize: parseInt(this.getStyleProperty('iconSize')) / 4,
                    badgeColor: this.getStyleProperty('badgeColor'),
                    badgeTextColor: this.getStyleProperty('badgeTextColor')
                });
                this.iconBox.append(this._badgeContent);
            }
            this._badgeContent.badge = text;

//            if (this._icon instanceof ButtonIcon) {
//                this._icon.badge = text;
//            }
        }

        get orientation(): Orientation {
            if (this._orientation !== undefined)
                return this._orientation;
            else
                return this.getStyleProperty('orientation');
        }

        set orientation(orientation) {
            this._orientation = orientation;
            this.buttonPartsBox.orientation = this.orientation;
            this.updateVisibles();
        }

        protected getBackgroundColor(): Color {
            let color;
            if (this._isActive) {
                if (this.hasFocus && !this.getIsMouseFocus())
                    color = Color.create(this.getStyleProperty('focusActiveBackground'));
                else
                    color = Color.create(this.getStyleProperty('activeBackground'));
            }
            else {
                if (this.hasFocus && !this.getIsMouseFocus())
                    color = Color.create(this.getStyleProperty('focusBackground'));
                else
                    color = Color.create(this.getStyleProperty('background'));
            }
            let yuv = color.getYuva();
            let deltaY = 0;
            if (this.isDown)
                deltaY = -0.20;
            else if (this.isOver) {
                deltaY = 0.10;
                yuv.a = Math.max(0.2, yuv.a);
            }
            return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v, yuv.a);
        }

        protected getBackgroundBorderColor() {
            let color;
            if (this._isActive) {
                if (this.hasFocus && !this.getIsMouseFocus())
                    color = Color.create(this.getStyleProperty('focusActiveBackgroundBorder'));
                else
                    color = Color.create(this.getStyleProperty('activeBackgroundBorder'));
            }
            else {
                if (this.hasFocus && !this.getIsMouseFocus())
                    color = Color.create(this.getStyleProperty('focusBackgroundBorder'));
                else
                    color = Color.create(this.getStyleProperty('backgroundBorder'));
            }
            let yuv = color.getYuva();
            let deltaY = 0;
            if (this.isDown)
                deltaY = -0.20;
            else if (this.isOver)
                deltaY = 0.20;
            return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v, yuv.a);
        }

        protected getForegroundColor() {
            let color;
            if (this._isActive) {
                if (this.hasFocus && !this.getIsMouseFocus())
                    color = Color.create(this.getStyleProperty('focusActiveForeground'));
                else
                    color = Color.create(this.getStyleProperty('activeForeground'));
            }
            else {
                if (this.hasFocus && !this.getIsMouseFocus())
                    color = Color.create(this.getStyleProperty('focusForeground'));
                else
                    color = Color.create(this.getStyleProperty('foreground'));
            }
            let deltaY = 0;
            if (this.isDown)
                deltaY = -0.20;
            else if (this.isOver)
                deltaY = 0.20;
            let yuv = color.getYuva();
            return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v, yuv.a);
        }

        get isTextVisible(): boolean {
            return ((this._text !== undefined) && (this.getStyleProperty('showText') || (this._icon === undefined)));
        }

        get isIconVisible(): boolean {
            return ((this._icon !== undefined) && (this.getStyleProperty('showIcon') || (this._text === undefined)));
        }

        protected updateVisibles() {
            if (this.isTextVisible) {
                if (this._textBox.parent == undefined)
                    this.buttonPartsBox.append(this._textBox, true);
                if (this._text instanceof ButtonText) {
                    let textAlign = this.getStyleProperty('textAlign');
                    if (textAlign == 'auto') {
                        if (this.isIconVisible && (this.orientation === 'horizontal'))
                            this._text.textAlign = 'left';
                        else
                            this._text.textAlign = 'center';
                    }
                    else
                        this._text.textAlign = textAlign;

                    this._text.fontFamily = this.getStyleProperty('fontFamily');
                    this._text.fontSize = this.getStyleProperty('fontSize');
                    this._text.fontWeight = this.getStyleProperty('fontWeight');
                    this._text.maxLine = this.getStyleProperty('maxLine');
                    this._text.whiteSpace = this.getStyleProperty('whiteSpace');
                    this._text.interLine = this.getStyleProperty('interLine');
                    this._text.textTransform = this.getStyleProperty('textTransform');
                }
            }
            else if (this._textBox.parent != undefined)
                this.buttonPartsBox.remove(this._textBox);
            if (this.isIconVisible) {
                this._iconBox.resizable = !this.isTextVisible;
                if (this._iconBox.parent == undefined)
                    this.buttonPartsBox.prepend(this._iconBox);
            }
            else if (this._iconBox.parent != undefined)
                this.buttonPartsBox.remove(this._iconBox);

            if (this.orientation === 'horizontal') {
                if (this.isTextVisible)
                    this._text.verticalAlign = 'center';
            }
            else {
                if (this.isIconVisible && this.isTextVisible)
                    this._text.verticalAlign = 'top';
                else if (this.isTextVisible)
                    this._text.verticalAlign = 'center';
            }
        }

        protected updateColors() {
            let fg = this.getForegroundColor();
            if (this.bg instanceof ButtonBackground) {
                this.bg.background = this.getBackgroundColor();
                this.bg.border = this.getBackgroundBorderColor();
            }
            if (this._text instanceof ButtonText)
                this._text.color = fg;
            if (this._icon instanceof ButtonIcon) {
                this._icon.fill = fg;
//                this._icon.badgeColor = this.getStyleProperty('badgeColor');
//                this._icon.badgeTextColor = this.getStyleProperty('badgeTextColor');
            }
            if (this._badgeContent) {
                this._badgeContent.badgeColor = this.getStyleProperty('badgeColor');
                this._badgeContent.badgeTextColor = this.getStyleProperty('badgeTextColor');
            }
        }

        protected onDisable() {
            super.onDisable();
            this.bg.opacity = 0.2;
        }

        protected onEnable() {
            super.onEnable();
            this.bg.opacity = 1;
        }

        protected onStyleChange() {
            this.buttonPartsBox.spacing = Math.max(0, this.getStyleProperty('spacing'));
            this.buttonPartsBox.margin = Math.max(0, this.getStyleProperty('padding'));
            if (this.bg instanceof ButtonBackground) {
                this.bg.radius = this.getStyleProperty('radius');
                this.bg.borderWidth = this.getStyleProperty('borderWidth');
            }
            let iconSize = Math.max(0, this.getStyleProperty('iconSize'));
            this._iconBox.width = iconSize;
            this._iconBox.height = iconSize;
            this._textBox.width = this.getStyleProperty('textWidth');
            this._textBox.maxWidth = this.getStyleProperty('maxTextWidth');
            this._textBox.height = this.getStyleProperty('textHeight');
            this.buttonPartsBox.orientation = this.orientation;
            this.updateVisibles();
            this.updateColors();
        }

        static style: object = {
            orientation: 'horizontal',
            borderWidth: 1,
            badgeColor: 'red',
            badgeTextColor: 'white',
            background: 'rgba(250,250,250,1)',
            backgroundBorder: 'rgba(140,140,140,1)',
            foreground: '#444444',
            activeBackground: 'rgba(250,250,250,1)',
            activeBackgroundBorder: 'rgba(140,140,140,1)',
            activeForeground: '#dc6c36',
            focusBackground: '#07a0e5',//'rgb(33,211,255)',
            focusBackgroundBorder: new Color(0.04, 0.43, 0.5),
            focusForeground: 'rgba(250,250,250,1)',//'#222222',
            focusActiveBackground: 'rgb(33,211,255)',
            focusActiveBackgroundBorder: new Color(0.04, 0.43, 0.5),
            focusActiveForeground: 'white',
            radius: 3,
            spacing: 10,
            padding: 7,
            iconSize: 26,
            fontSize: 16,
            fontFamily: 'Sans-serif',
            fontWeight: 'normal',
            textWidth: 70,
            textTransform: 'uppercase',
            maxTextWidth: Number.MAX_VALUE,
            textHeight: 26,
            textAlign: 'auto',
            interLine: 1,
            maxLine: 3,
            whiteSpace: 'nowrap',
            showText: true,
            showIcon: true
        }
    }

    export class DefaultButton extends Button
    {
        static style: object = {
            borderWidth: 1,
            background: '#444444',
            backgroundBorder: '#444444',
            foreground: 'rgba(250,250,250,1)'
        }
    }
}


