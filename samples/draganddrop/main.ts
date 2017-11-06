/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let vbox = new Ui.VBox({
    verticalAlign: 'center', horizontalAlign: 'center',
    spacing: 20
});
app.content = vbox;

class Data extends Core.Object { }

//
// Define a draggable element. Choose a mimetype for the content. Most of the time
// use an application specific mimetype. The mimetype is used between a drag element
// and a drop element to see if they are compatible.
//
// Choose the data that are dragged and dropped. Here the string 'hello here'
//
// Put some content to see something
//
let draggable = new Ui.Draggable({ width: 64, height: 64, horizontalAlign: 'center' });
draggable.draggableData = new Data();

draggable.append(new Ui.Rectangle({ fill: 'lightblue', radius: 8 }));
draggable.append(new Ui.Label({ text: 'drag me', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 }));
vbox.append(draggable);

//
// Connect to the dragstart event. This is not needed but might be usefull
// to return some feedback to the user.
//
// Here, the opacity of the drag element is changed
//
app.connect(draggable, 'dragstart', () => draggable.opacity = 0.5);
app.connect(draggable, 'dragend', () => draggable.opacity = 1);
//
// Connect to the dragend event. This is called when the drag is done.
// operation let us known what has happened:
//  - none: drag fails (drop no where)
//  - copy: drag has negociated a copy of the element in a drop element
//  - move: drag has negociated a move of the element in a drop element.
//          in this case, the original element should be suppressed
//
app.connect(draggable, 'dragend', function(draggable: Ui.Draggable, operation: string) {
	if((operation == 'none') || (operation == 'copy'))
		draggable.opacity = 1;
	if(operation == 'move')
		draggable.opacity = 0;
});

//
// Define a DropBox. The DropBox is a possible target for a drag element.
//
let dropbox = new Ui.DropBox();
dropbox.width = 200; dropbox.height = 200;
dropbox.addType(Data, 'copy');
dropbox.addType('text/uri-list', 'copy');
dropbox.addType('text', (data: string) => [{ action: 'copy' }]);

// fill with content to see something
let dropBg = new Ui.Rectangle({ fill: 'lightgreen', radius: 8 });

dropbox.append(dropBg);
let droplabel = new Ui.Label({
    text: 'drop here', horizontalAlign: 'center',
    verticalAlign: 'center', margin: 10
});
dropbox.append(droplabel);
vbox.append(dropbox);
app.connect(dropbox, 'dragenter', () => dropBg.fill = 'orange');
app.connect(dropbox, 'dragleave', () => dropBg.fill = 'lightgreen');

//
// Connect to the drop event called when a compatible element is
// dropped in the box.
//
app.connect(dropbox, 'drop', function (dropbox: Ui.DropBox, data: any, effect: string, x: number, y: number) {
    if (data instanceof Ui.DragNativeData) {
        if (data.hasType('text/uri-list'))
            data = data.getData('text/uri-list');
        else if (data.hasType('text/plain'))
            data = data.getData('text/plain');
    }
    droplabel.text = `message: ${data}`;
    new Core.DelayedTask(app, 1, function () {
        droplabel.text = 'drop here';
    });
});
