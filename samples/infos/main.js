"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let scroll = new Ui.ScrollingArea();
        this.content = scroll;
        let text = new Ui.Text({ margin: 10, interLine: 1.2 });
        scroll.content = text;
        let msg = '';
        for (let prop in navigator) {
            let val = navigator[prop];
            if ((typeof (val) === 'string') || (typeof (val) === 'boolean'))
                msg += 'navigator.' + prop + ': ' + val + '\n';
        }
        for (let prop in Ui.Audio) {
            let val = Ui.Audio[prop];
            if ((typeof (val) === 'string') || (typeof (val) === 'boolean'))
                msg += 'Ui.Audio.' + prop + ': ' + val + '\n';
        }
        for (let prop in Ui.Video) {
            let val = Ui.Video[prop];
            if ((typeof (val) === 'string') || (typeof (val) === 'boolean'))
                msg += 'Ui.Video.' + prop + ': ' + val + '\n';
        }
        msg += 'window.devicePixelRatio: ' + window.devicePixelRatio + '\n';
        msg += 'window.innerWidth: ' + window.innerWidth + '\n';
        msg += 'window.innerHeight: ' + window.innerHeight + '\n';
        text.text = msg;
    }
}
new App();
