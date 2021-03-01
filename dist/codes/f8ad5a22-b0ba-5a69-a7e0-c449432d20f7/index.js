	var c2 = function() {
		var canvas = document.getElementById('c2');
		if ( ! canvas || ! canvas.getContext ) { return false; }
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		var startAngle = 0;
        ctx.fillStyle = 'rgba(255, 255, 0, 1)';
		var endAngle = 135 * Math.PI / 180;
		ctx.arc(50, 50, 40, startAngle, endAngle, true);
		ctx.stroke();
	};
	window.onload = function() {
		c2();
	};