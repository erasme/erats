namespace Ui
{
	export class MenuToolBarPopup extends MenuPopup {}

	export class MenuToolBarButton extends Button
	{
		constructor() {
			super();
			this.icon = 'arrowbottom';
		}
	}

	export class MenuToolBar extends Container
	{
		paddingTop: number = 0;
		paddingBottom: number = 0;
		paddingLeft: number = 0;
		paddingRight: number = 0;
		star: number = 0;
		measureLock: any = undefined;
		items: Element[] = undefined;
		menuButton: MenuToolBarButton = undefined;
		itemsAlign: string = 'left';
		menuPosition: string = 'right';
		uniform: boolean = false;
		uniformSize: number = 0;
		spacing: number = 0;
		itemsWidth: number = 0;
		keepItems: any = undefined;
		menuNeeded: boolean = false;
		bg: Rectangle = undefined;

		constructor() {
			super();
			this.items = [];

			this.bg = new Ui.Rectangle();
			this.appendChild(this.bg);

			this.menuButton = new Ui.MenuToolBarButton();
			this.connect(this.menuButton, 'press', this.onMenuButtonPress);
			this.appendChild(this.menuButton);
		}
	
		getUniform() {
			return this.uniform;
		}
	
		setUniform(uniform) {
			if (this.uniform !== uniform) {
				this.uniform = uniform;
				this.invalidateMeasure();
			}
		}
	
		getMenuPosition() {
			return this.menuPosition;
		}

		setMenuPosition(menuPosition) {
			if (this.menuPosition !== menuPosition) {
				this.menuPosition = menuPosition;
				this.invalidateArrange();
			}
		}

		getItemsAlign() {
			return this.itemsAlign;
		}

		setItemsAlign(align) {
			if (this.itemsAlign !== align) {
				this.itemsAlign = align;
				this.invalidateArrange();
			}
		}

		getLogicalChildren() {
			return this.items;
		}

		//
		// Set the padding for all borders
		//
		setPadding(padding) {
			this.setPaddingTop(padding);
			this.setPaddingBottom(padding);
			this.setPaddingLeft(padding);
			this.setPaddingRight(padding);
		}

		//
		// Return the current element top padding
		//
		getPaddingTop() {
			return this.paddingTop;
		}

		//
		// Set the current element top padding
		//
		setPaddingTop(paddingTop) {
			if (this.paddingTop !== paddingTop) {
				this.paddingTop = paddingTop;
				this.invalidateMeasure();
			}
		}

		//
		// Return the current element bottom padding
		//
		getPaddingBottom() {
			return this.paddingBottom;
		}

		//
		// Set the current element bottom padding
		//
		setPaddingBottom(paddingBottom) {
			if (this.paddingBottom !== paddingBottom) {
				this.paddingBottom = paddingBottom;
				this.invalidateMeasure();
			}
		}

		//
		// Return the current element left padding
		//
		getPaddingLeft() {
			return this.paddingLeft;
		}

		//
		// Set the current element left padding
		//
		setPaddingLeft(paddingLeft) {
			if (this.paddingLeft !== paddingLeft) {
				this.paddingLeft = paddingLeft;
				this.invalidateMeasure();
			}
		}

		//
		// Return the current element right padding
		//
		getPaddingRight() {
			return this.paddingRight;
		}

		//
		// Set the current element right padding
		//
		setPaddingRight(paddingRight) {
			if (this.paddingRight !== paddingRight) {
				this.paddingRight = paddingRight;
				this.invalidateMeasure();
			}
		}

		//
		// Return the space inserted between each
		// child
		//
		getSpacing() {
			return this.spacing;
		}

		//
		// Set the space value inserted between each child
		//
		setSpacing(spacing) {
			if (this.spacing !== spacing) {
				this.spacing = spacing;
				this.invalidateMeasure();
			}
		}

		//
		// Append a child at the end of the box
		//
		append(child: Element, resizable: boolean) {
			if (resizable !== undefined)
				Ui.Box.setResizable(child, resizable === true);
			this.items.push(child);
			this.invalidateMeasure();
		}

		//
		// Append a child at the begining of the box
		//
		prepend(child: Element, resizable: boolean) {
			if (resizable !== undefined)
				Ui.Box.setResizable(child, resizable === true);
			this.items.unshift(child);
			this.invalidateMeasure();
		}
	
		remove(child: Element) {
			let i = 0;
			while ((i < this.items.length) && (this.items[i] !== child)) { i++; }
			if (i < this.items.length) {
				this.items.splice(i, 1);
				if ((child.parent === this) && (child.parent instanceof Container))
					(child.parent as Container).removeChild(child);
				this.invalidateMeasure();
			}
		}

		moveAt(child: Element, position: number) {
			if (position < 0)
				position = this.items.length + position;
			if (position < 0)
				position = 0;
			if (position >= this.items.length)
				position = this.items.length;
			let i = 0;
			while ((i < this.items.length) && (this.items[i] !== child)) { i++; }
			if (i < this.items.length) {
				this.items.splice(i, 1);
				this.items.splice(position, 0, child);
			}
			this.onChildInvalidateMeasure(child, 'move');
		}
	
		insertAt(child: Element, position: number, resizable: boolean) {
			if (resizable !== undefined)
				Ui.Box.setResizable(child, resizable === true);
			position = Math.max(0, Math.min(position, this.items.length));
			this.items.splice(position, 0, child);
			this.invalidateMeasure();
		}

		setContent(content) {
			if (content === undefined)
				this.clear();
			else if (typeof (content) === 'object') {
				if (content.constructor !== Array) {
					content = [content];
				}
				// removed items that disapears
				for (let i = 0; i < this.items.length; i++) {
					let found = false;
					for (let i2 = 0; (found === false) && (i2 < content.length); i2++) {
						found = (this.items[i] === content[i2]);
					}
					if ((found === false) && (this.items[i].parent === this))
						this.removeChild(this.items[i]);
				}
				this.items = content;
				this.invalidateMeasure();
			}
		}

		private onMenuButtonPress() {
			let dialog = new Ui.MenuToolBarPopup();
			let vbox = new Ui.VBox();
			dialog.content = vbox;
			//let flow = new Ui.Flow({ spacing: this.spacing, margin: 10 });
			for (let i = 0; i < this.items.length; i++) {
				let item = this.items[i];
				if (item.parent !== this) {
					vbox.append(item);
					if (i < this.items.length - 1)
						vbox.append(new Ui.MenuPopupSeparator());
				}
			}
			dialog.openElement(this.menuButton, 'bottom');
		}

		clear() {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].parent === this)
					(this.items[i].parent as Container).removeChild(this.items[i]);
			}
			this.items = [];
			this.invalidateMeasure();
		}

		measureCore(width: number, height: number) {
			//		console.log(this+'.measureCore('+width+','+height+')');

			let left = this.getPaddingLeft();
			let right = this.getPaddingRight();
			let top = this.getPaddingTop();
			let bottom = this.getPaddingBottom();
			let constraintWidth = Math.max(0, width - (left + right));
			let constraintHeight = Math.max(0, height - (top + bottom));
			let size; let i;

			//		console.log(this+'.measureCore('+width+','+height+') START');

			this.bg.measure(width, height);

			this.measureLock = true;

			// measure the menu button
			let buttonSize = this.menuButton.measure(0, 0);
		
			let minSizes = [];

			// set all item as graphical childs and get their min sizes
			for (i = 0; i < this.items.length; i++) {
				let item = this.items[i];
				if (item.parent !== this) {
					if ((item.parent != undefined) && (item.parent instanceof Container))
						(item.parent as Container).removeChild(item);
					this.appendChild(item);
				}
				minSizes.push(item.measure(0, 0));
			}
		
			// decide which items will be directly displayed (not in the menu)
			this.keepItems = [];
			let totalWidth = 0;
			let countResizable = 0;
			let maxItemWidth = 0;
			let maxItemHeight = buttonSize.height;
			let minItemsSize = 0;

			i = (this.menuPosition === 'left') ? (i = this.items.length - 1) : 0;
			while ((i >= 0) && (i < this.items.length)) {
				let minSize = minSizes[i];
				if (totalWidth + minSize.width + this.spacing > constraintWidth)
					break;
				totalWidth += minSize.width + this.spacing;
				if (totalWidth + buttonSize.width > constraintWidth)
					break;
				if (this.menuPosition === 'left')
					this.keepItems.unshift(this.items[i]);
				else
					this.keepItems.push(this.items[i]);
				if (Ui.Box.getResizable(this.items[i]))
					countResizable++;
				else {
					minItemsSize += minSize.width;
					if (minSize.height > maxItemHeight)
						maxItemHeight = minSize.height;
				}
				if (minSize.width > maxItemWidth)
					maxItemWidth = minSize.width;
				if (this.menuPosition === 'left')
					i--;
				else
					i++;
			}
			if (totalWidth > 0)
				totalWidth -= this.spacing;
			this.menuNeeded = this.keepItems.length !== this.items.length;

			let constraintSize = constraintWidth;
			if (this.menuNeeded) {
				constraintSize -= buttonSize.width + this.spacing;
				// remove graphical childs that dont fit
				while ((i >= 0) && (i < this.items.length)) {
					this.removeChild(this.items[i]);
					if (this.menuPosition === 'left')
						i--;
					else
						i++;
				}
			}

			// measure using items we keept
			if (this.uniform) {
				// we can respect the uniform constraint
				if ((this.keepItems.length * (maxItemWidth + this.spacing)) - this.spacing <= constraintWidth) {
					for (i = 0; i < this.keepItems.length; i++)
						this.keepItems[i].measure(maxItemWidth, maxItemHeight);
					this.uniformSize = maxItemWidth;
					size = { width: ((this.keepItems.length * (maxItemWidth + this.spacing)) - this.spacing), height: maxItemHeight };
				}
				// we cant respect, do our best, dont care
				else {
					this.uniformSize = undefined;
					size = { width: totalWidth, height: maxItemHeight };
				}
			}
			// measure is not uniform
			else {
				if (countResizable > 0) {
					let remainWidth = constraintSize - minItemsSize - ((this.keepItems.length - 1) * this.spacing);
					let starFound = true;
					let star = remainWidth / countResizable;
					do {
						starFound = true;
						for (i = 0; i < this.keepItems.length; i++) {
							let child = this.keepItems[i];
							if (Ui.Box.getResizable(child)) {
								if (!child.menutoolbarStarDone) {
									size = child.measure(star, constraintHeight);
									if (size.height > maxItemHeight)
										maxItemHeight = size.height;
									if (size.width > star) {
										child.menutoolbarStarDone = true;
										starFound = false;
										remainWidth -= size.width;
										minItemsSize += size.width;
										countResizable--;
										star = remainWidth / countResizable;
										break;
									}
								}
							}
						}
					} while (!starFound);
				
					minItemsSize += this.spacing * (this.keepItems.length - 1);
					if (countResizable > 0) {
						minItemsSize += star * countResizable;
						this.star = star;
					}
					else
						this.star = 0;
					size = { width: minItemsSize, height: maxItemHeight };
				}
				else
					size = { width: totalWidth, height: maxItemHeight };
			}

			if (this.menuNeeded)
				size.width += buttonSize.width + this.spacing;
		
			size.width += left + right;
			size.height += top + bottom;
			this.measureLock = undefined;
			return size;
		}

		arrangeCore(width: number, height: number) {
			this.bg.arrange(0, 0, width, height);

			let left = this.paddingLeft;
			let right = this.paddingRight;
			let top = this.paddingTop;
			let bottom = this.paddingBottom;
			width -= left + right;
			height -= top + bottom;

			let x = left;
			let y = top;
			let first = true;
			if (this.itemsAlign !== 'left')
				x = width - this.measureWidth;
		
			if (this.menuNeeded && (this.menuPosition === 'left')) {
				first = false;
				this.menuButton.arrange(x, y, this.menuButton.measureWidth, height);
				x += this.menuButton.measureWidth;
			}
		
			for (let i = 0; i < this.keepItems.length; i++) {
				let item = this.keepItems[i];
				if (first)
					first = false;
				else
					x += this.spacing;
				let itemWidth;
				if (this.uniform && (this.uniformSize !== undefined))
					itemWidth = this.uniformSize;
				else {
					itemWidth = item.measureWidth;
					if (Ui.Box.getResizable(item) && (itemWidth < this.star))
						itemWidth = this.star;
				}
				item.arrange(x, y, itemWidth, height);
				x += itemWidth;
			}
		
			if (this.menuNeeded && (this.menuPosition !== 'left')) {
				if (first)
					first = false;
				else
					x += this.spacing;
				this.menuButton.arrange(x, y, this.menuButton.measureWidth, height);
			}
		
			if (!this.menuNeeded)
				this.menuButton.drawing.style.visibility = 'hidden';
			else
				this.menuButton.drawing.style.visibility = '';
		}
	
		onChildInvalidateMeasure(child: Element, event) {
			//		console.log('onChildInvalidateMeasure lock ? '+this.measureLock+', isValid ? '+this.measureValid);
			if (this.measureLock !== true)
				super.onChildInvalidateMeasure(child, event);
		}

		onStyleChange() {
			this.bg.fill = this.getStyleProperty('background');
		}

		static style: any = {
			background: 'rgba(250, 250, 250, 0)'
		}
	}
}	
