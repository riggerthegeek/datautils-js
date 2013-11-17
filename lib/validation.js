/**
 * Validation
 *
 * This is a collection of validation utilies.
 */

var datatypes = require("./datatypes");


/**
 * Exception
 *
 * This is a simple creator of the Error
 * object that allows us to pass in a value
 * parameter easily.  This is a private
 * method that should not be exposed out of
 * this file.
 *
 * @param {string} message
 * @param {mixed} value
 * @returns {Error}
 */
function Exception(message, value) {
    var err = new Error(message);
    err.value = value;

    /* Push arguments to array */
    var args = Array.prototype.slice.call(arguments);

    args.forEach(function(arg, i) {
        /* Ignore the first two */
        if(i > 1) {

            var name = "param" + (i - 1);

            err[name] = arg;

        }
    });

    return err;
}



module.exports = {


    /**
     * Email
     *
     * Checks if the given string validates as
     * an email address. THIS DOES NOT CHECK IF
     * THE EMAIL IS ACTUALLY VALID!!!
     *
     * @param {string} value
     * @returns {boolean}
     * @throws {Error}
     */
    email: function email(value) {

        if(typeof value === "string") {
            var match = value.match(/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i);

            if(match === null) {
                throw new Exception("VALUE_NOT_EMAIL", value);
            }
        } else {
            throw new Exception("VALUE_NOT_EMAIL_NOT_STRING", value);
        }

        return true;

    },


    /**
     * Min Length
     *
     * Ensures that the value fulfils the given
     * minimum length
     *
     * @param {string} value
     * @param {number} length
     * @returns {Boolean}
     * @throws {Exception}
     */
    minLength: function(value, length) {

        var iLength = datatypes.setInt(length, null);

        if(typeof value === "string") {

            if(iLength === null) {
                throw new Exception("MIN_LENGTH_NOT_INTEGER", value, length);
            }

            if(iLength < 0) {
                throw new Exception("MIN_LENGTH_LESS_THAN_ZERO", value, iLength);
            }

            if(value.length < iLength) {
                throw new Exception("VALUE_LESS_THAN_MIN_LENGTH", value, iLength);
            }

        } else {
            throw new Exception("VALUE_MIN_LENGTH_NOT_STRING", value, length);
        }

        return true;

    },


    /**
     * Required
     *
     * If it's a truthy value, it is ok. Otherwise,
     * it fails the test
     *
     * @param {mixed} value
     * @returns {boolean}
     * @throws {Error}
     */
    required: function required(value) {
        if(value || value === 0 || value === false) {
            return true;
        }
        throw new Exception("VALUE_REQUIRED", value);
    }


};