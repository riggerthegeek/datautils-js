/**
 * Data Utils
 *
 * A series of utility functions that allow
 * us to ensure consistent data coming into
 * the library.
 *
 * @copyright 2013 Simon Emms <simon@simonemms.com>
 * @license MIT License
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var moment = require("moment");


/* Files */


module.exports = {


    /**
     * Set Array
     *
     * Ensures the input is an array, or returns the
     * default value
     *
     * @param {*} input
     * @param {*} def
     * @returns {*}
     */
    setArray: function setArray (input, def) {

        if (_.isArray(input)) {
            return input;
        }

        return def;

    },


    /**
     * Set Bool
     *
     * Sets an input value as a boolean, or
     * the default value
     *
     * @param {*} input
     * @param {*} def
     * @returns {*}
     */
    setBool: function setBool (input, def) {

        if (_.isBoolean(input)) {
            return input;
        }

        if (_.isString(input)) {
            input = input.toUpperCase();

            /* True */
            if (input === "Y" || input === "1" || input === "TRUE" || input === "T" || input === "YES") {
                return true;
            }

            /* False */
            if (input === "N" || input === "0" || input === "FALSE" || input === "F" || input === "NO") {
                return false;
            }

        }

        if (_.isNumber(input)) {
            /* True */
            if (input === 1) {
                return true;
            }

            /* False */
            if (input === 0) {
                return false;
            }
        }

        return def;

    },


    /**
     * Set Date
     *
     * Sets an input value as a date object, or
     * the default value
     *
     * @param {mixed} input
     * @param {mixed} def
     * @returns {mixed}
     */
    setDate: function setDate (input, def) {

        if (input instanceof Date) {
            /* Already date object - return */
            return input;
        }

        if (_.isString(input)) {
            /* Match ISO8601 date */
            var tmp = moment(input, moment.ISO_8601);

            if (tmp.isValid()) {

                return tmp.toDate();

            }
        }

        return def;

    },


    /**
     * Set Enum
     *
     * Sets the input value if it's in the allowed
     * list
     *
     * @param {*} input
     * @param {Array} values
     * @param {*} def
     * @returns {*}
     */
    setEnum: function setEnum (input, values, def) {

        if (_.isArray(values)) {

            if (_.indexOf(values, input) !== -1) {
                return input;
            }

        }

        return def;

    },


    /**
     * Set Float
     *
     * Sets an input value as a float, or
     * the default value
     *
     * @param {*} input
     * @param {*} def
     * @returns {*}
     */
    setFloat: function setFloat (input, def) {

        if (_.isString(input) || _.isNumber(input)) {
            /* Cast to string so we can see if integer */
            var value = String(input);

            if (isNaN(value) === false) {
                return parseFloat(value);
            }
        }

        return def;

    },


    /**
     * Set Function
     *
     * Sets an input parameter as a function
     *
     * @param {*} input
     * @param {*} def
     * @returns {*}
     */
    setFunction: function setFunction (input, def) {

        if (_.isFunction (input)) {
            return input;
        }

        return def;

    },


    /**
     * Set Instance Of
     *
     * Sets the input parameter as an instance of the
     * given function
     *
     * @param {*} input
     * @param {function} instance
     * @param {*} def
     * @returns {*}
     */
    setInstanceOf: function setInstanceOf (input, instance, def) {

        if (this.setFunction(instance, false) && input instanceof instance) {
            return input;
        }

        return def;

    },


    /**
     * Set Int
     *
     * Sets an input value as an integer, or
     * the default value
     *
     * @param {*} input
     * @param {*} def
     * @returns {*}
     */
    setInt: function setInt (input, def) {

        if (_.isNumber(input) || _.isString(input)) {
            /* Cast to string so we can see if integer */
            var value = String(input);

            if (value.match(/^(\-|\+)?\d+$/)) {
                /* It's an integer - push to integer and carry on */
                return parseInt(value, 10);
            }
        }

        return def;

    },


    /**
     * Set Object
     *
     * Makes sure that the input is an object. This
     * is designed for key/value pairs, but will allow
     * other objects (like Date).
     *
     * This will not allow Arrays or null values in.
     *
     * @param {mixed} input
     * @param {mixed} def
     * @returns {mixed}
     */
    setObject: function setObject (input, def) {

        if (_.isObject(input) && _.isArray(input) === false && _.isFunction(input) === false) {
            return input;
        }

        return def;

    },


    /**
     * Set Regex
     *
     * Makes sure that the input matches the given
     * regular expression.  It also forces the output
     * to be a string, so be careful.
     *
     * @param {string|RegExp} regex
     * @param {string} input
     * @param {*} def
     * @returns {string}
     */
    setRegex: function setRegex (regex, input, def) {

        /* Put input to a string */
        input = this.setString(input, null);

        /* Make sure some input is set */
        if (input !== null) {

            if (_.isString(regex)) {
                regex = new RegExp(regex);
            }

            if (this.setInstanceOf(regex, RegExp, false) !== false) {

                if (input.match(regex) !== null) {
                    return input;
                }

            } else {
                throw new Error("SETREGEX_NOT_REGEXP_OR_STRING");
            }

        }

        return def;

    },


    /**
     * Set String
     *
     * Sets an input value as a string, or
     * the default value
     *
     * @param {*} input
     * @param {*} def
     * @param {*} values
     * @returns {*}
     */
    setString: function setString (input, def, values) {

        if (_.isArray(values) === false) { values = null; }

        if (_.isString(input) || (_.isNumber(input) && isNaN(input) === false)) {

            input = String(input);

            if (values !== null) {
                if (_.indexOf(values, input) !== -1) {
                    return input;
                }
            } else {
                return input;
            }

        }

        return def;

    }


};
