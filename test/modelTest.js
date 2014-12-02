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
                        }
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
                    string: "some string"
                });

                expect(obj1.getDefinition("array").getSetting("test")).to.be.undefined;

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
                    string: "some string"
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
                    string: "some string"
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
                    string: null
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
                    string: "hello this is a string"
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: true,
                    date: new Date("2013-02-07 10:20:30"),
                    float: 3,
                    integer: 4,
                    object: null,
                    string: "hello this is a string"
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
                    string: null
                });

                done();

            });

        });

        describe("Model getters and setters", function() {

            it("should use the default setter", function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        simple: {
                            type: 'string',
                            value: null
                        }
                    }
                });

                var obj = new Model({
                    simple: 'hello'
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.get('simple')).to.be.equal('hello');

                expect(obj.set('simple', 'test')).to.be.undefined;
                expect(obj.get('simple')).to.be.equal('test');

                expect(obj.set('simple')).to.be.undefined;
                expect(obj.get('simple')).to.be.null;

                done();

            });

            it('should use the defined setter', function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        complex: {
                            type: 'string',
                            value: null
                        }
                    },
                    setComplex: function setter(value, defaults) {

                        value = require('../').data.setString(value, defaults);

                        if(value !== defaults) {
                            value = "test-" + value;
                        }

                        this.set('complex', value, false);

                        /* Wouldn't normally return on a setter, but allow functionality */
                        return true;
                    }
                });

                var obj = new Model({
                    complex: 'hello'
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.get('complex')).to.be.equal('test-hello');

                expect(obj.set('complex', 'test')).to.be.true;
                expect(obj.get('complex')).to.be.equal('test-test');

                expect(obj.set('complex')).to.be.true;
                expect(obj.get('complex')).to.be.null;

                done();

            });

            it("should only set a value if it's an enumerable value", function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        str: {
                            type: 'enum',
                            enum: [
                                "value1", "value2"
                            ],
                            value: null
                        }
                    }
                });

                var obj1 = new Model({
                    str: "value1"
                });

                expect(obj1.get("str")).to.be.equal("value1");
                obj1.set("str", "value2");
                expect(obj1.get("str")).to.be.equal("value2");
                obj1.set("str", "value3");
                expect(obj1.get("str")).to.be.null;

                var obj2 = new Model({
                    str: "value2"
                });

                expect(obj2.get("str")).to.be.equal("value2");
                obj2.set("str", "value1");
                expect(obj2.get("str")).to.be.equal("value1");
                obj2.set("str", "value3");
                expect(obj2.get("str")).to.be.null;

                var obj3 = new Model({
                    str: "value3"
                });

                expect(obj3.get("str")).to.be.null;
                obj3.set("str", "value1");
                expect(obj3.get("str")).to.be.equal("value1");
                obj3.set("str", "value2");
                expect(obj3.get("str")).to.be.equal("value2");

                done();

            });

        });

        describe("Primary keys", function() {

            it('should set no primary key value', function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id"
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = new Model({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.null;
                expect(obj.getPrimaryKeyValue()).to.be.undefined;

                var from = Model.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.null;
                expect(from.getPrimaryKeyValue()).to.be.undefined;

                done();

            });

            it('should set the primary key', function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = new Model();

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.null;

                var from = Model.toModel();

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.null;

                done();

            });

            it('should set the primary key value', function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = new Model({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.equal(1);

                var from = Model.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.equal(1);

                done();

            });

            it('should throw error when more than one primary key is given', function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string",
                            value: null,
                            primaryKey: true
                        }
                    }
                });

                var fail = false;

                try {
                    obj = new Model();
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("CANNOT_SET_MULTIPLE_PRIMARY_KEYS");

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("The mixed datatype", function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        mixed: {
                            type: "mixed",
                            value: null
                        }
                    }
                });

            });

            it('should create a mixed definition', function(done) {

                var obj = new Model({
                    mixed: "string"
                });

                expect(obj.get("mixed")).to.be.equal("string");

                /* Now set all datatypes */
                var arrTypes = [
                    "222",
                    222,
                    22.22,
                    new Date(),
                    {},
                    {type: "string"},
                    ["array"],
                    null,
                    true,
                    false
                ];

                arrTypes.forEach(function(value) {

                    expect(obj.set("mixed", value)).to.be.undefined;
                    expect(obj.get("mixed")).to.be.equal(value);

                });

                var arrObjTypes = [
                    NaN
                ];

                arrObjTypes.forEach(function(value) {

                    expect(obj.set("mixed", value)).to.be.undefined;
                    expect(obj.get("mixed")).to.be.eql(value);

                });

                expect(obj.set("mixed", undefined)).to.be.undefined;
                expect(obj.get("mixed")).to.be.equal(null);

                done();

            });

        });

        describe("Function as a datatype", function() {

            var Model;

            beforeEach(function() {
                /* Define the model */
                Model = model.extend({
                    definition: {
                        func: {
                            type: function(value, defaults) {
                                return "value is " + value + ", default is " + defaults;
                            },
                            value: "string"
                        }
                    }
                });
            });

            it("should allow a function as a datatype when no data sent", function(done) {

                var obj = new Model();

                expect(obj.get("func")).to.be.equal("value is undefined, default is string");

                done();

            });

            it("should allow a function as a datatype when no data sent", function(done) {

                var obj = new Model({
                    func: "some value"
                });

                expect(obj.get("func")).to.be.equal("value is some value, default is string");

                done();

            });

        });

        describe("Added static methods", function() {

            it("should allow adding of a static methods", function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        element: {
                            type: "string",
                            value: null
                        },
                        func: {
                            type: function() {
                                return Model.someConstant;
                            }
                        }
                    }
                }, {

                    someFunction: function() {
                        return "value";
                    },

                    someConstant: "constant"

                });

                var obj = new Model();

                expect(obj.get("func")).to.be.equal(Model.someConstant);
                expect(Model.someFunction()).to.be.equal("value");

                done();

            });

        });

        describe("Invalid datatypes", function() {

            it('should throw an error when you create model with no type', function(done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: null
                    }
                });

                try {
                    var obj = new Model();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;

                }

                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when you create model with no null type', function(done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: {
                            type: null
                        }
                    }
                });

                try {
                    var obj = new Model();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;

                }

                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when you create model with invalid data type', function(done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: {
                            type: "banana"
                        }
                    }
                });

                try {
                    var obj = new Model();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.equal("banana");

                }

                expect(fail).to.be.true;

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
                        this.set("name", name, false);
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
                }

                expect(fail).to.be.true;

                done();

            });

        });

        it("should add settings to the definition", function(done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    element: {
                        type: "string",
                        value: null,
                        settings: {
                            setting1: true,
                            setting2: false,
                            setting3: "string",
                            test: 222
                        }
                    }
                }
            });

            var obj = new Model({
                element: "value"
            });

            expect(obj.getDefinition("element").getSetting("setting1")).to.be.equal(true);
            expect(obj.getDefinition("element").getSetting("setting2")).to.be.equal(false);
            expect(obj.getDefinition("element").getSetting("setting3")).to.be.equal("string");
            expect(obj.getDefinition("element").getSetting("test")).to.be.equal(222);
            expect(obj.getDefinition("element").getSetting("undefined")).to.be.undefined;

            done();

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

            it('should not throw an error when email not specified and not required', function(done) {

                var M = model.extend({
                    definition: {
                        email: {
                            type: "string",
                            value: null,
                            validation: [{
                                rule: "email"
                            }]
                        }
                    }
                });

                var obj = new M();

                expect(obj.validate()).to.be.true;

                obj.set('email', 'notanemail');

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        email: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "notanemail"
                        }]
                    });

                    expect(err.getStack()).to.be.a("string").to.be.equal(err.stack);

                }

                expect(fail).to.be.true;

                obj.set("email", "test@test.com");

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

                obj.set("emailAddress1", "test@test.com");
                obj.set("emailAddress2", "test2@test.com");

                expect(obj.validate()).to.be.true;

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

                obj.set("emailAddress1", "test@test.com");
                obj.set("emailAddress2", "test2@test.com");

                expect(obj.validate()).to.be.true;

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
                        }]
                    });
                }

                expect(fail).to.be.true;

                obj.set("emailAddress1", "test@test.com");
                obj.set("emailAddress2", "test2@test.com");

                expect(obj.validate()).to.be.true;

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

                obj.set("name", "Test1234");

                expect(obj.validate()).to.be.true;

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

                obj.set("name", "The name");

                expect(obj.validate()).to.be.true;

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

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

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

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

            });

            describe('Single parameter passed', function() {

                var Model;

                before(function() {

                    /* Define the model */
                    Model = model.extend({
                        definition: {
                            name: {
                                type: "string",
                                validation: [{
                                    rule: function(value, match) {
                                        if(value === 'throw') {
                                            throw new Error('THROWN_ERROR');
                                        }
                                        return value === match;
                                    },
                                    param: "Hello"
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

                it('should throw an error when the test returns false', function(done) {

                    var obj = new Model({
                        name: 'false'
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
                                message: "CUSTOM_VALIDATION_FAILED",
                                value: "false"
                            }]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when the validation method throws an error', function(done) {

                    var obj = new Model({
                        name: 'throw'
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
                                message: "THROWN_ERROR",
                                value: "throw"
                            }]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

            });

            describe('Array of parameters passed', function() {

                var Model;

                before(function() {

                    /* Define the model */
                    Model = model.extend({
                        definition: {
                            name: {
                                type: "string",
                                validation: [{
                                    rule: function(value, match, datatype) {
                                        if(value === 'throw') {
                                            throw new Error('THROWN_ERROR');
                                        }
                                        return value === match && typeof value === datatype;
                                    },
                                    param: [
                                        "Hello",
                                        "string"
                                    ]
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

                it('should throw an error when the validation function returns false', function(done) {

                    var obj = new Model({
                        name: 'test'
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
                                message: "CUSTOM_VALIDATION_FAILED",
                                value: "test"
                            }]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when the validation method throws an error', function(done) {

                    var obj = new Model({
                        name: 'throw'
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
                                message: "THROWN_ERROR",
                                value: "throw"
                            }]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

            });

        });

        describe('Matching another field', function() {

            var Model;

            before(function() {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        password: {
                            type: "string",
                            validation: [{
                                rule: "minLength",
                                param: 8
                            }]
                        },
                        password2: {
                            type: "string",
                            validation: [{
                                rule: "match",
                                param: "password"
                            }]
                        }
                    }
                });

            });

            it('should validate the model', function(done) {

                var obj = new Model({
                    password: "tnetennba",
                    password2: "tnetennba"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should fail when the password is to short', function(done) {

                var obj = new Model({
                    password: "Moss",
                    password2: "Moss"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        password: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "Moss",
                            params: [
                                8
                            ]
                        }]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

            it("should fail when the password doesn't match", function(done) {

                var obj = new Model({
                    password: "MauriceMoss",
                    password2: "RoyTrenneman"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        password2: [{
                            message: "VALUE_DOES_NOT_MATCH",
                            value: "RoyTrenneman",
                            params: [
                                "MauriceMoss"
                            ]
                        }]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

            it('should fail when both rules fail', function(done) {

                var obj = new Model({
                    password: "Jen",
                    password2: "Roy"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("ModelError");

                    expect(err.getErrors()).to.be.eql({
                        password: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "Jen",
                            params: [
                                8
                            ]
                        }],
                        password2: [{
                            message: "VALUE_DOES_NOT_MATCH",
                            value: "Roy",
                            params: [
                                "Jen"
                            ]
                        }]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("Invalid functions", function() {

            it('should throw an error when function not in validation object', function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        str: {
                            type: "string",
                            validation: [{
                                rule: "minimumLength",
                                param: 8
                            }]
                        }
                    }
                });

                var fail = false;

                var obj;
                try {
                    obj = new Model({
                        str: "some string"
                    });
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('minimumLength is not a validation function');
                }

                expect(obj).to.be.undefined;
                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when non-function given', function(done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        str: {
                            type: "string",
                            validation: [{
                                rule: {},
                                param: 8
                            }]
                        }
                    }
                });

                var fail = false;

                var obj;
                try {
                    obj = new Model({
                        str: "some string"
                    });
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('[object Object] is not a function or string');
                }

                expect(obj).to.be.undefined;
                expect(fail).to.be.true;

                done();

            });

        });

    });

    describe("Setting models as values", function() {

        var Model;
        var Model2;

        before(function() {

            /* Define the models */
            Model2 = model.extend({
                definition: {
                    integer: {
                        type: "integer",
                        value: 0
                    },
                    string: {
                        type: "string"
                    }
                }
            });

            Model = model.extend({
                definition: {
                    string: {
                        type: "string",
                        value: null
                    },
                    model: {
                        type: "object"
                    }
                },
                setModel: function(input, def) {
                    var objInput = new Model2(input);

                    if(objInput.isSet()) {
                        this.set("model", objInput, false);
                    }
                }
            });

        });

        it("should set a new model as a value", function(done) {

            var obj = new Model({
                model: {
                    integer: "2"
                }
            });

            expect(obj.toObject()).to.be.eql({
                string: null,
                model: {
                    integer: 2,
                    string: null
                }
            });

            done();

        });

    });

});