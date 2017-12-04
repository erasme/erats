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

	export interface ContextBarInit extends LBoxInit {
		selection: Selection;
	}

	export class ContextBar extends LBox implements ContextBarInit
	{
		bg: Rectangle;
		private _selection: Selection = undefined;
		actionsBox: Box;
		closeButton: ContextBarCloseButton;

		constructor(init?: Partial<ContextBarInit>) {
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
			scroll.content = this.actionsBox;

			this.assign(init);
		}

		get selection(): Selection {
			return this._selection;
		}

		set selection(selection: Selection) {
			if (this._selection != undefined)
				this.disconnect(this._selection, 'change', this.onSelectionChange);
			this._selection = selection;
			if (this._selection != undefined)
				this.connect(this._selection, 'change', this.onSelectionChange);
		}
	
		onClosePress() {
			this._selection.clear();
		}
	
		onSelectionChange() {
			console.log('ContextBar.onSelectionChange');
			this.closeButton.text = this._selection.elements.length.toString();
			let actions = this._selection.getActions();
			console.log(actions);
		
			this.actionsBox.clear();
			this.actionsBox.append(new Element(), true);
			for (let actionName in actions) {
				let action = actions[actionName];
				if (action.hidden === true)
					continue;
				let button = new ActionButton();
				button.icon = action.icon;
				button.text = action.text;
				button.action = action;
				button.selection = this._selection;
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
