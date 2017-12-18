namespace Ui
{
	export interface TextInit extends HtmlInit {
		textTransform?: string;
	}

	export class Text extends Html implements TextInit
	{
		constructor(init?: TextInit) {
			super(init);
			this.drawing.style.whiteSpace = 'pre-wrap';
			this.selectable = false;
			if (init) {
				if (init.textTransform !== undefined)
					this.textTransform = init.textTransform;	
			}
		}

		set textTransform(textTransform: string) {
			this.drawing.style.textTransform = textTransform;
			this.invalidateMeasure();
		}
	}
}	
