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
        var toolbar2 = new Ui.ToolBar();
        vbox.append(toolbar2);
        toolbar.append(new Ui.Button({
            text: 'transition 1',
            onpressed: function () { return transitionbox.current = page1; }
        }));
        toolbar.append(new Ui.Button({
            text: 'transition 2',
            onpressed: function () { return transitionbox.current = page2; }
        }));
        toolbar.append(new Ui.Button({
            text: 'fade',
            onpressed: function () { return transitionbox.transition = 'fade'; }
        }));
        toolbar2.append(new Ui.Button({
            text: 'flip horizontal',
            onpressed: function () { return transitionbox.transition = 'flip'; }
        }));
        toolbar2.append(new Ui.Button({
            text: 'flip vertical',
            onpressed: function () { return transitionbox.transition = new Ui.Flip({ orientation: 'vertical' }); }
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide right',
            onpressed: function () { return transitionbox.transition = 'slide'; }
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide left',
            onpressed: function () { return transitionbox.transition = new Ui.Slide({ direction: 'left' }); }
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide top',
            onpressed: function () { return transitionbox.transition = new Ui.Slide({ direction: 'top' }); }
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide bottom',
            onpressed: function () { return transitionbox.transition = new Ui.Slide({ direction: 'bottom' }); }
        }));
        toolbar.append(new Ui.Button({
            text: 'linear',
            onpressed: function () { return transitionbox.ease = 'linear'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'bounce',
            onpressed: function () { return transitionbox.ease = 'bounce'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'elastic',
            onpressed: function () { return transitionbox.ease = 'elastic'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'power',
            onpressed: function () { return transitionbox.ease = 'power'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'power out',
            onpressed: function () { return transitionbox.ease = new Anim.PowerEase({ mode: 'out' }); }
        }));
        var transitionbox = new Ui.TransitionBox({
            transition: 'fade', duration: 0.5
        });
        vbox.append(transitionbox, true);
        var page1 = new Ui.LBox({
            content: [
                new Ui.Rectangle({ fill: 'lightblue' }),
                new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 1', verticalAlign: 'center', horizontalAlign: 'center' })
            ]
        });
        transitionbox.append(page1);
        var page2 = new Ui.LBox({
            content: [
                new Ui.Rectangle({ fill: 'lightgreen' }),
                new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 2', verticalAlign: 'center', horizontalAlign: 'center' })
            ]
        });
        transitionbox.append(page2);
        return _this;
    }
    return App;
}(Ui.App));
new App();
