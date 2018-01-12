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
        toolbar.append(new Ui.Button({
            text: 'horizontal',
            onpressed: function () { return paned.orientation = 'horizontal'; }
        }));
        toolbar.append(new Ui.Button({
            text: 'vertical',
            onpressed: function () { return paned.orientation = 'vertical'; }
        }));
        var paned = new Ui.Paned();
        vbox.append(paned, true);
        var scroll = new Ui.ScrollingArea();
        paned.content1 = scroll;
        //paned.setContent1(new Ui.Rectangle({ fill: 'lightblue', width: 200, height: 200 }));
        //paned.setContent1(new Ui.Text({
        //	margin: 5,
        //	text: 'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n'+
        //		'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters'
        //}));
        scroll.content = new Ui.Text({
            margin: 5,
            text: 'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n' +
                'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n' +
                'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n'
        });
        paned.content2 = new Ui.Rectangle({ fill: 'orange', width: 100, height: 100 });
        return _this;
    }
    return App;
}(Ui.App));
new App();
