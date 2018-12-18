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
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        toolbar.append(new Ui.Button().assign({
            text: 'begin',
            onpressed: function () { return clock.begin(); }
        }));
        toolbar.append(new Ui.Button().assign({
            text: 'infinite',
            onpressed: function () {
                clock.stop();
                progressbar.value = 'infinite';
            }
        }));
        var progressbar = new Ui.ProgressBar().assign({
            verticalAlign: 'center', horizontalAlign: 'center', width: 200
        });
        vbox.append(progressbar, true);
        var clock = new Anim.Clock({
            duration: 4.0,
            ontimeupdate: function (e) { return progressbar.value = e.progress; }
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
