namespace Ui {
	export interface SliderInit extends ContainerInit {
		value?: number;
		orientation?: Orientation;
		onchanged?: (event: { target: Slider, value: number }) => void;
	}

	export class Slider extends Container implements SliderInit {
		protected _value: number = 0;
		protected background: Rectangle;
		protected bar: Rectangle;
		protected button: Movable;
		protected buttonContent: Rectangle;
		protected _orientation: Orientation = 'horizontal';
		protected updateLock: boolean;
		readonly changed = new Core.Events<{ target: Slider, value: number }>();

		constructor(init?: SliderInit) {
			super(init);

			this.background = new Rectangle({ width: 4, height: 4 });
			this.appendChild(this.background);

			this.bar = new Rectangle({ width: 4, height: 4 });
			this.appendChild(this.bar);

			this.button = new Movable({ moveVertical: false });
			this.appendChild(this.button);
			this.button.moved.connect(this.onButtonMove);
			this.button.focused.connect(() => this.updateColors());
			this.button.blurred.connect(() => this.updateColors());
			this.button.downed.connect(() => this.updateColors());
			this.button.upped.connect(() => this.updateColors());

			this.buttonContent = new Rectangle({ radius: 10, width: 20, height: 20, margin: 10 });
			this.button.content = this.buttonContent;
			if (init) {
				if (init.value !== undefined)
					this.value = init.value;	
				if (init.orientation !== undefined)
					this.orientation = init.orientation;
				if (init.onchanged)
					this.changed.connect(init.onchanged);
			}
		}

		get value(): number {
			return this._value;
		}

		set value(value: number) {
			this.setValue(value);
		}

		setValue(value: number, dontSignal: boolean = false) {
			value = Math.min(1, Math.max(0, value));
			if (this._value !== value) {
				this._value = value;
				this.button.moved.disconnect(this.onButtonMove);
				this.updateValue();
				this.button.moved.connect(this.onButtonMove);
				if (dontSignal !== true)
					this.changed.fire({ target: this, value: this._value });
			}
		}
	
		get orientation(): Orientation {
			return this._orientation;
		}
	
		set orientation(orientation: Orientation) {
			if (this._orientation !== orientation) {
				this._orientation = orientation;
				this.button.moveHorizontal = true;
				this.button.moveVertical = true;
				this.updateValue();
				if (this._orientation === 'horizontal') {
					this.button.moveHorizontal = true;
					this.button.moveVertical = false;
				}
				else {
					this.button.moveHorizontal = false;
					this.button.moveVertical = true;
				}
				this.invalidateMeasure();
				this.onStyleChange();
			}
		}

		protected onButtonMove = () => {
			var oldValue = this._value;

			// get the new value only if its a user move
			if (this.updateLock !== true) {
				var pos;
				var size;
				var max;
		
				if (this.orientation === 'horizontal') {
					pos = this.button.positionX;
					size = this.layoutWidth;
					max = size - this.button.layoutWidth;
				}
				else {
					size = this.layoutHeight;
					max = size - this.button.layoutHeight;
					pos = max - this.button.positionY;
				}
				if (pos < 0)
					pos = 0;
				else if (pos > max)
					pos = max;

				this._value = pos / max;
			}

			this.button.moved.disconnect(this.onButtonMove);
			this.updateValue();
			this.button.moved.connect(this.onButtonMove);
			if (oldValue != this._value)
				this.changed.fire({ target: this, value: this._value });
		}

		protected updateValue() {
			this.updateLock = true;

			var max;
			var width = this.layoutWidth;
			var height = this.layoutHeight;
			if (this.orientation === 'horizontal') {
				max = width - this.button.layoutWidth;
				this.button.setPosition(max * this._value, 0);
				this.bar.arrange(
					this.button.layoutWidth / 2,
					(height - this.bar.measureHeight) / 2,
					max * this._value, this.bar.measureHeight);
			}
			else {
				max = height - this.button.layoutHeight;
				var x = (width - 44) / 2;
				var size = (height - 36) * this._value;
				this.button.setPosition(0, max * (1 - this._value));
				this.bar.arrange(
					(width - this.bar.measureWidth) / 2,
					this.button.layoutHeight / 2 + max * (1 - this._value),
					this.bar.measureWidth, max * this._value);
			}
			delete (this.updateLock);
		}

		protected getColor() {
			return Color.create(this.getStyleProperty('background'));
		}
	
		protected getForeground() {
			return Color.create(this.getStyleProperty('foreground'));
		}

		protected getBackground() {
			var yuv = Color.create(this.getStyleProperty('background')).getYuv();
			var deltaY = 0;
			if (this.button.isDown)
				deltaY = -0.30;
			return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
		}

		protected getButtonColor() {
			var yuv = Color.create(this.getStyleProperty('background')).getYuv();

			var deltaY = 0;
			if (this.button.isDown)
				deltaY = -0.30;
			else if (this.button.hasFocus)
				deltaY = 0.10;

			return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
		}

		protected updateColors() {
			this.bar.fill = this.getForeground();
			this.background.fill = this.getBackground();
			this.buttonContent.fill = this.getForeground();
		}

		/**#@-*/

		protected measureCore(width, height) {
			var buttonSize = this.button.measure(0, 0);
			var size = buttonSize;
			var res;

			if (this.orientation === 'horizontal') {
				res = this.background.measure(width - buttonSize.width, 0);
				if (res.width > size.width)
					size.width = res.width;
				if (res.height > size.height)
					size.height = res.height;
				res = this.bar.measure(width - buttonSize.width, 0);
				if (res.width > size.width)
					size.width = res.width;
				if (res.height > size.height)
					size.height = res.height;
			}
			else {
				res = this.background.measure(0, height - buttonSize.height);
				if (res.width > size.width)
					size.width = res.width;
				if (res.height > size.height)
					size.height = res.height;
				res = this.bar.measure(0, height - buttonSize.height);
				if (res.width > size.width)
					size.width = res.width;
				if (res.height > size.height)
					size.height = res.height;
			}
			return size;
		}

		protected arrangeCore(width, height) {
			if (this.orientation === 'horizontal') {
				this.button.arrange(0, (height - this.button.measureHeight) / 2,
					this.button.measureWidth, this.button.measureHeight);
				this.background.arrange(
					this.button.layoutWidth / 2,
					(height - this.background.measureHeight) / 2,
					width - this.button.layoutWidth, this.background.measureHeight);
			}
			else {
				this.button.arrange((width - this.button.measureWidth) / 2, 0, this.button.measureWidth, this.button.measureHeight);
				this.background.arrange(
					(width - this.background.measureWidth) / 2,
					this.button.layoutHeight / 2,
					this.background.measureWidth, height - this.button.layoutHeight);
			}
			this.updateValue();
		}

		protected onStyleChange() {
			this.background.radius = this.getStyleProperty('radius');
			this.bar.radius = this.getStyleProperty('radius');
			this.updateColors();
		}

		protected onDisable() {
			super.onDisable();
			this.button.opacity = 0.2;
		}

		protected onEnable() {
			super.onEnable();
			this.button.opacity = 1;
		}

		static style: object = {
			radius: 0,
			background: '#e1e1e1',
			backgroundBorder: '#919191',
			foreground: '#07a0e5'
		}
	}
}	

