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
        var playButton = new Ui.Button({ text: 'play' });
        toolbar.append(playButton);
        _this.connect(playButton, 'press', function () {
            audio.play();
        });
        var pauseButton = new Ui.Button({ text: 'pause' });
        toolbar.append(pauseButton);
        _this.connect(pauseButton, 'press', function () {
            audio.pause();
        });
        var resumeButton = new Ui.Button({ text: 'resume' });
        toolbar.append(resumeButton);
        _this.connect(resumeButton, 'press', function () {
            audio.play();
        });
        var stopButton = new Ui.Button({ text: 'stop' });
        toolbar.append(stopButton);
        _this.connect(stopButton, 'press', function () {
            audio.stop();
        });
        var delayplayButton = new Ui.Button({ text: 'delay play 1s' });
        toolbar.append(delayplayButton);
        _this.connect(delayplayButton, 'press', function () {
            new Core.DelayedTask(undefined, 1, function () { return audio.play(); });
        });
        var progressbar = new Ui.ProgressBar({ verticalAlign: 'center' });
        toolbar.append(progressbar, true);
        var audio = new Ui.Audio({ src: 'sound.mp3', volume: 1 });
        _this.append(audio);
        _this.connect(audio, 'ready', function () {
            //	console.log('audio ready');
        });
        _this.connect(audio, 'ended', function () {
            //	console.log('audio ended');
        });
        _this.connect(audio, 'timeupdate', function (audio, time) {
            //	console.log('audio pos: '+time);
            progressbar.value = time / audio.duration;
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
