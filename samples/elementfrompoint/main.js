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
        _this.drawing.addEventListener('pointerdown', function (event) {
            var el = Ui.Element.elementFromPoint(new Ui.Point(event.clientX, event.clientY));
            console.log('pointerdown at: ' + event.clientX + ',' + event.clientY + ' found: ' +
                el);
            Ui.Toast.send("" + el);
        }, true);
        var vbox = new Ui.VBox({ spacing: 10, margin: 10 });
        _this.content = vbox;
        vbox.append(new Ui.Button({ text: 'Click me', icon: 'star' }));
        vbox.append(new Ui.Rectangle({ fill: 'purple', height: 100 }));
        vbox.append(new Ui.Text({ text: 'Some text sample' }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
