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
        var vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        _this.setContent(vbox);
        var data = [];
        for (var i = 0; i < 25; i++)
            data.push({ text: 'item ' + i, id: i });
        var combo = new Ui.Combo({ field: 'text', data: data, placeHolder: 'choice...' });
        vbox.append(combo);
        _this.connect(combo, 'change', function (combo, val, position) {
            console.log('Combo change: ' + val.text);
            Ui.Toast.send(val.text);
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
