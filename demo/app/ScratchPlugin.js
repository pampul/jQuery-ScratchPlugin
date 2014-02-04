/**
 * Created by Florian on 03/02/2014.
 */
'use strict'

if (typeof Object.create !== 'function') {
  ScratchPlugin.create = function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };
}

(function ($, window, document, undefined) {
  var scratchCanvasTemplate = $("<canvas class='scratchCanvas' style='display:none'></canvas>");

  var ScratchPlugin = {
    // Init plugin function
    init: function (options, elem) {

      var self = this;

      self.elem = elem;
      self.$elem = $(elem);
      self.options = $.extend({}, $.fn.scratchPlugin.options, options);
      self.options.backGroundImage = self.$elem.data("background-image");
      self.options.foreGroundImage = self.$elem.data("foreground-image");

      self.loadedImages = 0;

      var canvasForegroundImg = new Image();
      canvasForegroundImg.onload = function () {

        self.newCanvasTpl = scratchCanvasTemplate.clone();
        self.$elem.html(self.newCanvasTpl);
        self.canvasElem = self.newCanvasTpl;

        self.ctx = self.canvasElem[0].getContext("2d");

        $(window).bind('mousedown', $.proxy(self.downHandler, self));
        self.canvasElem.bind('mouseup', $.proxy(self.topHandler, self));
        $(window).bind('mouseup', $.proxy(self.topHandler, self));
        self.canvasElem.bind('touchmove', $.proxy(self.touchMoveHandler, self));

        $(self.canvasElem).css({
          "backgroundImage": "url(" + canvasForegroundImg.src + ")"
        });

        self.canvasElem[0].width = canvasForegroundImg.width;
        self.canvasElem[0].height = canvasForegroundImg.height;
        self.loadedImages++;

        self.canvasElem.css("display", "inline");
        self.initX = self.canvasElem.offset().left;
        self.initY = self.canvasElem.offset().top;

      };

      var backgroundImg = new Image();
      backgroundImg.onload = function () {

        self.srcImg = backgroundImg;
        canvasForegroundImg.src = self.options.foreGroundImage;
      }
      backgroundImg.src = self.options.backGroundImage;

    },

    // Handle the end of the scratching
    topHandler: function (e) {
      var self = this;
      self.canvasElem.unbind('mousemove');

      var percentage = self.scratchPercentage(self);
      self.options.complete(self.$elem, percentage);
    },
    // Begin the scratch
    downHandler: function (e) {
      var self = this;
      self.canvasElem.bind('mousemove', $.proxy(self.mouseMoveHandler, self));
    },
    // Get mouse scratch pos and call the reveal function
    mouseMoveHandler: function (e) {
      var self = this;
      var mouseX = e.pageX - e.currentTarget.offsetLeft;
      var mouseY = e.pageY - e.currentTarget.offsetTop;
      self.scratch(mouseX, mouseY, self);
    },
    // Get touch scratch pos and call the reveal function
    touchMoveHandler: function (e) {
      var self = this;
      e.preventDefault();
      var event = window.event;
      var touchX = event.touches[0].pageX - self.initX;
      var touchY = event.touches[0].pageY - self.initY;
      self.scratch(touchX, touchY, self);
    },
    // Scratch the pos
    scratch: function (posX, posY, self) {
      self.ctx.save();
      self.ctx.arc(posX, posY, self.options.scratchRadius, 0, 2 * Math.PI, false);
      self.ctx.clip();
      self.ctx.drawImage(self.srcImg, 0, 0);
      self.ctx.restore();
    },
    // Get the percentage scratched and return it
    scratchPercentage: function (self) {
      var hits = 0;
      var imageData = self.ctx.getImageData(0, 0, self.canvasElem[0].width, self.canvasElem[0].height).data;
      var pixels = imageData.length;

      for (var i = 0, ii = pixels; i < ii; i = i + 4) {
        if (imageData[i] === 0 &&
          imageData[i + 1] === 0 &&
          imageData[i + 2] === 0 &&
          imageData[i + 3] === 0) {
          hits++;
        }
      }

      return ((pixels - (hits * 4)) / pixels) * 100;
    }
  };

  $.fn.scratchPlugin = function (options) {
    return this.each(function () {
      var scratchPlugin = Object.create(ScratchPlugin);
      scratchPlugin.init(options, this);
    });
  };

  //Defaults
  $.fn.scratchPlugin.options = {
    foreGroundImage: null,
    backGroundImage: null,
    scratchRadius: 15,
    complete: function ($elem, percentScratched) {}
  };
})(jQuery, window, document);
