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
var Item1 = /** @class */ (function (_super) {
    __extends(Item1, _super);
    function Item1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Item1;
}(Ui.Draggable));
var Item2 = /** @class */ (function (_super) {
    __extends(Item2, _super);
    function Item2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Item2;
}(Ui.Draggable));
var DropBox1 = /** @class */ (function (_super) {
    __extends(DropBox1, _super);
    function DropBox1() {
        var _this = _super.call(this) || this;
        _this.background = new Ui.Rectangle({ fill: 'lightgreen' });
        _this.append(_this.background);
        _this.append(new Ui.Frame({ frameWidth: 2, fill: 'black' }));
        _this.addType('files', ['copy', 'move']);
        _this.addType(Ui.Draggable, [
            { action: 'copy', text: 'Copier', primary: true },
            { action: 'move', text: 'Déplacer', secondary: true }
        ]);
        return _this;
    }
    DropBox1.prototype.onDragEnter = function () {
        this.background.fill = 'orange';
    };
    DropBox1.prototype.onDragLeave = function () {
        this.background.fill = 'lightgreen';
    };
    return DropBox1;
}(Ui.DropBox));
var DropBox2 = /** @class */ (function (_super) {
    __extends(DropBox2, _super);
    function DropBox2() {
        var _this = _super.call(this) || this;
        _this.background = new Ui.Rectangle({ fill: 'lightgreen' });
        _this.append(_this.background);
        _this.border = new Ui.Frame({ frameWidth: 2, fill: 'black' });
        _this.append(_this.border);
        _this.addType('text', ['copy']);
        _this.addType(Item1, [
            { action: 'copy', text: 'Copier', dragicon: 'dragcopy' },
            { action: 'warn', text: 'Attention', dragicon: 'warning' }
        ]);
        return _this;
    }
    DropBox2.prototype.onDragEnter = function () {
        this.background.fill = 'pink';
    };
    DropBox2.prototype.onDragLeave = function () {
        this.background.fill = 'lightgreen';
    };
    return DropBox2;
}(Ui.DropBox));
var DropBox3 = /** @class */ (function (_super) {
    __extends(DropBox3, _super);
    function DropBox3() {
        var _this = _super.call(this) || this;
        _this.background = new Ui.Rectangle({ fill: 'lightgreen' });
        _this.append(_this.background);
        _this.border = new Ui.Frame({ frameWidth: 2, fill: 'black' });
        _this.append(_this.border);
        _this.addType(Item1, ['link']);
        return _this;
    }
    DropBox3.prototype.onDragEnter = function () {
        this.background.fill = 'pink';
    };
    DropBox3.prototype.onDragLeave = function () {
        this.background.fill = 'lightgreen';
    };
    return DropBox3;
}(Ui.DropBox));
var app = new Ui.App();
var vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 20 });
app.content = vbox;
var hbox = new Ui.HBox({ horizontalAlign: 'center', spacing: 20 });
vbox.append(hbox);
var item1 = new Item1({ width: 64, height: 64 });
item1.setAllowedMode(['copy', 'link', 'move', 'warn']);
item1.draggableData = item1;
item1.append(new Ui.Rectangle({ fill: 'lightblue' }));
item1.append(new Ui.Label({ text: 'drag me', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 }));
hbox.append(item1);
var item2 = new Item2({ width: 64, height: 64 });
item2.draggableData = item2;
item2.append(new Ui.Rectangle({ fill: 'rgb(255, 122, 255)' }));
item2.append(new Ui.Label({ text: 'drag me', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 }));
hbox.append(item2);
var dropbox = new DropBox1();
dropbox.width = 200;
dropbox.height = 200;
var droplabel = new Ui.Label({ text: 'drop here', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 });
dropbox.append(droplabel);
vbox.append(dropbox);
dropbox.droppedfile.connect(function () {
    console.log('dropfile');
    return false;
});
dropbox.dropped.connect(function (e) {
    console.log('drop effect: ' + e.effect);
    droplabel.text = e.data.toString();
    new Core.DelayedTask(2, function () { return droplabel.text = 'drop here'; });
});
var dropbox2 = new DropBox2();
dropbox2.height = 50;
dropbox2.margin = 10;
dropbox2.verticalAlign = 'bottom';
var droplabel2 = new Ui.Label();
droplabel2.text = 'drop here';
droplabel2.horizontalAlign = 'center';
droplabel2.verticalAlign = 'center';
droplabel2.margin = 10;
dropbox2.append(droplabel2);
dropbox.append(dropbox2);
dropbox2.dropped.connect(function (e) {
    droplabel2.text = e.data.toString();
    new Core.DelayedTask(2, function () { return droplabel2.text = 'drop here'; });
});
var dropbox3 = new DropBox3();
dropbox3.height = 50;
dropbox3.margin = 10;
dropbox3.verticalAlign = 'bottom';
var droplabel3 = new Ui.Label({ text: 'drop here', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 });
dropbox3.append(droplabel3);
vbox.append(dropbox3);
dropbox3.dropped.connect(function (e) {
    droplabel3.text = e.data.toString();
    new Core.DelayedTask(2, function () { return droplabel3.text = 'drop here'; });
});
