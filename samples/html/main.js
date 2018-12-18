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
        var mainvbox = new Ui.VBox();
        _this.content = mainvbox;
        var toolbar = new Ui.ToolBar();
        mainvbox.append(toolbar);
        toolbar.append(new Ui.CheckBox({
            text: 'selectable',
            ontoggled: function () { return html.selectable = true; },
            onuntoggled: function () { return html.selectable = false; }
        }));
        var vbox = new Ui.VBox({ verticalAlign: 'center' });
        mainvbox.append(vbox, true);
        vbox.append(new Ui.Rectangle({
            fill: 'lightblue', height: 10
        }));
        var hbox = new Ui.HBox({ horizontalAlign: 'center' });
        vbox.append(hbox);
        hbox.append(new Ui.Rectangle({
            fill: 'lightblue', width: 10
        }), true);
        var html = new Ui.Html({
            width: 100,
            html: 'Have fun with HTML, I <b>hope</b> the text is enough long',
            selectable: false
        });
        hbox.append(html, false);
        hbox.append(new Ui.Rectangle({
            fill: 'lightblue', width: 10
        }), true);
        vbox.append(new Ui.Rectangle({
            fill: 'lightblue', height: 10
        }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
