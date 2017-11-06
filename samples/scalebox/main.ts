/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let lbox = new Ui.LBox();
        lbox.margin = 100;
		this.setContent(lbox);

        let scalebox = new Ui.ScaleBox();
        scalebox.fixedWidth = 800; scalebox.fixedHeight = 600;
		lbox.setContent(scalebox);
	
        let rect = new Ui.Rectangle();
        rect.fill = 'orange';
		scalebox.append(rect);

        let text = new Ui.Text();
        text.margin = 20; text.fontSize = 40; text.text = 'Hello World !';
		scalebox.append(text);
	}
}

new App();