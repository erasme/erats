/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let fixed = new Ui.Fixed();
app.content = fixed;

let movable = new Ui.Movable({ inertia: true });
let lbox = new Ui.LBox();
let r = new Ui.Rectangle({ width: 100, height: 100, fill: 'orange', radius: 8 });
lbox.append(r);
let l = new Ui.Label({ text: 'free move' });
lbox.append(l);
movable.setContent(lbox);
fixed.append(movable, 0, 0);

movable = new Ui.Movable({ moveVertical: false, inertia: true });
lbox = new Ui.LBox();
r = new Ui.Rectangle({ width: 100, height: 100, fill: 'purple', radius: 8 });
lbox.append(r);
l = new Ui.Label({ text: 'horizontal' });
lbox.append(l);
movable.setContent(lbox);
fixed.append(movable, 0, 200);

movable = new Ui.Movable({ moveHorizontal: false });
lbox = new Ui.LBox();
r = new Ui.Rectangle();
r.width = 100; r.height = 100; r.fill = 'lightblue'; r.radius = 8;
lbox.append(r);
l = new Ui.Label(); l.text = 'vertical';
lbox.append(l);
movable.setContent(lbox);
fixed.append(movable, 250, 0);

movable = new Ui.Movable({
	moveVertical: false,
	onmoved: e => {
		let m = e.target;
		if(m.positionX < 0)
			m.setPosition(0, undefined);
		else if(m.positionX > 100)
			m.setPosition(100, undefined);
	}
});
lbox = new Ui.LBox();
r = new Ui.Rectangle({ width: 200, height: 100, fill: 'lightgreen', radius: 8 });
lbox.append(r);
l = new Ui.Label({ text: 'horizontal limited 0-100' });
lbox.append(l);
movable.setContent(lbox);
fixed.append(movable, 0, 400);
