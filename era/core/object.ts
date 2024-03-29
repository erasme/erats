
function create<T>(ctor: new () => T, props: Partial<T>): T {
    return Object.assign(new ctor(), props);
}

function assign<T>(obj: T, props: Partial<T>): T {
    return Object.assign(obj, props);
}

namespace Core {
    //
    // @class Object class from which every Era classes derives.
    // It handles inheritance, serialization, dump function, manages events connections.
    //
    // @ts-ignore
    export class Object {
        //
        // Serialize a javascript object into a string
        // to deserialize, just use JSON.parse
        //
        serialize()
        {
            return JSON.stringify(this);
        }

        getClassName(): string {
            if ('name' in this.constructor)
                return this.constructor['name'];
            else {
                let matches = /function (.{1,})\(/.exec((this.constructor as any).toString());
                return matches ? matches[1] : (this.constructor as any).toString();
            }
        }

        assign(props: Partial<this>): this {
            return assign(this, props);
        }

        toString(): string {
            return `[object ${this.getClassName()}]`;
        }
    }
}
