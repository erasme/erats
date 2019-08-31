namespace Ui {
    export interface MonthCalendarInit extends VBoxInit {
        date?: Date;
        selectedDate?: Date;
        dayFilter?: number[];
        dateFilter?: string[];
        ondayselected?: (event: { target: MonthCalendar, value: Date }) => void;
    }

    export class MonthCalendar extends VBox {
        private _selectedDate: Date;
        private _selectMode: 'DAY' | 'WEEK' = 'DAY';
        private _date: Date;
        private monthButton: FlatButton;
        private yearButton: FlatButton;
        private grid: Grid;
        private _dayFilter: number[];
        private _mode: 'DAY' | 'MONTH' | 'YEAR' = 'DAY';
        private _dateFilter: string[];
        readonly dayselected = new Core.Events<{ target: MonthCalendar, value: Date }>();
        set ondayselected(value: (event: { target: MonthCalendar, value: Date }) => void) { this.dayselected.connect(value); }

        //
        // @class The MonthCalendar is a small month calendar which allow
        // to select a day.
        //
        constructor(init?: MonthCalendarInit) {
            super(init);
            this._date = new Date();

            let hbox = new HBox();
            this.append(hbox);

            let button = new FlatButton({
                icon: 'arrowleft',
                verticalAlign: 'center',
                onpressed: () => this.onLeftButtonPress(),
            });
            button.setStyleProperty('iconSize', 16);
            hbox.append(button);

            let datehbox = new HBox({ spacing: 5, horizontalAlign: 'center' });
            this.monthButton = new MonthYearButton ({
                onpressed: () => this.mode = this.mode == 'MONTH' ? 'DAY' : 'MONTH'
            });

            datehbox.append(this.monthButton);

            this.yearButton = new MonthYearButton({
                onpressed: () => this.mode = this.mode == 'YEAR' ? 'DAY' : 'YEAR'
            });
            datehbox.append(this.yearButton);

            hbox.append(datehbox, true);

            button = new FlatButton({
                icon: 'arrowright',
                verticalAlign: 'center',
                onpressed: () => this.onRightButtonPress()
            });
            button.setStyleProperty('iconSize', 16);
            hbox.append(button);

            this.updateDate();

            if (init) {
                if (init.date !== undefined)
                    this.date = init.date;
                if (init.selectedDate !== undefined)
                    this.selectedDate = init.selectedDate;
                if (init.dayFilter !== undefined)
                    this.dayFilter = init.dayFilter;
                if (init.dateFilter !== undefined)
                    this.dateFilter = init.dateFilter;
                if (init.ondayselected)
                    this.dayselected.connect(init.ondayselected);
            }
        }

        //
        // @param {Number[]} Array of day to disable (from 0 to 6), 0 is sunday
        //
        set dayFilter(dayFilter: number[]) {
            this._dayFilter = dayFilter;
            this.updateDate();
        }

        //
        // @param {String[]} Array of dates to disable. This dates must always be in yyyy/mm/dd format and will be converted to regex
        // so you can do a lot of things
        // @ example
        // let calendar = new MonthCalendar();
        // calendar.setDateFilter([ '2011/11/2[1-5]', '2011/12/*', '2012/0[2-3]/.[4]' ]);
        //
        set dateFilter(dateFilter: string[]) {
            this._dateFilter = dateFilter;
            this.updateDate();
        }

        set date(date: Date) {
            this._date = date;
            this.updateDate();
        }

        get selectedDate(): Date {
            return this._selectedDate;
        }

        set selectedDate(selectedDate: Date) {
            this._selectedDate = selectedDate;
            this._date = selectedDate;
            this.updateDate();
        }

        get selectMode(): 'DAY' | 'WEEK' {
            return this._selectMode;
        }

        set selectMode(value: 'DAY' | 'WEEK') {
            if (value != this._selectMode) {
                this._selectMode = value;
                this.updateDate(false);
            }
        }

        get mode(): 'DAY' | 'MONTH' | 'YEAR' {
            return this._mode;
        }

        set mode(value: 'DAY' | 'MONTH' | 'YEAR') {
            if (value != this.mode) {
                this._mode = value;
                this.updateDate(false);
            }
        }

        protected onLeftButtonPress() {
            if (this.mode == 'YEAR')
                this._date.setFullYear(this._date.getFullYear() - 12);
            else {
                this._date.setDate(1);
                this._date.setMonth(this._date.getMonth() - 1);
            }
            this.updateDate();
        }

        protected onRightButtonPress() {
            if (this.mode == 'YEAR')
                this._date.setFullYear(this._date.getFullYear() + 12);
            else {
                this._date.setDate(1);
                this._date.setMonth(this._date.getMonth() + 1);
            }
            this.updateDate();
        }

        protected onDaySelect(button) {
            this._selectedDate = button.monthCalendarDate;
            this.updateDate();
            this.dayselected.fire({ target: this, value: this._selectedDate });
        }

        protected updateDate(reuseGrid: boolean = true) {
            let monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

            this.monthButton.text = monthNames[this._date.getMonth()];
            this.yearButton.text = this._date.getFullYear().toString();

            if (this.mode == 'DAY')
                this.updateDayGrid(reuseGrid);
            else if (this.mode == 'MONTH')
                this.updateMonthGrid(reuseGrid);
            else
                this.updateYearGrid(reuseGrid);

            this.onStyleChange();
        }

        private updateDayGrid(reuseGrid: boolean) {
            let i = 0;
            let dayPivot = [6, 0, 1, 2, 3, 4, 5];
            let dayNames = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
            let color = this.getStyleProperty('color');
            let dayColor = this.getStyleProperty('dayColor');
            let selectColor = this.getStyleProperty('selectColor');

            if (reuseGrid && this.grid)
                while (this.grid.firstChild !== undefined)
                    this.grid.detach(this.grid.firstChild);
            else {
                this.remove(this.grid);
                this.grid = new Grid({
                    cols: '*,*,*,*,*,*,*',
                    rows: '*,*,*,*,*,*,*',
                    horizontalAlign: 'stretch'
                });
                this.append(this.grid);
            }
            for (i = 0; i < 7; i++)
                this.grid.attach(new Label({ text: dayNames[i], fontWeight: 'bold', color: color, margin: 5 }), i, 0);
            let month = this._date.getMonth();
            let current = new Date(this._date.getTime());
            current.setDate(1);

            let day = (current.getDay() + 6) % 7;
            let weekStart = new Date(current.getTime() - day * 24 * 3600 * 1000);
            current = weekStart;

            let selectedWeekStart: Date | undefined = undefined;
            if (this._selectedDate) {
                let day = (this._selectedDate.getDay() + 6) % 7;
                selectedWeekStart = new Date(this._selectedDate.getTime() - day * 24 * 3600 * 1000);
            }

            let row = 1;
            let now = new Date();
            do {
                let day = (current.getDay() + 6) % 7;
                let weekStart = new Date(current.getTime() - day * 24 * 3600 * 1000);

                for (let col = 0; col < 7; col++) {
                    let day = new DayButton({
                        onpressed: () => this.onDaySelect(day)
                    });
                    let isSelected = false;
                    if (this._selectMode == 'DAY')
                        isSelected = (this._selectedDate !== undefined) && (current.getFullYear() === this._selectedDate.getFullYear()) && (current.getMonth() === this._selectedDate.getMonth()) && (current.getDate() === this._selectedDate.getDate());
                    else if (this._selectMode == 'WEEK')
                        isSelected = selectedWeekStart && (weekStart.getFullYear() === selectedWeekStart.getFullYear()) && (weekStart.getMonth() === selectedWeekStart.getMonth()) && (weekStart.getDate() === selectedWeekStart.getDate());

                    let currentMonth = current.getMonth() == month;
                    day.monthCalendarDate = current;
                    day.monthCalendarCurrent = (current.getFullYear() == now.getFullYear()) && (current.getMonth() == now.getMonth()) && (current.getDate() == now.getDate());
                    day.isSelected = isSelected;
                    day.append(new Rectangle().assign({ fill: day.isSelected ? selectColor : dayColor, opacity: currentMonth ? 1 : 0.5 }));
                    let disable = false;
                    if (this._dayFilter !== undefined) {
                        let weekday = current.getDay();
                        for (i = 0; (i < this._dayFilter.length) && !disable; i++)
                            if (weekday == this._dayFilter[i])
                                disable = true;
                    }
                    if (this._dateFilter !== undefined) {
                        let daystr = current.getFullYear() + '/';
                        if (current.getMonth() + 1 < 10)
                            daystr += '0';
                        daystr += (current.getMonth() + 1) + '/';
                        if (current.getDate() < 10)
                            daystr += '0';
                        daystr += current.getDate();
                        for (i = 0; (i < this._dateFilter.length) && !disable; i++) {
                            let re = new RegExp(this._dateFilter[i]);
                            if (re.test(daystr)) {
                                disable = true;
                            }
                        }
                    }
                    if (disable) {
                        day.disable();
                        day.opacity = 0.2;
                    }
                    day.append(new Label({ text: current.getDate().toString(), fontWeight: day.monthCalendarCurrent ? 'bold' : 'normal', margin: 5 }));
                    this.grid.attach(day, col, row);
                    current = new Date(current.getTime() + 1000 * 60 * 60 * 24);
                    if (dayPivot[current.getDay()] === 0)
                        row++;                    
                }
            }
            while (month == current.getMonth());
        }

        private updateMonthGrid(reuseGrid: boolean) {
            if (reuseGrid && this.grid)
                while (this.grid.firstChild !== undefined)
                    this.grid.detach(this.grid.firstChild);
            else {
                this.remove(this.grid);
                this.grid = new Grid({
                    cols: '*,*,*,*',
                    rows: '*,*,*',
                    horizontalAlign: 'stretch'
                });
                this.append(this.grid);
            }

            let monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
            let nbCols = 4;

            for (let i = 0; i < monthNames.length; i++) {
                let row = Math.trunc(i / nbCols);
                let col = i % nbCols;
                let current = new Date(this._date.getTime());
                current.setDate(1);
                current.setMonth(i);

                let month = new MonthYearButton().assign({
                    text: monthNames[i],
                    onpressed: () => {
                        this._date = month.monthCalendarDate;
                        this.mode = 'DAY';
                    }
                });
                month.monthCalendarDate = current;
                this.grid.attach(month, col, row);
            }
        }

        private updateYearGrid(reuseGrid: boolean) {
            if (reuseGrid && this.grid)
                while (this.grid.firstChild !== undefined)
                    this.grid.detach(this.grid.firstChild);
            else {
                this.remove(this.grid);
                this.grid = new Grid({
                    cols: '*,*,*,*',
                    rows: '*,*,*',
                    horizontalAlign: 'stretch'
                });
                this.append(this.grid);
            }

            let nbCols = 4;

            for (let i = 0; i < 12; i++) {
                let currentYear = this._date.getFullYear() - 6 + i;
                let row = Math.trunc(i / nbCols);
                let col = i % nbCols;
                let current = new Date(currentYear, 0, 1);

                let year = new MonthYearButton().assign({
                    text: currentYear.toString(),
                    onpressed: () => {
                        this._date = year.monthCalendarDate;
                        this.mode = 'DAY';
                    }
                });
                year.monthCalendarDate = current;
                this.grid.attach(year, col, row);
            }
        }

        protected onStyleChange(): void {
            let color = this.getStyleProperty('color');
            let dayColor = this.getStyleProperty('dayColor');
            let selectColor = this.getStyleProperty('selectColor');

            for (let i = 0; i < this.grid.children.length; i++) {
                let child = this.grid.children[i];
                if (child instanceof Label)
                    child.color = color;
                else if (child instanceof DayButton) {
                    for (let i2 = 0; i2 < child.children.length; i2++) {
                        let child2 = child.children[i2];
                        if (child2 instanceof Label)
                            child2.color = color;
                        else if (child2 instanceof Rectangle)
                            child2.fill = child.isSelected ? selectColor : dayColor;
                    }
                }
            }
        }

        static style: object = {
            color: 'black',
            dayColor: new Color(0.81, 0.81, 0.81, 0.5),
            selectColor: 'rgba(96,181,255,0.5)'
        }
    }

    class DayButton extends Pressable {
        monthCalendarDate: Date;
        monthCalendarCurrent: boolean;
        isSelected: boolean = false;
    }

    class MonthYearButton extends FlatButton {
        monthCalendarDate: Date;
        monthCalendarCurrent: boolean;

        constructor(init?: ButtonInit) {
            super(init);
            // force compact style
            this.setStyleProperty('textWidth', 10);
            this.setStyleProperty('textTransform', 'none');
            this.setStyleProperty('fontWeight', 'bold');
        }
    }
}
