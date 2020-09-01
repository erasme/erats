"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        let text = new Ui.Text();
        let request;
        toolbar.append(new Ui.Button({
            text: 'send',
            onpressed: () => {
                request = new Core.HttpRequest({
                    url: 'service.php',
                    ondone: () => text.text = request.responseText
                });
                request.send();
            }
        }));
        vbox.append(text, true);
    }
}
new App();
