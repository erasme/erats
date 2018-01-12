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
        toolbar.append(new Ui.Button({
            text: 'play',
            onpressed: function () { return video.play(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'pause',
            onpressed: function () { return video.pause(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'stop',
            onpressed: function () { return video.stop(); }
        }));
        toolbar.append(new Ui.Button({
            text: 'delay play 1s',
            onpressed: function () { return new Core.DelayedTask(1, function () { return video.play(); }); }
        }));
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
        video.ready.connect(function () { return console.log('video ready'); });
        video.ended.connect(function () { return console.log('video ended'); });
        video.timeupdated.connect(function (e) { return progressbar.value = e.time / video.duration; });
        return _this;
    }
    return App;
}(Ui.App));
new App();
