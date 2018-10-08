namespace Ui {

    export interface HeaderDef {
        width?: number;
        type: string;
        title: string | Element;
        key?: string;
        colWidth?: number;
        ui?: typeof ListViewCell;
        resizable?: boolean;
    }

    export class ListViewHeader extends Pressable {
        protected ui: Element;
        protected background = new Rectangle();
        protected sortBox = new Ui.HBox();
        protected sortOrderLabel = new Ui.Label();
        protected sortArrow = new Ui.Icon();
        protected _sortOrder: number | undefined;
        protected _sortInvert: boolean = false;

        constructor(readonly headerDef: HeaderDef) {
            super();
            if (headerDef.title instanceof Element)
                this.ui = headerDef.title;
            else
                this.ui = new Label().assign({ text: headerDef.title, margin: 4, fontWeight: 'bold' });
            this.ui.resizable = true;

            this.content = [
                this.sortBox.assign({
                    isVisible: false,
                    horizontalAlign: 'right', verticalAlign: 'center',
                    content: [
                        this.sortOrderLabel.assign({ fontSize: 10, fontWeight: 'bold', text: '1' }),
                        this.sortArrow.assign({ icon: 'sortarrow', width: 16, height: 16 })
                    ]
                }),
                new Ui.VBox().assign({
                    content: [
                        new Ui.HBox().assign({
                            resizable: true,
                            content: [
                                this.ui,
                                new ListViewColBar(this, this.headerDef)
                            ]
                        }),
                        this.background.assign({ height: 4 })
                    ]
                })
            ];

            this.downed.connect(() => this.onListViewHeaderDown());
            this.upped.connect(() => this.onListViewHeaderUp());
        }

        set sort(value: { order: number | undefined, invert: boolean }) {
            this._sortOrder = value.order;
            this._sortInvert = value.invert;
            this.sortBox.isVisible = (value.order != undefined);
            if (value.order == undefined)
                this.sortBox.hide();
            else {
                this.sortBox.show();
                this.sortOrderLabel.text = (value.order > 1) ? value.order.toFixed().toString() : '';
                if (value.invert)
                    this.sortArrow.transform = Matrix.createRotate(180);
                else
                    this.sortArrow.transform = undefined;
            }
        }

        get sort(): { order: number | undefined, invert: boolean } {
            return { order: this._sortOrder, invert: this._sortInvert };
        }

        protected getColor() {
            return Ui.Color.create(this.getStyleProperty('color'));
        }

        protected getColorDown() {
            let yuv = Color.create(this.getStyleProperty('color')).getYuv();
            return Color.createFromYuv(yuv.y + 0.40, yuv.u, yuv.v);
        }

        protected onListViewHeaderDown() {
            this.background.fill = this.getColorDown();
        }

        protected onListViewHeaderUp() {
            this.background.fill = this.getColor();
        }

        protected onStyleChange() {
            this.background.fill = this.getStyleProperty('color');
        }

        static style: object = {
            color: '#444444'
        }
    }

    class ListViewHeaderSortPopup<T> extends Ui.Popup {
        private _changedLock = false;
        private vbox = new Ui.VBox();
        private fields = new Array<{ box: Ui.HBox, field: Ui.Combo<HeaderDef>, dir: Ui.Combo<{ name: 'Asc' | 'Desc', value: boolean }> }>()
        readonly changed = new Core.Events<{ target: ListViewHeaderSortPopup<T>, sortOrder: Array<{ key: keyof T, invert: boolean }> }>();
        set onchanged(value: (event: { target: ListViewHeaderSortPopup<T>, sortOrder: Array<{ key: keyof T, invert: boolean }> }) => void) { this.changed.connect(value); }

        constructor(private headers: HeaderDef[]) {
            super();

            this.content = this.vbox.assign({
                padding: 10, spacing: 10,
                content: [
                    new Ui.Label().assign({ text: 'Ordre de tri', fontWeight: 'bold', horizontalAlign: 'left' })
                ]
            });

            for (let i = 0; i < 3; i++) {
                let sortBox = new Ui.HBox();
                if (i > 0)
                    sortBox.disable();
                let sortField = new Ui.Combo<HeaderDef>();
                let sortDir = new Ui.Combo<{ name: 'Asc' | 'Desc', value: boolean }>();
                let field = { box: sortBox, field: sortField, dir: sortDir, position: i };
                sortBox.assign({
                    spacing: 10,
                    content: [
                        sortField.assign({
                            field: 'title', allowNone: true,
                            data: this.headers.filter(h => h.key != undefined),
                            onchanged: () => this.onChanged(field)
                        }),
                        sortDir.assign({
                            field: 'name',
                            data: [
                                { name: 'Asc', value: false },
                                { name: 'Desc', value: true }
                            ],
                            onchanged: () => this.onChanged(field)
                        })
                    ]
                });
                this.vbox.append(sortBox);
                this.fields.push(field);
            }
        }

        protected onChanged(field: { box: Ui.HBox, field: Ui.Combo<HeaderDef>, dir: Ui.Combo, position: number }) {
            if (this._changedLock)
                return;
            this._changedLock = true;
            try {
                this.updateFields();
            } catch (e) { }
            this._changedLock = false;
            this.changed.fire({ target: this, sortOrder: this.sortOrder });
        }

        protected updateFields() {
            let needClear = false;
            for (let i = 0; i < this.fields.length; i++) {
                if (needClear) {
                    this.fields[i].box.disable();
                    this.fields[i].dir.position = -1;
                    this.fields[i].field.position = -1;
                }
                else {
                    this.fields[i].box.enable();
                    if (this.fields[i].field.position == -1) {
                        this.fields[i].dir.position = -1;
                        needClear = true;
                    }
                    else {
                        if (this.fields[i].dir.position == -1)
                            this.fields[i].dir.position = 0;
                    }
                }
            }
        }

        set sortOrder(value: Array<{ key: keyof T, invert: boolean }>) {
            this._changedLock = true;
            for (let i = 0; i < value.length && i < this.fields.length; i++) {
                let field = this.fields[i];
                field.field.position = field.field.data.findIndex(f => f.key == value[i].key);
                field.dir.position = value[i].invert ? 1 : 0;
            }
            this.updateFields();
            this._changedLock = false;
        }

        get sortOrder(): Array<{ key: keyof T, invert: boolean }> {
            let order = new Array<{ key: keyof T, invert: boolean }>();
            for (let i = 0; i < this.fields.length; i++) {
                let item = this.fields[i];
                if (item.field.value)
                    order.push({ key: item.field.value.key as any, invert: item.dir.value ? item.dir.value.value : false });
            }
            return order;
        }
    }

    export class ListViewHeadersBar<T> extends Container {
        private headers: HeaderDef[];
        private _sortOrder = new Array<{ key: keyof T, invert: boolean }>();
        uis: ListViewHeader[];
        rowsHeight: number = 0;
        headersHeight: number = 0;
        readonly sortchanged = new Core.Events<{ target: ListViewHeadersBar<T>, sortOrder: Array<{ key: keyof T, invert: boolean }> }>();
        set onsortchanged(value: (event: { target: ListViewHeadersBar<T>, sortOrder: Array<{ key: keyof T, invert: boolean }> }) => void) { this.sortchanged.connect(value); }

        constructor(init) {
            super();

            this.headers = init.headers;
            this.uis = [];

            for (let i = 0; i < init.headers.length; i++) {
                let headerDef = init.headers[i];
                let headerUi = new ListViewHeader(headerDef).assign({
                    width: headerDef.width,
                    onpressed: e => {
                        if (headerDef.key !== undefined)
                            this.sortBy(headerDef.key, headerDef.key == this.sortColKey ? !headerUi.sort.invert : false);
                        this.sortchanged.fire({ target: this, sortOrder: this.sortOrder });
                    }
                });
                this.uis.push(headerUi);
                this.appendChild(headerUi);
            }

            new ContextMenuWatcher({
                element: this,
                press: (e) => new ListViewHeaderSortPopup<T>(this.headers).assign({
                    sortOrder: this._sortOrder,
                    onchanged: e => {
                        this.sortOrder = e.sortOrder;
                        this.sortchanged.fire({ target: this, sortOrder: this.sortOrder });
                    }
                }).openAt(e.x, e.y)
            })
        }

        get sortColKey() {
            return (this._sortOrder.length > 0) ? this._sortOrder[0].key : undefined;
        }

        get sortInvert(): boolean {
            return (this._sortOrder.length > 0) ? this._sortOrder[0].invert : false;
        }

        sortBy(key: keyof T, invert: boolean) {
            this.sortOrder = [{ key: key, invert: invert }];
        }

        get sortOrder(): Array<{ key: keyof T, invert: boolean }> {
            return this._sortOrder;
        }

        set sortOrder(value: Array<{ key: keyof T, invert: boolean }>) {
            this._sortOrder = value;
            for (let ui of this.uis) {
                var pos = this._sortOrder.findIndex(s => s.key == ui.headerDef.key);
                if (pos == -1)
                    ui.sort = { order: undefined, invert: this.sortInvert };
                else
                    ui.sort = { order: pos + 1, invert: this._sortOrder[pos].invert };
            }
        }

        protected measureCore(width: number, height: number) {
            this.rowsHeight = 0;
            this.headersHeight = 0;
            let minHeight = 0;
            // measure headers
            for (let col = 0; col < this.uis.length; col++) {
                let size = this.uis[col].measure(0, 0);
                if (size.height > minHeight)
                    minHeight = size.height;
            }
            this.headersHeight = minHeight;
            let minWidth = 0;
            for (let col = 0; col < this.uis.length; col++)
                minWidth += this.uis[col].measureWidth;

            return { width: minWidth, height: this.headersHeight };
        }

        protected arrangeCore(width: number, height: number) {
            let x = 0; let colWidth; let col;
            let availableWidth = width;

            for (col = 0; col < this.headers.length; col++) {
                let ui = this.uis[col];
                colWidth = ui.measureWidth;
                if (col == this.headers.length - 1)
                    colWidth = Math.max(colWidth, availableWidth);
                ui.arrange(x, 0, colWidth, this.headersHeight);
                x += colWidth;
                availableWidth -= colWidth;
            }
        }
    }

    export interface ListViewRowInit<T> {
        height?: number;
        listView: ListView<T>;
        data: any;
    }

    export class ListViewRow<T> extends Container {
        private headers: HeaderDef[];
        private _data: T;
        readonly cells: ListViewCell[];
        private selectionActions: SelectionActions;
        readonly selectionWatcher: SelectionableWatcher;
        readonly listView: ListView<T>;
        readonly selected = new Core.Events<{ target: ListViewRow<T> }>();
        set onselected(value: (event: { target: ListViewRow<T> }) => void) { this.selected.connect(value); }
        readonly unselected = new Core.Events<{ target: ListViewRow<T> }>();
        set onunselected(value: (event: { target: ListViewRow<T> }) => void) { this.unselected.connect(value); }

        constructor(init: ListViewRowInit<T>) {
            super();
            this.drawing.style.boxSizing = 'border-box';
            this.drawing.style.borderBottomStyle = 'solid';
            this.drawing.style.borderBottomWidth = '1px';
            this.listView = init.listView;
            this.headers = this.listView.headers;
            this._data = init.data;
            this.selectionActions = this.listView.selectionActions;
            if (init.height)
                this.height = init.height;
            this.cells = [];

            for (let col = 0; col < this.headers.length; col++) {
                let key = this.headers[col].key;
                let cell: ListViewCell;
                if (this.headers[col].ui !== undefined)
                    cell = new this.headers[col].ui();
                else
                    cell = new ListViewCellString();
                cell.setKey(key);
                cell.setRow(this);
                cell.setValue((key != undefined) ? this.getValueFrom(key, this._data) : this._data);
                this.cells.push(cell);
                this.appendChild(cell);
            }

            this.selectionWatcher = new SelectionableWatcher({
                element: this,
                selectionActions: this.selectionActions,
                onselected: () => {
                    this.selected.fire({ target: this });
                    this.onStyleChange();
                    if (this.listView)
                        this.listView.onRowSelectionChanged();
                },
                onunselected: () => {
                    this.unselected.fire({ target: this });
                    this.onStyleChange();
                    if (this.listView)
                        this.listView.onRowSelectionChanged();
                }
            });

        }

        getValueFrom(key: string, data: T) {
            if (key.indexOf('.') == -1 && key.indexOf('[') == -1)
                return data[key];

            let pathIndex = key.replace(/]/g, "").replace(/\[/g, ".");
            let result = pathIndex.split('.').reduce((o, i) => o != undefined && i in o ? o[i] : undefined, data);
            return result != undefined ? result : data;
        }

        get data(): T {
            return this._data;
        }

        set data(data: T) {
            this._data = data;
            for (let col = 0; col < this.headers.length; col++) {
                let key = this.headers[col].key;
                let cell: ListViewCell = this.cells[col];
                cell.setValue((key != undefined) ? this.getValueFrom(key, this._data) : this._data);
            }
        }

        get isSelected(): boolean {
            return this.selectionWatcher.isSelected;
        }

        set isSelected(value: boolean) {
            this.selectionWatcher.isSelected = value;
        }

        protected measureCore(width: number, height: number) {
            let minHeight = 0;
            let minWidth = 0;
            for (let col = 0; col < this.headers.length; col++) {
                let child = this.cells[col];
                let size = child.measure(0, 0);
                if (size.height > minHeight)
                    minHeight = size.height;
                minWidth += this.listView.headersBar.uis[col].measureWidth;
            }
            return { width: minWidth, height: minHeight };
        }

        protected arrangeCore(width: number, height: number) {
            let x = 0;
            for (let col = 0; col < this.headers.length; col++) {
                let cell = this.cells[col];
                let colWidth = this.listView.headersBar.uis[col].layoutWidth;
                cell.arrange(x, 0, colWidth, height);
                x += colWidth;
            }
        }

        protected onStyleChange() {
            if (this.selectionWatcher.isSelected)
                this.drawing.style.background = Color.create(this.getStyleProperty('selectColor')).getCssRgba();
            else
                this.drawing.style.background = Color.create(this.getStyleProperty('color')).getCssRgba();
            this.drawing.style.borderColor = Color.create(this.getStyleProperty('sepColor')).getCssRgba();
        }

        static style: object = {
            sepColor: 'rgba(0,0,0,0.5)',
            color: new Color(0.99, 0.99, 0.99, 0.1),
            selectColor: new Color(0.88, 0.88, 0.88)
        }
    }

    export interface ListViewRowOddInit<T> extends ListViewRowInit<T> { }

    export class ListViewRowOdd<T> extends ListViewRow<T> {
        constructor(init: ListViewRowOddInit<T>) {
            super(init);
        }

        static style: object = {
            color: new Color(0.5, 0.5, 0.5, 0.05),
            selectColor: 'rgba(8,160,229,0.6)'
        }
    }

    export interface ListViewRowEvenInit<T> extends ListViewRowInit<T> { }

    export class ListViewRowEven<T> extends ListViewRow<T> {
        constructor(init: ListViewRowEvenInit<T>) {
            super(init);
        }

        static style: object = {
            color: new Color(0.5, 0.5, 0.5, 0.1),
            selectColor: 'rgba(8,160,229,0.8)'
        }
    }

    export class ListViewScrollLoader<T> extends ScrollLoader {
        listView: ListView<T>;
        data: T[];

        constructor(listView: ListView<T>, data: T[]) {
            super();
            this.listView = listView;
            this.data = data;
        }

        signalChange() {
            this.changed.fire({ target: this });
        }

        getMin() {
            return 0;
        }

        getMax() {
            return this.data.length - 1;
        }

        getElementAt(position) {
            return this.listView.getElementAt(position);
        }
    }

    /*export interface Action edit: {
                        "default": true,
                        text: 'Edit', icon: 'edit',
                        scope: this, callback: this.onSelectionEdit, multiple: false
    }*/

    export interface ListViewInit<T> extends VBoxInit {
        headers?: HeaderDef[];
        scrolled?: boolean;
        scrollVertical?: boolean;
        scrollHorizontal?: boolean;
        selectionActions?: SelectionActions;
        onselectionchanged?: (event: { target: ListView<T> }) => void;
        onselected?: (event: { target: ListView<T> }) => void;
        onunselected?: (event: { target: ListView<T> }) => void;
        onactivated?: (event: { target: ListView<T>, position: number, value: any }) => void;
        onsortchanged?: (event: { target: ListView<T>, sortOrder: Array<{ key: keyof T, invert: boolean }> }) => void;
    }

    export class ListView<T = any> extends VBox implements ListViewInit<T> {
        private _data: T[];
        headers: HeaderDef[];
        readonly headersBar: ListViewHeadersBar<T>;
        headersScroll: ScrollingArea;
        firstRow: undefined;
        firstCol: undefined;
        cols: undefined;
        rowsHeight: number = 0;
        headersHeight: number = 0;
        headersVisible: boolean = true;
        scroll: VBoxScrollingArea;
        selectionActions: SelectionActions;
        private _scrolled: boolean = true;
        private _scrollVertical: boolean = true;
        private _scrollHorizontal: boolean = true;
        vbox: VBox;
        vboxScroll: ScrollingArea;

        private _selectionChangedLock = false;
        readonly selectionchanged = new Core.Events<{ target: ListView<T> }>();
        set onselectionchanged(value: (event: { target: ListView<T> }) => void) { this.selectionchanged.connect(value); }
        readonly selected = new Core.Events<{ target: ListView<T> }>();
        set onselected(value: (event: { target: ListView<T> }) => void) { this.selected.connect(value); }
        readonly unselected = new Core.Events<{ target: ListView<T> }>();
        set onunselected(value: (event: { target: ListView<T> }) => void) { this.unselected.connect(value); }
        readonly activated = new Core.Events<{ target: ListView<T>, position: number, value: any }>();
        set onactivated(value: (event: { target: ListView<T>, position: number, value: any }) => void) { this.activated.connect(value); }
        readonly sortchanged = new Core.Events<{ target: ListView<T>, sortOrder: Array<{ key: keyof T, invert: boolean }> }>();
        set onsortchanged(value: (event: { target: ListView<T>, sortOrder: Array<{ key: keyof T, invert: boolean }> }) => void) { this.sortchanged.connect(value); }
        readonly datachanged = new Core.Events<{ target: ListView<T> }>();
        set ondatachanged(value: (event: { target: ListView<T> }) => void) { this.datachanged.connect(value); }

        constructor(init?: ListViewInit<T>) {
            super(init);
            if (init && init.headers != undefined)
                this.headers = init.headers;
            else
                this.headers = [{ width: 100, type: 'string', title: 'Title', key: 'default' }];

            this.selectionActions = {
                edit: {
                    "default": true,
                    text: 'Edit', icon: 'edit', multiple: false,
                    callback: (s) => this.onSelectionEdit(s)
                }
            };

            this.headersScroll = new ScrollingArea({
                scrollVertical: false, scrollHorizontal: true
            });
            this.headersScroll.setScrollbarHorizontal(new Movable());
            this.append(this.headersScroll);

            this.headersBar = new ListViewHeadersBar({ headers: this.headers }).assign({
                onsortchanged: (e) => this.sortOrder = e.sortOrder
            });
            this.headersScroll.content = this.headersBar;

            this._data = [];
            this.vboxScroll = new ScrollingArea();
            this.append(this.vboxScroll, true);

            this.vbox = new VBox();
            this.vboxScroll.content = this.vbox;

            this.vboxScroll.scrolled.connect((e) => this.headersScroll.setOffset(e.offsetX, undefined, true, true));
            this.headersScroll.scrolled.connect((e) => this.vboxScroll.setOffset(e.offsetX, undefined, true, true));

            // handle keyboard              
            // this.drawing.addEventListener('keydown', (e) => this.onKeyDown(e));

            if (init) {
                if (init.scrolled !== undefined)
                    this.scrolled = init.scrolled;
                if (init.scrollVertical !== undefined)
                    this.scrollVertical = init.scrollVertical;
                if (init.scrollHorizontal !== undefined)
                    this.scrollHorizontal = init.scrollHorizontal;
                if (init.selectionActions !== undefined)
                    this.selectionActions = init.selectionActions;
                if (init.onselected)
                    this.selected.connect(init.onselected);
                if (init.onunselected)
                    this.unselected.connect(init.onunselected);
                if (init.onactivated)
                    this.activated.connect(init.onactivated);
                if (init.onsortchanged)
                    this.sortchanged.connect(init.onsortchanged);
                if (init.onselectionchanged)
                    this.selectionchanged.connect(init.onselectionchanged);
            }
        }

        set scrolled(scrolled: boolean) {
            this.scrollVertical = scrolled;
            this.scrollHorizontal = scrolled;
        }

        set scrollVertical(value: boolean) {
            if (this._scrollVertical !== value) {
                this._scrollVertical = value;
                this.vboxScroll.scrollVertical = value;
            }
        }

        set scrollHorizontal(value: boolean) {
            if (this._scrollHorizontal !== value) {
                this.headersScroll.scrollHorizontal = value;
                this._scrollHorizontal = value;
                this.vboxScroll.scrollHorizontal = value;
            }
        }

        showHeaders() {
            if (!this.headersVisible) {
                this.headersVisible = true;
                this.headersBar.show();
            }
        }

        hideHeaders() {
            if (this.headersVisible) {
                this.headersVisible = false;
                this.headersBar.hide(true);
            }
        }

        getSelectionActions() {
            return this.selectionActions;
        }

        setSelectionActions(value: SelectionActions) {
            this.selectionActions = value;
        }

        getElementAt(position: number): ListViewRow<T> {
            if ((position % 2) === 0)
                return new ListViewRowOdd<T>({
                    listView: this, data: this._data[position]
                });
            else
                return new ListViewRowEven<T>({
                    listView: this, data: this._data[position]
                });
        }

        appendData(data: T) {
            this._data.push(data);
            this.sortData();
            this.vbox.append(this.getElementAt(this._data.length - 1));
            this.datachanged.fire({ target: this });
        }

        updateData() {
            this.sortData();
            this.vbox.clear();
            for (let i = 0; i < this._data.length; i++) {
                this.vbox.append(this.getElementAt(i));
            }
            this.datachanged.fire({ target: this });
        }

        removeData(data) {
            let row = this.findDataRow(data);
            if (row != -1)
                this.removeDataAt(row);
        }

        removeDataAt(position: number) {
            if (position < this._data.length) {
                this._data.splice(position, 1);
                this.vbox.clear();
                for (let i = 0; i < this._data.length; i++)
                    this.vbox.append(this.getElementAt(i));
            }
            this.datachanged.fire({ target: this });
        }

        clearData() {
            this._data = [];
            //			this.dataLoader = new ListViewScrollLoader(this, this._data);
            //			if (this._scrolled)
            //				this.scroll.loader = this.dataLoader;
            //			else
            this.vbox.clear();
            this.datachanged.fire({ target: this });
        }

        get data(): Array<T> {
            return this._data;
        }

        set data(data: Array<T>) {
            this._data = data;
            this.sortData();
            this.vbox.clear();
            for (let i = 0; i < this._data.length; i++) {
                this.vbox.append(this.getElementAt(i));
            }
            this.datachanged.fire({ target: this });
        }

        sortData() {
            let sortOrder = this.sortOrder;
            let cmp = function (a, b) {
                return (a < b) ? -1 : (a > b) ? 1 : 0;
            }
            this._data.sort(function (a, b) {
                let res = 0;
                for (let i = 0; i < sortOrder.length && res == 0; i++) {
                    res = cmp(a[sortOrder[i].key], b[sortOrder[i].key]);
                    res = sortOrder[i].invert ? -res : res;
                }
                return res;
            });
        }

        sortBy(key: keyof T, invert: boolean) {
            this.sortOrder = [{ key: key, invert: invert }];
        }

        get sortOrder(): Array<{ key: keyof T, invert: boolean }> {
            return this.headersBar.sortOrder;
        }

        set sortOrder(value: Array<{ key: keyof T, invert: boolean }>) {
            this.headersBar.sortOrder = value;
            this.sortData();
            this.vbox.clear();
            for (let i = 0; i < this._data.length; i++) {
                this.vbox.append(this.getElementAt(i));
            }
            this.sortchanged.fire({ target: this, sortOrder: this.sortOrder });
        }

        get sortColKey(): keyof T {
            return this.headersBar.sortColKey;
        }

        get sortInvert(): boolean {
            return this.headersBar.sortInvert;
        }

        findDataRow(data: T): number {
            for (let row = 0; row < this._data.length; row++) {
                if (data == this._data[row])
                    return row;
            }
            return -1;
        }

        onSelectionEdit(selection: Selection) {
            let data = (selection.elements[0] as ListViewRow<T>).data;
            this.activated.fire({ target: this, position: this.findDataRow(data), value: data });
        }

        protected onChildInvalidateArrange(child: Element) {
            super.onChildInvalidateArrange(child);
            if (child === this.headersScroll) {
                for (let item of this.vbox.children)
                    item.invalidateMeasure();
            }
        }

        // internal
        onRowSelectionChanged() {
            if (!this._selectionChangedLock)
                this.selectionchanged.fire({ target: this });
        }

        get rows(): Array<ListViewRow<T>> {
            return this.vbox.children as Array<ListViewRow<T>>;
        }

        get selectedRows(): Array<ListViewRow<T>> {
            return this.rows.filter((value) => value.isSelected);
        }

        selectAll() {
            let rows = this.rows;
            if (rows.length > 0) {
                let selection = Selectionable.getParentSelectionHandler(this);
                if (selection) {
                    this._selectionChangedLock = true;
                    selection.elements = rows;
                    this._selectionChangedLock = false;
                    this.onRowSelectionChanged();
                }
            }
        }

        unselectAll() {
            let rows = this.selectedRows;
            if (rows.length > 0) {
                let selection = Selectionable.getParentSelectionHandler(this);
                if (selection) {
                    this._selectionChangedLock = true;
                    selection.elements = selection.elements.filter((v) => !(v instanceof ListViewRow) || (rows.indexOf(v) == -1));
                    this._selectionChangedLock = false;
                    this.onRowSelectionChanged();
                }
            }
        }
    }

    export class ListViewCell extends LBox {
        value: any;
        ui: Element;
        key: string;
        row: ListViewRow<any>;

        constructor() {
            super();
            this.clipToBounds = true;
            this.ui = this.generateUi();
            this.append(this.ui);
        }

        getKey() {
            return this.key;
        }

        setKey(key) {
            this.key = key;
        }

        setRow(row: ListViewRow<any>) {
            this.row = row;
        }

        getValue(): any {
            return this.value;
        }

        setValue(value: any) {
            this.value = value;
            this.onValueChange(value);
        }

        protected generateUi(): Element {
            return new Label({ margin: 8, horizontalAlign: 'left' });
        }

        protected onValueChange(value: any) {
            (this.ui as Label).text = value;
        }

        protected onStyleChange() {
            let spacing = this.getStyleProperty('spacing');
            this.ui.margin = spacing + 2;
        }

        static style: object = {
            spacing: 5
        }
    }

    export class ListViewCellString extends ListViewCell {
        ui: Label;

        constructor() {
            super();

        }

        protected generateUi(): Element {
            return new Label({ margin: 8, horizontalAlign: 'left' });
        }

        protected onValueChange(value: any) {
            this.ui.text = value;
        }
    }

    export class ListViewColBar extends Container {
        protected header: ListViewHeader;
        protected headerDef: HeaderDef;
        protected grip: Movable;
        protected separator: Rectangle;

        constructor(header: ListViewHeader, headerDef: HeaderDef) {
            super();
            this.header = header;
            this.headerDef = headerDef;
            this.grip = new Movable().assign({
                moveVertical: false,
                content: new LBox().assign({
                    content: [
                        new Rectangle().assign({ width: 1, opacity: 0.2, fill: 'black', marginLeft: 7, marginRight: 8 + 2, marginTop: 6, marginBottom: 6 }),
                        new Rectangle().assign({ width: 1, opacity: 0.2, fill: 'black', marginLeft: 12, marginRight: 3 + 2, marginTop: 6, marginBottom: 6 })
                    ]
                }),
                onmoved: () => this.onMove(),
                onupped: () => this.onUp()
            });
            this.appendChild(this.grip);
            if (headerDef.resizable === false)
                this.grip.hide(true);

            this.separator = new Rectangle().assign({ width: 1, fill: 'black', opacity: 0.3 });
            this.appendChild(this.separator);
        }

        setHeader(header: ListViewHeader) {
            this.header = header;
        }

        protected onMove() {
            this.separator.transform = Matrix.createTranslate(this.grip.positionX, 0);
        }

        protected onUp() {
            let delta = this.grip.positionX;
            this.header.width = Math.max(this.measureWidth, this.header.measureWidth + delta);
            this.invalidateArrange();
        }

        protected measureCore(width, height) {
            let size = this.grip.measure(width, height);
            this.separator.measure(width, height);
            return { width: Math.max(size.width, 1), height: 0 };
        }

        protected arrangeCore(width, height) {
            this.grip.setPosition(0, 0);
            this.separator.transform = Matrix.createTranslate(0, 0);
            this.grip.arrange(0, 0, width, height);
            this.separator.arrange(width - 1, 0, 1, height);
        }

        protected onDisable() {
            super.onDisable();
            if (this.headerDef.resizable !== false)
                this.grip.hide();
        }

        protected onEnable() {
            super.onEnable();
            if (this.headerDef.resizable !== false)
                this.grip.show();
        }
    }
}
