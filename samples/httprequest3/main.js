"use strict";
/// <reference path="../../era/era.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        let text = new Ui.Text();
        toolbar.append(new Ui.Button({
            text: 'send',
            onpressed: () => __awaiter(this, void 0, void 0, function* () {
                let req = new Core.HttpRequest({ url: 'service.php' });
                yield req.sendAsync();
                text.text = req.responseText;
            })
        }));
        vbox.append(text, true);
    }
}
new App();
