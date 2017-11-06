namespace Ui {

	export interface LBoxInit extends ContainerInit {
		padding: number;
		paddingTop: number;
		paddingBottom: number;
		paddingLeft: number;
		paddingRight: number;
		content: Element[] | Element;
	}

	export class LBox extends Container implements LBoxInit {
		private _paddingTop: number = 0;
		private _paddingBottom: number = 0;
		private _paddingLeft: number = 0;
		private _paddingRight: number = 0;

		// @constructs
		// @class LBox stands for Layer Box, a container that "pile" elements like layers        		
		constructor(init?: Partial<LBoxInit>) {
			super();
			if (init)
				this.assign(init);
		}

		protected setContent(content: Element | Element[]) {
			if ((this.children.length === 1) && (content === this.firstChild))
				return;
			while (this.firstChild != undefined)
				this.removeChild(this.firstChild);
			if (content != undefined) {
				if (content instanceof Array) {
					let elements = content as Element[];
					for (let i = 0; i < elements.length; i++)
						this.append(content[i]);
				}
				else
					this.append(content as Element);
			}
		}

		set content(content: Element | Element[]) {
			this.setContent(content);
		}

		//
		// Set the padding for all borders
		//
		set padding(padding: number) {
			this.paddingTop = padding;
			this.paddingBottom = padding;
			this.paddingLeft = padding;
			this.paddingRight = padding;
		}

		//
		// Return the current element top padding
		//
		get paddingTop(): number {
			return this._paddingTop;
		}

		//
		// Set the current element top padding
		//
		set paddingTop(paddingTop: number) {
			if (this._paddingTop != paddingTop) {
				this._paddingTop = paddingTop;
				this.invalidateMeasure();
			}
		}

		//
		// Return the current element bottom padding
		//
		get paddingBottom(): number {
			return this._paddingBottom;
		}

		//
		// Set the current element bottom padding
		//
		set paddingBottom(paddingBottom: number) {
			if (this._paddingBottom != paddingBottom) {
				this._paddingBottom = paddingBottom;
				this.invalidateMeasure();
			}
		}

		//
		// Return the current element left padding
		//
		get paddingLeft(): number {
			return this._paddingLeft;
		}

		//
		// Set the current element left padding
		//
		set paddingLeft(paddingLeft: number) {
			if (this._paddingLeft != paddingLeft) {
				this._paddingLeft = paddingLeft;
				this.invalidateMeasure();
			}
		}

		//
		// Return the current element right padding
		//
		get paddingRight(): number {
			return this._paddingRight;
		}

		//
		// Set the current element right padding
		//
		set paddingRight(paddingRight: number) {
			if (this._paddingRight != paddingRight) {
				this._paddingRight = paddingRight;
				this.invalidateMeasure();
			}
		}

		//
		// Append a child on the top of all other layers
		//
		append(child: Element) {
			this.appendChild(child);
		}

		//
		// Append a child on the bottom of all other layers
		//
		prepend(child: Element) {
			this.prependChild(child);
		}

		insertBefore(child: Element, beforeChild: Element) {
			this.insertChildBefore(child, beforeChild);
		}

		//
		// Remove a child from the layers
		//
		remove(child: Element) {
			this.removeChild(child);
		}

		//
		// Return the required size for the current element
		//
		protected measureCore(width: number, height: number) {
			let left = this.paddingLeft;
			let right = this.paddingRight;
			let top = this.paddingTop;
			let bottom = this.paddingBottom;
			let constraintWidth = Math.max(width - (left + right), 0);
			let constraintHeight = Math.max(height - (top + bottom), 0);
			let minWidth = 0;
			let minHeight = 0;
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				let size = child.measure(constraintWidth, constraintHeight);
				if (size.width > minWidth)
					minWidth = size.width;
				if (size.height > minHeight)
					minHeight = size.height;
			}
			minWidth += left + right;
			minHeight += top + bottom;
			return { width: minWidth, height: minHeight };
		}

		//
		// Arrange children
		//
		protected arrangeCore(width: number, height: number) {
			let left = this.paddingLeft;
			let right = this.paddingRight;
			let top = this.paddingTop;
			let bottom = this.paddingBottom;
			width -= left + right;
			height -= top + bottom;
			for (let i = 0; i < this.children.length; i++)
				this.children[i].arrange(left, top, width, height);
		}
	}

	export interface LPBoxInit extends LBoxInit {
	}

	export class LPBox extends LBox implements LPBoxInit
	{
		constructor(init?: Partial<LPBoxInit>) {
			super();
			if (init)
				this.assign(init);
		}

		//
		// Append a child on the top of all other layers
		//
		appendAtLayer(child: Element, layer: number) {
			if (layer === undefined)
				layer = 1;
			child['Ui.LPBox.layer'] = layer;
			let i = 0;
			for (; (i < this.children.length) && (this.children[i]['Ui.LPBox.layer'] <= layer); i++) { }
			this.insertChildAt(child, i);
		}

		//
		// Append a child on the bottom of all other layers
		//
		prependAtLayer(child: Element, layer: number) {
			if (layer === undefined)
				layer = 1;
			child['Ui.LPBox.layer'] = layer;
			let i = 0;
			for (; (i < this.children.length) && (this.children[i]['Ui.LPBox.layer'] < layer); i++) { }
			i = Math.max(0, i);
			this.insertChildAt(child, i);
		}
	}
}