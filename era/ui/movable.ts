namespace Ui {
	export interface MovableInit extends MovableBaseInit {
		cursor?: string;
	}

	export class Movable extends MovableBase implements MovableInit {
		private contentBox: LBox = undefined;
		private _cursor: string = 'inherit';

		constructor(init?: MovableInit) {
			super(init);
			this.focusable = true;

			this.contentBox = new LBox();
			this.appendChild(this.contentBox);

			this.contentBox.drawing.style.cursor = this._cursor;
			this.connect(this.drawing, 'keydown', this.onKeyDown);
			if (init) {
				if (init.cursor !== undefined)
					this.cursor = init.cursor;	
			}
		}

		set cursor(cursor: string) {
			if (this._cursor != cursor && !this.isDisabled) {
				this._cursor = cursor;
				this.contentBox.drawing.style.cursor = this._cursor;
			}
		}

		protected onKeyDown(event) {
			if (this.isDisabled)
				return;
			let key = event.which;
			// horizontal move
			if (((key == 37) || (key == 39)) && this.moveHorizontal) {
				event.preventDefault();
				event.stopPropagation();
				if (key == 37)
					this.setPosition(this.posX - 10, undefined);
				if (key == 39)
					this.setPosition(this.posX + 10, undefined);
			}
			// vertical move
			if (((key == 38) || (key == 40)) && this.moveVertical) {
				event.preventDefault();
				event.stopPropagation();
				if (key == 38)
					this.setPosition(undefined, this.posY - 10);
				if (key == 40)
					this.setPosition(undefined, this.posY + 10);
			}
		}

		protected onMove(x: number, y: number) {
			this.contentBox.transform = Ui.Matrix.createTranslate(this.posX, this.posY);
		}

		protected measureCore(width: number, height: number) {
			return this.contentBox.measure(width, height);
		}

		protected arrangeCore(width: number, height: number) {
			// we dont want to see this parent but 0px is not possible
			// because Chrome dont handle touch events when the size is 0
			this.drawing.style.width = '1px';
			this.drawing.style.height = '1px';
			this.contentBox.arrange(0, 0, width, height);
		}

		getContent() {
			return this.contentBox.firstChild;
		}

		setContent(content) {
			this.contentBox.content = content;
		}
	
		protected onDisable() {
			this.contentBox.drawing.style.cursor = 'inherit';
		}
	
		protected onEnable() {
			this.contentBox.drawing.style.cursor = this._cursor;
		}
	}
}	
