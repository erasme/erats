"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var button1 = new Ui.DownloadButton({
    text: 'hello world',
    verticalAlign: 'center',
    horizontalAlign: 'center',
    src: 'download.php',
    openWindow: false
});
app.content = button1;
