namespace Ui {

	export interface CarouselableInit extends MovableBaseInit {
		ease?: Anim.EasingFunction;
		autoPlay?: number;
		bufferingSize?: number;
		content?: Element[];
	}

	export class Carouselable extends MovableBase {
		private _ease: Anim.EasingFunction;
		private items: Array<Ui.Element>;
		private pos: number = 0;
		private lastPosition: number;
		private activeItems: Array<Ui.Element>;
		private alignClock: Anim.Clock;
		private animNext: number;
		private animStart: number;
		private speed: number = 1;
		private _bufferingSize: number = 1;
		private autoPlayDelay: number | undefined;
		private autoPlayTask?: Core.DelayedTask;
		readonly changed = new Core.Events<{ target: Carouselable, position: number }>();
		set onchanged(value: (event: { target: Carouselable, position: number }) => void) { this.changed.connect(value); }

		constructor(init?: CarouselableInit) {
			super(init);

			this.clipToBounds = true;
			this.focusable = true;
			this.moveVertical = false;
			this.items = [];
			this.activeItems = [];
			this._ease = new Anim.PowerEase({ mode: 'out' });
	
			this.downed.connect(e => this.onCarouselableDown());
			this.upped.connect(e => this.onCarouselableUp(e.target, e.speedX, e.speedY, e.deltaX, e.deltaY, e.cumulMove, e.abort));
			this.drawing.addEventListener('keydown', e => this.onKeyDown(e));
			this.wheelchanged.connect(e => this.onWheel(e));

			if (init) {
				if (init.autoPlay)
					this.autoPlay = init.autoPlay;
				if (init.bufferingSize)
					this.bufferingSize = init.bufferingSize;
				if (init.content)
					this.content = init.content;
				if (init.ease)
					this.ease = init.ease;
			}
		}

		set autoPlay(delay: number) {
			if (this.autoPlayDelay !== delay) {
				if (this.autoPlayTask !== undefined)
					this.autoPlayTask.abort();
				this.autoPlayTask = undefined;
				this.autoPlayDelay = delay;
				this.startAutoPlay();
			}
		}

		stopAutoPlay() {
			if (this.autoPlayTask !== undefined) {
				this.autoPlayTask.abort();
				this.autoPlayTask = undefined;
			}
		}

		startAutoPlay() {
			if (this.autoPlayDelay !== undefined) {
				this.autoPlayTask = new Core.DelayedTask(
					this.autoPlayDelay,
					() => this.onAutoPlayTimeout()
				);
			}
		}

		private onAutoPlayTimeout() {
			if (this.currentPosition >= this.items.length - 1)
				this.setCurrentAt(0);
			else
				this.next();
			this.startAutoPlay();
		}

		get bufferingSize(): number {
			return this._bufferingSize;
		}

		set bufferingSize(size: number) {
			if (this._bufferingSize != size) {
				this._bufferingSize = size;
				this.updateItems();
			}
		}

		get logicalChildren(): Element[] {
			return this.items;
		}
	
		get currentPosition() {
			if (this.alignClock !== undefined)
				return this.animNext;
			else
				return this.pos;
		}

		get current(): Element {
			return this.items[this.currentPosition];
		}

		set current(value: Element) {
			this.setCurrent(value);
		}

		setCurrentAt(position: number, noAnimation: boolean = false) {
			position = Math.min(2 * (this.items.length - 1), Math.max(0, position));
			if (noAnimation) {
				this.pos = position;
				this.setPosition(-this.pos * this.layoutWidth, undefined);
				this.onChange();
			}
			else
				this.startAnimation(2 * (this.pos - position), position);
		}

