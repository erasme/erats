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
        var greenRect = new Ui.Rectangle();
        var box = new Ui.Box();
        _this.content = new Ui.VBox().assign({
            content: [
                new Ui.ToolBar().assign({
                    content: [
                        new Ui.Button().assign({
                            resizable: true,
                            text: 'change orientation',
                            onpressed: function () {
                                if (box.orientation == 'horizontal')
                                    box.orientation = 'vertical';
                                else
                                    box.orientation = 'horizontal';
                            }
                        }),
                        new Ui.Button().assign({
                            text: 'change uniform',
                            resizable: true,
                            onpressed: function () { return box.uniform = !box.uniform; }
                        }),
                        new Ui.Button().assign({
                            text: 'change resizable (green)',
                            resizable: true,
                            onpressed: function () { return greenRect.resizable = !greenRect.resizable; }
                        })
                    ]
                }),
                box.assign({
                    resizable: true,
                    content: [
                        new Ui.Rectangle().assign({ width: 50, height: 50, fill: 'lightblue' }),
                        greenRect.assign({ width: 100, height: 100, fill: 'lightgreen' }),
                        new Ui.Rectangle().assign({ width: 50, height: 50, fill: 'orange' })
                    ]
                })
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
