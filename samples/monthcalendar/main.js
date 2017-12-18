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
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var button = new Ui.Button({ text: 'get date' });
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            var date = calendar.selectedDate;
            if (date == undefined)
                logs.log('date is undefined');
            else
                logs.log('date: ' + date);
        });
        var hbox = new Ui.HBox();
        vbox.append(hbox, true);
        var calendar = new Ui.MonthCalendar({ verticalAlign: 'center', horizontalAlign: 'center' });
        calendar.dayFilter = [6, 0];
        calendar.dateFilter = ['2011/11/2[1-5]', '2011/12/*', '2012/0[2-3]/.[4]'];
        hbox.append(calendar, true);
        _this.connect(calendar, 'dayselect', function (calendar, date) {
            console.log('Day select: ' + date);
        });
        var logs = new Logs();
        hbox.append(logs, true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
