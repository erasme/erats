/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {

    constructor() {
        super();

		let vbox = new Ui.VBox();
		this.content = vbox;

		let toolbar = new Ui.ToolBar({ verticalAlign: 'top' });
		vbox.append(toolbar);

		toolbar.append(new Ui.Button({
			text: 'play',
			onpressed: () => video.play()
		}));

		toolbar.append(new Ui.Button({
			text: 'pause',
			onpressed: () => video.pause()
		}));

		toolbar.append(new Ui.Button({
			text: 'stop',
			onpressed: () => video.stop()
		}));

		toolbar.append(new Ui.Button({
			text: 'delay play 1s',
			onpressed: () => new Core.DelayedTask(1, () => video.play())
		}));

		let progressbar = new Ui.ProgressBar({ verticalAlign: 'center' });
		toolbar.append(progressbar, true);

		let lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
		vbox.append(lbox, true);

		lbox.append(new Ui.Rectangle({ fill: 'lightgreen' }));

        let video = new Ui.Video({
            margin: 10, width: 512, height: 288,
            oggSrc: 'video.ogv', mp4Src: 'video.m4v', webmSrc: 'video.webm', volume: 1
        });
		lbox.append(video);

		video.ready.connect(() => console.log('video ready'));

		video.ended.connect(() => console.log('video ended'));

		video.timeupdated.connect(e => progressbar.value = e.time / video.duration);
	}
}

new App();
