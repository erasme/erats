/// <reference path="../../era/era.d.ts" />


namespace Ui {
    export class LightTextToggleButton extends ToggleButton {
        private textPart = new Ui.Label();
        private shortcutPart = new Ui.Label();

        constructor() {
            super();
            this.setTextOrElement(new Ui.HBox().assign({
                spacing: 10,
                content: [
                    this.textPart.assign({
                        resizable: true,
                        horizontalAlign: 'left'
                    }),
                    this.shortcutPart
                ]
            }));
        }

        get text(): string {
            return this.textPart.text;
        }

        set text(value: string) {
            this.textPart.text = value;
        }

        set shortcut(value: string) {
            this.shortcutPart.text = value;
        }

        protected updateColors() {
            super.updateColors();
            let color = this.getForegroundColor();
            this.textPart.color = color;
        }

        onStyleChange() {
            super.onStyleChange();
            let fontSize = this.getStyleProperty('fontSize');
            this.textPart.fontSize = fontSize;
            this.shortcutPart.fontSize = fontSize;
            let color = this.getForegroundColor();
            this.textPart.color = color;
        }

        style = {
            textTransform: 'none',
            borderWidth: 0,
            background: 'rgba(255,255,255,0)',
            activeBackground: 'rgba(255,255,255,0)'
        }
    }

    export class LightTextButton extends Button {
        private textPart = new Ui.Label();
        private shortcutPart = new Ui.Label();

        constructor() {
            super();
            this.setTextOrElement(new Ui.HBox().assign({
                spacing: 10,
                content: [
                    this.textPart.assign({
                        resizable: true,
                        horizontalAlign: 'left'
                    }),
                    this.shortcutPart
                ]
            }));
        }

        get text(): string {
            return this.textPart.text;
        }

        set text(value: string) {
            this.textPart.text = value;
        }

        set shortcut(value: string) {
            this.shortcutPart.text = value;
        }

        protected updateColors() {
            super.updateColors();
            let color = this.getForegroundColor();
            this.textPart.color = color;
        }

        onStyleChange() {
            super.onStyleChange();
            let fontSize = this.getStyleProperty('fontSize');
            this.textPart.fontSize = fontSize;
            this.shortcutPart.fontSize = fontSize;
            let color = this.getForegroundColor();
            this.textPart.color = color;
        }

        style = {
            textTransform: 'none',
            borderWidth: 0,
            background: 'rgba(255,255,255,0)',
            activeBackground: 'rgba(255,255,255,0)'
        }
    }

    export class LightTextEditor extends LBox {
        private _contentEditable: ContentEditable;
        private focusInWatcher: FocusInWatcher;
        private _textHolder = new Ui.Text();
        private bg = new Ui.TextBgGraphic();

        readonly changed = new Core.Events<{ target: LightTextEditor }>();
        set onchanged(value: (event: { target: LightTextEditor }) => void) { this.changed.connect(value); }

        readonly link = new Core.Events<{ target: LightTextEditor, ref: string }>();
        set onlink(value: (event: { target: LightTextEditor, ref: string }) => void) { this.link.connect(value); }

