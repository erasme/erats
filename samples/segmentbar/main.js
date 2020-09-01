"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox({ horizontalAlign: 'center', verticalAlign: 'center', spacing: 5 });
        this.content = vbox;
        let label = new Ui.Label({ horizontalAlign: 'center' });
        vbox.append(label);
        let segmentbar = new Ui.SegmentBar({
            field: 'text', data: [
                { text: 'Home' }, { text: 'Download' }, { text: 'API' }, { text: 'Samples' }
            ],
            onchanged: e => label.text = `Choice: ${e.value.text}`
        });
        vbox.append(segmentbar);
        segmentbar.currentPosition = 0;
    }
}
new App();
