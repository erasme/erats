namespace Anim
{
	export interface BounceEaseInit extends EasingFunctionInit {
		bounces: number;
		bounciness: number;
	}

	export class BounceEase extends EasingFunction implements BounceEaseInit {
		bounces: number = 3;
		bounciness: number = 2.0;

		constructor(init?: Partial<BounceEaseInit>) {
			super();
			if (init)
				this.assign(init);
		}

		protected easeInCore(normalizedTime: number): number {
			var sq = Math.exp((1.0 / this.bounciness) * Math.log(normalizedTime));
			var step = Math.floor(sq * (this.bounces + 0.5));
			var sinstep = (sq * (this.bounces + 0.5)) - step;
			return Math.sin(sinstep * Math.PI) / Math.exp(this.bounces - step);
		}
	}
}

Anim.EasingFunction.register('bounce', Anim.BounceEase);

