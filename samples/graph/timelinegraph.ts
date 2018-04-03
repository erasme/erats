
namespace Graph {

	export interface TimeLineGraphInit extends Ui.CanvasElementInit {
		data?: Array<any>;
		startTime?: Date;
		endTime?: Date;
		maxY?: number;
		unit?: 'none' | 'bps' | 'percent' | 'seconds';
		mode?: 'diff' | 'normal';
	}

	export class TimeLineGraph extends Ui.CanvasElement {
		data = new Array<{ name: string, data: Array<{time: Date, value: any}>, color?: Ui.Color | string }>();
		minY: number = 0;
		maxY: number = 0;
		startTime: Date;
		endTime: Date;
		unit: 'none' | 'bps' | 'percent' | 'seconds' = 'none';
		mode: 'diff' | 'normal' = 'normal';
		private transformWatcher: Ui.TransformableWatcher;

		constructor(init: TimeLineGraphInit) {
			super(init);
			if (init.data != undefined)
				this.data = init.data;
			if (init.startTime != undefined)
				this.startTime = init.startTime;
			else
				this.startTime = new Date();	
			if (init.endTime != undefined)
				this.endTime = init.endTime;
			else
				this.endTime = new Date();
			if (init.unit != undefined)
				this.unit = init.unit;
			if (init.mode != undefined)
				this.mode = init.mode;

			if (this.mode === 'diff') {
				for (let d = 0; d < this.data.length; d++) {
					let data = this.data[d].data;
					let lastV = data[0].value;
					let lastT = data[0].time;
					for (let i = 1; i < data.length; i++) {
						let c = (data[i].value - lastV) / ((data[i].time.getTime() - lastT.getTime()) / 1000);
						if ((this.minY === undefined) || (c < this.minY))
							this.minY = c;
						if ((this.maxY === undefined) || (c > this.maxY))
							this.maxY = c;
						lastV = data[i].value;
						lastT = data[i].time;
					}
				}
			}
			else {
				for (let d = 0; d < this.data.length; d++) {
					let data = this.data[d].data;
					for (let i = 0; i < data.length; i++) {
						let c = data[i].value;
						if ((this.minY === undefined) || (c < this.minY))
							this.minY = c;
						if ((this.maxY === undefined) || (c > this.maxY))
							this.maxY = c;
					}
				}
			}

			this.minY = 0;
			if (init.maxY != undefined)
				this.maxY = init.maxY;

			if (this.maxY === 0)
				this.maxY = 1;
			
			this.transformWatcher = new Ui.TransformableWatcher({
				element: this,
				allowTranslate: true,
				allowRotate: false,
				minScale: 0.0001,
				maxScale: 100,
				inertia: true,
				transform: () => this.onContentTransform()
			});

			this.setTransformOrigin(1, 0);
		}

		zeroPad(val: number, size: number = 2) {
			let s = val.toString();
			while (s.length < size) {
				s = "0" + s;
			}
			return s;
		}

		formatBps(value: number) {
			let res;
			if (value === 0)
				res = '0';
			else if (value > 1000000000)
				res = Math.round(value / 1000000000) + ' Gb/s';
			else if (value > 1000000)
				res = Math.round(value / 1000000) + ' Mb/s';
			else if (value > 1000)
				res = Math.round(value / 1000) + ' kb/s';
			else
				res = value + ' b/s';
			return res;
		}

		formatSeconds(value: number) {
			let res;
			if (value === 0)
				res = '0';
			else if (value > 3600 * 24)
				res = Math.round(value / 3600 * 24) + ' d';
			else if (value > 3600)
				res = Math.round(value / 3600) + ' h';
			else if (value > 60)
				res = Math.round(value / 60) + ' min';
			else if (value > 1)
				res = value + ' s';
			else if (value > 0.001)
				res = Math.round(value * 1000) + ' ms';
			else
				res = Math.round(value * 1000000) + ' μs';
			return res;
		}

		formatPercent(value: number) {
			let res;
			return Math.round(value * 100) + ' %';
		}

