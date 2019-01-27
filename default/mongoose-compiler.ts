import {Schema, SchemaDefinition, SchemaType, SchemaTypeOpts} from 'mongoose';
import Compiler from "../src/compiler";
import {ArrayType, BooleanType, DateType, NumberType, RelationType, StringType} from "../src/types";

export namespace Compiler {
    export class MongooseCompiler implements Compiler<Schema> {
        compile<T>(schema: T): Schema {
            // @ts-ignore
            console.log(`converting schema: ${schema.constructor.name}`);
            const keys = Object.getOwnPropertyNames(schema);
            const target: SchemaDefinition = {};
            for (const key of keys) {
                const value: any = schema[key];
                const converted = this.convert(value);
                if (converted) {
                    target[key] = converted;
                }
            }
            return new Schema(target);
        }

        compileAll<T>(schemas: T[]): Schema[] {
            return schemas.map(this.compile.bind(this));
        }

        private convert(value: any): SchemaTypeOpts<any> {
            const target = {
                type: null,
                description: value.description,
                default: value.defaultValue,
                required: value.required,
            };
            let targetType;
            if (value instanceof StringType) {
                targetType = Schema.Types.String;
            } else if (value instanceof NumberType) {
                targetType = Schema.Types.String;
            } else if (value instanceof BooleanType) {
                targetType = Schema.Types.Boolean;
            } else if (value instanceof DateType) {
                targetType = Schema.Types.Date;
            } else if (value instanceof ArrayType) {
                targetType = Schema.Types.Array;
            } else if (value instanceof RelationType) {
                if (value.embedFirst) {
                    targetType = this.compile(value.target);
                } else if (!value.target.name) {
                    throw Error('NAMELESS_RELATION_REF');
                } else {
                    targetType = Schema.Types.ObjectId;
                    // @ts-ignore
                    target.ref = value.target.name;
                }
            } else {
                return null
            }
            target.type = targetType;
            return target
        }
    }
}