		setCurrent(current: Element, noAnimation: boolean = false) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i] == current) {
					this.setCurrentAt(i, noAnimation);
					break;
				}
			}
		}

		next() {
			if (this.alignClock === undefined) {
				if (this.pos < this.items.length - 1)
					this.startAnimation(-2, this.pos + 1);
			}
			else {
				if (this.animNext > this.pos)
					this.startAnimation(-2 * (this.animNext + 1 - Math.floor(this.pos)), Math.min(this.animNext + 1, this.items.length - 1));
				else
					this.startAnimation(-2, Math.min(Math.ceil(this.pos), this.items.length - 1));
			}
		}

		previous() {
			if (this.alignClock === undefined) {
				if (this.pos > 0)
					this.startAnimation(2, this.pos - 1);
			}
			else {
				if (this.animNext < this.pos)
					this.startAnimation(2 * (Math.floor(this.pos) - (this.animNext - 1)), Math.max(this.animNext - 1, 0));
				else
					this.startAnimation(2, Math.floor(this.pos));
			}
		}

		get ease(): Anim.EasingFunction {
			return this._ease;
		}

		set ease(ease: Anim.EasingFunction) {
			this._ease = Anim.EasingFunction.create(ease);
		}

		set content(value: Element[]) {
			while (this.logicalChildren.length > 0)
				this.remove(this.logicalChildren[0]);
			for (let el of value)
				this.append(el);
		}

		append(child: Element) {
			this.items.push(child);
			this.onChange();
		}

		remove(child: Element) {
			let i = 0;
			while ((i < this.items.length) && (this.items[i] !== child)) { i++; }
			if (i < this.items.length) {
				this.items.splice(i, 1);
				if ((this.pos < 0) || (this.pos > this.items.length - 1))
					this.pos = Math.max(0, Math.min(this.pos, this.items.length - 1));
				if (this.alignClock !== undefined)
					this.animNext = Math.max(0, Math.min(this.animNext, this.items.length - 1));
				this.setPosition(-this.pos * this.layoutWidth, undefined, true);
				this.onChange();
			}
		}

		insertAt(child: Element, position: number) {
			if (position < 0)
				position = this.items.length + position;
			if (position < 0)
				position = 0;
			if (position >= this.items.length)
				position = this.items.length;
			this.items.splice(position, 0, child);
			this.onChange();
		}
	
		moveAt(child: Element, position: number) {
			if (position < 0)
				position = this.items.length + position;
			if (position < 0)
				position = 0;
			if (position >= this.items.length)
				position = this.items.length;
			let i = 0;
			while ((i < this.items.length) && (this.items[i] != child)) { i++; }
			if (i < this.items.length) {
				this.items.splice(i, 1);
				this.items.splice(position, 0, child);
			}
			this.onChange();
		}

		private onKeyDown(event: KeyboardEvent) {
			if (this.isDisabled)
				return;
			let key = event.which;
			if ((key == 37) || (key == 39)) {
				event.stopPropagation();
				event.preventDefault();
				if (key == 37)
					this.previous();
				else if (key == 39)
					this.next();
			}
		}
	
		private onWheel(event) {
			if (this.isDisabled)
				return;
			if (event.deltaX !== 0) {
				event.stopPropagation();
				if (event.deltaX < 0)
					this.previous();
				else
					this.next();
			}
		}

		private onCarouselableDown() {
			this.stopAutoPlay();
			this.stopAnimation();
		}

		private onCarouselableUp(el: Element, speedX: number, speedY: number, deltaX: number, deltaY: number, cumulMove: number, abort: boolean) {
			let mod;
			if (abort === true) {
				// just re-align the content
				mod = this.pos % 1;
				if (mod > 0.5)
					speedX = -400;
				else
					speedX = 400;
			}
			else {
				// if too slow
				if (Math.abs(speedX) < 50) {
					// if we have done 20% on the move or 100 units, continue in this direction
					if ((deltaX > 0.2 * this.layoutWidth) || (Math.abs(deltaX) > 100)) {
						if (deltaX < 0)
							speedX = -400;
						else
							speedX = 400;
					}
					// else just re-align the content
					else {
						mod = this.pos % 1;
						if (mod > 0.5)
							speedX = -400;
						else
							speedX = 400;
					}
				}
			}
			// if slow set a minimun speed
			if (Math.abs(speedX) < 800) {
				if (speedX < 0)
					speedX = -800;
				else
					speedX = 800;
			}
			if (speedX !== 0)
				this.startAnimation(speedX / this.layoutWidth);
			this.startAutoPlay();
		}

		private onChange() {
			this.loadItems();
			this.updateItems();
			let current = this.current;
			if (current !== undefined)
				current.enable();
			let currentPosition = this.currentPosition;
			if ((this.lastPosition === undefined) || (this.lastPosition !== currentPosition)) {
				if ((this.lastPosition !== undefined) && (this.items[this.lastPosition] !== undefined))
					this.items[this.lastPosition].disable();
				this.lastPosition = currentPosition;
				this.changed.fire({ target: this, position: currentPosition });
			}
		}

		private onAlignTick(clock: Anim.Clock, progress: number, delta: number) {
			if (delta === 0)
				return;
			let relprogress = -(clock.time * this.speed) / (this.animNext - this.animStart);
			if (relprogress >= 1) {
				this.alignClock.stop();
				this.alignClock = undefined;
				relprogress = 1;
			}
			relprogress = this._ease.ease(relprogress);
			this.pos = (this.animStart + relprogress * (this.animNext - this.animStart));
			this.setPosition(-this.pos * this.layoutWidth, undefined);
			if (this.alignClock === undefined)
				this.onChange();
		}

		private startAnimation(speed: number, next?: number) {
			this.stopAnimation();
			this.speed = speed;
			this.animStart = this.pos;
			if (next === undefined) {
				if (this.speed < 0)
					this.animNext = Math.ceil(this.animStart);
				else
					this.animNext = Math.floor(this.animStart);
			}
			else
				this.animNext = next;
			if (this.animStart !== this.animNext) {
				this.alignClock = new Anim.Clock({
					duration: 'forever', target: this,
					ontimeupdate: e => this.onAlignTick(e.target, e.progress, e.deltaTick)
				});
				this.alignClock.begin();
			}
		}

		private stopAnimation() {
			if (this.alignClock !== undefined) {
				this.alignClock.stop();
				this.alignClock = undefined;
			}
		}
	
		private loadItems() {
			if (!this.isLoaded)
				return;
			let i;
			for (i = 0; i < this.activeItems.length; i++)
				(this.activeItems[i] as any).carouselableSeen = undefined;

			let newItems = [];
			for (i = Math.max(0, Math.floor(this.pos - this._bufferingSize)); i < Math.min(this.items.length, Math.floor(this.pos + 1 + this._bufferingSize)); i++) {
				let item = this.items[i];
				let active = false;
				for (let i2 = 0; !active && (i2 < this.activeItems.length); i2++) {
					if (this.activeItems[i2] === item) {
						active = true;
						(this.activeItems[i2] as any).carouselableSeen = true;
					}
				}
				newItems.push(item);
				if (!active) {
					item.disable();
					this.appendChild(item);
				}
			}

			// remove unviewable items
			for (i = 0; i < this.activeItems.length; i++) {
				if (!(this.activeItems[i] as any).carouselableSeen)
					this.removeChild(this.activeItems[i]);
			}
			this.activeItems = newItems;
		}

		private updateItems() {
			if (!this.isLoaded)
				return;

			let w = this.layoutWidth;
			let h = this.layoutHeight;

			for (let i = 0; i < this.activeItems.length; i++) {
				let item = this.activeItems[i];
				let ipos = -1;
				for (ipos = 0; (ipos < this.items.length) && (this.items[ipos] !== item); ipos++) { }
				if (ipos < this.items.length) {
					// measure & arrange
					item.measure(w, h);
					item.arrange(0, 0, w, h);
					item.transform = Ui.Matrix.createTranslate((ipos - this.pos) * w, 0);
				}
			}
		}

		protected onLoad() {
			super.onLoad();
			this.loadItems();
			this.updateItems();
			this.onChange();
		}

		protected onMove(x, y) {
			if (this.layoutWidth <= 0)
				return;
			this.pos = -x / this.layoutWidth;
			if ((this.pos < 0) || (this.pos > this.items.length - 1)) {
				this.pos = Math.max(0, Math.min(this.pos, this.items.length - 1));
				this.setPosition(-this.pos * this.layoutWidth);
			}
			this.updateItems();
		}

		protected measureCore(width: number, height: number): { width: number, height: number } {
			let current = this.current;
			return current.measure(width, height);
		}

		protected arrangeCore(width: number, height: number) {
			this.setPosition(-this.pos * width, undefined);
		}
	}
}
