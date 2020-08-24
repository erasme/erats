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
        var textfield = new Ui.TextField().assign({
            verticalAlign: 'center', margin: 40, value: 'Hello World !'
        });
        _this.content = new Ui.VBox().assign({
            content: [
                new Ui.ToolBar().assign({
                    content: [
                        new Ui.Button().assign({
                            text: 'Send toast',
                            onpressed: function () { return Ui.Toast.send(textfield.value); }
                        }),
                        new Ui.Button().assign({
                            text: 'Send delayed toast',
                            onpressed: function () { return new Core.DelayedTask(2, function () { return Ui.Toast.send(textfield.value + ' DELAY'); }); }
                        }),
                        new Ui.Button().assign({
                            text: 'Open dialog',
                            onpressed: function () {
                                var dialog = new Ui.Dialog({
                                    title: 'Dialog box',
                                    preferredWidth: 600,
                                    preferredHeight: 600,
                                    cancelButton: new Ui.DialogCloseButton()
                                });
                                dialog.content = new Ui.Button({
                                    text: 'Send toast',
                                    verticalAlign: 'center',
                                    horizontalAlign: 'center',
                                    onpressed: function () { return Ui.Toast.send('Dialog toast'); }
                                });
                                dialog.open();
                            }
                        })
                    ]
                }),
                textfield
            ]
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
