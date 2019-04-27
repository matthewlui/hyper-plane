import Schema from "./schema";

/**
 * Abstract base class of any concrete schema type with default informative properties
 * @property {String|*} description
 * @property {(any)=>Boolean} validation
 * @property {any|()=>any|*} defaultValue
 * @property {boolean|string} required Can set with string to explain reason, will treat as true in this case
 * @property {boolean|string} unique Can set with string to explain reason, will treat as true in this case
 */
export abstract class SchemaType<T> {
    constructor(
        public description: String | null = null,
        public validation: (value: T) => Boolean | null = null,
        public defaultValue: (() => T) | T | null = null,
        public required: Boolean | String = false,
        public unique: Boolean | String = false,
    ) {}
}

/**
 * Placeholder for SchemaType<string>
 */
export class StringType extends SchemaType<string> {}

/**
 * Placeholder for SchemaType<number>
 */
export class NumberType extends SchemaType<number> {}

/**
 * Placeholder for SchemaType<boolean>
 */
export class BooleanType extends SchemaType<boolean> {}

/**
 * Placeholder for SchemaType<Date>
 */
export class DateType extends SchemaType<Date> {}

/**
 * Define a array type, ***ONLY WORK IN DOCUMENT BASE DB***
 */
export class ArrayType<T> extends SchemaType<T[]> {}

/**
 * A yet to implement geolocation representation
 */
class GeoLocation {}

/**
 * Placeholder for SchemaType<GeoLocation>
 */
export class GeoLocationType extends SchemaType<GeoLocation> {}

/**
 * @property {Schema} target Schema which will associate to, for document base embedded or RMDB table as schema name
 * @property {String} foreign Foreign field to track, for support ORM compiler customization, null normally means by default id
 * @property {Boolean} toMany In document base, can convert to an array of sub doc, or in RMDB, a to many relationship
 * @property {Boolean} embedFirst When set to true, for document base NoSQL, will use embed document
 * @property {Boolean} alwaysThere for compiler enhancement, in supported ORM compiler, can always auto populate
 */
export class RelationType<Schema> extends SchemaType<SchemaType<Schema>> {
    constructor(
        public target: Schema | String,
        public foreign: String | null,
        public toMany: Boolean | false,
        public embedFirst: Boolean | false,
        public alwaysThere: Boolean | false = false,
        public description: String | null = null,
        public required: Boolean | String = false,
        public unique: Boolean | String = false,
    ) {
        super(description, null, null, required, unique);
    }
}
