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

            it('should ignore undefined elements', function(done) {

                var obj = Model.toModel({
                    boolean: "N",
                    bool: true
                });

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

                done();

            });

        });

    });

    describe("Extending the model", function() {



    });

    describe("Validation check", function() {

        describe('Single rule', function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [{
                                rule: "required"
                            }]
                        }
                    }
                });

            });

            it('should not throw an error when a string is provided', function(done) {

                var obj = new Model({
                    name: "Test Name"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should throw error when string is null', function(done) {

                var obj = new Model();

                expect(obj).to.be.instanceof(Model);

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        name: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe('Multiple keys, single rules on all', function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [{
                                rule: "required"
                            }]
                        },
                        emailAddress: {
                            type: "string",
                            validation: [{
                                rule: "email"
                            }]
                        }
                    }
                });

            });

            it('should validate both rules', function(done) {

                var obj = new Model({
                    name: 'Test',
                    emailAddress: 'test@test.com'
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should fail to validate the first rule', function(done) {

                var obj = new Model({
                    emailAddress: 'test@test.com'
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        name: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

            it('should fail to validate the second rule', function(done) {

                var obj = new Model({
                    name: 'Test',
                    emailAddress: 'not@anemail'
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "not@anemail"
                        }]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

            it('should fail to validate both rules', function(done) {

                var obj = new Model({
                    emailAddress: "noanemail.com",
                    name: ""
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        name: [{
                            message: "VALUE_REQUIRED",
                            value: ""
                        }],
                        emailAddress: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "noanemail.com"
                        }]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe('Multiple keys, single rules on some', function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [{
                                rule: "required"
                            }]
                        },
                        emailAddress: {
                            type: "string"
                        }
                    }
                });

            });

        });

        describe('Multiple keys, multiple rules on all', function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        emailAddress1: {
                            type: "string",
                            validation: [{
                                rule: "required"
                            }, {
                                rule: "email"
                            }]
                        },
                        emailAddress2: {
                            type: "string",
                            validation: [{
                                rule: "required"
                            }, {
                                rule: "email"
                            }]
                        }
                    }
                });

            });

            it('should validate all rules', function(done) {

                var obj = new Model({
                    emailAddress1: "example@domain.com",
                    emailAddress2: "test@test.com"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should fail all rules', function(done) {

                var obj = new Model({
                    emailAddress1: "f",
                    emailAddress2: "testtest.com"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress1: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "f"
                        }],
                        emailAddress2: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "testtest.com"
                        }]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

            it('should fail one rule on one element', function(done) {

                var obj = new Model({
                    emailAddress1: "f",
                    emailAddress2: "testtest.com"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress1: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "f"
                        }],
                        emailAddress2: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "testtest.com"
                        }]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

            it("should fail on multiple errors on a single key", function(done) {

                var obj = new Model({
                    emailAddress2: "test@test.com"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress1: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }, {
                            message: "VALUE_NOT_EMAIL_NOT_STRING",
                            value: null
                        }]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe('Validate rules that receive parameters', function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [{
                                rule: "minLength",
                                param: 5
                            }]
                        }
                    }
                });

            });

            it('should validate the model', function(done) {

                var obj = new Model({
                    name: "Test1234"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should throw an error when not validated', function(done) {

                var obj = new Model({
                    name: "Test"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        name: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "Test",
                            params: [
                                5
                            ]
                        }]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe('Validate against custom validation rules', function() {

            describe('No parameters passed', function() {

                var Model;

                before(function() {

                    /* Define the model */
                    Model = model.extend({
                        definition: {
                            name: {
                                type: "string",
                                validation: [{
                                    rule: function(value) {
                                        if(value === 'throw') {
                                            throw new Error('THROWN_ERROR');
                                        }
                                        return value === "Hello";
                                    }
                                }]
                            }
                        }
                    });

                });

                it('should validate the custom rule', function(done) {

                    var obj = new Model({
                        name: "Hello"
                    });

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when custom rule returns false', function(done) {

                    var obj = new Model({
                        name: "Potato"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("ModelError");

                        expect(err.getErrors()).to.be.eql({
                            name: [{
                                message: "CUSTOM_VALIDATION_FAILED",
                                value: "Potato"
                            }]
                        });
                    }

                    expect(fail).to.be.true;

                    done();

                });

                it('should throw an error when custom rule throws error', function(done) {

                    var obj = new Model({
                        name: "throw"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("ModelError");

                        expect(err.getErrors()).to.be.eql({
                            name: [{
                                message: "THROWN_ERROR",
                                value: "throw"
                            }]
                        });
                    }

                    expect(fail).to.be.true;

                    done();

                });

            });

        });

    });

});