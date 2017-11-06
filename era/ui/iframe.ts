namespace Ui {
	export interface IFrameInit extends ElementInit {
		src: string;
	}

	export class IFrame extends Element {
		protected iframeDrawing: HTMLIFrameElement;
		protected _isReady: boolean = false;

		constructor(init?: Partial<IFrameInit>) {
			super();
			this.connect(this.iframeDrawing, 'load', this.onIFrameLoad);
			this.addEvents('ready');
			if (init)
				this.assign(init);
		}

		get src(): string {
			return this.iframeDrawing.getAttribute('src');
		}

		set src(src: string) {
			this.iframeDrawing.setAttribute('src', src);
		}

		get isReady(): boolean {
			return this._isReady;
		}

		protected onIFrameLoad() {
			if (!this._isReady) {
				this._isReady = true;
				this.fireEvent('ready', this);
			}
		}

		protected renderDrawing() {
			if (Core.Navigator.iOs) {
				var drawing = super.renderDrawing();
				drawing.style.overflow = 'scroll';
				drawing.style.webkitOverflowScrolling = 'touch';

				this.iframeDrawing = document.createElement('iframe');
				this.iframeDrawing.scrolling = 'no';
				this.iframeDrawing.style.border = '0px';
				this.iframeDrawing.style.margin = '0px';
				this.iframeDrawing.style.padding = '0px';
				this.iframeDrawing.style.width = '100%';
				this.iframeDrawing.style.height = '100%';
				drawing.appendChild(this.iframeDrawing);

				return drawing;
			}
			else {
				this.iframeDrawing = document.createElement('iframe');
				this.iframeDrawing.style.border = '0px';
				this.iframeDrawing.style.margin = '0px';
				this.iframeDrawing.style.padding = '0px';
				this.iframeDrawing.style.width = '100%';
				this.iframeDrawing.style.height = '100%';
				if (Core.Navigator.isIE)
					this.iframeDrawing.frameBorder = '0';
				return this.iframeDrawing;
			}
		}

		protected arrangeCore(width: number, height: number) {
			this.iframeDrawing.style.width = width + 'px';
		}
	}
}	

