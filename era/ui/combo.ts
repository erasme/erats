namespace Ui {
    export interface ComboInit extends ButtonInit {
        placeHolder?: string;
        field?: string;
        data?: any[];
        position?: number;
        current?: any;
        search?: boolean;
        onchanged?: (event: { target: Combo, value: any, position: number }) => void;
    }

    export class Combo extends Button implements ComboInit {
        private _field: string;
        private _data: any[];
        private _position: number = -1;
        private _current: any;
        private _placeHolder: string = '...';
        sep: undefined;
        arrowbottom: Icon;
        search: boolean;
        readonly changed = new Core.Events<{ target: Combo, value: any, position: number }>();
        set onchanged(value: (event: { target: Combo, value: any, position: number }) => void) { this.changed.connect(value); }

        /**
         * @constructs
         * @class
         * @extends Ui.Pressable
         * @param {String} [config.field] Name of the data's field to display in the list
         * @param [config.data] Object List
         * @param [currentAt] Default selected object position
         * @param [current] Default selected object
         * @param [placeHolder] Text displays when no selection
         */
        constructor(init?: ComboInit) {
            super(init);

            this.text = '';
            this.arrowbottom = new Icon({ icon: 'arrowbottom', width: 16, height: 16 });

            this.marker = new Ui.VBox({
                verticalAlign: 'center', marginRight: 5,
                content: [this.arrowbottom]
            });
            if (init) {
                if (init.placeHolder !== undefined)
                    this.placeHolder = init.placeHolder;
                if (init.field !== undefined)
                    this.field = init.field;
                if (init.data !== undefined)
                    this.data = init.data;
                if (init.position !== undefined)
                    this.position = init.position;
                if (init.current !== undefined)
                    this.current = init.current;
                if (init.search !== undefined)
                    this.search = init.search;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
            }
        }

        set placeHolder(placeHolder: string) {
            this._placeHolder = placeHolder;
            if (this._position === -1)
                this.text = this._placeHolder;
        }

        set field(field: string) {
            this._field = field;
            if (this._data !== undefined)
                this.data = this._data;
        }

        set data(data: any[]) {
            this._data = data;
        }

        get data(): any[] {
            return this._data;
        }

        get position(): number {
            return this._position;
        }

        set position(position: number) {
            if (position === -1) {
                this._position = -1;
                this._current = undefined;
                this.text = this._placeHolder;
                this.changed.fire({ target: this, value: this._current, position: this._position });
            }
            else if ((position >= 0) && (position < this._data.length)) {
                this._current = this._data[position];
                this._position = position;
                this.text = this._current[this._field];
                this.changed.fire({ target: this, value: this._current, position: this._position });
            }
        }

        get current(): any {
            return this._current;
        }

        get value(): any {
            return this._current;
        }

        set current(current: any) {
            if (current == undefined)
                this.position = -1;
            let position = -1;
            for (let i = 0; i < this._data.length; i++) {
                if (this._data[i] == current) {
                    position = i;
                    break;
                }
            }
            if (position != -1)
                this.position = position;
        }

        protected onItemPress(popup, item, position) {
            this.position = position;
        }

        protected onPress() {
            let popup = new Ui.ComboPopup({ field: this._field, data: this._data, search: this.search });
            if (this._position !== -1)
                popup.position = this._position;
            popup.item.connect(e => this.onItemPress(e.target, e.item, e.position));
            popup.openElement(this, 'bottom');
        }

        protected updateColors() {
            super.updateColors();
            this.arrowbottom.fill = this.getForegroundColor();
        }

        protected onDisable() {
            super.onDisable();
            this.arrowbottom.opacity = 0.1;
        }

        protected onEnable() {
            super.onEnable();
            this.arrowbottom.opacity = 1;
        }

        static style: object = {
            textTransform: 'none',
            textAlign: 'left'
        }
    }

    export interface ComboPopupInit extends MenuPopupInit {
        search?: boolean;
        field?: string;
        data?: any[];
        position?: number;
    }

    export class ComboPopup extends MenuPopup {
        private list: VBox;
        private _data: any[];
        private _field: string;
        private searchField: TextField;
        readonly item = new Core.Events<{ target: ComboPopup, item: ComboItem, position: number }>();

        constructor(init?: ComboPopupInit) {
            super(init);
            this.autoClose = true;

            let vbox = new VBox();
            this.searchField = new TextField({ textHolder: 'Recherche', margin: 5 });
            this.searchField.hide(true);
            this.searchField.changed.connect((e) => this.onSearchChange(e.target, e.value));
            vbox.append(this.searchField);
            this.content = vbox;

            this.list = new VBox();
            vbox.append(this.list);
            //this.content = this.list;

            if (init) {
                if (init.search !== undefined)
                    this.search = init.search;
                if (init.field !== undefined)
                    this.field = init.field;
                if (init.data !== undefined)
                    this.data = init.data;
                if (init.position !== undefined)
                    this.position = init.position;
            }
        }

        private onSearchChange(field: TextField, value: string) {
            this.list.children.forEach((item: ComboItem) => {
                if (value == '')
                    item.show();
                else {
                    let text = Core.Util.toNoDiacritics(item.text).toLocaleLowerCase();
                    let search = Core.Util.toNoDiacritics(value).toLowerCase().split(' ');
                    if (search.length == 0)
                        item.show();
                    else {
                        let match = true;
                        for (let i = 0; match && (i < search.length); i++) {
                            let word = search[i];
                            match = (text.indexOf(word) != -1);
                        }
                        if (match)
                            item.show();
                        else
                            item.hide(true);
                    }
                }
            });
        }

        set search(value: boolean) {
            if (value)
                this.searchField.show();
            else
                this.searchField.hide(true);
        }

        set field(field: string) {
            this._field = field;
            if (this._data !== undefined)
                this.data = this._data;
        }

        set data(data: any[]) {
            this._data = data;
            if (this._field === undefined)
                return;
            for (let i = 0; i < data.length; i++) {
                let item = new ComboItem({
                    text: data[i][this._field],
                    onpressed: () => this.onItemPress(item)
                });
                this.list.append(item);
            }
        }

        set position(position: number) {
            (this.list.children[position] as ComboItem).isActive = true;
        }

        protected onItemPress(item: ComboItem) {
            let position = -1;
            for (let i = 0; i < this.list.children.length; i++) {
                if (this.list.children[i] == item) {
                    position = i;
                    break;
                }
            }
            this.item.fire({ target: this, item: item, position: position });
            this.close();
        }
    }

    export class ComboItem extends Button {
        static style: object = {
            borderWidth: 0,
            textTransform: 'none',
            textAlign: 'left'
        }
    }
}

