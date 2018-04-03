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
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        toolbar.append(new Ui.Button({
            text: 'left',
            onpressed: function () { return fold.position = 'left'; }
        }), true);
        toolbar.append(new Ui.Button({
            text: 'right',
            onpressed: function () { return fold.position = 'right'; }
        }), true);
        toolbar.append(new Ui.Button({
            text: 'top',
            onpressed: function () { return fold.position = 'top'; }
        }), true);
        toolbar.append(new Ui.Button({
            text: 'bottom',
            onpressed: function () { return fold.position = 'bottom'; }
        }), true);
        toolbar.append(new Ui.Button({
            text: 'change over',
            onpressed: function () { return fold.over = !fold.over; }
        }), true);
        toolbar.append(new Ui.Button({
            text: 'change mode',
            onpressed: function () {
                if (fold.mode == 'extend')
                    fold.mode = 'slide';
                else
                    fold.mode = 'extend';
            }
        }), true);
        var lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
        vbox.append(lbox, true);
        lbox.append(new Ui.Rectangle({ fill: 'red' }));
        var fold;
        fold = new Ui.Fold({
            over: true, mode: 'extend', margin: 5,
            background: new Ui.Rectangle({ fill: 'orange' }),
            content: new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen', margin: 3 }),
            header: new Ui.Pressable({
                content: new Ui.Rectangle({ width: 50, height: 50, fill: 'lightblue', margin: 3 }),
                onpressed: function (e) { return fold.invert(); }
            })
        });
        lbox.append(fold);
        return _this;
    }
    return App;
}(Ui.App));
new App();
