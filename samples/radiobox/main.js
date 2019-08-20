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
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.group = new Ui.RadioGroup().assign({ onchanged: function (e) { return console.log(e.target); } });
        var vbox = new Ui.VBox();
        var radiovbox = new Ui.VBox().assign({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 200, resizable: true
        });
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        vbox.append(radiovbox);
        var radio = new Ui.RadioBox({
            text: 'this is a radio button'
        });
        radiovbox.append(radio);
        var radio2 = new Ui.RadioBox({
            text: 'this is another radio button'
        });
        radiovbox.append(radio2);
        _this.group.add(radio);
        _this.group.add(radio2);
        var button = new Ui.Button({
            text: 'check',
            onpressed: function () { return _this.group.current = radio; }
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'uncheck',
            onpressed: function () { return _this.group.current = undefined; }
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'enable',
            onpressed: function () { return radiovbox.enable(); }
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'disable',
            onpressed: function () { return radiovbox.disable(); }
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'add radio',
            onpressed: function () { return radiovbox.append(new Ui.RadioBox({ verticalAlign: 'center', horizontalAlign: 'center', width: 200, text: 'created button', group: _this.group })); }
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'remove radio',
            onpressed: function () {
                var children = _this.group.children;
                if (children.length > 1) {
                    _this.group.remove(children[children.length - 1]);
                    radiovbox.remove(children[children.length - 1]);
                }
            }
        });
        toolbar.append(button);
        return _this;
    }
    return App;
}(Ui.App));
new App();
