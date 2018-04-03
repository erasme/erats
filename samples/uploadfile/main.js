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
//
// WARNING: the current file directory MUST be writable by your web server
// and PHP support is needed for this sample to work
//
//
// WARNING: the drag and drop of a file from the desktop only work if
// your browser support it. Known browser to work:
//
// - Firefox 4.0
// - Chrome 12
//
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 20 });
        _this.content = vbox;
        //
        // Define a DropBox. The DropBox is a possible target for a file drag.
        //
        var dropbox = new Ui.DropBox({
            width: 200, height: 200,
            // Connect to the dropfiles event called when files are
            // dropped in the box.
            ondroppedfile: function (e) { return _this.onUploadFile(e.target, e.file); }
        });
        // allow drop of files
        dropbox.addType('files', ['copy']);
        // fill with content to see something
        dropbox.append(new Ui.Rectangle({ fill: 'lightgreen', radius: 8 }));
        var content = new Ui.VBox({ margin: 10, verticalAlign: 'center', spacing: 10 });
        dropbox.append(content);
        _this.droplabel = new Ui.Label({ text: 'drop file here' });
        content.append(_this.droplabel);
        _this.progressbar = new Ui.ProgressBar();
        _this.progressbar.hide();
        content.append(_this.progressbar);
        vbox.append(dropbox);
        //
        // For browser that dont support drag and drop, add and upload button
        //
        var uploadButton = new Ui.UploadButton({
            icon: 'upload', text: 'Upload', orientation: 'horizontal',
            onfilechanged: function (e) { return _this.onUploadFile(dropbox, e.file); }
        });
        vbox.append(uploadButton);
        return _this;
    }
    App.prototype.onUploadFile = function (element, file) {
        var _this = this;
        var uploader = new Core.FilePostUploader({
            file: file, service: 'upload.php',
            onprogress: function (e) { return _this.progressbar.value = e.loaded / e.total; },
            oncompleted: function (e) {
                _this.progressbar.hide();
                _this.droplabel.text = 'drop file here';
            }
        });
        this.droplabel.text = file.getFileName();
        this.progressbar.show();
        uploader.send();
    };
    return App;
}(Ui.App));
new App();
