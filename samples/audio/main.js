"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox();
        _this.content = vbox;
        var toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        var playButton = new Ui.Button({
            text: 'play',
            onpressed: function () { return audio.play(); }
        });
        toolbar.append(playButton);
        var pauseButton = new Ui.Button({
            text: 'pause',
            onpressed: function () { return audio.pause(); }
        });
        toolbar.append(pauseButton);
        var resumeButton = new Ui.Button({
            text: 'resume',
            onpressed: function () { return audio.play(); }
        });
        toolbar.append(resumeButton);
        var stopButton = new Ui.Button({
            text: 'stop',
            onpressed: function () { return audio.stop(); }
        });
        toolbar.append(stopButton);
        var delayplayButton = new Ui.Button({
            text: 'delay play 1s',
            onpressed: function () { return new Core.DelayedTask(1, function () { return audio.play(); }); }
        });
        toolbar.append(delayplayButton);
        var progressbar = new Ui.ProgressBar({ verticalAlign: 'center' });
        toolbar.append(progressbar, true);
        var audio = new Ui.Audio({ src: 'sound.mp3', volume: 1 });
        vbox.append(audio);
        audio.ready.connect(function () {
            //	console.log('audio ready');
        });
        audio.ended.connect(function () {
            //	console.log('audio ended');
        });
        audio.timeupdate.connect(function (e) {
            if (e.target.duration)
                progressbar.value = e.time / e.target.duration;
            else
                progressbar.value = 0;
        });
        return _this;
    }
    return App;
}(Ui.App));
new App();
