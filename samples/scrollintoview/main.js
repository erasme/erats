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
        var el;
        var hbox = new Ui.HBox();
        _this.setContent(hbox);
        var button = new Ui.Button({
            text: 'click for scroll',
            verticalAlign: 'center',
            horizontalAlign: 'center'
        });
        _this.connect(button, 'press', function () { return el.scrollIntoView(); });
        hbox.append(button, true);
        var scroll = new Ui.ScrollingArea();
        hbox.append(scroll, true);
        var vbox = new Ui.VBox();
        scroll.content = vbox;
        vbox.append(new Ui.Rectangle({ fill: 'orange', height: 400 }));
        vbox.append(new Ui.Rectangle({ fill: 'lightgreen', height: 400 }));
        vbox.append(new Ui.Rectangle({ fill: 'purple', height: 400 }));
        el = new Ui.Rectangle({ fill: 'red', width: 50, height: 50, margin: 50 });
        vbox.append(el);
        vbox.append(new Ui.Rectangle({ fill: 'lightblue', height: 400 }));
        vbox.append(new Ui.Rectangle({ fill: 'pink', height: 400 }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
