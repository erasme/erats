namespace Ui {
    export class Transition extends Core.Object {
        constructor() {
            super();
        }

        run(current: Element, next: Element, progress: number) {
            throw ('transition classes MUST override run method');
        }

        protected static transitions: object = {};

        static register(transitionName: string, classType) {
            this.transitions[transitionName] = classType;
        }

        static parse(transition) {
            return new this.transitions[transition]();
        }

        static create(transition: Transition | string): Transition {
            if (transition instanceof Transition)
                return transition;
            return new this.transitions[transition]();
        }
    }
}	

