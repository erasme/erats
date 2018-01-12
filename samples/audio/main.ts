/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let playButton = new Ui.Button({
            text: 'play',
            onpressed: () => audio.play()

        });
        toolbar.append(playButton);

        let pauseButton = new Ui.Button({
            text: 'pause',
            onpressed: () => audio.pause()
        });
        toolbar.append(pauseButton);

        let resumeButton = new Ui.Button({
            text: 'resume',
            onpressed: () => audio.play()
        });
        toolbar.append(resumeButton);

        let stopButton = new Ui.Button({
            text: 'stop',
            onpressed: () => audio.stop()
        });
        toolbar.append(stopButton);

        let delayplayButton = new Ui.Button({
            text: 'delay play 1s',
            onpressed: () => new Core.DelayedTask(1, () => audio.play())
        });
        toolbar.append(delayplayButton);

        let progressbar = new Ui.ProgressBar({ verticalAlign: 'center' });
        toolbar.append(progressbar, true);

        let audio = new Ui.Audio({ src: 'sound.mp3', volume: 1 });
        vbox.append(audio);

        audio.ready.connect(() => {
            //	console.log('audio ready');
        });

        audio.ended.connect(() => {
            //	console.log('audio ended');
        });

        audio.timeupdate.connect(e => {
            //	console.log('audio pos: '+time);
            progressbar.value = e.time / e.target.duration;
        });
    }
}

new App();