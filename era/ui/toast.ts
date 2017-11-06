
namespace Ui
{
	export class Toaster extends Container
	{
		static current: Toaster;
		private arrangeClock: Anim.Clock;

		constructor() {
			super();
			this.margin = 10;
			this.eventsHidden = true;
		}

		appendToast(toast: Toast) {
			toast.newToast = true;
			if (this.children.length === 0)
				App.current.appendTopLayer(this);
			this.appendChild(toast);
		}

		removeToast(toast: Toast) {
			this.removeChild(toast);
			if (this.children.length === 0)
				App.current.removeTopLayer(this);
		}

		protected onArrangeTick(clock, progress, delta) {
			//console.log(this+'.onArrangeTick progress: '+progress+', last: '+this.lastLayoutY+', new: '+this.getLayoutY());
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i] as Toast;
				if (progress === 1) {
					child.transform = undefined;
					child.newToast = false;
				}
				else if (child.newToast !== true)
					child.transform = (Matrix.createTranslate(
						(child.lastLayoutX - child.layoutX) * (1 - progress),
						(child.lastLayoutY - child.layoutY) * (1 - progress)));
			}
			if (progress === 1)
				this.arrangeClock = undefined;
		}

		protected measureCore(width: number, height: number) {
			let spacing = 10;
			let maxWidth = 0;
			let totalHeight = 0;
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				let size = child.measure(0, 0);
				totalHeight += size.height;
				if (size.width > maxWidth)
					maxWidth = size.width;
			}
			totalHeight += Math.max(0, this.children.length - 1) * spacing;
			return { width: maxWidth, height: totalHeight };
		}

		protected arrangeCore(width: number, height: number) {
			let spacing = 10;
			let y = 0;
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i] as Toast;
				child.lastLayoutX = child.layoutX;
				child.lastLayoutY = child.layoutY;
				y += child.measureHeight;
				child.arrange(0, height - y, this.measureWidth, child.measureHeight);
				y += spacing;
			}
			if (this.arrangeClock === undefined) {
				this.arrangeClock = new Anim.Clock({ duration: 1, speed: 5 });
				this.connect(this.arrangeClock, 'timeupdate', this.onArrangeTick);
				this.arrangeClock.begin();
			}
		}

		static appendToast(toast: Toast) {
			Ui.Toaster.current.appendToast(toast);
		}

		static removeToast(toast: Toast) {
			Ui.Toaster.current.removeToast(toast);
		}
	}

	export class Toast extends LBox
	{
		private _isClosed: boolean = true;
		private openClock: Anim.Clock;
		private toastContentBox: LBox;
		newToast: boolean = false;
		lastLayoutX: number;
		lastLayoutY: number;
		lastLayoutWidth: number;
		lastLayoutHeight: number;

		constructor() {
			super();
			this.addEvents('close');

			let sha = new Ui.Shadow();
			sha.shadowWidth = 2; sha.radius = 1; sha.inner = false; sha.opacity = 0.8;
			this.append(sha);

			let r = new Rectangle();
			r.fill = '#666666'; r.width = 200; r.height = 30; r.margin = 2; r.opacity = 0.5;
			this.append(r);

			this.toastContentBox = new LBox();
			this.toastContentBox.margin = 2; this.toastContentBox.width = 200;
			this.append(this.toastContentBox);
		}

		get isClosed(): boolean {
			return this._isClosed;
		}

		open() {
			if (this._isClosed) {
				//			Ui.App.current.appendDialog(this, false);
				this._isClosed = false;

				if (this.openClock == undefined) {
					this.openClock = new Anim.Clock({
						duration: 1, target: this, speed: 5,
						ease: new Anim.PowerEase({ mode: 'out' })
					});
					this.connect(this.openClock, 'timeupdate', this.onOpenTick);
					// set the initial state
					this.opacity = 0;
					// the start of the animation is delayed to the next arrange
				}
				new Core.DelayedTask(this, 2, this.close);
				Ui.Toaster.appendToast(this);
			}
		}

		close() {
			if (!this._isClosed) {
				this._isClosed = true;
				this.disable();
				if (this.openClock == undefined) {
					this.openClock = new Anim.Clock({
						duration: 1, target: this, speed: 5,
						ease: new Anim.PowerEase({ mode: 'out' })
					});
					this.connect(this.openClock, 'timeupdate', this.onOpenTick);
					this.openClock.begin();
				}
			}
		}

		protected onOpenTick(clock, progress, delta) {
			let end = (progress >= 1);

			if (this._isClosed)
				progress = 1 - progress;
		
			this.opacity = progress;
			this.transform = Matrix.createTranslate(-20 * (1 - progress), 0);

			if (end) {
				this.openClock.stop();
				this.openClock = undefined;
				if (this._isClosed) {
					this.enable();
					this.fireEvent('close', this);
					Ui.Toaster.removeToast(this);
				}
			}
		}

		set content(content: Element) {
			this.toastContentBox.content = content;
		}

		protected arrangeCore(width: number, height: number) {
			super.arrangeCore(width, height);
			// the delayed open animation
			if ((this.openClock != undefined) && !this.openClock.isActive)
				this.openClock.begin();
		}

		static send(content: Element | string) {
			let toast = new Ui.Toast();
			if (typeof (content) === 'string') {
				let t = new Ui.Text();
				t.text = content as string;
				t.verticalAlign = 'center';
				t.margin = 5; t.color = Color.create('#deff89');
				content = t;
			}
			toast.content = content;
			toast.open();
		}
	}
}	

Ui.Toaster.current = new Ui.Toaster();