namespace Ui {
	export class Selection extends Core.Object {
		private _elements: Selectionable[];
		private watchers: SelectionableWatcher[];

		constructor() {
			super();
			this.addEvents('change');
			this._elements = [];
			this.watchers = [];
		}

		clear() {			
			let change = false;
			while (this._elements.length > 0) {
				if (this.internalRemove(this._elements[0]))
					change = true;	
			}
			if (change)
				this.fireEvent('change', this);
		}

		appendRange(start: Selectionable, end: Selectionable) {
			let change = false;
			let res = this.findRangeElements(start, end);
			res.forEach(el => { if (this.internalAppend(el)) change = true; });
			if (end.focusable)
				end.focus();	
			if (change)
				this.fireEvent('change', this);	
		}

		append(elements: Array<Selectionable> | Selectionable) {
			let change = false;
			if (elements instanceof Selectionable) {
				if (this.internalAppend(elements))
					change = true;
				if (elements.focusable)
					elements.focus();	
			}
			else {
				elements.forEach(el => { if (this.internalAppend(el)) change = true });
				if (elements[elements.length - 1].focusable)
					elements[elements.length - 1].focus();
			}
			if (change)
				this.fireEvent('change', this);	
		}

		extend(end: Selectionable) {
			if (this._elements.length == 0)
				this.append(end);
			else {
				let focusElement = this._elements.find(el => el.hasFocus);
				if (!focusElement)
					focusElement = this._elements[0];
				
				let res = this.findRangeElements(focusElement, end);
				this.elements = res;
			}
		}

		findRangeElements(start: Selectionable, end: Selectionable): Array<Selectionable> {
			let start_parents = new Array<Element>();
			let parent = start.parent;
			while (parent) {
				start_parents.push(parent);
				parent = parent.parent;
			}

			let common_parent: Element;
			parent = end.parent;
			while (parent && !common_parent) {
				let pos = start_parents.indexOf(parent);
				if (pos != -1)
					common_parent = parent;
				parent = parent.parent;
			}

			let all = new Array<Selectionable>();
			let add_selectionable = (el: Element) => {
				//if (SelectionableWatcher.getIsSelectionableItem(el))
				if (el instanceof Selectionable)	
					all.push(el);
				else if (el instanceof Container)
					el.children.forEach(el2 => add_selectionable(el2));
			};
			add_selectionable(common_parent);

			let start_pos = all.indexOf(start);
			let end_pos = all.indexOf(end);
			let res = new Array<Selectionable>();
			for (let i = Math.min(start_pos, end_pos); i <= Math.max(start_pos, end_pos); i++)
				res.push(all[i]);

			return res;
		}

		private internalAppend(element: Selectionable): boolean {
			// test if we already have it
			if (this._elements.indexOf(element) != -1)
				return false;
			this._elements.push(element);
			this.connect(element, 'unload', this.onElementUnload);
			element.onSelect(this);
			return true;
		}
	
		remove(element: Array<Selectionable> | Selectionable) {
			let change = false;
			if (element instanceof Selectionable) {
				if (this.internalRemove(element))
					change = true;
			}
			else
				element.forEach(el => { if (this.internalRemove(el)) change = true });
			if (change)
				this.fireEvent('change', this);	
		}

		private internalRemove(element: Selectionable): boolean  {
			// test if we already have it
			let foundPos = this.elements.indexOf(element);
			if (foundPos != -1) {
				this._elements.splice(foundPos, 1);
				this.disconnect(element, 'unload', this.onElementUnload);
				element.onUnselect(this);
				return true;
			}
			return false;
		}
	
		get elements(): Selectionable[] {
			// return a copy, because action on elements might change
			// the elements list
			return this._elements.slice();
		}

		set elements(elements: Selectionable[]) {
			let removeList = new Array<Selectionable>();
			let addList = new Array<Selectionable>();
			elements.forEach(el => {
				if (this._elements.indexOf(el) == -1)
					addList.push(el);	
			});
			this._elements.forEach(el => {
				if (elements.indexOf(el) == -1)
					removeList.push(el);
			});
			removeList.forEach(el => this.internalRemove(el));
			addList.forEach(el => this.internalAppend(el));
			if (elements.length > 0 && elements[elements.length - 1].focusable)
				elements[elements.length - 1].focus();
			if (addList.length > 0 || removeList.length > 0)
				this.fireEvent('change', this);	
		}

		getElementActions(element: Selectionable) {
			let actions = Core.Util.clone(element.getSelectionActions());
			// handle parent context actions
			let current = element.parent;
			while (current != undefined) {
				if ('getContextActions' in current)
					actions = (current as any).getContextActions(element, actions);
				current = current.parent;
			}
			return actions;
		}

		getActions() {
			let actions; let allActions; let actionName; let action;
			if (this._elements.length === 0)
				return undefined;
			else {
				if (this._elements.length === 1) {
					actions = {};
					allActions = this.getElementActions(this._elements[0]);
					for (actionName in allActions) {
						action = allActions[actionName];
						if (!('testRight' in action) || action.testRight.call(this._elements[0]))
							actions[actionName] = allActions[actionName];
					}
					return actions;
				}
				// return only actions that support multiple element
				else {
					actions = {};
					allActions = this.getElementActions(this._elements[0]);
					for (actionName in allActions) {
						action = allActions[actionName];
						if (action.multiple === true) {
							let compat = true;
							for (let i = 1; compat && (i < this._elements.length); i++) {
								let otherCompat = false;
								let otherActions = this.getElementActions(this._elements[i]);
								for (let otherActionKey in otherActions) {
									let otherAction = otherActions[otherActionKey];
									if ((otherAction.multiple === true) && (otherAction.callback === action.callback)) {
										otherCompat = true;
										break;
									}
								}
								compat = compat && otherCompat;
							}
							if (compat) {
								let allowed = true;
								// test rights for all elements
								if ('testRight' in action) {
									for (let i = 0; allowed && (i < this._elements.length); i++) {
										allowed = allowed && action.testRight.call(this._elements[i]);
									}
								}
								if (allowed)
									actions[actionName] = allActions[actionName];
							}
						}
					}
					return actions;
				}
			}
		}
	
		getDefaultAction() {
			let actions = this.getActions();
			for (let actionName in actions) {
				if (actions[actionName]['default'] === true)
					return actions[actionName];
			}
			return undefined;
		}
	
		executeDefaultAction() {
			let action = this.getDefaultAction();
			if (action !== undefined) {
				let scope = this;
				if ('scope' in action)
					scope = action.scope;
				action.callback.call(scope, this);
				this.clear();
				return true;
			}
			else {
				return false;
			}
		}
	
		getDeleteAction() {
			let actions = this.getActions();
			if ('delete' in actions)
				return actions['delete'];
			else if (actions.suppress !== undefined)
				return actions.suppress;
			else
				return undefined;
		}
	
		executeDeleteAction() {
			let action = this.getDeleteAction();
			if (action !== undefined) {
				let scope = this;
				if ('scope' in action)
					scope = action.scope;
				action.callback.call(scope, this);
				this.clear();
				return true;
			}
			else {
				return false;
			}
		}
	
		onElementUnload(element: Selectionable) {
			// remove the element from the selection
			// if removed from the DOM
			this.remove(element);
		}
	}
}