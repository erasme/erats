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
//
// Play with styles
//
/*let styles = [{
    types: [
        {
            type: Ui.Button,
            foreground: 'rgb(100,0,100)',
            borderWidth: 2,
            background: 'rgb(204,0,204)',
            backgroundBorder: 'rgb(100,0,100)'
        },
        {
            type: Ui.ToolBar,
            types: [
                {
                    type: Ui.Button,
                    background: 'rgb(240,240,240)'
                }
            ]
        }
    ]
}];*/
var styles = [
    {
        types: [
            {
                type: Ui.Button,
                foreground: 'rgb(100,0,100)',
                borderWidth: 2,
                background: 'rgb(204,0,204)',
                backgroundBorder: 'rgb(100,0,100)'
            }
        ]
    },
    {
        types: [
            {
                type: Ui.ToolBar,
                types: [
                    {
                        type: Ui.Button,
                        background: 'rgb(240,240,240)'
                    }
                ]
            },
            {
                type: Ui.Button,
                background: 'rgb(28,142,255)'
            }
        ]
    },
    {
        types: [
            {
                type: Ui.Button,
                background: 'rgb(241,177,249)',
                radius: 20
            }
        ]
    },
    {
        types: [
            {
                type: Ui.ToolBar,
                types: [
                    {
                        type: Ui.Button,
                        background: 'rgb(45,173,255)',
                        radius: 0
                    }
                ]
            },
            {
                type: Ui.Button,
                background: 'rgb(255,173,45)'
            }
        ]
    }
];
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var content = new Ui.VBox();
        _this.content = content;
        var toolbar = new Ui.ToolBar();
        toolbar.append(new Ui.Button({ text: 'button1' }));
        toolbar.append(new Ui.Element(), true);
        toolbar.append(new Ui.Label({ text: 'The Title', fontWeight: 'bold' }));
        toolbar.append(new Ui.Element(), true);
        toolbar.append(new Ui.Button({ text: 'button2' }));
        content.append(toolbar);
        var vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 10 });
        content.append(vbox, true);
        vbox.append(new Ui.Button({
            text: 'default', width: 200,
            onpressed: function () { return _this.style = undefined; }
        }));
        var _loop_1 = function (i) {
            var style = styles[i];
            vbox.append(new Ui.Button({
                text: "style" + i, width: 200,
                onpressed: function () { return _this.style = style; }
            }));
        };
        for (var i = 0; i < styles.length; i++) {
            _loop_1(i);
        }
        return _this;
    }
    return App;
}(Ui.App));
new App();
