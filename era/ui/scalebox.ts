namespace Ui
{
	export type ScaleBoxAlign = 'left' | 'right' | 'center';

	export interface ScaleBoxInit extends ContainerInit {
		fixedWidth?: number;
		fixedHeight?: number;
		itemAlign?: ScaleBoxAlign;
		content?: Ui.Element;
	}

	export class ScaleBox extends Container
	{
		private _fixedWidth: number = 400;
		private _fixedHeight: number = 300;
		private _itemAlign: ScaleBoxAlign = 'center';

		constructor(init?: ScaleBoxInit) {
			super(init);
			if (init) {
				if (init.fixedWidth !== undefined)
					this.fixedWidth = init.fixedWidth;
				if (init.fixedHeight !== undefined)
					this.fixedHeight = init.fixedHeight;
				if (init.itemAlign !== undefined)
					this.itemAlign = init.itemAlign;
				if (init.content !== undefined)
					this.content = init.content;	
			}
		}

		setFixedSize(width?: number, height?: number) {
			let changed = false;
			if ((width !== undefined) && (this._fixedWidth !== width)) {
				this._fixedWidth = width;
				changed = true;
			}
			if ((height !== undefined) && (this._fixedHeight !== height)) {
				this._fixedHeight = height;
				changed = true;
			}
			if (changed)
				this.invalidateMeasure();
		}

		set fixedWidth(width: number) {
			this.setFixedSize(width, undefined);
		}

		set fixedHeight(height: number) {
			this.setFixedSize(undefined, height);
		}

		set content(content: Element) {
			this.clear();
			if (content) {
				content.setTransformOrigin(0, 0);
				this.appendChild(content);
			}	
		}

		get itemAlign(): ScaleBoxAlign {
			return this._itemAlign;
		}

		set itemAlign(align: ScaleBoxAlign) {
			if (this._itemAlign != align) {
				this._itemAlign = align;
				this.invalidateArrange();
			}
		}

		protected measureCore(width: number, height: number) {
			let ratio = this._fixedWidth / this._fixedHeight;
			let aratio = width / height;
			let aw, ah;

			if (ratio > aratio) {
				aw = width;
				ah = aw / ratio;
			}
			else {
				ah = height;
				aw = ah * ratio;
			}
			for (let i = 0; i < this.children.length; i++)
				this.children[i].measure(this._fixedWidth, this._fixedHeight);

			return { width: aw, height: ah };
		}

		protected arrangeCore(width: number, height: number) {
			let ratio = this._fixedWidth / this._fixedHeight;
			let aratio = width / height;
			let aw, ah, ax, ay;

			if (ratio > aratio) {
				aw = width;
				ah = aw / ratio;
				ax = 0;
				ay = (height - ah) / 2;
			}
			else {
				ah = height;
				aw = ah * ratio;
				ay = 0;
				if (this._itemAlign == 'left')
					ax = 0;
				else if (this._itemAlign == 'right')
					ax = width - aw;	
				else
					ax = (width - aw) / 2;
			}
			let scale = aw / this._fixedWidth;

			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				child.arrange(0, 0, this._fixedWidth, this._fixedHeight);
				child.transform = Matrix.createTranslate(ax, ay).multiply(Matrix.createScale(scale, scale));
			}
		}
	}
}	

