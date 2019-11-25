namespace Ui
{
    export interface TextInit extends CompactLabelInit {
    }

    export class Text extends CompactLabel implements TextInit
    {
        constructor(init?: TextInit) {
            super(init);
        }
    }
}	
