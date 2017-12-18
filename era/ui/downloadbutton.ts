namespace Ui {
	export interface DownloadButtonInit extends LinkButtonInit { }

	export class DownloadButton extends LinkButton {
		constructor(init?: DownloadButtonInit) {
			super(init);
			this.addEvents('download');
			this.connect(this, 'link', this.onLinkPress);
		}
	
		protected onLinkPress() {
			this.fireEvent('download', this);
		}

		style: object = {
			background: '#a4f4a4'
		}
	}
}	

