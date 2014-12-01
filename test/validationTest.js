/**
 * Validation Test
 *
 * Run these tests using Mocha framework. Eg..
 *  mocha validationTest.js
 *
 * Mocha runs best when install as a global dependency.
 *
 * @link http://visionmedia.github.io/mocha/
 * @author Simon Emms <simon@simonemms.com>
 */

var expect = require("chai").expect;

var validation = require("../").validation;

describe("Validation tests", function() {

    describe("#email", function() {

        it('should allow a standard email', function(done) {

            expect(validation.email('test@test.com')).to.be.true;
            expect(validation.email('test.test@test45.co')).to.be.true;
            expect(validation.email('test.test4786@test.com.au')).to.be.true;

            done();

        });

        it('should allow an email with special characters', function(done) {

            expect(validation.email('test.test+test@test.com')).to.be.true;
            expect(validation.email('test_@test.co.uk')).to.be.true;
            expect(validation.email('test-TEST@test.co')).to.be.true;

            done();

        });

        it('should throw an error for invalid email strings', function(done) {

            var arr = [
                'Abc.example.com',
                'Abc.@example.com',
                'Abc..123@example.com',
                'A@b@c@example.com',
                'a"b(c)d,e:f;g<h>i[j\k]l@example.com',
                'just"not"right@example.com',
                'this is"not\allowed@example.com',
                'this\ still\"not\\allowed@example.com'
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(email) {

                var fail = false;

                try {
                    validation.email(email);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_NOT_EMAIL');
                    expect(err.value).to.be.equal(email);
                    expect(err).to.not.have.property('param1');
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw an error for invalid datatypes', function(done) {

            var arr = [
                null,
                true,
                false,
                2,
                {},
                [],
                undefined,
                new String('test@test.com')
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(email) {

                var fail = false;

                try {
                    validation.email(email);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_NOT_EMAIL_NOT_STRING');
                    expect(err.value).to.be.equal(email);
                    expect(err).to.not.have.property('param1');
                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe("#required", function() {

        it('should be return true when values are given', function(done) {

            expect(validation.required('some value')).to.be.true;
            expect(validation.required('0')).to.be.true;
            expect(validation.required('false')).to.be.true;
            expect(validation.required(0)).to.be.true;
            expect(validation.required(false)).to.be.true;
            expect(validation.required(["val"])).to.be.true;

            done();

        });

        it('should throw an error when empty', function(done) {

            var arr = [
                null,
                '',
                undefined,
                []
            ];

            expect(arr).to.have.length(4);

            arr.forEach(function(value) {

                var fail = false;

                try {
                    validation.required(value);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_REQUIRED');
                    expect(err.value).to.be.equal(value);
                    expect(err).to.not.have.property('param1');
                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe("#minLength", function() {

        it('should return true when min length met or exceeded', function(done) {

            expect(validation.minLength('turkey', 2)).to.be.true;
            expect(validation.minLength('string', 6)).to.be.true;
            expect(validation.minLength('', 0)).to.be.true;
            expect(validation.minLength('nSP"%yB9f{$a-.<b<tgXQ3', 21)).to.be.true;
            expect(validation.minLength('nSP"%yB9f{$a-.<b<tgXQ3', 21)).to.be.true;
            expect(validation.minLength([2,3], 2)).to.be.true;
            expect(validation.minLength({g:2,r:3}, 2)).to.be.true;

            done();

        });

        it('should throw error when under min length', function(done) {

            var obj = {
                'string': 10,
                '': 1,
                's': 2,
                'nSP"%yB9f{$a-.<b<tgXQ3': "27"
            };

            for(var value in obj) {

                var length = obj[value];

                var fail = false;

                try {
                    validation.minLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_LESS_THAN_MIN_LENGTH');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        Number(length)
                    ]);
                }

                expect(fail).to.be.true;

            }

            done();

        });

        it("should throw error when array under length", function () {

            var value = [2,3,4];

            var fail = false;

            try {
                validation.minLength(value, 4);
            } catch(err) {
                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('VALUE_LESS_THAN_MIN_LENGTH');
                expect(err.value).to.be.equal(value);
                expect(err.params).to.be.eql([
                    Number(4)
                ]);
            }

            expect(fail).to.be.true;

        });

        it("should throw error when object under length", function () {

            var value = {d:2,f:3};

            var fail = false;

            try {
                validation.minLength(value, 4);
            } catch(err) {
                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('VALUE_LESS_THAN_MIN_LENGTH');
                expect(err.value).to.be.equal(value);
                expect(err.params).to.be.eql([
                    Number(4)
                ]);
            }

            expect(fail).to.be.true;

        });

        it('should throw error if length less than 0', function(done) {

            var arr = [
                -1,
                -10,
                -100,
                -1000
            ];

            expect(arr).to.have.length(4);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.minLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('MIN_LENGTH_LESS_THAN_ZERO');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non integer passed over as length', function(done) {

            var arr = [
                null,
                true,
                false,
                {},
                [],
                undefined,
                new String('test@test.com'),
                NaN
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.minLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('MIN_LENGTH_NOT_INTEGER');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non string passed over as value', function(done) {

            var arr = [
                null,
                true,
                false,
                2,
                undefined
            ];

            expect(arr).to.have.length(5);

            arr.forEach(function(value) {

                var length = 0;

                var fail = false;

                try {
                    validation.minLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_MIN_LENGTH_NOT_STRING');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe("#maxLength", function() {

        it('should return true when less than or equal to max length', function(done) {

            expect(validation.maxLength('turkey', 10)).to.be.true;
            expect(validation.maxLength('string', 6)).to.be.true;
            expect(validation.maxLength('', 0)).to.be.true;
            expect(validation.maxLength('nSP"%yB9f{$a-.<b<tgXQ3', 27)).to.be.true;

            done();

        });

        it('should throw error when over max length', function(done) {

            var obj = {
                'string': 5,
                '1': 0,
                'fdf': 2,
                'nSP"%yB9f{$a-.<b<tgXQ3': "20"
            };

            for(var value in obj) {

                var length = obj[value];

                var fail = false;

                try {
                    validation.maxLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_GREATER_THAN_MAX_LENGTH');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        Number(length)
                    ]);
                }

                expect(fail).to.be.true;

            }

            done();

        });

        it('should throw error if length less than 0', function(done) {

            var arr = [
                -1,
                -10,
                -100,
                -1000
            ];

            expect(arr).to.have.length(4);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.maxLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('MAX_LENGTH_LESS_THAN_ZERO');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non integer passed over as length', function(done) {

            var arr = [
                null,
                true,
                false,
                {},
                [],
                undefined,
                new String('test@test.com'),
                NaN
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.maxLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('MAX_LENGTH_NOT_INTEGER');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non string passed over as value', function(done) {

            var arr = [
                null,
                true,
                false,
                2,
                undefined
            ];

            //expect(arr).to.have.length(8);

            arr.forEach(function(value) {

                var length = 0;

                var fail = false;

                try {
                    validation.maxLength(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_MAX_LENGTH_NOT_STRING');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe("#length", function() {

        it('should return true when value is given length', function(done) {

            expect(validation.length('turkey', 6)).to.be.true;
            expect(validation.length('', 0)).to.be.true;
            expect(validation.length('0', 1)).to.be.true;
            expect(validation.length('nSP"%yB9f{$a-.<b<tgXQ3', 22)).to.be.true;

            done();

        });

        it('should throw error when not equal to length', function(done) {

            var obj = {
                'string': 5,
                '1': 0,
                'fdf': 2,
                'nSP"%yB9f{$a-.<b<tgXQ3': "20",
                'strings': 10,
                '': 1,
                's': 2,
                'nSP"%yB9f{$a-.<b<tgXQ3s': "27"
            };

            for(var value in obj) {

                var length = obj[value];

                var fail = false;

                try {
                    validation.length(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_DOES_NOT_MATCH_LENGTH');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        Number(length)
                    ]);
                }

                expect(fail).to.be.true;

            }

            done();

        });

        it('should throw error if length less than 0', function(done) {

            var arr = [
                -1,
                -10,
                -100,
                -1000
            ];

            expect(arr).to.have.length(4);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.length(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('LENGTH_LESS_THAN_ZERO');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non integer passed over as length', function(done) {

            var arr = [
                null,
                true,
                false,
                {},
                [],
                undefined,
                new String('test@test.com'),
                NaN
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.length(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('LENGTH_NOT_INTEGER');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non string passed over as value', function(done) {

            var arr = [
                null,
                true,
                false,
                2,
                undefined
            ];

            expect(arr).to.have.length(5);

            arr.forEach(function(value) {

                var length = 0;

                var fail = false;

                try {
                    validation.length(value, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_LENGTH_NOT_STRING');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe("#lengthBetween", function() {

        it('should return true when value is between given lengths', function(done) {

            expect(validation.lengthBetween('turkey', 1, 10)).to.be.true;
            expect(validation.lengthBetween('', 0, 1)).to.be.true;
            expect(validation.lengthBetween('0', 0, 2)).to.be.true;
            expect(validation.lengthBetween('nSP"%yB9f{$a-.<b<tgXQ3', 22, 22)).to.be.true;

            done();

        });

        it('should throw error when not between lengths', function(done) {

            var array = [{
                value: 'string',
                minLength: 1,
                maxLength: 4
            }, {
                value: '1',
                minLength: 2,
                maxLength: 2
            }, {
                value: 'fdf',
                minLength: 4,
                maxLength: 5
            }, {
                value: 'nSP"%yB9f{$a-.<b<tgXQ3',
                minLength: 29,
                maxLength: 30
            }, {
                value: 'strings',
                minLength: 1,
                maxLength: 3
            }, {
                value: '',
                minLength: 1,
                maxLength: 2
            }, {
                value: 'nSP"%yB9f{$a-.<b<tgXQ3s',
                minLength: 30,
                maxLength: 40
            }];

            expect(array).to.have.length(7);

            array.forEach(function(arr) {

                var value = arr.value;
                var minLength = arr.minLength;
                var maxLength = arr.maxLength;

                var fail = false;

                try {
                    validation.lengthBetween(value, minLength, maxLength);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_NOT_BETWEEN_MINLENGTH_AND_MAXLENGTH');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        Number(minLength),
                        Number(maxLength)
                    ]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error when minLength less than 0', function(done) {

            var arr = [
                -1,
                -10,
                -100,
                -1000
            ];

            expect(arr).to.have.length(4);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.lengthBetween(value, length, 10);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('LENGTH_BETWEEN_MINLENGTH_LESS_THAN_ZERO');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        length,
                        10
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error when maxLength less than minLength', function(done) {

            var arr = [
                -1,
                -10,
                -100,
                -1000,
                0,
                1,
                5,
                9
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.lengthBetween(value, 10, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('LENGTH_BETWEEN_MAXLENGTH_LESS_THAN_MINLENGTH');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        10,
                        length
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non integer passed over as minLength', function(done) {

            var arr = [
                null,
                true,
                false,
                {},
                [],
                undefined,
                new String('test@test.com'),
                NaN
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.lengthBetween(value, length, 10);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('LENGTH_BETWEEN_MINLENGTH_NOT_INTEGER');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        null,
                        10
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non integer passed over as maxLength', function(done) {

            var arr = [
                null,
                true,
                false,
                {},
                [],
                undefined,
                new String('test@test.com'),
                NaN
            ];

            expect(arr).to.have.length(8);

            arr.forEach(function(length) {

                var value = 'string';

                var fail = false;

                try {
                    validation.lengthBetween(value, 10, length);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('LENGTH_BETWEEN_MAXLENGTH_NOT_INTEGER');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        10,
                        null
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw error if non string passed over as value', function(done) {

            var arr = [
                null,
                true,
                false,
                2,
                undefined
            ];

            expect(arr).to.have.length(5);

            arr.forEach(function(value) {

                var minLength = 0;
                var maxLength = 20;

                var fail = false;

                try {
                    validation.lengthBetween(value, minLength, maxLength);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_LENGTH_BETWEEN_NOT_STRING');
                    expect(err.value).to.be.equal(value);
                    expect(err.params).to.be.eql([
                        minLength,
                        maxLength
                    ]);
                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe("#regex", function() {

        it('should validate an implied RegExp object', function(done) {

            expect(validation.regex('test-testington', /(TEST)\-(\w+)/i)).to.be.true;

            done();

        });

        it('should validate a full RegExp object', function(done) {

            var regex = new RegExp('(test)\\-(\\w+)');

            expect(validation.regex('test-testington', regex)).to.be.true;

            done();

        });

        it('should validate against a string', function(done) {

            var regex = '(test)\\-(\\w+)';

            expect(validation.regex('test-testington', regex)).to.be.true;

            done();

        });

        it('should throw an error when it fails to match', function(done) {

            var fail = false;

            try {
                validation.regex('test-testington', /(test)\_(\w+)/);
            } catch(err) {

                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('VALUE_REGEX_FAILED_TO_MATCH');
                expect(err.value).to.be.equal('test-testington');
                expect(err.params).to.be.eql([
                    '/(test)\\_(\\w+)/'
                ]);

            }

            expect(fail).to.be.true;

            done();

        });

        it('should throw an error when neither a RegExp or string is passed', function(done) {

            var fail = false;

            try {
                validation.regex('test-testington', [/(test)\_(\w+)/]);
            } catch(err) {

                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('VALUE_REGEX_NOT_REGEXP_OR_STRING');
                expect(err.value).to.be.equal('test-testington');
                expect(String(err.params)).to.be.eql('/(test)\\_(\\w+)/');

            }

            expect(fail).to.be.true;

            done();

        });

    });

    describe('#equal', function() {

        var TestObject = function(options) {
            this.string = options.string || null;
            this.number = options.number || null;
            this.blank = options.blank || null;

            return this;
        };

        it('should validate scalar values', function(done) {

            expect(validation.equal('striNg', 'striNg')).to.be.true;
            expect(validation.equal('This is a much longer string - !"£$%^&*()_+`¬', 'This is a much longer string - !"£$%^&*()_+`¬')).to.be.true;
            expect(validation.equal(222, 222)).to.be.true;
            expect(validation.equal(12.34, 12.34)).to.be.true;
            expect(validation.equal(false, false)).to.be.true;
            expect(validation.equal(true, true)).to.be.true;
            expect(validation.equal(undefined, undefined)).to.be.true;

            done();

        });

        it('should validate non-scalar values', function(done) {

            expect(validation.equal(new Date(), new Date())).to.be.true;
            expect(validation.equal(NaN, NaN)).to.be.true;
            expect(validation.equal({hello: "mate"}, {"hello": "mate"})).to.be.true;
            expect(validation.equal([1,2,3,"456", "kevin"], [1,2,3,"456", "kevin"])).to.be.true;
            expect(validation.equal(new TestObject({string: "string", number: 84}), new TestObject({string: "string", number: 84}))).to.be.true;

            done();

        });

        it('should throw errors on non-matching scalar values', function(done) {

            var array = [{
                value: "striNg",
                match: "string"
            }, {
                value: "This is a much longer string - !\"£$%^&*()_+`¬",
                match: "This is a very different string - !$%&^$(%*£)("
            }, {
                value: 222,
                match: 221
            }, {
                value: 12.34,
                match: "12.35"
            }, {
                value: true,
                match: false
            }, {
                value: false,
                match: true
            }, {
                value: 222,
                match: "222"
            }, {
                value: "12.34",
                match: 12.34
            }, {
                value: undefined,
                match: null
            }];

            expect(array).to.have.length(9);

            array.forEach(function(obj) {

                var fail = false;

                try {
                    validation.equal(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUES_NOT_EQUAL");
                    expect(err.value).to.be.equal(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw errors on non-matching non-scalar values', function(done) {

            var array = [{
                value: new Date(),
                match: new Date('2013-02-07')
            }, {
                value: NaN,
                match: 2
            }, {
                value: {hello: "mate"},
                match: {hello: "matey"}
            }, {
                value: [1,2,"3","456", "kevin"],
                match: [1,2,3,"456", "kevin"]
            }, {
                value: new TestObject({string: "string", number: 84}),
                match: new TestObject({string: "string", number: 83})
            }];

            expect(array).to.have.length(5);

            array.forEach(function(obj) {

                var fail = false;

                try {
                    validation.equal(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUES_NOT_EQUAL");
                    expect(err.value).to.be.eql(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe('#greaterThan', function() {

        it('should validate a number or numerical string', function(done) {

            expect(validation.greaterThan(1235, 1234)).to.be.true;
            expect(validation.greaterThan("12.35", "12.34")).to.be.true;
            expect(validation.greaterThan("+12340", 1234)).to.be.true;
            expect(validation.greaterThan(-524.2455, "-524.2456")).to.be.true;
            expect(validation.greaterThan(Number(30000000), Number(-30000000))).to.be.true;

            done();

        });

        it('should throw error when number or numerical string not-matched', function(done) {

            var arr = [{
                value: 12,
                match: 12
            }, {
                value: "12",
                match: "13"
            }, {
                value: 1.234,
                match: 1.235
            }, {
                value: -524.2456,
                match: -524.2455
            }];

            expect(arr).to.have.length(4);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.greaterThan(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_NOT_GREATER_THAN_TARGET");
                    expect(err.value).to.be.equal(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw type error when different data type given', function(done) {

            var arr = [{
                value: 12,
                match: "kevin"
            }, {
                value: "smith",
                match: new Date()
            }, {
                value: {},
                match: []
            }];

            expect(arr).to.have.length(3);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.greaterThan(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_GREATER_THAN_TYPE_ERROR");
                    expect(err.value).to.be.eql(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe('#greaterThanOrEqual', function() {

        it('should validate a number or numerical string', function(done) {

            expect(validation.greaterThanOrEqual(1235, 1234)).to.be.true;
            expect(validation.greaterThanOrEqual("12.35", "12.34")).to.be.true;
            expect(validation.greaterThanOrEqual("+12340", 1234)).to.be.true;
            expect(validation.greaterThanOrEqual(-524.2455, "-524.2456")).to.be.true;
            expect(validation.greaterThanOrEqual(Number(30000000), Number(-30000000))).to.be.true;

            expect(validation.greaterThanOrEqual(1234, 1234)).to.be.true;
            expect(validation.greaterThanOrEqual("12.34", "12.34")).to.be.true;
            expect(validation.greaterThanOrEqual("+1234", 1234)).to.be.true;
            expect(validation.greaterThanOrEqual(-524.2456, "-524.2456")).to.be.true;
            expect(validation.greaterThanOrEqual(Number(-30000000), Number(-30000000))).to.be.true;

            done();

        });

        it('should throw error when number or numerical string not-matched', function(done) {

            var arr = [{
                value: 12,
                match: 145960789
            }, {
                value: "12",
                match: "13"
            }, {
                value: 1.234,
                match: 1.235
            }, {
                value: -524.2456,
                match: -524.2455
            }];

            expect(arr).to.have.length(4);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.greaterThanOrEqual(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_NOT_GREATER_OR_EQUAL_TO_TARGET");
                    expect(err.value).to.be.equal(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw type error when different data type given', function(done) {

            var arr = [{
                value: 12,
                match: "kevin"
            }, {
                value: "smith",
                match: new Date()
            }, {
                value: {},
                match: []
            }];

            expect(arr).to.have.length(3);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.greaterThanOrEqual(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_GREATER_OR_EQUAL_TO_TYPE_ERROR");
                    expect(err.value).to.be.eql(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe('#lessThan', function() {

        it('should validate a number or numerical string', function(done) {

            expect(validation.lessThan(1234, 1235)).to.be.true;
            expect(validation.lessThan("12.34", "12.35")).to.be.true;
            expect(validation.lessThan(1234, "+12340")).to.be.true;
            expect(validation.lessThan("-524.2456", -524.2455)).to.be.true;
            expect(validation.lessThan(Number(-30000000), Number(30000000))).to.be.true;

            done();

        });

        it('should throw error when number or numerical string not-matched', function(done) {

            var arr = [{
                match: 12,
                value: 145960789
            }, {
                match: "12",
                value: "13"
            }, {
                match: 1.234,
                value: 1.235
            }, {
                match: -524.2456,
                value: -524.2455
            }];

            expect(arr).to.have.length(4);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.lessThan(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_NOT_LESS_THAN_TARGET");
                    expect(err.value).to.be.equal(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw type error when different data type given', function(done) {

            var arr = [{
                match: 12,
                value: "kevin"
            }, {
                match: "smith",
                value: new Date()
            }, {
                match: {},
                value: []
            }];

            expect(arr).to.have.length(3);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.lessThan(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_LESS_THAN_TYPE_ERROR");
                    expect(err.value).to.be.eql(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

    describe('#lessThanOrEqual', function() {

        it('should validate a number or numerical string', function(done) {

            expect(validation.lessThanOrEqual(1234, 1235)).to.be.true;
            expect(validation.lessThanOrEqual("12.34", "12.35")).to.be.true;
            expect(validation.lessThanOrEqual(1234, "+12340")).to.be.true;
            expect(validation.lessThanOrEqual("-524.2456", -524.2455)).to.be.true;
            expect(validation.lessThanOrEqual(Number(-30000000), Number(30000000))).to.be.true;

            expect(validation.lessThanOrEqual(1234, 1234)).to.be.true;
            expect(validation.lessThanOrEqual("12.34", "12.34")).to.be.true;
            expect(validation.lessThanOrEqual("+1234", 1234)).to.be.true;
            expect(validation.lessThanOrEqual(-524.2456, "-524.2456")).to.be.true;
            expect(validation.lessThanOrEqual(Number(-30000000), Number(-30000000))).to.be.true;

            done();

        });

        it('should throw error when number or numerical string not-matched', function(done) {

            var arr = [{
                match: 12,
                value: 145960789
            }, {
                match: "12",
                value: "13"
            }, {
                match: 1.234,
                value: 1.235
            }, {
                match: -524.2456,
                value: -524.2455
            }];

            expect(arr).to.have.length(4);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.lessThanOrEqual(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_NOT_LESS_OR_EQUAL_TO_TARGET");
                    expect(err.value).to.be.equal(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

        it('should throw type error when different data type given', function(done) {

            var arr = [{
                match: 12,
                value: "kevin"
            }, {
                match: "smith",
                value: new Date()
            }, {
                match: {},
                value: []
            }];

            expect(arr).to.have.length(3);

            arr.forEach(function(obj) {

                var fail = false;

                try {
                    validation.lessThanOrEqual(obj.value, obj.match);
                } catch(err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);

                    expect(err.message).to.be.equal("VALUE_LESS_OR_EQUAL_TO_TYPE_ERROR");
                    expect(err.value).to.be.eql(obj.value);
                    expect(err.params).to.be.eql([obj.match]);

                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

});