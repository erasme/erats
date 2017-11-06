namespace Ui {
	export interface UploadButtonInit extends ButtonInit {
	}	

	export class UploadButton extends Button implements UploadButtonInit {
		input: UploadableFileWrapper;

		constructor(init?: Partial<UploadButtonInit>) {
			super();
			this.addEvents('file');

			this.input = new UploadableFileWrapper();
			this.prepend(this.input);

			this.connect(this.input, 'file', this.onFile);
			this.connect(this, 'press', this.onUploadButtonPress);

			this.dropBox.addType('files', 'copy');
			this.connect(this.dropBox, 'dropfile', this.onFile);
			if (init)
				this.assign(init);
		}

		set directoryMode(active: boolean) {
			this.input.setDirectoryMode(active);
		}

		protected onUploadButtonPress() {
			this.input.select();
		}

		protected onFile(fileWrapper: UploadableFileWrapper, file: File) {
			this.fireEvent('file', this, file);
		}
	}
}	
