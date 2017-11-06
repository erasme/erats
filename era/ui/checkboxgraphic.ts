namespace Ui
{
	export class CheckBoxGraphic extends CanvasElement
	{
		isDown: boolean = false;
		isChecked: boolean = false;
		color: Color = undefined;
		checkColor: Color = undefined;
		activeColor: Color = undefined;
		borderWidth: number = 2;
		radius: number = 3;

		constructor() {
			super();
			this.color = new Ui.Color(1, 1, 1);
			this.activeColor = new Ui.Color(0.31, 0.66, 0.31);
			this.checkColor = new Ui.Color(1, 1, 1);
		}

		getIsDown() {
			return this.isDown;
		}

		setIsDown(isDown) {
			if (this.isDown != isDown) {
				this.isDown = isDown;
				this.invalidateDraw();
			}
		}

		getIsChecked() {
			return this.isChecked;
		}

		setIsChecked(isChecked) {
			if (this.isChecked != isChecked) {
				this.isChecked = isChecked;
				this.invalidateDraw();
			}
		}

		setRadius(radius) {
			if (this.radius !== radius) {
				this.radius = radius;
				this.invalidateDraw();
			}
		}

		getColor() {
			return this.color;
		}

		setColor(color) {
			if (this.color !== color) {
				this.color = Ui.Color.create(color);
				this.invalidateDraw();
			}
		}

		setBorderWidth(borderWidth) {
			if (this.borderWidth !== borderWidth) {
				this.borderWidth = borderWidth;
				this.invalidateDraw();
			}
		}

		setCheckColor(color) {
			if (this.checkColor !== color) {
				this.checkColor = Ui.Color.create(color);
				this.invalidateDraw();
			}
		}

		getCheckColor() {
			let deltaY = 0;
			if (this.getIsDown())
				deltaY = 0.20;
			let yuv = this.checkColor.getYuv();
			return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
		}

		updateCanvas(ctx) {
			let w = this.layoutWidth;
			let h = this.layoutHeight;
			let cx = w / 2;
			let cy = h / 2;

			let radius = Math.min(this.radius, 10);

			// background
			if (this.getIsDown())
				ctx.globalAlpha = 0.8;

			// handle disable
			if (this.isDisabled)
				ctx.globalAlpha = 0.4;

			if (!this.isChecked) {
				// border
				ctx.strokeStyle = this.getColor().getCssRgba();
				ctx.lineWidth = this.borderWidth;
				ctx.beginPath();
				ctx.roundRect(cx - 10 + this.borderWidth / 2, cy - 10 + this.borderWidth / 2, 20 - this.borderWidth, 20 - this.borderWidth, radius, radius, radius, radius);
				ctx.closePath();
				ctx.stroke();
			}
			else {
				// border
				ctx.fillStyle = this.getColor().getCssRgba();
				ctx.beginPath();
				ctx.roundRect(cx - 10, cy - 10, 20, 20, radius, radius, radius, radius);
				ctx.closePath();
				ctx.fill();

				ctx.globalAlpha = 1;

				// icon
				let iconSize = 20;
				let path = Ui.Icon.getPath('check');
				let scale = iconSize / 48;
				// icon
				ctx.save();
				ctx.translate((w - iconSize) / 2, (h - iconSize) / 2);
				ctx.scale(scale, scale);
				ctx.fillStyle = this.getCheckColor().getCssRgba();
				ctx.beginPath();
				ctx.svgPath(path);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		}

		measureCore(width, height) {
			return { width: 30, height: 30 };
		}
	
		onDisable() {
			this.invalidateDraw();
		}

		onEnable() {
			this.invalidateDraw();
		}
	}
}	
