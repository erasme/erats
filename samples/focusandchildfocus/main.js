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
        var main = new Ui.LBox();
        var frame = new Ui.Frame();
        new Ui.FocusInWatcher({
            element: main,
            onfocusin: function () {
                console.log('main focusin');
                frame.frameWidth = 1;
            },
            onfocusout: function () {
                console.log('main focusout');
                frame.frameWidth = 0;
            }
        });
        var textField = new Ui.TextField();
        new Ui.FocusInWatcher({
            element: textField,
            onfocusin: function () { return console.log('textfield focusin'); },
            onfocusout: function () { return console.log('textfield focusout'); }
        });
        _this.content = main.assign({
            horizontalAlign: 'center', verticalAlign: 'center',
            content: [
                frame.assign({
                    fill: 'red', frameWidth: 0
                }),
                new Ui.VBox().assign({
                    width: 300, spacing: 10, margin: 5,
                    content: [
                        textField,
                        new Ui.Button().assign({
                            text: 'Click Me',
                            onfocused: function () { return console.log('button focus'); },
                            onblurred: function () { return console.log('button blur'); },
                        })
                    ]
                })
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
