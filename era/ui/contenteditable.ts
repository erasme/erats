namespace Ui {
    export interface ContentEditableInit extends HtmlInit {
        onanchorchanged?: (event: { target: ContentEditable }) => void;
        onchanged?: (event: { target: ContentEditable, element: HTMLElement }) => void;
        onvalidated?: (event: { target: ContentEditable }) => void;
    }

    export class ContentEditable extends Html {
        anchorNode?: Node;
        anchorOffset: number = 0;
        private _hasSelection: boolean = false;
        readonly anchorchanged = new Core.Events<{ target: ContentEditable }>();
        set onanchorchanged(value: (event: { target: ContentEditable }) => void) { this.anchorchanged.connect(value); }
        readonly changed = new Core.Events<{ target: ContentEditable, element: HTMLElement }>();
        set onchanged(value: (event: { target: ContentEditable, element: HTMLElement }) => void) { this.changed.connect(value); }
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
            if (init) {
                if (init.onanchorchanged)
                    this.anchorchanged.connect(init.onanchorchanged);
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
                if (init.onvalidated)
                    this.validated.connect(init.onvalidated);
            }
        }

        protected onSetHtml() {
            super.onSetHtml();
            let html = this.htmlDrawing.outerHTML;
            if (this._lastHtml !== html) {
                this._lastHtml = html;
                this.changed.fire({ target: this, element: this.htmlDrawing });
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
                this.changed.fire({ target: this, element: this.htmlDrawing });
            }
            return super.measureCore(width, height);
        }

        static unwrapNode(node: Node) {
            let parent = node.parentNode;
            if (!parent)
                return;
            while (node.firstChild) {
                parent.insertBefore(node.firstChild, node);
            }
            parent.removeChild(node);
        }

        static filterNode(node: Node, allowedTags: string[], removeScript: boolean = false) {
            let childNodes: Node[] = [];
            for (let i = 0; i < node.childNodes.length; i++)
                childNodes.push(node.childNodes[i]);
            for (let child of childNodes)
                ContentEditable.filterNode(child, allowedTags, removeScript);
            if (allowedTags.indexOf(node.nodeName) == -1)
                ContentEditable.unwrapNode(node);
            let element = node as HTMLElement;
            if (element.removeAttribute) {
                element.removeAttribute('style');
                if (removeScript) {
                    let rmAttrs: string[] = [];
                    for (let i = 0; i < element.attributes.length; i++) {
                        let attr = element.attributes[i];
                        if (attr.name.indexOf('on') == 0)
                            rmAttrs.push(attr.name);
                    }
                    for (let attrName of rmAttrs)
                        element.removeAttribute(attrName);
                }
            }
        };

        static filterHtmlContent(rootElement: HTMLElement, allowedTags: string[], removeScript: boolean = false) {
            let childNodes: Node[] = [];
            for (let i = 0; i < rootElement.childNodes.length; i++)
                childNodes.push(rootElement.childNodes[i]);
            for (let child of childNodes)
                ContentEditable.filterNode(child, allowedTags, removeScript);
        }

        static filterHtmlString(html: string, allowedTags: string[], removeScript: boolean = false) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            // filter tags
            Ui.ContentEditable.filterHtmlContent(doc.documentElement, allowedTags, true);
            return doc.documentElement.innerHTML;
        }

        findTag(tagName: string): Node | undefined {
            let selection = window.getSelection();
            if (selection == null)
                return undefined;
            if (selection.anchorNode == null)
                return undefined;
            let current: Node | null = selection.anchorNode;
            while (current) {
                if (current == this.htmlDrawing)
                    return undefined;
                if (current.nodeName == tagName)
                    return current;
                current = current.parentNode;
            }
            return undefined;
        }

        static saveSelection(): Range | null {
            let selection = window.getSelection();
            return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
        }

        static restoreSelection(range: Range | null) {
            if (range) {
                let selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    }
}	
