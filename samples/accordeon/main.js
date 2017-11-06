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
        var button = new Ui.Button({ text: 'change orientation' });
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            if (accordeon.orientation == 'horizontal')
                accordeon.orientation = 'vertical';
            else
                accordeon.orientation = 'horizontal';
        });
        button = new Ui.Button({ text: 'set page1' });
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            page1.select();
        });
        button = new Ui.Button({ text: 'add pageX' });
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            var page = new Ui.AccordeonPage();
            //	this.connect(page, 'select', function() { console.log('pageX select'); });
            //	this.connect(page, 'unselect', function() { console.log('pageX unselect'); });
            accordeon.appendPage(page);
            page.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'green', margin: 3 }));
            page.setContent(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));
        });
        button = new Ui.Button({ text: 'remove last page' });
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            var pos = accordeon.pages.length - 1;
            if (pos >= 0) {
                var page = accordeon.pages[pos];
                accordeon.removePage(page);
            }
        });
        button = new Ui.Button({ text: 'remove current page' });
        toolbar.append(button);
        _this.connect(button, 'press', function () {
            var pos = accordeon.currentPosition;
            if (pos >= 0) {
                var page = accordeon.pages[pos];
                accordeon.removePage(page);
            }
        });
        var label = new Ui.Label({ text: 'Current page: ', margin: 5 });
        vbox.append(label);
        var accordeon = new Ui.Accordeon({ margin: 20 });
        vbox.append(accordeon, true);
        _this.connect(accordeon, 'change', function (accordeon, page, pos) {
            label.text = 'Current page: ' + (pos + 1);
        });
        var page1 = new Ui.AccordeonPage();
        //this.connect(page1, 'select', function() { console.log('page1 select'); });
        //this.connect(page1, 'unselect', function() { console.log('page1 unselect'); });
        accordeon.appendPage(page1);
        page1.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightblue' }));
        var content1 = new Ui.LBox();
        content1.append(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));
        var vbox1 = new Ui.VBox({ horizontalAlign: 'center', verticalAlign: 'center' });
        content1.append(vbox1);
        vbox1.append(new Ui.Button({ text: 'button1 p1' }));
        vbox1.append(new Ui.Button({ text: 'button2 p1' }));
        page1.setContent(content1);
        var page2 = new Ui.AccordeonPage();
        //this.connect(page2, 'select', function() { console.log('page2 select'); });
        //this.connect(page2, 'unselect', function() { console.log('page2 unselect'); });
        accordeon.appendPage(page2);
        page2.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'pink' }));
        var content2 = new Ui.LBox();
        content2.append(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));
        var vbox2 = new Ui.VBox({ horizontalAlign: 'center', verticalAlign: 'center' });
        content2.append(vbox2);
        vbox2.append(new Ui.Button({ text: 'button1 p2' }));
        vbox2.append(new Ui.Button({ text: 'button2 p2' }));
        page2.setContent(content2);
        var page3 = new Ui.AccordeonPage();
        //this.connect(page3, 'select', function() { console.log('page3 select'); });
        //this.connect(page3, 'unselect', function() { console.log('page3 unselect'); });
        accordeon.appendPage(page3);
        page3.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'purple' }));
        page3.setContent(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));
        return _this;
    }
    return App;
}(Ui.App));
new App();
