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
//
// Play with Ui.Button, the normal looking button
//
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.MenuToolBar({ spacing: 5, margin: 5 });
        vbox.append(toolbar);
        toolbar.append(new Ui.Button({ text: 'Button1' }));
        toolbar.append(new Ui.Button({ text: 'Button2' }));
        toolbar.append(new Ui.Button({ text: 'Button3' }));
        toolbar.append(new Ui.CompactLabel({ text: 'Test Title resizable', width: 150, fontSize: 22, maxLine: 2, verticalAlign: 'center' }), true);
        toolbar.append(new Ui.Button({ icon: 'plus' }));
        toolbar.append(new Ui.Button({ icon: 'trash' }));
        toolbar.append(new Ui.Button({
            icon: 'edit',
            onpressed: function () {
                var dialog = new Ui.Dialog({ title: 'Edit dialog', preferredWidth: 300, content: new Ui.Text({ text: 'Hello World !' }) });
                dialog.cancelButton = new Ui.Button({ text: 'Close' });
                dialog.open();
            }
        }));
        toolbar.append(new Ui.Button({ icon: 'exit' }));
        vbox.append(new Ui.Button({
            text: 'Prepend button', verticalAlign: 'center', horizontalAlign: 'center',
            onpressed: function () { return toolbar.prepend(new Ui.Button({ text: 'ButtonX' })); }
        }), true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
