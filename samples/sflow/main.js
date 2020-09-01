"use strict";
/// <reference path="../../era/era.d.ts" />
class TextField extends Ui.VBox {
    constructor(init) {
        super(init);
        this.margin = 5;
        let title = new Ui.Text({ text: init.title });
        this.append(title);
        let field = new Ui.TextField({ marginLeft: 10 });
        this.append(field);
        if (init.desc)
            this.append(new Ui.Text({ text: init.desc, color: '#aaaaaa' }));
    }
}
class App extends Ui.App {
    constructor() {
        super();
        let scroll = new Ui.ScrollingArea();
        this.content = scroll;
        let flow = new Ui.SFlow({ spacing: 10, itemAlign: 'stretch', stretchMaxRatio: 2 });
        scroll.content = flow;
        flow.append(new Ui.Rectangle({ width: 100, height: 200, fill: 'red' }), 'right');
        flow.append(new Ui.Rectangle({ width: 200, height: 100, fill: 'green' }), 'left');
        let field1 = new TextField({ title: 'Prénom', width: 200 });
        flow.append(field1);
        let field2 = new TextField({ title: 'Nom', width: 200 });
        flow.append(field2);
        let field3 = new TextField({ title: 'Login', width: 200 });
        flow.append(field3, undefined, 'flushleft');
        let field4 = new TextField({ title: 'Password', width: 200 });
        flow.append(field4);
        let field5 = new TextField({
            title: 'A very long title field to see what happends in this case',
            width: 200,
            desc: 'This field is very important. Thanks to fill it'
        });
        flow.append(field5);
        flow.append(new Ui.Rectangle({ width: 250, height: 150, fill: 'pink' }));
        flow.append(new Ui.Rectangle({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }));
        flow.append(new Ui.Rectangle({ width: 150, height: 150, fill: 'brown' }));
        flow.append(new Ui.Rectangle({ width: 200, height: 15, fill: 'orange' }));
        flow.append(new Ui.Rectangle({ width: 150, height: 150, fill: 'lightblue' }));
    }
}
new App();
