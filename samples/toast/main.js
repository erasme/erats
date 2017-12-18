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
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var textfield = new Ui.TextField({
            verticalAlign: 'center', margin: 40, value: 'Hello World !'
        });
        vbox.append(textfield);
        var button = new Ui.Button();
        button.text = 'Send toast';
        _this.connect(button, 'press', function () {
            Ui.Toast.send(textfield.value);
        });
        toolbar.append(button);
        var delayButton = new Ui.Button({ text: 'Send delayed toast' });
        _this.connect(delayButton, 'press', function () {
            new Core.DelayedTask(2, function () { return Ui.Toast.send(textfield.value + ' DELAY'); });
        });
        toolbar.append(delayButton);
        var dialogButton = new Ui.Button();
        dialogButton.text = 'Open dialog';
        _this.connect(dialogButton, 'press', function () {
            var dialog = new Ui.Dialog({
                title: 'Dialog box',
                preferredWidth: 600,
                preferredHeight: 600,
                cancelButton: new Ui.DialogCloseButton()
            });
            var sendButton = new Ui.Button({
                text: 'Send toast',
                verticalAlign: 'center',
                horizontalAlign: 'center'
            });
            dialog.content = sendButton;
            _this.connect(sendButton, 'press', function () { return Ui.Toast.send('Dialog toast'); });
            dialog.open();
        });
        toolbar.append(dialogButton);
        return _this;
    }
    return App;
}(Ui.App));
new App();
