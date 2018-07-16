namespace Ui {

    export interface SelectionAction {
        default?: boolean;
        text: string;
        icon: string;
        callback?: (selection: Selection) => void;
        multiple?: boolean;
        hidden?: boolean;
        testRight?: (watcher: SelectionableWatcher) => boolean;
    }

    export interface SelectionActions {
        [key: string]: SelectionAction;
    }

    export class SelectionableWatcher extends Core.Object {
        readonly element: Element;
        readonly selectionActions?: SelectionActions;
        private _isSelected: boolean = false;
        private handler: Selection | undefined;
        private select?: (selection: Selection) => void;
        private unselect?: (selection: Selection) => void;
        private draggableWatcher?: DraggableWatcher;

        constructor(init: {
            element: Element,
            selectionActions?: SelectionActions,
            dragSelect?: boolean,
            pressSelect?: boolean,
            onselected?: (selection: Selection) => void,
            onunselected?: (selection: Selection) => void,
            draggable?: boolean
        }) {
            super();
            this.element = init.element;
            this.element.focusable = true;
            if (init.selectionActions)
                this.selectionActions = init.selectionActions;
            this.element['Ui.SelectionableWatcher.watcher'] = this;
            if (init.onselected)
                this.select = init.onselected;
            if (init.onunselected)
                this.unselect = init.onunselected;
            new PressWatcher({
                element: this.element,
                ondelayedpress: (w) => this.onDelayedPress(w),
                onactivated: (w) => this.onSelectionableActivate(w)
            });
            if (init.draggable === true)
                this.draggable = init.draggable;
        }

        static getSelectionableWatcher(element: Element): SelectionableWatcher | undefined {
            return element['Ui.SelectionableWatcher.watcher'];
        }

        static getIsSelectionableItem(element: Element): boolean {
            // TODO: remove instanceof
            return (element instanceof Selectionable) || (SelectionableWatcher.getSelectionableWatcher(element) != undefined);
        }

        get draggable(): boolean {
            return this.draggableWatcher !== undefined;
        }

        set draggable(value: boolean) {
            if (value !== this.draggable) {
                if (value)
                    this.draggableWatcher = new DraggableWatcher({
                        element: this.element,
                        data: this.element,
                        start: (w) => this.onSelectionableDragStart(w),
                        end: (w) => this.onSelectionableDragEnd(w)
                    });
                else {
                    this.draggableWatcher.dispose();
                    this.draggableWatcher = undefined;
                }
            }
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
    }

    export interface SelectionableInit extends LBoxInit {
    }

    export class Selectionable extends LBox implements SelectionableInit {
        //private _isSelected: boolean = false;
        //private handler: Selection | undefined;
        private selectionWatcher: SelectionableWatcher;
        readonly selected = new Core.Events<{ target: Selectionable }>();
        set onselected(value: (event: { target: Selectionable }) => void) { this.selected.connect(value); }
        readonly unselected = new Core.Events<{ target: Selectionable }>();
        set onunselected(value: (event: { target: Selectionable }) => void) { this.unselected.connect(value); }

        constructor(init?: SelectionableInit) {
            super(init);

            this.selectionWatcher = new SelectionableWatcher({
                element: this,
                selectionActions: this.getSelectionActions(),
                onselected: (s) => this.onSelect(s),
                onunselected: (s) => this.onUnselect(s)
            });
        }

        get isSelected(): boolean {
            return this.selectionWatcher.isSelected;
        }

        set isSelected(isSelected: boolean) {
            this.selectionWatcher.isSelected = isSelected;
        }

        protected onSelect(selection: Selection) {
            this.selected.fire({ target: this });
        }

        protected onUnselect(selection: Selection) {
            this.unselected.fire({ target: this });
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
            let parent: Element = element.parent;
            while (parent !== undefined) {
                if ('getSelectionHandler' in parent)
                    return (parent as any).getSelectionHandler();
                parent = parent.parent;
            }
            return undefined;
        }
    }
}