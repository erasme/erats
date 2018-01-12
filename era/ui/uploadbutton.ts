namespace Ui {
	export interface UploadButtonInit extends ButtonInit {
		directoryMode?: boolean;
		onfile?: (event: { target: UploadButton, file: Core.File }) => void;
	}	

	export class UploadButton extends Button implements UploadButtonInit {
		input: UploadableFileWrapper;
		readonly file = new Core.Events<{ target: UploadButton, file: Core.File }>();

		constructor(init?: UploadButtonInit) {
			super(init);

			this.input = new UploadableFileWrapper();
			this.prepend(this.input);

			this.input.file.connect((e) => this.onFile(e.target, e.file));
			this.pressed.connect(() => this.onUploadButtonPress());

			new DropableWatcher({
				element: this,
				dropfile: (w, f) => { this.onFile(undefined, f); return true; },
				types: [ { type: 'files', effects: 'copy' } ]
			});
			if (init) {
				if (init.directoryMode !== undefined)
					this.directoryMode = init.directoryMode;
				if (init.onfile)
					this.file.connect(init.onfile);	
			}
		}

		set directoryMode(active: boolean) {
			this.input.setDirectoryMode(active);
		}

		protected onUploadButtonPress() {
			this.input.select();
		}

		protected onFile(wrapper: UploadableFileWrapper, file: Core.File) {
			this.file.fire({ target: this, file: file });
		}
	}
}	
