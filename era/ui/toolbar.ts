namespace Ui {
	export interface ToolBarInit extends ScrollingAreaInit {
	}

	export class ToolBar extends ScrollingArea implements ToolBarInit {
		private scroll: ScrollingArea;
		private hbox: HBox;

		constructor(init?: Partial<ToolBarInit>) {
			super();
			this.verticalAlign = 'center';
			this.scrollVertical = false;
			this.hbox = new HBox();
			this.hbox.eventsHidden = true;
			super.setContent(this.hbox);
			if (init)
				this.assign(init);
		}

		append(child: Element, resizable: boolean = false) {
			this.hbox.append(child, resizable);
		}

		remove(child: Element) {
			this.hbox.remove(child);
		}

		set content(content: Element) {
			this.hbox.content = content;
		}

		protected onStyleChange() {
			let spacing = this.getStyleProperty('spacing');
			this.hbox.margin = spacing;
			this.hbox.spacing = spacing;
		}

		static style: object = {
			spacing: 3
		}
	}
}	
