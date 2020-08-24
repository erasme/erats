"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
        _this.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
        var scrolling = new Ui.ScrollingArea();
        _this.append(scrolling, true);
        _this.logs = new Ui.VBox();
        scrolling.content = _this.logs;
        return _this;
    }
    Logs.prototype.log = function (text, color) {
        if (color == undefined)
            color = 'black';
        this.logs.prepend(new Ui.Label({ text: text, color: color, horizontalAlign: 'left' }));
    };
    return Logs;
}(Ui.VBox));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        toolbar.append(new Ui.Button({
            text: 'get date',
            onpressed: function () {
                var date = datepicker.selectedDate;
                if (date == undefined)
                    logs.log('date is undefined');
                else
                    logs.log('date: ' + date);
            }
        }));
        var hbox = new Ui.HBox();
        vbox.append(hbox, true);
        var datepicker = new Ui.DatePicker({ verticalAlign: 'center', horizontalAlign: 'center', dayFilter: [0, 6] });
        hbox.append(datepicker, true);
        var logs = new Logs();
        hbox.append(logs, true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
