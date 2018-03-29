/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        this.content = new Ui.ScaleBox({
            fixedWidth: 800, fixedHeight: 600, margin: 100,
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ fill: 'orange' }),
                    new Ui.Text({ margin: 40, fontSize: 40, text: 'Hello World !' })
                ]
            })
        });
	}
}

new App();
