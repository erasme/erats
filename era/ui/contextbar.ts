namespace Ui
{
	export class ContextBarCloseButton extends Button
	{
		constructor() {
			super();
		}

		static style: any = {
			textWidth: 5,
			radius: 0,
			borderWidth: 0,
			foreground: 'rgba(250,250,250,1)',
			background: 'rgba(60,60,60,0)'
		}
	}

	export class ContextBar extends LBox
	{
		bg: Rectangle;
		selection: Selection = undefined;
		actionsBox: Box;
		closeButton: ContextBarCloseButton;

		constructor() {
			super();

			this.bg = new Ui.Rectangle();
			this.append(this.bg);

			let hbox = new Ui.HBox();
			hbox.spacing = 5;
			this.append(hbox);
		
			this.closeButton = new Ui.ContextBarCloseButton();
			this.closeButton.icon = 'backarrow';
			hbox.append(this.closeButton);
			this.connect(this.closeButton, 'press', this.onClosePress);

			let scroll = new Ui.ScrollingArea();
			hbox.append(scroll, true);

			this.actionsBox = new Ui.HBox();
			this.actionsBox.spacing = 5;
		}

		setSelection(selection: Selection) {
			if (this.selection != undefined)
				this.disconnect(this.selection, 'change', this.onSelectionChange);
			this.selection = selection;
			if (this.selection != undefined)
				this.connect(this.selection, 'change', this.onSelectionChange);
		}
	
		onClosePress() {
			this.selection.clear();
		}
	
		onSelectionChange() {
			this.closeButton.text = this.selection.getElements().length.toString();
			let actions = this.selection.getActions();
		
			this.actionsBox.clear();
			for (let actionName in actions) {
				let action = actions[actionName];
				if (action.hidden === true)
					continue;
				let button = new Ui.ActionButton();
				button.icon = action.icon;
				button.text = action.text;
				button.action = action;
				button.selection = this.selection;
				this.actionsBox.append(button);
			}
		}

		onStyleChange() {
			this.bg.fill = this.getStyleProperty('background');
		}

		static style: any = {
			background: '#07a0e5'
		}
	}
}	
