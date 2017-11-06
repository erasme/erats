namespace Ui {
	export interface ContentEditableInit extends HtmlInit {
	}

	export class ContentEditable extends Html {
		anchorNode: Node;
		anchorOffset: number = 0;
	
		constructor(init?: Partial<ContentEditableInit>) {
			super();
			this.addEvents('anchorchange');

			this.selectable = true;
			this.drawing.setAttribute('contenteditable', 'true');
			this.connect(this.drawing, 'keyup', this.onKeyUp);
			this.connect(this.drawing, 'DOMSubtreeModified', this.onContentSubtreeModified);
			if (init)
				this.assign(init);
		}

		protected onKeyUp(event) {
			this.testAnchorChange();
		}

		protected testAnchorChange() {
			if ((window.getSelection().anchorNode != this.anchorNode) ||
				(window.getSelection().anchorOffset != this.anchorOffset)) {
				this.anchorNode = window.getSelection().anchorNode;
				this.anchorOffset = window.getSelection().anchorOffset;
				this.fireEvent('anchorchange', this);
			}
		}

		protected onContentSubtreeModified(event) {
			this.testAnchorChange();
			this.invalidateMeasure();
		}
	}
}	
	