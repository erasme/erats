namespace Ui
{
	export interface ScaleBoxInit extends ContainerInit {
		fixedWidth?: number;
		fixedHeight?: number;
	}

	export class ScaleBox extends Container
	{
		private _fixedWidth: number = 400;
		private _fixedHeight: number = 300

		constructor(init?: ScaleBoxInit) {
			super(init);
			if (init) {
				if (init.fixedWidth !== undefined)
					this.fixedWidth = init.fixedWidth;
				if (init.fixedHeight !== undefined)
					this.fixedHeight = init.fixedHeight;	
			}
		}

		setFixedSize(width: number, height: number) {
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

		append(child: Element) {
			child.setTransformOrigin(0, 0);
			this.appendChild(child);
		}

		remove(child: Element) {
			this.removeChild(child);
			child.setTransformOrigin(0.5, 0.5);
		}

		set content(content: Element) {
			this.clear();
			this.append(content);
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
				ax = (width - aw) / 2;
			}
			let scale = aw / this._fixedWidth;

			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				child.arrange(ax, ay, this._fixedWidth, this._fixedHeight);
				child.transform = Matrix.createScale(scale, scale);
			}
		}
	}
}	

