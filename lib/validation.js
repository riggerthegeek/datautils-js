/**
 * Validation
 *
 * This is a collection of validation utilies.
 */


/**
 * Exception
 *
 * This is a simple invokation of the Error
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