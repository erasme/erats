"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        toolbar.append(new Ui.Button({
            text: 'begin',
            onpressed: () => clock.begin()
        }));
        toolbar.append(new Ui.Button({
            text: 'enable',
            onpressed: () => slider.enable()
        }));
        toolbar.append(new Ui.Button({
            text: 'disable',
            onpressed: () => slider.disable()
        }));
        toolbar.append(new Ui.Button({
            text: 'horizontal',
            onpressed: () => slider.orientation = 'horizontal'
        }));
        toolbar.append(new Ui.Button({
            text: 'vertical',
            onpressed: () => slider.orientation = 'vertical'
        }));
        let vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        vbox.append(vbox2, true);
        let label = new Ui.Label({ horizontalAlign: 'center' });
        vbox2.append(label);
        let slider = new Ui.Slider({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 200, height: 200, value: 0.2,
            onchanged: e => label.text = `Value: ${e.value.toFixed(2)}`
        });
        vbox2.append(slider);
        label.text = `Value: ${slider.value}`;
        let clock = new Anim.Clock({
            duration: 4.0,
            ontimeupdate: e => slider.setValue(e.progress)
        });
    }
}
new App();
