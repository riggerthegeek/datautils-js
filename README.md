# DataUtils JS

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

Some JavaScript data utilities

# Installation

Installation via NPM is very simple

    npm install datautils

Once you've done that, you can access this using the `require` statement.

    var datautils = require('datautils');

# Documentation

## Data
 - [setArray](#setArray)
 - [setBool](#setBool)
 - [setDate](#setDate)
 - [setFloat](#setFloat)
 - [setFunction](#setFunction)
 - [setInstanceOf](#setInstanceOf)
 - [setInt](#setInt)
 - [setObject](#setObject)
 - [setRegex](#setRegex)
 - [setString](#setString)

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

<a name="setRegex" />
### _string_ setRegex(_string|RegExp_ regex, _string_ input, _mixed_ def)

Makes sure that the input matches the given regular expression.  It also
forces the output to be a string, so be careful.

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

# Validation

The model stuff primarily all works in the same way - if it passes the test it
returns `true`, if it fails the test or the wrong input is entered it throws an
error.

## Error Object

The error object is an extension of the default JavaScript Error object.  It has
a maximum of three parameters - the `message` (as the Error object has by default),
`value` (the value passed in) and `params` (an array of any other paramaters passed
in).

For instance, the function `validation.greaterThan(8, 10);` throws an error
(because 8 is less than 10).  `err.message` equals VALUE_NOT_GREATER_THAN_TARGET,
`err.value` = 8 and `err.params` = [ 10 ].

<a name="email" />
### _boolean_ email(_string_ value)

Checks if the given string validates as an email address. THIS DOES NOT CHECK IF
THE EMAIL IS ACTUALLY VALID!!!

<a name="equal" />
### _boolean_ equal(_mixed_ value, _mixed_ match)

This tests if the two variables are equal. If the variables are of a complex
nature (eg, objects), then it will match those too.

<a name="greaterThan" />
### _boolean_ greaterThan(_number_ value, _number_ target)

Does a numerical test on the variable, to see if it is greater than the given
value.

<a name="greaterThanOrEqual" />
### _boolean_ greaterThanOrEqual(_number_ value, _number_ target)

Does a numerical test on the variable, to see if it is greater than or equal to
the given value.

<a name="length" />
### _boolean_ length(_string_ value, _number_ length)

Makes sure that the value matches the length.

<a name="lengthBetween" />
### _boolean_ lengthBetween(_string_ value, _number_ minLength, _number_ maxLength)

Checks if the value is between the two lengths.

<a name="lessThan" />
### _boolean_ lessThan(_string_ value, _number_ target)

Does a numerical test on the variable, to see if it is less than the given value.

<a name="lessThanOrEqual" />
### _boolean_ lessThanOrEqual(_string_ value, _number_ target)

Does a numerical test on the variable, to see if it is less than or equal to the
given value.

<a name="maxLength" />
### _boolean_ maxLength(_string_ value, _number_ length)

Ensures that the value is no longer than the given max length.

<a name="minLength" />
### _boolean_ minLength(_string_ value, _number_ length)

Ensures that the value fulfils the given minimum length.

<a name="regex" />
### _boolean_ regex(_string_ value, _RegExp/string_ regex)

Matches the given value against the given regular expression.  It will allow
either a string or an instance of the RegExp object (by either `new RegExp()` or
`/regex/`).

<a name="required" />
### _boolean_ required(_string_ value)

If it's a truthy value, 0 or false, it is ok. Otherwise, it fails the test

# License

MIT License

[npm-image]: https://img.shields.io/npm/v/datautils.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/datautils.svg?style=flat
[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.8-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/datautils-js.svg?style=flat
[dependencies-image]: https://img.shields.io/david/riggerthegeek/datautils.svg?style=flat
[dev-dependencies-image]: https://img.shields.io/david/dev/riggerthegeek/datautils.svg?style=flat

[npm-url]: https://npmjs.org/package/datautils
[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/datautils-js
[downloads-url]: https://npmjs.org/package/datautils
[dependencies-url]: https://david-dm.org/riggerthegeek/datautils
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/datautils#info=devDependencies&view=table
