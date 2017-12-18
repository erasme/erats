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
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(init) {
        var _this = _super.call(this, init) || this;
        _this.margin = 5;
        var title = new Ui.Text({ text: init.title });
        _this.append(title);
        var field = new Ui.TextField({ marginLeft: 10 });
        _this.append(field);
        if (init.desc)
            _this.append(new Ui.Text({ text: init.desc, color: '#aaaaaa' }));
        return _this;
    }
    return TextField;
}(Ui.VBox));
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var scroll = new Ui.ScrollingArea();
        _this.content = scroll;
        var flow = new Ui.SFlow({ spacing: 10, itemAlign: 'stretch', stretchMaxRatio: 2 });
        scroll.content = flow;
        flow.append(new Ui.Rectangle({ width: 100, height: 200, fill: 'red' }), 'right');
        flow.append(new Ui.Rectangle({ width: 200, height: 100, fill: 'green' }), 'left');
        var field1 = new TextField({ title: 'Prénom', width: 200 });
        flow.append(field1);
        var field2 = new TextField({ title: 'Nom', width: 200 });
        flow.append(field2);
        var field3 = new TextField({ title: 'Login', width: 200 });
        flow.append(field3, undefined, 'flushleft');
        var field4 = new TextField({ title: 'Password', width: 200 });
        flow.append(field4);
        var field5 = new TextField({
            title: 'A very long title field to see what happends in this case',
            width: 200,
            desc: 'This field is very important. Thanks to fill it'
        });
        flow.append(field5);
        flow.append(new Ui.Rectangle({ width: 250, height: 150, fill: 'pink' }));
        flow.append(new Ui.Rectangle({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }));
        flow.append(new Ui.Rectangle({ width: 150, height: 150, fill: 'brown' }));
        flow.append(new Ui.Rectangle({ width: 200, height: 15, fill: 'orange' }));
        flow.append(new Ui.Rectangle({ width: 150, height: 150, fill: 'lightblue' }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
