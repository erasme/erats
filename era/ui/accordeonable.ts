namespace Ui {
    export type AccordeonOrientation = 'horizontal' | 'vertical';

    export interface AccordeonableInit extends ContainerInit {
    }

    export class Accordeonable extends Container {
        private current: number = -1;
        private _currentPage?: AccordeonPage;
        private clock?: Anim.Clock;
        private headersSize: number = 0;
        private contentSize: number = 0;
        private _orientation: AccordeonOrientation = 'horizontal';
        readonly changed = new Core.Events<{ target: Accordeonable, page: AccordeonPage, position: number }>();
        set onchanged(value: (event: { target: Accordeonable, page: AccordeonPage, position: number }) => void) { this.changed.connect(value); }

        /**
        *	@constructs
        *	@class The accordeon is a layout element to present only one element (page)
        * visible at a time. The header of a page is used to control which
        * page is visible.
        *	@extends Ui.Container
        */
        constructor(init?: AccordeonableInit) {
            super(init);
            this.clipToBounds = true;
        }

        /**
        * @return the orientation of the accordeon
        * possibles values: [horizontal|vertical]
        * default value: horizontal
        */
        get orientation(): AccordeonOrientation {
            return this._orientation;
        }

        /**
        * Set the orientation of the accordeon
        * possibles values: [horizontal|vertical]
        * default value: horizontal
        */
        set orientation(orientation: AccordeonOrientation) {
            if (this._orientation != orientation) {
                this._orientation = orientation;
                for (let i = 0; i < this.pages.length; i++)
                    this.pages[i].setOrientation(orientation);
                this.invalidateMeasure();
            }
        }

        /**
        * Return the array of page in the accordeonable.
        * WARNING: use it only in readonly
        */
        get pages(): AccordeonPage[] {
            return this.children as AccordeonPage[];
        }

        /**
        * @return the current opened page
        */
        get currentPage(): AccordeonPage | undefined {
            return this._currentPage;
        }

        /**
        * Set the given page as the current opened page
        */
        set currentPage(page: AccordeonPage | undefined) {
            for (let i = 0; i < this.pages.length; i++) {
                if (this.pages[i] == page) {
                    this.currentPosition = i;
                    return;
                }
            }
        }

        /**
        * @return the current page position (start at 0 or -1 if empty)
        */
        get currentPosition(): number {
            return this.current;
        }

        /**
        * Set the page at the given position as the
        * current opened page
        */
        set currentPosition(pos: number) {
            if (this.pages.length === 0) {
                if (this._currentPage !== undefined)
                    this._currentPage.unselect();
                this._currentPage = undefined;
                this.current = -1;
            }
            else {
                this.current = pos;
                let newPage = this.pages[this.current];
                if (newPage !== this._currentPage) {
                    if (this._currentPage !== undefined)
                        this._currentPage.unselect();
                    this._currentPage = newPage;
                    this.changed.fire({ target: this, page: this._currentPage, position: this.current });
                    this._currentPage.selected.disconnect(this.onPageSelect);
                    this._currentPage.select();
                    this._currentPage.selected.connect(this.onPageSelect);
                }
                if (this.clock !== undefined)
                    this.clock.stop();
                this.clock = new Anim.Clock({ duration: 2, target: this });
                this.clock.timeupdate.connect(e => this.onClockTick(e.target, e.progress));
                this.clock.begin();
            }
        }

        /**
        * Append a new AccordeonPage in the current
        * accordeon
        */
        appendPage(page: AccordeonPage, autoSelect: boolean = true) {
            this.appendChild(page);
            page.setOffset(1);
            page.setOrientation(this._orientation);
            page.selected.connect(this.onPageSelect);
            page.closed.connect(this.onPageClose);
            if (autoSelect)
                page.select();
        }

        /**
        * Remove the given AccordeonPage from the current
        * accordeon
        */
        removePage(page: AccordeonPage) {
            let pos = -1;
            for (let i = 0; i < this.pages.length; i++) {
                if (this.pages[i] == page) {
                    pos = i;
                    break;
                }
            }
            if (pos !== -1) {
                page.selected.disconnect(this.onPageSelect);
                page.closed.disconnect(this.onPageClose);
                this.removeChild(page);
                if ((this.current === pos) && (this.current === 0))
                    this.currentPosition = 0;
                else if (this.current >= pos)
                    this.currentPosition = this.current - 1;
                else
                    this.currentPosition = this.current;
            }
        }

        private onClockTick(clock: Anim.Clock, progress: number) {
            for (let i = 0; i < this.pages.length; i++) {
                let child = this.pages[i];

                if (i == this.current)
                    child.showContent();

                let offset = child.getOffset();
                if (offset > 1)
                    child.setOffset(1);
                else {
                    let destOffset;
                    if (i <= this.current)
                        destOffset = 0;
                    else
                        destOffset = 1;
                    child.setOffset(destOffset - ((destOffset - offset) * (1 - progress)));
                }
                if ((progress == 1) && (i != this.current))
                    child.hideContent();
            }
        }

        private onPageSelect = (e: { target: AccordeonPage }) => {
            this.currentPage = e.target;
        }

        private onPageClose = (e: { target: AccordeonPage }) => {
            this.removePage(e.target);
        }

        private measureHorizontal(width: number, height: number) {
            let i; let size; let child; let content;
            let minHeaders = 0;
            let minContent = 0;
            let minHeight = 0;

            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                size = child.measure(width, height);
                minHeaders += child.getHeader().measureWidth;
                if (child.getHeader().measureHeight > minHeight)
                    minHeight = child.getHeader().measureHeight;
            }

            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                size = child.measure((width - minHeaders) + child.getHeader().measureWidth, height);

                content = child.getContent();
                if ((content !== undefined) && (content.measureWidth > minContent)) {
                    minContent = content.measureWidth;
                    if (content.measureHeight > minHeight)
                        minHeight = content.measureHeight;
                }
            }
            this.headersSize = minHeaders;
            return { width: minHeaders + minContent, height: minHeight };
        }

        private measureVertical(width: number, height: number) {
            let i; let child; let size; let content;
            let minHeaders = 0;
            let minContent = 0;
            let minWidth = 0;

            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                size = child.measure(width, height);
                minHeaders += child.getHeader().measureHeight;
                if (child.getHeader().measureWidth > minWidth)
                    minWidth = child.getHeader().measureWidth;
            }

            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                size = child.measure(width, (height - minHeaders) + child.getHeader().measureHeight);

                content = child.getContent();
                if ((content !== undefined) && (content.measureHeight > minContent)) {
                    minContent = content.measureHeight;
                    if (content.measureWidth > minWidth)
                        minWidth = content.measureWidth;
                }
            }
            this.headersSize = minHeaders;
            return { width: minWidth, height: minHeaders + minContent };
        }

        protected measureCore(width: number, height: number) {
            if (this._orientation == 'horizontal')
                return this.measureHorizontal(width, height);
            else
                return this.measureVertical(width, height);
        }

        protected arrangeCore(width: number, height: number) {
            let i; let child; let x; let y;
            if (this._orientation == 'horizontal') {
                x = 0;
                this.contentSize = width - this.headersSize;
                for (i = 0; i < this.children.length; i++) {
                    child = this.children[i];
                    child.arrange(x, 0, this.contentSize + child.getHeader().measureWidth, height);
                    x += child.getHeader().measureWidth;
                }
            }
            else {
                y = 0;
                this.contentSize = height - this.headersSize;
                for (i = 0; i < this.children.length; i++) {
                    child = this.children[i];
                    child.arrange(0, y, width, this.contentSize + child.getHeader().measureHeight);
                    y += child.getHeader().measureHeight;
                }
            }
        }
    }

    export class AccordeonPage extends Container {
        headerBox: Pressable;
        header?: Element;
        content?: Element;
        offset: number = 0;
        orientation: 'vertical' | 'horizontal' = 'horizontal';
        isSelected: boolean = false;
        selected = new Core.Events<{ target: AccordeonPage }>();
        set onselected(value: (event: { target: AccordeonPage }) => void) { this.selected.connect(value); }
        unselected = new Core.Events<{ target: AccordeonPage }>();
        set onunselected(value: (event: { target: AccordeonPage }) => void) { this.unselected.connect(value); }
        closed = new Core.Events<{ target: AccordeonPage }>();
        set onclosed(value: (event: { target: AccordeonPage }) => void) { this.closed.connect(value); }
        orientationchanged = new Core.Events<{ target: AccordeonPage, orientation: 'vertical' | 'horizontal' }>();
        set onorientationchanged(value: (event: { target: AccordeonPage, orientation: 'vertical' | 'horizontal' }) => void) { this.orientationchanged.connect(value); }

        /**
        *	@constructs
        *	@class A page for an Accordeon element
        *	@extends Ui.Container
        */
        constructor(init?) {
            super(init);

            this.headerBox = new Pressable();
            this.appendChild(this.headerBox);
            this.headerBox.pressed.connect(e => this.onHeaderPress());
        }

        /**
        * Signal that the current page need to be closed
        */
        close() {
            this.closed.fire({ target: this });
        }

        /**
        * Select the current page
        */
        select() {
            if (!this.isSelected) {
                this.isSelected = true;
                this.selected.fire({ target: this });
            }
        }

        /**
        * @return true if the current page is the current active
        * page in the Ui.Accordeonable
        */
        getIsSelected() {
            return this.isSelected;
        }

        /**
        * @return the header element
        */
        getHeader() {
            return this.header;
        }

        /**
        * Set the header element.
        *	@param header Element
        * corresponding to the bar that can be pressed to
        * set the content visible
        */
        setHeader(header) {
            if (header !== this.header) {
                if (this.header !== undefined)
                    this.headerBox.removeChild(this.header);
                this.header = header;
                if (this.header !== undefined)
                    this.headerBox.appendChild(this.header);
            }
        }

        /**
        * @return the content element of the page
        */
        getContent() {
            return this.content;
        }

        /**
        * Set the content element of the page
        */
        setContent(content) {
            if (this.content !== content) {
                if (this.content !== undefined)
                    this.removeChild(this.content);
                this.content = content;
                if (this.content !== undefined)
                    this.appendChild(this.content);
            }
        }

        /**
        * @return The orientation of the accordeon
        * possibles values: [horizontal|vertical]
        * default value: horizontal
        */
        getOrientation() {
            return this.orientation;
        }

        /**
        * Set the orientation of the accordeon
        * @param orientation Possibles values: [horizontal|vertical]
        * default value: horizontal
        */
        setOrientation(orientation) {
            if (this.orientation != orientation) {
                this.orientation = orientation;
                this.orientationchanged.fire({ target: this, orientation: orientation });
                this.invalidateMeasure();
            }
        }

        /**#@+
        * @private
        */

        unselect() {
            if (this.isSelected) {
                this.isSelected = false;
                this.unselected.fire({ target: this });
            }
        }

        showContent() {
            if (this.content !== undefined) {
                this.content.show();
            }
        }

        hideContent() {
            if (this.content !== undefined) {
                this.content.hide();
            }
        }

        getOffset() {
            return this.offset;
        }

        setOffset(offset) {
            this.offset = offset;
            if (this.orientation == 'horizontal')
                this.transform = Matrix.createTranslate(this.offset * (this.layoutWidth - this.headerBox.measureWidth), 0);
            else
                this.transform = Matrix.createTranslate(0, this.offset * (this.layoutHeight - this.headerBox.measureHeight));
        }

        private onHeaderPress() {
            this.select();
        }

        /**
        * @return The required size for the current element
        */
        protected measureCore(width: number, height: number) {
            let size = this.headerBox.measure(width, height);
            let contentSize = { width: 0, height: 0 };
            if (this.content !== undefined) {
                if (this.orientation == 'horizontal') {
                    contentSize = this.content.measure(width - size.width, height);
                    if (contentSize.height > size.height)
                        size.height = contentSize.height;
                    size.width += contentSize.width;
                }
                else {
                    contentSize = this.content.measure(width, height - size.height);
                    if (contentSize.width > size.width)
                        size.width = contentSize.width;
                    size.height += contentSize.height;
                }
            }
            return size;
        }

        /**
        * Arrange children
        */
        protected arrangeCore(width: number, height: number) {
            if (this.orientation == 'horizontal') {
                this.headerBox.arrange(0, 0, this.headerBox.measureWidth, height);
                if (this.content !== undefined)
                    this.content.arrange(this.headerBox.measureWidth, 0, width - this.headerBox.measureWidth, height);
            }
            else {
                this.headerBox.arrange(0, 0, width, this.headerBox.measureHeight);
                if (this.content !== undefined)
                    this.content.arrange(0, this.headerBox.measureHeight, width, height - this.headerBox.measureHeight);
            }
            this.setOffset(this.offset);
        }
    }
}

