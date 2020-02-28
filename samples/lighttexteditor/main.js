"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Ui;
(function (Ui) {
    var LightTextToggleButton = /** @class */ (function (_super) {
        __extends(LightTextToggleButton, _super);
        function LightTextToggleButton() {
            var _this = _super.call(this) || this;
            _this.textPart = new Ui.Label();
            _this.shortcutPart = new Ui.Label();
            _this.style = {
                textTransform: 'none',
                borderWidth: 0,
                background: 'rgba(255,255,255,0)',
                activeBackground: 'rgba(255,255,255,0)'
            };
            _this.setTextOrElement(new Ui.HBox().assign({
                spacing: 10,
                content: [
                    _this.textPart.assign({
                        resizable: true,
                        horizontalAlign: 'left'
                    }),
                    _this.shortcutPart
                ]
            }));
            return _this;
        }
        Object.defineProperty(LightTextToggleButton.prototype, "text", {
            get: function () {
                return this.textPart.text;
            },
            set: function (value) {
                this.textPart.text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextToggleButton.prototype, "shortcut", {
            set: function (value) {
                this.shortcutPart.text = value;
            },
            enumerable: true,
            configurable: true
        });
        LightTextToggleButton.prototype.updateColors = function () {
            _super.prototype.updateColors.call(this);
            var color = this.getForegroundColor();
            this.textPart.color = color;
        };
        LightTextToggleButton.prototype.onStyleChange = function () {
            _super.prototype.onStyleChange.call(this);
            var fontSize = this.getStyleProperty('fontSize');
            this.textPart.fontSize = fontSize;
            this.shortcutPart.fontSize = fontSize;
            var color = this.getForegroundColor();
            this.textPart.color = color;
        };
        return LightTextToggleButton;
    }(Ui.ToggleButton));
    Ui.LightTextToggleButton = LightTextToggleButton;
    var LightTextButton = /** @class */ (function (_super) {
        __extends(LightTextButton, _super);
        function LightTextButton() {
            var _this = _super.call(this) || this;
            _this.textPart = new Ui.Label();
            _this.shortcutPart = new Ui.Label();
            _this.style = {
                textTransform: 'none',
                borderWidth: 0,
                background: 'rgba(255,255,255,0)',
                activeBackground: 'rgba(255,255,255,0)'
            };
            _this.setTextOrElement(new Ui.HBox().assign({
                spacing: 10,
                content: [
                    _this.textPart.assign({
                        resizable: true,
                        horizontalAlign: 'left'
                    }),
                    _this.shortcutPart
                ]
            }));
            return _this;
        }
        Object.defineProperty(LightTextButton.prototype, "text", {
            get: function () {
                return this.textPart.text;
            },
            set: function (value) {
                this.textPart.text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextButton.prototype, "shortcut", {
            set: function (value) {
                this.shortcutPart.text = value;
            },
            enumerable: true,
            configurable: true
        });
        LightTextButton.prototype.updateColors = function () {
            _super.prototype.updateColors.call(this);
            var color = this.getForegroundColor();
            this.textPart.color = color;
        };
        LightTextButton.prototype.onStyleChange = function () {
            _super.prototype.onStyleChange.call(this);
            var fontSize = this.getStyleProperty('fontSize');
            this.textPart.fontSize = fontSize;
            this.shortcutPart.fontSize = fontSize;
            var color = this.getForegroundColor();
            this.textPart.color = color;
        };
        return LightTextButton;
    }(Ui.Button));
    Ui.LightTextButton = LightTextButton;
    var LightTextEditor = /** @class */ (function (_super) {
        __extends(LightTextEditor, _super);
        function LightTextEditor() {
            var _this = _super.call(this) || this;
            _this._textHolder = new Ui.Text();
            _this.bg = new Ui.TextBgGraphic();
            _this.changed = new Core.Events();
            _this.link = new Core.Events();
            _this.focusable = true;
            var allowedTags = ['B', 'I', 'U', 'A', '#text', 'BR'];
            _this._contentEditable = new Ui.ContentEditable().assign({
                margin: 10, interLine: 1.2, fontSize: 16,
                html: '', resizable: true,
                onfocused: function () { return _this.bg.hasFocus = true; },
                onblurred: function () { return _this.bg.hasFocus = false; },
                onchanged: function (e) {
                    Ui.ContentEditable.filterHtmlContent(e.element, allowedTags);
                    _this.changed.fire({ target: _this });
                },
                onlink: function (e) { return _this.link.fire({ target: _this, ref: e.ref }); },
                selectable: true
            });
            _this._contentEditable.drawing.addEventListener('paste', function (e) {
                var _a, _b;
                var selection = window.getSelection();
                if (!selection || !selection.rangeCount)
                    return;
                var text = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text');
                var html = (_b = e.clipboardData) === null || _b === void 0 ? void 0 : _b.getData('text/html');
                if (html)
                    document.execCommand('insertHTML', false, Ui.ContentEditable.filterHtmlString(html, allowedTags, true));
                else if (text)
                    document.execCommand('insertText', false, text);
                e.preventDefault();
            });
            _this._contentEditable.drawing.addEventListener('keydown', function (e) {
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
                element: _this._contentEditable,
                press: function (e) {
                    var selection = window.getSelection();
                    if (!selection)
                        return;
                    var link = _this._contentEditable.findTag('A');
                    if (link) {
                        var popup_1 = new Ui.Popup();
                        popup_1.assign({
                            content: new Ui.VBox().assign({
                                content: [
                                    new LightTextButton().assign({
                                        text: 'Visiter le lien',
                                        onpressed: function () {
                                            popup_1.close();
                                            var a = link;
                                            window.open(a.href, '_blank');
                                        }
                                    }),
                                    new LightTextButton().assign({
                                        text: 'Editer le lien',
                                        onpressed: function () {
                                            popup_1.close();
                                            var a = link;
                                            var urlField = new Ui.TextField();
                                            var dialog = new Ui.Dialog().assign({
                                                modal: false,
                                                title: 'URL du lien',
                                                actionButtons: [
                                                    new Ui.DefaultButton().assign({
                                                        text: 'Enregistrer',
                                                        onpressed: function () {
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
                                        onpressed: function () {
                                            popup_1.close();
                                            Ui.ContentEditable.unwrapNode(link);
                                        }
                                    })
                                ]
                            })
                        }).openAt(e.x, e.y);
                    }
                    else {
                        var vbox = new Ui.VBox();
                        var popup_2 = new Ui.MenuPopup().assign({
                            modal: false,
                            content: vbox.assign({
                                content: [
                                    new LightTextToggleButton().assign({
                                        isActive: document.queryCommandState('bold'),
                                        icon: 'format-bold',
                                        text: 'Gras', shortcut: 'Ctrl+B',
                                        focusable: false,
                                        ontoggled: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                popup_2.close();
                                                document.execCommand('bold', false);
                                                return [2 /*return*/];
                                            });
                                        }); },
                                        onuntoggled: function () {
                                            popup_2.close();
                                            document.execCommand('bold', false);
                                        }
                                    }),
                                    new LightTextToggleButton().assign({
                                        isActive: document.queryCommandState('italic'),
                                        icon: 'format-italic',
                                        text: 'Italic', shortcut: 'Ctrl+I',
                                        focusable: false,
                                        ontoggled: function () {
                                            popup_2.close();
                                            document.execCommand('italic', false);
                                        },
                                        onuntoggled: function () {
                                            popup_2.close();
                                            document.execCommand('italic', false);
                                        }
                                    }),
                                    new LightTextToggleButton().assign({
                                        isActive: document.queryCommandState('underline'),
                                        icon: 'format-underline',
                                        text: 'Souligné', shortcut: 'Ctrl+U',
                                        focusable: false,
                                        ontoggled: function () {
                                            popup_2.close();
                                            document.execCommand('underline', false);
                                        },
                                        onuntoggled: function () {
                                            popup_2.close();
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
                            onpressed: function () {
                                Ui.ContentEditable.saveSelection();
                                var selection = window.getSelection();
                                var range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;
                                popup_2.close();
                                var urlField = new Ui.TextField();
                                var dialog = new Ui.Dialog().assign({
                                    modal: false,
                                    title: 'URL du lien',
                                    actionButtons: [
                                        new Ui.DefaultButton().assign({
                                            text: 'Insérer',
                                            onpressed: function () {
                                                dialog.close();
                                                if (selection && selection.type == 'Caret') {
                                                    var a = document.createElement('a');
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
                                    onclosed: function () { return Ui.ContentEditable.restoreSelection(range); }
                                });
                                dialog.open();
                            }
                        }));
                        popup_2.openAt(e.x, e.y);
                    }
                }
            });
            _this.focusInWatcher = new Ui.FocusInWatcher({
                element: _this,
                onfocusin: function () {
                    _this._textHolder.hide();
                    // user BR when Enter is pressed
                    document.execCommand('defaultParagraphSeparator', false, 'br');
                },
                onfocusout: function () {
                    _this.showHideTextHolder();
                }
            });
            _this.content = [
                _this.bg,
                new Ui.LBox().assign({
                    resizable: true,
                    content: [
                        _this._textHolder.assign({
                            textAlign: 'center',
                            verticalAlign: 'center',
                            opacity: 0.6
                        }),
                        _this._contentEditable
                    ]
                })
            ];
            return _this;
        }
        Object.defineProperty(LightTextEditor.prototype, "onchanged", {
            set: function (value) { this.changed.connect(value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "onlink", {
            set: function (value) { this.link.connect(value); },
            enumerable: true,
            configurable: true
        });
        LightTextEditor.prototype.showHideTextHolder = function () {
            if (this.textHolder && this.textHolder != '' && (this.html == '' || this.html == '<br>') && !this.focusInWatcher.isFocusIn)
                this._textHolder.show();
            else
                this._textHolder.hide();
        };
        Object.defineProperty(LightTextEditor.prototype, "html", {
            get: function () {
                return this._contentEditable.html;
            },
            set: function (html) {
                this._contentEditable.html = html;
                this.showHideTextHolder();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "text", {
            get: function () {
                return this._contentEditable.text;
            },
            set: function (text) {
                this._contentEditable.text = text;
                this.showHideTextHolder();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "textAlign", {
            get: function () {
                return this._contentEditable.textAlign;
            },
            set: function (textAlign) {
                this._contentEditable.textAlign = textAlign;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "fontSize", {
            get: function () {
                return this._contentEditable.fontSize;
            },
            set: function (fontSize) {
                this._contentEditable.fontSize = fontSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "fontFamily", {
            get: function () {
                return this._contentEditable.fontFamily;
            },
            set: function (fontFamily) {
                this._contentEditable.fontFamily = fontFamily;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "fontWeight", {
            get: function () {
                return this._contentEditable.fontWeight;
            },
            set: function (fontWeight) {
                this._contentEditable.fontWeight = fontWeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "interLine", {
            get: function () {
                return this._contentEditable.interLine;
            },
            set: function (interLine) {
                this._contentEditable.interLine = interLine;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "wordWrap", {
            get: function () {
                return this._contentEditable.wordWrap;
            },
            set: function (wordWrap) {
                this._contentEditable.wordWrap = wordWrap;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "whiteSpace", {
            get: function () {
                return this._contentEditable.whiteSpace;
            },
            set: function (whiteSpace) {
                this._contentEditable.whiteSpace = whiteSpace;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "color", {
            get: function () {
                return this._contentEditable.color;
            },
            set: function (color) {
                this._contentEditable.color = color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "textHolder", {
            get: function () {
                return this._textHolder.text;
            },
            set: function (value) {
                this._textHolder.text = value;
                this.showHideTextHolder();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightTextEditor.prototype, "isBackgroundVisible", {
            get: function () {
                return this.bg.isVisible;
            },
            set: function (value) {
                this.bg.isVisible = value;
            },
            enumerable: true,
            configurable: true
        });
        return LightTextEditor;
    }(Ui.LBox));
    Ui.LightTextEditor = LightTextEditor;
})(Ui || (Ui = {}));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.content = new Ui.VBox().assign({
            content: [
                new Ui.Text().assign({ text: 'Un texte super sympa', selectable: true, margin: 50 }),
                new Ui.LightTextEditor().assign({
                    margin: 50, fontSize: 20, resizable: true,
                    onlink: function (e) { return window.open(e.ref, '_blank'); }
                })
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
//# sourceMappingURL=main.js.map