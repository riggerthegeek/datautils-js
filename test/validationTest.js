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

            expect(arr.length).to.be.equal(8);

            arr.forEach(function(email) {

                var fail = false;

                try {
                    validation.email(email);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_NOT_EMAIL');
                    expect(err.value).to.be.equal(email);
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

            expect(arr.length).to.be.equal(8);

            arr.forEach(function(email) {

                var fail = false;

                try {
                    validation.email(email);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_NOT_EMAIL_NOT_STRING');
                    expect(err.value).to.be.equal(email);
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

            expect(arr.length).to.be.equal(3);

            arr.forEach(function(value) {

                var fail = false;

                try {
                    validation.required(value);
                } catch(err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('VALUE_REQUIRED');
                    expect(err.value).to.be.equal(value);
                }

                expect(fail).to.be.true;

            });

            done();

        });

    });

});