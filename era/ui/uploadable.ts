namespace Ui {
	export interface UploadableInit extends PressableInit {
	}

	export class Uploadable extends Pressable {
		protected _content: Element;
		protected input: UploadableFileWrapper;

		constructor(init?: UploadableInit) {
			super(init);
			this.drawing.style.cursor = 'pointer';

			this.focusable = true;
			this.role = 'button';

			this.addEvents('file');
		
			this.input = new UploadableFileWrapper();
			this.append(this.input);
			this.connect(this.input, 'file', this.onFile);
		}

		setDirectoryMode(active) {
			this.input.setDirectoryMode(active);
		}

		protected onFile(fileWrapper, file) {
			this.fireEvent('file', this, file);
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
		directoryMode: false;

		constructor() {
			super();
			this.opacity = 0;
			this.clipToBounds = true;
			this.addEvents('file');
		}

		select() {
			this.inputDrawing.click();
		}

		setDirectoryMode(active) {
			this.directoryMode = active;
			if (this.inputDrawing !== undefined) {
				if (this.directoryMode)
					this.inputDrawing.setAttribute('webkitdirectory', '');
				else
					this.inputDrawing.removeAttribute('webkitdirectory');
			}
		}

		protected createInput() {
			this.formDrawing = document.createElement('form');
			this.connect(this.formDrawing, 'click', function (e) {
				e.stopPropagation();
			});
			this.connect(this.formDrawing, 'touchstart', function (e) {
				e.stopPropagation();
			});
			this.formDrawing.method = 'POST';
			this.formDrawing.enctype = 'multipart/form-data';
			// needed for IE < 9
			this.formDrawing.encoding = 'multipart/form-data';
			this.formDrawing.style.position = 'absolute';

			this.inputDrawing = document.createElement('input');
			this.inputDrawing.type = 'file';
			this.inputDrawing.setAttribute('name', 'file');
			if (this.directoryMode)
				this.inputDrawing.setAttribute('webkitdirectory', '');
			this.inputDrawing.style.position = 'absolute';
			this.inputDrawing.tabIndex = -1;

			this.connect(this.inputDrawing, 'change', this.onChange);
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

		protected onChange(event) {
			event.preventDefault();
			event.stopPropagation();

			if (Core.Navigator.supportFileAPI) {
				for (var i = 0; i < this.inputDrawing.files.length; i++)
					this.fireEvent('file', this, new Core.File({ fileApi: this.inputDrawing.files[i] }));
			}
			else {
				this.disconnect(this.inputDrawing, 'change', this.onChange);
				var file = new Core.File({ iframe: this.iframeDrawing, form: this.formDrawing, fileInput: this.inputDrawing });
				this.createInput();
				this.fireEvent('file', this, file);
			}
		}

		protected onLoad() {
			super.onLoad();
			this.createInput();
		}

		protected onUnload() {
			this.disconnect(this.inputDrawing, 'change', this.onChange);
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

		constructor() {
			super();
			this.clipToBounds = true;
			this.opacity = 0;
			this.addEvents('file');
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

			this.connect(this.inputDrawing, 'change', this.onChange);
		
			if (Core.Navigator.isWebkit)
				this.inputDrawing.style.webkitUserSelect = 'none';
			this.connect(this.inputDrawing, 'touchstart', function (event) {
				event.dontPreventDefault = true;
			});
			this.connect(this.inputDrawing, 'touchend', function (event) {
				event.dontPreventDefault = true;
			});
		
			return this.formDrawing;
		}

		onChange(event) {
			if (!Core.Navigator.isOpera && Core.Navigator.supportFileAPI) {
				for (var i = 0; i < this.inputDrawing.files.length; i++)
					this.fireEvent('file', this, new Core.File({ fileApi: this.inputDrawing.files[i] }));
			}
			else {
				this.drawing.removeChild(this.formDrawing);

				var iframeDrawing = document.createElement('iframe');
				iframeDrawing.style.position = 'absolute';
				iframeDrawing.style.top = '0px';
				iframeDrawing.style.left = '0px';
				iframeDrawing.style.width = '0px';
				iframeDrawing.style.height = '0px';
				iframeDrawing.style.clip = 'rect(0px 0px 0px 0px)';

				document.body.appendChild(iframeDrawing);
				iframeDrawing.contentWindow.document.write("<!DOCTYPE html><html><body></body></html>");
				iframeDrawing.contentWindow.document.body.appendChild(this.formDrawing);

				this.disconnect(this.inputDrawing, 'change', this.onChange);
				this.fireEvent('file', this, new Core.File({ iframe: iframeDrawing, form: this.formDrawing, fileInput: this.inputDrawing }));

				this.drawing.appendChild(this.createInput());
			}
		}

		protected renderDrawing() {
			var drawing =super.renderDrawing();
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

