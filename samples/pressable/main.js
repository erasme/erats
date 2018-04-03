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
        var vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 5 });
        _this.content = vbox;
        var count = 0;
        var activateCount = 0;
        var delayedCount = 0;
        var label = new Ui.Label({ text: 'press count: 0' });
        vbox.append(label);
        var label2 = new Ui.Label({ text: 'activate count: 0' });
        vbox.append(label2);
        var label3 = new Ui.Label({ text: 'delayed press count: 0' });
        vbox.append(label3);
        var rectangle = new Ui.Rectangle({
            width: 100, height: 100, fill: 'lightblue', horizontalAlign: 'center'
        });
        var pressable = new Ui.Pressable({
            onpressed: function () { return label.text = "press count: " + ++count; },
            onactivated: function () { return label2.text = "activate count: " + ++activateCount; },
            ondelayedpress: function () { return label3.text = "delayed press count: " + ++delayedCount; },
            ondowned: function () { return rectangle.fill = 'blue'; },
            onupped: function () { return rectangle.fill = 'lightblue'; },
            content: rectangle
        });
        vbox.append(pressable);
        return _this;
    }
    return App;
}(Ui.App));
new App();
