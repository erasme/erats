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
        toolbar.append(new Ui.Button({
            text: 'set true',
            onpressed: function () { return switcher.value = true; }
        }));
        toolbar.append(new Ui.Button({
            text: 'set false',
            onpressed: function () { return switcher.value = false; }
        }));
        toolbar.append(new Ui.Button({
            text: 'enable',
            onpressed: function () { return switcher.enable(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'disable',
            onpressed: function () { return switcher.disable(); }
        }));
        var vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 10 });
        vbox.append(vbox2, true);
        switcher = new Ui.Switch({
            verticalAlign: 'center', horizontalAlign: 'center',
            value: true,
            onchanged: function () { return label.text = "Value: " + switcher.value; }
        });
        var label = new Ui.Label({ text: "Value: " + switcher.value });
        vbox2.append(label);
        vbox2.append(switcher);
        return _this;
    }
    return App;
}(Ui.App));
new App();
