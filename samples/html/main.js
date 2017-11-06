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
        var mainvbox = new Ui.VBox();
        _this.setContent(mainvbox);
        var toolbar = new Ui.ToolBar();
        mainvbox.append(toolbar);
        var button = new Ui.CheckBox();
        button.text = 'selectable';
        toolbar.append(button);
        _this.connect(button, 'toggle', function () { return html.selectable = true; });
        _this.connect(button, 'untoggle', function () { return html.selectable = false; });
        var vbox = new Ui.VBox({ verticalAlign: 'center' });
        mainvbox.append(vbox, true);
        var r = new Ui.Rectangle();
        r.fill = 'lightblue';
        r.height = 10;
        vbox.append(r);
        var hbox = new Ui.HBox({ horizontalAlign: 'center' });
        vbox.append(hbox);
        r = new Ui.Rectangle();
        r.fill = 'lightblue';
        r.width = 10;
        hbox.append(r, true);
        var html = new Ui.Html();
        html.width = 100;
        html.html = '<div>Have fun with HTML, I <b>hope</b> the text is enough long</div>';
        html.selectable = false;
        hbox.append(html, false);
        r = new Ui.Rectangle();
        r.fill = 'lightblue';
        r.width = 10;
        hbox.append(r, true);
        r = new Ui.Rectangle();
        r.fill = 'lightblue';
        r.height = 10;
        vbox.append(r);
        return _this;
    }
    return App;
}(Ui.App));
new App();
