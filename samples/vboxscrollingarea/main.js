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
var TestScrollLoader = (function (_super) {
    __extends(TestScrollLoader, _super);
    function TestScrollLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestScrollLoader.prototype.signalChange = function () {
        this.changed.fire({ target: this });
    };
    TestScrollLoader.prototype.getMin = function () {
        return 0;
    };
    TestScrollLoader.prototype.getMax = function () {
        return 200;
    };
    TestScrollLoader.prototype.getElementAt = function (position) {
        var item = new Ui.LBox({ marginBottom: 10 });
        var text = 'item ' + position;
        var color;
        if (position % 4 === 0) {
            color = '#f0a0f0';
            text = 'this item is a very long text to handle this special case. So a lot a text is needed here';
        }
        else if (position % 4 === 1)
            color = 'lightgreen';
        else if (position % 4 === 2)
            color = 'pink';
        else if (position % 4 === 3)
            color = 'lightblue';
        if (position % 4 === 2) {
            item.append(new Ui.Button({ text: text }));
        }
        else {
            item.append(new Ui.Rectangle({ fill: color }));
            item.append(new Ui.Text({ text: text, margin: 10 * (position % 4), textAlign: 'center' }));
        }
        return item;
    };
    return TestScrollLoader;
}(Ui.ScrollLoader));
var TestScrollLoader2 = (function (_super) {
    __extends(TestScrollLoader2, _super);
    function TestScrollLoader2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestScrollLoader2.prototype.signalChange = function () {
        this.changed.fire({ target: this });
    };
    TestScrollLoader2.prototype.getMin = function () {
        return 0;
    };
    TestScrollLoader2.prototype.getMax = function () {
        return 2;
    };
    TestScrollLoader2.prototype.getElementAt = function (position) {
        return new Ui.Image({ src: 'building.png', height: 700, width: 400, marginBottom: 10 });
    };
    return TestScrollLoader2;
}(Ui.ScrollLoader));
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var button = new Ui.Button({ text: 'Reload' });
        vbox.append(button);
        var lbox = new Ui.LBox({ margin: 40 });
        vbox.append(lbox, true);
        lbox.append(new Ui.Frame({ frameWidth: 2, fill: '#444' }));
        var loader = new TestScrollLoader();
        var scroll = new Ui.VBoxScrollingArea({
            margin: 2, maxScale: 2, loader: loader
        });
        lbox.append(scroll);
        button.pressed.connect(function (e) { return loader.signalChange(); });
        return _this;
    }
    return App;
}(Ui.App));
new App();
