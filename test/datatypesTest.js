/**
 * Data Utils Test
 *
 * Run these tests using Mocha framework. Eg..
 *  mocha datautilsTest.js
 *
 * Mocha runs best when install as a global dependency.
 *
 * @link http://visionmedia.github.io/mocha/
 * @author Simon Emms <simon@simonemms.com>
 */
var expect = require("chai").expect;

var DataUtils = require("../").data;

describe("Executing the datautils", function() {

    it("should correctly handle the setArray", function(done) {

        /* Array */
        expect(DataUtils.setArray([], null)).to.be.eql([]);
        expect(DataUtils.setArray(["str"], null)).to.be.eql(["str"]);
        expect(DataUtils.setArray(["str", true, {}, []], null)).to.be.eql(["str", true, {}, []]);

        /* Non-array */
        expect(DataUtils.setArray(null, "hello")).to.be.equal("hello");
        expect(DataUtils.setArray(undefined, "nothing")).to.be.equal("nothing");
        expect(DataUtils.setArray(true, null)).to.be.equal(null);
        expect(DataUtils.setArray(false, null)).to.be.equal(null);
        expect(DataUtils.setArray({}, null)).to.be.equal(null);
        expect(DataUtils.setArray(new Date(), null)).to.be.equal(null);

        done();

    });

    it("should correctly handle the setBool", function(done) {

        /* Boolean */
        expect(DataUtils.setBool(true, false)).to.be.eql(true);
        expect(DataUtils.setBool(false, true)).to.be.eql(false);

        /* String */
        expect(DataUtils.setBool("1", null)).to.be.eql(true);
        expect(DataUtils.setBool("true", null)).to.be.eql(true);
        expect(DataUtils.setBool("TRUE", null)).to.be.eql(true);
        expect(DataUtils.setBool("t", null)).to.be.eql(true);
        expect(DataUtils.setBool("T", null)).to.be.eql(true);
        expect(DataUtils.setBool("y", null)).to.be.eql(true);
        expect(DataUtils.setBool("Y", null)).to.be.eql(true);
        expect(DataUtils.setBool("yes", null)).to.be.eql(true);
        expect(DataUtils.setBool("YES", null)).to.be.eql(true);
        expect(DataUtils.setBool("0", null)).to.be.eql(false);
        expect(DataUtils.setBool("false", null)).to.be.eql(false);
        expect(DataUtils.setBool("FALSE", null)).to.be.eql(false);
        expect(DataUtils.setBool("f", null)).to.be.eql(false);
        expect(DataUtils.setBool("F", null)).to.be.eql(false);
        expect(DataUtils.setBool("n", null)).to.be.eql(false);
        expect(DataUtils.setBool("N", null)).to.be.eql(false);
        expect(DataUtils.setBool("no", null)).to.be.eql(false);
        expect(DataUtils.setBool("NO", null)).to.be.eql(false);

        /* Number */
        expect(DataUtils.setBool(1, null)).to.be.eql(true);
        expect(DataUtils.setBool(0, null)).to.be.eql(false);

        /* Fails */
        expect(DataUtils.setBool("jawohl", null)).to.be.eql(null);
        expect(DataUtils.setBool("naynaythricenay", null)).to.be.eql(null);
        expect(DataUtils.setBool({}, null)).to.be.eql(null);
        expect(DataUtils.setBool([], null)).to.be.eql(null);
        expect(DataUtils.setBool(null, false)).to.be.eql(false);
        expect(DataUtils.setBool(undefined, null)).to.be.eql(null);

        done();

    });

    it("should correctly handle the setDate", function(done) {

        /* This weird date execution stops it doing the milliseconds */
        var objNow = new Date(String(new Date()));

        /* Date object */
        expect(DataUtils.setDate(objNow, null)).to.be.instanceof(Date).to.be.eql(objNow);

        /* YYYY-MM-DD */
        expect(DataUtils.setDate("2013-02-07", null)).to.be.instanceof(Date).to.be.eql(new Date("2013-02-07"));
        expect(DataUtils.setDate("2013-02-07 14:15:16", null)).to.be.instanceof(Date).to.be.eql(new Date("2013-02-07 14:15:16"));

        /* ISO8601 */
        expect(DataUtils.setDate(String(objNow), null)).to.be.instanceof(Date).to.be.eql(objNow);

        /* Fail */
        expect(DataUtils.setDate("Hecky thump", null)).to.be.eql(null);
        expect(DataUtils.setDate(false, null)).to.be.eql(null);
        expect(DataUtils.setDate(null, true)).to.be.eql(true);
        expect(DataUtils.setDate(undefined, null)).to.be.eql(null);
        expect(DataUtils.setDate([], null)).to.be.eql(null);
        expect(DataUtils.setDate({}, objNow)).to.be.instanceof(Date).to.be.eql(objNow);

        done();

    });

    it("should correctly handle the setFloat", function(done) {

        /* Int */
        expect(DataUtils.setFloat(0, null)).to.be.eql(0);
        expect(DataUtils.setFloat(2, null)).to.be.eql(2);
        expect(DataUtils.setFloat(12345678901234567890, null)).to.be.eql(12345678901234567890);
        expect(DataUtils.setFloat(-27, null)).to.be.eql(-27);
        expect(DataUtils.setFloat(+27, null)).to.be.eql(+27);
        expect(DataUtils.setFloat(-12345678901234567890, null)).to.be.eql(-12345678901234567890);
        expect(DataUtils.setFloat(0.25, null)).to.be.eql(0.25);
        expect(DataUtils.setFloat(2.5, null)).to.be.eql(2.5);
        expect(DataUtils.setFloat(12345678901234567890.56789, null)).to.be.eql(12345678901234567890.56789);
        expect(DataUtils.setFloat(-27.2, null)).to.be.eql(-27.2);
        expect(DataUtils.setFloat(+27.0, null)).to.be.eql(+27.0);
        expect(DataUtils.setFloat(-12345678901234567890.8045, null)).to.be.eql(-12345678901234567890.8045);

        /* String */
        expect(DataUtils.setFloat("0", null)).to.be.eql(0);
        expect(DataUtils.setFloat("2", null)).to.be.eql(2);
        expect(DataUtils.setFloat("12345678901234567890", null)).to.be.eql(12345678901234567890);
        expect(DataUtils.setFloat("-27", null)).to.be.eql(-27);
        expect(DataUtils.setFloat("+27", null)).to.be.eql(+27);
        expect(DataUtils.setFloat("-12345678901234567890", null)).to.be.eql(-12345678901234567890);
        expect(DataUtils.setFloat("0.5", null)).to.be.eql(0.5);
        expect(DataUtils.setFloat("2.25", null)).to.be.eql(2.25);
        expect(DataUtils.setFloat("12345678901234567890.456789", null)).to.be.eql(12345678901234567890.456789);
        expect(DataUtils.setFloat("-27.4", null)).to.be.eql(-27.4);
        expect(DataUtils.setFloat("+27.888", null)).to.be.eql(+27.888);
        expect(DataUtils.setFloat("-12345678901234567890.456789", null)).to.be.eql(-12345678901234567890.456789);

        /* Fail */
        expect(DataUtils.setFloat("Here\"s some - lovely string", null)).to.be.eql(null);
        expect(DataUtils.setFloat({}, null)).to.be.eql(null);
        expect(DataUtils.setFloat([], false)).to.be.eql(false);
        expect(DataUtils.setFloat(undefined, null)).to.be.eql(null);

        done();

    });

    it("should correctly handle the setFunction", function(done) {

        /* Pass a function over */
        expect(DataUtils.setFunction(function() { }, null)).to.be.a("function");

        /* Pass a non-function over */
        expect(DataUtils.setFunction("Here\"s some - lovely string", null)).to.be.eql(null);
        expect(DataUtils.setFunction({}, null)).to.be.eql(null);
        expect(DataUtils.setFunction([], false)).to.be.eql(false);
        expect(DataUtils.setFunction(undefined, null)).to.be.eql(null);

        done();

    });

    it("should correctly handle the setInt", function(done) {

        /* Int */
        expect(DataUtils.setInt(0, null)).to.be.eql(0);
        expect(DataUtils.setInt(2, null)).to.be.eql(2);
        expect(DataUtils.setInt(12345678901234567890, null)).to.be.eql(12345678901234567890);
        expect(DataUtils.setInt(-27, null)).to.be.eql(-27);
        expect(DataUtils.setInt(+27, null)).to.be.eql(+27);
        expect(DataUtils.setInt(-12345678901234567890, null)).to.be.eql(-12345678901234567890);

        /* String */
        expect(DataUtils.setInt("0", null)).to.be.eql(0);
        expect(DataUtils.setInt("2", null)).to.be.eql(2);
        expect(DataUtils.setInt("12345678901234567890", null)).to.be.eql(12345678901234567890);
        expect(DataUtils.setInt("-27", null)).to.be.eql(-27);
        expect(DataUtils.setInt("+27", null)).to.be.eql(+27);
        expect(DataUtils.setInt("-12345678901234567890", null)).to.be.eql(-12345678901234567890);

        /* Fail */
        expect(DataUtils.setInt("Here\"s some - lovely string", null)).to.be.eql(null);
        expect(DataUtils.setInt(2.345654, null)).to.be.eql(null);
        expect(DataUtils.setInt({}, null)).to.be.eql(null);
        expect(DataUtils.setInt([], false)).to.be.eql(false);
        expect(DataUtils.setInt(undefined, null)).to.be.eql(null);

        done();

    });

    it("should correctly handle the setString", function(done) {

        expect(DataUtils.setString("", null)).to.be.eql("");
        expect(DataUtils.setString("Here\"s some - lovely string", null)).to.be.eql("Here\"s some - lovely string");

        expect(DataUtils.setString(2, null)).to.be.eql("2");
        expect(DataUtils.setString(2.345654, null)).to.be.eql("2.345654");

        expect(DataUtils.setString({}, null)).to.be.null;
        expect(DataUtils.setString([], false)).to.be.false;
        expect(DataUtils.setString(undefined, null)).to.be.null;
        expect(DataUtils.setString(NaN, null)).to.be.null;

        done();

    });

    it("should correctly handle the setString with three params", function(done) {

        expect(DataUtils.setString("value1", null, ["value1", "value2"])).to.be.equal("value1");
        expect(DataUtils.setString("value2", null, ["value1", "value2"])).to.be.equal("value2");
        expect(DataUtils.setString("value3", null, ["value1", "value2"])).to.be.null;
        expect(DataUtils.setString("value3", null, [])).to.be.null;

        done();

    });

    it("should correctly handle the setInstanceOf", function(done) {

        expect(DataUtils.setInstanceOf(new Date(), Date, null)).to.be.instanceof(Date);
        expect(DataUtils.setInstanceOf(new String("String"), String, null)).to.be.instanceof(String);

        expect(DataUtils.setInstanceOf({}, undefined, null)).to.be.equal(null);
        expect(DataUtils.setInstanceOf("String", null, 2)).to.be.equal(2);

        done();

    });

    it("should correctly handle the setObject", function(done) {

        expect(DataUtils.setObject({}, null)).to.be.eql({});
        expect(DataUtils.setObject({key: "value"}, null)).to.be.eql({key: "value"});
        expect(DataUtils.setObject(Object.create({k: 2}), null)).to.be.eql({k: 2});
        expect(DataUtils.setObject(new String("some string"), "empty")).to.be.eql(new String("some string"));

        expect(DataUtils.setObject([], null)).to.be.null;
        expect(DataUtils.setObject(null, "empty")).to.be.equal("empty");
        expect(DataUtils.setObject(undefined, null)).to.be.equal(null);

        done();

    });

    describe("#setRegex", function(done) {

        it("should validate an implied RegExp object", function(done) {

            expect(DataUtils.setRegex(/(TEST)\-(\w+)/i, "test-testington", null)).to.be.equal("test-testington");

            done();

        });

        it("should validate a full RegExp object", function(done) {

            var regex = new RegExp('(test)\\-(\\w+)');

            expect(DataUtils.setRegex(regex, "test-testington", null)).to.be.equal("test-testington");

            done();

        });

        it("should validate against a string", function(done) {

            var regex = '(test)\\-(\\w+)';

            expect(DataUtils.setRegex(regex, "test-testington", null)).to.be.equal("test-testington");

            done();

        });

        it("should return default when it fails to match", function(done) {

            expect(DataUtils.setRegex(/(test)\_(\w+)/, "test-testington", null)).to.be.null;

            done();

        });

        it("should throw an error when neither a RegExp or string is passed", function(done) {

            var fail = false;

            try {
                DataUtils.setRegex([/(test)\_(\w+)/], 'test-testington');
            } catch(err) {

                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('SETREGEX_NOT_REGEXP_OR_STRING');

            }

            expect(fail).to.be.true;

            done();

        });

    });

});
