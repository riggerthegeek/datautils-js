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

        describe("Create functions on a model", function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string"
                        },
                        parentId: {
                            type: "integer",
                            value: 0
                        }
                    },
                    getName: function() {
                        return this.get("name");
                    },
                    isBoss: function() {
                        return this.get("parentId") === 1;
                    },
                    setName: function(name) {
                        this.set("name", name);
                    }
                });

            });

            it('should return the name when set', function(done) {

                var obj = new Model({
                    name: "Test",
                    parentId: 2
                });

                expect(obj.getName()).to.be.equal("Test");
                expect(obj.isBoss()).to.be.false;
                expect(obj.setName("Kevin")).to.be.undefined;
                expect(obj.getName()).to.be.equal("Kevin");

                var fail = false;
                try {
                    obj.nonExistentFunction();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("Object [object Object] has no method 'nonExistentFunction'");
                }

                expect(fail).to.be.true;

                done();

            });

        });

    });

    describe("Extending the model", function() {

        it("should extend model and keep parent methods", function(done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    name: {
                        type: "string"
                    }
                },
                getName: function() {
                    return this.get("name");
                }
            });

            var childModel = Model.extend({
                definition: {
                    jobTitle: {
                        type: "string"
                    }
                },
                getJobTitle: function() {
                    return this.get("jobTitle");
                }
            });

            var obj1 = new Model({
                name: "Name"
            });

            expect(obj1).to.be.instanceof(Model);
            expect(obj1.toObject()).to.be.eql({
                name: "Name"
            });
            expect(obj1.getName()).to.be.equal("Name");

            var obj2 = new childModel({
                name: "Foo",
                jobTitle: "King"
            });

            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(childModel);
            expect(obj2.toObject()).to.be.eql({
                name: "Foo",
                jobTitle: "King"
            });
            expect(obj2.getName()).to.be.equal("Foo");
            expect(obj2.getJobTitle()).to.be.equal("King");

            done();

        });

        it("should extend model and keep parent methods", function(done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    age: {
                        type: "float"
                    }
                },
                getAge: function() {
                    return this.get("age");
                }
            });

            var childModel = Model.extend({
                definition: {
                    age: {
                        type: "integer"
                    }
                },
                getAge: function() {
                    return String(this.get("age"));
                }
            });

            var obj1 = new Model({
                age: "42"
            });

            var obj2 = new childModel({
                age: "18"
            });

            expect(obj1).to.be.instanceof(Model);
            expect(obj1.toObject()).to.be.eql({
                age: 42
            });
            expect(obj1.getAge()).to.be.equal(42);

            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(childModel);
            expect(obj2.toObject()).to.be.eql({
                age: 18
            });
            expect(obj2.getAge()).to.be.equal("18");

            done();

        });

        it("should extend a model with no definition", function(done) {

            /* Define the model */
            var Model = model.extend({
                getAge: function() {
                    return this.get("age");
                },
                getName: function() {
                    return this.get("name");
                }
            });

            var childModel = Model.extend({
                definition: {
                    age: {
                        type: "integer"
                    },
                    name: {
                        type: "string"
                    }
                },
                getName: function() {
                    return "Name: " + this.get("name");
                }
            });

            var obj1 = new Model();

            var obj2 = new childModel({
                age: 26,
                name: "Test"
            });

            expect(obj1).to.be instanceof(Model);
            expect(obj1.toObject()).to.be.eql({});
            expect(obj1.getAge()).to.be.undefined;

            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(childModel);

            expect(obj2.toObject()).to.be.eql({
                age: 26,
                name: "Test"
            });
            expect(obj2.getAge()).to.be.equal(26);
            expect(obj2.getName()).to.be.equal("Name: Test");

            done();

        });

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

        describe('Validate rules that receive a single parameter', function() {

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

        describe('Validate rules that receive multiple parameters', function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [{
                                rule: "lengthBetween",
                                param: [
                                    5,
                                    10
                                ]
                            }]
                        }
                    }
                });

            });

            it('should validate the multi-parameter rule', function(done) {

                var obj = new Model({
                    name: "The name"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should throw an error if the name is too short', function(done) {

                var obj = new Model({
                    name: "name"
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
                            message: "VALUE_NOT_BETWEEN_MINLENGTH_AND_MAXLENGTH",
                            value: "name",
                            params: [
                                5,
                                10
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
                                        var result = value === "Hello";
                                        console.log(result);
                                        return result;
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