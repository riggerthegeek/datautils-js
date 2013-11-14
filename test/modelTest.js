/**
 * Model Test
 *
 * Run these tests using Mocha framework. Eg..
 *  mocha modelTest.js
 *
 * Mocha runs best when install as a global dependency.
 *
 * @link http://visionmedia.github.io/mocha/
 * @author Simon Emms <simon@simonemms.com>
 */

var expect = require("chai").expect;

var model = require("../").model;

describe("Model tests", function() {

    describe("Instantiation tests", function() {

        it("should define a model with no definition", function(done) {

            /* Define the model */
            var Model = model.extend();

            var obj = new Model();

            expect(obj).to.be.instanceof(Model);
            expect(obj.toData()).to.be.eql({});
            expect(obj.toObject()).to.be.eql({});
            expect(obj.set("invalid", "a string")).to.be.undefined;
            expect(obj.get("invalid")).to.be.undefined;

            done();

        });

        describe("Model with definitions", function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        array: {
                            type: "array"
                        },
                        boolean: {
                            type: "boolean",
                            value: false
                        },
                        date: {
                            type: "date"
                        },
                        float: {
                            type: "float"
                        },
                        integer: {
                            type: "integer",
                            column: "int"
                        },
                        object: {
                            type: "object"
                        },
                        string: {
                            type: "string"
                        },
                        notSet: {},
                        notSetNull: null
                    }
                });

            });

            it("should define a model with definitions", function(done) {

                var obj1 = new Model({
                    array: [
                        "an","array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: "2013-02-07 10:11:12",
                    float: "2.3",
                    integer: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string",
                    notSet: "if not set, it is a string",
                    notSetNull: "if not set, it is a string"
                });

                expect(obj1).to.be.instanceof(Model);

                expect(obj1.toData()).to.be.eql({
                    array: [
                        "an","array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: new Date("2013-02-07 10:11:12"),
                    float: 2.3,
                    int: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string",
                    notSet: "if not set, it is a string",
                    notSetNull: "if not set, it is a string"
                });
                expect(obj1.toObject()).to.be.eql({
                    array: [
                        "an","array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: new Date("2013-02-07 10:11:12"),
                    float: 2.3,
                    integer: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string",
                    notSet: "if not set, it is a string",
                    notSetNull: "if not set, it is a string"
                });
                expect(obj1.set("invalid", "a string")).to.be.undefined;
                expect(obj1.get("invalid")).to.be.undefined;

                expect(obj1.set("integer", 12345)).to.be.undefined;
                expect(obj1.get("integer")).to.be.equal(12345);

                done();

            });

            it("should return default values if nothing set", function(done) {

                var obj = new Model();

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: false,
                    date: null,
                    float: null,
                    integer: null,
                    object: null,
                    string: null,
                    notSet: null,
                    notSetNull: null
                });

                /* Check stuff can be set */
                obj.set("integer", "12345");
                expect(obj.get("integer")).to.be.equal(12345);

                obj.set("boolean", "t");
                expect(obj.get("boolean")).to.be.true;

                done();

            });

            it("should create a model from data", function(done) {

                var obj = Model.toModel({
                    boolean: "1",
                    date: "2013-02-07 10:20:30",
                    float: "3",
                    int: 4,
                    string: "hello this is a string",
                    notSet: null
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: true,
                    date: new Date("2013-02-07 10:20:30"),
                    float: 3,
                    integer: 4,
                    object: null,
                    string: "hello this is a string",
                    notSet: null,
                    notSetNull: null
                });

                /* Check stuff can be set */
                obj.set("integer", "12345");
                expect(obj.get("integer")).to.be.equal(12345);

                obj.set("boolean", 0);
                expect(obj.get("boolean")).to.be.false;

                done();

            });

        });

    });

    describe("Extending the model", function() {



    });

    describe("Validation check", function() {



    });

    describe("Error checks", function() {



    });

});