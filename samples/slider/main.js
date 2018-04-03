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
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        toolbar.append(new Ui.Button({
            text: 'begin',
            onpressed: function () { return clock.begin(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'enable',
            onpressed: function () { return slider.enable(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'disable',
            onpressed: function () { return slider.disable(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'horizontal',
            onpressed: function () { return slider.orientation = 'horizontal'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'vertical',
            onpressed: function () { return slider.orientation = 'vertical'; }
        }));
        var vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        vbox.append(vbox2, true);
        var label = new Ui.Label({ horizontalAlign: 'center' });
        vbox2.append(label);
        var slider = new Ui.Slider({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 200, height: 200, value: 0.2,
            onchanged: function (e) { return label.text = "Value: " + e.value.toFixed(2); }
        });
        vbox2.append(slider);
        label.text = "Value: " + slider.value;
        var clock = new Anim.Clock({
            duration: 4.0,
            ontimeupdate: function (e) { return slider.setValue(e.progress); }
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
