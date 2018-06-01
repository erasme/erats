/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {

    constructor() {
        super();

		let vbox = new Ui.VBox();
		this.content = vbox;

		let toolbar = new Ui.ToolBar().assign({ verticalAlign: 'top' });
		vbox.append(toolbar);

		toolbar.append(new Ui.Button().assign({
			text: 'play',
			onpressed: () => video.play()
		}));

		toolbar.append(new Ui.Button().assign({
			text: 'pause',
			onpressed: () => video.pause()
		}));

		toolbar.append(new Ui.Button().assign({
			text: 'stop',
			onpressed: () => video.stop()
		}));

		toolbar.append(new Ui.Button().assign({
			text: 'delay play 1s',
			onpressed: () => new Core.DelayedTask(1, () => video.play())
		}));

		let progressbar = new Ui.ProgressBar().assign({ verticalAlign: 'center' });
		toolbar.append(progressbar, true);

		let lbox = new Ui.LBox().assign({ horizontalAlign: 'center', verticalAlign: 'center' });
		vbox.append(lbox, true);

		lbox.append(new Ui.Rectangle().assign({ fill: 'lightgreen' }));

        let video = new Ui.Video().assign({
            margin: 10, width: 512, height: 288,
			src: 'video.m4v', volume: 1,
			ontimeupdated: e => progressbar.value = e.time / video.duration,
			onready: () => console.log('video ready'),
			onended: () => console.log('video ended')
        });
		lbox.append(video);
	}
}

new App();
