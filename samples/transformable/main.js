"use strict";
/// <reference path="../../era/era.d.ts" />
//
// A Transformable is an element that can be moved, rotate and scale
// by user interaction. rotate and scale are only available with
// devices that provide touch events and support at least two fingers
//
class App extends Ui.App {
    constructor() {
        super();
        // define a playing area
        var fixed = new Ui.Fixed();
        this.content = fixed;
        //
        // If nothing special specified, the transformable
        // has no limit
        //
        let lbox = new Ui.LBox({
            content: [
                new Ui.Rectangle({ width: 150, height: 150, fill: 'orange', radius: 8 }),
                new Ui.Label({ text: 'free transform' })
            ]
        });
        fixed.append(lbox, 50, 50);
        new Ui.TransformableWatcher({
            element: lbox,
            transform: (w, t) => w.element.transform = w.matrix
        });
        //
        // Define another transformable but attach a function to the
        // transform event. The transform event allow the application
        // to known what transform are applied. It also allow to limit
        // the transformation by using the setContentTransform and change
        // some transform properties.
        // In this example, the element move is disabled by always setting
        // x = 0 and y = 0.
        //
        fixed.append(new Ui.Transformable({
            content: new Ui.LBox({ content: [
                    new Ui.Rectangle({ width: 150, height: 150, fill: 'lightgreen', radius: 8 }),
                    new Ui.Label({ text: 'rotate/scale' })
                ] }),
            ontransformed: e => {
                let transformable = e.target;
                e.target.setContentTransform(0, 0, undefined, undefined);
            }
        }), 350, 50);
        //
        // In this example, the element scale is limited between 1 and 2
        //
        fixed.append(new Ui.Transformable({
            inertia: true,
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ width: 150, height: 150, fill: 'lightblue', radius: 8 }),
                    new Ui.Label({ text: 'limited scale 2x' })
                ]
            }),
            ontransformed: e => {
                let transformable = e.target;
                var scale = transformable.scale;
                if ((scale < 1) || (scale > 2)) {
                    scale = Math.min(2, Math.max(1, scale));
                    transformable.setContentTransform(undefined, undefined, scale, undefined);
                }
            }
        }), 50, 350);
        //
        // In this example, the element rotation jump between 90 degree step values
        //
        fixed.append(new Ui.Transformable({
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ width: 150, height: 150, fill: 'pink', radius: 8 }),
                    new Ui.Label({ text: 'step rotate' })
                ]
            }),
            ontransformed: e => {
                let transformable = e.target;
                var angle = transformable.angle;
                angle = Math.round(angle / 90) * 90;
                transformable.setContentTransform(0, 0, 1, angle);
            }
        }), 350, 350);
        //
        // This example, just demonstrate that we can put button in the content
        // of a transformable.
        //
        fixed.append(new Ui.Transformable({
            content: new Ui.LBox({
                content: [
                    new Ui.Rectangle({ width: 150, height: 150, fill: 'purple', radius: 8 }),
                    new Ui.VBox({
                        uniform: true, padding: 20,
                        content: [
                            new Ui.Button({ text: 'button1' }),
                            new Ui.Button({ text: 'button2' }),
                            new Ui.Button({ text: 'button3' })
                        ]
                    })
                ]
            })
        }), 650, 50);
    }
}
new App();
//# sourceMappingURL=main.js.map