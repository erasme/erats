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
        var fixed = new Ui.Fixed();
        _this.content = fixed;
        fixed.append(new Ui.Movable({
            inertia: true,
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ width: 100, height: 100, fill: 'orange', radius: 8 }),
                    new Ui.Label({ text: 'free move' })
                ]
            })
        }), 0, 0);
        fixed.append(new Ui.Movable({
            moveVertical: false, inertia: true,
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ width: 100, height: 100, fill: 'purple', radius: 8 }),
                    new Ui.Label({ text: 'horizontal' })
                ]
            })
        }), 0, 200);
        fixed.append(new Ui.Movable({
            moveHorizontal: false,
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ width: 100, height: 100, fill: 'lightblue', radius: 8 }),
                    new Ui.Label({ text: 'vertical' })
                ]
            })
        }), 250, 0);
        fixed.append(new Ui.Movable({
            moveVertical: false,
            onmoved: function (e) {
                var m = e.target;
                if (m.positionX < 0)
                    m.setPosition(0, undefined);
                else if (m.positionX > 100)
                    m.setPosition(100, undefined);
            },
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ width: 200, height: 100, fill: 'lightgreen', radius: 8 }),
                    new Ui.Label({ text: 'horizontal limited 0-100' })
                ]
            })
        }), 0, 400);
        return _this;
    }
    return App;
}(Ui.App));
new App();
