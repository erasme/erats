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
        var beginButton = new Ui.Button({ text: 'begin' });
        toolbar.append(beginButton);
        _this.connect(beginButton, 'press', function () {
            clock.begin();
        });
        var enableButton = new Ui.Button({ text: 'enable' });
        toolbar.append(enableButton);
        _this.connect(enableButton, 'press', function () {
            slider.enable();
        });
        var disableButton = new Ui.Button({ text: 'disable' });
        toolbar.append(disableButton);
        _this.connect(disableButton, 'press', function () {
            slider.disable();
        });
        var horizontalButton = new Ui.Button({ text: 'horizontal' });
        toolbar.append(horizontalButton);
        _this.connect(horizontalButton, 'press', function () {
            slider.orientation = 'horizontal';
        });
        var verticalButton = new Ui.Button({ text: 'vertical' });
        toolbar.append(verticalButton);
        _this.connect(verticalButton, 'press', function () {
            slider.orientation = 'vertical';
        });
        var vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        vbox.append(vbox2, true);
        var label = new Ui.Label({ horizontalAlign: 'center' });
        vbox2.append(label);
        var slider = new Ui.Slider({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 200, height: 200, value: 0.2
        });
        vbox2.append(slider);
        label.text = 'Value: ' + slider.value;
        _this.connect(slider, 'change', function () {
            label.text = 'Value: ' + slider.value.toFixed(2);
        });
        var clock = new Anim.Clock({ duration: 4.0 });
        _this.connect(clock, 'timeupdate', function (clock, progress) {
            slider.setValue(progress);
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
