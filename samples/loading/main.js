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
        var loading = new Ui.Loading();
        var checkbox = new Ui.CheckBox();
        var slider = new Ui.Slider();
        _this.content = new Ui.VBox().assign({
            content: [
                new Ui.ToolBar().assign({
                    verticalAlign: 'top',
                    content: [
                        checkbox.assign({
                            value: true,
                            content: new Ui.Label().assign({ text: 'infinite' }),
                            onchanged: function () {
                                if (checkbox.value)
                                    loading.value = 'infinite';
                                else
                                    loading.value = slider.value;
                            }
                        }),
                        slider.assign({
                            width: 200,
                            onchanged: function () {
                                if (!checkbox.value)
                                    loading.value = slider.value;
                            }
                        })
                    ]
                }),
                loading.assign({
                    resizable: true,
                    width: 48, height: 48,
                    verticalAlign: 'center', horizontalAlign: 'center'
                })
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
