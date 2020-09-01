"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        let request;
        let text = new Ui.Text();
        toolbar.append(new Ui.Button({
            text: 'send',
            onpressed: () => {
                request = new Core.HttpRequest({
                    url: 'service.php', method: 'POST',
                    arguments: { toto: 12, dan: 'super', complex: { t1: 1, t2: 2 } },
                    ondone: () => text.text = request.responseText
                });
                request.send();
            }
        }));
        vbox.append(text, true);
    }
}
new App();
