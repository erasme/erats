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
        _this.connect(_this, 'ptrdown', function (event) {
            console.log('ptrdown at: ' + event.pointer.getX() + ',' + event.pointer.getY() + ' found: ' +
                Ui.App.current.elementFromPoint(new Ui.Point(event.pointer.x, event.pointer.y)));
            Ui.Toast.send(Ui.App.current.elementFromPoint(new Ui.Point(event.pointer.x, event.pointer.y)).toString());
        }, true);
        var vbox = new Ui.VBox({ spacing: 10, margin: 10 });
        _this.setContent(vbox);
        vbox.append(new Ui.Button({ text: 'Click me', icon: 'star' }));
        vbox.append(new Ui.Rectangle({ fill: 'purple', height: 100 }));
        vbox.append(new Ui.Text({ text: 'Some text sample' }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
