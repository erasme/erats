"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
        var vbox = new Ui.VBox().assign({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 5 });
        _this.content = vbox;
        var rectangle = new Ui.Rectangle().assign({
            width: 100, height: 100, fill: 'lightblue', horizontalAlign: 'center'
        });
        var pressable = new Ui.Pressable().assign({ horizontalAlign: 'center' });
        var ripple = new Ui.RippleEffect(pressable);
        pressable.assign({
            onpressed: function (e) {
                if (e.x && e.y) {
                    var p = pressable.pointFromWindow(new Ui.Point(e.x, e.y));
                    ripple.press(p.x, p.y);
                }
                else
                    ripple.press();
            },
            ondowned: function (e) {
                if (e.x && e.y) {
                    var p = pressable.pointFromWindow(new Ui.Point(e.x, e.y));
                    ripple.down(p.x, p.y);
                }
                else
                    ripple.down();
            },
            onupped: function () { return ripple.up(); },
            content: rectangle
        });
        vbox.append(pressable);
        return _this;
    }
    return App;
}(Ui.App));
new App();
//# sourceMappingURL=main.js.map