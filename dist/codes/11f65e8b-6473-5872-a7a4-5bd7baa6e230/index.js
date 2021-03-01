$("#button").hover(function() {
    $(".button-border").addClass("current");
    console.log("hover");
}, function() {
    $(".button-border").removeClass("current");
    console.log("hover-out");
});
    