
namespace Ui {
	export interface FlowInit extends ContainerInit {
		spacing?: number;
		itemAlign?: 'left' | 'right';
		uniform?: boolean;
		content?: Element[] | undefined;
	}

	export class Flow extends Container implements FlowInit {
		private _uniform: boolean = false;
		private uniformWidth: number = 0;
		private uniformHeight: number = 0;
		private _itemAlign: 'left' | 'right' = 'left';
		private _spacing: number = 0;

		constructor(init?: FlowInit) {
			super(init);
			if (init) {
				if (init.spacing !== undefined)
					this.spacing = init.spacing;
				if (init.itemAlign !== undefined)
					this.itemAlign = init.itemAlign;
				if (init.uniform !== undefined)
					this.uniform = init.uniform;	
				if (init.content !== undefined)
					this.content = init.content;	
			}
		}

		//
		// Replace all item by the given one or the
		// array of given items
		//
		set content(content: Element[] | undefined) {
			while (this.firstChild !== undefined)
				this.removeChild(this.firstChild);
			if (content != undefined) {
				for (let i = 0; i < content.length; i++)
					this.appendChild(content[i]);
			}
		}
	
		//
		// Return the space between each item and each line
		//
		get spacing(): number {
			return this._spacing;
		}
	
		//
		// Set the space between each item and each line
		//
		set spacing(spacing: number) {
			if (this._spacing != spacing) {
				this._spacing = spacing;
				this.invalidateMeasure();
				this.invalidateArrange();
			}
		}
	
		//
		// Return item horizontal alignment [left|right]
		//
		get itemAlign(): 'left' | 'right' {
			return this._itemAlign;
		}
	
		//
		// Choose howto horizontaly align items [left|right]
		//
		set itemAlign(itemAlign: 'left' | 'right') {
			if (itemAlign != this._itemAlign) {
				this._itemAlign = itemAlign;
				this.invalidateMeasure();
				this.invalidateArrange();
			}
		}

		//
		// true if all children will be arrange to have the
		// same width and height
		//
		get uniform(): boolean {
			return this._uniform;
		}

		//
		// Set true to force children arrangement to have the
		// same width and height
		//
		set uniform(uniform: boolean) {
			if (this._uniform != uniform) {
				this._uniform = uniform;
				this.invalidateMeasure();
			}
		}

		//
		// Append a child at the end of the flow
		//
		append(child: Element) {
			this.appendChild(child);
		}

		//
		// Append a child at the begining of the flow
		//
		prepend(child: Element) {
			this.prependChild(child);
		}

		//
		// Append a child at the given position
		//
		insertAt(child: Element, position: number) {
			this.insertChildAt(child, position);
		}

		//
		// Move a given item from its current position to
		// the given one
		//
		moveAt(child: Element, position: number) {
			this.moveChildAt(child, position);
		}

		//
		// Remove a child from the flow
		//
		remove(child: Element) {
			this.removeChild(child);
		}

		private measureChildrenNonUniform(width: number, height: number) {
			let line = { pos: 0, y: 0, width: 0, height: 0 };
			let ctx = { lineX: 0, lineY: 0, lineCount: 0, lineHeight: 0, minWidth: 0 };

			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				let size = child.measure(width, height);
				let isFirst = (ctx.lineX === 0);
				if (!isFirst && (ctx.lineX + size.width + (!isFirst ? this._spacing : 0) > width)) {
					line.width = ctx.lineX;
					line.height = ctx.lineHeight;
					ctx.lineX = 0;
					ctx.lineY += ctx.lineHeight + this._spacing;
					ctx.lineHeight = 0;
					isFirst = true;
					ctx.lineCount++;
					line = { pos: ctx.lineCount, y: ctx.lineY, width: 0, height: 0 };
				}
				child['Ui.Flow.flowLine'] = line;
				if (!isFirst && !child.isCollapsed)
					ctx.lineX += this._spacing;
				child['Ui.Flow.flowLineX'] = ctx.lineX;
				ctx.lineX += size.width;
				if (size.height > ctx.lineHeight)
					ctx.lineHeight = size.height;
				if (ctx.lineX > ctx.minWidth)
					ctx.minWidth = ctx.lineX;
			}
			ctx.lineY += ctx.lineHeight;
			line.width = ctx.lineX;
			line.height = ctx.lineHeight;
			return { width: ctx.minWidth, height: ctx.lineY };
		}

