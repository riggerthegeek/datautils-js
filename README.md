# DataUtils JS [![Build Status](https://travis-ci.org/riggerthegeek/datautils-js.png?branch=master)](https://travis-ci.org/riggerthegeek/datautils-js)

Some JavaScript data utilities

# Installation

Installation via NPM is very simple

    npm install datautils

Once you've done that, you can access this using the `require` statement.

    var datautils = require('datautils');

# Accessing the Methods

This module uses the [Revealing Module Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript), so you can easily access the bits you want.  Simply put, you can access the lower modules easily.

    /* To get to the arrays */
    var datautils = require('datautils');
    
    var array = datautils.array;
    var data = datautils.data;

# Documentation

## Array
 - [inArray](#inArray)
 - [objectValues](#objectValues)

## Data
 - [setArray](#setArray)
 - [setBool](#setBool)
 - [setDate](#setDate)
 - [setFloat](#setFloat)
 - [setFunction](#setFunction)
 - [setInstanceOf](#setInstanceOf)
 - [setInt](#setInt)
 - [setObject](#setObject)
 - [setString](#setString)

# Array

<a name="inArray" />
### _bool_ inArray(_mixed_ needle, _array_ haystack)

Searches for the needle (usually a string, but could be a number or other data
type) inside the haystack (an array).

#### Example

    var haystack = [
       'val1', 'val2', 'val3'
    ];
    
    datautils.array.inArray('val2', haystack); // true
    datautils.array.inArray('val4', haystack); // false

<a name="objectValues" />
### _array_ objectValues(_object_ obj)

Pass out the values of an object as an array.  Similar to PHP's array_values()
function

#### Example

    var obj = {
        name: 'Name',
        email: 'test@test.com'
    };
    
    datautils.array.objectValues(obj); // ['Name', test@test.com']

# Data

The data methods all work in fundamentally the same way - you pass in some
raw input as the first parameter and a default value as the second.  If the first
parameter fulfils the criteria of the method, it return that otherwise it returns
the default value.

<a name="setArray" />
### _mixed_ setArray(_mixed_ input, _mixed_ def)

Ensures that the input is an array

<a name="setBool" />
### _mixed_ setBool(_mixed_ input, _mixed_ def)

Ensures the the input is a boolean (true/false).  It also casts it to a boolean
if the following criteria:
 - true:
   - String: (upper and lower case): Y, 1, TRUE, T, YES
   - Number: 1
   - Boolean: true
 - false:
   - String: (upper and lower case): N, 1, FALSE, F, NO
   - Number: 0
   - Boolean: false

<a name="setDate" />
### _mixed_ setDate(_mixed_ input, _mixed_ def)

Ensures that the input is an instance of the Date object.  Can take in either a
Date object or a string that matches the ISO8601 format.

<a name="setFloat" />
### _mixed_ setFloat(_mixed_ input, _mixed_ def)

Ensures that input is a floating point number.  This can receive either a number
or a numerical string.

<a name="setFunction" />
### _mixed_ setFunction(_mixed_ input, _mixed_ def)

Ensures that the input a function

<a name="setInstanceOf" />
### _mixed_ setInstanceOf(_mixed_ input, _function_ instance, _mixed_ def)

Ensures that the input is an instance of the instance.  The instance must
be a function.  This function can be injected into this method.

<a name="setInt" />
### _mixed_ setInt(_mixed_ input, _mixed_ def)

Ensures that the input is an integer.  This can be either a string, or a
number.  In reality, this pushes it to the JavaScript Number object 
(which can be made to be a floating point number.  However, this function
ensures that value that is returned it an integer.  If you pass over
Number(1) or String(3.0), they are returned as Number(1) and Number(3).
However, if you pass in Number(1.2) or String(2.4), the default value
will be returned.

<a name="setObject" />
### _mixed_ setString(_mixed_ input, _mixed_ def)

Ensures that the input is an object.  Although this is designed to receive
key/value pairs, but it will allow other objects (eg, Date).  It will not
allow arrays or null values however.

<a name="setString" />
### _mixed_ setString(_mixed_ input, _mixed_ def[, _array_ values])

Ensures that the input is a string.  If it is a number, this is cast
to a string.  If you wish to specify a series of values, this can be done
by passing in some _values_.

#### Example

    var values = [
        'val1', 'val2', 'val3'
    ];
    val1 = datautils.data.setString('val1', null, values); // 'val1'
    val2 = datautils.data.setString('val4', null, values); // null