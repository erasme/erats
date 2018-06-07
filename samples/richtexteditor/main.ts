/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        this.content = new Ui.RichTextEditor().assign({ margin: 50 });
    }
}

new App();