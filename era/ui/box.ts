
namespace Ui
{
	export type Orientation = 'vertical' | 'horizontal';

	export interface BoxInit extends ContainerInit {
		orientation?: Orientation;
		padding?: number;
		paddingTop?: number;
		paddingBottom?: number;
		paddingLeft?: number;
		paddingRight?: number;
		uniform?: boolean;
		spacing?: number;
		content?: Element | Element[];
	}

	export class Box extends Container implements BoxInit
	{
		private _paddingTop: number = 0;
		private _paddingBottom: number = 0;
		private _paddingLeft: number = 0;
		private _paddingRight: number = 0;
		private _uniform: boolean = false;
		private _spacing: number = 0;
		private star: number = 0;
		private vertical: boolean = true;
		private uniformSize: number = 0;

		constructor(init?: BoxInit) {
			super(init);
			if (init) {
				if (init.orientation !== undefined)
					this.orientation = init.orientation;
				if (init.padding !== undefined)
					this.padding = init.padding;	
				if (init.paddingTop !== undefined)
					this.paddingTop = init.paddingTop;
				if (init.paddingBottom !== undefined)
					this.paddingBottom = init.paddingBottom;
				if (init.paddingLeft !== undefined)
					this.paddingLeft = init.paddingLeft;
				if (init.paddingRight !== undefined)
					this.paddingRight = init.paddingRight;
				if (init.uniform !== undefined)
					this.uniform = init.uniform;	
				if (init.spacing !== undefined)
					this.spacing = init.spacing;	
				if (init.content !== undefined)
					this.content = init.content;
			}
		}

		set content(content: Element | Element[]) {
			while (this.firstChild !== undefined)
				this.removeChild(this.firstChild);
			if (content != undefined) {
				if (content instanceof Element)
					this.append(content as Element);
				else {
					let ar = content as Element[];
					for (let i = 0; i < ar.length; i++)
						this.append(ar[i]);
				}
			}
		}

		//
		// Get the layout orientation
		// Possible values: [vertical|horizontal|
		//
		get orientation(): Orientation {
			if (this.vertical)
				return 'vertical';
			else
				return 'horizontal';
		}

