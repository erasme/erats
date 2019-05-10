namespace Ui {
    export interface UploadableInit extends PressableInit {
    }

    export class Uploadable extends Pressable {
        protected _content: Element;
        protected input: UploadableFileWrapper;
        readonly file = new Core.Events<{ target: Uploadable, file: File }>();
        set onfile(value: (event: { target: Uploadable, file: File }) => void) { this.file.connect(value); }

        constructor(init?: UploadableInit) {
            super(init);
            this.drawing.style.cursor = 'pointer';

            this.focusable = true;
            this.role = 'button';

            this.input = new UploadableFileWrapper();
            this.append(this.input);
            this.input.file.connect((e) => this.onFile(e.target, e.file));
        }

        setDirectoryMode(active: boolean) {
            this.input.setDirectoryMode(active);
        }

        set directoryMode(active: boolean) {
            this.input.directoryMode = active;
        }

        set multiple(active: boolean) {
            this.input.multiple = active;
        }

        protected onFile(fileWrapper, file: File) {
            this.file.fire({ target: this, file: file });
        }

        protected onPress() {
            if (this.input instanceof UploadableFileWrapper)
                this.input.select();
        }

        set content(content: Element) {
            if (this._content !== content) {
                if (this._content !== undefined)
                    this.remove(this._content);
                if (content !== undefined) {
                    if (this.input instanceof Ui.UploadableWrapper)
                        this.prepend(content);
                    else
                        this.append(content);
                }
                this._content = content;
            }
        }
    }

    export class UploadableFileWrapper extends Element {
        formDrawing: HTMLFormElement;
        inputDrawing: HTMLInputElement;
        iframeDrawing: HTMLIFrameElement;
        private _directoryMode = false;
        private _multiple = false;
        private _accept?: string;
        readonly file = new Core.Events<{ target: UploadableFileWrapper, file: File }>();

        constructor() {
            super();
            this.opacity = 0;
            this.clipToBounds = true;
        }

        select() {
            this.inputDrawing.click();
        }

        set multiple(active: boolean) {
            this._multiple = active;
            if (this.inputDrawing !== undefined) {
                if (active)
                    this.inputDrawing.setAttribute('multiple', '');
                else
                    this.inputDrawing.removeAttribute('multiple');
            }
        }

        setDirectoryMode(active) {
            this.directoryMode = active;
        }

        set directoryMode(active: boolean) {
            this._directoryMode = active;
            if (this.inputDrawing !== undefined) {
                if (this._directoryMode)
                    this.inputDrawing.setAttribute('webkitdirectory', '');
                else
                    this.inputDrawing.removeAttribute('webkitdirectory');
            }
        }

        set accept(value: string | undefined) {
            this._accept = value;
            if (this.inputDrawing !== undefined) {
                if (this._accept)
                    this.inputDrawing.setAttribute('accept', value);
                else
                    this.inputDrawing.removeAttribute('accept');
            }
        }

        protected createInput() {
            this.formDrawing = document.createElement('form');
            this.formDrawing.addEventListener('click', (e) => e.stopPropagation());
            this.formDrawing.addEventListener('touchstart', (e) => e.stopPropagation());
            this.formDrawing.method = 'POST';
            this.formDrawing.enctype = 'multipart/form-data';
            // needed for IE < 9
            this.formDrawing.encoding = 'multipart/form-data';
            this.formDrawing.style.position = 'absolute';

            this.inputDrawing = document.createElement('input');
            this.inputDrawing.type = 'file';
            this.inputDrawing.setAttribute('name', 'file');
            if (this._directoryMode)
                this.inputDrawing.setAttribute('webkitdirectory', '');
            if (this._multiple)
                this.inputDrawing.setAttribute('multiple', '');
            if (this._accept)
                this.inputDrawing.setAttribute('accept', this._accept);
            this.inputDrawing.style.position = 'absolute';
            this.inputDrawing.tabIndex = -1;

            this.inputDrawing.addEventListener('change', this.onChange);
            this.formDrawing.appendChild(this.inputDrawing);

            if (Core.Navigator.supportFileAPI) {
                while (this.drawing.childNodes.length > 0)
                    this.drawing.removeChild(this.drawing.childNodes[0]);
                this.drawing.appendChild(this.formDrawing);
                this.arrange(this.layoutX, this.layoutY, this.layoutWidth, this.layoutHeight);
            }
            else {
                // create an iframe now for the async POST
                // needed because browser like IE9 don't support
                // unloading the input file from the DOM (else it is cleared)
                this.iframeDrawing = document.createElement('iframe');
                this.iframeDrawing.style.position = 'absolute';
                this.iframeDrawing.style.top = '0px';
                this.iframeDrawing.style.left = '0px';
                this.iframeDrawing.style.width = '0px';
                this.iframeDrawing.style.height = '0px';
                this.iframeDrawing.style.clip = 'rect(0px 0px 0px 0px)';

                document.body.appendChild(this.iframeDrawing);
                this.iframeDrawing.contentWindow.document.write("<!DOCTYPE html><html><body></body></html>");
                this.iframeDrawing.contentWindow.document.body.appendChild(this.formDrawing);
            }
        }

        protected onChange = (event) => {
            event.preventDefault();
            event.stopPropagation();

            for (var i = 0; i < this.inputDrawing.files.length; i++)
                this.file.fire({ target: this, file: this.inputDrawing.files[i] });
        }

        protected onLoad() {
            super.onLoad();
            this.createInput();
        }

        protected onUnload() {
            this.inputDrawing.removeEventListener('change', this.onChange);
            if (this.iframeDrawing !== undefined)
                document.body.removeChild(this.iframeDrawing);
            super.onUnload();
        }

        protected arrangeCore(w: number, h: number) {
            super.arrangeCore(w, h);
            if (this.formDrawing !== undefined) {
                this.formDrawing.style.top = '0px';
                this.formDrawing.style.left = '0px';
                this.formDrawing.style.width = Math.round(w) + 'px';
                this.formDrawing.style.height = Math.round(h) + 'px';
            }
            if (this.inputDrawing !== undefined) {
                this.inputDrawing.style.top = '0px';
                this.inputDrawing.style.left = '0px';
                this.inputDrawing.style.width = Math.round(w) + 'px';
                this.inputDrawing.style.height = Math.round(h) + 'px';
            }
        }
    }

    export class UploadableWrapper extends Element {
        formDrawing: HTMLFormElement;
        inputDrawing: HTMLInputElement;
        directoryMode: boolean = false;
        readonly file = new Core.Events<{ target: UploadableWrapper, file: File }>();

        constructor() {
            super();
            this.clipToBounds = true;
            this.opacity = 0;
        }

        setDirectoryMode(active) {
        }

        protected createInput() {

            this.formDrawing = document.createElement('form');
            this.formDrawing.method = 'POST';
            this.formDrawing.enctype = 'multipart/form-data';
            this.formDrawing.encoding = 'multipart/form-data';
            this.formDrawing.style.display = 'block';
            this.formDrawing.style.position = 'absolute';
            this.formDrawing.style.left = '0px';
            this.formDrawing.style.top = '0px';
            this.formDrawing.style.width = this.layoutWidth + 'px';
            this.formDrawing.style.height = this.layoutHeight + 'px';

            this.inputDrawing = document.createElement('input');
            this.inputDrawing.type = 'file';
            this.inputDrawing.name = 'file';
            this.inputDrawing.tabIndex = -1;
            this.inputDrawing.style.fontSize = '200px';
            this.inputDrawing.style.display = 'block';
            this.inputDrawing.style.cursor = 'pointer';
            this.inputDrawing.style.position = 'absolute';
            this.inputDrawing.style.left = '0px';
            this.inputDrawing.style.top = '0px';
            this.inputDrawing.style.width = this.layoutWidth + 'px';
            this.inputDrawing.style.height = this.layoutHeight + 'px';
            this.formDrawing.appendChild(this.inputDrawing);

            this.inputDrawing.addEventListener('change', (e) => this.onChange(e));

            if (Core.Navigator.isWebkit)
                this.inputDrawing.style.webkitUserSelect = 'none';
            this.inputDrawing.addEventListener('touchstart', (event) => {
                (event as any).dontPreventDefault = true;
            });
            this.inputDrawing.addEventListener('touchend', (event) => {
                (event as any).dontPreventDefault = true;
            });

            return this.formDrawing;
        }

        onChange(event) {
            for (var i = 0; i < this.inputDrawing.files.length; i++)
                this.file.fire({ target: this, file: this.inputDrawing.files[i] });
        }

        protected renderDrawing() {
            var drawing = super.renderDrawing();
            drawing.appendChild(this.createInput());
        }

        protected arrangeCore(width: number, height: number) {
            this.formDrawing.style.width = Math.round(width) + 'px';
            this.formDrawing.style.height = Math.round(height) + 'px';
            this.inputDrawing.style.width = Math.round(width) + 'px';
            this.inputDrawing.style.height = Math.round(height) + 'px';
        }
    }
}

