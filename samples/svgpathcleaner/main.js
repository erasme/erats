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
        vbox.padding = 10;
        vbox.spacing = 10;
        _this.setContent(vbox);
        var text = new Ui.Text();
        text.text = 'Icon SVG path';
        vbox.append(text);
        var hbox = new Ui.HBox();
        vbox.append(hbox, true);
        var scroll = new Ui.ScrollingArea();
        hbox.append(scroll, true);
        _this.pathTextField = new Ui.TextAreaField();
        _this.connect(_this.pathTextField, 'change', _this.onPathTextFieldChanged);
        scroll.setContent(_this.pathTextField);
        _this.sourceIcon = new Ui.Shape();
        _this.sourceIcon.width = 192;
        _this.sourceIcon.height = 192;
        _this.sourceIcon.scale = 4;
        hbox.append(_this.sourceIcon);
        hbox = new Ui.HBox();
        vbox.append(hbox);
        var button = new Ui.Button();
        button.setText('Clean');
        _this.connect(button, 'press', _this.onCleanPressed);
        hbox.append(button);
        _this.decimalField = new Ui.TextField();
        _this.decimalField.width = 40;
        _this.decimalField.value = '2';
        hbox.append(_this.decimalField);
        _this.scaleField = new Ui.TextField();
        _this.scaleField.width = 40;
        _this.scaleField.value = '1';
        hbox.append(_this.scaleField);
        hbox = new Ui.HBox();
        hbox.spacing = 10;
        vbox.append(hbox, true);
        scroll = new Ui.ScrollingArea();
        hbox.append(scroll, true);
        _this.cleanedPathTextField = new Ui.TextAreaField();
        _this.cleanedPathTextField.setDisabled(true);
        scroll.setContent(_this.cleanedPathTextField);
        _this.destIcon = new Ui.Shape();
        _this.destIcon.width = 192;
        _this.destIcon.height = 192;
        _this.destIcon.scale = 4;
        hbox.append(_this.destIcon);
        _this.statusLabel = new Ui.Label();
        vbox.append(_this.statusLabel);
        return _this;
    }
    App.prototype.testPath = function (path) {
        var svgDrawing = document.createElementNS(svgNS, 'svg');
        var ctx = new Core.SVG2DContext(svgDrawing);
        try {
            ctx.svgPath(path);
        }
        catch (e) {
            return false;
        }
        return true;
    };
    App.prototype.onPathTextFieldChanged = function () {
        var path = this.pathTextField.value;
        if (this.testPath(path)) {
            this.sourceIcon.fill = undefined;
            this.sourceIcon.path = path;
        }
        else {
            this.sourceIcon.fill = 'red';
            this.sourceIcon.path = Ui.Icon.getPath('deny');
        }
    };
    App.prototype.onCleanPressed = function () {
        var svgParser = new Ui.SvgParser(this.pathTextField.value);
        var lastIsValue = false;
        var lastCmd = '';
        var res = '';
        svgParser.next();
        while (!svgParser.isEnd()) {
            if (svgParser.isCmd()) {
                if (svgParser.getCmd() !== lastCmd) {
                    res += svgParser.getCmd();
                    lastCmd = svgParser.getCmd();
                    lastIsValue = false;
                }
            }
            else {
                var roundScale = Math.pow(10, parseInt(this.decimalField.value));
                var valNum = Math.round(svgParser.getCurrent() * parseInt(this.scaleField.value) * roundScale);
                var val = (valNum / roundScale).toString();
                if (val.substring(0, 2) === '0.')
                    val = '.' + val.substring(2);
                if (val.substring(0, 3) === '-0.')
                    val = '-.' + val.substring(3);
                if ((val[0] !== '-') && (lastIsValue))
                    res += ' ';
                res += val;
                lastIsValue = true;
            }
            svgParser.next();
        }
        this.cleanedPathTextField.value = res;
        if (this.testPath(res)) {
            this.destIcon.fill = undefined;
            this.destIcon.path = res;
        }
        else {
            this.destIcon.fill = 'red';
            this.destIcon.path = Ui.Icon.getPath('deny');
        }
        var ratio = res.length / this.pathTextField.value.length;
        this.statusLabel.text = 'ratio: ' + Math.round(ratio * 100) + '%, saved: ' + (100 - Math.round(ratio * 100)) + '%';
    };
    return App;
}(Ui.App));
new App();
