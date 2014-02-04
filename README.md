#jQuery Scratch Plugin

A lightweight jQuery plugin to create single or multiple scratch on images.

#Settings

Available options with notes, the values here are the defaults.

```javascript
$('#elem').scratchPlugin({
  revealRadius: 15, // the radius to the cursor circle you make
  minPercentage: 50, // the percentage min to complete a scratch
  complete: function ($elem) {
    // do things
  }
});
```

