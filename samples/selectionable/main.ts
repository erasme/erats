/// <reference path="../../era/era.d.ts" />

interface SelectionableInit extends Ui.SelectionableInit {
}
	
class Selectionable extends Ui.Selectionable implements SelectionableInit {
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
		this.draggableData = this;
		this.assign(init);
	}

	onItemDelete() {
		Ui.Toast.send('Item deleted');
	}

	onItemEdit() {
		Ui.Toast.send('Item edited');
	}

	protected onPress() {
		this.isSelected = !this.isSelected;
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
				text: 'Remove', icon: 'trash',
				scope: this, callback: this.onItemDelete, multiple: false
			},
			edit: {
				"default": true,
				text: 'Edit', icon: 'edit',
				scope: this, callback: this.onItemEdit, multiple: false
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
