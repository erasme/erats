namespace Ui {

	export interface HeaderDef {
		width?: number;
		type: string;
		title: string;
		key: string;
		colWidth?: number;
		ui?: typeof ListViewCell;
	}

	export interface ListViewHeaderInit extends PressableInit {
		title: string;
	}

	export class ListViewHeader extends Pressable {
		protected _title: string;
		protected uiTitle: Label;
		protected background: Rectangle;

		constructor(init?: Partial<ListViewHeaderInit>) {
			super();
			this.background = new Rectangle({ verticalAlign: 'bottom', height: 4 });
			this.append(this.background);
			this.uiTitle = new Label({ margin: 8, fontWeight: 'bold' });
			this.append(this.uiTitle);

			this.connect(this, 'down', this.onListViewHeaderDown);
			this.connect(this, 'up', this.onListViewHeaderUp);
			if (init)
				this.assign(init);
		}

		get title(): string {
			return this._title;
		}

		set title(title: string) {
			if (this._title !== title) {
				this._title = title;
				this.uiTitle.text = title;
			}
		}

		protected getColor() {
			return Ui.Color.create(this.getStyleProperty('color'));
		}

		protected getColorDown() {
			let  yuv = Color.create(this.getStyleProperty('color')).getYuv();
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
			let  spacing = this.getStyleProperty('spacing');
			this.uiTitle.margin = spacing + 2;
		}

		static style: object = {
			color: '#444444',
			spacing: 5
		}
	}

	export class ListViewHeadersBar extends Container {
		private headers: HeaderDef[];
		sortColKey: string;
		sortInvert: boolean = false;
		sortArrow: Icon;
		cols: ListViewColBar[];
		rowsHeight: number = 0;
		headersHeight: number = 0;

		constructor(config) {
			super();
			this.addEvents('header');

			this.headers = config.headers;
			delete (config.headers);

			this.sortArrow = new Icon({ icon: 'sortarrow', width: 10, height: 10, margin: 4 });
			this.appendChild(this.sortArrow);

			this.cols = [];

			for (let i = 0; i < this.headers.length; i++) {
				let header = this.headers[i];
				let headerUi = new ListViewHeader({ title: header.title, width: header.width });
				header['Ui.ListViewHeadersBar.ui'] = headerUi;
				this.connect(header['Ui.ListViewHeadersBar.ui'], 'press', this.onHeaderPress);
				header.colWidth = header.width;
				this.appendChild(header['Ui.ListViewHeadersBar.ui']);

				let  col = new ListViewColBar(headerUi);
				this.cols.push(col);
				this.appendChild(col);
			}
		}

		getSortColKey() {
			return this.sortColKey;
		}

		getSortInvert() {
			return this.sortInvert;
		}

		sortBy(key: string, invert: boolean) {
			this.sortColKey = key;
			this.sortInvert = invert === true;
			if (this.sortInvert)
				this.sortArrow.transform = Matrix.createRotate(180);
			else
				this.sortArrow.transform = undefined;
			this.invalidateArrange();
		}

		protected onHeaderPress(header) {
			let  key;
			for (let  col = 0; col < this.headers.length; col++) {
				let  h = this.headers[col];
				if (h['Ui.ListViewHeadersBar.ui'] === header) {
					key = h.key;
				}
			}
			if (key !== undefined) {
				this.fireEvent('header', this, key);

			}
		}
	
		protected measureCore(width: number, height: number) {
			this.rowsHeight = 0;
			this.headersHeight = 0;
			let minHeight = 0;
			let col; let size; let header:HeaderDef;
			// measure headers
			for (col = 0; col < this.headers.length; col++) {
				header = this.headers[col];
				size = (header['Ui.ListViewHeadersBar.ui'] as Element).measure(0, 0);
				if (size.height > minHeight)
					minHeight = size.height;
			}
			this.headersHeight = minHeight;
			let  minWidth = 0;
			for (col = 0; col < this.headers.length; col++)
				minWidth += (this.headers[col]['Ui.ListViewHeadersBar.ui'] as Element).measureWidth;
		
			this.sortArrow.measure(0, 0);

			// measure col bars
			for (let  i = 0; i < this.cols.length; i++) {
				col = this.cols[i];
				col.measure(0, this.headersHeight + this.rowsHeight);
			}

			return { width: minWidth, height: this.headersHeight };
		}

		protected arrangeCore(width: number, height: number) {
			let  x = 0; let  header; let  colWidth; let  col;
			let  availableWidth = width;

			for (col = 0; col < this.headers.length; col++) {
				header = this.headers[col];
				let  colbar = this.cols[col];
				colWidth = (header['Ui.ListViewHeadersBar.ui'] as Element).measureWidth;
				if (col == this.headers.length - 1)
					colWidth = Math.max(colWidth, availableWidth);
				(header['Ui.ListViewHeadersBar.ui'] as Element).arrange(x, 0, colWidth, this.headersHeight);

				colbar.setHeaderHeight(this.headersHeight);
				colbar.arrange(x + colWidth - colbar.measureWidth, 0,
					colbar.measureWidth, this.headersHeight);

				if (this.sortColKey === header.key) {
					this.sortArrow.arrange(x + colWidth - height * 0.8,
						height * 0.1,
						height * 0.8, height * 0.8);
				}

				x += colWidth;
				availableWidth -= colWidth;
			}
		}
	}

	export class ListViewRow extends Container {
		private headers: HeaderDef[];
		data: object;
		private cells: ListViewCell[];
		private background: Rectangle;
		private selectionActions: SelectionActions;
		private selectionWatcher: SelectionableWatcher;

		constructor(init: { headers: HeaderDef[], data: object, selectionActions?: SelectionActions }) {
			super();
			this.headers = init.headers;
			this.data = init.data;
			this.selectionActions = init.selectionActions;
			this.cells = [];

			this.background = new Rectangle();
			this.appendChild(this.background);
			for (let  col = 0; col < this.headers.length; col++) {
				let  key = this.headers[col].key;
				let  cell;
				if (this.headers[col].ui !== undefined) {
					cell = new this.headers[col].ui();
					cell.setKey(key);
				}
				else {
					cell = new ListViewCellString();
					cell.setKey(key);
				}	
				cell.setValue(this.data[this.headers[col].key]);
				this.cells.push(cell);
				this.appendChild(cell);
			}

			this.selectionWatcher = new SelectionableWatcher({
				element: this,
				selectionActions: this.selectionActions,
				select: () => this.onStyleChange(),
				unselect: () => this.onStyleChange()
			});
			
		}

		getData(): object {
			return this.data;
		}

		protected measureCore(width: number, height: number) {
			this.background.measure(width, height);
			let  minHeight = 0;
			for (let col = 0; col < this.headers.length; col++) {
				let  child = this.cells[col];
				let  size = child.measure(0, 0);
				if (size.height > minHeight)
					minHeight = size.height;
			}
			return { width: 0, height: minHeight };
		}

		protected arrangeCore(width: number, height: number) {
			this.background.arrange(0, 0, width, height);
			let  x = 0;
			for (let col = 0; col < this.headers.length; col++) {
				let  header = this.headers[col];
				let  cell = this.cells[col];
				let colWidth = (header['Ui.ListViewHeadersBar.ui'] as Element).layoutWidth;
				cell.arrange(x, 0, colWidth, height);
				x += colWidth;
			}
		}

		protected onStyleChange() {
			if (this.selectionWatcher.isSelected)
				this.background.fill = this.getStyleProperty('selectColor');
			else
				this.background.fill = this.getStyleProperty('color');
		}
		
		static style: object = {
			color: new Color(0.99, 0.99, 0.99, 0.1),
			selectColor: new Color(0.88, 0.88, 0.88)
		}
	}

	export class ListViewRowOdd extends ListViewRow {
		static style: object = {
			color: new Color(0.5, 0.5, 0.5, 0.05),
			selectColor: 'rgba(8,160,229,0.6)'
		}
	}

	export class ListViewRowEven extends ListViewRow {
		static style: object = {
			color: new Color(0.5, 0.5, 0.5, 0.1),
			selectColor: 'rgba(8,160,229,0.8)'
		}
	}

	export class ListViewScrollLoader extends ScrollLoader {
		listView: ListView;
		data: object[];

		constructor(listView: ListView, data: object[]) {
			super();
			this.listView = listView;
			this.data = data;
		}

		signalChange() {
			this.fireEvent('change', this);
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

	export interface ListViewInit extends VBoxInit {
		headers: HeaderDef[];
		scrolled: boolean;
		selectionActions: SelectionActions;		
	}	

	export class ListView extends VBox implements ListViewInit {
		private _data: object[];
		headers: HeaderDef[];
		headersBar: ListViewHeadersBar;
		firstRow: undefined;
		firstCol: undefined;
		cols: undefined;
		rowsHeight: number = 0;
		headersHeight: number = 0;
		headersVisible: boolean = true;
		sortColKey: string;
		sortInvert: boolean = false;
		sortArrow: undefined;
		dataLoader: ListViewScrollLoader;
		scroll: VBoxScrollingArea;
		selectionActions: SelectionActions;
		private _scrolled: boolean = true;
		vbox: VBox;

		constructor(init?: Partial<ListViewInit>) {
			super();
			this.addEvents('select', 'unselect', 'activate', 'header');

			if (init && init.headers != undefined) {
				this.headers = init.headers;
				delete (init.headers);
			}
			else
				this.headers = [{ width: 100, type: 'string', title: 'Title', key: 'default' }];

			this.selectionActions = {
				edit: {
					"default": true,
					text: 'Edit', icon: 'edit', multiple: false,
					callback: (s) => this.onSelectionEdit(s)
				}
			};

			this.headersBar = new ListViewHeadersBar({ headers: this.headers });
			this.connect(this.headersBar, 'header', this.onHeaderPress);
			this.append(this.headersBar);

			this._data = [];
			this.dataLoader = new ListViewScrollLoader(this, this._data);
			this.scroll = new VBoxScrollingArea({ loader: this.dataLoader });
			this.append(this.scroll, true);

			// handle keyboard              
			//this.connect(this.drawing, 'keydown', this.onKeyDown);

			this.assign(init);
		}

		set scrolled(scrolled : boolean) {
			if (this._scrolled !== (scrolled === true)) {
				this._scrolled = scrolled;
				if (this._scrolled) {
					this.remove(this.vbox);
					this.scroll = new VBoxScrollingArea({ loader: this.dataLoader });
					this.append(this.scroll, true);
				}
				else {
					this.remove(this.scroll);
					this.vbox = new VBox();
					this.append(this.vbox, true);
					this.updateData(this._data);
				}
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

		getElementAt(position: number): ListViewRow {
			if ((position % 2) === 0)
				return new ListViewRowOdd({
					headers: this.headers,
					data: this._data[position], selectionActions: this.selectionActions
				});
			else
				return new ListViewRowEven({
					headers: this.headers,
					data: this._data[position], selectionActions: this.selectionActions
				});
		}

		appendData(data) {
			this._data.push(data);
			this.sortData();
			if (this._scrolled)
				this.dataLoader.signalChange();
			else
				this.vbox.append(this.getElementAt(this._data.length - 1));
		}

		updateData(data) {
			this.sortData();
			if (this._scrolled)
				this.scroll.reload();
			else {
				this.vbox.clear();
				for (let i = 0; i < this._data.length; i++) {
					this.vbox.append(this.getElementAt(i));
				}
			}
		}

		removeData(data) {
			let row = this.findDataRow(data);
			if (row != -1)
				this.removeDataAt(row);
		}

		removeDataAt(position: number) {
			if (position < this._data.length) {
				this._data.splice(position, 1);
				if (this._scrolled)
					this.scroll.reload();
				else {
					this.vbox.clear();
					for (let i = 0; i < this._data.length; i++) {
						this.vbox.append(this.getElementAt(i));
					}
				}
			}
		}

		clearData() {
			this._data = [];
			this.dataLoader = new ListViewScrollLoader(this, this._data);
			if (this._scrolled)
				this.scroll.loader = this.dataLoader;
			else
				this.vbox.clear();
		}

		get data(): Array<any> {
			return this._data;
		}

		set data(data: Array<any>) {
			if (data !== undefined) {
				this._data = data;
				this.sortData();
				this.dataLoader = new ListViewScrollLoader(this, this._data);
				if (this._scrolled)
					this.scroll.loader = this.dataLoader;
				else {
					this.vbox.clear();
					for (let i = 0; i < this._data.length; i++) {
						this.vbox.append(this.getElementAt(i));
					}
				}
			}
			else {
				this.clearData();
			}
		}

		sortData() {
			let key = this.sortColKey;
			let invert = this.sortInvert;
			this._data.sort(function (a, b) {
				let res;
				if (a[key] < b[key])
					res = -1;
				else if (a[key] > b[key])
					res = 1;
				else
					res = 0;
				return invert ? -res : res;
			});
		}

		sortBy(key: string, invert: boolean) {
			this.sortColKey = key;
			this.sortInvert = invert === true;
			this.headersBar.sortBy(this.sortColKey, this.sortInvert);
			this.sortData();
			if (this._scrolled) {
				this.scroll.reload();
				this.invalidateArrange();
			}
			else {
				this.vbox.clear();
				for (let i = 0; i < this._data.length; i++) {
					this.vbox.append(this.getElementAt(i));
				}
			}
		}

		findDataRow(data) {
			for (let row = 0; row < this._data.length; row++) {
				if (data == this._data[row])
					return row;
			}
			return -1;
		}

		onHeaderPress(header, key) {
			this.sortBy(key, (this.sortColKey === key) ? !this.sortInvert : false);
		}

		onSelectionEdit(selection: Selection) {
			let data = (selection.elements[0] as ListViewRow).getData();
			this.fireEvent('activate', this, this.findDataRow(data), data);
		}

		protected onChildInvalidateArrange(child: Element) {
			super.onChildInvalidateArrange(child);
			if (child === this.headersBar) {
				if (this._scrolled && (this.scroll !== undefined))
					this.scroll.getActiveItems().forEach(function (item) { item.invalidateArrange(); });
				else if (!this._scrolled)
					this.vbox.children.forEach(function (item) { item.invalidateArrange(); });
			}
		}
	}

	export class ListViewCell extends LBox {
		value: any;
		ui: Element;
		key: string;
	
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

		getValue(): any {
			return this.value;
		}

		setValue(value: any) {
			if (this.value !== value) {
				this.value = value;
				this.onValueChange(value);
			}
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
		headerHeight: number = 0;
		header: ListViewHeader;
		grip: Movable;
		separator: Rectangle;

		constructor(header: ListViewHeader) {
			super();
			this.header = header;
			this.grip = new Movable({ moveVertical: false });
			this.appendChild(this.grip);
			this.connect(this.grip, 'move', this.onMove);
			this.connect(this.grip, 'up', this.onUp);

			let  lbox = new LBox();
			this.grip.setContent(lbox);
			lbox.append(new Rectangle({ width: 1, opacity: 0.2, fill: 'black', marginLeft: 14, marginRight: 8 + 2, marginTop: 6, marginBottom: 6 }));
			lbox.append(new Rectangle({ width: 1, opacity: 0.2, fill: 'black', marginLeft: 19, marginRight: 3 + 2, marginTop: 6, marginBottom: 6 }));

			this.separator = new Rectangle({ width: 1, fill: 'black', opacity: 0.3 });
			this.appendChild(this.separator);
		}

		setHeader(header) {
			this.header = header;
		}

		setHeaderHeight(height) {
			this.headerHeight = height;
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
			let  size = this.grip.measure(width, height);
			this.separator.measure(width, height);
			return { width: size.width, height: 0 };
		}

		protected arrangeCore(width, height) {
			this.grip.setPosition(0, 0);
			this.separator.transform = Matrix.createTranslate(0, 0);
			this.grip.arrange(0, 0, width, this.headerHeight);
			this.separator.arrange(width - 1, 0, 1, height);
		}

		protected onDisable() {
			super.onDisable();
			this.grip.hide();
		}

		protected onEnable() {
			super.onEnable();
			this.grip.show();
		}
	}
}
