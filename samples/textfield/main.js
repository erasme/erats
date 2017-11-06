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
var Logs = (function (_super) {
    __extends(Logs, _super);
    function Logs() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        vbox.spacing = 10;
        _this.setContent(vbox);
        var l = new Ui.Label();
        l.text = 'Logs:';
        l.horizontalAlign = Ui.HorizontalAlign.left;
        l.fontWeight = 'bold';
        vbox.append(l);
        _this.logs = new Ui.VBox();
        vbox.append(_this.logs);
        return _this;
    }
    Logs.prototype.log = function (text, color) {
        if (color == undefined)
            color = 'black';
        var l = new Ui.Label();
        l.text = text;
        l.color = color;
        l.horizontalAlign = Ui.HorizontalAlign.left;
        this.logs.prepend(l);
    };
    return Logs;
}(Ui.ScrollingArea));
var app = new Ui.App();
var vbox = new Ui.VBox();
vbox.spacing = 10;
vbox.margin = 5;
app.setContent(vbox);
var hbox = new Ui.HBox();
hbox.spacing = 10;
vbox.append(hbox);
var textfield = new Ui.TextField();
textfield.textHolder = 'Text Holder';
hbox.append(textfield, true);
app.connect(textfield, 'change', function (tfield, value) { return logs.log("change: " + value); });
var getButton = new Ui.Button();
getButton.setText('get text');
hbox.append(getButton);
app.connect(getButton, 'press', function () {
    logs.log("get text: " + textfield.value, 'blue');
});
var logs = new Logs();
vbox.append(logs, true);
