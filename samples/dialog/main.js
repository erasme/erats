"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.setContent(vbox);
        var tb = new Ui.HBox();
        vbox.append(tb);
        tb.append(new Ui.Button({ text: 'test 1' }));
        tb.append(new Ui.Button({ text: 'test 2' }));
        var button = new Ui.Button({
            text: 'Open dialog',
            verticalAlign: 'center', horizontalAlign: 'center'
        });
        vbox.append(button, true);
        _this.connect(button, 'press', function () {
            var dialog = new Ui.Dialog({
                title: 'Test Dialogue',
                cancelButton: new Ui.DialogCloseButton({ text: 'Annuler' }),
                actionButtons: [
                    new Ui.Button({ text: 'Previous' }),
                    new Ui.Button({ text: 'Next' })
                ],
                content: new Ui.Rectangle({ fill: 'lightgreen', width: 350, height: 200 })
            });
            dialog.open();
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
