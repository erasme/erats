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
        var overable = new Ui.Overable({
            verticalAlign: 'center', horizontalAlign: 'center',
            onentered: function () {
                console.log('enter');
                label.show();
            },
            onleaved: function () {
                console.log('leave');
                label.hide();
            }
        });
        _this.content = overable;
        var lbox = new Ui.LBox({ width: 400, height: 400 });
        overable.append(lbox);
        lbox.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        lbox.append(new Ui.Rectangle({ fill: 'purple', margin: 50 }));
        lbox.append(new Ui.Rectangle({ fill: 'orange', margin: 100 }));
        lbox.append(new Ui.Button({ text: 'CLICK', margin: 20, verticalAlign: 'bottom' }));
        var label = new Ui.Label({
            verticalAlign: 'center',
            horizontalAlign: 'center',
            text: 'is over',
            fontWeight: 'bold',
            fontSize: 20
        });
        label.hide();
        lbox.append(label);
        return _this;
    }
    return App;
}(Ui.App));
new App();
