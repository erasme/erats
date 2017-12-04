namespace Ui
{
	export class ActionButton extends Button
	{
		private _action: any = undefined;
		private _selection: Selection = undefined;

		constructor() {
			super();
			this.connect(this.dropBox, 'drop', this.onActionButtonDrop);
			this.connect(this, 'press', this.onActionButtonDrop);

			this.dropBox.addType('all', this.onActionButtonEffect.bind(this));
		}

		set action(action) {
			this._action = action;
		}

		set selection(selection: Selection) {
			this._selection = selection;
		}

		protected onActionButtonEffect(data, dataTransfer) {
			if ('draggable' in dataTransfer) {
				let elements = this._selection.elements;
				let found = undefined;
				for (let i = 0; (found === undefined) && (i < elements.length); i++) {
					if (elements[i] === dataTransfer.draggable)
						found = elements[i];
				}
				if (found !== undefined)
					return ['run'];
			}
			return [];
		}

		protected onActionButtonDrop() {
			let scope = this;
			if ('scope' in this._action)
				scope = this._action.scope;
			this._action.callback.call(scope, this._selection);
			// clear the selection after the action done
			this._selection.clear();
		}

		static style: object = {
			textTransform: 'uppercase',
			radius: 0,
			borderWidth: 0,
			foreground: 'rgba(250,250,250,1)',
			background: 'rgba(60,60,60,0)',
			backgroundBorder: 'rgba(60,60,60,0)',
			focusColor: '#f6caa2'
		}
	}
}	
