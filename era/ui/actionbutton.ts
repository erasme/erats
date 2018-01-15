namespace Ui {
	export interface ActionButtonInit extends ButtonInit {
		action?: any;
		selection?: Selection;
	}

	export class ActionButton extends Button {
		private _action: any;
		private _selection: Selection;
		private _dropWatcher: DropableWatcher;

		constructor(init?: ActionButtonInit) {
			super(init);
			this.pressed.connect(() => this.onActionButtonDrop());

			new DropableWatcher({
				element: this,
				ondropped: () => this.onActionButtonDrop(),
				types: [
					{
						type: 'all',
						effects: (data, dataTransfer) => this.onActionButtonEffect(data, dataTransfer)
					}
				]
			});
			if (init) {
				if (init.action !== undefined)
					this.action = init.action;
				if (init.selection !== undefined)
					this.selection = init.selection;
			}		
		}

		set action(action) {
			this._action = action;
		}

		set selection(selection: Selection) {
			this._selection = selection;
		}

		protected onActionButtonEffect(data, dataTransfer): DropEffect[] {
			if ('draggable' in dataTransfer) {
				let elements = this._selection.elements;
				let found = undefined;
				for (let i = 0; (found === undefined) && (i < elements.length); i++) {
					if (elements[i] === dataTransfer.draggable)
						found = elements[i];
				}
				if (found !== undefined)
					return [{ action: 'run' }];
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
			return false;
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
