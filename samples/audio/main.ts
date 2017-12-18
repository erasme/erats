/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let playButton = new Ui.Button({ text: 'play' });
        toolbar.append(playButton);
        this.connect(playButton, 'press', function () {
            audio.play();
        });

        let pauseButton = new Ui.Button({ text: 'pause' });
        toolbar.append(pauseButton);
        this.connect(pauseButton, 'press', function () {
            audio.pause();
        });

        let resumeButton = new Ui.Button({ text: 'resume' });
        toolbar.append(resumeButton);
        this.connect(resumeButton, 'press', function () {
            audio.play();
        });

        let stopButton = new Ui.Button({ text: 'stop' });
        toolbar.append(stopButton);
        this.connect(stopButton, 'press', function () {
            audio.stop();
        });

        let delayplayButton = new Ui.Button({ text: 'delay play 1s' });
        toolbar.append(delayplayButton);
        this.connect(delayplayButton, 'press', function () {
            new Core.DelayedTask(1, () => audio.play());
        });

        let progressbar = new Ui.ProgressBar({ verticalAlign: 'center' });
        toolbar.append(progressbar, true);

        let audio = new Ui.Audio({ src: 'sound.mp3', volume: 1 });
        vbox.append(audio);

        this.connect(audio, 'ready', function () {
            //	console.log('audio ready');
        });

        this.connect(audio, 'ended', function () {
            //	console.log('audio ended');
        });

        this.connect(audio, 'timeupdate', function (audio: Ui.Audio, time: number) {
            //	console.log('audio pos: '+time);
            progressbar.value = time / audio.duration;
        });
    }
}

new App();