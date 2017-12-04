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
var Selectionable = (function (_super) {
    __extends(Selectionable, _super);
    function Selectionable(init) {
        var _this = _super.call(this) || this;
        _this.content = new Ui.Rectangle({ fill: 'orange' });
        _this.selectedMark = new Ui.Icon({
            icon: 'check', fill: '#40d9f1', width: 24, height: 24,
            verticalAlign: 'top', horizontalAlign: 'right'
        });
        _this.selectedMark.hide();
        _this.append(_this.selectedMark);
        _this.draggableData = _this;
        _this.assign(init);
        return _this;
    }
    Selectionable.prototype.onItemDelete = function () {
        Ui.Toast.send('Item deleted');
    };
    Selectionable.prototype.onItemEdit = function () {
        Ui.Toast.send('Item edited');
    };
    Selectionable.prototype.onPress = function () {
        this.isSelected = !this.isSelected;
    };
    Selectionable.prototype.onSelect = function () {
        this.selectedMark.show();
    };
    Selectionable.prototype.onUnselect = function () {
        this.selectedMark.hide();
    };
    Selectionable.prototype.getSelectionActions = function () {
        return {
            remove: {
                text: 'Remove', icon: 'trash',
                scope: this, callback: this.onItemDelete, multiple: false
            },
            edit: {
                "default": true,
                text: 'Edit', icon: 'edit',
                scope: this, callback: this.onItemEdit, multiple: false
            }
        };
    };
    return Selectionable;
}(Ui.Selectionable));
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.connect(_this.selection, 'change', function () {
            if (_this.selection.elements.length === 0)
                _this.contextBar.hide();
            else
                _this.contextBar.show();
        });
        var vbox = new Ui.VBox();
        _this.setContent(vbox);
        _this.contextBar = new Ui.ContextBar({ selection: _this.selection });
        _this.contextBar.hide();
        vbox.append(_this.contextBar);
        var selectionable = new Selectionable({
            width: 50, height: 50,
            verticalAlign: 'center', horizontalAlign: 'center'
        });
        vbox.append(selectionable, true);
        return _this;
    }
    return App;
}(Ui.App));
new App();
