namespace Ui {
    export interface ContentEditableInit extends HtmlInit {
        onanchorchanged?: (event: { target: ContentEditable }) => void;
        onchanged?: (event: { target: ContentEditable }) => void;
        onvalidated?: (event: { target: ContentEditable }) => void;
    }

    export class ContentEditable extends Html {
        anchorNode?: Node;
        anchorOffset: number = 0;
        private _hasSelection: boolean = false;
        readonly anchorchanged = new Core.Events<{ target: ContentEditable }>();
        set onanchorchanged(value: (event: { target: ContentEditable }) => void) { this.anchorchanged.connect(value); }
        readonly changed = new Core.Events<{ target: ContentEditable }>();
        set onchanged(value: (event: { target: ContentEditable }) => void) { this.changed.connect(value); }
        readonly validated = new Core.Events<{ target: ContentEditable }>();
        set onvalidated(value: (event: { target: ContentEditable }) => void) { this.validated.connect(value); }
        readonly selectionentered = new Core.Events<{ target: ContentEditable }>();
        set onselectionentered(value: (event: { target: ContentEditable }) => void) { this.selectionentered.connect(value); }
        readonly selectionleaved = new Core.Events<{ target: ContentEditable }>();
        set onselectionleaved(value: (event: { target: ContentEditable }) => void) { this.selectionleaved.connect(value); }

        private _lastHtml = '';

        constructor(init?: ContentEditableInit) {
            super(init);
            this.selectable = true;
            (this.drawing as HTMLDivElement).removeAttribute('tabindex');
            this.htmlDrawing.setAttribute('contenteditable', 'true');
            this.drawing.addEventListener('blur', (e) => {
                let node = window.getSelection().anchorNode;
                if (window.getSelection().isCollapsed && this._hasSelection) {
                    this._hasSelection = false;
                    this.selectionleaved.fire({ target: this });
                }
                this.onBlur();
            }, true);
            this.drawing.addEventListener('focus', (e) => this.onFocus(), true);
            this.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));
            if ((<any>window).MutationObserver) {
                var observer = new MutationObserver((e) => this.onContentSubtreeModified(e));
                observer.observe(this.drawing, {
                    attributes: false,
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }

            //this.drawing.addEventListener('DOMSubtreeModified', (e) => this.onContentSubtreeModified(e));
            if (init) {
                if (init.onanchorchanged)
                    this.anchorchanged.connect(init.onanchorchanged);
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
                if (init.onvalidated)
                    this.validated.connect(init.onvalidated);
            }
        }

        protected onDisable() {
            super.onDisable();
            this.htmlDrawing.setAttribute('contenteditable', 'false');
        }

        protected onEnable() {
            super.onEnable();
            this.htmlDrawing.setAttribute('contenteditable', 'true');
        }

        protected onLoad() {
            super.onLoad();
            document.addEventListener('selectionchange', this.testAnchorChange);
        }

        protected onUnload() {
            super.onUnload();
            document.removeEventListener('selectionchange', this.testAnchorChange);
        }

        protected onKeyUp(event) {
            this.testAnchorChange();
            let key = event.which;
            // if enter pressed
            if (key == 13)
                this.validated.fire({ target: this });
        }

        protected testAnchorChange = () => {
            let node = window.getSelection().anchorNode;
            // check if it's a child node
            let currentNode = node;
            while (currentNode != null && currentNode != this.drawing) {
                currentNode = currentNode.parentNode;
            }
            let hasSelection = (currentNode != null);
            if (this._hasSelection != hasSelection) {
                this._hasSelection = hasSelection;
                if (hasSelection)
                    this.selectionentered.fire({ target: this });
                else
                    this.selectionleaved.fire({ target: this });
            }
            if (!hasSelection) {
                if (this.hasFocus)
                    this.onBlur();
                return;
            }
            if (!this.hasFocus)
                this.onFocus();

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
