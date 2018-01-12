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
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(init) {
        var _this = _super.call(this, init) || this;
        _this.rect = new Ui.Rectangle({ width: 150, height: 150 });
        _this.append(_this.rect);
        _this.draggableData = _this;
        if (init) {
            if (init.fill !== undefined)
                _this.fill = init.fill;
        }
        return _this;
    }
    Object.defineProperty(Item.prototype, "fill", {
        set: function (color) {
            this.rect.fill = color;
        },
        enumerable: true,
        configurable: true
    });
    return Item;
}(Ui.Draggable));
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var scroll = new Ui.ScrollingArea();
        _this.content = scroll;
        _this.container = new Ui.SFlowDropBox({
            spacing: 20, margin: 20,
            stretchMaxRatio: 2, itemAlign: 'stretch',
            ondroppedat: function (e) { return _this.onDropAt(_this.container, e.data, e.effect, e.position, e.x, e.y); }
        });
        _this.container.addType(Item, _this.onDragEffect);
        _this.container.addType('files', _this.onDragEffect);
        scroll.content = _this.container;
        _this.container.append(new Item({ width: 150, height: 150, fill: 'red' }));
        _this.container.append(new Item({ width: 150, height: 150, fill: 'green' }));
        _this.container.append(new Item({ width: 150, height: 150, fill: 'pink' }));
        _this.container.append(new Item({ width: 250, height: 150, fill: 'purple' }));
        _this.container.append(new Item({ width: 150, height: 150, fill: 'brown' }));
        _this.container.append(new Item({ width: 150, height: 150, fill: 'orange' }));
        _this.container.append(new Item({ width: 150, height: 150, fill: 'lightblue' }));
        return _this;
    }
    App.prototype.onDragEffect = function (data, pos) {
        console.log("testFunction data: " + data + ", pos: " + pos);
        if ((pos === 0) || (pos === 1) || (pos === 7))
            return [];
        else if (pos === 4)
            return [{ action: 'copy' }];
        else
            return [{ action: 'move' }];
    };
    App.prototype.onDropAt = function (dropbox, data, effect, pos, x, y) {
        console.log("onDropAt data: " + data + ", effect: " + effect + ", pos: " + pos + ", coord: " + x + "," + y);
    };
    return App;
}(Ui.App));
new App();
