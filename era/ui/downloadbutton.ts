namespace Ui {
    export interface DownloadButtonInit extends LinkButtonInit { }

    export class DownloadButton extends LinkButton {
        readonly download = new Core.Events<{ target: DownloadButton }>();
        set ondownload(value: (event: { target: DownloadButton }) => void) { this.download.connect(value); }

        constructor(init?: DownloadButtonInit) {
            super(init);
            this.link.connect(() => this.onLinkPress());
        }
    
        protected onLinkPress() {
            this.download.fire({ target: this });
        }

        static style: object = {
            background: '#a4f4a4'
        }
    }
}	

