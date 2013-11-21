/**
 * Array Helper Test
 *
 * Run these tests using Mocha framework. Eg..
 *  mocha arrayutilsTest.js
 *
 * Mocha runs best when install as a global dependency.
 *
 * @link http://visionmedia.github.io/mocha/
 * @author Simon Emms <simon@simonemms.com>
 */
var expect = require("chai").expect;

var ArrayUtils = require("../").array;

describe("#arrayutils", function() {

    describe('#inArray', function() {

        it("should return true when finds the key in the array", function(done) {

            expect(ArrayUtils.inArray("foo", ["foo"])).to.be.true;
            expect(ArrayUtils.inArray("foo", ["foo", "bar"])).to.be.true;
            expect(ArrayUtils.inArray("foo", ["bar", "foo"])).to.be.true;
            expect(ArrayUtils.inArray(2, [2, 3])).to.be.true;
            expect(ArrayUtils.inArray(true, [true, false])).to.be.true;
            expect(ArrayUtils.inArray(null, [true, false, null])).to.be.true;

            done();

        });

        it("should return false when it doesn't find the key in the array", function(done) {

            expect(ArrayUtils.inArray("foo", [])).to.be.false;
            expect(ArrayUtils.inArray("foo", ["foo1", "fo", "bar"])).to.be.false;
            expect(ArrayUtils.inArray(2, [1, 3])).to.be.false;
            expect(ArrayUtils.inArray(2, ["1", "2", "3"])).to.be.false;

            done();

        });

        it('should return false when a non-array is passed over', function(done) {

            expect(ArrayUtils.inArray("foo", null)).to.be.false;
            expect(ArrayUtils.inArray("foo", {})).to.be.false;
            expect(ArrayUtils.inArray("foo", new Date())).to.be.false;
            expect(ArrayUtils.inArray("foo")).to.be.false;

            done();

        });

    });

    describe('#objectValues', function() {

        it('should return the values from an object', function(done) {

            expect(ArrayUtils.objectValues({
                key1: "value",
                key2: "value2",
                obj: {i: 2},
                arr: [34,45]
            })).to.be.eql(["value", "value2", {i:2}, [34,45]]);

            expect(ArrayUtils.objectValues({})).to.be.eql([]);

            done();

        });

        it('should throw an error when a non-object is passed in', function(done) {

            var arr = [
                null,
                ['arr', '2'],
                undefined,
                NaN,
                2,
                'string',
                false,
                true
            ];

            arr.forEach(function(input) {

                var fail = false;

                try {
                    ArrayUtils.objectValues(input);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("INPUT_NOT_OBJECT");

                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

});
