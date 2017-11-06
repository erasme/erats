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
//
// Play with Ui.Switch
//
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var switcher;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var pos1Button = new Ui.Button({ text: 'set true' });
        toolbar.append(pos1Button);
        _this.connect(pos1Button, 'press', function () { return switcher.value = true; });
        var pos2Button = new Ui.Button({ text: 'set false' });
        toolbar.append(pos2Button);
        _this.connect(pos2Button, 'press', function () { return switcher.value = false; });
        var enableButton = new Ui.Button({ text: 'enable' });
        toolbar.append(enableButton);
        _this.connect(enableButton, 'press', function () {
            switcher.enable();
        });
        var disableButton = new Ui.Button({ text: 'disable' });
        toolbar.append(disableButton);
        _this.connect(disableButton, 'press', function () { return switcher.disable(); });
        var vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 10 });
        vbox.append(vbox2, true);
        switcher = new Ui.Switch({
            verticalAlign: 'center', horizontalAlign: 'center',
            value: true
        });
        var label = new Ui.Label({ text: 'Value: ' + switcher.value });
        vbox2.append(label);
        vbox2.append(switcher);
        _this.connect(switcher, 'change', function () {
            label.text = 'Value: ' + switcher.value;
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
