namespace Ui {
    export interface UploadButtonInit extends ButtonInit {
        directoryMode?: boolean;
        onfilechanged?: (event: { target: UploadButton, file: File }) => void;
    }	

    export class UploadButton extends Button implements UploadButtonInit {
        input: UploadableFileWrapper;
        readonly filechanged = new Core.Events<{ target: UploadButton, file: File }>();
        set onfilechanged(value: (event: { target: UploadButton, file: File }) => void) { this.filechanged.connect(value); }

        constructor(init?: UploadButtonInit) {
            super(init);

            this.input = new UploadableFileWrapper();
            this.prepend(this.input);

            this.input.file.connect((e) => this.onFile(e.target, e.file));
            this.pressed.connect(() => this.onUploadButtonPress());

            new DropableWatcher({
                element: this,
                ondroppedfile: (w, f) => { this.onFile(undefined, f); return true; },
                types: [ { type: 'files', effects: 'copy' } ]
            });
            if (init) {
                if (init.directoryMode !== undefined)
                    this.directoryMode = init.directoryMode;
                if (init.onfilechanged)
                    this.filechanged.connect(init.onfilechanged);	
            }
        }

        set directoryMode(active: boolean) {
            this.input.setDirectoryMode(active);
        }

        set multiple(active: boolean) {
            this.input.multiple = active;
        }

        protected onUploadButtonPress() {
            this.input.select();
        }

        protected onFile(wrapper: UploadableFileWrapper, file: File) {
            this.filechanged.fire({ target: this, file: file });
        }
    }
}	
