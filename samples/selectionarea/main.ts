/// <reference path="../../era/era.d.ts" />

interface SelectionableInit extends Ui.LBoxInit {
}

class Selectionable extends Ui.LBox implements SelectionableInit {
	selectedMark: Ui.Icon;

	constructor(init?: SelectionableInit) {
		super(init);
		this.content = new Ui.Rectangle({ fill: 'orange' });
		this.selectedMark = new Ui.Icon({
			icon: 'check', fill: '#40d9f1', width: 24, height: 24,
			verticalAlign: 'top', horizontalAlign: 'right'
		});
		this.selectedMark.hide();
		this.append(this.selectedMark);

		new Ui.SelectionableWatcher({
			element: this,
			selectionActions: this.getSelectionActions(),
			onselected: () => this.selectedMark.show(),
			onunselected: () => this.selectedMark.hide()
		});
	}

	onItemDelete() {
		Ui.Toast.send('Item deleted');
	}

	onItemEdit() {
		Ui.Toast.send('Item edited');
	}

	onSelect() {
		this.selectedMark.show();
	}

	onUnselect() {
		this.selectedMark.hide();
	}

	getSelectionActions() {
		return {
			remove: {
				text: 'Remove', icon: 'trash', multiple: false,
				callback: () => this.onItemDelete()
			},
			edit: {
				"default": true, multiple: false,
				text: 'Edit', icon: 'edit',
				callback: () => this.onItemEdit()
			}
		};
	}
}

class App extends Ui.App {
	contextBar: Ui.ContextBar;

	constructor() {
		super();

		this.selection.changed.connect(() => {
			if (this.selection.elements.length === 0)
				this.contextBar.hide();
			else
				this.contextBar.show();
		});

		let vbox = new Ui.VBox();
		this.content = vbox;

		this.contextBar = new Ui.ContextBar({ selection: this.selection });
		this.contextBar.hide();
		vbox.append(this.contextBar);

		let flow = new Ui.Flow().assign({ margin: 20 });
		for (let i = 0; i < 20; i++) {
			let selectionable = new Selectionable().assign({
				width: 50, height: 50, margin: 10,
				verticalAlign: 'center', horizontalAlign: 'center'
			});
			flow.append(selectionable);
		}

		vbox.append(new Ui.SelectionArea().assign({
			content: flow
		}), true);
	}
}

new App();
