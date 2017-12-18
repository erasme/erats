namespace Anim
{
	export interface ElasticEaseInit extends EasingFunctionInit {
		oscillations?: number;
		springiness?: number;
	}

	export class ElasticEase extends EasingFunction implements ElasticEaseInit {
		oscillations: number = 3;
		springiness: number = 3.0;

		constructor(init?: ElasticEaseInit) {
			super(init);
			if (init) {
				if (init.oscillations !== undefined)
					this.oscillations = init.oscillations;
				if (init.springiness !== undefined)
					this.springiness = init.springiness;
			}
		}

		protected easeInCore(normalizedTime: number): number {
			return Math.sin(normalizedTime * (this.oscillations * 2 + 0.5) * Math.PI) * Math.pow(normalizedTime, this.springiness);
		}
	}
}

Anim.EasingFunction.register('elastic', Anim.ElasticEase);

