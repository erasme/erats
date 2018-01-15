namespace Ui {
	export interface UploadButtonInit extends ButtonInit {
		directoryMode?: boolean;
		onfilechanged?: (event: { target: UploadButton, file: Core.File }) => void;
	}	

	export class UploadButton extends Button implements UploadButtonInit {
		input: UploadableFileWrapper;
		readonly filechanged = new Core.Events<{ target: UploadButton, file: Core.File }>();

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

		protected onUploadButtonPress() {
			this.input.select();
		}

		protected onFile(wrapper: UploadableFileWrapper, file: Core.File) {
			this.filechanged.fire({ target: this, file: file });
		}
	}
}	
