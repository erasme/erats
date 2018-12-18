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
        var request;
        var text = new Ui.Text();
        toolbar.append(new Ui.Button({
            text: 'send',
            onpressed: function () {
                request = new Core.HttpRequest({
                    url: 'service.php', method: 'POST',
                    arguments: { toto: 12, dan: 'super', complex: { t1: 1, t2: 2 } },
                    ondone: function () { return text.text = request.responseText; }
                });
                request.send();
            }
        }));
        vbox.append(text, true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
