"use strict";
/// <reference path="../../era/era.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Ui;
(function (Ui) {
    class LightTextToggleButton extends Ui.ToggleButton {
        constructor() {
            super();
            this.textPart = new Ui.Label();
            this.shortcutPart = new Ui.Label();
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
        get text() {
            return this.textPart.text;
        }
        set text(value) {
            this.textPart.text = value;
        }
        set shortcut(value) {
            this.shortcutPart.text = value;
        }
        updateColors() {
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
    }
    LightTextToggleButton.style = {
        textTransform: 'none',
        borderWidth: 0,
        background: 'rgba(255,255,255,0)',
        activeBackground: 'rgba(255,255,255,0)'
    };
    Ui.LightTextToggleButton = LightTextToggleButton;
    class LightTextButton extends Ui.Button {
        constructor() {
            super();
            this.textPart = new Ui.Label();
            this.shortcutPart = new Ui.Label();
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
        get text() {
            return this.textPart.text;
        }
        set text(value) {
            this.textPart.text = value;
        }
        set shortcut(value) {
            this.shortcutPart.text = value;
        }
        updateColors() {
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
    }
    LightTextButton.style = {
        textTransform: 'none',
        borderWidth: 0,
        background: 'rgba(255,255,255,0)',
        activeBackground: 'rgba(255,255,255,0)'
    };
    Ui.LightTextButton = LightTextButton;
    class LightTextEditor extends Ui.LBox {
        constructor() {
            super();
            this._textHolder = new Ui.Text();
            this.bg = new Ui.TextBgGraphic();
            this.changed = new Core.Events();
            this.link = new Core.Events();
            this.focusable = true;
            let allowedTags = ['B', 'I', 'U', 'A', '#text', 'BR'];
            this._contentEditable = new Ui.ContentEditable().assign({
                margin: 10, interLine: 1.2, fontSize: 16,
                html: '', resizable: true,
                onfocused: () => this.bg.hasFocus = true,
                onblurred: () => this.bg.hasFocus = false,
                onchanged: (e) => {
                    Ui.ContentEditable.filterHtmlContent(e.element, allowedTags);
                    this.changed.fire({ target: this });
                },
                onlink: (e) => this.link.fire({ target: this, ref: e.ref }),
                selectable: true
            });
            this._contentEditable.drawing.addEventListener('paste', (e) => {
                var _a, _b;
                let selection = window.getSelection();
                if (!selection || !selection.rangeCount)
                    return;
                let text = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text');
                let html = (_b = e.clipboardData) === null || _b === void 0 ? void 0 : _b.getData('text/html');
                if (html)
                    document.execCommand('insertHTML', false, Ui.ContentEditable.filterHtmlString(html, allowedTags, true));
                else if (text)
                    document.execCommand('insertText', false, text);
                e.preventDefault();
            });
            this._contentEditable.drawing.addEventListener('keydown', (e) => {
                if (e.ctrlKey) {
                    // Ctrl + B
                    if (e.which == 66) {
                        document.execCommand('bold', false);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    // Ctrl + I
                    else if (e.which == 73) {
                        document.execCommand('italic', false);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    // Ctrl + U
                    else if (e.which == 85) {
                        document.execCommand('underline', false);
                        e.stopPropagation();
                        e.preventDefault();
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
                                            let a = link;
                                            window.open(a.href, '_blank');
                                        }
                                    }),
                                    new LightTextButton().assign({
                                        text: 'Editer le lien',
                                        onpressed: () => {
                                            popup.close();
                                            let a = link;
                                            let urlField = new Ui.TextField();
                                            let dialog = new Ui.Dialog().assign({
                                                modal: false,
                                                title: 'URL du lien',
                                                actionButtons: [
                                                    new Ui.DefaultButton().assign({
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
                                        onpressed: () => {
                                            popup.close();
                                            Ui.ContentEditable.unwrapNode(link);
                                        }
                                    })
                                ]
                            })
                        }).openAt(e.x, e.y);
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
                                        ontoggled: () => __awaiter(this, void 0, void 0, function* () {
                                            popup.close();
                                            document.execCommand('bold', false);
                                        }),
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
                                Ui.ContentEditable.saveSelection();
                                let selection = window.getSelection();
                                let range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;
                                popup.close();
                                let urlField = new Ui.TextField();
                                let dialog = new Ui.Dialog().assign({
                                    modal: false,
                                    title: 'URL du lien',
                                    actionButtons: [
                                        new Ui.DefaultButton().assign({
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
                                    onclosed: () => Ui.ContentEditable.restoreSelection(range)
                                });
                                dialog.open();
                            }
                        }));
                        popup.openAt(e.x, e.y);
                    }
                }
            });
            this.focusInWatcher = new Ui.FocusInWatcher({
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
        set onchanged(value) { this.changed.connect(value); }
        set onlink(value) { this.link.connect(value); }
        showHideTextHolder() {
            if (this.textHolder && this.textHolder != '' && (this.html == '' || this.html == '<br>') && !this.focusInWatcher.isFocusIn)
                this._textHolder.show();
            else
                this._textHolder.hide();
        }
        get html() {
            return this._contentEditable.html;
        }
        set html(html) {
            this._contentEditable.html = html;
            this.showHideTextHolder();
        }
        get text() {
            return this._contentEditable.text;
        }
        set text(text) {
            this._contentEditable.text = text;
            this.showHideTextHolder();
        }
        get textAlign() {
            return this._contentEditable.textAlign;
        }
        set textAlign(textAlign) {
            this._contentEditable.textAlign = textAlign;
        }
        get fontSize() {
            return this._contentEditable.fontSize;
        }
        set fontSize(fontSize) {
            this._contentEditable.fontSize = fontSize;
        }
        get fontFamily() {
            return this._contentEditable.fontFamily;
        }
        set fontFamily(fontFamily) {
            this._contentEditable.fontFamily = fontFamily;
        }
        get fontWeight() {
            return this._contentEditable.fontWeight;
        }
        set fontWeight(fontWeight) {
            this._contentEditable.fontWeight = fontWeight;
        }
        get interLine() {
            return this._contentEditable.interLine;
        }
        set interLine(interLine) {
            this._contentEditable.interLine = interLine;
        }
        get wordWrap() {
            return this._contentEditable.wordWrap;
        }
        set wordWrap(wordWrap) {
            this._contentEditable.wordWrap = wordWrap;
        }
        get whiteSpace() {
            return this._contentEditable.whiteSpace;
        }
        set whiteSpace(whiteSpace) {
            this._contentEditable.whiteSpace = whiteSpace;
        }
        get color() {
            return this._contentEditable.color;
        }
        set color(color) {
            this._contentEditable.color = color;
        }
        get textHolder() {
            return this._textHolder.text;
        }
        set textHolder(value) {
            this._textHolder.text = value;
            this.showHideTextHolder();
        }
        get isBackgroundVisible() {
            return this.bg.isVisible;
        }
        set isBackgroundVisible(value) {
            this.bg.isVisible = value;
        }
    }
    Ui.LightTextEditor = LightTextEditor;
})(Ui || (Ui = {}));
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
        });
    }
}
new App();
//# sourceMappingURL=main.js.map