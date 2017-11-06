/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let button1 = new Ui.DownloadButton({
	text: 'hello world',
	verticalAlign: 'center',
	horizontalAlign: 'center',
	src: 'download.php',
	openWindow: false
});

app.content = button1;