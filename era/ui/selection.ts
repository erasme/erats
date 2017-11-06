namespace Ui {
	export class Selection extends Core.Object {
		elements: Selectionable[] = undefined;

		constructor() {
			super();
			this.addEvents('change');
			this.elements = [];
		}

		clear() {
			let currentElements = this.elements;
			this.elements = [];
			for (let i = 0; i < currentElements.length; i++) {
				this.connect(currentElements[i], 'unload', this.onElementUnload);
				currentElements[i].setIsSelected(false);
			}
			this.fireEvent('change', this);
		}

		append(element: Selectionable) {
			let i;
			// test if we already have it
			let found = false;
			for (i = 0; !found && (i < this.elements.length); i++)
				found = (this.elements[i] === element);
			if (!found) {
				let hasMultiple = false;
				let actions = this.getElementActions(element);
				for (let actionName in actions) {
					if (actions[actionName].multiple === true)
						hasMultiple = true;
				}
				// test compatibility with other elements
				if (this.elements.length > 0) {
					let compat = true;
					for (i = 0; compat && (i < this.elements.length); i++) {
						let otherCompat = false;
						let otherActions = this.getElementActions(this.elements[i]);
						for (let actionKey in actions) {
							let action = actions[actionKey];
							if (action.multiple === true) {
								for (let otherActionKey in otherActions) {
									let otherAction = otherActions[otherActionKey];
									if ((otherAction.multiple === true) && (otherAction.callback === action.callback)) {
										otherCompat = true;
										break;
									}
								}
							}
						}
						compat = compat && otherCompat;
					}
					// if not compatible, remove old selection
					if (!compat || !hasMultiple) {
						for (i = 0; i < this.elements.length; i++)
							this.elements[i].setIsSelected(false);
						this.elements = [];
					}
				}
				this.elements.push(element);
				this.connect(element, 'unload', this.onElementUnload);
				this.fireEvent('change', this);
			}
		}
	
		remove(element: Selectionable) {
			// test if we already have it
			let foundPos;
			for (let i = 0; (foundPos === undefined) && (i < this.elements.length); i++)
				if (this.elements[i] === element)
					foundPos = i;
			if (foundPos !== undefined) {
				this.elements.splice(foundPos, 1);
				this.disconnect(element, 'unload', this.onElementUnload);
				this.fireEvent('change', this);
			}
		}
	
		getElements(): Selectionable[] {
			// return a copy, because action on elements might change
			// the elements list
			return this.elements.slice();
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
			if (this.elements.length === 0)
				return undefined;
			else {
				if (this.elements.length === 1) {
					actions = {};
					allActions = this.getElementActions(this.elements[0]);
					for (actionName in allActions) {
						action = allActions[actionName];
						if (!('testRight' in action) || action.testRight.call(this.elements[0]))
							actions[actionName] = allActions[actionName];
					}
					return actions;
				}
				// return only actions that support multiple element
				else {
					actions = {};
					allActions = this.getElementActions(this.elements[0]);
					for (actionName in allActions) {
						action = allActions[actionName];
						if (action.multiple === true) {
							let compat = true;
							for (let i = 1; compat && (i < this.elements.length); i++) {
								let otherCompat = false;
								let otherActions = this.getElementActions(this.elements[i]);
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
									for (let i = 0; allowed && (i < this.elements.length); i++) {
										allowed = allowed && action.testRight.call(this.elements[i]);
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