		formatUnit(value: number) {
			if (this.unit === 'bps')
				return this.formatBps(value);
			else if (this.unit === 'percent')
				return this.formatPercent(value);
			else if (this.unit === 'seconds')
				return this.formatSeconds(value);
			else
				return value;
		}

		formatMonth(month: number) {
			return ['jan', 'fev', 'mars', 'avril', 'mai', 'juin', 'juil',
				'aout', 'sept', 'oct', 'nov', 'dec'][month];
		}

		formatFullMonth(month: number) {
			return ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
				'aout', 'septembre', 'octobre', 'novembre', 'décembre'][month];
		}

		formatWeekDay(day: number) {
			return ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'][day];
		}

		yearRound(date: Date) {
			return new Date(date.getFullYear(), 0, 1, 0);
		}

		monthRound(date: Date) {
			return new Date(date.getFullYear(), date.getMonth(), 1, 0);
		}

		dayRound(date: Date) {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
		}

		hourRound(date: Date, hours: number) {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(date.getHours() / hours) * hours);
		}
	
		protected onContentTransform() {
			let scale = this.transformWatcher.scale;
			this.transformWatcher.translateY = 0;
			//console.log(this + '.onContentTransform scale: ' + scale + ', translateX: ' + this.translateX);
			this.invalidateDraw();
		}

		protected updateCanvas(ctx: Ui.CanvasRenderingContext2D) {
			let w = this.layoutWidth;
			let h = this.layoutHeight;
		
			let powerLevel = Math.ceil((Math as any).log10(this.maxY));
			let topY = Math.pow(10, powerLevel);
			if (topY > this.maxY * 2)
				topY /= 2;
			if (topY > this.maxY * 2)
				topY /= 2;
			if (topY > this.maxY * 2)
				topY /= 2;

			ctx.textBaseline = 'middle';
			ctx.textAlign = 'right';
			// draw y axis
			for (let i = 0; i <= 5; i++) {
				let text = this.formatUnit((topY * i) / 5);
				ctx.fillText(text.toString(), 60 - 4, (h - 25) - (((h - 45) * i) / 5));
				ctx.globalAlpha = (i === 0) ? 1 : 0.2;
				ctx.fillRect(60, (h - 25) - (((h - 45) * i) / 5), w - (40), 1);
				ctx.globalAlpha = 1;
			}

			let deltaTime = (this.endTime.getTime() - this.startTime.getTime()) / this.transformWatcher.scale;
			let endTime = new Date(this.endTime.getTime() - (this.transformWatcher.translateX * (deltaTime / (w - 60))));
			//		console.log('this.endTime: '+this.endTime+', endTime: '+endTime+', ms/pix: '+(deltaTime / (w - 60)));
			let startTime = new Date(endTime.getTime() - deltaTime);

			ctx.fillStyle = Ui.Color.create(this.getStyleProperty('foreground')).getCssRgba();
			ctx.font = 'normal 10px Sans-Serif';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
	
			// draw x axis
			deltaTime = endTime.getTime() - startTime.getTime();
			let nbXMarks = Math.round((w - 60) / 50);
			let deltaMarkTime = deltaTime / nbXMarks;
		
			if (deltaMarkTime <= 60 * 1000)
				deltaMarkTime = 60 * 1000;
			else if (deltaMarkTime <= 2 * 60 * 1000)
				deltaMarkTime = 2 * 60 * 1000;
			else if (deltaMarkTime <= 5 * 60 * 1000)
				deltaMarkTime = 5 * 60 * 1000;
			else if (deltaMarkTime <= 10 * 60 * 1000)
				deltaMarkTime = 10 * 60 * 1000;
			else if (deltaMarkTime <= 30 * 60 * 1000)
				deltaMarkTime = 30 * 60 * 1000;
			else if (deltaMarkTime <= 60 * 60 * 1000)
				deltaMarkTime = 60 * 60 * 1000;
			else if (deltaMarkTime <= 2 * 60 * 60 * 1000)
				deltaMarkTime = 2 * 60 * 60 * 1000;
			else if (deltaMarkTime <= 6 * 60 * 60 * 1000)
				deltaMarkTime = 6 * 60 * 60 * 1000;
			else if (deltaMarkTime <= 12 * 60 * 60 * 1000)
				deltaMarkTime = 12 * 60 * 60 * 1000;
			else if (deltaMarkTime <= 24 * 60 * 60 * 1000)
				deltaMarkTime = 24 * 60 * 60 * 1000;
			else if (deltaMarkTime <= 30 * 24 * 60 * 60 * 1000)
				deltaMarkTime = 30 * 24 * 60 * 60 * 1000;

			//		console.log('deltaMarkTime: '+deltaMarkTime+', nbXMarks: '+(deltaTime / deltaMarkTime)+', '+nbXMarks);

			ctx.textAlign = 'center';
			//		deltaMarkTime = (Math.floor(deltaMarkTime / 60000) + 1) * 60000;


			// month
			if (deltaMarkTime >= 30 * 24 * 60 * 60 * 1000) {
				let currentTime = this.monthRound(new Date(startTime.getTime() + 15 * 24 * 60 * 60 * 1000));
				let centerX = (15 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
				while (currentTime.getTime() < endTime.getTime()) {
					let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					if (x >= 60) {
						ctx.fillRect(x, h - 25, 1, 4);
						let text = this.formatMonth(currentTime.getMonth());
						ctx.fillText(text, x + centerX, h - 25 + 4);
					}
					currentTime = this.monthRound(new Date(currentTime.getTime() + deltaMarkTime + 15 * 24 * 60 * 60 * 1000));
				}
				// level 2: year
				ctx.font = 'bold 10px Sans-Serif';
				currentTime = this.yearRound(new Date(startTime.getTime() - 182 * 24 * 60 * 60 * 1000));
				centerX = (182 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
				while (currentTime.getTime() < endTime.getTime()) {
					let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					if (x >= 60)
						ctx.fillRect(x - 1, h - 25, 2, 4);
					let text = currentTime.getFullYear().toString();
					let textSize = ctx.measureText(text).width;
					currentTime = this.yearRound(new Date(currentTime.getTime() + 547 * 24 * 60 * 60 * 1000));
					let xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
				}
				ctx.font = 'normal 10px Sans-Serif';
			}
			// day
			else if (deltaMarkTime >= 24 * 60 * 60 * 1000) {
				let currentTime = this.dayRound(new Date(startTime.getTime() + 12 * 60 * 60 * 1000));
				let centerX = (12 * 60 * 60 * 1000 / deltaTime) * (w - 60);
				while (currentTime.getTime() < endTime.getTime()) {
					let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					if (x >= 60) {
						ctx.fillRect(x, h - 25, 1, 4);
						let text = this.formatWeekDay(currentTime.getDay()) + ' ' + currentTime.getDate();
						ctx.fillText(text, x + centerX, h - 25 + 4);
					}
					currentTime = this.dayRound(new Date(currentTime.getTime() + deltaMarkTime + 12 * 60 * 60 * 1000));
				}
				// level 2: month
				ctx.font = 'bold 10px Sans-Serif';
				currentTime = this.monthRound(new Date(startTime.getTime() - 15 * 24 * 60 * 60 * 1000));
				centerX = (15 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
				while (currentTime.getTime() < endTime.getTime()) {
					let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					if (x >= 60)
						ctx.fillRect(x - 1, h - 25, 2, 4);
					let text = this.formatFullMonth(currentTime.getMonth()) + ' ' + currentTime.getFullYear();
					let textSize = ctx.measureText(text).width;
					currentTime = this.monthRound(new Date(currentTime.getTime() + 45 * 24 * 60 * 60 * 1000));
					let xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
				}
				ctx.font = 'normal 10px Sans-Serif';
			}
			// hour
			else {
				let currentTime: Date;
				//		currentTime = (Math.floor(currentTime / 60000) + 1) * 60000;
				if (deltaMarkTime > 60 * 60 * 1000)
					currentTime = this.hourRound(startTime, Math.floor(deltaMarkTime / (60 * 60 * 1000)));
				else
					currentTime = new Date(Math.ceil(startTime.getTime() / deltaMarkTime) * deltaMarkTime);
				while (currentTime.getTime() < endTime.getTime()) {
					let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					if (x >= 60) {
						ctx.fillRect(x, h - 25, 1, 4);
						let text = this.zeroPad(currentTime.getHours()) + ':' + this.zeroPad(currentTime.getMinutes());
						ctx.fillText(text, x, h - 25 + 4);
					}
					if (deltaMarkTime > 60 * 60 * 1000)
						currentTime = this.hourRound(new Date(currentTime.getTime() + deltaMarkTime + 30 * 60 * 1000), Math.floor(deltaMarkTime / (60 * 60 * 1000)));
					else
						currentTime = new Date(currentTime.getTime() + deltaMarkTime);
				}
				// level 2: day
				ctx.font = 'bold 10px Sans-Serif';
				currentTime = this.dayRound(new Date(startTime.getTime() - 12 * 60 * 60 * 1000));
				let centerX = (12 * 60 * 60 * 1000 / deltaTime) * (w - 60);
				while (currentTime.getTime() < endTime.getTime()) {
					let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					if (x >= 60)
						ctx.fillRect(x - 1, h - 25, 2, 4);
					let text = this.formatWeekDay(currentTime.getDay()) + ' ' + currentTime.getDate() + ' ' + this.formatMonth(currentTime.getMonth()) + ' ' + currentTime.getFullYear();
					let textSize = ctx.measureText(text).width;
					currentTime = this.dayRound(new Date(currentTime.getTime() + 36 * 60 * 60 * 1000));
					let xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
					ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
				}
				ctx.font = 'normal 10px Sans-Serif';
			}

			// draw values
			for (let d = 0; d < this.data.length; d++) {
				let item = this.data[d];
				let data = item.data;
				if (item.color)
					ctx.strokeStyle = Ui.Color.create(item.color).getCssRgba();
				else
					ctx.strokeStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
				ctx.lineWidth = 2;
				ctx.beginPath();
				let lastX; let lastY; let lastV = data[0].value; let lastT = data[0].time;
				for (let i = 1; i < data.length; i++) {
					let cX = 60 + (data[i].time.getTime() - startTime.getTime()) /
						(endTime.getTime() - startTime.getTime()) * (w - 60);
					let c;
					if (this.mode === 'diff') {
						if (data[i].value < lastV)
							c = 0;
						else
							c = (data[i].value - lastV) / ((data[i].time.getTime() - lastT.getTime()) / 1000);
					}
					else
						c = data[i].value;
					let cY = h - 25 - (h - 45) * c / topY;
					if (cX >= 60) {
						if ((lastX !== undefined) && (lastX >= 60))
							ctx.lineTo(lastX, cY);
						else
							ctx.moveTo((lastX !== undefined) ? 60 : cX, cY);
						ctx.lineTo(cX, cY);
					}
					lastX = cX;
					lastY = cY;
					lastV = data[i].value;
					lastT = data[i].time;
				}
				ctx.stroke();
			}

			// draw legend
			let xDelta = 0;
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'right';
			for (let d = this.data.length - 1; d >= 0; d--) {
				let def = this.data[d];
				if (def.color !== undefined)
					ctx.fillStyle = Ui.Color.create(def.color).getCssRgba();
				else
					ctx.fillStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
				ctx.fillText(def.name, w - xDelta, 5);
				xDelta += ctx.measureText(def.name).width + 5;
				ctx.fillRect(w - xDelta - 5, 3, 5, 5);
				xDelta += 20;
			}
		}

		protected onStyleChange() {
			this.invalidateDraw();
		}
		
		static style: any = {
			foreground: '#444444',
			lineColor: '#627DF7'
		}
	}

}