/// <reference path="../../era/era.d.ts" />

class Item1 extends Ui.LBox {}

class Item2 extends Ui.Draggable { }

class DropBox1 extends Ui.DropBox {
    background: Ui.Rectangle;

    constructor() {
        super();
		this.background = new Ui.Rectangle({ fill: 'lightgreen' });		
		this.append(this.background);

		this.append(new Ui.Frame({ frameWidth: 2, fill: 'black' }));

		this.addType('files', [ 'copy', 'move' ]);
		this.addType(Ui.Draggable, [
			{ action: 'copy', text: 'Copier', primary: true },
			{ action: 'move', text: 'Déplacer', secondary: true }
		]);
	}

	protected onDragEnter() {
		this.background.fill = 'orange';
	}

	protected onDragLeave() {
		this.background.fill = 'lightgreen';
	}
}

class DropBox2 extends Ui.DropBox {
    background: Ui.Rectangle;
    border: Ui.Frame;

    constructor() {
        super();
		this.background = new Ui.Rectangle({ fill: 'lightgreen' });
		this.append(this.background);

		this.border = new Ui.Frame({ frameWidth: 2, fill: 'black' });
		this.append(this.border);

		this.addType('text', [ 'copy' ]);
		this.addType(Item1, [
			{ action: 'copy', text: 'Copier', dragicon: 'dragcopy' },
			{ action: 'warn', text: 'Attention', dragicon: 'warning' }
		]);
	}

	protected onDragEnter() {
		this.background.fill = 'pink';
	}

	protected onDragLeave() {
		this.background.fill = 'lightgreen';
	}
}

class DropBox3 extends Ui.DropBox {
    background: Ui.Rectangle;
    border: Ui.Frame;

    constructor() {
        super();
		this.background = new Ui.Rectangle({ fill: 'lightgreen' });		
		this.append(this.background);

		this.border = new Ui.Frame({ frameWidth: 2, fill: 'black' });
		this.append(this.border);

		this.addType(Item1, [ 'link' ]);
    }
    
	protected onDragEnter() {
		this.background.fill = 'pink';
	}

	protected onDragLeave() {
		this.background.fill = 'lightgreen';
	}
}

let app = new Ui.App();

let vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 20 });
app.content = vbox;

let hbox = new Ui.HBox({ horizontalAlign: 'center', spacing: 20 });
vbox.append(hbox);

let item1Box = new Ui.LBox().assign({
	content: [
		new Ui.Rectangle().assign({ fill: 'orange' })
	]	
})

let item1 = new Item1({ width: 64, height: 64, margin: 10 });
item1.drawing.style.cursor = 'pointer';
let dragWatch = new Ui.DraggableWatcher({
	element: item1,
	image: item1Box,
	data: item1
});
dragWatch.allowedMode = [ 'copy', 'link', 'move', 'warn' ];
new Ui.PressWatcher({
	element: item1,
	onpressed: () =>  Ui.Toast.send('PRESSED')
});
item1.append(new Ui.Rectangle({ fill: 'lightblue' }));
item1.append(new Ui.Label({ text: 'drag me', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 }));
//hbox.append(item1);
item1Box.append(item1);

hbox.append(item1Box)

let item2 = new Item2({ width: 64, height: 64 });
item2.draggableData = item2;
item2.append(new Ui.Rectangle({ fill: 'rgb(255, 122, 255)' }));
item2.append(new Ui.Label({ text: 'drag me', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 }));
hbox.append(item2);


let dropbox = new DropBox1();
dropbox.width = 200; dropbox.height = 200;
let droplabel = new Ui.Label({ text: 'drop here', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 });
dropbox.append(droplabel);
vbox.append(dropbox);
dropbox.droppedfile.connect(() => {
	console.log('dropfile');
	return false;
});
dropbox.dropped.connect(e => {
	console.log('drop effect: '+e.effect);
	droplabel.text = e.data.toString();
	new Core.DelayedTask(2, () => droplabel.text = 'drop here');
});

let dropbox2 = new DropBox2();
dropbox2.height = 50; dropbox2.margin = 10;
dropbox2.verticalAlign = 'bottom';
let droplabel2 = new Ui.Label();
droplabel2.text = 'drop here';
droplabel2.horizontalAlign = 'center';
droplabel2.verticalAlign = 'center';
droplabel2.margin = 10;
dropbox2.append(droplabel2);
dropbox.append(dropbox2);
dropbox2.dropped.connect(e => {
	droplabel2.text = e.data.toString();
	new Core.DelayedTask(2, () => droplabel2.text = 'drop here');
});

let dropbox3 = new DropBox3();
dropbox3.height = 50; dropbox3.margin = 10;
dropbox3.verticalAlign = 'bottom';
let droplabel3 = new Ui.Label({	text: 'drop here', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 })
dropbox3.append(droplabel3);
vbox.append(dropbox3);
dropbox3.dropped.connect(e => {
	droplabel3.text = e.data.toString();
	new Core.DelayedTask(2, () => droplabel3.text = 'drop here');
});
