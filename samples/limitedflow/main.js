"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
        var expandButton = new Ui.Button().assign({
            icon: 'arrowbottom', isVisible: false,
        });
        var limitedFlow = new Ui.LimitedFlow();
        var textField = new Ui.TextField();
        _this.content = new Ui.VBox().assign({
            content: [
                textField.assign({
                    onvalidated: function (e) {
                        if (e.target.value == undefined || e.target.value == '')
                            limitedFlow.maxLines = undefined;
                        else
                            limitedFlow.maxLines = parseInt(e.target.value);
                    }
                }),
                new Ui.CheckBox().assign({
                    content: new Ui.Label().assign({ text: 'uniform' }),
                    onchanged: function (e) {
                        limitedFlow.uniform = e.value;
                    }
                }),
                new Ui.HBox().assign({
                    content: [
                        limitedFlow.assign({
                            oncanexpandchanged: function (e) { return expandButton.isVisible = e.value; },
                            spacing: 10, resizable: true,
                            content: [
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                                new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                                new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                                new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                                new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                                new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                                new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' })
                            ]
                        }),
                        expandButton.assign({
                            onpressed: function () {
                                textField.value = '';
                                limitedFlow.maxLines = undefined;
                            }
                        })
                    ]
                }),
                new Ui.Rectangle().assign({ height: 150, fill: 'green' })
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
