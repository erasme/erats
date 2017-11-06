namespace Core
{
	export class DelayedTask extends Object
	{
		delay: number = 1;
		scope: any = undefined;
		callback: Function;
		isDone: boolean = false;
		handle: number = undefined;

		constructor(scope: any, delay: number, callback: Function) {
			super();
			this.scope = scope;
			this.delay = delay;
			this.callback = callback;
			this.handle = setTimeout(() => {
				this.handle = undefined;
				this.isDone = true;
				this.callback.apply(this.scope, [this]);
			}, this.delay * 1000);
		}

		abort() {
			if (this.handle !== undefined) {
				clearTimeout(this.handle);
				this.handle = undefined;
			}
		}
	}
}

