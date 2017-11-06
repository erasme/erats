namespace Ui {
	export interface FlipInit {
		orientation: 'horizontal' | 'vertical';
	}

	export class Flip extends Transition implements FlipInit {
		orientation: 'horizontal' | 'vertical' = 'horizontal';

		constructor(init?: Partial<FlipInit>) {
			super();
			if (init)
				this.assign(init);
		}

		run(current: Element, next: Element, progress: number) {
			if (progress < 0.5) {
				if (current !== undefined) {
					current.setTransformOrigin(0.5, 0.5);
					if (this.orientation == 'horizontal')
						current.transform = Matrix.createScale((1 - progress * 2), 1);
					else
						current.transform = Matrix.createScale(1, (1 - progress * 2));
				}
				if (next !== undefined)
					next.hide();
			}
			else {
				if (current !== undefined) {
					current.hide();
					current.setTransformOrigin(0, 0);
					current.transform = undefined;
				}
				if (next !== undefined) {
					if (progress == 1) {
						next.show();
						next.setTransformOrigin(0, 0);
						next.transform = undefined;
					}
					else {
						next.show();
						next.setTransformOrigin(0.5, 0.5);
						if (this.orientation == 'horizontal')
							next.transform = Matrix.createScale((progress - 0.5) * 2, 1);
						else
							next.transform = Matrix.createScale(1, (progress - 0.5) * 2);
					}
				}
			}
		}
	}
}	

Ui.Transition.register('flip', Ui.Flip);	
