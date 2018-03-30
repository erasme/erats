namespace Ui {
	export class Selection extends Core.Object {
		private _watchers: SelectionableWatcher[];
		readonly changed = new Core.Events<{ target: Selection }>();

		constructor() {
			super();
			this._watchers = [];
		}

		clear() {			
			let change = false;
			while (this._watchers.length > 0) {
				if (this.internalRemove(this._watchers[0]))
					change = true;	
			}
			if (change)
				this.changed.fire({ target: this });
		}

		appendRange(start: SelectionableWatcher, end: SelectionableWatcher) {
			let change = false;
			let res = this.findRangeElements(start, end);
			res.forEach(el => { if (this.internalAppend(el)) change = true; });
			if (end.element.focusable)
				end.element.focus();	
			if (change)
				this.changed.fire({ target: this });
		}

		append(elements: Array<SelectionableWatcher> | SelectionableWatcher) {
			let change = false;
			if (elements instanceof SelectionableWatcher) {
				if (this.internalAppend(elements))
					change = true;
				if (elements.element.focusable)
					elements.element.focus();	
			}
			else {
				elements.forEach(el => { if (this.internalAppend(el)) change = true });
				if (elements[elements.length - 1].element.focusable)
					elements[elements.length - 1].element.focus();
			}
			if (change)
				this.changed.fire({ target: this });	
		}

		extend(end: SelectionableWatcher) {
			if (this._watchers.length == 0)
				this.append(end);
			else {
				let focusElement = this._watchers.find(el => el.element.hasFocus);
				if (!focusElement)
					focusElement = this._watchers[0];
				
				this.watchers = this.findRangeElements(focusElement, end);
			}
		}

		findRangeElements(start: SelectionableWatcher, end: SelectionableWatcher): Array<SelectionableWatcher> {
			let start_parents = new Array<Element>();
			let parent = start.element.parent;
			while (parent) {
				start_parents.push(parent);
				parent = parent.parent;
			}

			let common_parent: Element;
			parent = end.element.parent;
			while (parent && !common_parent) {
				let pos = start_parents.indexOf(parent);
				if (pos != -1)
					common_parent = parent;
				parent = parent.parent;
			}

			let all = new Array<SelectionableWatcher>();
			let add_selectionable = (el: Element) => {
				let w = SelectionableWatcher.getSelectionableWatcher(el);
				if (w)	
					all.push(w);
				else if (el instanceof Container)
					el.children.forEach(el2 => add_selectionable(el2));
			};
			add_selectionable(common_parent);

			let start_pos = all.indexOf(start);
			let end_pos = all.indexOf(end);
			let res = new Array<SelectionableWatcher>();
			for (let i = Math.min(start_pos, end_pos); i <= Math.max(start_pos, end_pos); i++)
				res.push(all[i]);

			return res;
		}

		private internalAppend(watcher: SelectionableWatcher): boolean {
			// test if we already have it
			if (this._watchers.indexOf(watcher) != -1)
				return false;
			this._watchers.push(watcher);
			watcher.element.unloaded.connect(this.onElementUnload);
			watcher.onSelect(this);
			return true;
		}
	
		remove(watcher: Array<SelectionableWatcher> | SelectionableWatcher) {
			let change = false;
			if (watcher instanceof SelectionableWatcher) {
				if (this.internalRemove(watcher))
					change = true;
			}
			else
				watcher.forEach(w => { if (this.internalRemove(w)) change = true });
			if (change)
				this.changed.fire({ target: this });
		}

		private internalRemove(watcher: SelectionableWatcher): boolean  {
			// test if we already have it
			let foundPos = this._watchers.indexOf(watcher);
			if (foundPos != -1) {
				this._watchers.splice(foundPos, 1);
				watcher.element.unloaded.disconnect(this.onElementUnload);
				watcher.onUnselect(this);
				return true;
			}
			return false;
		}
	
		get watchers(): Array<SelectionableWatcher> {
			return this._watchers.slice();
		}

		set watchers(watchers: Array<SelectionableWatcher>) {
			let removeList = new Array<SelectionableWatcher>();
			let addList = new Array<SelectionableWatcher>();
			watchers.forEach(w => {
				if (this._watchers.indexOf(w) == -1)
					addList.push(w);
			});
			this._watchers.forEach(w => {
				if (watchers.indexOf(w) == -1)
					removeList.push(w);
			});
			removeList.forEach(el => this.internalRemove(el));
			addList.forEach(el => this.internalAppend(el));
			if (watchers.length > 0 && watchers[watchers.length - 1].element.focusable)
			watchers[watchers.length - 1].element.focus();
			if (addList.length > 0 || removeList.length > 0)
				this.changed.fire({ target: this });	
		}

		get elements(): Element[] {
			// return a copy, because action on elements might change
			// the elements list
			return this._watchers.map(w => w.element);
		}

		set elements(elements: Element[]) {
			this.watchers = elements.map(el => SelectionableWatcher.getSelectionableWatcher(el));
		}

		getElementActions(watcher: SelectionableWatcher) {
			let actions = Core.Util.clone(watcher.selectionActions) as SelectionActions;
			// handle parent context actions
			let current = watcher.element.parent;
			while (current != undefined) {
				if ('getContextActions' in current)
					actions = (current as any).getContextActions(watcher.element, actions);
				current = current.parent;
			}
			return actions;
		}

		getActions() {
			let actions: SelectionActions;
			if (this._watchers.length === 0)
				return undefined;
			else {
				if (this._watchers.length === 1) {
					actions = {};
					let allActions = this.getElementActions(this._watchers[0]);
					for (let actionName in allActions) {
						let action = allActions[actionName];
						if (!action.testRight || action.testRight(this._watchers[0]))
							actions[actionName] = allActions[actionName];
					}
					return actions;
				}
				// return only actions that support multiple element
				else {
					actions = {};
					let allActions = this.getElementActions(this._watchers[0]);
					for (let actionName in allActions) {
						let action = allActions[actionName];
						if (action.multiple === true) {
							let compat = true;
							for (let i = 1; compat && (i < this._watchers.length); i++) {
								let otherCompat = false;
								let otherActions = this.getElementActions(this._watchers[i]);
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
								if (action.testRight) {
									for (let i = 0; allowed && (i < this._watchers.length); i++) {
										allowed = allowed && action.testRight(this._watchers[i]);
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
				if (actions[actionName].default === true)
					return actions[actionName];
			}
			return undefined;
		}
	
		executeDefaultAction() {
			let action = this.getDefaultAction();
			if (action !== undefined) {
				action.callback(this);
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
				action.callback(this);
				this.clear();
				return true;
			}
			else {
				return false;
			}
		}
	
		onElementUnload = (e: { target: Element }) => {
			// remove the element from the selection
			// if removed from the DOM
			let watcher = SelectionableWatcher.getSelectionableWatcher(e.target);
			this.remove(watcher);
		}
	}
}