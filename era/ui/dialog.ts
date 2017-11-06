namespace Ui {

	export interface DialogCloseButtonInit extends ButtonInit { }

	export class DialogCloseButton extends Button implements DialogCloseButtonInit {
	
		constructor(init?: Partial<DialogCloseButtonInit>) {
			super();
			this.icon = 'backarrow';
			this.text = 'Fermer';
			if (init)
				this.assign(init);
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

		private _background: Color = undefined;

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

	export class DialogTitle extends CompactLabel
	{
		static style: object = {
			color: '#666666',
			textAlign: 'left',
			fontWeight: 'bold',
			fontSize: 18,
			maxLine: 2
		}
	}

	export class DialogButtonBox extends LBox
	{
		bg: Rectangle;
		actionBox: HBox;
		cancelButton: Pressable = undefined;
		actionButtonsBox: MenuToolBar;
		titleLabel: DialogTitle;
	
		constructor() {
			super();
			this.addEvents('cancel');

			this.bg = new Rectangle();
			this.append(this.bg);

			this.actionBox = new HBox();
			this.actionBox.margin = 5;
			this.actionBox.spacing = 10;
			this.append(this.actionBox);

			this.actionButtonsBox = new MenuToolBar();
			this.actionButtonsBox.spacing = 5;
			this.actionBox.append(this.actionButtonsBox, true);

			this.titleLabel = new DialogTitle();
			this.titleLabel.width = 50;
			this.titleLabel.verticalAlign = 'center';
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
					this.disconnect(this.cancelButton, 'press', this.onCancelPress);
				this.actionBox.remove(this.cancelButton);
			}
			this.cancelButton = button;
			if (this.cancelButton !== undefined) {
				if (this.cancelButton instanceof Pressable)
					this.connect(this.cancelButton, 'press', this.onCancelPress);
				this.actionBox.prepend(this.cancelButton);
			}
		}

		setActionButtons(buttons) {
			this.actionButtonsBox.setContent(buttons);
			this.actionButtonsBox.prepend(this.titleLabel, true);
		}

		getActionButtons() {
			let buttons = [];
			for (let i = 1; i < this.actionButtonsBox.getLogicalChildren().length; i++)
				buttons.push(this.actionButtonsBox.getLogicalChildren()[i]);
			return buttons;
		}

		onCancelPress() {
			this.fireEvent('cancel', this);
		}

		onStyleChange() {
			this.bg.fill = this.getStyleProperty('background');
		}

		static style: object = {
			background: '#e8e8e8'
		}
	}

	export interface DialogInit extends ContainerInit {
		preferredWidth: number;
		preferredHeight: number;
		fullScrolling: boolean;
		title: string;
		cancelButton: Pressable;
		actionButtons: Pressable[];
		autoClose: boolean;
		content: Element;
	}

	export class Dialog extends Container implements DialogInit {

		dialogSelection: Selection = undefined;
		shadow: Pressable = undefined;
		shadowGraphic: Rectangle = undefined;
		graphic: DialogGraphic = undefined;
		lbox: LBox = undefined;
		vbox: VBox = undefined;
		contentBox: LBox = undefined;
		contentVBox: VBox = undefined;
		private _actionButtons: Pressable[] = undefined;
		private _cancelButton: Pressable = undefined;
		private buttonsBox: LBox = undefined;
		buttonsVisible: boolean = false;
		private _preferredWidth: number = 100;
		private _preferredHeight: number = 100;
		actionBox: DialogButtonBox = undefined;
		contextBox: ContextBar;
		private _autoClose: boolean = true;
		openClock: Anim.Clock = undefined;
		isClosed: boolean = true;
		scroll: ScrollingArea = undefined;

		constructor(init?: Partial<DialogInit>) {
			super();
			this.addEvents('close');

			this.dialogSelection = new Ui.Selection();

			this.shadow = new Ui.Pressable();
			this.shadow.focusable = false;
			this.shadow.drawing.style.cursor = 'inherit';
			this.appendChild(this.shadow);

			this.shadowGraphic = new Ui.Rectangle();
			this.shadow.content = this.shadowGraphic;

			this.lbox = new Ui.Form();
			this.connect(this.lbox, 'submit', this.onFormSubmit);
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
			this.scroll.marginLeft = 2;
			this.scroll.marginTop = 2;
			this.scroll.marginRight = 2;
			this.scroll.scrollHorizontal = false;
			this.scroll.scrollVertical = false;
			this.vbox.append(this.scroll, true);
		
			this.contentVBox = new Ui.VBox();
			this.scroll.content = this.contentVBox;
		
			this.contentBox = new Ui.LBox();
			this.contentBox.margin = 8;
			this.contentVBox.append(this.contentBox, true);

			this.contextBox = new Ui.ContextBar();
			this.contextBox.setSelection(this.dialogSelection);
			this.contextBox.hide();
			this.buttonsBox.append(this.contextBox);

			this.actionBox = new Ui.DialogButtonBox();
			this.connect(this.actionBox, 'cancel', this.close);
			this.buttonsBox.append(this.actionBox);

			this.connect(this.dialogSelection, 'change', this.onDialogSelectionChange);

			// handle keyboard		
			this.connect(this.drawing, 'keydown', this.onKeyDown);

			// handle auto hide
			this.connect(this.shadow, 'press', this.onShadowPress);

			if (init)
				this.assign(init);
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

		open() {
			if (this.isClosed) {
				Ui.App.current.appendDialog(this);
				this.isClosed = false;

				if (this.openClock == undefined) {
					this.openClock = new Anim.Clock({
						duration: 1, target: this, speed: 5,
						ease: new Anim.PowerEase({ mode: 'out' })
					});
					this.connect(this.openClock, 'timeupdate', this.onOpenTick);
					// set the initial state
					this.onOpenTick(this.openClock, 0, 0);
					// the start of the animation is delayed to the next arrange
				}
			}
		}

		close() {
			if (!this.isClosed) {
				// the removal of the dialog is delayed to the end of the animation
				this.fireEvent('close', this);

				this.isClosed = true;
				this.lbox.disable();

				if (this.openClock === undefined) {
					this.openClock = new Anim.Clock({
						duration: 1, target: this, speed: 5,
						ease: new Anim.PowerEase({ mode: 'out' })
					});
					this.connect(this.openClock, 'timeupdate', this.onOpenTick);
					this.openClock.begin();
				}
			}
		}

		onOpenTick(clock, progress, delta) {
			let end = (progress >= 1);

			if (this.isClosed)
				progress = 1 - progress;
			this.shadow.opacity = progress;
			this.lbox.opacity = progress;
			this.lbox.transform = Matrix.createTranslate(0, -20 * (1 - progress));

			if (end) {
				this.openClock.stop();
				this.openClock = undefined;
				if (this.isClosed) {
					Ui.App.current.removeDialog(this);
					this.lbox.enable();
				}
			}
		}

		getDefaultButton() {
			let buttons = this.actionBox.getActionButtons();
			let defaultButton;
			for (let i = 0; (defaultButton === undefined) && (i < buttons.length); i++)
				if (buttons[i] instanceof DefaultButton)
					defaultButton = buttons[i];
			return defaultButton;
		}

		defaultAction() {
			let defaultButton = this.getDefaultButton();
			if (defaultButton !== undefined)
				defaultButton.press();
		}

		set fullScrolling(fullScrolling: boolean) {
			this.scroll.scrollHorizontal = fullScrolling;
			this.scroll.scrollVertical = fullScrolling;
		}

		get title(): string {
			return this.actionBox.getTitle();
		}

		set title(title: string) {
			this.actionBox.setTitle(title);
		}

		updateButtonsBoxVisible() {
			let visible = (this._cancelButton !== undefined) || (this._actionButtons !== undefined) ||
				(this.dialogSelection.getElements().length > 0);
		
			if (!this.buttonsVisible && visible) {
				this.buttonsVisible = true;
				this.buttonsBox.show();
			}
			else if (this.buttonsVisible && !visible) {
				this.buttonsVisible = false;
				this.buttonsBox.hide(true);
			}
		}
	
		set cancelButton(button: Pressable) {
			this._cancelButton = button;
			this.actionBox.setCancelButton(button);
			this.updateButtonsBoxVisible();
		}

		set actionButtons(buttons: Pressable[]) {
			this._actionButtons = buttons;
			this.actionBox.setActionButtons(buttons);
			this.updateButtonsBoxVisible();
		}

		set content(content: Element) {
			this.contentBox.content = content;
		}

		get content(): Element {
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
	
		protected onDialogSelectionChange(selection) {
			if (selection.getElements().length === 0) {
				this.contextBox.hide();
				this.actionBox.show();
			}
			else {
				this.contextBox.show();
				this.actionBox.hide();
			}
			this.updateButtonsBoxVisible();
		}
	
		protected onKeyDown(event) {
			// delete key
			if (event.which === 46) {
				// selection is not empty
				if (this.dialogSelection.getElements().length !== 0) {
					if (this.dialogSelection.executeDeleteAction()) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		}

		protected onShadowPress() {
			if (this._autoClose)
				this.close();
		}
	
		protected onStyleChange(): void {
			this.shadowGraphic.fill = this.getStyleProperty('shadow');
			this.graphic.background = this.getStyleProperty('background');
		}

		protected onChildInvalidateMeasure(child, type) {
			// Ui.Dialog is a layout root and can handle layout (measure/arrange) for its children
			this.invalidateLayout();
		}

		protected onChildInvalidateArrange(child) {
			// Ui.Dialog is a layout root and can handle layout (measure/arrange) for its children
			this.invalidateLayout();
		}

		protected measureCore(width, height) {
			this.shadow.measure(width, height);
			this.lbox.measure((width < this._preferredWidth) ? width : this._preferredWidth,
				(height < this._preferredHeight) ? height : this._preferredHeight);
			return { width: width, height: height };
		}

		//
		// Arrange children
		//
		protected arrangeCore(width: number, height: number) {
			// the delayed open animation
			if ((this.openClock !== undefined) && !this.openClock.isActive)
				this.openClock.begin();

			this.shadow.arrange(0, 0, width, height);
			let usedWidth = Math.max((width < this._preferredWidth) ? width : this._preferredWidth, this.lbox.measureWidth);
			let usedHeight = Math.max((height < this._preferredHeight) ? height : this._preferredHeight, this.lbox.measureHeight);
			this.lbox.arrange((width - usedWidth) / 2, (height - usedHeight) / 2, usedWidth, usedHeight);
		}

		static style: object = {
			shadow: 'rgba(255,255,255,0.1)',
			background: '#f8f8f8'
		}
	}
}	

