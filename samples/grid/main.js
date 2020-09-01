"use strict";
/// <reference path="../../era/era.d.ts" />
let app = new Ui.App();
let grid = new Ui.Grid();
grid.cols = 'auto,auto,*';
grid.rows = 'auto,auto,auto,*,2*';
app.content = grid;
let r = new Ui.Rectangle();
r.fill = 'lightgreen';
r.width = 150;
r.height = 50;
grid.attach(r, 0, 0, 1, 1);
r = new Ui.Rectangle();
r.fill = 'lightblue';
r.width = 150;
r.height = 80;
grid.attach(r, 1, 0, 1, 2);
r = new Ui.Rectangle();
r.fill = 'purple';
r.width = 50;
r.height = 50;
grid.attach(r, 0, 1, 1, 1);
var button = new Ui.Button({
    text: 'salut',
    onpressed: () => console.log('press')
});
grid.attach(button, 0, 2, 2, 1);
r = new Ui.Rectangle();
r.fill = 'green';
r.width = 50;
r.height = 50;
r.verticalAlign = 'stretch';
grid.attach(r, 0, 3, 2, 1);
r = new Ui.Rectangle();
r.fill = 'orange';
r.width = 50;
r.height = 50;
r.verticalAlign = 'stretch';
grid.attach(r, 0, 4, 2, 1);
r = new Ui.Rectangle();
r.fill = '#45dfac';
r.width = 50;
r.height = 50;
r.verticalAlign = 'stretch';
grid.attach(r, 2, 0, 1, 5);
var text = new Ui.Text();
text.verticalAlign = 'top';
text.text =
    'salut, je suis un texte à rallonge pour tester le retour à la ligne,\n\n' +
        'voir même encore plus long que ça pour un max de fun qui dure.';
grid.attach(text, 2, 0, 1, 5);
