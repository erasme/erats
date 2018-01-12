/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();

        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        toolbar.append(new Ui.Button({
            text: 'horizontal',
            onpressed: () => paned.orientation = 'horizontal'
        }));

        toolbar.append(new Ui.Button({
            text: 'vertical',
            onpressed: () => paned.orientation = 'vertical'
        }));
        
        let paned = new Ui.Paned();
        vbox.append(paned, true);

        let scroll = new Ui.ScrollingArea();
        paned.content1 = scroll;

        //paned.setContent1(new Ui.Rectangle({ fill: 'lightblue', width: 200, height: 200 }));
        //paned.setContent1(new Ui.Text({
        //	margin: 5,
        //	text: 'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n'+
        //		'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters'
        //}));
        scroll.content = new Ui.Text({
            margin: 5,
            text: 'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n' +
            'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n' +
            'hello, this is a simple text, long enought to test the line break feature\n\nwith 2 chapters\n\n'
        });

        paned.content2 = new Ui.Rectangle({ fill: 'orange', width: 100, height: 100 });
    }
}

new App();