namespace Anim
{
	export interface PowerEaseInit extends EasingFunctionInit {
		power: number;
	}

	export class PowerEase extends EasingFunction implements PowerEaseInit {
		power: number = 2;

		constructor(init?: Partial<PowerEaseInit>) {
			super();
			if (init)
				this.assign(init);
		}

		protected easeInCore(normalizedTime: number): number {
			return Math.pow(normalizedTime, this.power);
		}
	}
}

Anim.EasingFunction.register('power', Anim.PowerEase);
