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
        var count = 0;
        var label = new Ui.Label();
        _this.content = new Ui.VBox().assign({
            verticalAlign: 'center', horizontalAlign: 'center', spacing: 10,
            content: [
                label.assign({ text: 'toggle count: 0' }),
                new Ui.ToggleButton().assign({
                    text: 'toggle me',
                    ontoggled: function () { return label.text = "toggle count: " + (++count); }
                })
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
//# sourceMappingURL=main.js.map