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
        var popup = new Ui.Popup();
        var vbox = new Ui.VBox().assign({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 5 });
        _this.content = vbox;
        var selectable = new Ui.Pressable().assign({
            content: [
                new Ui.Rectangle().assign({ width: 50, height: 50, radius: 8, fill: 'lightgreen' }),
                new Ui.Label().assign({ text: 'click' })
            ],
            onpressed: function (e) {
                console.log("open the menu: " + e.x + "x" + e.y);
                if (e.x && e.y)
                    popup.openAt(e.x, e.y);
            }
        });
        vbox.append(selectable);
        var button = new Ui.Button().assign({
            text: 'open popup',
            onpressed: function (e) { return popup.open(); }
        });
        vbox.append(button);
        popup.content = new Ui.VBox().assign({
            spacing: 5, margin: 10,
            content: [
                new Ui.Label().assign({ text: 'bonjour' }),
                new Ui.Separator(),
                new Ui.Label().assign({ text: 'bonjour2' }),
                new Ui.Separator(),
                new Ui.Label().assign({ text: 'bonjour3' }),
                new Ui.Separator(),
                new Ui.Button().assign({ text: 'click me' }),
                new Ui.Separator(),
                new Ui.Button().assign({
                    text: 'popup',
                    onpressed: function () {
                        var newPopup = new Ui.Popup({ autoClose: true });
                        var button = new Ui.Button({ text: 'click' });
                        newPopup.content = button;
                        newPopup.open();
                    }
                })
            ]
        });
        vbox.append(new Ui.Button().assign({
            text: 'close popup',
            onpressed: function () { return popup.close(); }
        }));
        vbox.append(new Ui.Pressable().assign({
            content: [
                new Ui.Rectangle().assign({ width: 50, height: 50, radius: 8, fill: 'lightgreen' }),
                new Ui.Label().assign({ text: 'click' })
            ],
            onpressed: function (e) {
                console.log('open the menu at element');
                popup.openElement(e.target);
            }
        }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
