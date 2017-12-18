
namespace Anim
{
	export type EaseMode = 'in' | 'out' | 'inout';

	export interface EasingFunctionInit {
		mode?: EaseMode;
	}

	export class EasingFunction extends Core.Object
	{
		mode: EaseMode = 'in';
	
		constructor(init?: EasingFunctionInit) {
			super();
			if (init) {
				if (init.mode !== undefined)
					this.mode = init.mode;	
			}
		}

		ease(normalizedTime: number): number {
			if (this.mode == 'in')
				return this.easeInCore(normalizedTime);
			else if (this.mode == 'out')
				return 1 - this.easeInCore(1 - normalizedTime);
			else {
				if (normalizedTime <= 0.5)
					return this.easeInCore(normalizedTime * 2.0) / 2.0;
				else
					return 0.5 + ((1 - this.easeInCore(2.0 - (normalizedTime * 2.0))) / 2.0);
			}
		}
	
		//
		// Override this method to provide the easing method
		//
		protected easeInCore(normalizedTime: number): number {
			return normalizedTime;
		}

		static eases: any = {};

		static register(easeName: string, classType: Function) {
			this.eases[easeName] = classType;
		}

		static parse(ease: string) {
			return new this.eases[ease]();
		}

		static create(ease: string | EasingFunction): EasingFunction {
			if (ease instanceof EasingFunction)
				return ease;
			else
				return EasingFunction.parse(ease);
		}
	}
}	

