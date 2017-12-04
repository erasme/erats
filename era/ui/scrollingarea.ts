namespace Ui {

	export class Scrollbar extends Movable {
		private rect: Rectangle;
		private over: Overable;
		private clock: Anim.Clock = undefined;

		constructor(private orientation: Orientation) {
			super();
			this.cursor = 'inherit';
			this.over = new Overable();
			this.setContent(this.over);
			this.rect = new Rectangle();
			if (orientation == 'horizontal') {
				this.rect.width = 30; this.rect.height = 5;
				this.over.height = 15;
				this.rect.verticalAlign = 'bottom';
			}
			else {
				this.rect.width = 5; this.rect.height = 30;
				this.over.width = 15;
				this.rect.horizontalAlign = 'right';
			}
			this.over.content = this.rect;
			this.connect(this.over, 'enter', this.startAnim);
			this.connect(this.over, 'leave', this.startAnim);
			this.connect(this, 'down', this.startAnim);
			this.connect(this, 'up', this.startAnim);
		}

		set radius(radius: number) {
			this.rect.radius = radius;
		}

		set fill(color: Color) {
			this.rect.fill = color;
		}

		private startAnim() {
			if (this.clock == undefined) {
				this.clock = new Anim.Clock();
				this.clock.duration = 'forever';
				this.connect(this.clock, 'timeupdate', this.onTick);
				this.clock.begin();
			}
		}

		protected onTick(clock, progress, deltaTick) {
			let d = deltaTick * 30;

			let view = this.over.isOver || this.isDown;

			if (!view)
				d = -d;

			let s = Math.max(5 , Math.min(15,
				((this.orientation == 'vertical') ? this.rect.width : this.rect.height) + d));
			if (this.orientation == 'vertical')
				this.rect.width = s;
			else
				this.rect.height = s;
			if ((!view && s == 5) || (view && s == 15)) {
				this.clock.stop();
				this.clock = undefined;
			}
		}
	}

	export interface ScrollingAreaInit extends ScrollableInit {
	}

	export class ScrollingArea extends Scrollable implements ScrollingAreaInit {

		private horizontalScrollbar: Scrollbar;
		private verticalScrollbar: Scrollbar;

		constructor(init?: Partial<ScrollingAreaInit>) {
			super();
			this.horizontalScrollbar = new Scrollbar('horizontal');
			this.setScrollbarHorizontal(this.horizontalScrollbar);

			this.verticalScrollbar = new Scrollbar('vertical');
			this.setScrollbarVertical(this.verticalScrollbar);
			if (init)
				this.assign(init);
		}

		protected onStyleChange() {
			let radius = this.getStyleProperty('radius');
			this.horizontalScrollbar.radius = radius;
			this.verticalScrollbar.radius = radius;
	
			let color = this.getStyleProperty('color');
			this.horizontalScrollbar.fill = color;
			this.verticalScrollbar.fill = color;
		}

		static style: any = {
			color: 'rgba(50,50,50,0.7)',
			radius: 0
		}
	}
}