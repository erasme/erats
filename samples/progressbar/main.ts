/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();

        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        toolbar.append(new Ui.Button().assign({
            text: 'begin',
            onpressed: () => clock.begin()
        }));

        toolbar.append(new Ui.Button().assign({
            text: 'infinite',
            onpressed: () => {
                clock.stop();
                progressbar.value = 'infinite'
            }
        }));

        let progressbar = new Ui.ProgressBar().assign({
            verticalAlign: 'center', horizontalAlign: 'center', width: 200
        });

        vbox.append(progressbar, true);

        let clock = new Anim.Clock({
            duration: 4.0,
            ontimeupdate: e => progressbar.value = e.progress
        });
    }
}
new App();