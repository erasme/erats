/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

app.content = new Ui.DownloadButton({
	text: 'hello world',
	verticalAlign: 'center',
	horizontalAlign: 'center',
	src: 'download.php',
	openWindow: false
});
