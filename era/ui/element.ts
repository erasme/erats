namespace Ui
{
	export type Size = { width: number, height: number };

	export type VerticalAlign = 'top' | 'center' | 'bottom' | 'stretch';

	export type HorizontalAlign = 'left' | 'center' | 'right' | 'stretch';

	export interface ElementInit {
		selectable?: boolean;
		id?: string;
		focusable?: boolean;
		role?: string;
		width?: number | undefined;
		height?: number | undefined;
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
		style?: object | undefined;
	}

	export class Element extends Core.Object implements ElementInit, Anim.Target
	{
		name: string = undefined;

		private _marginTop: number = 0;
		private _marginBottom: number = 0;
		private _marginLeft: number = 0;
		private _marginRight: number = 0;

		// parent
		private _parent: Element = undefined;

		// preferred element size
		private _width?: number = undefined;
		private _height?: number = undefined;
		private _maxWidth?: number = undefined;
		private _maxHeight?: number = undefined;

		// rendering
		private _drawing: any = undefined;

		// measurement
		private collapse: boolean = false;
		private measureValid: boolean = false;
		private measureConstraintPixelRatio: number = 1;
		private measureConstraintWidth: number = 0;
		private measureConstraintHeight: number = 0;
		private _measureWidth: number = 0;
		private _measureHeight: number = 0;

		// arrangement
		private arrangeValid: boolean = false;
		private arrangeX: number = 0;
		private arrangeY: number = 0;
		private arrangeWidth: number = 0;
		private arrangeHeight: number = 0;
		private arrangePixelRatio: number = 1;

		// render
		drawValid: boolean = true;
		drawNext: Element = undefined;

		layoutValid: boolean = true;
		layoutNext: Element = undefined;
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

		clipX?: number = undefined;
		clipY?: number = undefined;
		clipWidth?: number = undefined;
		clipHeight?: number = undefined;

		// handle visible
		visible?: boolean = undefined;
		private _parentVisible?: boolean = undefined;
		private _eventsHidden: boolean = false;

		// whether or not the current element can get focus
		private _focusable: boolean = false;
		private _hasFocus: boolean = false;
		isMouseFocus: boolean = false;
		isMouseDownFocus: boolean = false;

		private _selectable: boolean = false;

		private _transform?: Matrix = undefined;
		transformOriginX: number = 0.5;
		transformOriginY: number = 0.5;
		transformOriginAbsolute: boolean = false;

		// if the current element is the target of
		// an active clock
		animClock: Anim.Clock = undefined;

		private _opacity: number = 1;
		private parentOpacity: number = 1;

		// handle disable
		disabled?: boolean = undefined;
		parentDisabled?: boolean = undefined;

		// handle styles
		private _style: object | undefined = undefined;
		private _parentStyle: object | undefined = undefined;
		mergeStyle: object | undefined = undefined;

	    // @constructs
		// @class Define the base class for all GUI elements
		constructor(init?: ElementInit)
		{
			super();
			// create the drawing container
			this._drawing = this.renderDrawing();
			if (DEBUG) {
				this._drawing.setAttribute('class', this.getClassName());
				this._drawing.data = this;
			}
			this._drawing.style.position = 'absolute';
			this._drawing.style.left = '0px';
			this._drawing.style.top = '0px';
			this._drawing.style.width = '0px';
			this._drawing.style.height = '0px';
			this._drawing.style.visibility = 'hidden';

			this._drawing.style.outline = 'none';
			// set the transformOrigin to 0 0. Do it only once for performance
			this._drawing.style.transformOrigin = '0 0';
			if(Core.Navigator.isIE)
				this._drawing.style.msTransformOrigin = '0 0';
			else if(Core.Navigator.isGecko)
				this._drawing.style.MozTransformOrigin = '0 0';
			else if(Core.Navigator.isWebkit)
				this._drawing.style.webkitTransformOrigin = '0 0';
			else if(Core.Navigator.isOpera)
				this._drawing.style.OTransformOrigin = '0 0';

			this.connect(this._drawing, 'focus', this.onFocus);
			this.connect(this._drawing, 'blur', this.onBlur);
			this.selectable = false;

			this.addEvents('focus', 'blur', 'load', 'unload',
				'enable', 'disable', 'visible', 'hidden',
				'ptrdown', 'ptrmove', 'ptrup', 'ptrcancel',
				'wheel', 'dragover');
			if (init) {
				if (init.selectable !== undefined)
					this.selectable = init.selectable;
				if (init.id !== undefined)
					this.id = init.id;
				if (init.focusable !== undefined)
					this.focusable = init.focusable;
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
			}
		}

		setDisabled(disabled : boolean) {
			if(disabled)
				this.disable();
			else
				this.enable();
		}

		//
		// Return the HTML element that correspond to
		// the current element rendering
		//
		get drawing() : any {
			return this._drawing;
		}

		get selectable(): boolean {
			return this._selectable;
		}

		set selectable(selectable : boolean) {
			this._selectable = selectable;
			this.drawing.selectable = selectable;
			Element.setSelectable(this.drawing, selectable);
		}

		get layoutX() : number {
			return this._layoutX;
		}

		get layoutY() : number {
			return this._layoutY;
		}

		get layoutWidth() : number {
			return this._layoutWidth;
		}

		get layoutHeight() : number {
			return this._layoutHeight;
		}

		//
		// Set a unique id for the current element
		//
		set id(id : string) {
			this._drawing.setAttribute('id', id);
		}

		//
		// Return the id of the current element
		//
		get id() : string {
			return this._drawing.getAttribute('id') as string;
		}

		//
		// Return whether or not the current element can get the focus
		//
		get focusable() : boolean {
			return this._focusable;
		}

		//
		// Defined if the current element can have the focus
		//
		set focusable(focusable : boolean) {
			if(this._focusable !== focusable) {
				this._focusable = focusable;
				if(focusable && !this.isDisabled) {
					this._drawing.tabIndex = 0;
					this.connect(this.drawing, 'mousedown', this.onMouseDownFocus, true);
				}
				else {
					this.disconnect(this.drawing, 'mousedown', this.onMouseDownFocus);
					// remove the attribute because with the -1 value
					// the element is still focusable by the mouse
					let node = this._drawing.getAttributeNode('tabIndex');
					if(node !== undefined)
						this._drawing.removeAttributeNode(node);
				}
			}
		}

		onMouseDownFocus(event) {
			this.isMouseDownFocus = true;
			this.connect(window, 'mouseup', this.onMouseUpFocus, true);
		}

		onMouseUpFocus(event) {
			this.isMouseDownFocus = false;
			this.disconnect(window, 'mouseup', this.onMouseUpFocus);
		}

		getIsMouseFocus() : boolean {
			return this.isMouseFocus;
		}

		//
		// Set the current element role as defined by
		// the WAI-ARIA. To remove a role, use undefined
		//
		set role(role: string) {
			if('setAttributeNS' in this._drawing) {
				if(role === undefined) {
					if(this._drawing.hasAttributeNS('http://www.w3.org/2005/07/aaa', 'role'))
						this._drawing.removeAttributeNS('http://www.w3.org/2005/07/aaa', 'role');
				}
				else
					this._drawing.setAttributeNS('http://www.w3.org/2005/07/aaa', 'role', role);
			}
		}

		//
		// Provide the available size and return
		// the minimum required size
		//
		measure(width: number, height: number): Size {
			//console.log(this.getClassName()+'.measure ('+width+','+height+'), loaded: '+this._isLoaded+', valid: '+this.measureValid+', constraint: ('+this.measureConstraintWidth+' x '+this.measureConstraintHeight+')');

			// no need to measure if the element is not loaded
			if(!this._isLoaded)
				return { width: 0, height: 0 };

			if(this.collapse) {
				this.measureValid = true;
				return { width: 0, height: 0 };
			}

			if(this.measureValid && (this.measureConstraintWidth === width) && (this.measureConstraintHeight === height) &&
				(this.measureConstraintPixelRatio == (window.devicePixelRatio || 1)))
				return { width: this._measureWidth, height: this._measureHeight };

			this.measureConstraintPixelRatio = (window.devicePixelRatio || 1);
			this.measureConstraintWidth = width;
			this.measureConstraintHeight = height;

			let marginLeft = this.marginLeft;
			let marginRight = this.marginRight;
			let marginTop = this.marginTop;
			let marginBottom = this.marginBottom;

			let constraintWidth = Math.max(width - (marginLeft+marginRight), 0);
			let constraintHeight = Math.max(height - (marginTop+marginBottom), 0);
			if(this._maxWidth !== undefined)
				constraintWidth = Math.min(constraintWidth, this._maxWidth);
			if(this._maxHeight !== undefined)
				constraintHeight = Math.min(constraintHeight, this._maxHeight);	

			if(this._horizontalAlign !== 'stretch')
				constraintWidth = 0;
			if(this._verticalAlign !== 'stretch')
				constraintHeight = 0;

			if(this._width !== undefined)
				constraintWidth = Math.max(this._width, constraintWidth);
			if(this._height !== undefined)
				constraintHeight = Math.max(this._height, constraintHeight);

			let size = this.measureCore(constraintWidth, constraintHeight);

			// if width and height are set they are taken as a minimum
			if((this._width !== undefined) && (size.width < this._width))
				this._measureWidth = this._width + marginLeft + marginRight;
			else
				this._measureWidth = Math.ceil(size.width) + marginLeft + marginRight;
			if((this._height !== undefined) && (size.height < this._height))
				this._measureHeight = this._height + marginTop + marginBottom;
			else
				this._measureHeight = Math.ceil(size.height) + marginTop + marginBottom;

			this.measureValid = true;

			//console.log(this+'.measure ('+width+','+height+') => '+this.measureWidth+'x'+this.measureHeight);

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
			if(this.measureValid) {
				this.measureValid = false;
				if((this._parent != undefined) && (this._parent.measureValid))
					this._parent.onChildInvalidateMeasure(this, 'change');
			}
			this.invalidateArrange();
		}

		invalidateLayout() {
			if(this.layoutValid) {
			// console.log('invalidateLayout enqueue ('+(new Date()).getTime()+')');
				this.layoutValid = false;
				this.measureValid = false;
				this.arrangeValid = false;
				Ui.App.current.enqueueLayout(this);
			}
		}

		protected onChildInvalidateMeasure(child, event) {
			this.invalidateMeasure();
		}

		updateLayout(width: number, height: number) {
			//console.log(this+'.updateLayout '+this.layoutWidth+'x'+this.layoutHeight);
			this._layoutWidth = width;
			this._layoutHeight = height;
			this.layoutCore();
			this.layoutValid = true;
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
			if(!this._isLoaded || this.collapse)
				return;
			if(isNaN(x))
				x = 0;
			if(isNaN(y))
				y = 0;
			if(isNaN(width))
				width = 0;
			if(isNaN(height))
				height = 0;
			x = Math.round(x);
			y = Math.round(y);
			width = Math.round(width);
			height = Math.round(height);

			if(!this.arrangeValid || (this.arrangeX != x) || (this.arrangeY != y) ||
				(this.arrangeWidth != width) ||	(this.arrangeHeight != height) ||
				(this.arrangePixelRatio != (window.devicePixelRatio || 1))) {
				this.arrangeX = x;
				this.arrangeY = y;
				this.arrangeWidth = width;
				this.arrangeHeight = height;
				this.arrangePixelRatio = (window.devicePixelRatio || 1);

				// handle alignment
				if(this._verticalAlign == 'top') {
					height = this._measureHeight;
				}
				else if(this._verticalAlign == 'bottom') {
					y += height - this._measureHeight;
					height = this._measureHeight;
				}
				else if(this._verticalAlign == 'center') {
					y += (height - this._measureHeight) / 2;
					height = this._measureHeight;
				}
				if(this._horizontalAlign == 'left') {
					width = this._measureWidth;
				}
				else if(this._horizontalAlign == 'right') {
					x += width - this._measureWidth;
					width = this._measureWidth;
				}
				else if(this._horizontalAlign == 'center') {
					x += (width - this._measureWidth) / 2;
					width = this._measureWidth;
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

				this._drawing.style.left = Math.round(this._layoutX)+'px';
				this._drawing.style.top = Math.round(this._layoutY)+'px';
				if(this._transform !== undefined)
					this.updateTransform();

				if(this._eventsHidden) {
					this._drawing.style.width ='0px';
					this._drawing.style.height = '0px';
				}
				else {
					this._drawing.style.width = Math.round(this._layoutWidth)+'px';
					this._drawing.style.height = Math.round(this._layoutHeight)+'px';
				}

				this._drawing.style.visibility = 'inherit';
				this.arrangeCore(this._layoutWidth, this._layoutHeight);
			}
			this.arrangeValid = true;
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
			if(this.arrangeValid) {
				this.arrangeValid = false;
				if(this._parent != undefined)
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
			if(Ui.App.current === undefined)
				return;
			if(this.drawValid) {
				this.drawValid = false;
				Ui.App.current.enqueueDraw(this);
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
			if(this._width !== width) {
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
			if(this._height !== height) {
				this._height = height;
				this.invalidateMeasure();
			}
		}

		get maxWidth(): number {
			return this._maxWidth;
		}

		set maxWidth(width: number) {
			if(this._maxWidth !== width) {
				this._maxWidth = width;
				if(this._layoutWidth > this._maxWidth)
					this.invalidateMeasure();
			}
		}

		get maxHeight(): number {
			return this._maxHeight;
		}

		set maxHeight(height: number) {
			if(this._maxWidth !== height) {
				this._maxHeight = height;
				if(this._layoutHeight > this._maxHeight)
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
			if(this._verticalAlign !== align) {
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
			if(this._horizontalAlign !== align) {
				this._horizontalAlign = align;
				this.invalidateArrange();
			}
		}

		get clipToBounds(): boolean {
			return this._clipToBounds;
		}

		set clipToBounds(clip: boolean) {
			if(this._clipToBounds !== clip) {
				this._clipToBounds = clip;
				if(clip)
					this._drawing.style.overflow = 'hidden';
				else
					this._drawing.style.removeProperty('overflow');
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
			if(this.clipX !== undefined) {
				let x = Math.round(this.clipX);
				let y = Math.round(this.clipY);
				let width = Math.round(this.clipWidth);
				let height = Math.round(this.clipHeight);
				this._drawing.style.clip = 'rect('+y+'px '+(x+width)+'px '+(y+height)+'px '+x+'px)';
			}
			else {
				if('removeProperty' in this._drawing.style)
					this._drawing.style.removeProperty('clip');
				else if('removeAttribute' in this._drawing.style)
					this._drawing.style.removeAttribute('clip');
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
			if(marginTop !== this._marginTop) {
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
			if(marginBottom !== this._marginBottom) {
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
			if(marginLeft !== this._marginLeft) {
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
			if(marginRight !== this._marginRight) {
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
			if(this._opacity !== opacity) {
				this._opacity = opacity;
				this._drawing.style.opacity = this._opacity;
			}
		}

		//
		// Ask for focus on the current element
		//
		focus() {
			if(this._focusable) {
				try {
					this._drawing.focus();
				} catch(e) {}
			}
		}

		//
		// Remove the focus current element
		//
		blur() {
			try {
				this._drawing.blur();
			} catch(e) {}
		}

		//
		// Provide an Matrix to transform the element rendering.
		// This transformation is not taken in account for the arrangement
		//
		set transform(transform: Matrix) {
			if(this._transform !== transform) {
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
			if((this.transformOriginX !== x) || (this.transformOriginY !== y) || (this.transformOriginAbsolute !== absolute)) {
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
			if(this._transform !== undefined) {
				let originX = this.transformOriginX*this._layoutWidth;
				let originY = this.transformOriginY*this._layoutHeight;
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

			if(this._transform !== undefined) {
				let originX = this.transformOriginX*this._layoutWidth;
				let originY = this.transformOriginY*this._layoutHeight;
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
			//return Ui.Element.transformToWindow(this.drawing);
		}

		//
		// Return the transform matrix to convert coordinates
		// from the page coordinate system to the current element
		// coordinate system
		//
		transformFromWindow(): Matrix {
			return  Ui.Element.transformFromWindow(this);
			//return Ui.Element.transformFromWindow(this.drawing);
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
			if((p.x >= 0) && (p.x <= this._layoutWidth) &&
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

		elementFromPoint(point: Point): Element {
			if(!this._eventsHidden && this.isVisible && this.getIsInside(point))
				return this;
			else
				return undefined;
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
			if((this.visible === undefined) || this.visible) {
				let old = this.isVisible;
				this.visible = false;
				this._drawing.style.display = 'none';
				this.collapse = collapse;
				if(old)
					this.onInternalHidden();
				if(this.collapse)
					this.invalidateMeasure();
			}
		}

		show() {
			if((this.visible === undefined) || !this.visible) {
				let old = this.isVisible;
				this.visible = true;
				this._drawing.style.display = 'block';
				if(this.isVisible && !old)
					this.onInternalVisible();
				if(this.collapse) {
					this.collapse = false;
					this.invalidateMeasure();
				}
			}
		}

		get isVisible(): boolean {
			return ((this._parentVisible === true) && (this.visible !== false));
		}

		set parentVisible(visible: boolean) {
			let old = this.isVisible;
			this._parentVisible = visible;
			if(old != this.isVisible) {
				if(this.isVisible)
					this.onInternalVisible();
				else
					this.onInternalHidden();
			}
		}

		protected onInternalHidden() {
			this.onHidden();
			this.fireEvent('hidden', this);
		}

		protected onHidden() {
		}

		protected onInternalVisible() {
			this.onVisible();
			this.fireEvent('visible', this);
		}

		checkVisible() {
			if(this.drawing === undefined)
				return;
			let visible = false;
			let current = this.drawing;
			while(current !== undefined) {
				if(current.style.display === 'none') {
					visible = false;
					break;
				}
				if(current == document.body) {
					visible = true;
					break;
				}
				current = current.parentNode;
			}
			if(this.isVisible !== visible)
				console.log('checkVisible expect: '+this.isVisible+', got: '+visible+' (on '+this+')');
				// throw('checkVisible expect: '+this.isVisible+', got: '+visible+' (on '+this+')');
		}

		protected onVisible() {
		}

		disable() {
			if((this.disabled === undefined) || !this.disabled) {
				let old = this.isDisabled;
				this.disabled = true;
				if(!old)
					this.onInternalDisable();
			}
		}

		enable() {
			if((this.disabled === undefined) || this.disabled) {
				let old = this.isDisabled;
				this.disabled = false;
				if(old && !this.isDisabled)
					this.onInternalEnable();
			}
		}

		setEnable(enable: boolean){
			if(enable)
				this.enable();
			else
				this.disable();
		}

		get isDisabled(): boolean {
			if((this.disabled !== undefined) && (this.disabled === true))
				return true;
			if((this.parentDisabled !== undefined) && (this.parentDisabled === true))
				return true;
			return false;
		}

		setParentDisabled(disabled: boolean) {
			let old = this.isDisabled;
			this.parentDisabled = disabled;
			if(old !== this.isDisabled) {
				if(this.isDisabled)
					this.onInternalDisable();
				else
					this.onInternalEnable();
			}
		}

		protected onInternalDisable() {
			if(this._focusable) {
				this._drawing.tabIndex = -1;
				if(this._hasFocus)
					this.blur();
			}
			this.onDisable();
			this.fireEvent('disable', this);
		}

		protected onDisable() {
		}

		protected onInternalEnable() {
			if(this._focusable)
				this._drawing.tabIndex = 0;
			this.onEnable();
			this.fireEvent('enable', this);
		}

		protected onEnable() {
		}

		private containSubStyle(style) {
			return style['types'] != undefined && style['types'] instanceof Array;
		}

		private fusionStyle(dst, src) {
			if (src['types'] == undefined || !(src['types'] instanceof Array))
				return;	

			if (dst['types'] == undefined)
				dst['types'] = [];
			
			let mergeTypes = [];
			for (let i = 0; i < src['types'].length; i++) {
				let srcStyle = src['types'][i];
				let dstStyle = this.getClassStyle(dst, srcStyle['type']);
				if (dstStyle != undefined) {
					// merge
					let mergeStyle = {};
					for(let prop in dstStyle)
						mergeStyle[prop] = dstStyle[prop];
					for(let prop in srcStyle)
						mergeStyle[prop] = srcStyle[prop];
					mergeTypes.push(mergeStyle);
				}
				else
					mergeTypes.push(srcStyle);
			}
			dst['types'] = mergeTypes;			
		}

		private getClassStyle(style: object, classFunc: Function): object | undefined {
			if (style['types'] != undefined && (style['types'] instanceof Array)) {
				let classStyle = undefined;
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
			if(this._parentStyle != undefined) {
				current = this.constructor;
				found = false;
				while (current != undefined) {
					let classStyle = this.getClassStyle(this._parentStyle, current);
					if (classStyle != undefined && this.containSubStyle(classStyle)) {
						if (this.mergeStyle == undefined)
							this.mergeStyle = Core.Util.clone(this._parentStyle);
						this.fusionStyle(this.mergeStyle, classStyle);
						found = true;
						break;
					}
					current = Object.getPrototypeOf(current.prototype);
					if (current != null)
						current = current.constructor;
				}
				if(!found)
					this.mergeStyle = this._parentStyle;
			}
			if(this._style != undefined) {
				if(this.mergeStyle != undefined) {
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
							if(this.mergeStyle == undefined)
								this.mergeStyle = Core.Util.clone(this._style);
							this.fusionStyle(this.mergeStyle, classStyle);
							found = true;
							break;
						}
						current = Object.getPrototypeOf(current.prototype);
						if (current != null)
							current = current.constructor;
					}
					if(!found)
						this.mergeStyle = this._style;
				}
			}
		}

		getIsChildOf(parent: Element) {
			let current: Element = this;
			while(current != undefined) {
				if(current === parent)
					return true;
				current = current.parent;
			}
			return false;
		}

		get parent(): Element {
			return this._parent;
		}

		set parent(parent: Element) {
			this._parent = parent;
		}
		
		getParentByClass(classFunc: Function) {
			let current = this.parent;
			while(current != undefined) {
				if(current.constructor === classFunc)
					return current;
				current = current.parent;
			}
			return undefined;
		}

		setParentStyle(parentStyle: object | undefined) {
			if(this._parentStyle !== parentStyle)
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
			if(this._style === undefined)
				this._style = {};
			this._style[property] = value;
		}

		getStyleProperty(property: string): any {			
			let current: Function;
			if (this._style != undefined && this._style[property] != undefined)
				return this._style[property];	
			if(this.mergeStyle != undefined) {
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
				if(('style' in current) && (property in (current as any).style))
					return (current as any).style[property];
				current = Object.getPrototypeOf(current);
			}
			return undefined;
		}

		protected onInternalStyleChange() {			
			if(!this._isLoaded)
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
			if(this._parent != undefined)
				this._parent.onScrollIntoView(el);
		}

		get(name: string): Element {
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
			if(this._isLoaded !== isLoaded) {
				this._isLoaded = isLoaded;
				if(isLoaded)
					this.onLoad();
				else
					this.onUnload();
			}
		}

		private onFocus(event) {
			if(this._focusable && !this.isDisabled) {
				event.preventDefault();
				event.stopPropagation();
				this._hasFocus = true;
				this.isMouseFocus = this.isMouseDownFocus;
				this.scrollIntoView();
				this.fireEvent('focus', this);
			}
		}

		private onBlur(event) {
			if(this._focusable) {
				event.preventDefault();
				event.stopPropagation();
				this.isMouseFocus = false;
				this._hasFocus = false;
				this.fireEvent('blur', this);
			}
		}

		private updateTransform() {
			if(this._transform !== undefined) {
				let matrix = this._transform;
				let x = this.transformOriginX;
				let y = this.transformOriginY;
				if(!this.transformOriginAbsolute) {
					x *= this._layoutWidth;
					y *= this._layoutHeight;
				}
				if((x !== 0) || (y !== 0))
					matrix = Ui.Matrix.createTranslate(x, y).multiply(this._transform).translate(-x, -y);

				this._drawing.style.transform = matrix.toString();
				if(Core.Navigator.isIE)
					this._drawing.style.msTransform = matrix.toString();
				else if(Core.Navigator.isGecko)
					this._drawing.style.MozTransform = 'matrix('+matrix.getA().toFixed(4)+', '+matrix.getB().toFixed(4)+', '+matrix.getC().toFixed(4)+', '+matrix.getD().toFixed(4)+', '+matrix.getE().toFixed(4)+'px, '+matrix.getF().toFixed(4)+'px)';
				else if(Core.Navigator.isWebkit)
					this._drawing.style.webkitTransform = matrix.toString()+' translate3d(0,0,0)';
				else if(Core.Navigator.isOpera)
					this._drawing.style.OTransform = matrix.toString();
			}
			else {
				if('removeProperty' in this._drawing.style)
					this._drawing.style.removeProperty('transform');
				if(Core.Navigator.isIE && ('removeProperty' in this._drawing.style))
					this._drawing.style.removeProperty('-ms-transform');
				else if(Core.Navigator.isGecko)
					this._drawing.style.removeProperty('-moz-transform');
				else if(Core.Navigator.isWebkit)
					this._drawing.style.removeProperty('-webkit-transform');
				else if(Core.Navigator.isOpera)
					this._drawing.style.removeProperty('-o-transform');
			}
		}

		setAnimClock(clock: Anim.Clock): void {
			// if an anim clock is already set stop it
			if(this.animClock != undefined)
				this.animClock.stop();
			this.animClock = clock;
			if(clock != undefined)
				this.connect(clock, 'complete', this.onAnimClockComplete);
		}

		private onAnimClockComplete() {
			this.animClock = undefined;
		}

		protected onLoad() {
			if(this._parent != undefined) {
				this.setParentStyle(this._parent.mergeStyle);
				this.setParentDisabled(this._parent.isDisabled);
				this.parentVisible = this._parent.isVisible;
			}
			this.fireEvent('load', this);
		}

		protected onUnload() {
			if(this.animClock != undefined) {
				this.animClock.stop();
				this.animClock = undefined;
			}
			this.fireEvent('unload', this);
		}

		static transformToWindow(element: Element): Matrix {
			let matrix = new Ui.Matrix();
			let current = element;
			while(current != undefined) {
				matrix = current.getInverseLayoutTransform().multiply(matrix);
				current = current._parent;
			}
			return matrix;
		}

		static transformFromWindow(element: Element): Matrix {
			return Ui.Element.transformToWindow(element).inverse();
		}

		static elementFromPoint(point: Point): Element {
			return App.current.elementFromPoint(point);
		}

		static getIsDrawingChildOf(drawing, parent): boolean {
			let current = drawing;
			while(current != undefined) {
				if(current === parent)
					return true;
				current = current.offsetParent;
			}
			return false;
		}

		static setSelectable(drawing, selectable) {
			drawing.selectable = selectable;
			if(selectable) {
				drawing.style.cursor = 'text';
				drawing.style.userSelect = 'text';
				if(Core.Navigator.isWebkit)
					drawing.style.webkitUserSelect = 'text';
				else if(Core.Navigator.isGecko)
					drawing.style.MozUserSelect = 'text';
				else if(Core.Navigator.isIE)
					drawing.style.msUserSelect = 'element';
			}
			else {
				drawing.style.cursor = 'inherit';
				drawing.style.userSelect = 'none';
				if(Core.Navigator.isWebkit)
					drawing.style.webkitUserSelect = 'none';
				else if(Core.Navigator.isGecko)
					drawing.style.MozUserSelect = 'none';
				else if(Core.Navigator.isIE)
					drawing.style.msUserSelect = 'none';
			}
		}
	}
}