		//
		// Set the layout orientation
		// Possible values: [vertical|horizontal]
		//
		set orientation(orientation: Orientation) {
			let vertical = true;
			if (orientation !== 'vertical')
				vertical = false;
			if (this.vertical !== vertical) {
				this.vertical = vertical;
				this.invalidateMeasure();
			}
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
		// True if all children will be arrange to have the
		// same width
		//
		get uniform(): boolean {
			return this._uniform;
		}

		//
		// Set true to force children arrangement to have the
		// same width
		//
		set uniform(uniform: boolean) {
			if (this._uniform != uniform) {
				this._uniform = uniform;
				this.invalidateMeasure();
			}
		}

		//
		// Return the space inserted between each
		// child
		//
		get spacing(): number {
			return this._spacing;
		}

		//
		// Set the space value inserted between each child
		//
		set spacing(spacing: number) {
			if (this._spacing != spacing) {
				this._spacing = spacing;
				this.invalidateMeasure();
			}
		}

		//
		// Append a child at the end of the box
		//
		append(child: Element, resizable?: boolean) {
			if (resizable !== undefined)
				child.resizable = resizable === true;
			this.appendChild(child);
		}

		//
		// Append a child at the begining of the box
		//
		prepend(child: Element, resizable?: boolean) {
			if (resizable !== undefined)
				child.resizable = resizable === true;
			this.prependChild(child);
		}

		//
		// Insert a child element in the current box at the given position
		//
		insertAt(child: Element, position: number, resizable?: boolean) {
			if (resizable !== undefined)
				child.resizable = resizable === true;
			this.insertChildAt(child, position);
		}
	
		//
		// Move a child element in the current box at the given position
		//
		moveAt(child: Element, position: number) {
			this.moveChildAt(child, position);
		}

		//
		// Remove a child from the box
		//
		remove(child: Element) {
			this.removeChild(child);
		}

		private measureUniform(width: number, height: number) {
			let constraintSize = this.vertical ? height : width;
			let constraintOpSize = this.vertical ? width : height;

			constraintSize -= this._spacing * (this.children.length - 1);
			let childConstraintSize = constraintSize / this.children.length;
			let countResizable = 0;
			let uniformSize = 0;
			let minOpSize = 0;

			let loop = true;
			while (loop) {
				for (let i = 0; i < this.children.length; i++) {
					let child = this.children[i];
					if (child.resizable)
						countResizable++;
					let size;
					if (this.vertical)
						size = child.measure(constraintOpSize, childConstraintSize);
					else
						size = child.measure(childConstraintSize, constraintOpSize);
					if ((this.vertical ? size.width : size.height) > minOpSize)
						minOpSize = this.vertical ? size.width : size.height;
					if ((this.vertical ? size.height : size.width) > uniformSize)
						uniformSize = this.vertical ? size.height : size.width;
				}
				if ((minOpSize > constraintOpSize) ||  (uniformSize > childConstraintSize)) {
					if (uniformSize > childConstraintSize)
						childConstraintSize = uniformSize;
					constraintOpSize = minOpSize;
					minOpSize = 0;
					uniformSize = 0;
					countResizable = 0;
				}
				else
					loop = false;
			}

			this.uniformSize = uniformSize;
			let minSize = this.uniformSize * this.children.length;
			minSize += this._spacing * (this.children.length - 1);

			if (this.vertical)
				return { width: minOpSize, height: minSize };
			else
				return { width: minSize, height: minOpSize };
		}

		private measureNonUniformVertical(width: number, height: number) {
			let i; let child; let size;
			let constraintWidth = width;
			let constraintHeight = height;
			constraintHeight -= this._spacing * (this.children.length - 1);

			let countResizable;
			let minWidth;
			let minHeight;
			let loop = true;
			let star = 0;
			let resizableMinHeight = 0;

			while (loop) {
				countResizable = 0;
				minWidth = 0;
				minHeight = 0;

				// handle not resizable
				for (i = 0; i < this.children.length; i++) {
					child = this.children[i];
					if (!child.resizable) {
						size = child.measure(constraintWidth, 0);
						if (size.width > minWidth)
							minWidth = size.width;
						minHeight += size.height;
					}
					else {
						child.boxStarDone = false;
						countResizable++;
					}
				}
				resizableMinHeight = 0;
				if (countResizable > 0) {
					let remainHeight = constraintHeight - minHeight;
					let starFound = true;
					star = remainHeight / countResizable;
					do {
						resizableMinHeight = 0;
						starFound = true;
						for (i = 0; i < this.children.length; i++) {
							child = this.children[i];
							if (child.resizable) {
								if (!child.boxStarDone) {
									size = child.measure(constraintWidth, star);
									if (size.width > minWidth)
										minWidth = size.width;
									if (size.height > star) {
										child.boxStarDone = true;
										starFound = false;
										remainHeight -= size.height;
										minHeight += size.height;
										countResizable--;
										star = remainHeight / countResizable;
										break;
									}
									else
										resizableMinHeight += size.height;
								}
							}
						}
					} while (!starFound);
				}
				if (minWidth > constraintWidth)
					constraintWidth = minWidth;
				else
					loop = false;
			}

			minHeight += this._spacing * (this.children.length - 1);
			if (countResizable > 0) {
				minHeight += resizableMinHeight;
				this.star = star;
			}
			else
				this.star = 0;
			return { width: minWidth, height: minHeight };
		}

		private measureNonUniformHorizontal(width: number, height: number) {
			let i; let child; let size;
			let constraintWidth = width;
			let constraintHeight = height;
			constraintWidth -= this._spacing * (this.children.length - 1);

			let countResizable;
			let minWidth;
			let minHeight;
			let loop = true;
			let star = 0;
			let resizableMinWidth = 0;

			while (loop) {
				countResizable = 0;
				minWidth = 0;
				minHeight = 0;

				// handle not resizable
				for (i = 0; i < this.children.length; i++) {
					child = this.children[i];
					if (!child.resizable) {
						size = child.measure(0, constraintHeight);
						if (size.height > minHeight)
							minHeight = size.height;
						minWidth += size.width;
					}
					else {
						child.boxStarDone = false;
						countResizable++;
					}
				}
				resizableMinWidth = 0;
				if (countResizable > 0) {
					let remainWidth = constraintWidth - minWidth;
					let starFound = true;
					star = remainWidth / countResizable;
					do {
						resizableMinWidth = 0;
						starFound = true;
						for (i = 0; i < this.children.length; i++) {
							child = this.children[i];
							if (child.resizable) {
								if (!child.boxStarDone) {
									size = child.measure(star, constraintHeight);
									if (size.height > minHeight)
										minHeight = size.height;
									if (size.width > star) {
										child.boxStarDone = true;
										starFound = false;
										remainWidth -= size.width;
										minWidth += size.width;
										countResizable--;
										star = remainWidth / countResizable;
										break;
									}
									else
										resizableMinWidth += size.width;
								}
							}
						}
					} while (!starFound);
				}
				if (minHeight > constraintHeight)
					constraintHeight = minHeight;
				else
					loop = false;
			}

			minWidth += this._spacing * (this.children.length - 1);
			if (countResizable > 0) {
				minWidth += resizableMinWidth;
				this.star = star;
			}
			else
				this.star = 0;
			return { width: minWidth, height: minHeight };
		}
	
		protected measureCore(width: number, height: number) {
			let left = this.paddingLeft;
			let right = this.paddingRight;
			let top = this.paddingTop;
			let bottom = this.paddingBottom;
			let constraintWidth = Math.max(0, width - (left + right));
			let constraintHeight = Math.max(0, height - (top + bottom));
			let size;

			if (this._uniform)
				size = this.measureUniform(constraintWidth, constraintHeight);
			else {
				if (this.vertical)
					size = this.measureNonUniformVertical(constraintWidth, constraintHeight);
				else
					size = this.measureNonUniformHorizontal(constraintWidth, constraintHeight);
			}
			size.width += left + right;
			size.height += top + bottom;
			return size;
		}

		protected arrangeCore(width: number, height: number) {
			let left = this._paddingLeft;
			let right = this._paddingRight;
			let top = this._paddingTop;
			let bottom = this._paddingBottom;
			width -= left + right;
			height -= top + bottom;

			let offset = this.vertical ? top : left;

			let countResizable = 0;
			let minSize = 0;
			let maxSize = 0;
			let count = this.children.length;
			let countVisible = 0;

			for (let i = 0; i < count; i++) {
				let child = this.children[i];
				let size = this.vertical ? child.measureHeight : child.measureWidth;
				if (child.resizable) {
					countVisible++;
					countResizable++;
					child['Ui.Box.StarDone'] = false;
				}
				else {
					if (size > 0)
						countVisible++;
					minSize += size;
				}
				if (size > maxSize)
					maxSize = size;
			}
			minSize += Math.max(0, countVisible - 1) * this._spacing;

			let star = 0;
			let uniformSize = 0;
			if (countResizable > 0) {
				if (this._uniform)
					uniformSize = ((this.vertical ? height : width) - (this._spacing * (countVisible - 1))) / countVisible;
				else {
					let remainSize = (this.vertical ? height : width) - minSize;
					let starFound = true;
					star = remainSize / countResizable;
					do {
						starFound = true;
						for (let i = 0; i < count; i++) {
							let child = this.children[i];
							if (child.resizable) {
								let size = this.vertical ? child.measureHeight : child.measureWidth;
								if (!child['Ui.Box.StarDone']) {
									if (size > star) {
										child['Ui.Box.StarDone'] = true;
										starFound = false;
										remainSize -= size;
										minSize += size;
										countResizable--;
										star = remainSize / countResizable;
										break;
									}
								}
							}
						}
					} while (!starFound);
				}
			}
			else {
				if (this._uniform)
					uniformSize = maxSize
			}

			let isFirst = true;
			for (let i = 0; i < count; i++) {
				let child = this.children[i];
				let size = this.vertical ? child.measureHeight : child.measureWidth;

				if (this._uniform) {
					if (isFirst)
						isFirst = false;
					else
						offset += this._spacing;
					if (this.vertical)
						child.arrange(left, offset, width, uniformSize);
					else
						child.arrange(offset, top, uniformSize, height);
					offset += uniformSize;
				}
				else {
					if (child.resizable && ((this.vertical ? child.measureHeight : child.measureWidth) < star)) {
						if (isFirst)
							isFirst = false;
						else
							offset += this._spacing;
						if (this.vertical)
							child.arrange(left, offset, width, star);
						else
							child.arrange(offset, top, star, height);
						offset += star;
					}
					else if (size > 0) {
						if (isFirst)
							isFirst = false;
						else
							offset += this._spacing;
					
						if (this.vertical) {
							child.arrange(left, offset, width, child.measureHeight);
							offset += child.measureHeight;
						}
						else {
							child.arrange(offset, top, child.measureWidth, height);
							offset += child.measureWidth;
						}
					}
				}
			}
		}
	}

	export interface VBoxInit extends BoxInit { }

	export class VBox extends Box implements VBoxInit
	{
		constructor(init?: VBoxInit) {
			super(init);
			this.orientation = 'vertical';
		}
	}

	export interface HBoxInit extends BoxInit { }

	export class HBox extends Box implements HBoxInit
	{
		constructor(init?: HBoxInit) {
			super(init);
			this.orientation = 'horizontal';
		}
	}
}