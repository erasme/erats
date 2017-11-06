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
        var overable = new Ui.Overable();
        overable.verticalAlign = Ui.VerticalAlign.center;
        overable.horizontalAlign = Ui.HorizontalAlign.center;
        _this.setContent(overable);
        _this.connect(overable, 'enter', function () {
            console.log('enter');
            label.show();
        });
        _this.connect(overable, 'leave', function () {
            console.log('leave');
            label.hide();
        });
        var lbox = new Ui.LBox();
        lbox.width = 400;
        lbox.height = 400;
        overable.append(lbox);
        var r1 = new Ui.Rectangle();
        r1.fill = 'lightgreen';
        lbox.append(r1);
        var r2 = new Ui.Rectangle();
        r2.fill = 'purple';
        r2.margin = 50;
        lbox.append(r2);
        var r3 = new Ui.Rectangle();
        r3.fill = 'orange';
        r3.margin = 100;
        lbox.append(r3);
        var label = new Ui.Label();
        label.verticalAlign = Ui.VerticalAlign.center;
        label.horizontalAlign = Ui.HorizontalAlign.center;
        label.text = 'is over';
        label.fontWeight = 'bold';
        label.fontSize = 20;
        label.hide();
        lbox.append(label);
        return _this;
    }
    return App;
}(Ui.App));
new App();
