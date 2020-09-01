"use strict";
/// <reference path="../../era/era.d.ts" />
class Item extends Ui.Draggable {
    constructor(init) {
        super(init);
        this.rect = new Ui.Rectangle({ width: 150, height: 150 });
        this.append(this.rect);
        this.draggableData = this;
        if (init) {
            if (init.fill !== undefined)
                this.fill = init.fill;
        }
    }
    set fill(color) {
        this.rect.fill = color;
    }
}
class App extends Ui.App {
    constructor() {
        super();
        var scroll = new Ui.ScrollingArea();
        this.content = scroll;
        this.container = new Ui.SFlowDropBox({
            spacing: 20, margin: 20,
            stretchMaxRatio: 2, itemAlign: 'stretch',
            ondroppedat: e => this.onDropAt(this.container, e.data, e.effect, e.position, e.x, e.y)
        });
        this.container.addType(Item, this.onDragEffect);
        this.container.addType('files', this.onDragEffect);
        scroll.content = this.container;
        this.container.append(new Item({ width: 150, height: 150, fill: 'red' }));
        this.container.append(new Item({ width: 150, height: 150, fill: 'green' }));
        this.container.append(new Item({ width: 150, height: 150, fill: 'pink' }));
        this.container.append(new Item({ width: 250, height: 150, fill: 'purple' }));
        this.container.append(new Item({ width: 150, height: 150, fill: 'brown' }));
        this.container.append(new Item({ width: 150, height: 150, fill: 'orange' }));
        this.container.append(new Item({ width: 150, height: 150, fill: 'lightblue' }));
    }
    onDragEffect(data, pos) {
        console.log(`testFunction data: ${data}, pos: ${pos}`);
        if ((pos === 0) || (pos === 1) || (pos === 7))
            return [];
        else if (pos === 4)
            return [{ action: 'copy' }];
        else
            return [{ action: 'move' }];
    }
    onDropAt(dropbox, data, effect, pos, x, y) {
        console.log(`onDropAt data: ${data}, effect: ${effect}, pos: ${pos}, coord: ${x},${y}`);
    }
}
new App();
