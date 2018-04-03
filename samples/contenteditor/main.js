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
        var scroll = new Ui.ScrollingArea();
        _this.content = scroll;
        var vbox = new Ui.VBox();
        scroll.content = vbox;
        vbox.append(new Ui.Rectangle({ fill: 'orange', height: 350 }));
        var lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
        vbox.append(lbox);
        lbox.append(new Ui.Rectangle({ fill: 'lightblue' }));
        var html = new Ui.ContentEditable({
            horizontalAlign: 'center', width: 200, margin: 5,
            html: 'Have fun with HTML, I <b>hope</b> the text is enough long'
        });
        html.selectable = true;
        lbox.append(html);
        vbox.append(new Ui.Rectangle({ fill: 'orange', height: 350 }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
