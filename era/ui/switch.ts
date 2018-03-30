namespace Ui {
	export interface SwitchInit extends ContainerInit {
		value?: boolean;
		ease?: Anim.EasingFunction;
		onchanged?: (event: { target: Switch, value: boolean }) => void;
	}

	export class Switch extends Container {
		private _value: boolean = false;
		private pos: number = 0;
		private background: Rectangle;
		private button: Movable;
		private bar: Rectangle;
		private buttonContent: Rectangle;
		private alignClock?: Anim.Clock;
		private speed: number = 0;
		private animNext: number = 0;
		private animStart: number = 0;
		ease: Anim.EasingFunction;
		readonly changed = new Core.Events<{ target: Switch, value: boolean }>();
	
		constructor(init?: SwitchInit) {
			super(init);

			this.background = new Rectangle({ width: 4, height: 14, radius: 7 });
			this.appendChild(this.background);

			this.bar = new Rectangle({ width: 4, height: 14, radius: 7 });
			this.appendChild(this.bar);

			this.button = new Movable({ moveVertical: false });
			this.appendChild(this.button);
			this.button.moved.connect(this.onButtonMove);
			this.button.focused.connect(() => this.updateColors());
			this.button.blurred.connect(() => this.updateColors());
			this.button.downed.connect(() => this.onDown());
			this.button.upped.connect((e) => this.onUp(e.speedX, e.cumulMove, e.abort));

			this.buttonContent = new Rectangle({ radius: 10, width: 20, height: 20, margin: 10 });
			this.button.content = this.buttonContent;

			this.ease = new Anim.PowerEase({ mode: 'out' });

			if (init) {
				if (init.value !== undefined)
					this.value = init.value;
				if (init.ease !== undefined)
					this.ease = init.ease;
				if (init.onchanged)
					this.changed.connect(init.onchanged);
			}	
		}

		get value(): boolean {
			return this._value;
		}

		set value(value: boolean) {
			if (this._value !== value) {
				this._value = value;
				if (this.isLoaded) {
					if (this._value)
						this.startAnimation(4);
					else
						this.startAnimation(-4);
				}
				else
					this.pos = this._value ? 1 : 0;
			}
		}
	
		private onButtonMove = () => {
			let pos = this.button.positionX;
			let size = this.layoutWidth;
			let max = size - this.button.layoutWidth;

			if (pos < 0)
				pos = 0;
			else if (pos > max)
				pos = max;

			this.pos = pos / max;
			this.button.moved.disconnect(this.onButtonMove);
			this.updatePos();
			this.button.moved.connect(this.onButtonMove);
		}

		private updatePos() {
			let max;
			let width = this.layoutWidth;
			let height = this.layoutHeight;
			max = width - this.button.layoutWidth;
			this.button.setPosition(max * this.pos, 0);
			this.bar.arrange(
				this.button.layoutWidth / 2,
				(height - this.bar.measureHeight) / 2,
				max * this.pos, this.bar.measureHeight);
		}
	
		private getColor() {
			return Color.create(this.getStyleProperty('background')).getYuv();
		}
	
		private getForeground() {
			return Color.create(this.getStyleProperty('foreground'));
		}

		private getBackground() {
			let yuv = Color.create(this.getStyleProperty('background')).getYuv();
			let deltaY = 0;
			if (this.button.isDown)
				deltaY = -0.30;
			
			return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
		}

		private getButtonColor() {
			let yuv = Color.create(this.getStyleProperty('background')).getYuv();

			let deltaY = 0;
			if (this.button.isDown)
				deltaY = -0.30;
			else if (this.button.hasFocus)
				deltaY = 0.10;

			return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v);
		}

		private updateColors() {
			this.bar.fill = this.getForeground().addA(-0.6);
			this.background.fill = this.getBackground();
			this.buttonContent.fill = this.getForeground();
		}
	
		private onDown() {
			this.stopAnimation();
			this.updateColors();
		}

		private onUp(speedX: number, cumulMove: number, abort: boolean) {
			if (abort)
				return;	
			// if move is very low consider a click and invert the value
			if (cumulMove < 10)
				this.value = !this._value;
			// else consider a move
			else {
				if (this.pos > 0.5)
					speedX = 1;
				else
					speedX = -1;
				this.startAnimation(speedX);
			}
			this.updateColors();
		}
	
		private startAnimation(speed) {			
			this.stopAnimation();
			this.speed = speed;
			this.animStart = this.pos;

			if (this.speed > 0)
				this.animNext = 1;
			else
				this.animNext = 0;
		
			if (this.animStart !== this.animNext) {
				this.alignClock = new Anim.Clock({ duration: 'forever', target: this });
				this.alignClock.timeupdate.connect((e) => this.onAlignTick(e.target, e.progress, e.deltaTick));
				this.alignClock.begin();
			}
			else {
				if (this._value !== (this.animNext === 1)) {
					this._value = (this.animNext === 1);
					this.changed.fire({ target: this, value: this._value });
				}
			}
		}

		private stopAnimation() {
			if (this.alignClock !== undefined) {
				this.alignClock.stop();
				this.alignClock = undefined;
			}
		}

		private onAlignTick(clock: Anim.Clock, progress: number, delta: number) {
			if (delta === 0)
				return;

			let relprogress = (clock.time * this.speed) / (this.animNext - this.animStart);
			if (relprogress >= 1) {
				if (this.alignClock)
					this.alignClock.stop();
				this.alignClock = undefined;
				relprogress = 1;
				this._value = (this.animNext === 1);
				this.changed.fire({ target: this, value: this._value });
			}
			relprogress = this.ease.ease(relprogress);
			this.pos = (this.animStart + relprogress * (this.animNext - this.animStart));
			this.updatePos();
		}
	
		protected measureCore(width: number, height: number) {
			let buttonSize = this.button.measure(0, 0);
			let size = buttonSize;
			let res;

			res = this.background.measure(buttonSize.width * 1.75, 0);
			if (res.width > size.width)
				size.width = res.width;
			if (res.height > size.height)
				size.height = res.height;
			res = this.bar.measure(buttonSize.width * 1.75, 0);
			if (res.width > size.width)
				size.width = res.width;
			if (res.height > size.height)
				size.height = res.height;
			if (buttonSize.width * 1.75 > size.width)
				size.width = buttonSize.width * 1.75;
			return size;
		}

		protected arrangeCore(width: number, height: number) {
			this.button.arrange(0, (height - this.button.measureHeight) / 2, this.button.measureWidth, this.button.measureHeight);
			this.background.arrange(
				this.button.layoutWidth / 2,
				(height - this.background.measureHeight) / 2,
				width - this.button.layoutWidth, this.background.measureHeight);
			this.updatePos();
		}

		protected onStyleChange() {
			let borderWidth = this.getStyleProperty('borderWidth');
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
			borderWidth: 1,
			background: '#e1e1e1',
			backgroundBorder: '#919191',
			foreground: '#07a0e5'
		}
	}
}


