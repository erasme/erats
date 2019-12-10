namespace Ui {
    export type Size = { width: number, height: number };

    export type VerticalAlign = 'top' | 'center' | 'bottom' | 'stretch';

    export type HorizontalAlign = 'left' | 'center' | 'right' | 'stretch';

    export interface ElementInit {
        selectable?: boolean;
        id?: string;
        focusable?: boolean;
        resizable?: boolean;
        role?: string;
        width?: number;
        height?: number;
        maxWidth?: number;
        maxHeight?: number;
        verticalAlign?: VerticalAlign;
        horizontalAlign?: HorizontalAlign;
        clipToBounds?: boolean;
        margin?: number;
        marginTop?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
        opacity?: number;
        transform?: Matrix;
        eventsHidden?: boolean;
        style?: object;
        isDisabled?: boolean;
        isVisible?: boolean;
        onfocused?: (event: { target: Element }) => void;
        onblurred?: (event: { target: Element }) => void;
        onloaded?: (event: { target: Element }) => void;
        onunloaded?: (event: { target: Element }) => void;
    }

    export class Element extends Core.Object implements Anim.Target {
        name?: string;

        private _marginTop: number = 0;
        private _marginBottom: number = 0;
        private _marginLeft: number = 0;
        private _marginRight: number = 0;

        private _resizable: boolean = false;

        // parent
        private _parent?: Element;

        // preferred element size
        private _width?: number;
        private _height?: number;
        private _maxWidth?: number;
        private _maxHeight?: number;

        // the HTML element that correspond to
        // the current element rendering
        readonly drawing: HTMLElement;

        // measurement
        private collapse: boolean = false;
        private measureValid: boolean = false;
        private measureConstraintPixelRatio: number = 1;
        private measureConstraintWidth: number = 0;
        private measureConstraintHeight: number = 0;
        private measureConstraintIsPrint: boolean = false;
        private _measureWidth: number = 0;
        private _measureHeight: number = 0;

        // arrangement
        private arrangeValid: boolean = false;
        private arrangeX: number = 0;
        private arrangeY: number = 0;
        private arrangeWidth: number = 0;
        private arrangeHeight: number = 0;
        private arrangeIsPrint: boolean = false;
        private arrangePixelRatio: number = 1;

        // render
        drawValid: boolean = true;
        drawNext?: Element;

        layoutValid: boolean = true;
        layoutNext?: Element;
        private _layoutX: number = 0;
        private _layoutY: number = 0;
        private _layoutWidth: number = 0;
        private _layoutHeight: number = 0;

        // is loaded in the displayed tree
        private _isLoaded: boolean = false;

        // alignment when arrange is bigger than measure
        private _verticalAlign: VerticalAlign = 'stretch';
        private _horizontalAlign: HorizontalAlign = 'stretch';

        // whether or not the current element graphic
        //  is clipped to the layout size
        private _clipToBounds: boolean = false;

        clipX?: number;
        clipY?: number;
        clipWidth?: number;
        clipHeight?: number;

        // handle visible
        private _visible?: boolean;
        private _parentVisible?: boolean;
        private _eventsHidden: boolean = false;

        // whether or not the current element can get focus
        private _focusable: boolean = false;
        private _hasFocus: boolean = false;
        isMouseFocus: boolean = false;
        isMouseDownFocus: boolean = false;

        private _selectable: boolean = false;

        private _transform?: Matrix;
        transformOriginX: number = 0.5;
        transformOriginY: number = 0.5;
        transformOriginAbsolute: boolean = false;

        // if the current element is the target of
        // an active clock
        animClock?: Anim.Clock;

        private _opacity: number = 1;

        // handle disable
        private _disabled?: boolean;
        parentDisabled?: boolean;

        // handle styles
        private _style: object | undefined;
        private _parentStyle: object | undefined;
        mergeStyle: object | undefined;

        readonly focused = new Core.Events<{ target: Element }>();
        set onfocused(value: (event: { target: Element }) => void) { this.focused.connect(value); }

        readonly blurred = new Core.Events<{ target: Element }>();
        set onblurred(value: (event: { target: Element }) => void) { this.blurred.connect(value); }

        readonly loaded = new Core.Events<{ target: Element }>();
        set onloaded(value: (event: { target: Element }) => void) { this.loaded.connect(value); }

        readonly unloaded = new Core.Events<{ target: Element }>();
        set onunloaded(value: (event: { target: Element }) => void) { this.unloaded.connect(value); }

        readonly enabled = new Core.Events<{ target: Element }>();
        set onenabled(value: (event: { target: Element }) => void) { this.enabled.connect(value); }

        readonly disabled = new Core.Events<{ target: Element }>();
        set ondisabled(value: (event: { target: Element }) => void) { this.disabled.connect(value); }

        readonly visible = new Core.Events<{ target: Element }>();
        set onvisible(value: (event: { target: Element }) => void) { this.visible.connect(value); }

        readonly hidden = new Core.Events<{ target: Element }>();
        set onhidden(value: (event: { target: Element }) => void) { this.hidden.connect(value); }

        readonly dragover = new Core.Events<DragEvent>();
        set ondragover(value: (event: DragEvent) => void) { this.dragover.connect(value); }

        // @constructs
        // @class Define the base class for all GUI elements
        constructor(init?: ElementInit) {
            super();
            // create the drawing container
            this.drawing = this.renderDrawing();
            if (DEBUG) {
                this.drawing.setAttribute('eraClass', this.getClassName());
                (<any>this.drawing).data = this;
            }
            this.drawing.style.position = 'absolute';
            this.drawing.style.left = '0px';
            this.drawing.style.top = '0px';
            this.drawing.style.width = '0px';
            this.drawing.style.height = '0px';
            this.drawing.style.visibility = 'hidden';

            this.drawing.style.outline = 'none';
            // set the transformOrigin to 0 0. Do it only once for performance
            this.drawing.style.transformOrigin = '0 0';
            if (Core.Navigator.isIE)
                (<any>this.drawing).style.msTransformOrigin = '0 0';
            else if (Core.Navigator.isGecko)
                (<any>this.drawing).style.MozTransformOrigin = '0 0';
            else if (Core.Navigator.isWebkit)
                (<any>this.drawing).style.webkitTransformOrigin = '0 0';

            this.drawing.addEventListener('focus', (e) => this.onFocus(e));
            this.drawing.addEventListener('blur', (e) => this.onBlur(e));
            this.selectable = false;

            if (init) {
                if (init.selectable !== undefined)
                    this.selectable = init.selectable;
                if (init.id !== undefined)
                    this.id = init.id;
                if (init.focusable !== undefined)
                    this.focusable = init.focusable;
                if (init.resizable !== undefined)
                    this.resizable = init.resizable;
                if (init.role !== undefined)
                    this.role = init.role;
                if (init.width !== undefined)
                    this.width = init.width;
                if (init.height !== undefined)
                    this.height = init.height;
                if (init.maxWidth !== undefined)
                    this.maxWidth = init.maxWidth;
                if (init.maxHeight !== undefined)
                    this.maxHeight = init.maxHeight;
                if (init.verticalAlign !== undefined)
                    this.verticalAlign = init.verticalAlign;
                if (init.horizontalAlign !== undefined)
                    this.horizontalAlign = init.horizontalAlign;
                if (init.clipToBounds !== undefined)
                    this.clipToBounds = init.clipToBounds;
                if (init.margin !== undefined)
                    this.margin = init.margin;
                if (init.marginTop !== undefined)
                    this.marginTop = init.marginTop;
                if (init.marginBottom !== undefined)
                    this.marginBottom = init.marginBottom;
                if (init.marginLeft !== undefined)
                    this.marginLeft = init.marginLeft;
                if (init.marginRight !== undefined)
                    this.marginRight = init.marginRight;
                if (init.opacity !== undefined)
                    this.opacity = init.opacity;
                if (init.transform !== undefined)
                    this.transform = init.transform;
                if (init.eventsHidden !== undefined)
                    this.eventsHidden = init.eventsHidden;
                if (init.style !== undefined)
                    this.style = init.style;
                if (init.isDisabled !== undefined)
                    this.isDisabled = init.isDisabled;
                if (init.isVisible !== undefined)
                    this.isVisible = init.isVisible;
                if (init.onfocused)
                    this.focused.connect(init.onfocused);
                if (init.onblurred)
                    this.blurred.connect(init.onblurred);
                if (init.onloaded)
                    this.loaded.connect(init.onloaded);
                if (init.onunloaded)
                    this.unloaded.connect(init.onunloaded)
            }
        }

        get selectable(): boolean {
            return this._selectable;
        }

        set selectable(selectable: boolean) {
            this._selectable = selectable;
            (<any>this.drawing).selectable = selectable;
            Element.setSelectable(this.drawing, selectable);
        }

        get resizable(): boolean {
            return this._resizable;
        }

        set resizable(value: boolean) {
            if (this._resizable != value) {
                this._resizable = value;
                this.invalidateMeasure();
            }
        }

        get layoutX(): number {
            return this._layoutX;
        }

        get layoutY(): number {
            return this._layoutY;
        }

        get layoutWidth(): number {
            return this._layoutWidth;
        }

        get layoutHeight(): number {
            return this._layoutHeight;
        }

        //
        // Set a unique id for the current element
        //
        set id(id: string) {
            this.drawing.setAttribute('id', id);
        }

        //
        // Return the id of the current element
        //
        get id(): string {
            return this.drawing.getAttribute('id') as string;
        }

        //
        // Return whether or not the current element can get the focus
        //
        get focusable(): boolean {
            return this._focusable;
        }

        //
        // Defined if the current element can have the focus
        //
        set focusable(focusable: boolean) {
            if (this._focusable !== focusable) {
                this._focusable = focusable;
                if (focusable && !this.isDisabled) {
                    this.drawing.tabIndex = 0;
                    this.drawing.addEventListener('mousedown', this.onMouseDownFocus, true);
                }
                else {
                    this.drawing.removeEventListener('mousedown', this.onMouseDownFocus);
                    // remove the attribute because with the -1 value
                    // the element is still focusable by the mouse
                    this.drawing.removeAttribute('tabIndex');
                }
            }
        }

        private onMouseDownFocus = (event: MouseEvent) => {
            this.isMouseDownFocus = true;
            window.addEventListener('mouseup', this.onMouseUpFocus, true);
        }

        private onMouseUpFocus = (event: MouseEvent) => {
            this.isMouseDownFocus = false;
            window.removeEventListener('mouseup', this.onMouseUpFocus);
        }

        getIsMouseFocus(): boolean {
            return this.isMouseFocus;
        }

        //
        // Set the current element role as defined by
        // the WAI-ARIA. To remove a role, use undefined
        //
        set role(role: string) {
            if ('setAttributeNS' in this.drawing) {
                if (role === undefined) {
                    if (this.drawing.hasAttributeNS('http://www.w3.org/2005/07/aaa', 'role'))
                        this.drawing.removeAttributeNS('http://www.w3.org/2005/07/aaa', 'role');
                }
                else
                    this.drawing.setAttributeNS('http://www.w3.org/2005/07/aaa', 'role', role);
            }
        }

        //
        // Provide the available size and return
        // the minimum required size
        //
        measure(width: number, height: number): Size {
            // no need to measure if the element is not loaded
            if (!this._isLoaded)
                return { width: 0, height: 0 };

            if (this.collapse) {
                this.measureValid = true;
                return { width: 0, height: 0 };
            }

            if (this.measureValid && (this.measureConstraintWidth === width) && (this.measureConstraintHeight === height) &&
                (this.measureConstraintIsPrint == Ui.App.isPrint) &&
                (this.measureConstraintPixelRatio == (window.devicePixelRatio || 1)))
                return { width: this._measureWidth, height: this._measureHeight };

            this.measureConstraintPixelRatio = (window.devicePixelRatio || 1);
            this.measureConstraintWidth = width;
            this.measureConstraintHeight = height;
            this.measureConstraintIsPrint = Ui.App.isPrint;

            let marginLeft = this.marginLeft;
            let marginRight = this.marginRight;
            let marginTop = this.marginTop;
            let marginBottom = this.marginBottom;

            let constraintWidth = Math.max(width - (marginLeft + marginRight), 0);
            let constraintHeight = Math.max(height - (marginTop + marginBottom), 0);
            if (this._maxWidth !== undefined)
                constraintWidth = Math.min(constraintWidth, this._maxWidth - (marginLeft + marginRight));
            if (this._maxHeight !== undefined)
                constraintHeight = Math.min(constraintHeight, this._maxHeight - (marginTop + marginBottom));

            if (this._horizontalAlign !== 'stretch')
                constraintWidth = 0;
            if (this._verticalAlign !== 'stretch')
                constraintHeight = 0;

            if (this._width !== undefined)
                constraintWidth = Math.max(this._width, constraintWidth);
            if (this._height !== undefined)
                constraintHeight = Math.max(this._height, constraintHeight);

            this.measureValid = true;
            let size = this.measureCore(constraintWidth, constraintHeight);

            // if width and height are set they are taken as a minimum
            if ((this._width !== undefined) && (size.width < this._width))
                this._measureWidth = this._width + marginLeft + marginRight;
            else
                this._measureWidth = Math.ceil(size.width) + marginLeft + marginRight;
            if ((this._height !== undefined) && (size.height < this._height))
                this._measureHeight = this._height + marginTop + marginBottom;
            else
                this._measureHeight = Math.ceil(size.height) + marginTop + marginBottom;

            return { width: this._measureWidth, height: this._measureHeight };
        }

        //
        // Override this method to provide your own
        // measure policy
        //
        protected measureCore(width: number, height: number): Size {
            return { width: 0, height: 0 };
        }

        //
        // Signal that the current element measure need to be
        // updated
        //
        invalidateMeasure() {
            if (this.measureValid) {
                this.measureValid = false;
                if ((this._parent != undefined) && (this._parent.measureValid))
                    this._parent.onChildInvalidateMeasure(this, 'change');
            }
            this.invalidateArrange();
        }

        invalidateLayout() {
            this.measureValid = false;
            this.arrangeValid = false;
            if (this.layoutValid) {
                this.layoutValid = false;
                Ui.App.enqueueLayout(this);
            }
        }

        protected onChildInvalidateMeasure(child, event) {
            this.invalidateMeasure();
        }

        updateLayout(width: number, height: number) {
            this._layoutWidth = width;
            this._layoutHeight = height;
            this.layoutValid = true;
            this.layoutCore();
            if (!this.arrangeValid || !this.measureValid)
                this.invalidateLayout();
        }

        layoutCore() {
            this.measure(this._layoutWidth, this._layoutHeight);
            this.arrange(this._layoutX, this._layoutY, this._layoutWidth, this._layoutHeight);
        }

        //
        // Update the current element arrangement
        //
        arrange(x: number, y: number, width: number, height: number) {
            // no need to arrange if not loaded
            if (!this._isLoaded || this.collapse)
                return;
            if (isNaN(x))
                x = 0;
            if (isNaN(y))
                y = 0;
            if (isNaN(width))
                width = 0;
            if (isNaN(height))
                height = 0;
            x = Math.round(x);
            y = Math.round(y);
            width = Math.ceil(width);
            height = Math.ceil(height);

            if (!this.arrangeValid || (this.arrangeX != x) || (this.arrangeY != y) ||
                (this.arrangeWidth != width) || (this.arrangeHeight != height) ||
                (this.arrangeIsPrint != Ui.App.isPrint) ||
                (this.arrangePixelRatio != (window.devicePixelRatio || 1))) {
                this.arrangeValid = true;
                this.arrangeX = x;
                this.arrangeY = y;
                this.arrangeWidth = width;
                this.arrangeHeight = height;
                this.arrangePixelRatio = (window.devicePixelRatio || 1);
                this.arrangeIsPrint = Ui.App.isPrint;

                // handle alignment
                if (this._verticalAlign == 'top') {
                    height = this._measureHeight;
                }
                else if (this._verticalAlign == 'bottom') {
                    y += height - this._measureHeight;
                    height = this._measureHeight;
                }
                else if (this._verticalAlign == 'center') {
                    y += (height - this._measureHeight) / 2;
                    height = this._measureHeight;
                }
                else if (this._verticalAlign == 'stretch' && this._maxHeight && this._maxHeight < height) {
                    y += (height - this._maxHeight) / 2;
                    height = this._maxHeight;
                }

                if (this._horizontalAlign == 'left') {
                    width = this._measureWidth;
                }
                else if (this._horizontalAlign == 'right') {
                    x += width - this._measureWidth;
                    width = this._measureWidth;
                }
                else if (this._horizontalAlign == 'center') {
                    x += (width - this._measureWidth) / 2;
                    width = this._measureWidth;
                }
                else if (this._horizontalAlign == 'stretch' && this._maxWidth && this._maxWidth < width) {
                    x += (width - this._maxWidth) / 2;
                    width = this._maxWidth;
                }

                // handle margin
                let marginLeft = this.marginLeft;
                let marginRight = this.marginRight;
                let marginTop = this.marginTop;
                let marginBottom = this.marginBottom;
                x += marginLeft;
                y += marginTop;
                width -= marginLeft + marginRight;
                height -= marginTop + marginBottom;

                this._layoutX = x;
                this._layoutY = y;
                this._layoutWidth = Math.max(width, 0);
                this._layoutHeight = Math.max(height, 0);

                this.drawing.style.left = Math.round(this._layoutX) + 'px';
                this.drawing.style.top = Math.round(this._layoutY) + 'px';
                if (this._transform !== undefined)
                    this.updateTransform();

                if (this._eventsHidden) {
                    this.drawing.style.width = '0px';
                    this.drawing.style.height = '0px';
                }
                else {
                    this.drawing.style.width = Math.round(this._layoutWidth) + 'px';
                    this.drawing.style.height = Math.round(this._layoutHeight) + 'px';
                }

                this.drawing.style.visibility = 'inherit';
                this.arrangeCore(this._layoutWidth, this._layoutHeight);
                if (!this.arrangeValid)
                    console.log(`${this}.arrange PROBLEM. Arrange invalidated during arrange`);
            }
        }

        //
        // Override this to provide your own
        // arrangement policy
        //
        protected arrangeCore(width: number, height: number) {
        }

        //
        // Signal that the current element arrangement need
        // to be updated
        //
        invalidateArrange() {
            if (this.arrangeValid) {
                this.arrangeValid = false;
                if (this._parent != undefined)
                    this._parent.onChildInvalidateArrange(this);
            }
        }

        protected onChildInvalidateArrange(child) {
            this.invalidateArrange();
        }

        //
        // Update the current element drawing
        //
        draw() {
            this.drawCore();
            this.drawValid = true;
        }

        //
        // Override this to provide your own
        // custom drawing
        //
        protected drawCore() {
        }

        //
        // Signal that the current element drawing need
        // to be updated
        //
        invalidateDraw() {
            if (this.drawValid) {
                this.drawValid = false;
                Ui.App.enqueueDraw(this);
            }
        }

        //
        // Override this method to provide a custom
        // rendering of the current element.
        // Return the HTML element of the rendering
        //
        protected renderDrawing(): any {
            return document.createElement('div');
        }

        //
        // Return the preferred width of the element
        // or undefined
        //
        get width(): number | undefined {
            return this._width;
        }

        //
        // Set the preferred width of the element
        //
        set width(width: number | undefined) {
            if (this._width !== width) {
                this._width = width;
                this.invalidateMeasure();
            }
        }

        //
        // Return the preferred height of the element
        // or undefined
        //
        get height(): number | undefined {
            return this._height;
        }

        //
        // Set the preferred height of the element
        //
        set height(height: number | undefined) {
            if (this._height !== height) {
                this._height = height;
                this.invalidateMeasure();
            }
        }

        get maxWidth(): number | undefined {
            return this._maxWidth;
        }

        set maxWidth(width: number | undefined) {
            if (this._maxWidth !== width) {
                this._maxWidth = width;
                if (this._layoutWidth > this._maxWidth)
                    this.invalidateMeasure();
            }
        }

        get maxHeight(): number | undefined {
            return this._maxHeight;
        }

        set maxHeight(height: number | undefined) {
            if (this._maxWidth !== height) {
                this._maxHeight = height;
                if (this._layoutHeight > this._maxHeight)
                    this.invalidateMeasure();
            }
        }

        //
        // Return the vertical alignment from the parent.
        //
        get verticalAlign(): VerticalAlign {
            return this._verticalAlign;
        }

        //
        // Set the vertical alignment from the parent.
        //
        set verticalAlign(align: VerticalAlign) {
            if (this._verticalAlign !== align) {
                this._verticalAlign = align;
                this.invalidateArrange();
            }
        }

        //
        // Return the horizontal alignment from the parent.
        //
        get horizontalAlign(): HorizontalAlign {
            return this._horizontalAlign;
        }

        //
        // Set the horizontal alignment from the parent.
        //
        set horizontalAlign(align: HorizontalAlign) {
            if (this._horizontalAlign !== align) {
                this._horizontalAlign = align;
                this.invalidateArrange();
            }
        }

        get clipToBounds(): boolean {
            return this._clipToBounds;
        }

        set clipToBounds(clip: boolean) {
            if (this._clipToBounds !== clip) {
                this._clipToBounds = clip;
                if (clip)
                    this.drawing.style.overflow = 'hidden';
                else
                    this.drawing.style.removeProperty('overflow');
            }
        }

        setClipRectangle(x: number, y: number, width: number, height: number) {
            this.clipX = x;
            this.clipY = y;
            this.clipWidth = width;
            this.clipHeight = height;
            this.updateClipRectangle();
        }

        updateClipRectangle() {
            if (this.clipX !== undefined) {
                let x = Math.round(this.clipX);
                let y = Math.round(this.clipY);
                let width = Math.round(this.clipWidth);
                let height = Math.round(this.clipHeight);
                this.drawing.style.clip = 'rect(' + y + 'px ' + (x + width) + 'px ' + (y + height) + 'px ' + x + 'px)';
            }
            else {
                if ('removeProperty' in this.drawing.style)
                    this.drawing.style.removeProperty('clip');
                else if ('removeAttribute' in this.drawing.style)
                    (<any>this.drawing.style).removeAttribute('clip');
            }
        }

        //
        //
        set margin(margin: number) {
            this.marginTop = margin;
            this.marginBottom = margin;
            this.marginLeft = margin;
            this.marginRight = margin;
        }

        //
        // Return the current element top margin
        //
        get marginTop(): number {
            return this._marginTop;
        }

        //
        // Set the current element top margin
        //
        set marginTop(marginTop: number) {
            if (marginTop !== this._marginTop) {
                this._marginTop = marginTop;
                this.invalidateMeasure();
            }
        }

        //
        // Return the current element bottom margin
        //
        get marginBottom(): number {
            return this._marginBottom;
        }

        //
        // Set the current element bottom margin
        //
        set marginBottom(marginBottom: number) {
            if (marginBottom !== this._marginBottom) {
                this._marginBottom = marginBottom;
                this.invalidateMeasure();
            }
        }

        //
        // Return the current element left margin
        //
        get marginLeft(): number {
            return this._marginLeft;
        }

        //
        // Set the current element left margin
        //
        set marginLeft(marginLeft: number) {
            if (marginLeft !== this._marginLeft) {
                this._marginLeft = marginLeft;
                this.invalidateMeasure();
            }
        }

        //
        // Return the current element right margin
        //
        get marginRight(): number {
            return this._marginRight;
        }

        //
        // Set the current element right margin
        //
        set marginRight(marginRight: number) {
            if (marginRight !== this._marginRight) {
                this._marginRight = marginRight;
                this.invalidateMeasure();
            }
        }

        //
        // Return the current element opacity
        //
        get opacity(): number {
            return this._opacity;
        }

        //
        // Set the current element opacity
        //
        set opacity(opacity: number) {
            if (this._opacity !== opacity) {
                this._opacity = opacity;
                this.drawing.style.opacity = this._opacity.toString();
            }
        }

        //
        // Ask for focus on the current element
        //
        focus() {
            if (this._focusable) {
                try {
                    this.drawing.focus();
                } catch (e) { }
            }
        }

        //
        // Remove the focus current element
        //
        blur() {
            try {
                this.drawing.blur();
            } catch (e) { }
        }

        //
        // Provide an Matrix to transform the element rendering.
        // This transformation is not taken in account for the arrangement
        //
        set transform(transform: Matrix | undefined) {
            if (this._transform !== transform) {
                this._transform = transform;
                this.updateTransform();
            }
        }

        //
        // If setTransform is used, define the origin of the transform.
        // x and y give the position of the center.
        // If absolute is not set, the position is relative to the
        // width and height of the current element.
        //
        setTransformOrigin(x: number, y: number, absolute: boolean = false) {
            if ((this.transformOriginX !== x) || (this.transformOriginY !== y) || (this.transformOriginAbsolute !== absolute)) {
                this.transformOriginX = x;
                this.transformOriginY = y;
                this.transformOriginAbsolute = absolute;
                this.updateTransform();
            }
        }

        //
        // Return the matrix to transform a coordinate from a child to
        // the parent coordinate
        //
        getInverseLayoutTransform(): Matrix {
            let matrix = Ui.Matrix.createTranslate(this._layoutX, this._layoutY);
            if (this._transform !== undefined) {
                let originX = this.transformOriginX * this._layoutWidth;
                let originY = this.transformOriginY * this._layoutHeight;
                matrix = matrix.translate(-originX, -originY).multiply(this._transform).translate(originX, originY);
            }
            return matrix;
        }

        //
        // Return the matrix to transform a coordinate from the parent
        // to the child coordinate
        //
        getLayoutTransform(): Matrix {
            let matrix = new Ui.Matrix();

            if (this._transform !== undefined) {
                let originX = this.transformOriginX * this._layoutWidth;
                let originY = this.transformOriginY * this._layoutHeight;
                matrix = Ui.Matrix.createTranslate(-originX, -originY).
                    multiply(this._transform).
                    translate(originX, originY).
                    inverse();
            }
            return matrix.translate(-this._layoutX, -this._layoutY);
        }

        //
        // Return the transform matrix to convert coordinates
        // from the current element coordinate system to the page
        // coordinate system
        //
        transformToWindow(): Matrix {
            return Ui.Element.transformToWindow(this);
        }

        //
        // Return the transform matrix to convert coordinates
        // from the page coordinate system to the current element
        // coordinate system
        //
        transformFromWindow(): Matrix {
            return Ui.Element.transformFromWindow(this);
        }

        //
        // Return the transform matrix to convert coordinates
        // from the current element coordinate system to a given
        // element coordinate system
        //
        transformToElement(element: Element): Matrix {
            let toMatrix = this.transformToWindow();
            let fromMatrix = element.transformFromWindow();
            return toMatrix.multiply(fromMatrix);
        }

        //
        // Return the given point converted from the current element
        // coordinate system to the page coordinate system
        //
        pointToWindow(point: Point): Point {
            return point.multiply(this.transformToWindow());
        }

        //
        // Return the given point converted from the page coordinate
        // system to the current element coordinate system
        //
        pointFromWindow(point: Point): Point {
            return point.multiply(this.transformFromWindow());
        }

        //
        // Return the given point converted from the given element coordinate
        // system to the current element coordinate system
        //
        pointFromElement(element: Element, point: Point): Point {
            return this.pointFromWindow(element.pointToWindow(point));
        }

        getIsInside(point: Point): boolean {
            let p = point.multiply(this.getLayoutTransform());
            if ((p.x >= 0) && (p.x <= this._layoutWidth) &&
                (p.y >= 0) && (p.y <= this._layoutHeight))
                return true;
            return false;
        }

        set eventsHidden(eventsHidden: boolean) {
            this._eventsHidden = eventsHidden;
            this.invalidateArrange();
        }

        get eventsHidden(): boolean {
            return this._eventsHidden;
        }

        //
        // Return the width taken by the current element
        //
        get measureWidth(): number {
            return this.collapse ? 0 : this._measureWidth;
        }

        //
        // Return the height taken by the current element
        //
        get measureHeight(): number {
            return this.collapse ? 0 : this._measureHeight;
        }

        get isCollapsed(): boolean {
            return this.collapse;
        }

        hide(collapse: boolean = false) {
            if ((this._visible === undefined) || this._visible) {
                let old = this.isVisible;
                this._visible = false;
                this.drawing.style.display = 'none';
                if (old)
                    this.onInternalHidden();
            }
            if (this.collapse != collapse) {
                this.collapse = collapse;
                this.invalidateMeasure();
            }
        }

        show() {
            if ((this._visible === undefined) || !this._visible) {
                let old = this.isVisible;
                this._visible = true;
                this.drawing.style.display = 'block';
                if (this.isVisible && !old)
                    this.onInternalVisible();
            }
            if (this.collapse) {
                this.collapse = false;
                this.invalidateMeasure();
            }
        }

        get isVisible(): boolean {
            return ((this._parentVisible === true) && (this._visible !== false));
        }

        set isVisible(value: boolean) {
            if (value)
                this.show();
            else
                this.hide();
        }

        set parentVisible(visible: boolean) {
            let old = this.isVisible;
            this._parentVisible = visible;
            if (old != this.isVisible) {
                if (this.isVisible)
                    this.onInternalVisible();
                else
                    this.onInternalHidden();
            }
        }

        protected onInternalHidden() {
            this.onHidden();
            this.hidden.fire({ target: this });
        }

        protected onHidden() {
        }

        protected onInternalVisible() {
            this.onVisible();
            this.visible.fire({ target: this });
        }

        checkVisible() {
            if (this.drawing === undefined)
                return;
            let visible = false;
            let current: Node = this.drawing;
            while (current !== undefined) {
                if (current instanceof HTMLElement && current.style.display === 'none') {
                    visible = false;
                    break;
                }
                if (current == document.body) {
                    visible = true;
                    break;
                }
                current = current.parentNode;
            }
            if (this.isVisible !== visible)
                console.log('checkVisible expect: ' + this.isVisible + ', got: ' + visible + ' (on ' + this + ')');
            // throw('checkVisible expect: '+this.isVisible+', got: '+visible+' (on '+this+')');
        }

        protected onVisible() {
        }

        disable() {
            if ((this._disabled === undefined) || !this._disabled) {
                let old = this.isDisabled;
                this._disabled = true;
                if (!old)
                    this.onInternalDisable();
            }
        }

        enable() {
            if ((this._disabled === undefined) || this._disabled) {
                let old = this.isDisabled;
                this._disabled = false;
                if (old && !this.isDisabled)
                    this.onInternalEnable();
            }
        }

        setEnable(enable: boolean) {
            if (enable)
                this.enable();
            else
                this.disable();
        }

        get isDisabled(): boolean {
            if ((this._disabled !== undefined) && (this._disabled === true))
                return true;
            if ((this.parentDisabled !== undefined) && (this.parentDisabled === true))
                return true;
            return false;
        }

        set isDisabled(disabled: boolean) {
            if (disabled)
                this.disable();
            else
                this.enable();
        }

        setParentDisabled(disabled: boolean) {
            let old = this.isDisabled;
            this.parentDisabled = disabled;
            if (old !== this.isDisabled) {
                if (this.isDisabled)
                    this.onInternalDisable();
                else
                    this.onInternalEnable();
            }
        }

        protected onInternalDisable() {
            if (this._focusable) {
                this.drawing.tabIndex = -1;
                if (this._hasFocus)
                    this.blur();
            }
            this.onDisable();
            this.disabled.fire({ target: this });
        }

        protected onDisable() {
        }

        protected onInternalEnable() {
            if (this._focusable)
                this.drawing.tabIndex = 0;
            this.onEnable();
            this.enabled.fire({ target: this });
        }

        protected onEnable() {
        }

        private containSubStyle(style) {
            return style['types'] != undefined && style['types'] instanceof Array;
        }

        private fusionStyle(dst, src) {
            if (src['types'] == undefined || !(src['types'] instanceof Array))
                return;

            let mergeTypes: Array<any> = dst['types'] == undefined ? [] : dst['types'].slice();
            let pos = mergeTypes.findIndex((t) => t.types);
            if (pos != -1)
                mergeTypes.splice(pos, 1);
            for (let i = 0; i < src['types'].length; i++) {
                let srcStyle = src['types'][i];
                let dstStyle = this.getClassStyle(dst, srcStyle['type']);
                if (dstStyle != undefined) {
                    // merge
                    let mergeStyle = {};
                    for (let prop in dstStyle)
                        mergeStyle[prop] = dstStyle[prop];
                    for (let prop in srcStyle)
                        mergeStyle[prop] = srcStyle[prop];
                    let pos = mergeTypes.indexOf(dstStyle);
                    if (pos != -1)
                        mergeTypes.splice(pos, 1);
                    mergeTypes.push(mergeStyle);
                }
                else
                    mergeTypes.push(srcStyle);
            }
            dst['types'] = mergeTypes;
        }

        private getClassStyle(style: object, classFunc: Function): object | undefined {
            if (style['types'] != undefined && (style['types'] instanceof Array)) {
                for (let i = 0; i < style['types'].length; i++) {
                    let pStyle = style['types'][i];
                    if (pStyle.type == classFunc)
                        return pStyle;
                }
            }
            return undefined;
        }

        private mergeStyles() {
            let current: Function; let found: boolean;
            this.mergeStyle = undefined;
            if (this._parentStyle != undefined) {
                current = this.constructor;
                found = false;
                while (current != undefined) {
                    let classStyle = this.getClassStyle(this._parentStyle, current);
                    if (classStyle != undefined && this.containSubStyle(classStyle)) {
                        if (this.mergeStyle == undefined)
                            this.mergeStyle = Core.Util.clone(this._parentStyle);
                        this.fusionStyle(this.mergeStyle, classStyle);
                        this.mergeStyle['types'].push(classStyle);
                        found = true;
                        break;
                    }
                    current = Object.getPrototypeOf(current.prototype);
                    if (current != null)
                        current = current.constructor;
                }
                if (!found)
                    this.mergeStyle = this._parentStyle;
            }
            if (this._style != undefined) {
                if (this.mergeStyle != undefined) {
                    this.mergeStyle = Core.Util.clone(this.mergeStyle);
                    this.fusionStyle(this.mergeStyle, this._style);

                    current = this.constructor;
                    while (current != undefined) {
                        let classStyle = this.getClassStyle(this._style, current);
                        if (classStyle != undefined && this.containSubStyle(classStyle)) {
                            this.fusionStyle(this.mergeStyle, classStyle);
                            break;
                        }
                        current = Object.getPrototypeOf(current.prototype);
                        if (current != null)
                            current = current.constructor;
                    }
                }
                else {
                    current = this.constructor;
                    found = false;
                    while (current != undefined) {
                        let classStyle = this.getClassStyle(this._style, current);
                        if (classStyle != undefined) {
                            if (this.mergeStyle == undefined)
                                this.mergeStyle = Core.Util.clone(this._style);
                            this.fusionStyle(this.mergeStyle, classStyle);
                            found = true;
                            break;
                        }
                        current = Object.getPrototypeOf(current.prototype);
                        if (current != null)
                            current = current.constructor;
                    }
                    if (!found)
                        this.mergeStyle = this._style;
                }
            }
        }

        getIsChildOf(parent: Element) {
            let current: Element | undefined = this;
            while (current != undefined) {
                if (current === parent)
                    return true;
                current = current.parent;
            }
            return false;
        }

        get parent(): Element | undefined {
            return this._parent;
        }

        set parent(parent: Element | undefined) {
            this._parent = parent;
        }

        getParentByClass<T extends Ui.Element>(classFunc: new (...args: any[]) => T): T | undefined {
            let current = this.parent;
            while (current != undefined) {
                if (current instanceof classFunc)
                    return current as T;
                current = current.parent;
            }
            return undefined;
        }

        setParentStyle(parentStyle: object | undefined) {
            if (this._parentStyle !== parentStyle)
                this._parentStyle = parentStyle;
            this.mergeStyles();
            this.onInternalStyleChange();
        }

        set style(style: object | undefined) {
            this._style = style;
            this.mergeStyles();
            this.onInternalStyleChange();
        }

        setStyleProperty(property: string, value: any) {
            if (this._style === undefined)
                this._style = {};
            this._style[property] = value;
            this.mergeStyles();
            this.onInternalStyleChange();
        }

        getStyleProperty(property: string): any {
            let current: Function;
            if (this._style != undefined && this._style[property] != undefined)
                return this._style[property];
            if (this.mergeStyle != undefined) {
                current = this.constructor;
                while (current != undefined) {
                    if (this.mergeStyle['types'] != undefined && (this.mergeStyle['types'] instanceof Array)) {
                        let classStyle = undefined;
                        for (let i = 0; classStyle == undefined && i < this.mergeStyle['types'].length; i++) {
                            let pStyle = this.mergeStyle['types'][i];
                            if (pStyle.type == current)
                                classStyle = pStyle;
                        }
                        if (classStyle != undefined && classStyle[property] != undefined)
                            return classStyle[property];
                    }

                    //					if((this.mergeStyle[current.name] !== undefined) && (this.mergeStyle[current.name][property] !== undefined))
                    //						return this.mergeStyle[current.name][property];

                    current = Object.getPrototypeOf(current.prototype);
                    if (current != null)
                        current = current.constructor;
                }
            }
            // look for static default
            current = this.constructor;
            while (current != undefined) {
                if (('style' in current) && (property in (current as any).style))
                    return (current as any).style[property];
                current = Object.getPrototypeOf(current);
            }
            return undefined;
        }

        protected onInternalStyleChange() {
            if (!this._isLoaded)
                return;
            this.onStyleChange();
        }

        //
        // Override this in classes that handle style
        //
        protected onStyleChange() {
        }

        get hasFocus(): boolean {
            return this._hasFocus;
        }

        scrollIntoView() {
            this.onScrollIntoView(this);
        }

        protected onScrollIntoView(el: Element) {
            if (this._parent != undefined)
                this._parent.onScrollIntoView(el);
        }

        get(name: string): Element | undefined {
            return (this.name == name) ? this : undefined;
        }

        //
        // Return true if the current element is inserted in a displayed
        // rendering tree
        //
        get isLoaded(): boolean {
            return this._isLoaded;
        }

        set isLoaded(isLoaded: boolean) {
            if (this._isLoaded !== isLoaded) {
                this._isLoaded = isLoaded;
                if (isLoaded)
                    this.onLoad();
                else
                    this.onUnload();
            }
        }

        protected onFocus(event?) {
            if (!this._hasFocus && this._focusable && !this.isDisabled) {
                this._hasFocus = true;
                this.isMouseFocus = this.isMouseDownFocus;
                this.focused.fire({ target: this });
            }
        }

        protected onBlur(event?) {
            if (this._hasFocus) {
                this.isMouseFocus = false;
                this._hasFocus = false;
                this.blurred.fire({ target: this });
            }
        }

        private updateTransform() {
            if (this._transform !== undefined) {
                let matrix = this._transform;
                let x = this.transformOriginX;
                let y = this.transformOriginY;
                if (!this.transformOriginAbsolute) {
                    x *= this._layoutWidth;
                    y *= this._layoutHeight;
                }
                if ((x !== 0) || (y !== 0))
                    matrix = Ui.Matrix.createTranslate(x, y).multiply(this._transform).translate(-x, -y);

                this.drawing.style.transform = matrix.toString();
                if (Core.Navigator.isIE)
                    (<any>this.drawing.style).msTransform = matrix.toString();
            }
            else {
                if ('removeProperty' in this.drawing.style)
                    this.drawing.style.removeProperty('transform');
                if (Core.Navigator.isIE && ('removeProperty' in this.drawing.style))
                    this.drawing.style.removeProperty('-ms-transform');
            }
        }

        setAnimClock(clock: Anim.Clock): void {
            // if an anim clock is already set stop it
            if (this.animClock != undefined)
                this.animClock.stop();
            this.animClock = clock;
            if (clock != undefined)
                clock.completed.connect(() => this.onAnimClockComplete());
        }

        private onAnimClockComplete() {
            this.animClock = undefined;
        }

        protected onLoad() {
            if (this._parent != undefined) {
                this.setParentStyle(this._parent.mergeStyle);
                this.setParentDisabled(this._parent.isDisabled);
                this.parentVisible = this._parent.isVisible;
            }
            this.loaded.fire({ target: this });
        }

        protected onUnload() {
            if (this.animClock != undefined) {
                this.animClock.stop();
                this.animClock = undefined;
            }
            this.unloaded.fire({ target: this });
        }

        static transformToWindow(element: Element): Matrix {
            let matrix = new Ui.Matrix();
            let current: Element | undefined = element;
            while (current != undefined) {
                matrix = current.getInverseLayoutTransform().multiply(matrix);
                current = current._parent;
            }
            return matrix;
        }

        static transformFromWindow(element: Element): Matrix {
            return Ui.Element.transformToWindow(element).inverse();
        }

        static elementFromPoint(point: Point): Element {
            let element = document.elementFromPoint(point.x, point.y);
            while (element) {
                if ((element as any).data && (element as any).data instanceof Element)
                    return (element as any).data as Element;
                element = element.parentElement;
            }
            return undefined;
//            return App.current.elementFromPoint(point);
        }

        static getIsDrawingChildOf(drawing, parent): boolean {
            let current = drawing;
            while (current != undefined) {
                if (current === parent)
                    return true;
                current = current.offsetParent;
            }
            return false;
        }

        static setSelectable(drawing, selectable) {
            drawing.selectable = selectable;
            if (selectable) {
                drawing.style.cursor = 'text';
                drawing.style.userSelect = 'text';
                if (Core.Navigator.isWebkit)
                    drawing.style.webkitUserSelect = 'text';
                else if (Core.Navigator.isGecko)
                    drawing.style.MozUserSelect = 'text';
                else if (Core.Navigator.isIE)
                    drawing.style.msUserSelect = 'element';
            }
            else {
                drawing.style.cursor = 'inherit';
                drawing.style.userSelect = 'none';
                if (Core.Navigator.isWebkit)
                    drawing.style.webkitUserSelect = 'none';
                else if (Core.Navigator.isGecko)
                    drawing.style.MozUserSelect = 'none';
                else if (Core.Navigator.isIE)
                    drawing.style.msUserSelect = 'none';
            }
        }
    }
}
