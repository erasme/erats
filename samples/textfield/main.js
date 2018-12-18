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
var Logs = /** @class */ (function (_super) {
    __extends(Logs, _super);
    function Logs() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox({ spacing: 10 });
        _this.content = vbox;
        vbox.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
        _this.logs = new Ui.VBox();
        vbox.append(_this.logs);
        return _this;
    }
    Logs.prototype.log = function (text, color) {
        if (color === void 0) { color = 'black'; }
        this.logs.prepend(new Ui.Label({
            text: text, color: color, horizontalAlign: 'left'
        }));
    };
    return Logs;
}(Ui.ScrollingArea));
var app = new Ui.App();
var vbox = new Ui.VBox({ spacing: 10, margin: 5 });
app.content = vbox;
var hbox = new Ui.HBox({ spacing: 10 });
vbox.append(hbox);
var textfield = new Ui.TextField({
    textHolder: 'Text Holder',
    onchanged: function (e) { return logs.log("change: " + e.value); }
});
hbox.append(textfield, true);
var getButton = new Ui.Button({
    text: 'get text',
    onpressed: function () { return logs.log("get text: " + textfield.value, 'blue'); }
});
hbox.append(getButton);
var logs = new Logs();
vbox.append(logs, true);
