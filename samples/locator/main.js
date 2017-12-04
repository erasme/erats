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
//
// Play with Ui.Button, the normal looking button
//
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var locator = new Ui.Locator({
            path: '/Fun/Apps/Here/There/Everywhere',
            verticalAlign: 'center', horizontalAlign: 'center'
        });
        _this.content = locator;
        _this.connect(locator, 'change', function (locator, path) {
            console.log('path change: ' + path);
            Ui.Toast.send('path change: ' + path);
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
