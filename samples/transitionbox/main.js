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
        var toolbar2 = new Ui.ToolBar();
        vbox.append(toolbar2);
        var trans1Button = new Ui.Button({ text: 'transition 1' });
        toolbar.append(trans1Button);
        _this.connect(trans1Button, 'press', function () {
            transitionbox.current = page1;
        });
        var trans2Button = new Ui.Button({ text: 'transition 2' });
        toolbar.append(trans2Button);
        _this.connect(trans2Button, 'press', function () {
            transitionbox.current = page2;
        });
        var fadeButton = new Ui.Button({ text: 'fade' });
        toolbar.append(fadeButton);
        _this.connect(fadeButton, 'press', function () {
            transitionbox.transition = 'fade';
        });
        var flipButton = new Ui.Button({ text: 'flip horizontal' });
        toolbar2.append(flipButton);
        _this.connect(flipButton, 'press', function () {
            transitionbox.transition = 'flip';
        });
        var flipverticalButton = new Ui.Button({ text: 'flip vertical' });
        toolbar2.append(flipverticalButton);
        _this.connect(flipverticalButton, 'press', function () {
            transitionbox.transition = new Ui.Flip({ orientation: 'vertical' });
        });
        var slideButton = new Ui.Button({ text: 'slide right' });
        toolbar2.append(slideButton);
        _this.connect(slideButton, 'press', function () {
            transitionbox.transition = 'slide';
        });
        var slideleftButton = new Ui.Button({ text: 'slide left' });
        toolbar2.append(slideleftButton);
        _this.connect(slideleftButton, 'press', function () {
            transitionbox.transition = new Ui.Slide({ direction: 'left' });
        });
        var slidetopButton = new Ui.Button({ text: 'slide top' });
        toolbar2.append(slidetopButton);
        _this.connect(slidetopButton, 'press', function () {
            transitionbox.transition = new Ui.Slide({ direction: 'top' });
        });
        var slidebottomButton = new Ui.Button({ text: 'slide bottom' });
        toolbar2.append(slidebottomButton);
        _this.connect(slidebottomButton, 'press', function () {
            transitionbox.transition = new Ui.Slide({ direction: 'bottom' });
        });
        var linearButton = new Ui.Button({ text: 'linear' });
        toolbar.append(linearButton);
        _this.connect(linearButton, 'press', function () {
            transitionbox.ease = 'linear';
        });
        var bounceButton = new Ui.Button({ text: 'bounce' });
        toolbar.append(bounceButton);
        _this.connect(bounceButton, 'press', function () {
            transitionbox.ease = 'bounce';
        });
        var elasticButton = new Ui.Button({ text: 'elastic' });
        toolbar.append(elasticButton);
        _this.connect(elasticButton, 'press', function () {
            transitionbox.ease = 'elastic';
        });
        var powerButton = new Ui.Button({ text: 'power' });
        toolbar.append(powerButton);
        _this.connect(powerButton, 'press', function () {
            transitionbox.ease = 'power';
        });
        var poweroutButton = new Ui.Button({ text: 'power out' });
        toolbar.append(poweroutButton);
        _this.connect(poweroutButton, 'press', function () {
            transitionbox.ease = new Anim.PowerEase({ mode: 'out' });
        });
        var transitionbox = new Ui.TransitionBox({ transition: 'fade', duration: 0.5 });
        vbox.append(transitionbox, true);
        var page1 = new Ui.LBox();
        page1.append(new Ui.Rectangle({ fill: 'lightblue' }));
        page1.append(new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 1', verticalAlign: 'center', horizontalAlign: 'center' }));
        transitionbox.append(page1);
        var page2 = new Ui.LBox();
        page2.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        page2.append(new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 2', verticalAlign: 'center', horizontalAlign: 'center' }));
        transitionbox.append(page2);
        return _this;
    }
    return App;
}(Ui.App));
new App();
