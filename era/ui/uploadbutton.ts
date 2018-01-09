namespace Ui {
	export interface UploadButtonInit extends ButtonInit {
		directoryMode?: boolean;
	}	

	export class UploadButton extends Button implements UploadButtonInit {
		input: UploadableFileWrapper;

		constructor(init?: UploadButtonInit) {
			super(init);
			this.addEvents('file');

			this.input = new UploadableFileWrapper();
			this.prepend(this.input);

			this.connect(this.input, 'file', this.onFile);
			this.connect(this, 'press', this.onUploadButtonPress);

			new DropableWatcher({
				element: this,
				dropfile: (w, f) => { this.onFile(undefined, f); return true; },
				types: [ { type: 'files', effects: 'copy' } ]
			});
			if (init) {
				if (init.directoryMode !== undefined)
					this.directoryMode = init.directoryMode;	
			}
		}

		set directoryMode(active: boolean) {
			this.input.setDirectoryMode(active);
		}

		protected onUploadButtonPress() {
			this.input.select();
		}

		protected onFile(wrapper: UploadableFileWrapper, file: Core.File) {
			this.fireEvent('file', this, file);
		}
	}
}	
