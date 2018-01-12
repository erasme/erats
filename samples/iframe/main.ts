/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let button = new Ui.Button({
            text: 'content',
            onpressed: () => iframe.src = 'content2.html'
        });
        toolbar.append(button);

        button = new Ui.Button({
            text: 'iframe',
            onpressed: () => iframe.src = 'iframe.html'
        });
        toolbar.append(button);

        button = new Ui.Button({
            text: 'gnome',
            onpressed: () => iframe.src = 'http://www.gnome.org/'
        });
        toolbar.append(button);

        let iframe = new Ui.IFrame();
        vbox.append(iframe, true);
    }
}

new App();