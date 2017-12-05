namespace Ui {

	export interface SelectionAction {
		default?: boolean;
		text: string;
		icon: string;
		//scope?: any;
		callback?: (selection: Selection) => void;
		multiple?: boolean;
		hidden?: boolean;
	}

	export interface SelectionActions {
		[key: string]: SelectionAction;
	}

	export class SelectionableWatcher extends Core.Object {
		readonly element: Element;
		readonly selectionActions: SelectionActions;
		private _isSelected: boolean = false;
		private handler: Selection | undefined;
		private select: (selection: Selection) => void;
		private unselect: (selection: Selection) => void;

		constructor(init: {
			element: Element,
			selectionActions?: SelectionActions,			
			dragSelect?: boolean,
			pressSelect?: boolean,
			select?: (selection: Selection) => void,
			unselect?: (selection: Selection) => void
		}) {
			super();
			this.element = init.element;
			this.element.focusable = true;
			this.selectionActions = init.selectionActions;			
			this.element['Ui.SelectionableWatcher.watcher'] = this;
			this.select = init.select;
			this.unselect = init.unselect;
			new PressWatcher({
				element: this.element,
				delayedpress: (w) => this.onDelayedPress(w),
				activate: (w) => this.onSelectionableActivate(w)
			});
			new DraggableWatcher({
				element: this.element,
				data: this.element,
				start: (w) => this.onSelectionableDragStart(w),
				end: (w) => this.onSelectionableDragEnd(w)
			});

			//this.connect(this, 'activate', this.onSelectionableActivate);
			//this.connect(this, 'dragstart', this.onSelectionableDragStart);
			//this.connect(this, 'dragend', this.onSelectionableDragEnd);
			//this.connect(this, 'ptrdown', this.onSelectionablePointerDown);
			//this.connect(this.element.drawing, 'contextmenu', (event) => event.preventDefault());
		}

		static getSelectionableWatcher(element: Element): SelectionableWatcher | undefined {
			return element['Ui.SelectionableWatcher.watcher'];
		}

		static getIsSelectionableItem(element: Element): boolean {
			// TODO: remove instanceof
			return (element instanceof Selectionable) || (SelectionableWatcher.getSelectionableWatcher(element) != undefined);
		}

		get isSelected(): boolean {
			return this._isSelected;
		}

		set isSelected(value: boolean) {
			if (this._isSelected != value) {
				let selection = this.getParentSelectionHandler();
				if (selection) {
					if (value)
						selection.append(this);
					else
						selection.remove(this);
				}
			}
		}
	
		onSelect(selection: Selection) {
			this._isSelected = true;
			this.handler = selection;
			if (this.select)
				this.select(selection);
		}

		onUnselect(selection: Selection) {
			this._isSelected = false;
			this.handler = undefined;
			if (this.unselect)
				this.unselect(selection);
		}
		
		protected onDelayedPress(watcher: PressWatcher) {
			let selection = this.getParentSelectionHandler();
			if (selection) {
				if (watcher.ctrlKey) {
					if (this.isSelected)
						selection.remove(this);
					else
						selection.append([this]);
                }
                else if (watcher.shiftKey)
                    selection.extend(this);
				else
					selection.watchers = [this];
			}
		}

		private getParentSelectionHandler(): Selection | undefined {
			return Selectionable.getParentSelectionHandler(this.element);
		}

		private onSelectionableDragStart(watcher: DraggableWatcher) {
			console.log('SelectionableWatcher.onSelectionableDragStart');
			console.log(this);
			let selection = this.getParentSelectionHandler();
			if (selection && (selection.watchers.indexOf(this) == -1))
				selection.watchers = [this];
		}
	
		private onSelectionableDragEnd(watcher: DraggableWatcher) {
			if (this.isSelected) {
				let handler = this.getParentSelectionHandler();
				if (handler !== undefined)
					handler.clear();
			}
		}
		
		private onSelectionableActivate(watcher: PressWatcher) {
			if (this.element.isLoaded) {
				let handler = this.getParentSelectionHandler();
				if (handler !== undefined) {
					handler.elements = [this.element as any];
					if (handler.getDefaultAction() !== undefined)
						handler.executeDefaultAction();
					else
						handler.clear();
				}
			}
		}

		/*private onSelectionablePointerDown(event: PointerEvent) {
			// if not mouse right click or element not enable return
			if (this.element.isDisabled || event.pointer.type != 'mouse' || event.pointer.button != 2)
				return;
						
			let selection = this.getParentSelectionHandler();
			if (selection == undefined)
				return;

			if (selection.elements.indexOf(this) == -1)
				selection.elements = [this];
			
			let actions = selection.getActions();
			
			let count = 0;
			for (let key in actions) { count++; }
			// if not action possible, return
			if (count == 0)
				return false;
						
			let watcher = event.pointer.watch(this);
			this.connect(watcher, 'move', function () {
				if (watcher.pointer.getIsMove())
					watcher.cancel();
			});
			this.connect(watcher, 'up', (event) => {
				watcher.capture();
				watcher.cancel();
			});


			let popup = new MenuPopup();
			let vbox = new Ui.VBox();
			popup.content = vbox;

			for (let actionName in actions) {
				let action = actions[actionName];
				if (action.hidden === true)
					continue;
				let button = new ActionButton();
				button.icon = action.icon;
				button.text = action.text;
				button.action = action;
				button.selection = selection;
				vbox.append(button);
				this.connect(button, 'press', () => popup.close());
			}

			popup.openAt(event.pointer.x, event.pointer.y);
		}*/
	}

	export interface SelectionableInit extends LBoxInit {
	}

	export class Selectionable extends LBox implements SelectionableInit
	{
		//private _isSelected: boolean = false;
		//private handler: Selection | undefined;
		private selectionWatcher: SelectionableWatcher;

		constructor(init?: Partial<SelectionableInit>) {
			super();
			this.addEvents('select', 'unselect');

			this.selectionWatcher = new SelectionableWatcher({
				element: this,
				selectionActions: this.getSelectionActions(),
				select: (s) => this.onSelect(s),
				unselect: (s) => this.onUnselect(s)
			});

//			this.connect(this, 'activate', this.onSelectionableActivate);
//			this.connect(this, 'dragstart', this.onSelectionableDragStart);
//			this.connect(this, 'dragend', this.onSelectionableDragEnd);
//			this.connect(this, 'ptrdown', this.onSelectionablePointerDown);
//			this.connect(this.drawing, 'contextmenu', (event) => event.preventDefault());
			this.assign(init);
		}

		get isSelected(): boolean {
			return this.selectionWatcher.isSelected;
		}
	
		set isSelected(isSelected: boolean) {
			this.selectionWatcher.isSelected = isSelected;
		}

		protected onSelect(selection: Selection) {
			this.fireEvent('select', this);
		}

		protected onUnselect(selection: Selection) {
			this.fireEvent('unselect', this);
		}
		
		// ex:
		// {
		//   delete: { text: 'Delete', icon: 'trash', callback: this.onDelete, multiple: true },
		//   edit: ...
		// }
		getSelectionActions(): SelectionActions {
			return {};
		}

		private getParentSelectionHandler(): Selection | undefined {
			return Selectionable.getParentSelectionHandler(this);
		}

		static getParentSelectionHandler(element: Element): Selection | undefined {
			// search for the selection handler
			let parent : Element = element.parent;
			while (parent !== undefined) {
				if ('getSelectionHandler' in parent)
					return (parent as any).getSelectionHandler();
				parent = parent.parent;
			}
			return undefined;
		}
/*
		onSelectionableDragStart() {
			let selection = this.getParentSelectionHandler();
			if (selection && (selection.elements.indexOf(this) == -1))
				selection.elements = [this];
		}
	
		onSelectionableDragEnd() {
			if (this.isSelected) {
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
			console.log(`${this.getClassName()}.select`);
			
			if (this.isLoaded) {
				this.handler = this.getParentSelectionHandler();
				if (this.handler)
					this.handler.elements = [this];
			}
		}
	
		unselect() {
			console.log(`${this.getClassName()}.unselect`);
//			if (this.handler)
//				this.handler.remove(this);
		}

		onUnload() {
//			if (this.handler)
//				this.handler.remove(this);
			super.onUnload();
		}

		private onSelectionablePointerDown(event: PointerEvent) {
			// if not mouse right click or element not enable return
			if (this.isDisabled || event.pointer.type != 'mouse' || event.pointer.button != 2)
				return;	
						
			let selection = this.getParentSelectionHandler();
			if (selection == undefined)
				return;	

			if (selection.elements.indexOf(this) == -1)
				selection.elements = [this];
			
			let actions = selection.getActions();
			
			let count = 0;
			for (let key in actions) { count++; }
			// if not action possible, return
			if (count == 0)
				return false;
						
			let watcher = event.pointer.watch(this);
			this.connect(watcher, 'move', function () {
				if (watcher.pointer.getIsMove())
					watcher.cancel();
			});
			this.connect(watcher, 'up', (event) => {
				watcher.capture();
				watcher.cancel();
			});


			let popup = new MenuPopup();
			let vbox = new Ui.VBox();
			popup.content = vbox;

			for (let actionName in actions) {
				let action = actions[actionName];
				if (action.hidden === true)
					continue;
				let button = new ActionButton();
				button.icon = action.icon;
				button.text = action.text;
				button.action = action;
				button.selection = selection;
				vbox.append(button);
				this.connect(button, 'press', () => popup.close());
			}

			popup.openAt(event.pointer.x, event.pointer.y);
		}*/
	}
}