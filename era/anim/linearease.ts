namespace Anim
{
	export class LinearEase extends EasingFunction {
		easeInCore(normalizedTime) {
			return normalizedTime;
		}
	}
}
Anim.EasingFunction.register('linear', Anim.LinearEase);	
