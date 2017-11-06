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
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var checkbox = new Ui.CheckBox();
        checkbox.text = 'check me';
        checkbox.width = 200;
        checkbox.verticalAlign = Ui.VerticalAlign.center;
        checkbox.horizontalAlign = Ui.HorizontalAlign.center;
        vbox.append(checkbox, true);
        var button = new Ui.Button();
        button.setText('check');
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            checkbox.value = true;
        });
        button = new Ui.Button();
        button.setText('uncheck');
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            checkbox.value = false;
        });
        button = new Ui.Button();
        button.setText('enable');
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            checkbox.enable();
        });
        button = new Ui.Button();
        button.setText('disable');
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            checkbox.disable();
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
