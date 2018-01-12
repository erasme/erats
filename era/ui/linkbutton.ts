namespace Ui {
	export interface LinkButtonInit extends ButtonInit {
		src?: string;
		openWindow?: boolean;
		target?: string;
	}

	export class LinkButton extends Button implements LinkButtonInit {
		src: string;
		openWindow: boolean = true;
		target: string = '_blank';
		readonly link = new Core.Events<{ target: LinkButton }>();

		constructor(init?: LinkButtonInit) {
			super(init);
			this.pressed.connect(() => this.onLinkButtonPress());
			if (init) {
				if (init.src !== undefined)
					this.src = init.src;	
				if (init.openWindow !== undefined)
					this.openWindow = init.openWindow;	
				if (init.target !== undefined)
					this.target = init.target;	
			}
		}

		protected onLinkButtonPress() {
			this.link.fire({ target: this });
			if (this.openWindow)
				window.open(this.src, this.target);
			else
				window.location.replace(this.src);
		}

		static style: object = {
			background: '#a4f4f4'
		}
	}
}	

