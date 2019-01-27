import {expect} from 'chai';
import Schema from "../src/schema";
import {BooleanType, DateType, NumberType, RelationType, StringType} from "../src/types";
import {Compiler} from './index';

class StringSchema implements Schema {
    name = 'string';
    physical = true;
    value = new StringType(null, null, null, null)
}

class NumberSchema implements Schema {
    name = 'string';
    physical = true;
    value = new NumberType(null, null, null, null)
}

class DateSchema implements Schema {
    name = 'string';
    physical = true;
    value = new DateType(null, null, null, null)
}

class BooleanSchema implements Schema {
    name = 'string';
    physical = true;
    value = new BooleanType(null, null, null, null)
}

class Wheel implements Schema {
    name = 'wheel';
    physical = true;
    brand = new StringType('Manufacture', null, "TOYOTA", true);
    size = new NumberType('diameter in cm', (s) => s > 50, 70, false)
}

class Car implements Schema {
    name = 'car';
    physical = true;
    brand = new StringType('Manufacture', null, "TOYOTA", true);
    model = new StringType(null, null, "Hello", true);
    wheels = new RelationType(new Wheel(), null, false, false, false, 'Fair')
}

class Plane implements Schema {
    name = 'plane';
    physical = true;
    brand = new StringType('Manufacture', null, "AIR BUS", true);
    wheels = new RelationType(new Wheel(), null, false, true, false, 'Hello', false)
}

describe('Mongoose Compiler',() => {
    const stringSchema = new StringSchema();
    const numberSchema = new NumberSchema();
    const dateSchema = new DateSchema();
    const boolSchema = new BooleanSchema();
    const wheel = new Wheel();
    const car = new Car();
    const plane = new Plane();

    let compiler;

    beforeEach(() => {
        compiler = new Compiler.MongooseCompiler();
    });

    it('Should create schema with correct string value', () => {
        const schema = compiler.compile(stringSchema);
        const paths = schema.paths;
        expect(paths).to.haveOwnProperty('value');
        expect(paths.value.instance).to.be.equal('String');
    });

    it('Should create schema with correct number value', () => {
        const schema = compiler.compile(numberSchema);
        const paths = schema.paths;
        expect(paths).to.haveOwnProperty('value');
        expect(paths.value.instance).to.be.equal('Number');
    });

    it('Should create schema with correct date value', () => {
        const schema = compiler.compile(dateSchema);
        const paths = schema.paths;
        expect(paths).to.haveOwnProperty('value');
        expect(paths.value.instance).to.be.equal('Date');
    });

    it('Should create schema with correct boolean value', () => {
        const schema = compiler.compile(boolSchema);
        const paths = schema.paths;
        expect(paths).to.haveOwnProperty('value');
        expect(paths.value.instance).to.be.equal('Boolean');
    });

    it('Should create complex Schema', () => {
        const schema = compiler.compile(wheel);
        const paths = schema.paths;
        expect(paths).to.haveOwnProperty('brand');
        expect(paths.brand.instance).to.be.equal('String');
        expect(paths).to.haveOwnProperty('size');
        expect(paths.size.instance).to.be.equal('Date');
    });

    it('Should compile embed Schema', () => {
        const schema = compiler.compile(plane);
        const paths = schema.paths;
        expect(paths).to.haveOwnProperty('wheels');
        expect(paths.wheels.instance).to.be.equal('Embedded');
        expect(paths.wheels.schema).to.not.be.undefined;
    });

    it('Should reference correct Schema', () => {
        const schema = compiler.compile(car);
        const paths = schema.paths;
        expect(paths).to.haveOwnProperty('wheels');
        expect(paths.wheels.schema).to.be.undefined;
        expect(paths.wheels.instance).to.be.equal('ObjectID');
    });
});
