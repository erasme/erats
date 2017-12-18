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
        var vbox = new Ui.VBox({ padding: 50, spacing: 10 });
        _this.content = vbox;
        var textbuttonfield = new Ui.TextButtonField({ buttonIcon: 'search', textHolder: 'Search' });
        vbox.append(textbuttonfield);
        _this.connect(textbuttonfield, 'change', function (tbf, value) {
            return logs.log('change: ' + value);
        });
        _this.connect(textbuttonfield, 'validate', function (tbf) {
            return logs.log('validate: ' + textbuttonfield.value, 'green');
        });
        var logs = new Logs();
        vbox.append(logs, true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
