namespace Ui {
	export interface ContentEditableInit extends HtmlInit {
	}

	export class ContentEditable extends Html {
		anchorNode: Node;
		anchorOffset: number = 0;
		readonly anchorchanged = new Core.Events<{ target: ContentEditable }>();
	
		constructor(init?: ContentEditableInit) {
			super(init);
			this.selectable = true;
			this.htmlDrawing.setAttribute('contenteditable', 'true');
			this.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));
			this.drawing.addEventListener('DOMSubtreeModified', (e) => this.onContentSubtreeModified(e));
		}

		protected onKeyUp(event) {
			this.testAnchorChange();
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
	}
}	
	