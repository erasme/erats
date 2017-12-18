namespace Anim
{
	export interface PowerEaseInit extends EasingFunctionInit {
		power?: number;
	}

	export class PowerEase extends EasingFunction implements PowerEaseInit {
		power: number = 2;

		constructor(init?: PowerEaseInit) {
			super(init);
			if (init) {
				if (init.power !== undefined)
					this.power = init.power;
			}
		}

		protected easeInCore(normalizedTime: number): number {
			return Math.pow(normalizedTime, this.power);
		}
	}
}

Anim.EasingFunction.register('power', Anim.PowerEase);
