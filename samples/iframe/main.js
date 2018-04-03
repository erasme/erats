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
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var button = new Ui.Button({
            text: 'content',
            onpressed: function () { return iframe.src = 'content2.html'; }
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'iframe',
            onpressed: function () { return iframe.src = 'iframe.html'; }
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'gnome',
            onpressed: function () { return iframe.src = 'http://www.gnome.org/'; }
        });
        toolbar.append(button);
        var iframe = new Ui.IFrame();
        vbox.append(iframe, true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
