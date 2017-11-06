namespace Ui {

	export interface SelectionAction {
		default?: boolean;
		text: string;
		icon: string;
		scope?: any;
		callback?: Function;
		multiple?: boolean;
	}

	export interface SelectionActions {
		[key: string]: SelectionAction;
	}

	export interface SelectionableInit extends DraggableInit {
	}

	export class Selectionable extends Draggable implements SelectionableInit
	{
		isSelected: boolean = false;
		handler: any = undefined;

		constructor(init?: Partial<SelectionableInit>) {
			super();
			this.connect(this, 'activate', this.onSelectionableActivate);
			this.connect(this, 'dragstart', this.onSelectionableDragStart);
			this.connect(this, 'dragend', this.onSelectionableDragEnd);
			if (init)
				this.assign(init);
		}

		getIsSelected() {
			return this.isSelected;
		}
	
		setIsSelected(isSelected) {
			if (this.isSelected !== isSelected) {
				this.isSelected = isSelected;
				if (this.isSelected)
					this.onSelect();
				else
					this.onUnselect();
			}
		}

		protected onSelect() {
		}

		protected onUnselect() {
		}
		
		// ex:
		// {
		//   delete: { text: 'Delete', icon: 'trash', callback: this.onDelete, multiple: true },
		//   edit: ...
		// }
		getSelectionActions(): SelectionActions {
			return {};
		}

		getParentSelectionHandler() {
			// search for the selection handler
			let parent:any = this.parent;
			while (parent !== undefined) {
				if ('getSelectionHandler' in parent)
					break;
				parent = parent.parent;
			}
			if (parent !== undefined)
				return parent.getSelectionHandler();
			else
				return undefined;
		}
	
		onSelectionableDragStart() {
			this.select();
		}
	
		onSelectionableDragEnd() {
			if (this.getIsSelected()) {
				let handler = this.getParentSelectionHandler();
				if (handler !== undefined)
					handler.clear();
			}
		}
		
		onSelectionableActivate() {
			if (this.isLoaded) {
				this.select();
				let handler = this.getParentSelectionHandler();
				if (handler !== undefined) {
					if (handler.getDefaultAction() !== undefined)
						handler.executeDefaultAction();
					else
						this.unselect();
				}
			}
		}

		select() {
			if (this.isLoaded) {
				this.handler = this.getParentSelectionHandler();
				if (this.handler !== undefined) {
					this.handler.append(this);
					this.setIsSelected(true);
				}
			}
		}
	
		unselect() {
			if (this.handler !== undefined) {
				this.handler.remove(this);
				this.setIsSelected(false);
			}
		}

		onUnload() {
			if (this.getIsSelected())
				this.unselect();
			super.onUnload();
		}
	}
}