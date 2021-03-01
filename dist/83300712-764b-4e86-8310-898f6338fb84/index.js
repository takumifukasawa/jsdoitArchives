$(".circle").click(function(e) {
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log("click");
    
    $(this).removeClass("framein").addClass("scaleout");
    
    $(".scaleout.current").on("animationend", function() {
                
        $(this).off("animationend");

        var index = $(".circle").index(this);
        console.log(index);
    
        var next;
        if(index === 0) {
            next = 1;
            color = "first";
        } else {
            next = 0;
            color = "secound";
        }

        var $next = $(".circle").eq(next);
        $next.removeClass("scaleout").addClass("current").addClass("framein");
        $(this).removeClass("current").addClass(color);

    });
    
    return;
});
