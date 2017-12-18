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
        var toolbar = new Ui.ToolBar({ verticalAlign: 'top' });
        vbox.append(toolbar);
        var playButton = new Ui.Button({ text: 'play' });
        toolbar.append(playButton);
        _this.connect(playButton, 'press', function () {
            video.play();
        });
        var pauseButton = new Ui.Button({ text: 'pause' });
        toolbar.append(pauseButton);
        _this.connect(pauseButton, 'press', function () {
            video.pause();
        });
        var stopButton = new Ui.Button({ text: 'stop' });
        toolbar.append(stopButton);
        _this.connect(stopButton, 'press', function () {
            video.stop();
        });
        var delayplayButton = new Ui.Button({ text: 'delay play 1s' });
        toolbar.append(delayplayButton);
        _this.connect(delayplayButton, 'press', function () {
            return new Core.DelayedTask(1, function () { return video.play(); });
        });
        var progressbar = new Ui.ProgressBar({ verticalAlign: 'center' });
        toolbar.append(progressbar, true);
        var lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
        vbox.append(lbox, true);
        lbox.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        var video = new Ui.Video({
            margin: 10, width: 512, height: 288,
            oggSrc: 'video.ogv', mp4Src: 'video.m4v', webmSrc: 'video.webm', volume: 1
        });
        lbox.append(video);
        _this.connect(video, 'ready', function () {
            //	console.log('video ready');
        });
        _this.connect(video, 'ended', function () {
            //	console.log('video ended');
        });
        _this.connect(video, 'timeupdate', function (v, time) {
            progressbar.value = time / video.duration;
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
