namespace Ui {
	export interface PanedInit extends ContainerInit {
		orientation?: Orientation;
		pos?: number;
		content1?: Element;
		content2?: Element;
	}

	export class Paned extends Container implements PanedInit {
		private vertical: boolean = true;
		private cursor: Movable;
		private content1Box: LBox;
		private _content1: Element;
		private minContent1Size: number = 0;
		private content2Box: LBox;
		private _content2: Element;
		private minContent2Size: number = 0;
		private _pos: number = 0.5;
		readonly changed = new Core.Events<{ target: Paned, position: number }>();

		constructor(init?: PanedInit) {
			super(init);
	
			this.content1Box = new Ui.LBox();
			this.appendChild(this.content1Box);

			this.content2Box = new Ui.LBox();
			this.appendChild(this.content2Box);

			this.cursor = new Ui.Movable();
			this.appendChild(this.cursor);

			this.cursor.setContent(new Ui.VPanedCursor());
			this.cursor.moved.connect(() => this.onCursorMove());
			if (init) {
				if (init.orientation !== undefined)
					this.orientation = init.orientation;
				if (init.pos !== undefined)
					this.pos = init.pos;	
				if (init.content1 !== undefined)
					this.content1 = init.content1;	
				if (init.content2 !== undefined)
					this.content2 = init.content2;	
			}
		}

		//
		// Get the layout orientation.
		// Possible values: [vertical|horizontal|
		//
		get orientation(): Orientation {
			if (this.vertical)
				return 'vertical';
			else
				return 'horizontal';
		}

		//
		// Set the layout orientation.
		// Possible values: [vertical|horizontal|
		//
		set orientation(orientation: Orientation) {
			var vertical = true;
			if (orientation != 'vertical')
				vertical = false;
			if (this.vertical != vertical) {
				this.vertical = vertical;
				if (this.vertical)
					this.cursor.setContent(new Ui.VPanedCursor());
				else
					this.cursor.setContent(new Ui.HPanedCursor());
				this.invalidateMeasure();
			}
		}

		get pos(): number {
			return this._pos;
		}
	
		set pos(pos: number) {
			this._pos = pos;
			this.invalidateMeasure();
		}

		get content1(): Element {
			return this._content1;
		}

		set content1(content1: Element) {
			if (this._content1 !== content1) {
				if (this._content1 !== undefined)
					this.content1Box.remove(this._content1);
				this._content1 = content1;
				if (this._content1 !== undefined)
					this.content1Box.append(this._content1);
			}
		}

		get content2(): Element {
			return this._content2;
		}

		set content2(content2: Element) {
			if (this._content2 !== content2) {
				if (this._content2 !== undefined)
					this.content2Box.remove(this._content2);
				this._content2 = content2;
				if (this._content2 !== undefined)
					this.content2Box.append(this._content2);
			}
		}

		invert() {
			var tmp;
			tmp = this.content1Box;
			this.content1Box = this.content2Box;
			this.content2Box = tmp;

			tmp = this._content1;
			this._content1 = this._content2;
			this._content2 = tmp;

			this._pos = 1 - this._pos;
			this.invalidateArrange();
		}

		protected onCursorMove = () => {
			this.cursor.moved.disconnect(this.onCursorMove);
			var p;
			var aSize;
			if (this.vertical) {
				p = this.cursor.positionY;
				aSize = this.layoutHeight - this.cursor.layoutHeight;
			}
			else {
				p = this.cursor.positionX;
				aSize = this.layoutWidth - this.cursor.layoutWidth;
			}

			this._pos = p / aSize;

			if (aSize * this._pos < this.minContent1Size)
				this._pos = this.minContent1Size / aSize;
			if (aSize * (1 - this._pos) < this.minContent2Size)
				this._pos = 1 - (this.minContent2Size / aSize);
			p = this._pos * aSize;

			if (p < 0)
				p = 0;
			if (p > aSize)
				p = aSize;

			if (this.vertical)
				this.cursor.setPosition(0, p);
			else
				this.cursor.setPosition(p, 0);

			this.invalidateMeasure();
			this.cursor.moved.connect(this.onCursorMove);
			this.changed.fire({ target: this, position: this._pos });
		}

