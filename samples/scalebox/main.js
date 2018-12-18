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
        _this.content = new Ui.ScaleBox({
            fixedWidth: 800, fixedHeight: 600, margin: 100,
            itemAlign: 'center',
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ fill: 'orange' }),
                    new Ui.Text({ margin: 40, fontSize: 40, text: 'Hello World !' }),
                    new Ui.Rectangle({ width: 50, height: 50, fill: 'red', verticalAlign: 'bottom', horizontalAlign: 'right' })
                ]
            })
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
