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
var ListViewBoolCell = /** @class */ (function (_super) {
    __extends(ListViewBoolCell, _super);
    function ListViewBoolCell() {
        var _this = _super.call(this) || this;
        _this.clipToBounds = true;
        _this.ui = new Ui.Rectangle({
            margin: 8, width: 16, height: 16,
            horizontalAlign: 'center', verticalAlign: 'center'
        });
        _this.append(_this.ui);
        return _this;
    }
    ListViewBoolCell.prototype.onValueChange = function (value) {
        if (value)
            this.ui.fill = '#60e270';
        else
            this.ui.fill = '#E84D4D';
    };
    return ListViewBoolCell;
}(Ui.ListViewCell));
var Logs = /** @class */ (function (_super) {
    __extends(Logs, _super);
    function Logs(init) {
        var _this = _super.call(this, init) || this;
        _this.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
        _this.scrolling = new Ui.ScrollingArea();
        _this.append(_this.scrolling, true);
        _this.logs = new Ui.VBox();
        _this.scrolling.content = _this.logs;
        return _this;
    }
    Logs.prototype.log = function (text, color) {
        if (color === void 0) { color = 'black'; }
        this.logs.prepend(new Ui.Label({ text: text, color: color, horizontalAlign: 'left' }));
    };
    return Logs;
}(Ui.VBox));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar({ margin: 10 });
        vbox.append(toolbar);
        toolbar.append(new Ui.CheckBox({
            text: 'show headers', value: true, width: 200,
            onchanged: function (e) {
                if (e.value)
                    listview.showHeaders();
                else
                    listview.hideHeaders();
            }
        }));
        toolbar.append(new Ui.CheckBox({
            text: 'data scrolled (best perf)', value: true, width: 250,
            onchanged: function (e) { return listview.scrolled = e.value; }
        }));
        toolbar.append(new Ui.Button({
            text: 'set 1500', verticalAlign: 'center',
            onpressed: function () {
                var data = [];
                for (var i = 0; i < 1500; i++) {
                    data.push({
                        data0: ((i % 3) === 0),
                        data1: 'hi number ' + i,
                        data2: 'col 2 ' + i,
                        data3: Math.floor(Math.random() * 50),
                        data4: i
                    });
                }
                listview.data = data;
            }
        }));
        toolbar.append(new Ui.Button({
            text: 'clear all', verticalAlign: 'center',
            onpressed: function () { return listview.clearData(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'append 70', verticalAlign: 'center',
            onpressed: function () {
                var count = listview.data.length;
                for (var i = 0; i < 70; i++) {
                    listview.appendData({
                        data0: ((i % 3) === 0),
                        data1: 'hi number ' + i,
                        data2: 'col 2 ' + i,
                        data3: Math.floor(Math.random() * 50),
                        data4: count + i
                    });
                }
            }
        }));
        toolbar.append(new Ui.Button({
            text: 'update numbers', verticalAlign: 'center',
            onpressed: function () {
                var data = listview.data;
                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    data[i].data3 = Math.floor(Math.random() * 50);
                }
                listview.updateData();
            }
        }));
        var hbox = new Ui.HBox({ spacing: 5 });
        vbox.append(hbox, true);
        var scroll = new Ui.ScrollingArea();
        hbox.append(scroll, true);
        var listview = new Ui.ListView({
            margin: 0,
            scrolled: true,
            headers: [
                { type: 'string', title: 'Data 0', key: 'data0', width: 40, ui: ListViewBoolCell },
                { type: 'string', title: 'Data 1', key: 'data1', width: 200 },
                { type: 'string', title: 'Data 2', key: 'data2', width: 200 },
                { type: 'string', title: 'Numbers', key: 'data3' },
                { type: 'string', title: 'Pos', key: 'data4' }
            ],
            onactivated: function (e) { return logs.log('activate row: ' + e.value); }
        });
        scroll.content = listview;
        for (var i = 0; i < 50; i++) {
            listview.appendData({
                data0: ((i % 3) === 0),
                data1: 'hi number ' + i,
                data2: 'col 2 ' + i,
                data3: Math.floor(Math.random() * 50),
                data4: i
            });
        }
        var logs = new Logs({ width: 250 });
        hbox.append(logs);
        return _this;
    }
    return App;
}(Ui.App));
new App();
