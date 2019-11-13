namespace Ui {
    export class RichTextButton extends ToggleButton {
        style = {
            borderWidth: 0,
            background: 'rgba(255,255,255,0)',
            activeBackground: 'rgba(255,255,255,0)'
        }
    }

    export class RichTextEditor extends LBox {
        private _contentEditable: ContentEditable;
        private _autoHideControls = false;
        private controlsBox = new Ui.LBox();
        private focusInWatcher: FocusInWatcher;
        private _textHolder = new Ui.Text();
        private bg = new Ui.TextBgGraphic();

        constructor() {
            super();
            this.focusable = true;
            let boldButton = new RichTextButton().assign({
                icon: 'format-bold', focusable: false,
                ontoggled: () => document.execCommand('bold', false, null),
                onuntoggled: () => document.execCommand('bold', false, null)
            });
            let italicButton = new RichTextButton().assign({
                icon: 'format-italic', focusable: false,
                ontoggled: () => document.execCommand('italic', false, null),
                onuntoggled: () => document.execCommand('italic', false, null)
            });
            let underlineButton = new RichTextButton().assign({
                icon: 'format-underline', focusable: false,
                ontoggled: () => document.execCommand('underline', false, null),
                onuntoggled: () => document.execCommand('underline', false, null)
            });
            let alignLeftButton = new RichTextButton().assign({
                icon: 'format-align-left', focusable: false,
                ontoggled: () => document.execCommand('justifyLeft', false, null),
                onuntoggled: () => document.execCommand('justifyLeft', false, null)
            });
            let alignCenterButton = new RichTextButton().assign({
                icon: 'format-align-center', focusable: false,
                ontoggled: () => document.execCommand('justifyCenter', false, null),
                onuntoggled: () => document.execCommand('justifyCenter', false, null)
            });
            let alignRightButton = new RichTextButton().assign({
                icon: 'format-align-right', focusable: false,
                ontoggled: () => document.execCommand('justifyRight', false, null),
                onuntoggled: () => document.execCommand('justifyRight', false, null)
            });
            let insertOrderedListButton = new RichTextButton().assign({
                icon: 'format-insert-ordered-list', focusable: false,
                ontoggled: () => document.execCommand('insertOrderedList', false, null),
                onuntoggled: () => document.execCommand('insertOrderedList', false, null)
            });
            let insertUnorderedListButton = new RichTextButton().assign({
                icon: 'format-insert-unordered-list', focusable: false,
                ontoggled: () => document.execCommand('insertUnorderedList', false, null),
                onuntoggled: () => document.execCommand('insertUnorderedList', false, null)
            });
            let insertImageButton = new Button().assign({
                icon: 'format-insert-image', focusable: false,
                style: {
                    borderWidth: 0,
                    background: 'rgba(255,255,255,0)',
                    activeBackground: 'rgba(255,255,255,0)'
                },
                onpressed: () => {
                    const url = window.prompt("URL de l'image à insérer :");
                    if ( url ) {
                        document.execCommand('insertImage', false, url);
                    }
                }
            });
            let insertURLButton = new Button().assign({
                icon: 'format-insert-url', focusable: false,
                style: {
                    borderWidth: 0,
                    background: 'rgba(255,255,255,0)',
                    activeBackground: 'rgba(255,255,255,0)'
                },
                onpressed: () => {
                    const url = window.prompt("URL à insérer :");
                    if ( url ) {
                        document.execCommand('createLink', false, url);
                    }
                }
            });
            let quoteButton = new Button().assign({
                icon: 'format-quote', focusable: false,
                style: {
                    borderWidth: 0,
                    background: 'rgba(255,255,255,0)',
                    activeBackground: 'rgba(255,255,255,0)'
                },
                onpressed: () => {
                    document.execCommand('formatBlock', false, '<blockquote>');
                }
            });

            let controls = new Ui.HBox().assign({
                uniform: true, isDisabled: false,
                content: [
                    boldButton,
                    italicButton,
                    underlineButton,
                    quoteButton,
                    alignLeftButton,
                    alignCenterButton,
                    alignRightButton,
                    insertOrderedListButton,
                    insertUnorderedListButton,
                    insertImageButton,
                    insertURLButton
                ]
            });

            this._contentEditable = new Ui.ContentEditable().assign({
                margin: 10, interLine: 1.2, fontSize: 16,
                html: '', resizable: true,
                onfocused: () => this.bg.hasFocus = true,
                onblurred: () => this.bg.hasFocus = false,
                onanchorchanged: () => {
                    boldButton.isActive = document.queryCommandState('bold');
                    italicButton.isActive = document.queryCommandState('italic');
                    underlineButton.isActive = document.queryCommandState('underline');
                    alignLeftButton.isActive = document.queryCommandState('justifyLeft');
                    alignCenterButton.isActive = document.queryCommandState('justifyCenter');
                    alignRightButton.isActive = document.queryCommandState('justifyRight');
                },
                onselectionentered: () => {
                    controls.enable();
                    this.controlsBox.show();
                },
                onselectionleaved: () => {
                },
                selectable: true
            });

            this.focusInWatcher = new FocusInWatcher({
                element: this,
                onfocusin: () => {
                    controls.enable();
                    this.controlsBox.show();
                    this._textHolder.hide();
                },
                onfocusout: () => {
                    controls.disable();
                    if (this.autoHideControls)
                        this.controlsBox.hide(true);
                    this.showHideTextHolder();
                }
            });

            this.content = [
                this.bg,
                new Ui.VBox().assign({
                    margin: 1,
                    content: [
                        this.controlsBox.assign({
                            content: [
                                new Ui.Rectangle().assign({ fill: 'white', opacity: 0.6 }),
                                controls
                            ]
                        }),
                        new Ui.LBox().assign({
                            resizable: true,
                            content: [
                                this._textHolder.assign({
                                    textAlign: 'center',
                                    verticalAlign: 'center',
                                    opacity: 0.6
                                }),
                                this._contentEditable
                            ]
                        })
                    ]
                })
            ];
        }

        private showHideTextHolder() {
            if (this.textHolder && this.textHolder != '' && (this.html == '' || this.html == '<br>') && !this.focusInWatcher.isFocusIn)
                this._textHolder.show();
            else
                this._textHolder.hide();
        }

        get html(): string {
            return this._contentEditable.html;
        }

        set html(html: string) {
            this._contentEditable.html = html;
            this.showHideTextHolder();
        }

        get text(): string {
            return this._contentEditable.text;
        }

        set text(text: string) {
            this._contentEditable.text = text;
            this.showHideTextHolder();
        }

        get textAlign(): TextAlign {
            return this._contentEditable.textAlign;
        }

        set textAlign(textAlign: TextAlign) {
            this._contentEditable.textAlign = textAlign;
        }

        get fontSize(): number {
            return this._contentEditable.fontSize;
        }

        set fontSize(fontSize: number) {
            this._contentEditable.fontSize = fontSize;
        }

        get fontFamily(): string {
            return this._contentEditable.fontFamily;
        }

        set fontFamily(fontFamily: string) {
            this._contentEditable.fontFamily = fontFamily;
        }

        get fontWeight() {
            return this._contentEditable.fontWeight;
        }

        set fontWeight(fontWeight) {
            this._contentEditable.fontWeight = fontWeight;
        }

        get interLine(): number {
            return this._contentEditable.interLine;
        }

        set interLine(interLine: number) {
            this._contentEditable.interLine = interLine;
        }

        get wordWrap(): string {
            return this._contentEditable.wordWrap;
        }

        set wordWrap(wordWrap: string) {
            this._contentEditable.wordWrap = wordWrap;
        }

        get whiteSpace(): string {
            return this._contentEditable.whiteSpace;
        }

        set whiteSpace(whiteSpace: string) {
            this._contentEditable.whiteSpace = whiteSpace;
        }

        get color(): Color | string {
            return this._contentEditable.color;
        }

        set color(color: Color | string) {
            this._contentEditable.color = color;
        }

        get textHolder(): string {
            return this._textHolder.text;
        }

        set textHolder(value: string) {
            this._textHolder.text = value;
            this.showHideTextHolder();
        }

        get isBackgroundVisible(): boolean {
            return this.bg.isVisible;
        }

        set isBackgroundVisible(value: boolean) {
            this.bg.isVisible = value;
        }

        get autoHideControls(): boolean {
            return this._autoHideControls;
        }

        set autoHideControls(value: boolean) {
            if (this._autoHideControls != value) {
                this._autoHideControls = value;
                if (!this.focusInWatcher.isFocusIn && value)
                    this.controlsBox.hide(true);
                else if (!value)
                    this.controlsBox.show();
            }
        }
    }
}

