namespace Core
{
	export class Timer extends Object
	{
		interval: number = 1;
		arguments: any = undefined;
		handle: any = undefined;

		constructor(config) {
			super();
			this.addEvents('timeupdate');

			if ('interval' in config) {
				this.interval = config.interval;
				delete (config.interval);
			}
			if ('arguments' in config) {
				this.arguments = config.arguments;
				delete (config.arguments);
			}
			else
				this.arguments = [];

			let wrapper = () => {
				var startTime = (new Date().getTime()) / 1000;
				this.fireEvent('timeupdate', this, this.arguments);
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

