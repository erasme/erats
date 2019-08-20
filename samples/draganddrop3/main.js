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
        var rect = new Ui.Rectangle();
        var drop = new Ui.Rectangle();
        _this.content = new Ui.VBox().assign({
            verticalAlign: 'center', horizontalAlign: 'center',
            spacing: 20,
            content: [
                rect.assign({ fill: 'red', width: 100, height: 100, horizontalAlign: 'center' }),
                drop.assign({ fill: 'green', width: 200, height: 200 })
            ]
        });
        new Ui.DraggableWatcher({
            element: rect,
            data: rect,
            start: function () { return Ui.Toast.send('Drag start'); },
            end: function (watcher, effect) { return Ui.Toast.send("Drag end effect: " + effect); }
        });
        new Ui.DropableWatcher({
            element: drop,
            ondropped: function (w, d, e) { console.log('DROP ' + e); return true; },
            types: [
                { type: Ui.Rectangle, effects: 'copy' }
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
