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
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var request;
        var sendButton = new Ui.Button({ text: 'send' });
        toolbar.append(sendButton);
        _this.connect(sendButton, 'press', function () {
            request = new Core.HttpRequest({ url: 'service.php', method: 'POST', arguments: { toto: 12, dan: 'super', complex: { t1: 1, t2: 2 } } });
            _this.connect(request, 'done', function () { return text.text = request.responseText; });
            request.send();
        });
        var text = new Ui.Text();
        vbox.append(text, true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