		private measureChildrenUniform(width, height) {
			let i; let child; let size;
			let maxWidth = 0;
			let maxHeight = 0;
			for (i = 0; i < this.children.length; i++) {
				child = this.children[i];
				size = child.measure(width, height);
				if (size.width > maxWidth)
					maxWidth = size.width;
				if (size.height > maxHeight)
					maxHeight = size.height;
			}
			let countPerLine = Math.max(Math.floor((width + this._spacing) / (maxWidth + this._spacing)), 1);
		
			let nbLine = Math.ceil(this.children.length / countPerLine);

			for (i = 0; i < this.children.length; i++)
				this.children[i].measure(maxWidth, maxHeight);
			this.uniformWidth = maxWidth;
			this.uniformHeight = maxHeight;
			return {
				width: maxWidth * countPerLine + (countPerLine - 1) * this._spacing,
				height: nbLine * maxHeight + (nbLine - 1) * this._spacing
			};
		}

		protected measureCore(width: number, height: number) {
			if (this.children.length === 0)
				return { width: 0, height: 0 };
			if (this._uniform)
				return this.measureChildrenUniform(width, height);
			else
				return this.measureChildrenNonUniform(width, height);
		}

		protected arrangeCore(width: number, height: number) {
			if (this._uniform) {
				if (this._itemAlign === 'left') {
					let x = 0;
					let y = 0;
					for (let i = 0; i < this.children.length; i++) {
						let child = this.children[i];
						if (x + this.uniformWidth > width) {
							x = 0;
							y += this.uniformHeight + this._spacing;
						}
						child.arrange(x, y, this.uniformWidth, this.uniformHeight);
						x += this.uniformWidth + this._spacing;
					}
				}
				else if (this._itemAlign === 'right') {
					let nbItemPerLine = Math.max(Math.floor((width + this._spacing) / (this.uniformWidth + this._spacing)), 1);
					let lineWidth = nbItemPerLine * this.uniformWidth + (nbItemPerLine - 1) * this._spacing;
				
					let x = 0;
					if (this.children.length < nbItemPerLine)
						x = width - ((this.children.length * (this.uniformWidth + this._spacing)) - this._spacing);
					else
						x = width - lineWidth;
					let y = 0;
					for (let i = 0; i < this.children.length; i++) {
						let child = this.children[i];
						if (x + this.uniformWidth > width) {
							if (this.children.length - i < nbItemPerLine)
								x = width - (((this.children.length - i) * (this.uniformWidth + this._spacing)) - this._spacing);
							else
								x = width - lineWidth;
							y += this.uniformHeight + this._spacing;
						}
						child.arrange(x, y, this.uniformWidth, this.uniformHeight);
						x += this.uniformWidth + this._spacing;
					}
				}
			}
			else {
				for (let i = 0; i < this.children.length; i++) {
					let child = this.children[i];
					if (this._itemAlign == 'left')
						child.arrange(child['Ui.Flow.flowLineX'], child['Ui.Flow.flowLine'].y,
							child.measureWidth, child['Ui.Flow.flowLine'].height);
					else
						child.arrange(child['Ui.Flow.flowLineX'] + (width - child['Ui.Flow.flowLine'].width),
							child['Ui.Flow.flowLine'].y, child.measureWidth, child['Ui.Flow.flowLine'].height);
				}
			}
		}
	}
}	

