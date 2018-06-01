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
        toolbar.append(new Ui.CheckBox().assign({
            text: 'selectable',
            ontoggled: function () { return text.selectable = true; },
            onuntoggled: function () { return text.selectable = false; }
        }));
        var lbox = new Ui.LBox().assign({ verticalAlign: 'center', horizontalAlign: 'stretch', margin: 100 });
        vbox.append(lbox, true);
        lbox.append(new Ui.Rectangle().assign({ fill: 'lightgreen' }));
        var text = new Ui.Text().assign({
            margin: 5,
            textAlign: 'center',
            text: 'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters'
        });
        lbox.append(text);
        return _this;
    }
    return App;
}(Ui.App));
new App();
