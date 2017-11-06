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
// Play with Ui.Fold
//
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var leftButton = new Ui.Button({ text: 'left' });
        toolbar.append(leftButton, true);
        _this.connect(leftButton, 'press', function () { return fold.position = 'left'; });
        var rightButton = new Ui.Button({ text: 'right' });
        toolbar.append(rightButton, true);
        _this.connect(rightButton, 'press', function () { return fold.position = 'right'; });
        var topButton = new Ui.Button({ text: 'top' });
        toolbar.append(topButton, true);
        _this.connect(topButton, 'press', function () { return fold.position = 'top'; });
        var bottomButton = new Ui.Button({ text: 'bottom' });
        toolbar.append(bottomButton, true);
        _this.connect(bottomButton, 'press', function () { return fold.position = 'bottom'; });
        var overButton = new Ui.Button({ text: 'change over' });
        toolbar.append(overButton, true);
        _this.connect(overButton, 'press', function () { return fold.over = !fold.over; });
        var modeButton = new Ui.Button({ text: 'change mode' });
        toolbar.append(modeButton, true);
        _this.connect(modeButton, 'press', function () {
            if (fold.mode == 'extend')
                fold.mode = 'slide';
            else
                fold.mode = 'extend';
        });
        var lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
        vbox.append(lbox, true);
        lbox.append(new Ui.Rectangle({ fill: 'red' }));
        var fold = new Ui.Fold({ over: true, mode: 'extend', margin: 5 });
        lbox.append(fold);
        fold.background = new Ui.Rectangle({ fill: 'orange' });
        var header = new Ui.Pressable();
        header.content = new Ui.Rectangle({ width: 50, height: 50, fill: 'lightblue', margin: 3 });
        header.connect(header, 'press', function () { return fold.invert(); });
        fold.header = header;
        fold.content = new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen', margin: 3 });
        return _this;
    }
    return App;
}(Ui.App));
new App();
