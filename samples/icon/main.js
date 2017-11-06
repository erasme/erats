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
        var fbox = new Ui.Flow({
            margin: 40, spacing: 20, uniform: true
        });
        _this.content = fbox;
        var colors = ['lightblue', 'pink', 'lightgreen'];
        for (var i = 0; i < Ui.Icon.getNames().length; i++) {
            var vbox = new Ui.VBox({ spacing: 5 });
            vbox.append(new Ui.Icon({
                icon: Ui.Icon.getNames()[i],
                horizontalAlign: 'center',
                width: 48, height: 48,
                fill: colors[i % colors.length]
            }));
            vbox.append(new Ui.Label({
                horizontalAlign: 'center',
                text: Ui.Icon.getNames()[i]
            }));
            fbox.append(vbox);
        }
        return _this;
    }
    return App;
}(Ui.App));
new App();
