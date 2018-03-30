namespace Ui {
	export interface ContentEditableInit extends HtmlInit {
		onanchorchanged?: (event: { target: ContentEditable }) => void;
		onchanged?: (event: { target: ContentEditable }) => void;
		onvalidated?: (event: { target: ContentEditable }) => void;
	}

	export class ContentEditable extends Html {
		anchorNode?: Node;
		anchorOffset: number = 0;
		readonly anchorchanged = new Core.Events<{ target: ContentEditable }>();
		readonly changed = new Core.Events<{ target: ContentEditable }>();
		readonly validated = new Core.Events<{ target: ContentEditable }>();
		private _lastHtml = '';
	
		constructor(init?: ContentEditableInit) {
			super(init);
			this.selectable = true;
			this.htmlDrawing.setAttribute('contenteditable', 'true');
			this.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));
			this.drawing.addEventListener('DOMSubtreeModified', (e) => this.onContentSubtreeModified(e));
			if (init) {
				if (init.onanchorchanged)
					this.anchorchanged.connect(init.onanchorchanged);
				if (init.onchanged)
					this.changed.connect(init.onchanged);
				if (init.onvalidated)
					this.validated.connect(init.onvalidated);
			}	
		}

		protected onKeyUp(event) {
			this.testAnchorChange();
			let key = event.which;
			// if enter pressed
			if (key == 13)
				this.validated.fire({ target: this });
		}


		protected testAnchorChange() {
			if ((window.getSelection().anchorNode != this.anchorNode) ||
				(window.getSelection().anchorOffset != this.anchorOffset)) {
				this.anchorNode = window.getSelection().anchorNode;
				this.anchorOffset = window.getSelection().anchorOffset;
				this.anchorchanged.fire({ target: this });
			}
		}

		protected onContentSubtreeModified(event) {
			this.testAnchorChange();
			this.invalidateMeasure();
		}

		protected measureCore(width: number, height: number) {
			let html = this.htmlDrawing.outerHTML;
			if (this._lastHtml !== html) {
				this._lastHtml = html;
				this.changed.fire({ target: this });
			}
			return super.measureCore(width, height);
		}
	}
}	
	