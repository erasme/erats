namespace Ui {
	export interface DownloadButtonInit extends LinkButtonInit { }

	export class DownloadButton extends LinkButton {
		readonly download = new Core.Events<{ target: DownloadButton }>();

		constructor(init?: DownloadButtonInit) {
			super(init);
			this.link.connect(this.onLinkPress);
		}
	
		protected onLinkPress() {
			this.download.fire({ target: this });
		}

		style: object = {
			background: '#a4f4a4'
		}
	}
}	

