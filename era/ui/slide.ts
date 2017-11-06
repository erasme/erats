namespace Ui {
	export type SlideDirection = 'top' | 'bottom' | 'left' | 'right';

	export interface SlideInit {
		direction: SlideDirection;
	}

	export class Slide extends Transition implements SlideInit {
		protected _direction: SlideDirection = 'right';

		constructor(init?: Partial<SlideInit>) {
			super();
			if (init)
				this.assign(init);
		}

		set direction(direction: SlideDirection) {
			this._direction = direction;
		}
		
		run(current: Element, next: Element, progress: number) {
			if (current !== undefined) {
				if (progress === 1) {
					current.hide();
					current.setTransformOrigin(0, 0);
					current.transform = undefined;
				}
				else {
					current.setTransformOrigin(0, 0);
					if (this._direction == 'right')
						current.transform = Matrix.createTranslate(-current.layoutWidth * progress, 0);
					else if (this._direction == 'left')
						current.transform = Matrix.createTranslate(current.layoutWidth * progress, 0);
					else if (this._direction == 'top')
						current.transform = Matrix.createTranslate(0, current.layoutHeight * progress);
					else
						current.transform = Matrix.createTranslate(0, -current.layoutHeight * progress);
				}
			}
			if (next !== undefined) {
				if (progress === 1) {
					next.setTransformOrigin(0, 0);
					next.transform = undefined;
				}
				else {
					next.setTransformOrigin(0, 0);
					if (this._direction == 'right')
						next.transform = Matrix.createTranslate(next.layoutWidth * (1 - progress), 0);
					else if (this._direction == 'left')
						next.transform = Matrix.createTranslate(-next.layoutWidth * (1 - progress), 0);
					else if (this._direction == 'top')
						next.transform = Matrix.createTranslate(0, -next.layoutHeight * (1 - progress));
					else
						next.transform = Matrix.createTranslate(0, next.layoutHeight * (1 - progress));
				}
			}
		}
	}
}

Ui.Transition.register('slide', Ui.Slide);	
