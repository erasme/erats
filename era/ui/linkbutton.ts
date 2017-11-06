namespace Ui {
	export interface LinkButtonInit extends ButtonInit {
		src: string;
		openWindow: boolean ;
		target: string;
	}

	export class LinkButton extends Button implements LinkButtonInit {
		src: string;
		openWindow: boolean = true;
		target: '_blank';

		constructor(init?: Partial<LinkButtonInit>) {
			super();
			this.addEvents('link');
			this.connect(this, 'press', this.onLinkButtonPress);
			if (init)
				this.assign(init);
		}

		protected onLinkButtonPress() {
			this.fireEvent('link', this);
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

