namespace Ui {
	export type FoldDirection = 'top' | 'bottom' | 'left' | 'right';

	export type FoldMode = 'extend' | 'slide';

	export interface FoldInit extends ContainerInit {
		isFolded?: boolean;
		over?: boolean;
		mode?: FoldMode;
		header?: Element;
		content?: Element;
		background?: Element;
		position?: FoldDirection;
		animDuration?: number;
	}

	export class Fold extends Container {
		private headerBox: LBox;
		private _header: Element;
		private contentBox: LBox;
		private _content: Element;
		private _background: Element;
		private _offset: number  = 0;
		private _position: FoldDirection = 'bottom';
		private _isFolded: boolean = true;
		private _over: boolean = true;
		private _mode: FoldMode = 'extend';
		private clock: Anim.Clock;
		private contentSize: number = 0;
		private _animDuration: number = 0.5;
		readonly folded = new Core.Events<{ target: Fold }>();
		readonly unfolded = new Core.Events<{ target: Fold }>();
		readonly positionchanged = new Core.Events<{ target: Fold, position: FoldDirection }>();
		readonly progress = new Core.Events<{ target: Fold, offset: number }>();

		constructor(init?: FoldInit) {
			super(init);

			this.headerBox = new Ui.LBox();
			this.appendChild(this.headerBox);

			this.contentBox = new Ui.LBox();
			this.appendChild(this.contentBox);
			this.contentBox.hide();
			if (init) {
				if (init.isFolded !== undefined)
					this.isFolded = init.isFolded;
				if (init.over !== undefined)
					this.over = init.over;
				if (init.mode !== undefined)
					this.mode = init.mode;	
				if (init.header !== undefined)
					this.header = init.header;	
				if (init.content !== undefined)
					this.content = init.content;	
				if (init.background !== undefined)
					this.background = init.background;	
				if (init.position !== undefined)
					this.position = init.position;	
				if (init.animDuration !== undefined)
					this.animDuration = init.animDuration;	
			}	
		}

		get isFolded(): boolean {
			return this._isFolded;
		}

		set isFolded(isFolded: boolean) {
			if (this._isFolded != isFolded) {
				this._isFolded = isFolded;
				if (this._isFolded) {
					this.offset = 0;
					this.contentBox.hide();
					this.folded.fire({ target: this });
				}
				else {
					this.offset = 1;
					this.contentBox.show();
					this.unfolded.fire({ target: this });
				}
			}
		}

		//
		// Fold the content part
		//
		fold() {
			if (!this._isFolded) {
				this._isFolded = true;
				this.startAnimation();
				this.folded.fire({ target: this });
			}
		}

		/**
		 * Unfold the content part
		 */
		unfold() {
			if (this._isFolded) {
				this._isFolded = false;
				this.startAnimation();
				this.unfolded.fire({ target: this });
			}
		}

		get over(): boolean {
			return this._over;
		}

		/**
		 * Set true to unfold the content part
		 * without reserving space in the layout (default)
		 * if false, unfolding will "push" existing element
		 */
		set over(over: boolean) {
			if (this._over != over) {
				this._over = over;
				this.stopAnimation();
				this.transform = Matrix.createTranslate(0, 0);
				this.invalidateMeasure();
			}
		}

		get mode(): FoldMode {
			return this._mode;
		}

		/**
		 * If the current fold is in over mode.
		 * Setup what happends when unfolding.
		 * Possibles values: [extend|slide]
		 * extend: the header dont move and the content appear below or right
		 * slide: the header move over or left to let the content appear
		 */
		set mode(mode: FoldMode) {
			if (this._mode != mode) {
				this._mode = mode;
				this.stopAnimation();
				this.invalidateMeasure();
			}
		}

		/**
		 * Return the header element
		 */
		get header(): Element {
			return this._header;
		}

		/**
		 * Set the header element. The header element
		 * correspond to the bar that can be pressed to
		 * set the content visible
		 */
		set header(header: Element) {
			if (header !== this._header) {
				this._header = header;
				this.headerBox.content = this._header;
			}
		}

		/**
		 * Return the content element of the page
		 */
		get content(): Element {
			return this._content;
		}

