namespace Ui {
    export class Embed extends Ui.Container {
        private obs: any;
        private htmlParent: HTMLElement;

        constructor(parent: HTMLElement) {
            super();
            this.htmlParent = parent;
            this.drawing.style.position = 'relative';
            parent.appendChild(this.drawing);
            // handle the resize event
            this.obs = new ResizeObserver(() => {
                this.updateLayout(parent.offsetWidth, parent.offsetHeight);
            });
            this.obs.observe(parent);
            this.isLoaded = true;
            this.updateLayout(parent.offsetWidth, parent.offsetHeight);
        }
    
        invalidateMeasure() {
            // Ui.Embed is layout root, handle the layout here
            this.invalidateLayout();
        }

        invalidateArrange() {
            // Ui.Embed is layout root, handle the layout here
            this.invalidateLayout();
            this.updateLayout(this.htmlParent.offsetWidth, this.htmlParent.offsetHeight);
        }

        updateLayout(width: number, height: number) {
            let size = this.measure(this.htmlParent.offsetWidth, this.htmlParent.offsetHeight);
            let layoutWidth = Math.max(size.width, this.htmlParent.offsetWidth);
            let layoutHeight = Math.max(size.height, this.htmlParent.offsetHeight);
            this.arrange(0, 0, layoutWidth, layoutHeight);
        }

        set content(element: Element) {
            this.appendChild(element);
        }
    
        protected measureCore(width: number, height: number): { width: number, height: number } {
            let minWidth = 0;
            let minHeight = 0;
            for (let child of this.children) {
                let size = child.measure(width, height);
                if (size.width > minWidth)
                    minWidth = size.width;
                if (size.height > minHeight)
                    minHeight = size.height;
            }
            return { width: minWidth, height: minHeight };
        }
    
        protected arrangeCore(width: number, height: number) {
            for (let child of this.children)
                child.arrange(0, 0, width, height);
        }
    }    
}