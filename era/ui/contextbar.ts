namespace Ui
{
    export class ContextBarCloseButton extends Button
    {
        constructor() {
            super();
        }

        static style: any = {
            textWidth: 5,
            radius: 0,
            borderWidth: 0,
            foreground: 'rgba(250,250,250,1)',
            background: 'rgba(60,60,60,0)'
        }
    }

    export interface ContextBarInit extends LBoxInit {
        selection?: Selection;
    }

    export class ContextBar extends LBox implements ContextBarInit
    {
        bg: Rectangle;
        private _selection: Selection;
        actionsBox: Box;
        closeButton: ContextBarCloseButton;

        constructor(init?: ContextBarInit) {
            super(init);

            this.bg = new Ui.Rectangle();
            this.append(this.bg);

            let hbox = new Ui.HBox();
            hbox.spacing = 5;
            this.append(hbox);
        
            this.closeButton = new Ui.ContextBarCloseButton();
            this.closeButton.icon = 'backarrow';
            this.closeButton.title = 'Annuler la sélection';
            hbox.append(this.closeButton);
            this.closeButton.pressed.connect(() => this.onClosePress());

            let scroll = new Ui.ScrollingArea();
            hbox.append(scroll, true);

            this.actionsBox = new Ui.HBox();
            this.actionsBox.spacing = 5;
            scroll.content = this.actionsBox;

            if (init) {
                if (init.selection !== undefined)
                    this.selection = init.selection;	
            }
        }

        get selection(): Selection {
            return this._selection;
        }

        set selection(selection: Selection) {
            if (this._selection != undefined)
                this._selection.changed.disconnect(this.onSelectionChange);
            this._selection = selection;
            if (this._selection != undefined)
                this._selection.changed.connect(this.onSelectionChange);
        }
    
        onClosePress() {
            this._selection.clear();
        }
    
        onSelectionChange = () => {
            this.closeButton.text = this._selection.elements.length.toString();
            let actions = this._selection.getActions();
            this.actionsBox.clear();
            this.actionsBox.append(new Element(), true);
            for (let actionName in actions) {
                let action = actions[actionName];
                if (action.hidden === true)
                    continue;
                let button = new ActionButton();
                button.icon = action.icon;
                button.text = action.text;
                button.action = action;
                button.selection = this._selection;
                this.actionsBox.append(button);
            }
        }

        onStyleChange() {
            this.bg.fill = this.getStyleProperty('background');
        }

        static style: any = {
            background: '#07a0e5'
        }
    }
}	