        constructor() {
            super();
            this.focusable = true;

            let allowedTags = ['B', 'I', 'U', 'A', '#text', 'BR'];

            this._contentEditable = new Ui.ContentEditable().assign({
                margin: 10, interLine: 1.2, fontSize: 16,
                html: '', resizable: true,
                onfocused: () => this.bg.hasFocus = true,
                onblurred: () => this.bg.hasFocus = false,
                onchanged: (e) => {
                    ContentEditable.filterHtmlContent(e.element, allowedTags);
                    this.changed.fire({ target: this });
                },
                onlink: (e) => this.link.fire({ target: this, ref: e.ref }),
                selectable: true
            });
            this._contentEditable.drawing.addEventListener('paste', (e) => {
                let selection = window.getSelection();
                if (!selection || !selection.rangeCount)
                    return;

                let text = e.clipboardData?.getData('text');
                let html = e.clipboardData?.getData('text/html');
    
                if (html)
                    document.execCommand('insertHTML', false, ContentEditable.filterHtmlString(html, allowedTags, true));
                else if (text)
                    document.execCommand('insertText', false, text);
                e.preventDefault();
            });
            this._contentEditable.drawing.addEventListener('keydown', (e) => {
                if (e.ctrlKey) {
                    // Ctrl + B
                    if (e.which == 66) {
                        document.execCommand('bold', false);
                        e.stopPropagation(); e.preventDefault();
                    }
                    // Ctrl + I
                    else if (e.which == 73) {
                        document.execCommand('italic', false);
                        e.stopPropagation(); e.preventDefault();
                    }
                    // Ctrl + U
                    else if (e.which == 85) {
                        document.execCommand('underline', false);
                        e.stopPropagation(); e.preventDefault();
                    }
                }
            }, { capture: true });

            new Ui.ContextMenuWatcher({
                element: this._contentEditable,
                press: (e) => {
                    let selection = window.getSelection();
                    if (!selection)
                        return;

                    let link = this._contentEditable.findTag('A');
                    if (link) {
                        let popup = new Ui.Popup();
                        popup.assign({
                            content: new Ui.VBox().assign({
                                content: [
                                    new LightTextButton().assign({
                                        text: 'Visiter le lien',
                                        onpressed: () => {
                                            popup.close();
                                            let a = link as HTMLLinkElement;
                                            window.open(a.href, '_blank');
                                        }
                                    }),
                                    new LightTextButton().assign({
                                        text: 'Editer le lien',
                                        onpressed: () => {
                                            popup.close();
                                            let a = link! as HTMLLinkElement;
                                            let urlField = new Ui.TextField();
                                            let dialog = new Ui.Dialog().assign({
                                                modal: false,
                                                title: 'URL du lien',
                                                actionButtons: [
                                                    new DefaultButton().assign({
                                                        text: 'Enregistrer',
                                                        onpressed: () => {
                                                            dialog.close();
                                                            a.href = urlField.value;
                                                        }
                                                    })
                                                ],
                                                content: urlField.assign({ value: a.href }),
                                            });
                                            dialog.open();
            
                                        }
                                    }),
                                    new LightTextButton().assign({
                                        text: 'Supprimer le lien',
                                        onpressed: () =>  {
                                            popup.close();
                                            ContentEditable.unwrapNode(link!);
                                        }
                                    })
                                ]
                            })
                        }).openAt(e.x!, e.y!);
                    }
                    else {
                        let vbox = new Ui.VBox();

                        let popup = new Ui.MenuPopup().assign({
                            modal: false,
                            content: vbox.assign({
                                content: [
                                    new LightTextToggleButton().assign({
                                        isActive: document.queryCommandState('bold'),
                                        icon: 'format-bold',
                                        text: 'Gras', shortcut: 'Ctrl+B',
                                        focusable: false,
                                        ontoggled: async () => {
                                            popup.close();
                                            document.execCommand('bold', false)
                                        },
                                        onuntoggled: () => {
                                            popup.close();
                                            document.execCommand('bold', false);
                                        }
                                    }),
                                    new LightTextToggleButton().assign({
                                        isActive: document.queryCommandState('italic'),
                                        icon: 'format-italic',
                                        text: 'Italic', shortcut: 'Ctrl+I',
                                        focusable: false,
                                        ontoggled: () => {
                                            popup.close();
                                            document.execCommand('italic', false);
                                        },
                                        onuntoggled: () => {
                                            popup.close();
                                            document.execCommand('italic', false);
                                        }
                                    }),
                                    new LightTextToggleButton().assign({
                                        isActive: document.queryCommandState('underline'),
                                        icon: 'format-underline',
                                        text: 'Souligné', shortcut: 'Ctrl+U',
                                        focusable: false,
                                        ontoggled: () => {
                                            popup.close();
                                            document.execCommand('underline', false);
                                        },
                                        onuntoggled: () => {
                                            popup.close();
                                            document.execCommand('underline', false);
                                        }
                                    }),
                                ]
                            })
                        });

                        vbox.append(new LightTextButton().assign({
                            icon: 'format-insert-url',
                            text: 'Insérer un lien',
                            focusable: false,
                            onpressed: () => {
                                ContentEditable.saveSelection();
                                let selection = window.getSelection();
                                let range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;
                                popup.close();
                                let urlField = new Ui.TextField();
                                let dialog = new Ui.Dialog().assign({
                                    modal: false,
                                    title: 'URL du lien',
                                    actionButtons: [
                                        new DefaultButton().assign({
                                            text: 'Insérer',
                                            onpressed: () => {
                                                dialog.close();
                                                if (selection && selection.type == 'Caret') {
                                                    let a = document.createElement('a');
                                                    a.href = urlField.value;
                                                    a.innerText = urlField.value;
                                                    document.execCommand('insertHTML', false, a.outerHTML);
                                                }
                                                else
                                                    document.execCommand('createLink', false, urlField.value);
                                            }
                                        })
                                    ],
                                    content: urlField,
                                    onclosed: () => ContentEditable.restoreSelection(range)
                                });
                                dialog.open();
                            }
                        }));

                        popup.openAt(e.x!, e.y!);
                    }
                }
            })

            this.focusInWatcher = new FocusInWatcher({
                element: this,
                onfocusin: () => {
                    this._textHolder.hide();
                    // user BR when Enter is pressed
                    document.execCommand('defaultParagraphSeparator', false, 'br');
                },
                onfocusout: () => {
                    this.showHideTextHolder();
                }
            });

            this.content = [
                this.bg,
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

        get color(): Color | string | undefined {
            return this._contentEditable.color;
        }

        set color(color: Color | string | undefined) {
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
    }
}

class App extends Ui.App {
    constructor() {
        super();
        this.content = new Ui.VBox().assign({
            content: [
                new Ui.Text().assign({ text: 'Un texte super sympa', selectable: true, margin: 50 }),
                new Ui.LightTextEditor().assign({
                    margin: 50, fontSize: 20, resizable: true,
                    onlink: (e) => window.open(e.ref, '_blank')
                })
            ]
        })
    }
}

new App();