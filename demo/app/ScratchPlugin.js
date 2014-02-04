/**
 * Created by Florian on 03/02/2014.
 */

if (typeof Object.create !== 'function') {
  ScratchPlugin.create = function (obj) {
    function F() {
    };
    F.prototype = obj;
    return new F();
  };
}

(function ($, window, document, undefined) {
  var scratchCanvasTemplate = $("<canvas class='scratchCanvas' style='display:none'></canvas>");

  var ScratchPlugin = {
    init: function (options, elem) {

      var self = this;

      self.elem = elem;
      self.$elem = $(elem);


      self.options = $.extend({}, $.fn.scratchPlugin.options, options);
      self.options.backgGroundImage = self.$elem.data("background-image");
      self.options.foreGroundImage = self.$elem.data("foreground-image");

      self.loadedImages = 0;

      var canvasBgImg = new Image();
      canvasBgImg.onload = function () {
        self.newScratchCanvas = scratchCanvasTemplate.clone();
        self.$elem.html(self.newScratchCanvas);
        self.theCanvas = self.newScratchCanvas;

        self.ctx = self.theCanvas[0].getContext("2d");


        $(window).bind('mousedown', $.proxy(self.addDownHandler, self));
        self.theCanvas.bind('mouseup', $.proxy(self.addUpHandler, self));
        $(window).bind('mouseup', $.proxy(self.addUpHandler, self));
        self.theCanvas.bind('touchmove', $.proxy(self.touchmoveHandler, self));

        $(self.theCanvas).css({
          "backgroundImage": "url(" + canvasBgImg.src + ")"
        });

        self.theCanvas[0].width = canvasBgImg.width;
        self.theCanvas[0].height = canvasBgImg.height;
        self.loadedImages++;

        self.theCanvas.css("display", "inline")
        self.initX = self.theCanvas.offset().left;
        self.initY = self.theCanvas.offset().top;

      };

      var bgImg = new Image();
      bgImg.onload = function () {

        self.srcImg = bgImg;
        canvasBgImg.src = self.options.foreGroundImage;
      }
      bgImg.src = self.options.backgGroundImage;


    },

    addDownHandler: function (e) {
      var self = this;
      self.theCanvas.bind('mousemove', $.proxy(self.mouseMoveHandler, self));
    },
    addUpHandler: function (e) {

      var self = this;
      self.theCanvas.unbind('mousemove');

      var percentage = self.scratchPercentage(self);

      if(percentage > self.options.minPercentage){
        self.options.complete(self.$elem);
      }

    },
    mouseMoveHandler: function (e) {
      var self = this;

      var mouseX = e.pageX - e.currentTarget.offsetLeft;
      mouseY = e.pageY - e.currentTarget.offsetTop;
      self.reveal(mouseX, mouseY, self);
    },

    touchmoveHandler: function (e) {
      var self = this;
      e.preventDefault();
      var event = window.event;
      mouseX = event.touches[0].pageX - self.initX;
      mouseY = event.touches[0].pageY - self.initY;
      self.reveal(mouseX, mouseY, self);
    },
    reveal: function (mouseX, mouseY, self) {
      self.ctx.save();
      self.ctx.arc(mouseX, mouseY, self.options.revealRadius, 0, 2 * Math.PI, false);
      self.ctx.clip();
      self.ctx.drawImage(self.srcImg, 0, 0);
      self.ctx.restore();
    },
    scratchPercentage: function (self) {
      var hits = 0;
      var imageData = self.ctx.getImageData(0, 0, self.theCanvas[0].width, self.theCanvas[0].height).data;
      var pixels = imageData.length;

      for (var i = 0, ii = pixels; i < ii; i = i + 4) {
        if (imageData[i] == 0 &&
          imageData[i + 1] == 0 &&
          imageData[i + 2] == 0 &&
          imageData[i + 3] == 0) {
          hits++;
        }
      }

      return ((pixels - (hits * 4)) / pixels) * 100;
    }
  }


  $.fn.scratchPlugin = function (options) {
    return this.each(function () {
      var scratchPlugin = Object.create(ScratchPlugin);
      scratchPlugin.init(options, this);
    });
  };

  //Defaults
  $.fn.scratchPlugin.options = {

    foreGroundImage: null,
    backgGroundImage: null,
    revealRadius: 15,
    minPercentage: 50,
    complete: function($elem){}

  };
})(jQuery, window, document);