		/**
		 * Set the content element of the page
		 */
		set content(content: Element) {
			if (this._content !== content) {
				this._content = content;
				this.contentBox.content = this._content;
			}
		}

		/**
		 * Return the background element of the page
		 */
		get background(): Element {
			return this._background;
		}

		/**
		 * Set the background element of the page
		 */
		set background(background: Element) {
			if (this._background !== background) {
				if (this._background !== undefined)
					this.removeChild(this._background);
				this._background = background;
				if (this._background !== undefined)
					this.prependChild(this._background);
			}
		}
	
		/**
		 * Return the position of the content
		 * possibles values: [top|bottom|left|right]
		 * default value: bottom
		 */
		get position(): FoldDirection {
			return this._position;
		}

		/**
		 * Set the position of the content relative to the header
		 * possibles values: [top|bottom|left|right]
		 * default value: right
		 */
		set position(position: FoldDirection) {
			if (this._position != position) {
				this._position = position;
				this.positionchanged.fire({ target: this, position: position });
				this.invalidateMeasure();
			}
		}

		invert() {
			if (this._isFolded)
				this.unfold();
			else
				this.fold();
		}

		get animDuration(): number {
			return this._animDuration;
		}

		set animDuration(duration: number) {
			this._animDuration = duration;
		}

		protected get offset(): number {
			return this._offset;
		}

		protected set offset(offset: number) {
			if (this._offset === offset)
				return;
			this._offset = offset;

			if (!this._over)
				this.invalidateMeasure();
			else {
				if (this._position === 'right') {
					if (this._mode === 'slide')
						this.transform = Matrix.createTranslate(-this._offset * this.contentSize, 0);
					else
						this.transform = Matrix.createTranslate(0, 0);
					this.contentBox.setClipRectangle(0, 0, Math.round(this.contentSize * this._offset), this.layoutHeight);
					if (this._background !== undefined)
						this._background.arrange(0, 0, Math.round(this.headerBox.measureWidth + this.contentSize * this._offset), Math.round(this.layoutHeight));
				}
				else if (this._position === 'left') {
					if (this._mode === 'slide')
						this.transform = Matrix.createTranslate(-this.contentSize + (this._offset * this.contentSize), 0);
					else
						this.transform = Matrix.createTranslate(-this.contentSize, 0);
					this.contentBox.setClipRectangle(Math.round(this.contentSize * (1 - this._offset)), 0, this.contentSize, this.layoutHeight);
					if (this._background !== undefined)
						this._background.arrange(Math.round(this.contentSize * (1 - this._offset)), 0, Math.round(this.headerBox.measureWidth + this.contentSize * this._offset), Math.round(this.layoutHeight));
				}
				else if (this._position === 'top') {
					if (this._mode === 'slide')
						this.transform = Matrix.createTranslate(0, -this.contentSize + (this._offset * this.contentSize));
					else
						this.transform = Matrix.createTranslate(0, -this.contentSize);
					this.contentBox.setClipRectangle(0, Math.round(this.contentSize * (1 - this._offset)), this.layoutWidth, Math.round(this.contentSize * this._offset));
					if (this._background !== undefined)
						this._background.arrange(0, Math.round(this.contentSize * (1 - this._offset)), this.layoutWidth, Math.round(this.headerBox.measureHeight + this.contentSize * this._offset));
				}
				else {
					if (this._mode === 'slide')
						this.transform = Matrix.createTranslate(0, -this._offset * this.contentSize);
					else
						this.transform = Matrix.createTranslate(0, 0);
					this.contentBox.setClipRectangle(0, 0, this.layoutWidth, Math.round(this.contentSize * this._offset));
					if (this._background !== undefined)
						this._background.arrange(0, 0, this.layoutWidth, Math.round(this.headerBox.measureHeight + this.contentSize * this._offset));
				}
			}
		}

		protected startAnimation() {
			if (this.clock !== undefined)
				this.clock.stop();

			if (!this._isFolded)
				this.contentBox.show();

			this.clock = new Anim.Clock({ duration: this._animDuration, target: this });
			this.clock.timeupdate.connect((e) => this.onClockTick(e.target, e.progress));
			this.clock.begin();
		}

