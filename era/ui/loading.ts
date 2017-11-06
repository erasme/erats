namespace Ui
{
	export interface LoadingInit extends CanvasElement {
	}

	export class Loading extends CanvasElement implements LoadingInit
	{
		private clock: Anim.Clock = undefined;
		private ease: Anim.EasingFunction = undefined;

		constructor(init?: Partial<LoadingInit>) {
			super();
			this.ease = new Anim.PowerEase({ mode: 'inout' });
			this.clock = new Anim.Clock({ repeat: 'forever', duration: 2 });
			this.connect(this.clock, 'timeupdate', this.invalidateDraw);
			if (init)
				this.assign(init);
		}

		protected onVisible() {
			super.onVisible();
			this.clock.begin();
		}

		protected onHidden() {
			super.onHidden();
			this.clock.stop();
		}

		protected updateCanvas(ctx) {
			let p = this.clock.progress;
			if (p === undefined)
				p = 0;
			let p2 = (p > 0.8) ? (1 - ((p - 0.8) * 5)) : (p / 0.8);

			let w = this.layoutWidth;
			let h = this.layoutHeight;
			let x = w / 2;
			let y = h / 2;
			let lineWidth = Math.max(2, Math.min(5, Math.min(w, h) * 5 / 60));
			let radius = ((Math.min(w, h) - lineWidth) / 2) - 5;
			let startAngle = Math.PI * 2 * p;
			if (p > 0.8)
				startAngle = Math.PI * 2 * p - (Math.PI * 2 * 5 * this.ease.ease(p2) / 6);
			let endAngle = startAngle + (Math.PI / 4) + (Math.PI * 2 * 5 * this.ease.ease(p2) / 6);

			ctx.strokeStyle = this.getStyleProperty('color').getCssRgba();
			ctx.beginPath();
			ctx.arc(x, y, radius, startAngle, endAngle, false);
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		}

		protected measureCore(width: number, height: number) {
			return { width: 30, height: 30 };
		}

		static style: object = {
			color: new Ui.Color(0.27, 0.52, 0.9)
		}
	}
}	

