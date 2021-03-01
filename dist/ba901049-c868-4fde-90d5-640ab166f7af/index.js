(function($, win, doc) {
  
    "use strict";
    
    var Scrollbar = function(opt) {
        var opts = opt || {};
        var containerSize, contentSize, scrollbarSize;
        
        this.type = opts.type;
        this.$container = opts.$container;
        this.$content = opts.$content;
        this.$scrollbar = opts.$scrollbar;
        
        if(this.type === "top") {
            containerSize = this.$container.height();
            contentSize = this.$content.height();
            scrollbarSize = this.$scrollbar.height();
        } else if(this.type === "left") {
            containerSize = this.$container.width();
            contentSize = this.$content.widtht();
            scrollbarSize = this.$scrollbar.width();
        }

        var scrollbarDiff = containerSize - scrollbarSize;
        var contentDiff = contentSize - containerSize;
        this.scrollbarPos = Number(this.$scrollbar.css(this.type).split("px")[0]);
        this.d = (scrollbarDiff - this.scrollbarPos*2) / contentDiff;
    };
    
    Scrollbar.prototype.update = function(position) {
        var add = position + this.scrollbarPos + this.d * position;
        this.$scrollbar.css(this.type, add + "px");


    };
    
    var scrollbar = new Scrollbar({
        $container: $(".container"),
        $content: $(".content"),
        $scrollbar: $(".scrollbar"),
        type: "top"
    });
    
    $(".container").on("scroll", function() {
        scrollbar.update($(this).scrollTop());
    });
    

})(jQuery, window, window.document);