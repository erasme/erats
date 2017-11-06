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
        var lbox = new Ui.LPBox();
        _this.setContent(lbox);
        var r = new Ui.Rectangle();
        r.fill = 'orange';
        r.marginLeft = 40;
        r.marginTop = 40;
        r.marginBottom = 120;
        r.marginRight = 120;
        lbox.prepend(r);
        r = new Ui.Rectangle();
        r.fill = 'pink';
        r.marginLeft = 60;
        r.marginTop = 60;
        r.marginBottom = 100;
        r.marginRight = 100;
        lbox.prependAtLayer(r, 2);
        r = new Ui.Rectangle();
        r.fill = 'green';
        r.marginLeft = 80;
        r.marginTop = 80;
        r.marginBottom = 80;
        r.marginRight = 80;
        lbox.prepend(r);
        r = new Ui.Rectangle();
        r.fill = 'purple';
        r.marginLeft = 100;
        r.marginTop = 100;
        r.marginBottom = 60;
        r.marginRight = 60;
        lbox.prependAtLayer(r, 2);
        return _this;
    }
    return App;
}(Ui.App));
new App();
