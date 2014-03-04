#jQuery Scratch Plugin

A lightweight jQuery plugin to create single or multiple scratch on images.

* [View the ScratchPlugin demo](http://scratch.florian-mithieux.fr/demo/)

- Don't use external images, the canvas can't work with that

### Settings

Available options with notes, the values here are the defaults.

```js
$('#elem').scratchPlugin({
  scratchRadius: 15, // the radius to the cursor circle you make
  complete: function ($elem, percentScratched) { // get the current element and the percentage scratched
    // do things
  }
});
```

### Example

Include the following file after jQuery

```js
<script type="text/javascript" src="./ScratchPlugin.js"></script>
```

Create an element with data options to define the images you want in foreground and background

```html
<div class="elem win" id="elem1" data-background-image="public/img/medal.png"
data-foreground-image="public/img/box.png"></div>

<div class="elem lose" id="elem2" data-background-image="public/img/medal.png"
data-foreground-image="public/img/box.png"></div>
```

Then, launch the plugin to each html elems

```js
$(".elem").scratchPlugin({
    scratchRadius: 15,
    complete: function ($elem, percentScratched) {
      // handle example
      if ($elem.hasClass('win')) {
        alert('You win !');
      }
    }
});
```
