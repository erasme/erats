namespace Ui
{
    export interface ImageInit extends ElementInit {
        src?: string;
        onready?: (event: { target: Image }) => void;
        onerror?: (event: { target: Image }) => void;
    }

    export class Image extends Element implements ImageInit
    {
        private _src?: string;
        private loaddone: boolean = false;
        private _naturalWidth?: number;
        private _naturalHeight?: number;
        private imageDrawing!: HTMLImageElement;
        private setSrcLock: boolean = false;
        readonly ready = new Core.Events<{ target: Image }>();
        set onready(value: (event: { target: Image }) => void) { this.ready.connect(value); }
        readonly error = new Core.Events<{ target: Image }>();
        set onerror(value: (event: { target: Image }) => void) { this.error.connect(value); }

        constructor(init?: ImageInit) {
            super(init);
            // no context menu
            this.imageDrawing.addEventListener('contextmenu', (event) => event.preventDefault());
            this.imageDrawing.addEventListener('load', (e) => this.onImageLoad(e));
            this.imageDrawing.addEventListener('error', (e) => this.onImageError(e));
            if (init) {
                if (init.src !== undefined)
                    this.src = init.src;
                if (init.onready)
                    this.ready.connect(init.onready);
                if (init.onerror)
                    this.error.connect(init.onerror);
            }
        }

        //
        // Get the URL of the image
        //
        get src(): string | undefined {
            return this._src;
        }

        //
        // Set the URL of the image. When the image is loaded,
        // ready event is fired and getIsReady return true.
        //
        set src(src: string | undefined) {
            //if (src === undefined)
            //	throw ('Image src cant be undefined');

            this.setSrcLock = true;
            this.loaddone = false;
            this._naturalWidth = undefined;
            this._naturalHeight = undefined;
            this._src = src;
            if (src === undefined)
                this.imageDrawing.removeAttribute('src');
            else
                this.imageDrawing.setAttribute('src', src);
            if ((this.imageDrawing.complete === true) && !this.loaddone) {
                this.loaddone = true;
                this._naturalWidth = this.imageDrawing.naturalWidth;
                this._naturalHeight = this.imageDrawing.naturalHeight;
                this.ready.fire({ target: this });
                this.invalidateMeasure();
            }
            this.setSrcLock = false;
        }

        //
        // Return the natural width of the image as defined
        // in the image file. Return undefined if the image is
        // not ready
        //
        get naturalWidth(): number | undefined {
            return this._naturalWidth;
        }

        //
        // Return the natural height of the image as defined
        // in the image file. Return undefined if the image is
        // not ready
        //
        get naturalHeight(): number | undefined {
            return this._naturalHeight;
        }

        //
        // Return true if the image is loaded
        //
        get isReady(): boolean {
            return this.loaddone;
        }

        private onImageError(event) {
            this.error.fire({ target: this });
        }

        private onImageLoad(event) {
            if ((event.target != undefined) && (event.target.naturalWidth != undefined) && (event.target.naturalHeight != undefined)) {
                this._naturalWidth = event.target.naturalWidth;
                this._naturalHeight = event.target.naturalHeight;
                if (!this.loaddone) {
                    this.loaddone = true;
                    this.ready.fire({ target: this });
                }
                this.invalidateMeasure();
            }
            else {
                if (this.setSrcLock)
                    new Core.DelayedTask(0, this.onImageDelayReady);
                else
                    this.onImageDelayReady();
            }
        }

        private onAppReady = () => {
            Ui.App.ready.disconnect(this.onAppReady);
            this.onImageDelayReady();
        }

        private onImageDelayReady() {
            if (!Ui.App.isReady)
                Ui.App.ready.connect(this.onAppReady);
            else {
                this.loaddone = true;
                if (document.body == undefined) {
                    let body = document.createElement('body');
                    document.body = body;
                }
                let imgClone = document.createElement('img');
                if (this._src)
                    imgClone.setAttribute('src', this._src);
                document.body.appendChild(imgClone);
                this._naturalWidth = imgClone.width;
                this._naturalHeight = imgClone.height;
                document.body.removeChild(imgClone);
                this.ready.fire({ target: this });
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
            this.imageDrawing.style.overflow = 'hidden';
            this.imageDrawing.setAttribute('draggable', 'false');
            if (Core.Navigator.isWebkit) {
                // no text selection
                this.imageDrawing.style.webkitUserSelect = 'none';
                // no context menu
                this.imageDrawing.style['webkitTouchCallout'] = 'none';
            }
            else if (Core.Navigator.isGecko)
                this.imageDrawing.style['MozUserSelect'] = 'none';
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
                    size = {
                        width: ((this._naturalWidth as number) * fixedHeight) / (this._naturalHeight as number),
                        height: fixedHeight
                    };
                }
            }
            else {
                if (this.height === undefined) {
                    let fixedWidth = this.width - (this.marginLeft + this.marginRight);
                    size = {
                        width: fixedWidth,
                        height: ((this._naturalHeight as number) * fixedWidth) / (this._naturalWidth as number)
                    };
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
