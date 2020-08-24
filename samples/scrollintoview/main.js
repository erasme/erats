"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
        var el = new Ui.Rectangle();
        _this.content = new Ui.HBox().assign({
            content: [
                new Ui.Button().assign({
                    text: 'click for scroll',
                    verticalAlign: 'center',
                    horizontalAlign: 'center',
                    resizable: true,
                    onpressed: function () { return el.scrollIntoView(); }
                }),
                new Ui.ScrollingArea().assign({
                    resizable: true,
                    content: new Ui.VBox().assign({
                        content: [
                            new Ui.Rectangle().assign({ fill: 'orange', height: 400 }),
                            new Ui.Rectangle().assign({ fill: 'lightgreen', height: 400 }),
                            new Ui.Rectangle().assign({ fill: 'purple', height: 400 }),
                            el.assign({ fill: 'red', width: 50, height: 50, margin: 50 }),
                            new Ui.Rectangle().assign({ fill: 'lightblue', height: 400 }),
                            new Ui.Rectangle().assign({ fill: 'pink', height: 400 })
                        ]
                    })
                })
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
