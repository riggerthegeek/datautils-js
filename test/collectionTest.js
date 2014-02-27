var expect = require("chai").expect;

var model = require("../").model;
var collection = require("../").collection;

var _ = require("underscore");


/* Define the model */
var Model = model.extend({
    definition: {
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
        string: {
            type: "string"
        }
    }
});


describe("Collection tests", function() {

    var Collection;
    beforeEach(function() {
        Collection = collection.extend({
            model: Model
        });
    });

    describe("Add models", function() {

        it("should create a collection of models from an object", function(done) {

            var obj = new Collection({
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            });

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([{
                boolean: true,
                date: new Date("2010-02-07"),
                float: 2.3,
                integer: 2,
                string: "string"
            }]);

            done();

        });

        it("should create a collection of models from an array of one", function(done) {

            var obj = new Collection([{
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            }]);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([{
                boolean: true,
                date: new Date("2010-02-07"),
                float: 2.3,
                integer: 2,
                string: "string"
            }]);

            done();

        });

        it("should create a collection of models from an array of two", function(done) {

            var obj = new Collection([{
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            }, {
                boolean: "true",
                date: "2010-02-08",
                float: "2.3",
                integer: "2",
                string: "string"
            }]);

            expect(obj.getCount()).to.be.equal(2);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([{
                boolean: true,
                date: new Date("2010-02-07"),
                float: 2.3,
                integer: 2,
                string: "string"
            }, {
                boolean: true,
                date: new Date("2010-02-08"),
                float: 2.3,
                integer: 2,
                string: "string"
            }]);

            done();

        });

        it("should create no models if empty array is given", function(done) {

            var obj = new Collection([]);

            expect(obj.getCount()).to.be.equal(0);
            expect(obj.toJSON()).to.be.eql([]);

            done();

        });

        it("should create no models if empty object", function(done) {

            var obj = new Collection([{}]);

            expect(obj.getCount()).to.be.equal(0);
            expect(obj.toJSON()).to.be.eql([]);

            done();

        });

        it("should create models if at least one element set", function(done) {

            var obj = new Collection([{
                date: "2013-02-02"
            }]);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.toJSON()).to.be.eql([{
                boolean: false,
                date: new Date("2013-02-02"),
                float: null,
                integer: null,
                string: null
            }]);

            done();

        });

        it("should create models from an object in the add method", function(done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            obj.add({
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            });

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([{
                boolean: true,
                date: new Date("2010-02-07"),
                float: 2.3,
                integer: 2,
                string: "string"
            }]);

            done();

        });

        it("should create models from an array of one in the add method", function(done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            obj.add([{
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            }]);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([{
                boolean: true,
                date: new Date("2010-02-07"),
                float: 2.3,
                integer: 2,
                string: "string"
            }]);

            done();

        });

        it("should create models from an array of object in the add method", function(done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            obj.add([{
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            }, {
                boolean: "true",
                date: "2010-02-08",
                float: "2.3",
                integer: "2",
                string: "string"
            }]);

            expect(obj.getCount()).to.be.equal(2);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([{
                boolean: true,
                date: new Date("2010-02-07"),
                float: 2.3,
                integer: 2,
                string: "string"
            }, {
                boolean: true,
                date: new Date("2010-02-08"),
                float: 2.3,
                integer: 2,
                string: "string"
            }]);

            done();

        });

    });

    describe("Collection management", function() {

        describe("keys", function() {

            it("should ensure that all keys are unique", function(done) {

                var obj = new Collection([{
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }, {
                    boolean: "true",
                    date: "2010-02-08",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }, {
                    boolean: "true",
                    date: "2010-02-09",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }]);

                expect(obj.getKeys()).to.have.length(3);
                expect(_.uniq(obj.getKeys())).to.have.length(3);

                done();

            });

        });

    });

    describe("Removing models", function() {

        var obj;

        beforeEach(function() {
            obj = new Collection([{
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            }, {
                boolean: "true",
                date: "2010-02-08",
                float: "2.3",
                integer: "2",
                string: "string"
            }, {
                boolean: "true",
                date: "2010-02-09",
                float: "2.3",
                integer: "2",
                string: "string"
            }]);

            expect(obj.getCount()).to.be.equal(3);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([{
                boolean: true,
                date: new Date("2010-02-07"),
                float: 2.3,
                integer: 2,
                string: "string"
            }, {
                boolean: true,
                date: new Date("2010-02-08"),
                float: 2.3,
                integer: 2,
                string: "string"
            }, {
                boolean: true,
                date: new Date("2010-02-09"),
                float: 2.3,
                integer: 2,
                string: "string"
            }]);
        });

        describe("by array", function() {

            describe("model only", function() {

                it("should remove first element only", function(done) {

                    var model = [
                        obj.get(0)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove middle element only", function(done) {

                    var model = [
                        obj.get(1)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove last element only", function(done) {

                    var model = [
                        obj.get(2)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove first and last elements", function(done) {

                    var model = [
                        obj.get(0),
                        obj.get(2)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove first and middle elements", function(done) {

                    var model = [
                        obj.get(0),
                        obj.get(1)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove second and last elements", function(done) {

                    var model = [
                        obj.get(1),
                        obj.get(2)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should not remove non-existent elements", function(done) {

                    var obj2 = new Collection([{
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }, {
                        boolean: "true",
                        date: "2010-02-08",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }]);

                    var model = [
                        obj2.get(0),
                        obj2.get(1)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        false,
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(3);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);
                    expect(obj.get(2)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should not remove non-existent elements but remove existing ones", function(done) {

                    var obj2 = new Collection({
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    });

                    var model = [
                        obj.get(0),
                        obj2.get(0)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

            });

            describe("uuid only", function() {

                it("should remove first element only", function(done) {

                    expect(obj.remove([obj.get(0, true)])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove middle element only", function(done) {

                    expect(obj.remove([obj.get(1, true)])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove last element only", function(done) {

                    expect(obj.remove([obj.get(2, true)])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove first and last elements", function(done) {

                    expect(obj.remove([obj.get(0, true), obj.get(2, true)])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove first and middle elements", function(done) {

                    expect(obj.remove([obj.get(0, true), obj.get(1, true)])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove second and last elements", function(done) {

                    expect(obj.remove([obj.get(2, true), obj.get(1, true)])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should not remove non-existent elements", function(done) {

                    var obj2 = new Collection([{
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }, {
                        boolean: "true",
                        date: "2010-02-08",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }]);

                    expect(obj.remove([obj2.get(0, true), obj2.get(1, true)])).to.be.eql([
                        false,
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(3);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);
                    expect(obj.get(2)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should not remove non-existent elements but remove existing ones", function(done) {

                    var obj2 = new Collection([{
                        boolean: "true",
                        date: "2010-02-08",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }]);

                    expect(obj.remove([obj2.get(0, true), obj.get(1, true)])).to.be.eql([
                        false,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

            });

            describe("id only", function() {

                it("should remove first element only", function(done) {

                    expect(obj.remove([0])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove middle element only", function(done) {

                    expect(obj.remove(["1"])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove last element only", function(done) {

                    expect(obj.remove([2])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove first and last elements", function(done) {

                    expect(obj.remove([2, 0])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove first and middle elements", function(done) {

                    expect(obj.remove([0, 1])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should remove second and last elements", function(done) {

                    expect(obj.remove([1, 2])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should not remove non-existent elements", function(done) {

                    expect(obj.remove([3])).to.be.eql([
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(3);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);
                    expect(obj.get(2)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

                it("should not remove non-existent elements but remove existing ones", function(done) {

                    expect(obj.remove([3, 2])).to.be.eql([
                        false,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([{
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }, {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }]);

                    done();

                });

            });

            describe("mixed", function() {

                it("should remove a UUID, integer and model in an array", function(done) {

                    var arr = [
                        0,
                        obj.get(1, true),
                        obj.get(2)
                    ];

                    expect(obj.remove(arr)).to.be.eql([
                        true,
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(0);

                    expect(obj.toJSON()).to.be.eql([]);

                    done();

                });

            });

        });

        describe("by id", function() {

            it("should remove the first model by id", function(done) {

                expect(obj.remove(0)).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should remove a later model by id", function(done) {

                expect(obj.remove(1)).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should remove the last model by id", function(done) {

                expect(obj.remove(2)).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should not remove a non-existent by id", function(done) {

                expect(obj.remove(4)).to.be.false;

                expect(obj.getCount()).to.be.equal(3);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);
                expect(obj.get(2)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

        });

        describe("by UUID", function() {

            it("should remove the first model by UUID", function(done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[0])).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should remove the middle model by UUID", function(done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[1])).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should remove an the last model by UUID", function(done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[2])).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should not remove a non-existent by model", function(done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[4])).to.be.false;

                expect(obj.getCount()).to.be.equal(3);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);
                expect(obj.get(2)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

        });

        describe("by model", function() {

            it("should remove the first model by model", function(done) {

                expect(obj.remove(obj.get(0))).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should remove an intermediate by model", function(done) {

                expect(obj.remove(obj.get(1))).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should remove an the last model by model", function(done) {

                expect(obj.remove(obj.get(2))).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

            it("should not remove a non-existent by model", function(done) {

                var obj2 = new Collection({
                    boolean: "true",
                    date: "2010-02-09",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                expect(obj.remove(obj2.get(0))).to.be.false;

                expect(obj.getCount()).to.be.equal(3);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);
                expect(obj.get(2)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([{
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }, {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }]);

                done();

            });

        });

    });

});