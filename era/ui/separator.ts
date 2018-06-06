namespace Ui
{
    export class Separator extends Rectangle
    {
        constructor() {
            super();
            this.height = 1;
            this.width = 1;
        }

        onStyleChange() {
            this.fill = this.getStyleProperty('color');
        }

        static style: any = {
            color: '#444444'
        }
    }
}	

