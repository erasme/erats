namespace Ui
{
    export interface TextInit extends CompactLabelInit {
//        textTransform?: string;
    }

    export class Text extends CompactLabel implements TextInit
    {
        constructor(init?: TextInit) {
            super(init);
//            this.drawing.style.whiteSpace = 'pre-wrap';
//            if (init) {
//                if (init.textTransform !== undefined)
//                    this.textTransform = init.textTransform;	
//            }
        }

//        set textTransform(textTransform: string) {
//            this.drawing.style.textTransform = textTransform;
//            this.invalidateMeasure();
//        }
    }
}	
