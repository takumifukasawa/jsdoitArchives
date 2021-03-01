$.ajax({
    url: 'https://graph.facebook.com',
    data: {
        id: 'https://google.com',
        scrape: true
    }
}).done(function(response, status, error) {
	console.log(response, status, error);
});