namespace Core
{
	export interface TimerInit {
		interval?: number;
		arguments?: Array<any>;
	}

	export class Timer extends Object
	{
		interval: number = 1;
		arguments: Array<any>;
		handle: any;
		readonly timeupdated = new Core.Events<{ target: Timer, arguments: Array<any> }>();

		constructor(init?: TimerInit) {
			super();
			if (init) {
				if (init.interval !== undefined)
					this.interval = init.interval;
				if (init.arguments !== undefined)
					this.arguments = init.arguments;
				else
					this.arguments = [];
			}

			let wrapper = () => {
				var startTime = (new Date().getTime()) / 1000;
				this.timeupdated.fire({ target: this, arguments: this.arguments });
				var endTime = (new Date().getTime()) / 1000;
				var deltaTime = endTime - startTime;
				if (deltaTime < 0)
					deltaTime = 0;

				var interval = (this.interval * 1000) - deltaTime;
				if (interval < 0)
					interval = 0;

				if (this.handle !== undefined)
					this.handle = setTimeout(wrapper, interval);
			};
			this.handle = setTimeout(wrapper, 0);
		}

		abort() {
			if (this.handle !== undefined) {
				clearTimeout(this.handle);
				this.handle = undefined;
			}
		}
	}
}	

