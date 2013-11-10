# DataUtils JS [![Build Status](https://travis-ci.org/riggerthegeek/datautils-js.png?branch=master)](https://travis-ci.org/riggerthegeek/datautils-js)

Some JavaScript data utilities

# Documentation

## Array
 - [inArray](#inArray)
 - [objectValues](#objectValues)

## Data Types
 - [setArray](#setArray)
 - [setBool](#setBool)
 - [setDate](#setDate)
 - [setFloat](#setFloat)
 - [setFunction](#setFunction)
 - [setInstanceOf](#setInstanceOf)
 - [setInt](#setInt)
 - [setString](#setString)

# Array

### _bool_ inArray(_mixed_ needle, _array_ haystack)

Searches for the needle (usually a string, but could be a number or other data type) inside the haystack (an array).

#### Example

    var haystack = [
       'val1', 'val2', 'val3'
    ];
    
    datautils.array.inArray('val2', haystack); // true
    datautils.array.inArray('val4', haystack); // false

# Data Types