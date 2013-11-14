/**
 * Model
 */
(function() {
    
    "use strict";


    /* Node modules */


    /* Third-party modules */
    var _ = require('underscore');


    /* Files */
    var datatypes = require('./datatypes');



    function Model(options) {


        var self = this;



        /* Where we store the attributes */
        self._attr = {};



        /* Where we store the definition object */
        self._definition = {};



        /**
         * Construct
         *
         * The constructor function.  This is run
         * every time a new version of the model is
         * instantiated
         *
         * @param {object} data
         * @returns {undefined}
         */
        self._construct = function _construct(data) {

            /* Set the data */
            data = datatypes.setObject(data, null);

            /* Set the definition */
            self._setDefinition(datatypes.setObject(self.definition, null));

            /* Delete the definition so it can't be used again */
            self.definition = undefined;

            /* Set the data */
            if (data !== null) {
                for (var key in data) {
                    self.set(key, data[key]);
                }
            }

        };



        /**
         * Set Definition
         *
         * Sets the model definition
         *
         * @param {object} objDefinitions
         * @returns {undefined}
         */
        self._setDefinition = function _setDefinition(objDefinitions) {

            self._definition = {};

            /* Accept objects only - key represents the model key */
            if (typeof objDefinitions === 'object' && objDefinitions !== null) {

                for (var key in objDefinitions) {

                    var objDefinition = objDefinitions[key];

                    var type = 'string'; /* Datatype */
                    var value = null; /* Default value */
                    var column = key;

                    /* If nothing set, use the defaults */
                    if (objDefinition) {

                        /* Set the datatype */
                        if (_.has(objDefinition, 'type')) {
                            if (typeof objDefinition.type === 'string') {
                                type = objDefinition.type;
                            }
                        }

                        /* Set the default value */
                        if (_.has(objDefinition, 'value')) {
                            value = objDefinition.value;
                        }

                        /* Set the column value */
                        if (_.has(objDefinition, 'column')) {
                            column = objDefinition.column;
                        }

                    }

                    /* Set the definition */
                    self._definition[key] = {
                        type: type,
                        value: value,
                        column: column
                    };

                    /* Set default value */
                    self.set(key);

                }

            }

        };



        /**
         * Get Column Keys
         *
         * Gets the keys and the column name
         * as an array of object.
         *
         * @returns {array}
         */
        self.getColumnKeys = function getColumnKeys() {

            var arr = [];
            if (self._definition && _.isEmpty(self._definition) === false) {

                var definition = _.clone(self._definition);

                for (var key in definition) {

                    var value = definition[key];

                    arr.push({
                        key: key,
                        column: value.column || key
                    });

                }

            }

            return arr;

        };


        /* Invoke the constructor */
        self._construct(options);

        return self;

    }



    _.extend(Model.prototype, {
        /**
         * Get
         *
         * Gets an individual parameter
         *
         * @param {string} key
         * @returns {mixed}
         */
        get: function getter(key) {
            return this._attr[key];
        },
        /**
         * Set
         *
         * Sets the value to the object
         *
         * @param {string} key
         * @param {mixed} value
         * @returns {undefined}
         */
        set: function setter(key, value) {

            /* Get the definition key */
            if (this._definition[key]) {

                var definition = this._definition[key];
                var defaults = definition.value;

                /* Search for a set function */
                var setFunc = '@todo';
                if (this[setFunc] && typeof this[setFunc] === 'function') {

                } else {

                    /* Set the datatype */
                    switch (definition.type) {

                        case 'array':
                            value = datatypes.setArray(value, defaults);
                            break;

                        case 'boolean':
                            value = datatypes.setBool(value, defaults);
                            break;

                        case 'date':
                            value = datatypes.setDate(value, defaults);
                            break;

                        case 'float':
                            value = datatypes.setFloat(value, defaults);
                            break;

                        case 'integer':
                            value = datatypes.setInt(value, defaults);
                            break;

                        case 'object':
                            value = datatypes.setObject(value, defaults);
                            break;

                        default:
                            /* Default to string */
                            value = datatypes.setString(value, defaults);
                            break;

                    }

                    /* Set the value */
                    this._attr[key] = value;

                }

            }

        },
        /**
         * To Data
         *
         * Pushes the data to the database
         * representation.
         */
        toData: function() {

            var obj = {};
            var keys = Object.keys(this._definition);

            for (var i = 0; i < keys.length; i++) {

                var key = keys[i];

                /* Get the column name */
                var column = this._definition[key].column;

                obj[column] = this.get(key);

            }

            return obj;

        },
        /**
         * To Object
         *
         * Clones out the data as an object
         * of key/value pairs
         */
        toObject: function() {

            var obj = {};
            var keys = Object.keys(this._definition);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];

                obj[key] = this.get(key);
            }

            return obj;

        }


    });




    /**
     * Extend
     *
     * Extends the model class so it can be used
     * consistently
     *
     * @param {object} objProperties
     * @param {object} objStaticProperties
     * @returns {function}
     */
    Model.extend = function extend(objProperties, objStaticProperties) {

        objProperties = datatypes.setObject(objProperties, null);
        objStaticProperties = datatypes.setObject(objStaticProperties, {});

        var parent = this;
        var inst = function() {
            return parent.apply(this, arguments);
        };

        /* Add static properties */
        _.extend(inst, parent, objStaticProperties);

        function Surrogate() {
            this.constructor = inst;
        }

        Surrogate.prototype = parent.prototype;
        inst.prototype = new Surrogate();

        if (objProperties) {
            _.extend(inst.prototype, objProperties);
        }

        inst.__super__ = parent.prototype;

        return inst;

    };



    /**
     * To Model
     *
     * Pushes the data object into a model
     *
     * @param {object} objData
     * @returns {Model}
     */
    Model.toModel = function(objData) {

        objData = datatypes.setObject(objData, {array: []});

        /* Create instance of model - this doesn't feel right, but it works */
        var obj = new this();

        /* Get the definition */
        var def = obj.getColumnKeys();

        /* Set the information to the model */
        for (var i = 0; i < def.length; i++) {
            var key = def[i].key;
            var value = objData[def[i].column];

            obj.set(key, value);
        }

        return obj;

    };



    module.exports = Model;

}());