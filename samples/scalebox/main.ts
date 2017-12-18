/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let lbox = new Ui.LBox();
        lbox.margin = 100;
        this.content = lbox;

        let scalebox = new Ui.ScaleBox({ fixedWidth: 800, fixedHeight: 600 });
	    lbox.content = scalebox;
	
        let rect = new Ui.Rectangle({ fill: 'orange' });
        scalebox.append(rect);

        let text = new Ui.Text({ margin: 20, fontSize: 40, text: 'Hello World !' });
        scalebox.append(text);
	}
}

new App();
