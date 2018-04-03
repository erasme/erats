"use strict";
/// <reference path="../../era/era.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var app = new Ui.App();
var vbox = new Ui.VBox({
    verticalAlign: 'center', horizontalAlign: 'center',
    spacing: 20
});
app.content = vbox;
var Data = /** @class */ (function (_super) {
    __extends(Data, _super);
    function Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Data;
}(Core.Object));
//
// Define a draggable element. Choose a mimetype for the content. Most of the time
// use an application specific mimetype. The mimetype is used between a drag element
// and a drop element to see if they are compatible.
//
// Choose the data that are dragged and dropped. Here the string 'hello here'
//
// Put some content to see something
//
var draggable = new Ui.Draggable({
    width: 64, height: 64, horizontalAlign: 'center',
    content: [
        new Ui.Rectangle({ fill: 'lightblue', radius: 8 }),
        new Ui.Label({ text: 'drag me', horizontalAlign: 'center', verticalAlign: 'center', margin: 10 })
    ],
    // Connect to the dragstart event. This is not needed but might be usefull
    // to return some feedback to the user.
    //
    // Here, the opacity of the drag element is changed
    ondragstarted: function (e) { return e.target.opacity = 0.5; },
    ondragended: function (e) { return e.target.opacity = 1; }
});
draggable.draggableData = new Data();
vbox.append(draggable);
//
// Connect to the dragend event. This is called when the drag is done.
// operation let us known what has happened:
//  - none: drag fails (drop no where)
//  - copy: drag has negociated a copy of the element in a drop element
//  - move: drag has negociated a move of the element in a drop element.
//          in this case, the original element should be suppressed
//
draggable.dragended.connect(function (e) {
    if ((e.effect == 'none') || (e.effect == 'copy'))
        draggable.opacity = 1;
    if (e.effect == 'move')
        draggable.opacity = 0;
});
//
// Define a DropBox. The DropBox is a possible target for a drag element.
//
var dropbox = new Ui.DropBox({
    width: 200, height: 200,
    ondragentered: function () { return dropBg.fill = 'orange'; },
    ondragleaved: function () { return dropBg.fill = 'lightgreen'; }
});
dropbox.addType(Data, 'copy');
dropbox.addType('text/uri-list', 'copy');
dropbox.addType('text', function (data) { return [{ action: 'copy' }]; });
// fill with content to see something
var dropBg = new Ui.Rectangle({ fill: 'lightgreen', radius: 8 });
dropbox.append(dropBg);
var droplabel = new Ui.Label({
    text: 'drop here', horizontalAlign: 'center',
    verticalAlign: 'center', margin: 10
});
dropbox.append(droplabel);
vbox.append(dropbox);
//
// Connect to the drop event called when a compatible element is
// dropped in the box.
//
dropbox.dropped.connect(function (e) {
    var data = e.data;
    if (data instanceof Ui.DragNativeData) {
        if (data.hasType('text/uri-list'))
            data = data.getData('text/uri-list');
        else if (data.hasType('text/plain'))
            data = data.getData('text/plain');
    }
    droplabel.text = "message: " + data;
    new Core.DelayedTask(1, function () { return droplabel.text = 'drop here'; });
});
