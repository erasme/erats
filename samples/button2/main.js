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
        var iconName = 'exit';
        var toolbar2 = new Ui.ToolBar().assign({
            content: [
                new Ui.Button().assign({
                    text: 'default',
                    onpressed: function () {
                        button.style = undefined;
                        toolbar2.style = undefined;
                    }
                })
            ]
        });
        var button = new Ui.Button().assign({
            resizable: true,
            icon: 'exit', text: 'click me', orientation: 'horizontal',
            verticalAlign: 'center', horizontalAlign: 'center',
            onpressed: function () { return Ui.Toast.send('button pressed'); }
        });
        _this.content = new Ui.VBox().assign({
            content: [
                new Ui.ToolBar().assign({
                    content: [
                        new Ui.Button().assign({
                            text: 'vertical',
                            onpressed: function () { return button.orientation = 'vertical'; }
                        }),
                        new Ui.Button().assign({
                            text: 'horizontal',
                            onpressed: function () { return button.orientation = 'horizontal'; }
                        }),
                        new Ui.Button().assign({
                            text: 'text',
                            onpressed: function () {
                                button.text = 'click me';
                                button.icon = undefined;
                            }
                        }),
                        new Ui.Button().assign({
                            text: 'icon',
                            onpressed: function () {
                                button.text = undefined;
                                button.icon = iconName;
                            }
                        }),
                        new Ui.Button().assign({
                            text: 'text + icon',
                            onpressed: function () {
                                button.text = 'click me';
                                button.icon = iconName;
                            }
                        }),
                        new Ui.Button().assign({
                            text: 'enable',
                            onpressed: function () { return button.enable(); }
                        }),
                        new Ui.Button().assign({
                            text: 'disable',
                            onpressed: function () { return button.disable(); }
                        }),
                        new Ui.Button().assign({
                            text: 'badge',
                            onpressed: function () { return button.badge = '12'; }
                        }),
                        new Ui.Button().assign({
                            text: 'marker',
                            onpressed: function () {
                                button.marker = new Ui.Icon({
                                    verticalAlign: 'center', horizontalAlign: 'center',
                                    icon: 'arrowbottom', width: 16, height: 16, marginRight: 5
                                });
                            }
                        }),
                        new Ui.Button().assign({
                            text: '200 width',
                            onpressed: function () { return button.width = 200; }
                        }),
                        new Ui.Button().assign({
                            text: 'auto width',
                            onpressed: function () { return button.width = undefined; }
                        })
                    ]
                }),
                toolbar2,
                button
            ]
        });
        for (var i = 0; i < App.buttonStyles.length; i++) {
            var style = App.buttonStyles[i];
            var styleButton = new Ui.Button().assign({
                text: style.name,
                onpressed: function (e) {
                    button.style = e.target['Test.App.styleDef'];
                }
            });
            styleButton['Test.App.styleDef'] = style.style;
            styleButton.style = styleButton['Test.App.styleDef'];
            toolbar2.append(styleButton);
        }
        ;
        return _this;
    }
    App.buttonStyles = [
        {
            name: 'blue',
            style: {
                textAlign: 'left',
                background: Ui.Color.createFromHsl(225, 0.76, 1),
                backgroundBorder: Ui.Color.createFromHsl(225, 0.76, 0.5),
                foreground: Ui.Color.createFromHsl(225, 0.76, 3)
            }
        },
        {
            name: 'green',
            style: {
                background: Ui.Color.createFromHsl(109, 0.76, 1),
                backgroundBorder: Ui.Color.createFromHsl(109, 0.76, 0.5),
                foreground: Ui.Color.createFromHsl(109, 0.76, 0.4)
            }
        },
        {
            name: 'red',
            style: {
                background: Ui.Color.createFromHsl(2, 0.76, 0.8),
                backgroundBorder: Ui.Color.createFromHsl(2, 0.76, 0.4),
                foreground: Ui.Color.createFromHsl(2, 0.76, 5)
            }
        },
        {
            name: 'white',
            style: {
                background: Ui.Color.createFromRgb(1, 1, 1)
            }
        },
        {
            name: 'black',
            style: {
                background: Ui.Color.createFromHsl(0, 0, 0.5),
                backgroundBorder: Ui.Color.createFromHsl(0, 0, 0),
                foreground: Ui.Color.createFromHsl(0, 0, 0.9)
            }
        },
        {
            name: 'laclasse',
            style: {
                background: Ui.Color.createFromHsl(197, 1, 0.87),
                backgroundBorder: Ui.Color.createFromHsl(197, 1, 0.4),
                foreground: Ui.Color.createFromHsl(197, 1, 10)
            }
        },
        {
            name: 'dark blue',
            style: {
                background: Ui.Color.createFromHsl(225, 0.81, 0.45),
                backgroundBorder: Ui.Color.createFromHsl(225, 0.81, 0.1),
                foreground: Ui.Color.createFromHsl(225, 0.4, 1)
            }
        },
        {
            name: 'transparent',
            style: {
                background: Ui.Color.createFromHsl(0, 0, 1, 0),
                backgroundBorder: Ui.Color.createFromHsl(0, 0, 1, 0),
                foreground: Ui.Color.createFromHsl(0, 0, 0.4)
            }
        }
    ];
    return App;
}(Ui.App));
new App();