		protected measureCore(width: number, height: number) {
			var cursorSize; var content1Size; var content2Size;
			if (this.vertical) {
				cursorSize = this.cursor.measure(width, 0);

				this.minContent1Size = this.content1Box.measure(width, 0).height;
				this.minContent2Size = this.content2Box.measure(width, 0).height;

				content1Size = this.content1Box.measure(width, (height - cursorSize.height) * this._pos);
				content2Size = this.content2Box.measure(width, (height - cursorSize.height) * (1 - this._pos));

				return { width: Math.max(cursorSize.width, Math.max(content1Size.width, content2Size.width)), height: content1Size.height + cursorSize.height + content2Size.height };
			}
			else {
				cursorSize = this.cursor.measure(0, height);

				this.minContent1Size = this.content1Box.measure(0, 0).width;
				this.minContent2Size = this.content2Box.measure(0, 0).width;

				content1Size = this.content1Box.measure((width - cursorSize.width) * this._pos, height);
				content2Size = this.content2Box.measure((width - cursorSize.width) * (1 - this._pos), height);

				return { width: content1Size.width + cursorSize.width + content2Size.width, height: Math.max(cursorSize.height, Math.max(content1Size.height, content2Size.height)) };
			}
		}

		protected arrangeCore(width: number, height: number) {
			if (this.vertical) {
				var cHeight = this.cursor.measureHeight;
				var aHeight = height - cHeight;

				this.cursor.arrange(0, 0, width, cHeight);
				this.cursor.setPosition(0, aHeight * this._pos);

				this.content1Box.arrange(0, 0, width, aHeight * this._pos);
				this.content2Box.arrange(0, (aHeight * this._pos) + cHeight, width, aHeight * (1 - this._pos));
			}
			else {
				var cWidth = this.cursor.measureWidth;
				var aWidth = width - cWidth;

				this.content1Box.arrange(0, 0, aWidth * this._pos, height);
				this.cursor.arrange(0, 0, cWidth, height);
				this.cursor.setPosition(aWidth * this._pos, 0);
				this.content2Box.arrange((aWidth * this._pos) + cWidth, 0, aWidth * (1 - this._pos), height);
			}
		}
	}


	export interface VPanedInit extends PanedInit { }

	export class VPaned extends Paned {
		constructor(init?: VPanedInit) {
			super(init);
			this.orientation = 'vertical';
		}
	}

	export interface HPanedInit extends PanedInit { }

	export class HPaned extends Paned {
		constructor(init?: HPanedInit) {
			super(init);
			this.orientation = 'horizontal';
		}
	}

	export class HPanedCursor extends LBox {
		constructor() {
			super();
			this.append(new Ui.Rectangle({ fill: new Ui.Color(0, 0, 0, 0.05) }));
			this.append(new Ui.Rectangle({ fill: 'rgba(140,140,140,1)', width: 1, margin: 5, marginRight: 10, height: 30, verticalAlign: 'center' }));
			this.append(new Ui.Rectangle({ fill: 'rgba(140,140,140,1)', width: 1, margin: 5, marginLeft: 10, height: 30, verticalAlign: 'center' }));
			this.append(new Ui.Frame({ frameWidth: 1, fill: 'rgba(140,140,140,1)' }));
		}
	}

	export class VPanedCursor extends LBox {
		constructor() {
			super();
			this.append(new Ui.Rectangle({ fill: 'rgba(250,250,250,1)' }));
			this.append(new Ui.Rectangle({ fill: 'rgba(140,140,140,1)', height: 1, margin: 5, marginTop: 10, width: 30, horizontalAlign: 'center' }));
			this.append(new Ui.Rectangle({ fill: 'rgba(140,140,140,1)', height: 1, margin: 5, marginBottom: 10, width: 30, horizontalAlign: 'center' }));
			this.append(new Ui.Frame({ frameWidth: 1, radius: 0, fill: 'rgba(140,140,140,1)' }));
		}
	}
}	
