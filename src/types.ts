import Schema from "./schema";

/**
 * Foundation of any concrete schema type
 */
export abstract class SchemaType<T> {
    constructor(
        public description: String | null = null,
        public validation: (value: T) => Boolean | null = null,
        public defaultValue: (() => T) | T | null = null,
        public required: Boolean | String = false,
    ) {
    }
}

export class StringType extends SchemaType<string> {
}

export class NumberType extends SchemaType<number> {
}

export class BooleanType extends SchemaType<boolean> {
}

export class DateType extends SchemaType<Date> {
}

export class ArrayType<T> extends SchemaType<T[]> {
}

class GeoLocation {
}

export class GeoLocationType extends SchemaType<GeoLocation> {
}

export class RelationType<Schema> extends SchemaType<SchemaType<Schema>> {

    constructor(
        public target: Schema,
        public foreign: String | null,
        public toMany: Boolean | false,
        /// When set to true, for document base NoSQL, will use embed document
        public embedFirst: Boolean | false,
        public alwaysThere: Boolean | false,
        public description: String | null = null,
        public required: Boolean | String = false,
    ) {
        super(description, null, null, required);
    }
}
