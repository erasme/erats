namespace Ui {
	export interface ProgressBarInit extends ContainerInit {
		value: number;
	}

	export class ProgressBar extends Container implements ProgressBarInit {
		private _value: number= 0;
		private bar: Rectangle;
		private background: Rectangle;

		constructor(init?: Partial<ProgressBarInit>) {
			super();
			this.background = new Ui.Rectangle({ height: 4 });
			this.appendChild(this.background);
			this.bar = new Ui.Rectangle({ height: 4 });
			this.appendChild(this.bar);
			if (init)
				this.assign(init);
		}

		set value(value: number) {
			if (value != this._value) {
				this._value = value;
				let barWidth = this.layoutWidth * this._value;
				if (barWidth < 2)
					this.bar.hide();
				else {
					this.bar.show();
					this.bar.arrange(0, 0, barWidth, this.layoutHeight);
				}
			}
		}

		get value(): number {
			return this._value;
		}

		protected measureCore(width: number, height: number) {
			let minHeight = 0;
			let minWidth = 0;
			let size;

			size = this.bar.measure(width, height);
			minHeight = Math.max(size.height, minHeight);
			minWidth = Math.max(size.width, minWidth);

			size = this.background.measure(width, height);
			minHeight = Math.max(size.height, minHeight);
			minWidth = Math.max(size.width, minWidth);

			return { width: Math.max(minWidth, 12), height: minHeight };
		}

		protected arrangeCore(width: number, height: number) {
			this.background.arrange(0, 0, width, height);

			let barWidth = width * this._value;
			if (barWidth < 2)
				this.bar.hide();
			else {
				this.bar.show();
				this.bar.arrange(0, 0, barWidth, this.layoutHeight);
			}
		}

		protected onStyleChange() {
			let radius = this.getStyleProperty('radius');
			this.bar.radius = radius;
			this.bar.fill = this.getStyleProperty('foreground');
			this.background.radius = radius;
			this.background.fill = this.getStyleProperty('background');
		}

		static style: object = {
			background: '#e1e1e1',
			foreground: '#07a0e5',
			color: '#999999',
			radius: 0
		}
	}
}	

