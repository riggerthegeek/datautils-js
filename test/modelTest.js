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

var expect = require('chai').expect;

var model = require('../').model;

describe('Model tests', function() {

    describe('Instantiation tests', function() {

        it('should define a model with no definition', function(done) {

            /* Define the model */
            var Model = model.extend();

            var obj = new Model();

            expect(obj).to.be.instanceof(Model);
            expect(obj.toData()).to.be.eql({});
            expect(obj.toObject()).to.be.eql({});
            expect(obj.set('invalid', 'a string')).to.be.undefined;
            expect(obj.get('invalid')).to.be.undefined;

            done();

        });

        it('should define a model with definitions', function(done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    array: {
                        type: 'array'
                    },
                    boolean: {
                        type: 'boolean',
                        value: false
                    },
                    date: {
                        type: 'date'
                    },
                    float: {
                        type: 'float'
                    },
                    integer: {
                        type: 'integer'
                    },
                    object: {
                        type: 'object'
                    },
                    string: {
                        type: 'string'
                    },
                    notSet: {},
                    notSetNull: null
                }
            });


            var obj1 = new Model({
                array: [
                    'an','array of', ['stuff', 2]
                ],
                boolean: false,
                date: '2013-02-07 10:11:12',
                float: '2.3',
                integer: 89034,
                object: {
                    an: 'object', 'with': 'things', and: 2
                },
                string: 'some string',
                notSet: 'if not set, it is a string',
                notSetNull: 'if not set, it is a string'
            });

            expect(obj1).to.be.instanceof(Model);

            expect(obj1.toData()).to.be.eql({
                array: [
                    'an','array of', ['stuff', 2]
                ],
                boolean: false,
                date: new Date('2013-02-07 10:11:12'),
                float: 2.3,
                integer: 89034,
                object: {
                    an: 'object', 'with': 'things', and: 2
                },
                string: 'some string',
                notSet: 'if not set, it is a string',
                notSetNull: 'if not set, it is a string'
            });
            expect(obj1.toObject()).to.be.eql({
                array: [
                    'an','array of', ['stuff', 2]
                ],
                boolean: false,
                date: new Date('2013-02-07 10:11:12'),
                float: 2.3,
                integer: 89034,
                object: {
                    an: 'object', 'with': 'things', and: 2
                },
                string: 'some string',
                notSet: 'if not set, it is a string',
                notSetNull: 'if not set, it is a string'
            });
            expect(obj1.set('invalid', 'a string')).to.be.undefined;
            expect(obj1.get('invalid')).to.be.undefined;

            expect(obj1.set('integer', 12345)).to.be.undefined;
            expect(obj1.get('integer')).to.be.equal(12345);

            done();

        });

    });

    describe('Validation check', function() {



    });

    describe('Error checks', function() {



    });

});