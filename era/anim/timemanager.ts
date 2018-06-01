namespace Anim
{
	export class TimeManager extends Core.Object
	{
		clocks: any = undefined;
		timer: any = undefined;
		start: number = 0;
		readonly tick: Core.Events<{ target: TimeManager }> = new Core.Events();

		constructor() {
			super();
			this.clocks = [];
			this.start = new Date().getTime();
		}

		add(clock) {
			var found = false;
			for (var i = 0; !found && (i < this.clocks.length); i++) {
				found = this.clocks[i] === clock;
			}
			if (!found) {
				this.clocks.push(clock);
				if (this.clocks.length === 1) {
					this.timer = new Core.Timer({ interval: 1 / 60 });
					this.timer.timeupdate.connect(this.onTick);
				}
			}
		}

		remove(clock) {
			var i = 0;
			while ((i < this.clocks.length) && (this.clocks[i] != clock)) { i++; }
			if (i < this.clocks.length)
				this.clocks.splice(i, 1);
			if (this.clocks.length === 0) {
				this.timer.abort();
				this.timer = undefined;
			}
		}

		private onTick() {
			var current = (new Date().getTime()) - this.start;
			current /= 1000;
			for (var i = 0; i < this.clocks.length; i++)
				this.clocks[i].update(current);
			this.tick.fire({ target: this });
		}

		static current = new TimeManager();		
	}
}	
