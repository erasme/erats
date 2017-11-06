namespace Ui
{
	export interface ImageInit extends ElementInit {
		src: string;
	}

	export class Image extends Element implements ImageInit
	{
		private _src: string = undefined;
		private loaddone: boolean = false;
		private _naturalWidth: number = undefined;
		private _naturalHeight: number = undefined;
		private imageDrawing: HTMLImageElement;
		private setSrcLock: boolean = false;

		constructor(init?: Partial<ImageInit>) {
			super();
			this.addEvents('ready', 'error');
			// no context menu
			this.connect(this.imageDrawing, 'contextmenu', (event) => event.preventDefault());
			this.connect(this.imageDrawing, 'load', this.onImageLoad);
			this.connect(this.imageDrawing, 'error', this.onImageError);
			if (init)
				this.assign(init);
		}

		//
		// Get the URL of the image
		//
		get src(): string {
			return this._src;
		}

		//
		// Set the URL of the image. When the image is loaded,
		// ready event is fired and getIsReady return true.
		//
		set src(src: string) {
			if (src === undefined)
				throw ('Image src cant be undefined');
	
			this.setSrcLock = true;
			this.loaddone = false;
			this._naturalWidth = undefined;
			this._naturalHeight = undefined;
			this._src = src;
			this.imageDrawing.setAttribute('src', src);
			if ((this.imageDrawing.complete === true) && !this.loaddone) {
				this.loaddone = true;
				this._naturalWidth = this.imageDrawing.naturalWidth;
				this._naturalHeight = this.imageDrawing.naturalHeight;
				this.fireEvent('ready', this);
				this.invalidateMeasure();
			}
			this.setSrcLock = false;
		}
	
		//
		// Return the natural width of the image as defined
		// in the image file. Return undefined if the image is
		// not ready
		//
		get naturalWidth(): number {
			return this._naturalWidth;
		}

		//
		// Return the natural height of the image as defined
		// in the image file. Return undefined if the image is
		// not ready
		//
		get naturalHeight(): number {
			return this._naturalHeight;
		}

		//
		// Return true if the image is loaded
		//
		get isReady(): boolean {
			return this.loaddone;
		}

		private onImageError(event) {
			this.fireEvent('error', this);
		}

		private onImageLoad(event) {
			if ((event.target != undefined) && (event.target.naturalWidth != undefined) && (event.target.naturalHeight != undefined)) {
				this.loaddone = true;
				this._naturalWidth = event.target.naturalWidth;
				this._naturalHeight = event.target.naturalHeight;
				this.fireEvent('ready', this);
				this.invalidateMeasure();
			}
			else {
				if (this.setSrcLock)
					new Core.DelayedTask(this, 0, this.onImageDelayReady);
				else
					this.onImageDelayReady();
			}
		}

		private onAppReady() {
			this.disconnect(Ui.App.current, 'ready', this.onAppReady);
			this.onImageDelayReady();
		}

		private onImageDelayReady() {
			if (!Ui.App.current.isReady)
				this.connect(Ui.App.current, 'ready', this.onAppReady);
			else {
				this.loaddone = true;
				if (document.body == undefined) {
					let body = document.createElement('body');
					document.body = body;
				}
				let imgClone = document.createElement('img');
				imgClone.setAttribute('src', this._src);
				document.body.appendChild(imgClone);
				this._naturalWidth = imgClone.width;
				this._naturalHeight = imgClone.height;
				document.body.removeChild(imgClone);
				this.fireEvent('ready', this);
				this.invalidateMeasure();
			}
		}

		protected renderDrawing() {
			this.imageDrawing = document.createElement('img');
			this.imageDrawing.style.position = 'absolute';
			this.imageDrawing.style.top = '0px';
			this.imageDrawing.style.left = '0px';
			this.imageDrawing.style.width = '0px';
			this.imageDrawing.style.height = '0px';
			this.imageDrawing.style.pointerEvents = 'none';
			this.imageDrawing.setAttribute('draggable', 'false');
			if (Core.Navigator.isWebkit) {
				// no text selection
				this.imageDrawing.style.webkitUserSelect = 'none';
				// no context menu
				this.imageDrawing.style['webkitTouchCallout'] = 'none';
			}
			else if (Core.Navigator.isGecko)
				this.imageDrawing.style['MozUserSelect'] = 'none';
			else if (Core.Navigator.isIE)
				this.connect(this.imageDrawing, 'selectstart', function (event) { event.preventDefault(); });
			return this.imageDrawing;
		}

		protected measureCore(width, height) {
			if (!this.loaddone)
				return { width: 0, height: 0 };
			let size;
			if (this.width === undefined) {
				if (this.height === undefined)
					size = { width: this._naturalWidth, height: this._naturalHeight };
				else {
					let fixedHeight = this.height - (this.marginTop + this.marginBottom);
					size = { width: (this._naturalWidth * fixedHeight) / this._naturalHeight, height: fixedHeight };
				}
			}
			else {
				if (this.height === undefined) {
					let fixedWidth = this.width - (this.marginLeft + this.marginRight);
					size = { width: fixedWidth, height: (this._naturalHeight * fixedWidth) / this._naturalWidth };
				}
				else
					size = { width: 0, height: 0 };
			}
			return size;
		}

		protected arrangeCore(width: number, height: number) {
			if (this.imageDrawing !== undefined) {
				this.imageDrawing.style.width = width + 'px';
				this.imageDrawing.style.height = height + 'px';
			}
		}
	}
}	
