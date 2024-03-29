namespace Ui {
    export interface ComboInit<T> extends ButtonInit {
        placeHolder?: string;
        field?: keyof T;
        iconField?: keyof T;
        data?: T[];
        position?: number;
        current?: T;
        search?: boolean;
        allowNone?: boolean;
        noneText?: string;
        onchanged?: (event: { target: Combo<T>, value: T, position: number }) => void;
    }

    export class Combo<T = any> extends Button implements ComboInit<T> {
        private _field: keyof T;
        private _iconField?: keyof T;
        private _data: T[];
        private _position: number = -1;
        private _current: T | undefined;
        private _placeHolder: string = '';
        sep: undefined;
        arrowbottom: Icon;
        search: boolean;
        allowNone = false;
        noneText = '';
        readonly changed = new Core.Events<{ target: Combo<T>, value: T, position: number }>();
        set onchanged(value: (event: { target: Combo<T>, value: T, position: number }) => void) { this.changed.connect(value); }

        /**
         * @constructs
         * @class
         * @extends Ui.Pressable
         * @param {String} [config.field] Name of the data's field to display in the list
         * @param [data] Object List
         * @param [currentAt] Default selected object position
         * @param [current] Default selected object
         * @param [placeHolder] Text displays when no selection
         */
        constructor(init?: ComboInit<T>) {
            super(init);

            this.text = this._placeHolder;
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
                if (init.iconField !== undefined)
                    this.iconField = init.iconField;
                if (init.data !== undefined)
                    this.data = init.data;
                if (init.position !== undefined)
                    this.position = init.position;
                if (init.current !== undefined)
                    this.current = init.current;
                if (init.search !== undefined)
                    this.search = init.search;
                if (init.allowNone !== undefined)
                    this.allowNone = init.allowNone;
                if (init.noneText !== undefined)
                    this.noneText = init.noneText;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
            }
        }

        get placeHolder(): string {
            return this._placeHolder;
        }

        set placeHolder(placeHolder: string) {
            this._placeHolder = placeHolder;
            if (this._position === -1)
                this.text = this._placeHolder;
        }

        get field(): keyof T {
            return this._field;
        }

        set field(field: keyof T) {
            this._field = field;
            if (this._data !== undefined)
                this.data = this._data;
        }

        set iconField(field: keyof T) {
            this._iconField = field;
            if (this._data !== undefined)
                this.data = this._data;
        }

        set data(data: T[]) {
            let oldPosition = this.position;
            this._data = data;
            this._position = -1;
            this._current = undefined;
            this.text = this._placeHolder;
            this.position = oldPosition;
        }

        get data(): T[] {
            return this._data;
        }

        get position(): number {
            return this._position;
        }

        set position(position: number) {
            if (this.position == position)
                return;
            if (position === -1) {
                this._position = -1;
                this._current = undefined;
                this.text = this._placeHolder;
                this.icon = undefined;
                this.changed.fire({ target: this, value: this._current!, position: this._position });
            }
            else if ((position >= 0) && (position < this._data.length)) {
                this._current = this._data[position];
                this._position = position;
                this.text = this._current[this._field as string];
                if (this._iconField)
                    this.icon = this._current[this._iconField] as any as string;
                this.changed.fire({ target: this, value: this._current, position: this._position });
            }
        }

        get current(): T | undefined {
            return this._current;
        }

        get value(): T | undefined {
            return this._current;
        }

        set current(current: T | undefined) {
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
            let popup = new Ui.ComboPopup({
                field: this._field,
                iconField: this._iconField
            }).assign({
                data: this._data,
                search: this.search,
                allowNone: this.allowNone,
                noneText: this.noneText
            });
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

    export interface ComboPopupInit<T> extends MenuPopupInit {
        search?: boolean;
        allowNone?: boolean;
        noneText?: string;
        field?: keyof T;
        iconField?: keyof T;
        data?: T[];
        position?: number;
    }

    export class ComboPopup<T> extends MenuPopup {
        private list = new VBox();
        private _allowNone = false;
        private _data: T[];
        private _field: keyof T;
        private _iconField?: keyof T;
        private searchField = new TextField();
        private emptyField = new ComboItem();
        readonly item = new Core.Events<{ target: ComboPopup<T>, item: ComboItem, position: number }>();

        constructor(init?: ComboPopupInit<T>) {
            super(init);
            this.autoClose = true;

            this.content = new VBox().assign({
                content: [
                    this.searchField.assign({
                        textHolder: 'Recherche', margin: 5,
                        onchanged: (e) => this.onSearchChange(e.target, e.value)
                    }),
                    this.emptyField.assign({
                        text: '',
                        onpressed: () => {
                            this.item.fire({ target: this, item: this.emptyField, position: -1 });
                            this.close();
                        }
                    }),
                    this.list
                ]
            });

            this.searchField.hide(true);
            this.emptyField.hide(true);

            if (init) {
                if (init.search !== undefined)
                    this.search = init.search;
                if (init.allowNone !== undefined)
                    this.allowNone = init.allowNone;
                if (init.noneText !== undefined)
                    this.noneText = init.noneText;
                if (init.field !== undefined)
                    this.field = init.field;
                if (init.iconField !== undefined)
                    this.iconField = init.iconField;
                if (init.data !== undefined)
                    this.data = init.data;
                if (init.position !== undefined)
                    this.position = init.position;
            }
        }

        private onSearchChange(field: TextField, value: string) {
            if (value == '' && this.allowNone)
                this.emptyField.show();
            else
                this.emptyField.hide(true);
            this.list.children.forEach((element) => {
                let item = element as ComboItem;
                if (value == '')
                    item.show();
                else {
                    let text = Core.Util.toNoDiacritics(item.text??'').toLocaleLowerCase();
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

        get allowNone(): boolean {
            return this._allowNone;
        }

        set allowNone(value: boolean) {
            this._allowNone = value;
            if (value)
                this.emptyField.show();
            else
                this.emptyField.hide(true);
        }

        get noneText(): string | undefined {
            return this.emptyField.text;
        }

        set noneText(value: string | undefined) {
            this.emptyField.text = value;
        }

        get field(): keyof T {
            return this._field;
        }

        set field(field: keyof T) {
            this._field = field;
            if (this._data !== undefined)
                this.data = this._data;
        }

        get iconField(): keyof T | undefined {
            return this._iconField;
        }

        set iconField(field: keyof T | undefined) {
            this._iconField = field;
            if (this._data !== undefined)
                this.data = this._data;
        }

        set data(data: T[]) {
            this._data = data;
            if (this._field === undefined)
                return;
            for (let i = 0; i < data.length; i++) {
                let item = new ComboItem({
                    text: data[i][this._field as string],
                    onpressed: () => this.onItemPress(item)
                });
                if (this._iconField)
                    item.icon = data[i][this._iconField];
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

