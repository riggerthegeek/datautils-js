/**
 * Data
 */

var $datatypes = rootRequire("").data;

var _ = require("lodash");


describe("datatypes test", function () {

    describe('#setArray', function () {

        it('should correctly handle the setArray', function () {

            /* Array */
            expect($datatypes.setArray([], null)).to.be.eql([]);
            expect($datatypes.setArray(['str'], null)).to.be.eql(['str']);
            expect($datatypes.setArray(['str', true, {}, []], null)).to.be.eql(['str', true, {}, []]);

            /* Non-array */
            expect($datatypes.setArray(null, 'hello')).to.be.equal('hello');
            expect($datatypes.setArray(undefined, 'nothing')).to.be.equal('nothing');
            expect($datatypes.setArray(true, null)).to.be.equal(null);
            expect($datatypes.setArray(false, null)).to.be.equal(null);
            expect($datatypes.setArray({}, null)).to.be.equal(null);
            expect($datatypes.setArray(new Date(), null)).to.be.equal(null);

        });

    });

    describe('#setBool', function () {

        it('should correctly handle the setBool', function () {

            /* Boolean */
            expect($datatypes.setBool(true, false)).to.be.eql(true);
            expect($datatypes.setBool(false, true)).to.be.eql(false);

            /* String */
            expect($datatypes.setBool('1', null)).to.be.eql(true);
            expect($datatypes.setBool('true', null)).to.be.eql(true);
            expect($datatypes.setBool('TRUE', null)).to.be.eql(true);
            expect($datatypes.setBool('t', null)).to.be.eql(true);
            expect($datatypes.setBool('T', null)).to.be.eql(true);
            expect($datatypes.setBool('y', null)).to.be.eql(true);
            expect($datatypes.setBool('Y', null)).to.be.eql(true);
            expect($datatypes.setBool('yes', null)).to.be.eql(true);
            expect($datatypes.setBool('YES', null)).to.be.eql(true);
            expect($datatypes.setBool('0', null)).to.be.eql(false);
            expect($datatypes.setBool('false', null)).to.be.eql(false);
            expect($datatypes.setBool('FALSE', null)).to.be.eql(false);
            expect($datatypes.setBool('f', null)).to.be.eql(false);
            expect($datatypes.setBool('F', null)).to.be.eql(false);
            expect($datatypes.setBool('n', null)).to.be.eql(false);
            expect($datatypes.setBool('N', null)).to.be.eql(false);
            expect($datatypes.setBool('no', null)).to.be.eql(false);
            expect($datatypes.setBool('NO', null)).to.be.eql(false);

            /* Number */
            expect($datatypes.setBool(1, null)).to.be.eql(true);
            expect($datatypes.setBool(0, null)).to.be.eql(false);

            /* Fails */
            expect($datatypes.setBool('jawohl', null)).to.be.eql(null);
            expect($datatypes.setBool('naynaythricenay', null)).to.be.eql(null);
            expect($datatypes.setBool({}, null)).to.be.eql(null);
            expect($datatypes.setBool([], null)).to.be.eql(null);
            expect($datatypes.setBool(null, false)).to.be.eql(false);
            expect($datatypes.setBool(undefined, null)).to.be.eql(null);
            expect($datatypes.setBool(2, null)).to.be.null;

        });

    });

    describe('#setDate', function () {

        it('should correctly handle the setDate', function () {

            /* This weird date execution stops it doing the milliseconds */
            var objNow = new Date(String(new Date()));

            /* Date object */
            expect($datatypes.setDate(objNow, null)).to.be.instanceof(Date).to.be.eql(objNow);

            /* YYYY-MM-DD */
            expect($datatypes.setDate('2013-02-07', null)).to.be.instanceof(Date).to.be.eql(new Date(2013, 1, 7));
            expect($datatypes.setDate('2013-02-07 14:15:16', null)).to.be.instanceof(Date).to.be.eql(new Date(2013, 1, 7, 14, 15, 16));

            /* ISO8601 */
            expect($datatypes.setDate(objNow.toISOString(), null)).to.be.instanceof(Date).to.be.eql(objNow);

            /* Fail */
            expect($datatypes.setDate('Hecky thump', null)).to.be.eql(null);
            expect($datatypes.setDate(false, null)).to.be.eql(null);
            expect($datatypes.setDate(null, true)).to.be.eql(true);
            expect($datatypes.setDate(undefined, null)).to.be.eql(null);
            expect($datatypes.setDate([], null)).to.be.eql(null);
            expect($datatypes.setDate({}, objNow)).to.be.instanceof(Date).to.be.eql(objNow);

        });

        it('should correctly handle a BST setDate', function () {

            var date = $datatypes.setDate('1987-07-03', null);

            expect(date).to.be.instanceof(Date);

            expect(date.getTime()).to.be.equal(552268800000);

        });

    });

    describe('#setEnum', function () {

        it('should allow valid entries', function () {

            expect($datatypes.setEnum('hello', ['hello', 'goodbye'], null)).to.be.equal('hello');
            expect($datatypes.setEnum('goodbye', ['hello', 'goodbye'], null)).to.be.equal('goodbye');
            expect($datatypes.setEnum(2, [2, 3], null)).to.be.equal(2);

        });

        it('should ignore invalid entries', function () {

            expect($datatypes.setEnum(2, ['2', 3], null)).to.be.null;
            expect($datatypes.setEnum('foo', ['2', 3], null)).to.be.null;
            expect($datatypes.setEnum('foo', 'foo', null)).to.be.null;

        });

    });

    describe('#setFloat', function () {

        it('should correctly handle the setFloat', function () {

            /* Int */
            expect($datatypes.setFloat(0, null)).to.be.eql(0);
            expect($datatypes.setFloat(2, null)).to.be.eql(2);
            expect($datatypes.setFloat(12345678901234567890, null)).to.be.eql(12345678901234567890);
            expect($datatypes.setFloat(-27, null)).to.be.eql(-27);
            expect($datatypes.setFloat(+27, null)).to.be.eql(+27);
            expect($datatypes.setFloat(-12345678901234567890, null)).to.be.eql(-12345678901234567890);
            expect($datatypes.setFloat(0.25, null)).to.be.eql(0.25);
            expect($datatypes.setFloat(2.5, null)).to.be.eql(2.5);
            expect($datatypes.setFloat(12345678901234567890.56789, null)).to.be.eql(12345678901234567890.56789);
            expect($datatypes.setFloat(-27.2, null)).to.be.eql(-27.2);
            expect($datatypes.setFloat(+27.0, null)).to.be.eql(+27.0);
            expect($datatypes.setFloat(-12345678901234567890.8045, null)).to.be.eql(-12345678901234567890.8045);

            /* String */
            expect($datatypes.setFloat('0', null)).to.be.eql(0);
            expect($datatypes.setFloat('2', null)).to.be.eql(2);
            expect($datatypes.setFloat('12345678901234567890', null)).to.be.eql(12345678901234567890);
            expect($datatypes.setFloat('-27', null)).to.be.eql(-27);
            expect($datatypes.setFloat('+27', null)).to.be.eql(+27);
            expect($datatypes.setFloat('-12345678901234567890', null)).to.be.eql(-12345678901234567890);
            expect($datatypes.setFloat('0.5', null)).to.be.eql(0.5);
            expect($datatypes.setFloat('2.25', null)).to.be.eql(2.25);
            expect($datatypes.setFloat('12345678901234567890.456789', null)).to.be.eql(12345678901234567890.456789);
            expect($datatypes.setFloat('-27.4', null)).to.be.eql(-27.4);
            expect($datatypes.setFloat('+27.888', null)).to.be.eql(+27.888);
            expect($datatypes.setFloat('-12345678901234567890.456789', null)).to.be.eql(-12345678901234567890.456789);

            /* Fail */
            expect($datatypes.setFloat('Here\'s some - lovely string', null)).to.be.eql(null);
            expect($datatypes.setFloat({}, null)).to.be.eql(null);
            expect($datatypes.setFloat([], false)).to.be.eql(false);
            expect($datatypes.setFloat(undefined, null)).to.be.eql(null);

        });

    });

    describe('#setFunction', function () {

        it('should correctly handle the setFunction', function () {

            /* Pass a function over */
            expect($datatypes.setFunction(function () {
            }, null)).to.be.a('function');
            expect($datatypes.setFunction(new Function(), null)).to.be.a('function');

            /* Pass a non-function over */
            expect($datatypes.setFunction('Here\'s some - lovely string', null)).to.be.eql(null);
            expect($datatypes.setFunction({}, null)).to.be.eql(null);
            expect($datatypes.setFunction([], false)).to.be.eql(false);
            expect($datatypes.setFunction(undefined, null)).to.be.eql(null);

        });

    });

    describe('#setInt', function () {

        it('should correctly handle the setInt', function () {

            /* Int */
            expect($datatypes.setInt(0, null)).to.be.eql(0);
            expect($datatypes.setInt(2, null)).to.be.eql(2);
            expect($datatypes.setInt(12345678901234567890, null)).to.be.eql(12345678901234567890);
            expect($datatypes.setInt(-27, null)).to.be.eql(-27);
            expect($datatypes.setInt(+27, null)).to.be.eql(+27);
            expect($datatypes.setInt(-12345678901234567890, null)).to.be.eql(-12345678901234567890);

            /* String */
            expect($datatypes.setInt('0', null)).to.be.eql(0);
            expect($datatypes.setInt('2', null)).to.be.eql(2);
            expect($datatypes.setInt('12345678901234567890', null)).to.be.eql(12345678901234567890);
            expect($datatypes.setInt('-27', null)).to.be.eql(-27);
            expect($datatypes.setInt('+27', null)).to.be.eql(+27);
            expect($datatypes.setInt('-12345678901234567890', null)).to.be.eql(-12345678901234567890);

            /* Fail */
            expect($datatypes.setInt('Here\'s some - lovely string', null)).to.be.eql(null);
            expect($datatypes.setInt(2.345654, null)).to.be.eql(null);
            expect($datatypes.setInt({}, null)).to.be.eql(null);
            expect($datatypes.setInt([], false)).to.be.eql(false);
            expect($datatypes.setInt(undefined, null)).to.be.eql(null);

        });

    });

    describe('#setInstanceOf', function () {

        it('should correctly handle the setInstanceOf', function () {

            expect($datatypes.setInstanceOf(new Date(), Date, null)).to.be.instanceof(Date);
            expect($datatypes.setInstanceOf(new String('String'), String, null)).to.be.instanceof(String);

            expect($datatypes.setInstanceOf({}, undefined, null)).to.be.equal(null);
            expect($datatypes.setInstanceOf('String', null, 2)).to.be.equal(2);

        });

    });

    describe('#setObject', function () {

        it('should correctly handle the setObject', function () {

            expect($datatypes.setObject({}, null)).to.be.eql({});
            expect($datatypes.setObject({key: 'value'}, null)).to.be.eql({key: 'value'});
            expect($datatypes.setObject(Object.create({k: 2}), null)).to.be.eql({k: 2});

            var strObj = $datatypes.setObject(new String('some string'), 'empty');

            expect(strObj).to.not.be.equal('empty');
            expect(strObj instanceof String).to.be.true;
            expect(strObj).to.have.length(11);
            expect(_.values(strObj)).to.be.eql([
                's', 'o', 'm', 'e', ' ', 's', 't', 'r', 'i', 'n', 'g'
            ]);

            expect($datatypes.setObject([], null)).to.be.null;
            expect($datatypes.setObject(null, 'empty')).to.be.equal('empty');
            expect($datatypes.setObject(undefined, null)).to.be.equal(null);
            expect($datatypes.setObject(function () { }, null)).to.be.equal(null);

        });

    });

    describe("#setRegex", function () {

        it("should validate an implied RegExp object", function () {

            expect($datatypes.setRegex(/(TEST)\-(\w+)/i, "test-testington", null)).to.be.equal("test-testington");

        });

        it("should validate a full RegExp object", function () {

            var regex = new RegExp('(test)\\-(\\w+)');

            expect($datatypes.setRegex(regex, "test-testington", null)).to.be.equal("test-testington");

        });

        it("should validate against a string", function () {

            var regex = '(test)\\-(\\w+)';

            expect($datatypes.setRegex(regex, "test-testington", null)).to.be.equal("test-testington");

        });

        it("should return default when it fails to match", function () {

            expect($datatypes.setRegex(/(test)\_(\w+)/, "test-testington", null)).to.be.null;

        });

        it("should throw an error when neither a RegExp or string is passed", function () {

            var fail = false;

            try {
                $datatypes.setRegex([/(test)\_(\w+)/], "test-testington");
            } catch (err) {

                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal("SETREGEX_NOT_REGEXP_OR_STRING");

            }

            expect(fail).to.be.true;

        });

        it("should do nothing when non-string passed in", function () {

            expect($datatypes.setRegex(/hello/, false, null)).to.be.null;

        });

    });

    describe('#setString', function () {

        it('should correctly handle the setString', function () {

            expect($datatypes.setString('', null)).to.be.eql('');
            expect($datatypes.setString('Here\'s some - lovely string', null)).to.be.eql('Here\'s some - lovely string');

            expect($datatypes.setString(2, null)).to.be.eql('2');
            expect($datatypes.setString(2.345654, null)).to.be.eql('2.345654');

            expect($datatypes.setString({}, null)).to.be.null;
            expect($datatypes.setString([], false)).to.be.false;
            expect($datatypes.setString(undefined, null)).to.be.null;
            expect($datatypes.setString(NaN, null)).to.be.null;

        });

        it('should correctly handle the setString with three params', function () {

            expect($datatypes.setString('value1', null, ['value1', 'value2'])).to.be.equal('value1');
            expect($datatypes.setString('value2', null, ['value1', 'value2'])).to.be.equal('value2');
            expect($datatypes.setString('value3', null, ['value1', 'value2'])).to.be.null;
            expect($datatypes.setString('value3', null, [])).to.be.null;

        });

    });

});
