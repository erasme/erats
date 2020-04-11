/// <reference path="../../era/era.d.ts" />

class ListViewBoolCell extends Ui.ListViewCell
{
    ui: Ui.Rectangle;
	
    constructor() {
        super();
		this.clipToBounds = true;
		this.ui = new Ui.Rectangle({
			margin: 8, width: 16, height: 16,
			horizontalAlign: 'center', verticalAlign: 'center'
		});
		this.append(this.ui);
	}

    protected onValueChange(value: boolean) {
		if(value)
			this.ui.fill = '#60e270';
		else
			this.ui.fill = '#E84D4D';
	}
}

interface LogsInit extends Ui.VBoxInit {
}

class Logs extends Ui.VBox {
    logs: Ui.VBox;
    scrolling: Ui.ScrollingArea;

    constructor(init?: LogsInit) {
        super(init);
		this.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
		this.scrolling = new Ui.ScrollingArea();
		this.append(this.scrolling, true);
		this.logs = new Ui.VBox();
        this.scrolling.content = this.logs;
	}

	log(text: string, color: string = 'black') {
		this.logs.prepend(new Ui.Label({ text: text, color: color, horizontalAlign: 'left' }));
	}
}

class App extends Ui.App {
    constructor() {
        super();
		let vbox = new Ui.VBox();
		this.content = vbox;

		let toolbar = new Ui.ToolBar({ margin: 10 });
		vbox.append(toolbar);

		toolbar.append(new Ui.CheckBox({
			text: 'show headers', value: true, width: 200,
			onchanged: e => {
				if(e.value)
					listview.showHeaders();
				else
					listview.hideHeaders();
			}
		}));

		toolbar.append(new Ui.CheckBox({
			text: 'data scrolled (best perf)', value: true, width: 250,
			onchanged: e => listview.scrolled = e.value
		}));
		

		toolbar.append(new Ui.Button({
			text: 'set 1500', verticalAlign: 'center',
			onpressed: () => {
				let data = [];
				for(let i = 0; i < 1500; i++) {
					data.push({
						data0: ((i % 3) === 0),
						data1: 'hi number '+i,
						data2: 'col 2 '+i,
						data3: Math.floor(Math.random()*50),
						data4: i
					});
				}
				listview.data = data;
			}
		}));

		toolbar.append(new Ui.Button({
			text: 'clear all', verticalAlign: 'center',
			onpressed: () => listview.clearData()
		}));

		toolbar.append(new Ui.Button({
			text: 'append 70', verticalAlign: 'center',
			onpressed: () => {
				let count = listview.data.length;
				for(let i = 0; i < 70; i++) {
					listview.appendData({
						data0: ((i % 3) === 0),
						data1: 'hi number '+i,
						data2: 'col 2 '+i,
						data3: Math.floor(Math.random()*50),
						data4: count + i
					});
				}
			}
		}));
		
		toolbar.append(new Ui.Button({
			text: 'update numbers', verticalAlign: 'center',
			onpressed: () => {
				let data = listview.data;
				for (let i = 0; i < data.length; i++) {
					let obj = data[i];
					(data[i] as any).data3 = Math.floor(Math.random()*50);
				}
				listview.updateData();
			}
		}));

		let hbox = new Ui.HBox({ spacing: 5 });
		vbox.append(hbox, true);

		let scroll = new Ui.ScrollingArea();
		hbox.append(scroll, true);

		let listview = new Ui.ListView({
			margin: 0,
			scrolled: true,
			headerStoreKey: 'local.test.app',
			headers: [
				{ type: 'string', title: 'Data 0', key: 'data0', width: 40, ui: ListViewBoolCell },
				{ type: 'string', title: 'Data 1', key: 'data1', width: 200 },
				{ type: 'string', title: 'Data 2', key: 'data2', width: 200 },
				{ type: 'string', title: 'Numbers', key: 'data3', ui: Ui.ListViewCellNumber },
				{ type: 'string', title: 'Pos', key: 'data4', ui: Ui.ListViewCellNumber }
			],
			onactivated: e => logs.log('activate row: '+e.value)
		});
		scroll.content = listview;

		for(let i = 0; i < 50; i++) {
			listview.appendData({
				data0: ((i % 3) === 0),
				data1: 'hi number '+i,
				data2: 'col 2 '+i,
				data3: Math.floor(Math.random()*50),
				data4: i 
			});
		}

		let logs = new Logs({ width: 250 });
		hbox.append(logs);
	}
}

new App();
