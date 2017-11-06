/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let mainvbox = new Ui.VBox();
        this.setContent(mainvbox);

        let toolbar = new Ui.ToolBar();
        mainvbox.append(toolbar);

        let button = new Ui.CheckBox();
        button.text = 'selectable';
        toolbar.append(button);

        this.connect(button, 'toggle', () => html.selectable = true);

        this.connect(button, 'untoggle', () => html.selectable = false);

        let vbox = new Ui.VBox({ verticalAlign: 'center' });
        mainvbox.append(vbox, true);

        let r = new Ui.Rectangle();
        r.fill = 'lightblue'; r.height = 10;
        vbox.append(r);

        let hbox = new Ui.HBox({ horizontalAlign: 'center' });
        vbox.append(hbox);

        r = new Ui.Rectangle();
        r.fill = 'lightblue'; r.width = 10;
        hbox.append(r, true);

        let html = new Ui.Html();
        html.width = 100;
        html.html = '<div>Have fun with HTML, I <b>hope</b> the text is enough long</div>';
        html.selectable = false;
        hbox.append(html, false);

        r = new Ui.Rectangle();
        r.fill = 'lightblue'; r.width = 10;
        hbox.append(r, true);

        r = new Ui.Rectangle();
        r.fill = 'lightblue'; r.height = 10;
        vbox.append(r);
    }
}

new App();