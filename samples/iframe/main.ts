/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let button = new Ui.Button({ text: 'content' });
        toolbar.append(button);
        this.connect(button, 'press', () => iframe.src = 'content2.html');

        button = new Ui.Button({ text: 'iframe' });
        toolbar.append(button);
        this.connect(button, 'press', () => iframe.src = 'iframe.html');

        button = new Ui.Button({ text: 'gnome' });
        toolbar.append(button);
        this.connect(button, 'press', () => iframe.src = 'http://www.gnome.org/');

        let iframe = new Ui.IFrame();
        vbox.append(iframe, true);
    }
}

new App();