		protected stopAnimation() {
			if (this.clock !== undefined) {
				this.clock.stop();
				this.clock = undefined;
			}
		}

		protected onClockTick(clock: Anim.Clock, progress: number) {
			if (this.content === undefined) {
				if (this.clock !== undefined) {
					this.clock.stop();
					this.clock = undefined;
				}
				return;
			}
			let offset = this.offset;
			if (offset > 1)
				this.offset = 1;
			else {
				let destOffset;
				if (this._isFolded)
					destOffset = 0;
				else
					destOffset = 1;
				this.offset = destOffset - ((destOffset - offset) * (1 - progress));
			}
			this.progress.fire({ target: this, offset: this.offset });
			if ((progress == 1) && this._isFolded) {
				this.contentBox.hide();
			}
		}

		/**
		 * Return the required size for the current element
		 */
		protected measureCore(width, height) {
			if (this._background !== undefined)
				this._background.measure(width, height);
			let size = this.headerBox.measure(width, height);
			let contentSize = { width: 0, height: 0 };
			if ((this._position == 'left') || (this._position == 'right')) {
				contentSize = this.contentBox.measure(width - size.width, height);
				if (contentSize.height > size.height)
					size.height = contentSize.height;
				if (!this._over)
					size.width += contentSize.width * this._offset;
				this.contentSize = contentSize.width;
			}
			else {
				contentSize = this.contentBox.measure(width, height - size.height);
				if (contentSize.width > size.width)
					size.width = contentSize.width;
				if (!this._over)
					size.height += contentSize.height * this._offset;
				this.contentSize = contentSize.height;
			}
			return size;
		}

		/**
		 * Arrange children
		 */
		protected arrangeCore(width, height) {
			if (this._position == 'left') {
				if (!this._over)
					this.transform = Matrix.createTranslate(-this.contentSize + (this._offset * this.contentSize), 0);
				this.contentBox.arrange(0, 0, this.contentBox.measureWidth, height);
				this.headerBox.arrange(this.contentBox.measureWidth, 0, this.headerBox.measureWidth, height);
				if (this._background !== undefined)
					this._background.arrange(Math.round(this.contentSize * (1 - this._offset)), 0, Math.round(this.headerBox.measureWidth + this.contentSize * this._offset), Math.round(height));
				this.contentBox.setClipRectangle(Math.round(this.contentSize * (1 - this._offset)), 0, Math.round(this.contentSize * this._offset), Math.round(height));
			}
			else if (this._position == 'right') {
				this.headerBox.arrange(0, 0, this.headerBox.measureWidth, height);
				this.contentBox.arrange(this.headerBox.measureWidth, 0, this.contentBox.measureWidth, height);
				if (this._background !== undefined)
					this._background.arrange(0, 0, Math.round(this.headerBox.measureWidth + this.contentSize * this._offset), Math.round(height));
				this.contentBox.setClipRectangle(0, 0, Math.round(this.contentSize * this._offset), Math.round(height));
			}
			else if (this._position == 'top') {
				if (!this._over)
					this.transform = Matrix.createTranslate(0, -this.contentSize + (this._offset * this.contentSize));
				this.contentBox.arrange(0, 0, width, this.contentBox.measureHeight);
				this.headerBox.arrange(0, this.contentBox.measureHeight, width, this.headerBox.measureHeight);
				if (this._background !== undefined)
					this._background.arrange(0, Math.round(this.contentSize * (1 - this._offset)), width, Math.round(this.headerBox.measureHeight + this.contentSize * this._offset));
				this.contentBox.setClipRectangle(0, Math.round(this.contentSize * (1 - this._offset)), Math.round(width), Math.round(this.contentSize * this._offset));
			}
			else {
				this.headerBox.arrange(0, 0, width, this.headerBox.measureHeight);
				this.contentBox.arrange(0, this.headerBox.measureHeight, width, this.contentBox.measureHeight);
				if (this._background !== undefined)
					this._background.arrange(0, 0, width, Math.round(this.headerBox.measureHeight + this.contentSize * this._offset));
				this.contentBox.setClipRectangle(0, 0, Math.round(width), Math.round(this.contentSize * this._offset));
			}
			this.offset = this._offset;
		}
	}
}	

