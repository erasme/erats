/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	vbox: Ui.VBox;

	constructor() {
		super();
		let scroll = new Ui.ScrollingArea();
		this.content = scroll;

		this.vbox = new Ui.VBox({ spacing: 20 });
		scroll.content = this.vbox;

		let xAxis = [ 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim' ];

		let data = [ 12, 45, 22, 36, 65, 43, 12 ];

		let barGraph = new Graph.BarGraph({
			xAxis: xAxis, data: data, height: 300,
			margin: 40
		});
		this.vbox.append(barGraph);

		let lineGraph = new Graph.LineGraph({
			xAxis: xAxis, data: data, height: 300,
			margin: 40
		});
		this.vbox.append(lineGraph);

		let donutData = [
			{ value: 15, color: '#69a6dd', text: 'Poivre' },
			{ value: 45, color: '#ee939e', text: 'Piment' },
			{ value: 24, color: '#68dda2', text: 'Sel' },
			{ value: 9, color: '#fdc102', text: 'Moutarde' }
		];
		let donutGraph = new Graph.DonutGraph({
			width: 150, height: 150,
			data: donutData
		});
		let hbox = new Ui.HBox({ spacing: 40, horizontalAlign: 'center' });
		this.vbox.append(hbox);
		hbox.append(donutGraph);
		let vbox = new Ui.VBox({ spacing: 10, verticalAlign: 'center' });
		hbox.append(vbox);
		for (let d of donutData) {
			vbox.append(new Ui.HBox({
				spacing: 10,
				content: [
					new Ui.Rectangle({ fill: d.color, width: 14, height: 14, verticalAlign: 'center' }),
					new Ui.Label({ text: d.text })
				]
			 }));
		}

		this.onDataLoaded();
	}

	onDataLoaded() {

		// graph sur 10 min (1 valeure 10s = 60 valeures)
		var endTime = new Date(1449400783000);
		var startTime = new Date(endTime.getTime() - (6 * 60 * 60) * 1000);

		let cpuData = [];
		let cpuData2 = [];
		

		let currentTime = startTime.getTime();
		while (currentTime < endTime.getTime()) {
			currentTime += 5 * 1000;
			let progress = (currentTime - startTime.getTime()) / (endTime.getTime() - startTime.getTime());
			let coef = (1 - Math.pow((progress * 2 - 1), 2));
			let coef2 = Math.sin(progress * Math.PI * 2);
			let coef3 = coef2 * (1 - Math.pow((progress * 2 - 1), 2));
			cpuData.push({ time: new Date(currentTime), value: coef / 2 + Math.random() * coef2 / 4 });
			cpuData2.push({ time: new Date(currentTime), value: Math.abs(coef3 / 3 + Math.random() * coef2 / 4) });
		}

/*		var rxData = []; var txData = [];
		for(var i = 0; i < graphData.length; i++) {
			rxData.push({ time: new Date(graphData[i].timestamp * 1000), value: graphData[i].rxBytes * 8 });
			txData.push({ time: new Date(graphData[i].timestamp * 1000), value: graphData[i].txBytes * 8 });
		}
		var graph = new Graph.TimeLineGraph({
			height: 300, margin: 0, data: [ { name: 'RX', data: rxData }, { name: 'TX', data: txData, color: '#40E060' } ],
			maxY: 100000000, unit: 'bps',
			startTime: startTime, endTime: endTime
		});
		this.vbox.append(graph);*/
		/*var graph = new Graph.TimeLineGraph({
			height: 300, margin: 0, data: txData,
			maxY: 1000000, unit: 'bps',
			startTime: startTime, endTime: endTime
		});
		this.vbox.append(graph);*/

		var graph = new Graph.TimeLineGraph({
			height: 300, margin: 40, data: [
				{ name: 'CPU1', data: cpuData, color: '#69a6dd' },
				{ name: 'CPU2', data: cpuData2, color: '#ee939e' }
			],
			maxY: 1, unit: 'percent',
			startTime: startTime, endTime: endTime
		});
		this.vbox.append(graph);
	}

}

new App();
