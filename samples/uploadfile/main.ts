/// <reference path="../../era/era.d.ts" />

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

class App extends Ui.App {
    droplabel: Ui.Label;
    progressbar: Ui.ProgressBar;

    constructor() {
        super();
        let vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 20 });
        this.content = vbox;

        //
        // Define a DropBox. The DropBox is a possible target for a file drag.
        //
        let dropbox = new Ui.DropBox({
            width: 200, height: 200,
            // Connect to the dropfiles event called when files are
            // dropped in the box.
            ondroppedfile: e => this.onUploadFile(e.target, e.file)
        });
        // allow drop of files
        dropbox.addType('files', ['copy']);

        // fill with content to see something
        dropbox.append(new Ui.Rectangle({ fill: 'lightgreen', radius: 8 }));
        let content = new Ui.VBox({ margin: 10, verticalAlign: 'center', spacing: 10 });
        dropbox.append(content);
        this.droplabel = new Ui.Label({ text: 'drop file here' });
        content.append(this.droplabel);
        this.progressbar = new Ui.ProgressBar();
        this.progressbar.hide();
        content.append(this.progressbar);
        vbox.append(dropbox);

        //
        // For browser that dont support drag and drop, add and upload button
        //
        let uploadButton = new Ui.UploadButton({
            icon: 'upload', text: 'Upload', orientation: 'horizontal',
            onfilechanged: e => this.onUploadFile(dropbox, e.file)
        });
        vbox.append(uploadButton);
    }

    onUploadFile(element: Ui.DropBox, file: Core.File) {
        let uploader = new Core.FilePostUploader({
            file: file, service: 'upload.php',
            onprogress: e => this.progressbar.value = e.loaded / e.total,            
            oncompleted: e => {
                this.progressbar.hide();
                this.droplabel.text = 'drop file here';
            }
        });
        this.droplabel.text = file.getFileName();
        this.progressbar.show();
        uploader.send();
    }
}

new App();