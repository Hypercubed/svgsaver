CHANGELOG
=========

## HEAD (Unreleased)
* Add xlink namespace declaration, fixes safari and firefox.

--------------------

## 0.8.0 (2017-04-25)
* Improved demo
* Added cloneSVG public API
* Added getPngUri public API
* Added xlink:href to allowed attrs

## 0.7.0 (2017-04-12)
* Fix phantomjs dev in package.json

## 0.6.2 (2016-11-11)
* Fix #4, Add href to default attributes

## 0.6.1 (2015-11-17)
* Fix #1, The string to be encoded contains characters outside of the Latin1 range.

## 0.6.0 (2015-11-16)
* URI encode filenames
* Flexible element selection
* Throw error if no SVGs can be found

## 0.5.0 (2015-11-13)
* Support Firefox without FileSaver

## 0.4.0 (2015-11-05)
* Clean superfluous inheritable styles

## 0.3.3 (2015-10-28)
* Use latest computed-styles, fixes IE11

## 0.3.2 (2015-10-27)
* Internal change to use latest computed-styles

## 0.3.1 (2015-10-23)
* Default is now to copy all inherited styles, regardless of value

## 0.3.0 (2015-10-20)
* Now using copy-styles module
* No longer removes styles from elements that match parent styles (not all styles are inheritable)
