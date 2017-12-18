namespace Ui
{
	export interface ShadowInit extends CanvasElementInit {
		color?: Color | string;
		inner?: boolean;
		shadowWidth?: number;
		radius?: number;
		radiusTopLeft?: number;
		radiusTopRight?: number;
		radiusBottomLeft?: number;
		radiusBottomRight?: number;
	}

	export class Shadow extends CanvasElement implements ShadowInit
	{
		private _radiusTopLeft: number = 0;
		private _radiusTopRight: number = 0;
		private _radiusBottomLeft: number = 0;
		private _radiusBottomRight: number = 0;
		private _shadowWidth: number = 4;
		private _inner: boolean = false;
		private _color: Color = Color.create('black');

		constructor(init?: ShadowInit) {
			super(init);
			if (init) {
				if (init.color !== undefined)
					this.color = init.color;	
				if (init.inner !== undefined)
					this.inner = init.inner;	
				if (init.shadowWidth !== undefined)
					this.shadowWidth = init.shadowWidth;	
				if (init.radius !== undefined)
					this.radius = init.radius;	
				if (init.radiusTopLeft !== undefined)
					this.radiusTopLeft = init.radiusTopLeft;	
				if (init.radiusTopRight !== undefined)
					this.radiusTopRight = init.radiusTopRight;	
				if (init.radiusBottomLeft !== undefined)
					this.radiusBottomLeft = init.radiusBottomLeft;	
				if (init.radiusBottomRight !== undefined)
					this.radiusBottomRight = init.radiusBottomRight;
			}
		}

		set color(color: Color | string) {
			if (this._color != color) {
				this._color = Ui.Color.create(color);
				this.invalidateDraw();
			}
		}

		get inner(): boolean {
			return this._inner;
		}

		set inner(inner: boolean) {
			if (this._inner != inner) {
				this._inner = inner;
				this.invalidateDraw();
			}
		}

		set shadowWidth(shadowWidth: number) {
			if (this._shadowWidth != shadowWidth) {
				this._shadowWidth = shadowWidth;
				this.invalidateDraw();
			}
		}

		get shadowWidth(): number {
			return this._shadowWidth;
		}

		set radius(radius: number) {
			this._radiusTopLeft = radius;
			this._radiusTopRight = radius;
			this._radiusBottomLeft = radius;
			this._radiusBottomRight = radius;
			this.invalidateDraw();
		}

		get radiusTopLeft(): number {
			return this._radiusTopLeft;
		}

		set radiusTopLeft(radiusTopLeft: number) {
			if (this._radiusTopLeft != radiusTopLeft) {
				this._radiusTopLeft = radiusTopLeft;
				this.invalidateDraw();
			}
		}

		get radiusTopRight():number {
			return this._radiusTopRight;
		}

		set radiusTopRight(radiusTopRight: number) {
			if (this._radiusTopRight != radiusTopRight) {
				this._radiusTopRight = radiusTopRight;
				this.invalidateDraw();
			}
		}

		get radiusBottomLeft(): number {
			return this._radiusBottomLeft;
		}

		set radiusBottomLeft(radiusBottomLeft: number) {
			if (this._radiusBottomLeft != radiusBottomLeft) {
				this._radiusBottomLeft = radiusBottomLeft;
				this.invalidateDraw();
			}
		}

		get radiusBottomRight(): number {
			return this._radiusBottomRight;
		}

		set radiusBottomRight(radiusBottomRight: number) {
			if (this._radiusBottomRight != radiusBottomRight) {
				this._radiusBottomRight = radiusBottomRight;
				this.invalidateDraw();
			}
		}

		protected updateCanvas(ctx) {
			let width = this.layoutWidth;
			let height = this.layoutHeight;

			for (let i = 0; i < this._shadowWidth; i++) {
				let rgba = this._color.getRgba();
				let opacity;
				if (this._inner) {
					if (this._shadowWidth == 1)
						opacity = 1;
					else {
						let x = (i + 1) / this._shadowWidth;
						opacity = x * x;
					}
				}
				else
					opacity = (i + 1) / (this._shadowWidth + 1);

				let color = new Ui.Color(rgba.r, rgba.g, rgba.b, rgba.a * opacity);
				ctx.fillStyle = color.getCssRgba();

				if (this._inner) {
					ctx.beginPath();
					ctx.roundRect(0, 0, width, height,
						this._radiusTopLeft, this._radiusTopRight, this._radiusBottomRight, this._radiusBottomLeft);
					ctx.roundRect(this._shadowWidth - i, this._shadowWidth - i, width - ((this._shadowWidth - i) * 2), height - ((this._shadowWidth - i) * 2),
						this._radiusTopLeft, this._radiusTopRight, this._radiusBottomRight, this._radiusBottomLeft, true);
					ctx.closePath();
					ctx.fill();
				}
				else {
					ctx.beginPath();
					ctx.roundRect(i, i, width - i * 2, height - i * 2,
						this._radiusTopLeft, this._radiusTopRight, this._radiusBottomRight, this._radiusBottomLeft);
					ctx.closePath();
					ctx.fill();
				}
			}
		}
	}
}	

