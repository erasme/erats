/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {

    constructor() {
        super();

		let vbox = new Ui.VBox();
		this.setContent(vbox);

		let toolbar = new Ui.ToolBar({ verticalAlign: 'top' });
		vbox.append(toolbar);

		let playButton = new Ui.Button({ text: 'play' });
		toolbar.append(playButton);
		this.connect(playButton, 'press', function() {
			video.play();
		});

		let pauseButton = new Ui.Button({ text: 'pause' });
		toolbar.append(pauseButton);
		this.connect(pauseButton, 'press', function() {
			video.pause();
		});

		let stopButton = new Ui.Button({ text: 'stop' });
		toolbar.append(stopButton);
		this.connect(stopButton, 'press', function() {
			video.stop();
		});

		let delayplayButton = new Ui.Button({ text: 'delay play 1s' });
		toolbar.append(delayplayButton);
		this.connect(delayplayButton, 'press', () => 
			new Core.DelayedTask(this, 1, function() {
				video.play();
			})
		);

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

		this.connect(video, 'ready', function() {
		//	console.log('video ready');
		});

		this.connect(video, 'ended', function() {
		//	console.log('video ended');
		});

		this.connect(video, 'timeupdate', (v: Ui.Video, time: number) => {
			progressbar.value = time/video.duration;
		});
	}
}

new App();
