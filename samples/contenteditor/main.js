"use strict";
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
/// <reference path="../../era/era.d.ts" />
/*
Ui.Icon.register('format-bold', "M31.2 21.58c1.93-1.35 3.3-3.53 3.3-5.58 0-4.51-3.49-8-8-8h-12.5v28h14.08c4.19 0 7.42-3.4 7.42-7.58 0-3.04-1.73-5.63-4.3-6.84zm-11.2-8.58h6c1.66 0 3 1.34 3 3s-1.34 3-3 3h-6v-6zm7 18h-7v-6h7c1.66 0 3 1.34 3 3s-1.34 3-3 3z");
Ui.Icon.register('format-italic', "M20 8v6h4.43l-6.86 16h-5.57v6h16v-6h-4.43l6.86-16h5.57v-6z");
Ui.Icon.register('format-align-left', "M30 30h-24v4h24v-4zm0-16h-24v4h24v-4zm-24 12h36v-4h-36v4zm0 16h36v-4h-36v4zm0-36v4h36v-4h-36z");
Ui.Icon.register('format-align-right', "M6 42h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-8h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-12v4h36v-4h-36z");
Ui.Icon.register('format-align-center', "M14 30v4h20v-4h-20zm-8 12h36v-4h-36v4zm0-16h36v-4h-36v4zm8-12v4h20v-4h-20zm-8-8v4h36v-4h-36z");
*/
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var scroll = new Ui.ScrollingArea();
        _this.content = scroll;
        var vbox = new Ui.VBox().assign({ margin: 50, spacing: 20 });
        scroll.content = vbox;
        var boldButton = new Ui.ToggleButton().assign({
            icon: 'format-bold', focusable: false,
            ontoggled: function () { return document.execCommand('bold', false, undefined); },
            onuntoggled: function () { return document.execCommand('bold', false, undefined); }
        });
        var italicButton = new Ui.ToggleButton().assign({
            icon: 'format-italic', focusable: false,
            ontoggled: function () { return document.execCommand('italic', false, undefined); },
            onuntoggled: function () { return document.execCommand('italic', false, undefined); }
        });
        var alignLeftButton = new Ui.ToggleButton().assign({
            icon: 'format-align-left', focusable: false,
            ontoggled: function () { return document.execCommand('justifyLeft', false, undefined); },
            onuntoggled: function () { return document.execCommand('justifyLeft', false, undefined); }
        });
        var alignCenterButton = new Ui.ToggleButton().assign({
            icon: 'format-align-center', focusable: false,
            ontoggled: function () { return document.execCommand('justifyCenter', false, undefined); },
            onuntoggled: function () { return document.execCommand('justifyCenter', false, undefined); }
        });
        var alignRightButton = new Ui.ToggleButton().assign({
            icon: 'format-align-right', focusable: false,
            ontoggled: function () { return document.execCommand('justifyRight', false, undefined); },
            onuntoggled: function () { return document.execCommand('justifyRight', false, undefined); }
        });
        var listButton = new Ui.ToggleButton().assign({
            focusable: false,
            icon: 'eye'
        });
        var controls = new Ui.HBox().assign({
            uniform: true, isDisabled: false,
            content: [
                boldButton,
                italicButton,
                alignLeftButton,
                alignCenterButton,
                alignRightButton //,
                //listButton
            ]
        });
        var bg = new Ui.TextBgGraphic();
        var html = new Ui.ContentEditable().assign({
            width: 400, margin: 10, interLine: 1.2, fontSize: 20,
            html: 'Have fun with HTML, I <b>hope</b> the text is enough long',
            onfocused: function () { return bg.hasFocus = true; },
            onblurred: function () { return bg.hasFocus = false; },
            onanchorchanged: function () {
                boldButton.isActive = document.queryCommandState('bold');
                italicButton.isActive = document.queryCommandState('italic');
                alignLeftButton.isActive = document.queryCommandState('justifyLeft');
                alignCenterButton.isActive = document.queryCommandState('justifyCenter');
                alignRightButton.isActive = document.queryCommandState('justifyRight');
            },
            onselectionentered: function () { console.log('onselectionentered'); controls.enable(); },
            onselectionleaved: function () { console.log('onselectionleaved'); controls.disable(); /*bg.hasFocus = false;*/ }
        });
        html.selectable = true;
        var editor = new Ui.LBox().assign({
            horizontalAlign: 'center',
            content: [
                bg,
                //new Ui.Frame().assign({ frameWidth: 1, fill: 'rgb(152, 152, 152)' }),
                new Ui.VBox().assign({
                    margin: 1,
                    content: [
                        new Ui.LBox().assign({ content: [
                                new Ui.Rectangle().assign({ fill: 'white', opacity: 0.6 }),
                                controls
                            ] }),
                        new Ui.LBox().assign({
                            horizontalAlign: 'center',
                            content: [
                                //new Ui.Rectangle().assign({ fill: '#eeeeee' }),
                                html
                            ]
                        })
                    ]
                })
            ]
        });
        vbox.append(editor);
        vbox.append(new Ui.ContentEditable().assign({
            width: 400, margin: 10, interLine: 1.2, fontSize: 20,
            html: 'Un autre texte sympa'
        }));
        vbox.append(new Ui.TextField());
        vbox.append(new Ui.Button().assign({ text: 'Click' }));
        vbox.append(new Ui.RichTextEditor().assign({ width: 500 }));
        return _this;
    }
    return App;
}(Ui.App));
new App().assign({
    style: {
        types: [
            {
                type: Ui.ToggleButton,
                borderWidth: 0,
                background: 'rgba(255,255,255,0)',
                activeBackground: 'rgba(255,255,255,0)'
            }
        ]
    }
});
