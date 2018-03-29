namespace Ui {
	export type SFlowFloat = 'none' | 'left' | 'right';
	export type SFlowFlush = 'flush' | 'flushleft' | 'flushright' | 'newline';
	export type SFlowAlign = 'left' | 'right' | 'center' | 'stretch';

	interface SFlowStateInit {
		width: number;
		render: boolean;
		spacing?: number;
		align?: SFlowAlign;
		uniform?: boolean;
		uniformWidth?: number;
		uniformHeight?: number;
		stretchMaxRatio?: number;
	}

	class SFlowState extends Core.Object {
		x: number = 0;
		y: number = 0;
		width: number = 0;
		height: number = 0;
		xpos: number = 0;
		ypos: number = 0;
		zones: { xstart: number, xend: number }[];
		currentZone: number;
		boxes: { x: number, y: number, width: number, height: number }[];
		lineHeight: number = 0;
		drawCount: number = 0;
		drawCmd: { width: number, height: number, spaceWidth: number, el: Element }[];
		drawWidth: number = 0;
		drawSpaceWidth: number = 0;
		render: boolean = false;
		centerstatus: false;
		spacing: number = 0;
		align: 'left' | 'right' | 'center' | 'stretch' = 'left';
		stretchMaxRatio: number = 1.7;
		uniform: boolean = false;
		uniformWidth: number;
		uniformHeight: number;
		firstLine: boolean = true;
		lastLine: boolean = false;
		stretchUniformWidth: number;

		constructor(init: SFlowStateInit) {
			super();
			this.width = init.width;
			this.render = init.render;
			if (init.spacing !== undefined)
				this.spacing = init.spacing;
			if (init.align !== undefined)
				this.align = init.align;
			if (init.uniform !== undefined)
				this.uniform = init.uniform;
			if (init.uniformWidth !== undefined) {
				this.uniformWidth = init.uniformWidth;
				this.stretchUniformWidth = this.uniformWidth;
			}
			if (init.uniformHeight !== undefined)
				this.uniformHeight = init.uniformHeight;
			if (init.stretchMaxRatio !== undefined)
				this.stretchMaxRatio = init.stretchMaxRatio;
			this.zones = [{ xstart: 0, xend: this.width }];
			this.currentZone = 0;
			this.boxes = [];
			this.drawCmd = [];
		}

		getSize() {
			this.lastLine = true;
			this.flush();
			return { width: this.width, height: this.ypos };
		}

		append(el) {
			var zone; var isstart; var isstartline; var isendline;

			var flushVal = SFlow.getFlush(el);
			if (flushVal === 'flush')
				this.flush();
			else if (flushVal === 'flushleft')
				this.flushLeft();
			else if (flushVal === 'flushright')
				this.flushRight();
			else if (flushVal === 'newline')
				this.nextLine();

			var floatVal = SFlow.getFloat(el);
			if (floatVal === 'none') {
				var size;
				if (this.uniform) {
					size = el.measure(this.uniformWidth, this.uniformHeight);
					size = { width: this.uniformWidth, height: this.uniformHeight };
				}
				else
					size = el.measure(this.width, 0);
				while (true) {
					zone = this.zones[this.currentZone];
					isstart = false;
					if (zone.xstart === this.xpos) isstart = true;
					if ((this.xpos + size.width + ((isstart) ? 0 : this.spacing) <= zone.xend) ||
						(isstart && (zone.xend === this.width) && (size.width >= this.width))) {
						this.pushDraw({ width: size.width, height: size.height, spaceWidth: isstart ? 0 : this.spacing, el: el });
						if (!isstart) this.xpos += this.spacing;
						this.xpos += size.width;
						// enlarge line height if needed
						if (size.height > this.lineHeight) {
							this.lineHeight = size.height;
						}
						break;
					}
					else {
						this.nextZone();
					}
				}
			}
			// insert in the nearest free left part of the screen
			else if (floatVal === 'left') {
				var size = el.measure(this.width, 0);
				while (true) {
					zone = this.zones[this.currentZone];
					isstartline = false;
					if (this.xpos === 0) isstartline = true;
					if (isstartline && ((size.width <= zone.xend - this.xpos) || (zone.xend == this.width && size.width >= this.width))) {
						// draw
						if (this.render)
							el.arrange(this.xpos, this.ypos, size.width, size.height);
						// insert a box to reserve space
						this.insertBox({ x: this.xpos, y: this.ypos, width: size.width, height: size.height });
						break;
					}
					else
						this.nextZone();
				}
			}
			// insert in the nearest free right part of the screen
			else if (floatVal === 'right') {
				var size = el.measure(this.width, 0);
				while (true) {
					zone = this.zones[this.currentZone];
					isendline = false;
					if (this.width == zone.xend) isendline = true;
					if (isendline && ((size.width <= zone.xend - this.xpos) || (this.xpos == 0 && size.width >= this.width))) {
						// draw
						if (this.render)
							el.arrange(zone.xend - size.width, this.ypos, size.width, size.height);
						// insert a box to reserve space
						this.insertBox({ x: zone.xend - size.width, y: this.ypos, width: size.width, height: size.height });
						break;
					}
					else
						this.nextZone();
				}
			}
		}

		flushDraw() {
			if (this.render && (this.drawCmd.length > 0)) {
				var zone = this.zones[this.currentZone];
				var xpos = zone.xstart;
				var widthBonus = 0;
				var itemWidth = 0;
			
				if (this.align === 'right')
					xpos += (zone.xend - zone.xstart) - (this.drawWidth + this.drawSpaceWidth);
				else if (this.align === 'center')
					xpos += Math.floor(((zone.xend - zone.xstart) - (this.drawWidth + this.drawSpaceWidth)) / 2);
				else if (this.align === 'stretch')
					widthBonus = Math.floor(((zone.xend - zone.xstart) - (this.drawWidth + this.drawSpaceWidth)) / this.drawCmd.length);
			
				for (var i = 0; i < this.drawCmd.length; i++) {
					var cmd = this.drawCmd[i];

					if (cmd.width + widthBonus > cmd.width * this.stretchMaxRatio)
						itemWidth = cmd.width * this.stretchMaxRatio;
					else
						itemWidth = cmd.width + widthBonus;

					if (this.uniform && (this.align === 'stretch')) {
						if (this.lastLine && !this.firstLine)
							itemWidth = Math.max(cmd.width, this.stretchUniformWidth);
						else
							this.stretchUniformWidth = itemWidth;
					}
					cmd.el.arrange(xpos + cmd.spaceWidth, this.ypos, itemWidth, this.lineHeight);
					xpos += itemWidth + cmd.spaceWidth;
				}
			}
			this.drawCmd = [];
			this.drawWidth = 0;
			this.drawCount = 0;
			this.drawSpaceWidth = 0;
		}

		pushDraw(cmd) {
			this.drawCmd.push(cmd);
			this.drawCount++;
			this.drawWidth += cmd.width;
			this.drawSpaceWidth += cmd.spaceWidth;
		}

		insertBox(box) {
			this.boxes.push(box);
			this.calculZone();
		}

		calculZone() {
			var zone;
			this.zones = [{ xstart: 0, xend: this.width }];
			for (var i2 = 0; i2 < this.boxes.length; i2++) {
				var box = this.boxes[i2];
				// check if y match
				if ((this.ypos + this.lineHeight < box.y) || (this.ypos >= box.y + box.height)) {
					continue;
				}
				var tmpZones = [];
				for (var i = 0; i < this.zones.length; i++) {
					zone = this.zones[i];
					// check different x split
					if ((box.x <= zone.xstart) && (box.x + box.width < zone.xend))
						tmpZones.push({ xstart: box.x + box.width, xend: zone.xend });
					else if ((box.x < zone.xend) && (box.x + box.width >= zone.xend))
						tmpZones.push({ xstart: zone.xstart, xend: box.x });
					else if ((box.x > zone.xstart) && (box.x + box.width < zone.xend)) {
						tmpZones.push({ xstart: zone.xstart, xend: box.x });
						tmpZones.push({ xstart: box.x + box.width, xend: zone.xend });
					}
					else if ((box.x <= zone.xstart) && (box.x + box.width >= zone.xend)) {
						// no resulting zone
					}
					else {
						// zone not changed by the box
						tmpZones.push({ xstart: zone.xstart, xend: zone.xend });
					}
				}
				this.zones = tmpZones;
			}
			// search the zone we are in now
			for (this.currentZone = 0; this.currentZone < this.zones.length; this.currentZone++) {
				zone = this.zones[this.currentZone];
				if ((this.xpos >= zone.xstart) && (this.xpos <= zone.xend)) {
					break;
				}
			}
			// we are in no zone
			if (this.currentZone >= this.zones.length) {
				this.currentZone = -1;
				// look for the first available zone after xpos
				for (this.currentZone = 0; this.currentZone < this.zones.length; this.currentZone++) {
					zone = this.zones[this.currentZone];
					if (zone.xstart >= this.xpos) {
						this.xpos = zone.xstart;
						break;
					}
				}
				// we dont found a correct zone, jump to next line
				if (this.currentZone >= this.zones.length) {
					this.xpos = 0;
					this.nextLine();
				}
			}
		}

		flush() {
			// if some draw command have not been done, flush the current line
			if (this.drawCount !== 0) this.nextLine();
			while (true) {
				var zone = this.zones[this.currentZone];
				if ((zone.xstart === 0) && (zone.xend === this.width))
					break;
				else
					this.nextZone();
			}
		}

		flushLeft() {
			// if some draw command have not been done, flush the current line
			if (this.drawCount !== 0) this.nextLine();
			while (true) {
				var zone = this.zones[this.currentZone];
				if (zone.xstart === 0)
					break;
				else
					this.nextZone();
			}
		}

		flushRight() {
			// if some draw command have not been done, flush the current line
			if (this.drawCount !== 0) this.nextLine();
			while (true) {
				var zone = this.zones[this.currentZone];
				if (zone.xend === this.width)
					break;
				else
					this.nextZone();
			}
		}

		nextLine() {
			this.flushDraw();
			do {
				// start by ending this line
				if (this.lineHeight > 0) {
					this.ypos += this.lineHeight + this.spacing;
					this.lineHeight = 0;
					this.calculZone();
				}
				// find the next position that is going
				// to provide a new set of zones
				else if (this.boxes.length > 0) {
					var nexty = Number.MAX_VALUE;
					for (var i = 0; i < this.boxes.length; i++) {
						var box = this.boxes[i];
						if ((this.ypos < box.y + box.height) && (nexty > box.y + box.height))
							nexty = box.y + box.height;
					}
					if (nexty !== Number.MAX_VALUE)
						this.ypos = nexty + this.spacing;
					this.calculZone();
				}
			} while (this.zones.length === 0);
			this.currentZone = 0;
			this.xpos = this.zones[0].xstart;
			this.firstLine = false;
		}
		
		nextZone() {
			this.flushDraw();
			// last zone, go next line
			if (this.currentZone >= this.zones.length - 1) {
				//			console.log('nextZone will call nextLine');
				this.nextLine();
			}
			else {
				this.currentZone++;
				this.xpos = this.zones[this.currentZone].xstart;
			}
		}
	}

	export interface SFlowInit extends ContainerInit {
		content?: Element[] | undefined;
		spacing?: number;
		itemAlign?: SFlowAlign;
		uniform?: boolean;
		uniformRatio?: number;
		stretchMaxRatio?: number;
	}

	export class SFlow extends Container implements SFlowInit {
		private _uniform: boolean = false;
		private _uniformRatio: number;
		private _uniformWidth: number;
		private _uniformHeight: number;
		private _itemAlign: SFlowAlign = 'left';
		private _stretchMaxRatio: number = 1.3;
		private _spacing: number = 0;

		constructor(init?: SFlowInit) {
			super(init);
			if (init) {
				if (init.content !== undefined)
					this.content = init.content;	
				if (init.spacing !== undefined)
					this.spacing = init.spacing;	
				if (init.itemAlign !== undefined)
					this.itemAlign = init.itemAlign;	
				if (init.uniform !== undefined)
					this.uniform = init.uniform;	
				if (init.uniformRatio !== undefined)
					this.uniformRatio = init.uniformRatio;	
				if (init.stretchMaxRatio !== undefined)
					this.stretchMaxRatio = init.stretchMaxRatio;	
			}
		}

		//
		// Replace all item by the given one or the
		// array of given items
		//
		set content(content: Element[] | undefined) {
			while (this.firstChild !== undefined)
				this.removeChild(this.firstChild);
			if ((content != undefined) && (typeof (content) === 'object')) {
				for (var i = 0; i < content.length; i++)
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
		// Return item horizontal alignment [left|right|center|stretch]
		//
		get itemAlign(): SFlowAlign {
			return this._itemAlign;
		}
	
		//
		// Choose howto horizontaly align items [left|right|center|stretch]
		//
		set itemAlign(itemAlign: SFlowAlign) {
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

		get uniformRatio(): number {
			return this._uniformRatio;
		}

		set uniformRatio(uniformRatio: number) {
			if (this._uniformRatio != uniformRatio) {
				this._uniformRatio = uniformRatio;
				this.invalidateMeasure();
			}
		}

		//
		// If itemAlign is stretch, return the maximum
		// size ratio allowed for stretching before
		// giving up
		//
		get stretchMaxRatio(): number {
			return this._stretchMaxRatio;
		}

		//
		// If itemAlign is stretch, set the maximum
		// size ratio allowed for stretching before
		// giving up and keeping the original size
		///
		set stretchMaxRatio(stretchMaxRatio: number) {
			if (this._stretchMaxRatio != stretchMaxRatio) {
				this._stretchMaxRatio = stretchMaxRatio;
				this.invalidateMeasure();
			}
		}

		//
		// Append a child at the end of the flow
		//
		append(child: Element, floatVal?: SFlowFloat, flushVal?: SFlowFlush) {
			this.appendChild(child);
			if (floatVal !== undefined)
				SFlow.setFloat(child, floatVal);
			if (flushVal !== undefined)
				SFlow.setFlush(child, flushVal);
		}

		//
		// Append a child at the begining of the flow
		//
		prepend(child: Element, floatVal?: SFlowFloat, flushVal?: SFlowFlush) {
			this.prependChild(child);
			if (floatVal !== undefined)
				SFlow.setFloat(child, floatVal);
			if (flushVal !== undefined)
				SFlow.setFlush(child, flushVal);
		}

		//
		// Append a child at the given position
		//
		insertAt(child: Element, position: number, floatVal?: SFlowFloat, flushVal?: SFlowFlush) {
			this.insertChildAt(child, position);
			if (floatVal !== undefined)
				SFlow.setFloat(child, floatVal);
			if (flushVal !== undefined)
				SFlow.setFlush(child, flushVal);
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

		protected measureCore(width: number, height: number) {

			if (this.children.length === 0)
				return { width: 0, height: 0 };
		
			// a first pass for uniform measure
			if (this._uniform) {
				this._uniformWidth = 0;
				this._uniformHeight = 0;
				for (var i = 0; i < this.children.length; i++) {
					var child = this.children[i];
					var childSize = child.measure(width, height);
					if (childSize.width > this._uniformWidth)
						this._uniformWidth = childSize.width;
					if (childSize.height > this._uniformHeight)
						this._uniformHeight = childSize.height;
				}
				if (this._uniformRatio !== undefined) {
					var aratio = this._uniformWidth / this._uniformHeight;
					var aw, ah;

					if (this._uniformRatio < aratio) {
						aw = this._uniformWidth;
						ah = aw / this._uniformRatio;
					}
					else {
						ah = this._uniformHeight;
						aw = ah * this._uniformRatio;
					}
					this._uniformWidth = aw;
					this._uniformHeight = ah;
				}
			}

			var state = new SFlowState({
				width: width, render: false, spacing: this._spacing,
				align: this.itemAlign, uniform: this._uniform,
				uniformWidth: this._uniformWidth, uniformHeight: this._uniformHeight,
				stretchMaxRatio: this._stretchMaxRatio
			});
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children[i];
				if (!child.isCollapsed)
					state.append(child);
			}
			return state.getSize();
		}

		protected arrangeCore(width: number, height: number) {
			var state = new SFlowState({
				width: width, render: true, spacing: this._spacing,
				align: this.itemAlign, uniform: this._uniform,
				uniformWidth: this._uniformWidth, uniformHeight: this._uniformHeight,
				stretchMaxRatio: this._stretchMaxRatio
			});
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children[i];
				if (!child.isCollapsed)
					state.append(child);
			}
			state.getSize();
		}

		static getFloat(child: Element): SFlowFloat {
			return child['Ui.SFlow.float'] ? child['Ui.SFlow.float'] : 'none';
		}

		static setFloat(child: Element, floatVal: SFlowFloat) {
			if (SFlow.getFloat(child) !== floatVal) {
				child['Ui.SFlow.float'] = floatVal;
				child.invalidateMeasure();
			}
		}

		static getFlush(child: Element): SFlowFlush {
			return child['Ui.SFlow.flush'] ? child['Ui.SFlow.flush'] : 'none';
		}

		static setFlush(child: Element, flushVal: SFlowFlush) {
			if (SFlow.getFlush(child) !== flushVal) {
				child['Ui.SFlow.flush'] = flushVal;
				child.invalidateMeasure();
			}
		}
	}
}	

