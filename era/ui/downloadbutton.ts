namespace Ui {
	export interface DownloadButtonInit extends LinkButtonInit { }

	export class DownloadButton extends LinkButton {
		constructor(init?: Partial<DownloadButtonInit>) {
			super();
			this.addEvents('download');
			this.connect(this, 'link', this.onLinkPress);
			if (init)
				this.assign(init);
		}
	
		protected onLinkPress() {
			this.fireEvent('download', this);
		}

		style: object = {
			background: '#a4f4a4'
		}
	}
}	