Ui.Icon.register('format-bold', "M31.2 21.58c1.93-1.35 3.3-3.53 3.3-5.58 0-4.51-3.49-8-8-8h-12.5v28h14.08c4.19 0 7.42-3.4 7.42-7.58 0-3.04-1.73-5.63-4.3-6.84zm-11.2-8.58h6c1.66 0 3 1.34 3 3s-1.34 3-3 3h-6v-6zm7 18h-7v-6h7c1.66 0 3 1.34 3 3s-1.34 3-3 3z");
Ui.Icon.register('format-italic', "M20 8v6h4.43l-6.86 16h-5.57v6h16v-6h-4.43l6.86-16h5.57v-6z");
Ui.Icon.register('format-underline', "M24 34c6.63 0 12-5.37 12-12v-16h-5v16c0 3.87-3.13 7-7 7s-7-3.13-7-7v-16h-5v16c0 6.63 5.37 12 12 12zm-14 4v4h28v-4h-28z");
Ui.Icon.register('format-align-left', "M30 30h-24v4h24v-4zm0-16h-24v4h24v-4zm-24 12h36v-4h-36v4zm0 16h36v-4h-36v4zm0-36v4h36v-4h-36z");
Ui.Icon.register('format-align-right', "M6 42h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-8h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-12v4h36v-4h-36z");
Ui.Icon.register('format-align-center', "M14 30v4h20v-4h-20zm-8 12h36v-4h-36v4zm0-16h36v-4h-36v4zm8-12v4h20v-4h-20zm-8-8v4h36v-4h-36z");
Ui.Icon.register('format-insert-ordered-list', "M4 34h4v1h-2v2h2v1h-4v2h6v-8h-6v2zm2-18h2v-8h-4v2h2v6zm-2 6h3.6l-3.6 4.2v1.8h6v-2h-3.6l3.6-4.2v-1.8h-6v2zm10-12v4h28v-4h-28zm0 28h28v-4h-28v4zm0-12h28v-4h-28v4z");
Ui.Icon.register('format-insert-unordered-list', "M8 21c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0-12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 24.33c-1.47 0-2.67 1.19-2.67 2.67s1.2 2.67 2.67 2.67 2.67-1.19 2.67-2.67-1.2-2.67-2.67-2.67zm6 4.67h28v-4h-28v4zm0-12h28v-4h-28v4zm0-16v4h28v-4h-28z");
Ui.Icon.register('format-insert-image', "M42 38v-28c0-2.21-1.79-4-4-4h-28c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4zm-25-11l5 6.01 7-9.01 9 12h-28l7-9z");
Ui.Icon.register('format-insert-url', "M7.8 24c0-3.42 2.78-6.2 6.2-6.2h8v-3.8h-8c-5.52 0-10 4.48-10 10s4.48 10 10 10h8v-3.8h-8c-3.42 0-6.2-2.78-6.2-6.2zm8.2 2h16v-4h-16v4zm18-12h-8v3.8h8c3.42 0 6.2 2.78 6.2 6.2s-2.78 6.2-6.2 6.2h-8v3.8h8c5.52 0 10-4.48 10-10s-4.48-10-10-10z");
Ui.Icon.register('format-quote', "M12 34h6l4-8v-12h-12v12h6zm16 0h6l4-8v-12h-12v12h6z");
