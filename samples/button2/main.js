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
        var iconName = 'exit';
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        toolbar.append(new Ui.Button({
            text: 'vertical',
            onpressed: function () { return button.orientation = 'vertical'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'horizontal',
            onpressed: function () { return button.orientation = 'horizontal'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'text',
            onpressed: function () {
                button.text = 'click me';
                button.icon = undefined;
            }
        }));
        toolbar.append(new Ui.Button({
            text: 'icon',
            onpressed: function () {
                button.text = undefined;
                button.icon = iconName;
            }
        }));
        toolbar.append(new Ui.Button({
            text: 'text + icon',
            onpressed: function () {
                button.text = 'click me';
                button.icon = iconName;
            }
        }));
        toolbar.append(new Ui.Button({
            text: 'enable',
            onpressed: function () { return button.enable(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'disable',
            onpressed: function () { return button.disable(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'badge',
            onpressed: function () { return button.badge = '12'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'marker',
            onpressed: function () {
                button.marker = new Ui.Icon({
                    verticalAlign: 'center', horizontalAlign: 'center',
                    icon: 'arrowbottom', width: 16, height: 16, marginRight: 5
                });
            }
        }));
        toolbar.append(new Ui.Button({
            text: '200 width',
            onpressed: function () { return button.width = 200; }
        }));
        toolbar.append(new Ui.Button({
            text: 'auto width',
            onpressed: function () { return button.width = undefined; }
        }));
        var toolbar2 = new Ui.ToolBar();
        vbox.append(toolbar2);
        toolbar2.append(new Ui.Button({
            text: 'default',
            onpressed: function () {
                button.style = undefined;
                toolbar2.style = undefined;
            }
        }));
        for (var i = 0; i < App.buttonStyles.length; i++) {
            var style = App.buttonStyles[i];
            var styleButton = new Ui.Button({
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
        var button = new Ui.Button({
            icon: 'exit', text: 'click me', orientation: 'horizontal',
            verticalAlign: 'center', horizontalAlign: 'center',
            onpressed: function () { return Ui.Toast.send('button pressed'); }
        });
        vbox.append(button, true);
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
