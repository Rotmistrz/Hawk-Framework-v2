Hawk.RevealingItem = class {
  constructor(container, options) {
    this.container = container;

    this.defaultOptions = {
      baseItemClass: 'pulling-item__base-item',
      layerItemClass: 'pulling-item__layer-item',
      afterItemClass: 'pulling-item__after-item',
      barClass: 'pulling-item__pulling-bar'
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.currentDelta = 0;

    this.leftOffset = 0;
    this.maxWidth = 0;
  }

  getWidth() {
    return this.layerItem.width();
  }

  countDelta(pageX) {
    var delta = pageX - (this.leftOffset + this.getWidth());

    this.currentDelta = delta;

    return this.currentDelta;
  }

  pulling(e) {
    var pageX = (e.type.toLowerCase() === 'mousemove')
        ? e.pageX
        : e.originalEvent.touches[0].pageX;

    var width = pageX - this.leftOffset;

    this.layerItem.css({ width: width + "px" });

    var afterItemWidth = this.baseItem.width() - width;

    this.afterItem.css({ width: afterItemWidth + "px" });
  }

  startPulling() {
    $('body').bind('mousemove.revealingItem touchmove.revealingItem', this.pulling.bind(this));
  }

  finishPulling() {
    $('body').unbind('mousemove.revealingItem touchmove.revealingItem');
  }

  refresh() {
    this.leftOffset = this.layerItem.offset().left;
  }

  run() {
    this.baseItem = this.container.find('.' + this.options.baseItemClass);
    this.layerItem = this.container.find('.' + this.options.layerItemClass);
    this.afterItem = this.container.find('.' + this.options.afterItemClass);
    this.bar = this.container.find('.' + this.options.barClass);

    console.log('lalala');

    console.log(this.options.layerItemClass);
    console.log(this.layerItem);

    this.refresh();

    $(window).resize(() => {
      this.refresh();
    })

    $('body').bind('mouseup touchend', (e) => {
      console.log('finishing pulling?');
      this.finishPulling();
    });

    $('body').bind('mousedown touchstart', (e) => {
      var pageY = (e.type.toLowerCase() === 'mousedown')
        ? e.pageY
        : e.originalEvent.touches[0].pageY;

      var pageX = (e.type.toLowerCase() === 'mousedown')
        ? e.pageX
        : e.originalEvent.touches[0].pageX;

      if (pageY > this.bar.offset().top && pageY < (this.bar.offset().top + this.bar.height())
        && pageX > this.bar.offset().left && pageX < (this.bar.offset().left + this.bar.width())
        ) {
        this.startPulling();
      }
    });
  }
}