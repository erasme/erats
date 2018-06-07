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
//////////////////
var Combo2 = /** @class */ (function (_super) {
    __extends(Combo2, _super);
    function Combo2() {
        var _this = _super.call(this) || this;
        _this._field = 'name';
        _this._data = [];
        _this._position = -1;
        _this._placeHolder = '...';
        _this.search = false;
        _this.changed = new Core.Events();
        _this.text = '';
        _this.arrowbottom = new Ui.Icon({ icon: 'arrowbottom', width: 16, height: 16 });
        _this.marker = new Ui.VBox({
            verticalAlign: 'center', marginRight: 5,
            content: [_this.arrowbottom]
        });
        return _this;
    }
    Object.defineProperty(Combo2.prototype, "onchanged", {
        set: function (value) { this.changed.connect(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Combo2.prototype, "placeHolder", {
        set: function (placeHolder) {
            this._placeHolder = placeHolder;
            if (this._position === -1)
                this.text = this._placeHolder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Combo2.prototype, "field", {
        set: function (field) {
            this._field = field;
            if (this._data !== undefined)
                this.data = this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Combo2.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Combo2.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (position) {
            if (position === -1) {
                this._position = -1;
                this._current = undefined;
                this.text = this._placeHolder;
                this.changed.fire({ target: this, value: this._current, position: this._position });
            }
            else if ((position >= 0) && (position < this._data.length)) {
                this._current = this._data[position];
                this._position = position;
                this.text = this._current[this._field];
                this.changed.fire({ target: this, value: this._current, position: this._position });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Combo2.prototype, "current", {
        get: function () {
            return this._current;
        },
        set: function (current) {
            if (current == undefined)
                this.position = -1;
            var position = -1;
            for (var i = 0; i < this._data.length; i++) {
                if (this._data[i] == current) {
                    position = i;
                    break;
                }
            }
            if (position != -1)
                this.position = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Combo2.prototype, "value", {
        get: function () {
            return this._current;
        },
        enumerable: true,
        configurable: true
    });
    Combo2.prototype.onItemPress = function (popup, item, position, value) {
        this.position = position;
    };
    Combo2.prototype.onPress = function () {
        var _this = this;
        var popup = new ComboPopup2().assign({
            field: this._field, data: this._data, search: this.search
        });
        if (this._position !== -1)
            popup.position = this._position;
        popup.item.connect(function (e) { return _this.onItemPress(e.target, e.item, e.position, e.value); });
        popup.openElement(this, 'bottom');
    };
    Combo2.prototype.updateColors = function () {
        _super.prototype.updateColors.call(this);
        this.arrowbottom.fill = this.getForegroundColor();
    };
    Combo2.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        this.arrowbottom.opacity = 0.1;
    };
    Combo2.prototype.onEnable = function () {
        _super.prototype.onEnable.call(this);
        this.arrowbottom.opacity = 1;
    };
    Combo2.style = {
        textTransform: 'none',
        textAlign: 'left'
    };
    return Combo2;
}(Ui.Button));
var StaticElementLoader = /** @class */ (function (_super) {
    __extends(StaticElementLoader, _super);
    function StaticElementLoader(elements) {
        var _this = _super.call(this) || this;
        _this.elements = elements;
        return _this;
    }
    StaticElementLoader.prototype.signalChange = function () {
        this.changed.fire({ target: this });
    };
    StaticElementLoader.prototype.getMin = function () {
        return 0;
    };
    StaticElementLoader.prototype.getMax = function () {
        return this.elements.length - 1;
    };
    StaticElementLoader.prototype.getElementAt = function (position) {
        return this.elements[position];
    };
    return StaticElementLoader;
}(Ui.ScrollLoader));
var ComboItemLoader = /** @class */ (function (_super) {
    __extends(ComboItemLoader, _super);
    function ComboItemLoader(popup) {
        var _this = _super.call(this) || this;
        _this.popup = popup;
        return _this;
    }
    ComboItemLoader.prototype.signalChange = function () {
        this.changed.fire({ target: this });
    };
    ComboItemLoader.prototype.getMin = function () {
        return this.popup.getMin();
    };
    ComboItemLoader.prototype.getMax = function () {
        return this.popup.getMax();
    };
    ComboItemLoader.prototype.getElementAt = function (position) {
        return this.popup.getElementAt(position);
    };
    return ComboItemLoader;
}(Ui.ScrollLoader));
var ComboPopup2 = /** @class */ (function (_super) {
    __extends(ComboPopup2, _super);
    function ComboPopup2() {
        var _this = _super.call(this) || this;
        _this._search = true;
        _this._data = [];
        _this._filteredData = [];
        _this._field = 'name';
        _this.loader = new ComboItemLoader(_this);
        _this.item = new Core.Events();
        _this.autoClose = true;
        _this.searchField = new Ui.TextField({ textHolder: 'Recherche', margin: 5 });
        _this.searchField.changed.connect(function (e) { return _this.onSearchChange(e.target, e.value); });
        _this.list = new Ui.VBoxScrollingArea();
        _this.list.loader = _this.loader;
        //this.list.width = 120;
        _this.content = _this.list;
        return _this;
    }
    ComboPopup2.prototype.onSearchChange = function (field, value) {
        this.updateFilteredData();
        console.log("onSearchChange " + value + " (total: " + this._data.length + ", filter: " + this._filteredData.length + ")");
        this.loader.signalChange();
    };
    ComboPopup2.prototype.updateFilteredData = function () {
        var value = this.searchField.value;
        console.log("updateFilteredData " + value);
        var search = Core.Util.toNoDiacritics(value).toLowerCase().split(' ');
        if (value == '' || search.length == 0)
            this._filteredData = this._data.map(function (v, index) { return { value: v, position: index }; });
        else {
            this._filteredData = [];
            var position = 0;
            for (var _i = 0, _a = this._data; _i < _a.length; _i++) {
                var data = _a[_i];
                var text = Core.Util.toNoDiacritics(data[this._field]).toLocaleLowerCase();
                var match = true;
                for (var i = 0; match && (i < search.length); i++) {
                    var word = search[i];
                    match = (text.indexOf(word) != -1);
                }
                if (match)
                    this._filteredData.push({ value: data, position: position });
                position++;
            }
        }
    };
    Object.defineProperty(ComboPopup2.prototype, "search", {
        set: function (value) {
            this._search = value;
            if (this.list.loader)
                this.list.loader.changed.fire({ target: this.list.loader });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComboPopup2.prototype, "field", {
        set: function (field) {
            this._field = field;
            if (this._data !== undefined)
                this.data = this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComboPopup2.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
            if (this._field === undefined)
                return;
            this.updateFilteredData();
            this.loader.signalChange();
        },
        enumerable: true,
        configurable: true
    });
    ComboPopup2.prototype.getMin = function () {
        return 0;
    };
    ComboPopup2.prototype.getMax = function () {
        return this._filteredData.length + (this._search ? 0 : -1);
    };
    ComboPopup2.prototype.getElementAt = function (position) {
        var _this = this;
        //console.log(`getElementAt(${position})`);
        if (this._search && position == 0)
            return this.searchField;
        if (this._search)
            position--;
        //console.log(`getElementAt(${position}) => ${this._filteredData[position]}`);
        var value = this._filteredData[position];
        var item = new Ui.ComboItem().assign({
            text: value.value[this._field],
            isActive: this._position != undefined && value.position == this._position,
            onpressed: function (e) { return _this.onItemPress(e.target); }
        });
        item['Combo.data'] = value.value;
        item['Combo.position'] = value.position;
        return item;
    };
    Object.defineProperty(ComboPopup2.prototype, "position", {
        set: function (position) {
            this._position = position;
        },
        enumerable: true,
        configurable: true
    });
    ComboPopup2.prototype.onItemPress = function (item) {
        var data = item['Combo.data'];
        var position = item['Combo.position'];
        console.log("onItemPress position: " + position);
        console.log(item);
        this.item.fire({ target: this, item: item, position: position, value: data });
        this.close();
    };
    return ComboPopup2;
}(Ui.MenuPopup));
//////////////////
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        _this.content = vbox;
        var data = [];
        for (var i = 0; i < 2500; i++)
            data.push({ text: 'item ' + i, id: i });
        var combo = new Combo2().assign({
            field: 'text', data: data, placeHolder: 'choice...', search: true
        });
        vbox.append(combo);
        combo.changed.connect(function (e) {
            console.log('Combo change: ' + e.value.text);
            Ui.Toast.send(e.value.text);
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
//# sourceMappingURL=main.js.map