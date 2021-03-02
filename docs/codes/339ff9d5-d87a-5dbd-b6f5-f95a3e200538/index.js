
setInterval(function() {
    $(".box").each(function() {
        
        var num = Number($(this).attr("data-anime"));     
        var next;
        
        if(num == 4) {
            next = 1;
        } else {
            next = num+1;
        }
        $(this).removeClass("rotate" + num);
        
        $(this).addClass("rotate" + next);
        $(this).attr("data-anime", next);
        
    });
}, 500);