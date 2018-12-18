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
        var scroll = new Ui.ScrollingArea();
        _this.content = scroll;
        var text = new Ui.Text({ margin: 10, interLine: 1.2 });
        scroll.content = text;
        var msg = '';
        for (var prop in navigator) {
            var val = navigator[prop];
            if ((typeof (val) === 'string') || (typeof (val) === 'boolean'))
                msg += 'navigator.' + prop + ': ' + val + '\n';
        }
        for (var prop in Ui.Audio) {
            var val = Ui.Audio[prop];
            if ((typeof (val) === 'string') || (typeof (val) === 'boolean'))
                msg += 'Ui.Audio.' + prop + ': ' + val + '\n';
        }
        for (var prop in Ui.Video) {
            var val = Ui.Video[prop];
            if ((typeof (val) === 'string') || (typeof (val) === 'boolean'))
                msg += 'Ui.Video.' + prop + ': ' + val + '\n';
        }
        msg += 'window.devicePixelRatio: ' + window.devicePixelRatio + '\n';
        msg += 'window.innerWidth: ' + window.innerWidth + '\n';
        msg += 'window.innerHeight: ' + window.innerHeight + '\n';
        text.text = msg;
        return _this;
    }
    return App;
}(Ui.App));
new App();
