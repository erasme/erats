namespace Anim
{
	export class AnimationManager extends Core.Object
	{
		clocks: any = undefined;
		start: number = 0;
		onTickBind: any = undefined;
		readonly tick: Core.Events<{ target: AnimationManager }> = new Core.Events();

		constructor() {
			super();
			this.clocks = [];
			this.start = new Date().getTime();
			this.onTickBind = this.onTick.bind(this);
		}

		add(clock) {
			var found = false;
			for (var i = 0; !found && (i < this.clocks.length); i++) {
				found = this.clocks[i] === clock;
			}
			if (!found) {
				this.clocks.push(clock);
				if (this.clocks.length == 1)
					requestAnimationFrame(this.onTickBind);
			}
		}

		remove(clock) {
			var i = 0;
			while ((i < this.clocks.length) && (this.clocks[i] != clock)) { i++; }
			if (i < this.clocks.length)
				this.clocks.splice(i, 1);
		}

		forceTick() {
			if (this.clocks.length > 0)
				this.onTickBind();
		}
	
		private onTick() {
			var startTime = (new Date().getTime()) / 1000;

			var current = (new Date().getTime()) - this.start;
			current /= 1000;
			for (var i = 0; i < this.clocks.length; i++)
				this.clocks[i].update(current);
			this.tick.fire({ target: this });

			if (this.clocks.length > 0)
				requestAnimationFrame(this.onTickBind);
		}

		static current: AnimationManager = null;
		
		static initialize() {
			this.current = new Anim.AnimationManager();
		}
	}
}	

Anim.AnimationManager.initialize();

if(!('requestAnimationFrame' in window)) {
	if('webkitRequestAnimationFrame' in window)
		(window as any).requestAnimationFrame = window['webkitRequestAnimationFrame'];
	else if('mozRequestAnimationFrame' in window)
		(window as any).requestAnimationFrame = window['mozRequestAnimationFrame'];
	else if('msRequestAnimationFrame' in window)
		(window as any).requestAnimationFrame = window['msRequestAnimationFrame'];
	else
		(window as any).requestAnimationFrame = function(cb) { setTimeout(cb, 1/60);	};
}


