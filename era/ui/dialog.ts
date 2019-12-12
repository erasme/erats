namespace Ui {

    export interface DialogCloseButtonInit extends ButtonInit { }

    export class DialogCloseButton extends Button implements DialogCloseButtonInit {
    
        constructor(init?: DialogCloseButtonInit) {
            super(init);
            this.icon = 'close';
            this.text = 'Fermer';
        }

        static style: object = {
            showText: false,
            background: 'rgba(250,250,250,0)',
            backgroundBorder: 'rgba(250,250,250,0)',
            activeBackground: 'rgba(250,250,250,0)',
            activeBackgroundBorder: 'rgba(250,250,250,0)'
        }
    }

    export class DialogGraphic extends CanvasElement {

        private _background: Color;

        constructor() {
            super();
            this._background = Color.create('#f8f8f8');
        }
    
        set background(color: Color | string) {
            this._background = Ui.Color.create(color);
            this.invalidateDraw();
        }

        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;

            // shadow
            ctx.roundRectFilledShadow(0, 0, w, h, 2, 2, 2, 2, false, 3, new Ui.Color(0, 0, 0, 0.3));

            // content background
            ctx.fillStyle = this._background.getCssRgba();
            ctx.fillRect(3, 3, w - 6, h - 6);
        }
    }

    export class DialogTitle extends Label
    {
        static style: object = {
            color: Color.create('#666666'),
            fontWeight: 'bold',
            fontSize: 18
        }
    }

    export class DialogButtonBox extends LBox
    {
        bg: Rectangle;
        actionBox: HBox;
        cancelButton?: Pressable;
        actionButtonsBox: HBox;
        titleLabel: DialogTitle;
        readonly cancelled: Core.Events<{ target: DialogButtonBox }> = new Core.Events();
    
        constructor() {
            super();

            this.bg = new Rectangle();
            this.append(this.bg);

            this.actionBox = new HBox();
            this.actionBox.margin = 5;
            this.actionBox.spacing = 10;
            this.append(new Ui.ScrollingArea({ content: this.actionBox, scrollVertical: false }));

            this.actionButtonsBox = new HBox();
            this.actionButtonsBox.spacing = 5;
            this.actionBox.append(this.actionButtonsBox, true);

            this.titleLabel = new DialogTitle({ verticalAlign: 'center', horizontalAlign: 'left' });
            this.actionButtonsBox.append(this.titleLabel, true);
        }

        getTitle(): string {
            return this.titleLabel.text;
        }

        setTitle(title: string) {
            this.titleLabel.text = title;
        }

        setCancelButton(button: Pressable) {
            if (this.cancelButton !== undefined) {
                if (this.cancelButton instanceof Pressable)
                    this.cancelButton.pressed.disconnect(this.onCancelPress);
                this.actionBox.remove(this.cancelButton);
            }
            this.cancelButton = button;
            if (this.cancelButton !== undefined) {
                if (this.cancelButton instanceof Pressable)
                    this.cancelButton.pressed.connect(this.onCancelPress);
                this.actionBox.prepend(this.cancelButton);
            }
        }

        setActionButtons(buttons: Array<Element>) {
            this.actionButtonsBox.content = buttons;
            this.actionButtonsBox.prepend(this.titleLabel, true);
        }

        getActionButtons() {
            return this.actionButtonsBox.children.slice(1);
        }

        onCancelPress = () => {
            this.cancelled.fire({ target: this });
        }

        onStyleChange() {
            this.bg.fill = this.getStyleProperty('background');
        }

        static style: object = {
            background: '#e8e8e8'
        }
    }

    export interface DialogInit extends ContainerInit {
        padding?: number;
        preferredWidth?: number;
        preferredHeight?: number;
        title?: string;
        cancelButton?: Pressable;
        actionButtons?: Element[];
        autoClose?: boolean;
        content?: Element;
        onclosed?: (event: { target: Dialog }) => void;
    }

    export class Dialog extends Container implements DialogInit {
        dialogSelection: Selection;
        protected shadowGraphic: Rectangle;
        protected graphic: DialogGraphic;
        private lbox: Form;
        private vbox: VBox;
        private contentBox: LBox;
        private contentVBox: VBox;
        private _actionButtons?: Element[];
        private _cancelButton?: Pressable;
        private buttonsBox: LBox;
        buttonsVisible: boolean = false;
        private _preferredWidth: number | undefined;
        private _preferredHeight: number | undefined;
        private actionBox: DialogButtonBox;
        private contextBox: ContextBar;
        private _autoClose?: boolean;
        private openClock?: Anim.Clock;
        isClosed: boolean = true;
        private scroll: ScrollingArea;
        readonly closed = new Core.Events<{ target: Dialog }>();
        set onclosed(value: (event: { target: Dialog }) => void) { this.closed.connect(value); }

        constructor(init?: DialogInit) {
            super(init);
            this.drawing.style.position = 'fixed';
            this.drawing.style.top = '0';
            this.drawing.style.bottom = '0';
            this.drawing.style.left = '0';
            this.drawing.style.right = '0';

            this.dialogSelection = new Ui.Selection();

            this.shadowGraphic = new Ui.Rectangle();
            // handle auto hide
            new PressWatcher({
                element: this.shadowGraphic,
                onpressed: () => this.onShadowPress()
            });
            this.appendChild(this.shadowGraphic);

            this.lbox = new Ui.Form();
            this.lbox.submited.connect(() => this.onFormSubmit());
            this.appendChild(this.lbox);

            this.graphic = new Ui.DialogGraphic();
            this.lbox.append(this.graphic);

            this.vbox = new Ui.VBox();
            this.vbox.margin = 3;
            this.lbox.append(this.vbox);

            this.buttonsBox = new Ui.LBox();
            this.buttonsBox.height = 32;
            this.buttonsBox.hide(true);
            this.vbox.append(this.buttonsBox);

            this.scroll = new Ui.ScrollingArea();
            this.vbox.append(this.scroll, true);
        
            this.contentVBox = new Ui.VBox();
            this.scroll.content = this.contentVBox;
        
            this.contentBox = new Ui.LBox();
            this.contentBox.margin = 8;
            this.contentVBox.append(this.contentBox, true);

            this.contextBox = new Ui.ContextBar();
            this.contextBox.selection = this.dialogSelection;
            this.contextBox.hide();
            this.buttonsBox.append(this.contextBox);

            this.actionBox = new Ui.DialogButtonBox();
            this.actionBox.cancelled.connect(() => this.close());
            this.buttonsBox.append(this.actionBox);

            this.dialogSelection.changed.connect((e) => this.onDialogSelectionChange(e.target));

            // handle keyboard		
            this.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));

            this.cancelButton = new DialogCloseButton();

            this.onStyleChange();

            if (init) {
                if (init.padding !== undefined)
                    this.padding = init.padding;
                if (init.preferredWidth !== undefined)
                    this.preferredWidth = init.preferredWidth;	
                if (init.preferredHeight !== undefined)
                    this.preferredHeight = init.preferredHeight;	
                if (init.title !== undefined)
                    this.title = init.title;
                if (init.cancelButton !== undefined)
                    this.cancelButton = init.cancelButton;	
                if (init.actionButtons !== undefined)
                    this.actionButtons = init.actionButtons;
                if (init.autoClose !== undefined)
                    this.autoClose = init.autoClose;
                if (init.content !== undefined)
                    this.content = init.content;
                if (init.onclosed)
                    this.closed.connect(init.onclosed);
            }
        }

        // implement a selection handler for Selectionable elements
        getSelectionHandler() {
            return this.dialogSelection;
        }

        set preferredWidth(width: number) {
            this._preferredWidth = width;
            this.invalidateMeasure();
        }

        set preferredHeight(height: number) {
            this._preferredHeight = height;
            this.invalidateMeasure();
        }

        get padding(): number {
            return this.contentBox.marginLeft;
        }

        set padding(padding: number) {
            this.contentBox.margin = padding;
        }

        open() {
            if (this.isClosed) {
                Ui.App.appendDialog(this);
                this.isClosed = false;

                if (this.openClock == undefined) {
                    this.openClock = new Anim.Clock({
                        duration: 1, target: this, speed: 5,
                        ease: new Anim.PowerEase({ mode: 'out' })
                    });
                    this.openClock.timeupdate.connect((e) => this.onOpenTick(e.target, e.progress, e.deltaTick));
                    // set the initial state
                    this.onOpenTick(this.openClock, 0, 0);
                    // the start of the animation is delayed to the next arrange
                    this.invalidateArrange();
                }
            }
        }

        close() {
            if (!this.isClosed) {
                // the removal of the dialog is delayed to the end of the animation
                this.closed.fire({ target: this });

                this.isClosed = true;
                this.lbox.disable();

                if (this.openClock === undefined) {
                    this.openClock = new Anim.Clock({
                        duration: 1, target: this, speed: 5,
                        ease: new Anim.PowerEase({ mode: 'out' })
                    });
                    this.openClock.timeupdate.connect((e) => this.onOpenTick(e.target, e.progress, e.deltaTick));
                    this.openClock.begin();
                }
            }
        }

        onOpenTick(clock, progress, delta) {
            let end = (progress >= 1);
            if (this.isClosed)
                progress = 1 - progress;
            this.shadowGraphic.opacity = progress;
            this.lbox.opacity = progress;
            this.lbox.transform = Matrix.createTranslate(0, -20 * (1 - progress));

            if (end) {
                if (this.openClock)
                    this.openClock.stop();
                this.openClock = undefined;
                if (this.isClosed) {
                    Ui.App.removeDialog(this);
                    this.lbox.enable();
                }
            }
        }

        getDefaultButton(): DefaultButton | undefined {
            let buttons = this.actionBox.getActionButtons();
            for (let i = 0; i < buttons.length; i++)
                if (buttons[i] instanceof DefaultButton)
                    return buttons[i] as DefaultButton;
        }

        defaultAction() {
            let defaultButton = this.getDefaultButton();
            if (defaultButton !== undefined)
                defaultButton.press();
        }

        get title(): string {
            return this.actionBox.getTitle();
        }

        set title(title: string) {
            this.actionBox.setTitle(title);
        }

        updateButtonsBoxVisible() {
            let visible = (this._cancelButton !== undefined) || (this._actionButtons !== undefined) ||
                (this.dialogSelection.elements.length > 0);
        
            if (!this.buttonsVisible && visible) {
                this.buttonsVisible = true;
                this.buttonsBox.show();
            }
            else if (this.buttonsVisible && !visible) {
                this.buttonsVisible = false;
                this.buttonsBox.hide(true);
            }
        }
    
        set cancelButton(button: Pressable | undefined) {
            this._cancelButton = button;
            this.actionBox.setCancelButton(button);
            this.updateButtonsBoxVisible();
        }

        set actionButtons(buttons: Element[]) {
            this._actionButtons = buttons;
            this.actionBox.setActionButtons(buttons);
            this.updateButtonsBoxVisible();
        }

        set content(content: Element | undefined) {
            this.contentBox.content = content;
        }

        get content(): Element | undefined {
            return this.contentBox.firstChild;
        }

        set autoClose(autoClose: boolean) {
            this._autoClose = autoClose;
        }

        protected onCancelPress() {
            this.close();
        }

        protected onFormSubmit() {
            this.defaultAction();
        }
    
        protected onDialogSelectionChange(selection: Ui.Selection) {
            if (selection.elements.length === 0) {
                this.contextBox.hide();
                this.actionBox.show();
            }
            else {
                this.contextBox.show();
                this.actionBox.hide();
            }
            this.updateButtonsBoxVisible();
        }
    
        protected onKeyUp(event) {
            // delete key
            if (event.which === 46) {
                // selection is not empty
                if (this.dialogSelection.elements.length !== 0) {
                    if (this.dialogSelection.executeDeleteAction()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }			
        }

        protected onShadowPress() {
            if (!this.isDisabled && (this._autoClose || this.getStyleProperty('autoClose') == true))
                this.close();
        }
    
        protected onStyleChange(): void {
            this.shadowGraphic.fill = this.getStyleProperty('shadow');
            this.graphic.background = this.getStyleProperty('background');
        }

        invalidateArrange() {
            super.invalidateArrange();
            this.invalidateLayout();
        }

        invalidateMeasure() {
            super.invalidateMeasure();
            this.invalidateLayout();
        }

        protected measureCore(width: number, height: number): Size {
            this.shadowGraphic.measure(width, height);
            let preferredWidth = this._preferredWidth ? this._preferredWidth : width;
            let preferredHeight = this._preferredHeight ? this._preferredHeight : height;
            this.lbox.measure((width < preferredWidth) ? width : preferredWidth,
                (height < preferredHeight) ? height : preferredHeight);
            return { width: width, height: height };
        }

        //
        // Arrange children
        //
        protected arrangeCore(width: number, height: number) {
            // the delayed open animation
            if ((this.openClock !== undefined) && !this.openClock.isActive)
                this.openClock.begin();

            this.shadowGraphic.arrange(0, 0, width, height);

            let usedWidth = Math.min(
                this._preferredWidth ? Math.max(this.lbox.measureWidth, this._preferredWidth) : this.lbox.measureWidth,
                width);

            let usedHeight = Math.min(
                this._preferredHeight ? Math.max(this.lbox.measureHeight, this._preferredHeight) : this.lbox.measureHeight,
                height);

            this.lbox.arrange((width - usedWidth) / 2, (height - usedHeight) / 2, usedWidth, usedHeight);
        }

        static style: object = {
            autoClose: true,
            shadow: 'rgba(0,0,0,0.5)',
            background: '#f8f8f8'
        }
    }
}	

