"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Selectionable = /** @class */ (function (_super) {
    __extends(Selectionable, _super);
    function Selectionable(init) {
        var _this = _super.call(this, init) || this;
        _this.content = new Ui.Rectangle({ fill: 'orange' });
        _this.selectedMark = new Ui.Icon({
            icon: 'check', fill: '#40d9f1', width: 24, height: 24,
            verticalAlign: 'top', horizontalAlign: 'right'
        });
        _this.selectedMark.hide();
        _this.append(_this.selectedMark);
        new Ui.SelectionableWatcher({
            element: _this,
            selectionActions: _this.getSelectionActions(),
            onselected: function () { return _this.selectedMark.show(); },
            onunselected: function () { return _this.selectedMark.hide(); }
        });
        return _this;
    }
    Selectionable.prototype.onItemDelete = function () {
        Ui.Toast.send('Item deleted');
    };
    Selectionable.prototype.onItemEdit = function () {
        Ui.Toast.send('Item edited');
    };
    Selectionable.prototype.onSelect = function () {
        this.selectedMark.show();
    };
    Selectionable.prototype.onUnselect = function () {
        this.selectedMark.hide();
    };
    Selectionable.prototype.getSelectionActions = function () {
        var _this = this;
        return {
            remove: {
                text: 'Remove', icon: 'trash', multiple: false,
                callback: function () { return _this.onItemDelete(); }
            },
            edit: {
                "default": true, multiple: false,
                text: 'Edit', icon: 'edit',
                callback: function () { return _this.onItemEdit(); }
            }
        };
    };
    return Selectionable;
}(Ui.LBox));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.selection.changed.connect(function () {
            if (_this.selection.elements.length === 0)
                _this.contextBar.hide();
            else
                _this.contextBar.show();
        });
        var vbox = new Ui.VBox();
        _this.content = vbox;
        _this.contextBar = new Ui.ContextBar({ selection: _this.selection });
        _this.contextBar.hide();
        vbox.append(_this.contextBar);
        var flow = new Ui.Flow().assign({ margin: 20 });
        for (var i = 0; i < 20; i++) {
            var selectionable = new Selectionable().assign({
                width: 50, height: 50, margin: 10,
                verticalAlign: 'center', horizontalAlign: 'center'
            });
            flow.append(selectionable);
        }
        vbox.append(new Ui.SelectionArea().assign({
            content: flow
        }), true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
