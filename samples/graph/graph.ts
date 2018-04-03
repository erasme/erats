
namespace Graph {

	export interface DonutGraphInit extends Ui.CanvasElementInit {
		data: Array<{ value: number, color: Ui.Color | string }>;
	}

	export class DonutGraph extends Ui.CanvasElement {
		readonly data: Array<{ value: number, color: Ui.Color | string }>;

		constructor(init: DonutGraphInit) {
			super(init);
			this.data = init.data;
		}

		protected updateCanvas(ctx: Ui.CanvasRenderingContext2D) {
			let w = this.layoutWidth;
			let h = this.layoutHeight;
			let r = Math.min(w, h) / 2;

			let total = 0;
			for (let d of this.data)
				total += d.value;

			let startAngle = -Math.PI / 2;
			for (let d of this.data) {
				let angle = (d.value / total) * Math.PI * 2;
				let endAngle = startAngle + angle;
				ctx.fillStyle = Ui.Color.create(d.color).getCssRgba();
				ctx.beginPath();
				let x1 = w / 2 + Math.cos(startAngle) * r;
				let y1 = h / 2 + Math.sin(startAngle) * r;
				ctx.moveTo(x1, y1);
				ctx.arc(w / 2, h / 2, r - 0.5, startAngle, endAngle, false);
				ctx.arc(w / 2, h / 2, r * 0.6 - 0.5, endAngle, startAngle, true);
				ctx.closePath();
				ctx.fill();
				startAngle = endAngle;
			}
		}
	}

	export interface BarGraphInit extends Ui.CanvasElementInit {
		data: Array<number>;
		xAxis: Array<string>;
	}

	export class BarGraph extends Ui.CanvasElement {
		readonly data: Array<number>;
		readonly xAxis: Array<string>;
		protected minY: number = 0;
		protected maxY: number = 0;

		constructor(init: BarGraphInit) {
			super(init);
			this.data = init.data;
			this.xAxis = init.xAxis;

			for (let i = 0; i < this.data.length; i++) {
				let c = this.data[i];
				if ((this.minY === undefined) || (c < this.minY))
					this.minY = c;
				if ((this.maxY === undefined) || (c > this.maxY))
					this.maxY = c;
			}
		}

		protected updateCanvas(ctx: Ui.CanvasRenderingContext2D) {
			let w = this.layoutWidth;
			let h = this.layoutHeight;
			let colW = (w - (40)) / this.xAxis.length;
		
			let tmp = this.maxY;
			let powerLevel = 0;
			while (tmp > 10) {
				tmp /= 10;
				powerLevel++;
			}
			let topY = Math.pow(10, powerLevel + 1);
			if (topY > this.maxY * 2)
				topY /= 2;
			if (topY > this.maxY * 2)
				topY /= 2;
	
			ctx.fillStyle = Ui.Color.create(this.getStyleProperty('foreground')).getCssRgba();
			ctx.font = 'normal 10px Sans-Serif';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
	
			// draw x axis
			ctx.fillRect(40, h - 20, w - (40), 1);
			for (let i = 0; i < this.xAxis.length; i++) {
				let text = this.xAxis[i];
				ctx.fillText(text, 40 + (i * colW) + colW / 2, h - 20 + 4, colW);
				if (i > 0)
					ctx.fillRect(40 + (i * colW), h - 20, 1, 4);
			}
		
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'right';
			// draw y axis
			for (let i = 0; i < 5; i++) {
				let text = (topY * i) / 5;
				ctx.fillText(text.toString(), 40 - 4, (h - 20) - (((h - 40) * i) / 5));
				ctx.globalAlpha = 0.2;
				ctx.fillRect(40, (h - 20) - (((h - 40) * i) / 5), w - (40), 1);
				ctx.globalAlpha = 1;
			}
	
			// draw values
			let barColor = Ui.Color.create(this.getStyleProperty('barColor'));
			let hsl = barColor.getHsl();
			let borderColor = Ui.Color.createFromHsl(hsl.h, Math.min(1, hsl.s + 0.8), Math.max(0, hsl.l - 0.2));
			ctx.fillStyle = barColor.getCssRgba();
			ctx.lineWidth = 1;
			ctx.strokeStyle = borderColor.getCssRgba();
			for (let i = 0; i < this.data.length; i++) {

				ctx.fillStyle = barColor.getCssRgba();

				let cX = Math.round(40 + (colW * i) + colW / 2);
				let cH = Math.round((h - 40) * this.data[i] / topY);
				let cW2 = Math.round(colW / 4);
				let cW = cW2 * 2;
				ctx.fillRect(cX - cW2, 20 + (h - 40) - cH, cW, cH);

				ctx.fillStyle = borderColor.getCssRgba();
				ctx.beginPath();
				ctx.moveTo(cX - cW2, 20 + (h - 40));
				ctx.lineTo(cX - cW2, 20 + (h - 40) - cH);
				ctx.lineTo(cX - cW2 + cW, 20 + (h - 40) - cH);
				ctx.lineTo(cX - cW2 + cW, 20 + (h - 40));

				ctx.lineTo(cX - cW2 + cW - 1, 20 + (h - 40));
				ctx.lineTo(cX - cW2 + cW - 1, 20 + (h - 40) - cH + 1);
				ctx.lineTo(cX - cW2 + 1, 20 + (h - 40) - cH + 1);
				ctx.lineTo(cX - cW2 + 1, 20 + (h - 40));
				ctx.fill();
			}
		}

