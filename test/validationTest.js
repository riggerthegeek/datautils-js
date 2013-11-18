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

            done();

        });

        it('should throw an error when empty', function(done) {

            var arr = [
                null,
                '',
                undefined
            ];

            expect(arr).to.have.length(3);

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
                {},
                [],
                undefined,
                new String('test@test.com')
            ];

            expect(arr).to.have.length(8);

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
                {},
                [],
                undefined,
                new String('test@test.com')
            ];

            expect(arr).to.have.length(8);

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
                {},
                [],
                undefined,
                new String('test@test.com')
            ];

            expect(arr).to.have.length(8);

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
                {},
                [],
                undefined,
                new String('test@test.com')
            ];

            expect(arr).to.have.length(8);

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

});