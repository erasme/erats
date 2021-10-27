namespace Form {
    export interface FieldInit<TE extends Ui.Element> extends Ui.VBoxInit {
        title?: string;
        desc?: string;
        validate?: () => Promise<string | undefined>;
        required?: boolean;
        onchanged?: (event: { target: Field<TE>, value: any }) => void;
        onvalidchanged?: (event: { target: Field<TE>, value: boolean }) => void;
    }

    export abstract class Field<TE extends Ui.Element> extends Ui.VBox implements FieldInit<TE> {
        field: TE;
        validate?: () => Promise<string | undefined>;
        private _title: Ui.Text;
        private _desc: Ui.Text;
        private _descString?: string;
        private _errorMsg: string | undefined;
        private _requiredText: Ui.Html;
        private _required: boolean = false;
        private _lastIsValid: boolean | undefined;
        private _validateTask: Promise<string | undefined> | undefined;
        private flow = new Ui.Flow();
        readonly changed = new Core.Events<{ target: Field<TE>, value: any }>();
        set onchanged(value: (event: { target: Field<TE>, value: any }) => void) { this.changed.connect(value); };
        readonly validchanged = new Core.Events<{ target: Field<TE>, value: boolean }>();
        set onvalidchanged(value: (event: { target: Field<TE>, value: boolean }) => void) { this.validchanged.connect(value); };

        constructor(init?: FieldInit<TE>) {
            super(init);
            this.margin = 5;
            this.spacing = 5;

            this.flow = new Ui.Flow();
            this.flow.hide(true);
            this.append(this.flow);

            this._title = new Ui.Text();
            this.flow.append(this._title);

            this._requiredText = new Ui.Html({
                color: 'red', html: '<label title="champs obligatoire">*</label>'
            });
            this._requiredText.hide(true);
            this.flow.append(this._requiredText);

            this.field = this.generateUi();
            if ('changed' in this.field && (this.field as any)['changed'] instanceof Core.Events)
                ((this.field as any)['changed'] as Core.Events<any>).connect(() => {
                    this.onChange();
                    let value: any;
                    if ('value' in this.field)
                        value = (this.field as any).value;
                    this.changed.fire({ target: this, value: value });
                });
            this.field.marginLeft = 10;
            this.append(this.field);

            this._desc = new Ui.Text({ fontSize: 12, marginLeft: 10 });
            this._desc.hide(true);
            this.append(this._desc);

            if (init) {
                if (init.title !== undefined)
                    this.title = init.title;
                if (init.desc !== undefined)
                    this.desc = init.desc;
                if (init.required !== undefined)
                    this.required = init.required;
                if (init.validate !== undefined)
                    this.validate = init.validate;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
                if (init.onvalidchanged)
                    this.validchanged.connect(init.onvalidchanged);
            }
            this._lastIsValid = this.isValid;
        }

        protected abstract generateUi(): TE;

        abstract get isDefined(): boolean;

        get isValid(): boolean {
            return this._errorMsg == undefined && (!this.required || this.isDefined);
        }

        set title(title: string) {
            this._title.text = title;
            this.flow.show();
        }

        set desc(value: string) {
            this._desc.text = value;
            this._descString = value;
            if (value != undefined)
                this._desc.show();
            else
                this._desc.hide(true);
        }

        get required(): boolean {
            return this._required;
        }

        set required(value: boolean) {
            if (this._required != value) {
                this._required = value;
                if (this._required && !this.isDisabled)
                    this._requiredText.show();
                else
                    this._requiredText.hide(true);
                this.checkIsValid();
            }
        }

        checkIsValid() {
            this.onChange();
        }

        protected async onValidate(): Promise<string | undefined> {
            return (this.validate) ? await this.validate() : undefined;
        }

        protected async onChange() {
            let newErrorMsg: string | undefined;
            if (!this.isDefined) {
                newErrorMsg = undefined;
            }
            else {
                let validateTask = this.onValidate();
                this._validateTask = validateTask;
                newErrorMsg = await validateTask;
                // if another validate task has started before we set our
                // result, we drop this valid check to keep the temporal chronology
                if (this._validateTask != validateTask) {
                    return;
                }
            }
            this._validateTask = undefined;
            //let newErrorMsg = await this.onValidate();
            if (newErrorMsg) {
                this._desc.text = newErrorMsg;
                this._desc.color = 'red';
                this._desc.show();
            }
            else if (this._errorMsg != undefined) {
                this._desc.text = this._descString ? this._descString : '';
                this._desc.color = 'rgba(0,0,0,0.6)';
                if (!this._descString)
                    this._desc.hide(true);
            }
            this._errorMsg = newErrorMsg;
            let isValid = this.isValid;
            //console.log(`${this}.onChange oldIsValid: ${this._lastIsValid}, new: ${isValid}`);
            if (this._lastIsValid != isValid) {
                this._lastIsValid = isValid;
                this.validchanged.fire({ target: this, value: isValid });
            }
        }

        protected onDisable() {
            super.onDisable();
            this._requiredText.hide(true);
        }

        protected onEnable() {
            super.onEnable();
            if (this._required)
                this._requiredText.show();
        }
    }

    export interface TextFieldInit extends FieldInit<Ui.TextField> {
        placeholder?: string;
        value?: string;
    }

    export class TextField extends Field<Ui.TextField> implements TextFieldInit {
        constructor(init?: TextFieldInit) {
            super(init);
            if (init) {
                if (init.placeholder != undefined)
                    this.placeholder = init.placeholder;
                if (init.value != undefined)
                    this.value = init.value;
            }
        }

        protected generateUi() {
            return new Ui.TextField();
        }

        get isDefined(): boolean {
            return this.field.value != '';
        }

        get value(): string {
            return this.field.value;
        }

        set value(value: string) {
            this.field.value = value;
        }

        set placeholder(value: string) {
            this.field.textHolder = value;
        }
    }

    export class TextButtonField extends Field<Ui.TextButtonField> {

        readonly pressed = new Core.Events<{ target: TextButtonField }>();
        set onpressed(value: (event: { target: TextButtonField }) => void) { this.pressed.connect(value); }

        constructor() {
            super();
            this.field.buttonpressed.connect((e) => this.pressed.fire({ target: this }));
        }

        protected generateUi() {
            return new Ui.TextButtonField();
        }

        get isDefined(): boolean {
            return this.field.value != '';
        }

        get value(): string {
            return this.field.value;
        }

        set value(value: string) {
            this.field.value = value;
        }

        set placeholder(value: string) {
            this.field.textHolder = value;
        }

        set icon(value: string) {
            this.field.buttonIcon = value;
        }
    }


    export interface TextAreaFieldInit extends FieldInit<Ui.TextAreaField> {
        placeholder?: string;
    }

    export class TextAreaField extends Field<Ui.TextAreaField> implements TextAreaFieldInit {
        constructor(init?: TextAreaFieldInit) {
            super(init);
            if (init) {
                if (init.placeholder != undefined)
                    this.placeholder = init.placeholder;
            }
        }

        protected generateUi() {
            return new Ui.TextAreaField();
        }

        get isDefined(): boolean {
            return this.field.value != '';
        }

        get value(): string {
            return this.field.value;
        }

        set value(value: string) {
            this.field.value = value;
        }

        set placeholder(value: string) {
            this.field.textHolder = value;
        }
    }


    export interface DateFieldInit extends FieldInit<Ui.DatePicker> {
        placeholder?: string;
        value?: Date;
    }

    export class DateField extends Field<Ui.DatePicker> {
        constructor(init?: DateFieldInit) {
            super(init);
            if (init) {
                if (init.placeholder !== undefined)
                    this.placeholder = init.placeholder;
                else
                    this.placeholder = 'jj/mm/aaaa';
                if (init.value)
                    this.value = init.value;
            }
        }

        protected generateUi() {
            return new Ui.DatePicker();
        }

        get isDefined(): boolean {
            return this.field.selectedDate != undefined;
        }

        get value(): Date | undefined {
            return this.field.selectedDate;
        }

        set value(value: Date | undefined) {
            this.field.selectedDate = value;
        }

        set placeholder(value: string) {
            this.field.textHolder = value;
        }
    }

    export interface TimeFieldInit extends FieldInit<Ui.TextField> {
        placeholder?: string;
        value?: string;
    }

    export class TimeField extends Field<Ui.TextField> {
        constructor(init?: TextFieldInit) {
            super(init);
            this.placeholder = 'hh:mm';
            this.validate = async () => {
                if (this.value != "" && !this.value.match(/^\d{1,2}:\d{1,2}$/))
                    return "Format attendu hh:mm";
                let parts = this.value.split(':');
                let hours = parseInt(parts[0]);
                let minutes = parseInt(parts[1]);
                if (hours < 0 || hours > 23)
                    return "Heure invalide";
                if (minutes < 0 || minutes > 59)
                    return "Minutes invalides";
            };
            if (init) {
                if (init.placeholder !== undefined)
                    this.placeholder = init.placeholder;
                if (init.value)
                    this.value = init.value;
            }
        }

        protected generateUi() {
            return new Ui.TextField();
        }

        get isDefined(): boolean {
            return this.field.value != undefined && this.field.value != '';
        }

        get value(): string {
            return this.field.value;
        }

        set value(value: string) {
            this.field.value = value;
        }

        get time(): { hours: number, minutes: number } | undefined {
            if (this.value == "" || !this.value.match(/^\d{1,2}:\d{1,2}$/))
                return undefined;
            let parts = this.value.split(':');
            let hours = parseInt(parts[0]);
            if (hours < 0 || hours > 23)
                return undefined;
            let minutes = parseInt(parts[1]);
            if (minutes < 0 || minutes > 59)
                return undefined;
            return { hours: hours, minutes: minutes };
        }

        get hours(): number | undefined {
            let time = this.time;
            return (!time) ? undefined : time.hours;
        }

        get minutes(): number | undefined {
            let time = this.time;
            return (!time) ? undefined : time.minutes;
        }

        get totalSeconds(): number | undefined {
            let time = this.time;
            return (!time) ? undefined : time.hours * 3600 + time.minutes * 60;
        }

        set placeholder(value: string) {
            this.field.textHolder = value;
        }
    }


    export interface SliderFieldInit extends FieldInit<Ui.Slider> {
    }

    export class SliderField extends Field<Ui.Slider> implements SliderFieldInit {
        constructor(init?: SliderFieldInit) {
            super(init);
        }

        protected generateUi() {
            return new Ui.Slider();
        }

        get isDefined(): boolean {
            return true;
        }

        get value(): number {
            return this.field.value;
        }

        set value(value: number) {
            this.field.value = value;
        }
    }

    export interface ComboFieldInit<T> extends FieldInit<Ui.Combo<T>> {
        text?: string;
        value?: T;
        key?: keyof T;
        search?: boolean;
        data?: T[];
        allowNone?: boolean;
        placeholder?: string;
        position?: number;
    }

    export class ComboField<T> extends Field<Ui.Combo<T>> implements ComboFieldInit<T> {
        private _data: T[] = [];

        constructor(init?: ComboFieldInit<T>) {
            super(init);
            if (init) {
                if (init.text !== undefined)
                    this.text = init.text;
                if (init.key !== undefined)
                    this.key = init.key;
                if (init.search !== undefined)
                    this.search = init.search;
                if (init.placeholder !== undefined)
                    this.placeholder = init.placeholder;
                if (init.data !== undefined)
                    this.data = init.data;
                if (init.position !== undefined)
                    this.position = init.position;
                if (init.value !== undefined)
                    this.value = init.value;
                if (init.allowNone != undefined)
                    this.allowNone = init.allowNone;
            }
        }

        protected generateUi() {
            return new Ui.Combo<T>();
        }

        get isDefined(): boolean {
            return this.field.position != -1;
        }

        set search(value: boolean) {
            this.field.search = value;
        }

        set key(key: keyof T) {
            this.field.field = key;
        }

        get allowNone(): boolean {
            return this.field.allowNone;
        }

        set allowNone(value: boolean) {
            this.field.allowNone = value;
        }

        get data(): T[] {
            return this._data;
        }

        set data(data: T[]) {
            this._data = data;
            this.field.data = this._data;
        }

        set text(value: string) {
            this.field.text = value;
        }

        get value(): T | undefined {
            return this.field.value;
        }

        set value(value: T | undefined) {
            if (value) {
                let pos = this.data.indexOf(value);
                this.field.position = pos;
            }
            else
                this.field.position = -1;
        }

        set position(position: number) {
            this.field.position = position;
        }

        set placeholder(value: string) {
            this.field.placeHolder = value;
        }
    }

    export interface CheckBoxFieldInit extends FieldInit<Ui.CheckBox> {
        value?: boolean;
        text?: string;
    }

    export class CheckBoxField extends Field<Ui.CheckBox> implements CheckBoxFieldInit {
        constructor(init?: CheckBoxFieldInit) {
            super(init);
            if (init) {
                if (init.value != undefined)
                    this.value = init.value;
                if (init.text != undefined)
                    this.text = init.text;
            }
        }

        protected generateUi() {
            return new Ui.CheckBox();
        }

        get isDefined(): boolean {
            return true;
        }

        get value(): boolean {
            return this.field.value;
        }

        set value(value: boolean) {
            this.field.value = value;
        }

        get text(): string | undefined {
            return this.field.text;
        }

        set text(value: string | undefined) {
            this.field.text = value;
        }
    }

    export interface YesNoFieldInit extends FieldInit<Ui.Combo<{ name: string, value: boolean }>> {
        value?: boolean;
        allowNone?: boolean;
    }

    export class YesNoField extends Field<Ui.Combo<{ name: string, value: boolean }>> implements YesNoFieldInit {

        constructor(init?: YesNoFieldInit) {
            super(init);
            if (init) {
                if (init.allowNone != undefined)
                    this.allowNone = init.allowNone;
                if (init.value != undefined)
                    this.value = init.value;
            }
        }

        protected generateUi() {
            return new Ui.Combo({
                field: 'name',
                data: [
                    { name: 'Oui', value: true },
                    { name: 'Non', value: false }
                ]
            });
        }

        get isDefined(): boolean {
            return this.field.value !== undefined && this.field.value.value !== undefined;
        }

        get value(): boolean {
            return this.field.value ? this.field.value.value : false;
        }

        set value(value: boolean) {
            this.field.position = value ? 0 : 1;
        }

        get allowNone(): boolean {
            return this.field.allowNone;
        }

        set allowNone(value: boolean) {
            this.field.allowNone = value;
        }
    }

    export interface NumberFieldInit extends FieldInit<Ui.TextField> {
        placeholder?: string;
        value?: number;
    }

    export class NumberField extends Field<Ui.TextField> implements NumberFieldInit {
        constructor(init?: NumberFieldInit) {
            super(init);
            if (init) {
                if (init.value != undefined)
                    this.value = init.value;
            }
        }

        protected generateUi() {
            return new Ui.TextField().assign({ inputMode: 'number', type: 'number' });
        }

        get isDefined(): boolean {
            return this.field.value != '' && !isNaN(parseFloat(this.field.value));
        }

        get value(): number | undefined {
            return this.field.value == '' ? undefined : parseFloat(this.field.value);
        }

        set value(value: number | undefined) {
            this.field.value = value == undefined ? '' : value.toString();
        }

        set min(value: number) {
            this.field.entry.drawing.min = value.toString();
        }

        set max(value: number) {
            this.field.entry.drawing.max = value.toString();
        }

        set step(value: number) {
            this.field.entry.drawing.step = value.toString();
        }

        set placeholder(value: string) {
            this.field.textHolder = value;
        }
    }

    export interface ColorFieldInit extends Form.FieldInit<Ui.ColorButton> {
        value?: Ui.Color;
    }

    export class ColorField extends Field<Ui.ColorButton> implements ColorFieldInit {
        constructor(init?: ColorFieldInit) {
            super(init);
            if (init) {
                if (init.value != undefined)
                    this.value = init.value;
            }
        }

        protected generateUi() {
            return new Ui.ColorButton();
        }

        get isDefined(): boolean {
            return true;
        }

        get value(): Ui.Color {
            return this.field.value;
        }

        set value(value: Ui.Color) {
            this.field.value = value;
        }

        get alpha() {
            return this.field.alpha;
        }

        set alpha(value: boolean) {
            this.field.alpha = value;
        }

        set palette(palette: Array<Ui.Color>) {
            this.field.palette = palette.map(color => Ui.Color.create(color));
        }

        get palette(): Array<Ui.Color> {
            return this.field.palette;
        }
    }
}