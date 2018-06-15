
namespace Ui {
    
    export interface ShapeIconInit extends ShapeInit {
        icon?: string;
    }

    export class ShapeIcon extends Shape implements ShapeIconInit
    {
        constructor(init?: IconInit) {
            super(init);
            if (init) {
                if (init.icon !== undefined)
                    this.icon = init.icon;	
            }
        }

        set icon(icon: string) {
            this.path = Icon.icons[icon];
        }

        protected arrangeCore(width: number, height: number) {
            super.arrangeCore(width, height);
            this.scale = Math.min(width, height) / 48;
        }
    }
}
