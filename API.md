<a name="SvgSaver"></a>

## SvgSaver
**Kind**: global class  
**Api**: public  

* [SvgSaver](#SvgSaver)
    * [new SvgSaver()](#new_SvgSaver_new)
    * [.cloneSVG(el)](#SvgSaver+cloneSVG) ⇒ <code>SVGElement</code>
    * [.getHTML(el)](#SvgSaver+getHTML) ⇒ <code>String</code>
    * [.getBlob(el)](#SvgSaver+getBlob) ⇒ <code>Blog</code>
    * [.getUri(el)](#SvgSaver+getUri) ⇒ <code>String</code>
    * [.asSvg(el, [filename])](#SvgSaver+asSvg) ⇒ <code>[SvgSaver](#SvgSaver)</code>
    * [.getPngUri(el, cb)](#SvgSaver+getPngUri)
    * [.asPng(el, [filename])](#SvgSaver+asPng) ⇒ <code>[SvgSaver](#SvgSaver)</code>

<a name="new_SvgSaver_new"></a>

### new SvgSaver()
SvgSaver constructor.

**Example**  
```js
var svgsaver = new SvgSaver();                      // creates a new instance
var svg = document.querySelector('#mysvg');         // find the SVG element
svgsaver.asSvg(svg);                                // save as SVG
```
<a name="SvgSaver+cloneSVG"></a>

### svgSaver.cloneSVG(el) ⇒ <code>SVGElement</code>
Return the cloned SVG after cleaning

**Kind**: instance method of <code>[SvgSaver](#SvgSaver)</code>  
**Returns**: <code>SVGElement</code> - SVG text after cleaning  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>SVGElement</code> | The element to copy. |

<a name="SvgSaver+getHTML"></a>

### svgSaver.getHTML(el) ⇒ <code>String</code>
Return the SVG HTML text after cleaning

**Kind**: instance method of <code>[SvgSaver](#SvgSaver)</code>  
**Returns**: <code>String</code> - SVG text after cleaning  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>SVGElement</code> | The element to copy. |

<a name="SvgSaver+getBlob"></a>

### svgSaver.getBlob(el) ⇒ <code>Blog</code>
Return the SVG, after cleaning, as a text/xml Blob

**Kind**: instance method of <code>[SvgSaver](#SvgSaver)</code>  
**Returns**: <code>Blog</code> - SVG as a text/xml Blob  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>SVGElement</code> | The element to copy. |

<a name="SvgSaver+getUri"></a>

### svgSaver.getUri(el) ⇒ <code>String</code>
Return the SVG, after cleaning, as a image/svg+xml;base64 URI encoded string

**Kind**: instance method of <code>[SvgSaver](#SvgSaver)</code>  
**Returns**: <code>String</code> - SVG as image/svg+xml;base64 URI encoded string  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>SVGElement</code> | The element to copy. |

<a name="SvgSaver+asSvg"></a>

### svgSaver.asSvg(el, [filename]) ⇒ <code>[SvgSaver](#SvgSaver)</code>
Saves the SVG as a SVG file using method compatible with the browser

**Kind**: instance method of <code>[SvgSaver](#SvgSaver)</code>  
**Returns**: <code>[SvgSaver](#SvgSaver)</code> - The SvgSaver instance  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>SVGElement</code> | The element to copy. |
| [filename] | <code>string</code> | The filename to save, defaults to the SVG title or 'untitled.svg' |

<a name="SvgSaver+getPngUri"></a>

### svgSaver.getPngUri(el, cb)
Gets the SVG as a PNG data URI.

**Kind**: instance method of <code>[SvgSaver](#SvgSaver)</code>  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>SVGElement</code> | The element to copy. |
| cb | <code>function</code> | Call back called with the PNG data uri. |

<a name="SvgSaver+asPng"></a>

### svgSaver.asPng(el, [filename]) ⇒ <code>[SvgSaver](#SvgSaver)</code>
Saves the SVG as a PNG file using method compatible with the browser

**Kind**: instance method of <code>[SvgSaver](#SvgSaver)</code>  
**Returns**: <code>[SvgSaver](#SvgSaver)</code> - The SvgSaver instance  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>SVGElement</code> | The element to copy. |
| [filename] | <code>string</code> | The filename to save, defaults to the SVG title or 'untitled.png' |