		protected onStyleChange() {
			this.invalidateDraw();
		}

		static style: any = {
			foreground: '#444444',
			barColor: '#6aa5db'
		}
	}

	export interface LineGraphInit extends Ui.CanvasElementInit {
		data: Array<number>;
		xAxis: Array<string>;
	}

	export class LineGraph extends Ui.CanvasElement {
		data: Array<number>;
		xAxis: Array<string>;
		minY: number = 0;
		maxY: number = 0;

		constructor(init: LineGraphInit) {
			super(init);
			this.data = init.data;
			this.xAxis = init.xAxis;

			for (let i = 0; i < this.data.length; i++) {
				let c = this.data[i];
				if ((this.minY === undefined) || (c < this.minY))
					this.minY = c;
				if ((this.maxY === undefined) || (c > this.maxY))
					this.maxY = c;
			}
		}

		updateCanvas(ctx: Ui.CanvasRenderingContext2D) {
			let w = this.layoutWidth;
			let h = this.layoutHeight;
			let colW = (w - (40)) / this.xAxis.length;
		
			let tmp = this.maxY;
			let powerLevel = 0;
			while (tmp > 10) {
				tmp /= 10;
				powerLevel++;
			}
			let topY = Math.pow(10, powerLevel + 1);
			if (topY > this.maxY * 2)
				topY /= 2;
			if (topY > this.maxY * 2)
				topY /= 2;
	
			ctx.fillStyle = Ui.Color.create(this.getStyleProperty('foreground')).getCssRgba();
			ctx.font = 'normal 10px Sans-Serif';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
	
			// draw x axis
			ctx.fillRect(40, h - 20, w - (40), 1);
			for (let i = 0; i < this.xAxis.length; i++) {
				let text = this.xAxis[i];
				ctx.fillText(text, 40 + (i * colW) + colW / 2, h - 20 + 4, colW);
				if (i > 0)
					ctx.fillRect(40 + (i * colW), h - 20, 1, 4);
			}
		
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'right';
			// draw y axis
			for (let i = 0; i < 5; i++) {
				let text = (topY * i) / 5;
				ctx.fillText(text.toString(), 40 - 4, (h - 20) - (((h - 40) * i) / 5));
				ctx.globalAlpha = 0.2;
				ctx.fillRect(40, (h - 20) - (((h - 40) * i) / 5), w - (40), 1);
				ctx.globalAlpha = 1;
			}
	
			// draw values
			ctx.strokeStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
			ctx.lineWidth = 2;
			ctx.beginPath();
			let lastX = 0; let lastY = 0;
			for (let i = 0; i < this.data.length; i++) {
				let cX = 40 + (colW * i) + colW / 2;
				let cY = h - 20 - (h - 40) * this.data[i] / topY;
				if (i === 0)
					ctx.moveTo(cX, cY);
				else
					ctx.bezierCurveTo(lastX + colW / 2, lastY, cX - colW / 2, cY, cX, cY);
				//ctx.lineTo(cX, cY);
				lastX = cX;
				lastY = cY;
			}
			ctx.stroke();
		}

		protected onStyleChange() {
			this.invalidateDraw();
		}

		static style: any = {
			foreground: '#444444',
			lineColor: '#317fc8'
		}
	}
}
