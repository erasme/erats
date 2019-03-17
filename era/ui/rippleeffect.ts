namespace Ui {
    export class RippleEffect extends Core.Object {
        private ripple: HTMLDivElement;
        private isAnimated = false;
        private upResolve?: () => void;
    
        constructor(readonly element: Ui.Element) {
            super();
            this.element.drawing.style.overflow = 'hidden';		
            this.ripple = document.createElement('div');
            this.ripple.style.transformOrigin = 'center center';
            this.ripple.style.transform = 'scale(0) translate3d(0,0,0)';
            this.ripple.style.position = 'absolute';
            this.ripple.style.display = 'block';
            this.ripple.style.margin = '0';
            this.ripple.style.padding = '0';
            this.ripple.style.borderRadius = '100%';
            this.ripple.style.width = '10px';
            this.ripple.style.height = '10px';
            this.fill = Ui.Color.create('rgba(0,0,0,0.1)');
        }
    
        protected async anim(x?: number, y?: number) {
            if (this.isAnimated)
                return;
            this.isAnimated = true;
            if (x == undefined)
                x = this.element.layoutWidth / 2;
            if (y == undefined)
                y = this.element.layoutHeight / 2;
    
            let upPromise = new Promise<void>((resolve) => this.upResolve = resolve);
            this.element.drawing.appendChild(this.ripple);
            this.ripple.style.transform = 'scale(0) translate3d(0,0,0)';
            await new Promise((resolve) => setTimeout(() => resolve(), 0));
            let scale = 2.5 * Math.ceil(Math.max(this.element.layoutWidth, this.element.layoutHeight) / 10);
            this.ripple.style.left = `${Math.round(x - 5)}px`;
            this.ripple.style.top = `${Math.round(y - 5)}px`;
            this.ripple.style.transition = 'transform 0.5s ease-out, opacity 0.1s';
            this.ripple.style.transform = `scale(${scale}) translate3d(0,0,0)`;
            await new Promise((resolve) => setTimeout(() => resolve(), 500));
            await upPromise;
            this.ripple.style.opacity = '0';
            await new Promise((resolve) => setTimeout(() => resolve(), 100));
            this.ripple.style.transition = '';
            this.ripple.style.opacity = '1';
            this.ripple.style.transform = 'scale(0) translate3d(0,0,0)';
            this.element.drawing.removeChild(this.ripple);
            this.isAnimated = false;
        }
    
        down(x?: number, y?: number) {
            this.anim(x, y);
        }
    
        up() {
            if (this.upResolve)
                this.upResolve();
        }
    
        press(x?: number, y?: number) {
            if (!this.isAnimated) {
                this.down(x, y);
                this.up();
            }
        }
    
        set fill(fill: Ui.Color | string) {
            this.ripple.style.background = Ui.Color.create(fill).getCssRgba();
        }

        set pressable(pressable: Pressable) {
            pressable.pressed.connect((e) => {
				if (e.x && e.y) {
					let p = this.element.pointFromWindow(new Ui.Point(e.x, e.y));
					this.press(p.x, p.y);
				}
				else
					this.press();
			});
			pressable.downed.connect((e) => {
				if (e.x && e.y) {
					let p = this.element.pointFromWindow(new Ui.Point(e.x, e.y));
					this.down(p.x, p.y);
				}
				else
					this.down();
			});
			pressable.upped.connect(() => this.up());
        }
    }       
}