"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        let toolbar2 = new Ui.ToolBar();
        vbox.append(toolbar2);
        toolbar.append(new Ui.Button({
            text: 'transition 1',
            onpressed: () => transitionbox.current = page1
        }));
        toolbar.append(new Ui.Button({
            text: 'transition 2',
            onpressed: () => transitionbox.current = page2
        }));
        toolbar.append(new Ui.Button({
            text: 'fade',
            onpressed: () => transitionbox.transition = 'fade'
        }));
        toolbar2.append(new Ui.Button({
            text: 'flip horizontal',
            onpressed: () => transitionbox.transition = 'flip'
        }));
        toolbar2.append(new Ui.Button({
            text: 'flip vertical',
            onpressed: () => transitionbox.transition = new Ui.Flip({ orientation: 'vertical' })
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide right',
            onpressed: () => transitionbox.transition = 'slide'
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide left',
            onpressed: () => transitionbox.transition = new Ui.Slide({ direction: 'left' })
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide top',
            onpressed: () => transitionbox.transition = new Ui.Slide({ direction: 'top' })
        }));
        toolbar2.append(new Ui.Button({
            text: 'slide bottom',
            onpressed: () => transitionbox.transition = new Ui.Slide({ direction: 'bottom' })
        }));
        toolbar.append(new Ui.Button({
            text: 'linear',
            onpressed: () => transitionbox.ease = 'linear'
        }));
        toolbar.append(new Ui.Button({
            text: 'bounce',
            onpressed: () => transitionbox.ease = 'bounce'
        }));
        toolbar.append(new Ui.Button({
            text: 'elastic',
            onpressed: () => transitionbox.ease = 'elastic'
        }));
        toolbar.append(new Ui.Button({
            text: 'power',
            onpressed: () => transitionbox.ease = 'power'
        }));
        toolbar.append(new Ui.Button({
            text: 'power out',
            onpressed: () => transitionbox.ease = new Anim.PowerEase({ mode: 'out' })
        }));
        let transitionbox = new Ui.TransitionBox({
            transition: 'fade', duration: 0.5
        });
        vbox.append(transitionbox, true);
        let page1 = new Ui.LBox({
            content: [
                new Ui.Rectangle({ fill: 'lightblue' }),
                new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 1', verticalAlign: 'center', horizontalAlign: 'center' })
            ]
        });
        transitionbox.append(page1);
        let page2 = new Ui.LBox({
            content: [
                new Ui.Rectangle({ fill: 'lightgreen' }),
                new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 2', verticalAlign: 'center', horizontalAlign: 'center' })
            ]
        });
        transitionbox.append(page2);
    }
}
new App();
