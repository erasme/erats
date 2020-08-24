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
        var vbox = new Ui.VBox().assign({ verticalAlign: 'center', horizontalAlign: 'center' });
        _this.content = vbox;
        var data = [];
        for (var i = 0; i < 25; i++)
            data.push({ text: 'item ' + i, id: i });
        var combo = new Ui.Combo().assign({
            field: 'text', data: data, placeHolder: 'choice...', search: true
        });
        vbox.append(combo);
        combo.changed.connect(function (e) {
            console.log('Combo change: ' + e.value.text);
            Ui.Toast.send(e.value.text);
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
//# sourceMappingURL=main.js.map