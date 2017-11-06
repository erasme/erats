namespace Ui
{
	export interface TextInit extends HtmlInit {
		textTransform: string;
	}

	export class Text extends Html implements TextInit
	{
		constructor(init?: Partial<TextInit>) {
			super();
			this.drawing.style.whiteSpace = 'pre-wrap';
			this.selectable = false;
			if (init)
				this.assign(init);
		}

		set textTransform(textTransform: string) {
			this.drawing.style.textTransform = textTransform;
			this.invalidateMeasure();
		}
	}
}	
