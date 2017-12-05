/// <reference path="../../era/era.d.ts" />

interface SelectionableInit extends Ui.LBoxInit {
}
	
class Selectionable extends Ui.LBox implements SelectionableInit {
	selectedMark: Ui.Icon;

	constructor(init?: Partial<SelectionableInit>) {
		super();
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
			select: () => this.selectedMark.show(),
			unselect: () => this.selectedMark.hide()
		});

		this.assign(init);
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
		this.connect(this.selection, 'change', () => {
			if(this.selection.elements.length === 0)
				this.contextBar.hide();
			else
				this.contextBar.show();
		});

		var vbox = new Ui.VBox();
		this.setContent(vbox);

		this.contextBar = new Ui.ContextBar({ selection: this.selection });
		this.contextBar.hide();
		vbox.append(this.contextBar);

		var selectionable = new Selectionable({
			width: 50, height: 50,
			verticalAlign: 'center', horizontalAlign: 'center'
		});
		vbox.append(selectionable, true);
	}
}

new App();
