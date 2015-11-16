# Todo list

_\( managed using [todo-md](https://github.com/Hypercubed/todo-md) \)_

- [ ] Download multiple SVGs
- [ ] Make node compatible
- [x] Selectors
  - [x] pass selector string as alternative to element?
  - [x] If element is HTMLElement find first (all) SVG?
- [x] Make white lists optional
  - [ ] Document options
- [ ] Include better whitelists.
  - [x] Not all styles are inheritable
  - [ ] Styles can be converted to attributes (all styles?)
  - [ ] Different browsers return different style formats (rgb(0, 0, 0) vs \#000000)
  - [ ] Normalize and minimize styles?
- [x] Clean redundant inheritable styles
  - [ ] Remove default top level inheritable styles
- [x] image download (png, etc)
  - [ ] Fix IE11 (https://github.com/gabelerner/canvg)
- [x] encodeURI file names
- [ ] Modularize
  - [x] get computed styles
  - [x] copy styles
  - [ ] clone element with styles
  - [ ] convert styles to attributes
  - [ ] saveUri/savePNG
- [x] Tests
  - [x] Convert tests to tape
  - [x] Use zuul
