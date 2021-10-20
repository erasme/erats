namespace Ui {
    export interface IFrameInit extends ElementInit {
        src?: string;
        allowFullscreen?: boolean;
    }

    export class IFrame extends Element {
        protected iframeDrawing!: HTMLIFrameElement;
        protected _isReady: boolean = false;
        readonly ready = new Core.Events<{ target: IFrame }>();
        set onready(value: (event: { target: IFrame }) => void) { this.ready.connect(value); }
        readonly locationchanged = new Core.Events<{ target: IFrame, value: Location }>();
        set onlocationchanged(value: (event: { target: IFrame, value: Location }) => void) { this.locationchanged.connect(value); }

        constructor(init?: IFrameInit) {
            super(init);
            this.iframeDrawing.addEventListener('load', () => {
                try {
                    if (this.isReady) {
                        let location = this.iframeDrawing.contentWindow!.location;
                        this.locationchanged.fire({ target: this, value: location });
                    }
                } catch { }
                this.onIFrameLoad();
            });
            if (init) {
                if (init.src !== undefined)
                    this.src = init.src;
                if (init.allowFullscreen !== undefined)
                    this.allowFullscreen = init.allowFullscreen;
            }
        }

        get src(): string {
            return this.iframeDrawing.src;
        }

        set src(src: string) {
            this._isReady = false;
            this.iframeDrawing.src = src;
        }

        get allowFullscreen(): boolean {
            return this.iframeDrawing.allowFullscreen
        }

        set allowFullscreen(allowFullscreen: boolean) {
            this.iframeDrawing.allowFullscreen = allowFullscreen;
        }

        get isReady(): boolean {
            return this._isReady;
        }

        protected onIFrameLoad() {
            if (!this._isReady) {
                this._isReady = true;
                this.ready.fire({ target: this });
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
                return this.iframeDrawing;
            }
        }

        protected arrangeCore(width: number, height: number) {
            this.iframeDrawing.style.width = width + 'px';
        }
    }
}

