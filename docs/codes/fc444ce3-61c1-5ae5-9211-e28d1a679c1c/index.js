window.app = {};
var Delaunay;

(function($, win, doc, ns) {
  "use strict";

  var EPSILON = 1.0 / 1048576.0;

  function supertriangle(vertices) {
    var xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY,
        i, dx, dy, dmax, xmid, ymid;

    for(i = vertices.length; i--; ) {
      if(vertices[i][0] < xmin) xmin = vertices[i][0];
      if(vertices[i][0] > xmax) xmax = vertices[i][0];
      if(vertices[i][1] < ymin) ymin = vertices[i][1];
      if(vertices[i][1] > ymax) ymax = vertices[i][1];
    }

    dx = xmax - xmin;
    dy = ymax - ymin;
    dmax = Math.max(dx, dy);
    xmid = xmin + dx * 0.5;
    ymid = ymin + dy * 0.5;

    return [
      [xmid - 20 * dmax, ymid -      dmax],
      [xmid            , ymid + 20 * dmax],
      [xmid + 20 * dmax, ymid -      dmax]
    ];
  }

  function circumcircle(vertices, i, j, k) {
    var x1 = vertices[i][0],
        y1 = vertices[i][1],
        x2 = vertices[j][0],
        y2 = vertices[j][1],
        x3 = vertices[k][0],
        y3 = vertices[k][1],
        fabsy1y2 = Math.abs(y1 - y2),
        fabsy2y3 = Math.abs(y2 - y3),
        xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

    /* Check for coincident points */
    if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
      throw new Error("Eek! Coincident points!");

    if(fabsy1y2 < EPSILON) {
      m2  = -((x3 - x2) / (y3 - y2));
      mx2 = (x2 + x3) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (x2 + x1) / 2.0;
      yc  = m2 * (xc - mx2) + my2;
    }

    else if(fabsy2y3 < EPSILON) {
      m1  = -((x2 - x1) / (y2 - y1));
      mx1 = (x1 + x2) / 2.0;
      my1 = (y1 + y2) / 2.0;
      xc  = (x3 + x2) / 2.0;
      yc  = m1 * (xc - mx1) + my1;
    }

    else {
      m1  = -((x2 - x1) / (y2 - y1));
      m2  = -((x3 - x2) / (y3 - y2));
      mx1 = (x1 + x2) / 2.0;
      mx2 = (x2 + x3) / 2.0;
      my1 = (y1 + y2) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
      yc  = (fabsy1y2 > fabsy2y3) ?
        m1 * (xc - mx1) + my1 :
        m2 * (xc - mx2) + my2;
    }

    dx = x2 - xc;
    dy = y2 - yc;
    return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
  }

  function dedup(edges) {
    var i, j, a, b, m, n;

    for(j = edges.length; j; ) {
      b = edges[--j];
      a = edges[--j];

      for(i = j; i; ) {
        n = edges[--i];
        m = edges[--i];

        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
  }

  Delaunay = {
    triangulate: function(vertices, key) {
      var n = vertices.length,
          i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

      /* Bail if there aren't enough vertices to form any triangles. */
      if(n < 3)
        return [];

      /* Slice out the actual vertices from the passed objects. (Duplicate the
       * array even if we don't, though, since we need to make a supertriangle
       * later on!) */
      vertices = vertices.slice(0);

      if(key)
        for(i = n; i--; )
          vertices[i] = vertices[i][key];

      /* Make an array of indices into the vertex array, sorted by the
       * vertices' x-position. */
      indices = new Array(n);

      for(i = n; i--; )
        indices[i] = i;

      indices.sort(function(i, j) {
        return vertices[j][0] - vertices[i][0];
      });

      /* Next, find the vertices of the supertriangle (which contains all other
       * triangles), and append them onto the end of a (copy of) the vertex
       * array. */
      st = supertriangle(vertices);
      vertices.push(st[0], st[1], st[2]);

      /* Initialize the open list (containing the supertriangle and nothing
       * else) and the closed list (which is empty since we havn't processed
       * any triangles yet). */
      open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
      closed = [];
      edges  = [];

      /* Incrementally add each vertex to the mesh. */
      for(i = indices.length; i--; edges.length = 0) {
        c = indices[i];

        /* For each open triangle, check to see if the current point is
         * inside it's circumcircle. If it is, remove the triangle and add
         * it's edges to an edge list. */
        for(j = open.length; j--; ) {
          /* If this point is to the right of this triangle's circumcircle,
           * then this triangle should never get checked again. Remove it
           * from the open list, add it to the closed list, and skip. */
          dx = vertices[c][0] - open[j].x;
          if(dx > 0.0 && dx * dx > open[j].r) {
            closed.push(open[j]);
            open.splice(j, 1);
            continue;
          }

          /* If we're outside the circumcircle, skip this triangle. */
          dy = vertices[c][1] - open[j].y;
          if(dx * dx + dy * dy - open[j].r > EPSILON)
            continue;

          /* Remove the triangle and add it's edges to the edge list. */
          edges.push(
            open[j].i, open[j].j,
            open[j].j, open[j].k,
            open[j].k, open[j].i
          );
          open.splice(j, 1);
        }

        /* Remove any doubled edges. */
        dedup(edges);

        /* Add a new triangle for each edge. */
        for(j = edges.length; j; ) {
          b = edges[--j];
          a = edges[--j];
          open.push(circumcircle(vertices, a, b, c));
        }
      }

      /* Copy any remaining open triangles to the closed list, and then
       * remove any triangles that share a vertex with the supertriangle,
       * building a list of triplets that represent triangles. */
      for(i = open.length; i--; )
        closed.push(open[i]);
      open.length = 0;

      for(i = closed.length; i--; )
        if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
          open.push(closed[i].i, closed[i].j, closed[i].k);

      /* Yay, we're done! */
      return open;
    },
    contains: function(tri, p) {
      /* Bounding box test first, for quick rejections. */
      if((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
         (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
         (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
         (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
        return null;

      var a = tri[1][0] - tri[0][0],
          b = tri[2][0] - tri[0][0],
          c = tri[1][1] - tri[0][1],
          d = tri[2][1] - tri[0][1],
          i = a * d - b * c;

      /* Degenerate tri. */
      if(i === 0.0)
        return null;

      var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
          v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

      /* If we're outside the tri, fail. */
      if(u < 0.0 || v < 0.0 || (u + v) > 1.0)
        return null;

      return [u, v];
    }
  };

  ns.Delaunay = Delaunay;

  if(typeof module !== "undefined")
    module.exports = Delaunay;

})(jQuery, window, window.document, window.app);













(function($, win, doc, ns) {

    "use strict";

    /////////////////////////////////////////////////////////////////
    // Shape class
    /////////////////////////////////////////////////////////////////

    var Shape = function(opt) {
        var opts = opt || {};


        this.width = opts.width || win.innerWidth;
        this.height = opts.height || win.innerHeight;

        this.x = opts.x || 100;
        this.y = opts.y || 100;
        this.baseX = this.x;
        this.baseY = this.y;
        this.direction = opts.direction || Math.random()*10;

        this.points = [];
        this.radius = opts.radius || 3;
        this.basedt = opts.dt || 0;
        this.t = 0;
        this.dt = opts.dt || Math.random()*10/1000;
        this.bezierPoints = {};
        this.color = opts.color || "black";
        this.relative = opts.relative || 0;
        this.denyFill = opts.denyFill || false;

        this.initialize();
    };

    Shape.prototype.initialize = function() {
        for(var i=0; i<3; i++) {
            this.points.push(this.makeNewPoint());
        }
    };

    Shape.prototype.setBezierPosition = function(points) {
        var t = this.t;
        var tp = 1 - this.t;

        this.x = t*t*points.goalX + 2*t*tp*points.controllX + tp*tp*points.beginX;
        this.y = t*t*points.goalY + 2*t*tp*points.controllY + tp*tp*points.beginY;
        this.t += this.dt;
    };

    Shape.prototype.makeNewPoint = function() {
        return {
            x: Math.random()*this.width,
            y: Math.random()*this.height
        };
    };

    Shape.prototype.update = function() {
        var newPoint;
        if(this.t >= 1) {
            this.t = 0;
            this.dt = this.basedt;
            this.points.shift();
            this.points.push(this.makeNewPoint());
        }
        this.setBezierPosition({
            beginX: (this.points[0].x + this.points[1].x) / 2,
            beginY: (this.points[0].y + this.points[1].y) / 2,
            goalX: (this.points[1].x + this.points[2].x) / 2,
            goalY: (this.points[1].y + this.points[2].y) / 2,
            controllX: this.points[1].x,
            controllY: this.points[1].y
        });
    };

    Shape.prototype.simpleUpdate = function() {
        if(this.t >= 1) {
            this.t = 0;
        }
        this.t += this.dt;
        this.x = this.baseX + Math.cos(this.t*Math.PI*2)*this.direction;
        this.y = this.baseY + Math.sin(this.t*Math.PI*2)*this.direction;
    };

    Shape.prototype.getPoints = function() {
        return { x: this.x, y: this.y };
    };

    Shape.prototype.render = function(ctx) {
    };

    ns.Shape = Shape;

})(jQuery, window, window.document, window.app);


















(function($, win, doc, ns){

    "use strict";

    /////////////////////////////////////////////////////////////////
    // Main class
    /////////////////////////////////////////////////////////////////

    var Main = function(opt) {
        opt = opt || {};
        //if(!opt) throw new Error("please input canvas selectors.");

        this.colors = [
            "#FF9B3B", "#FFB166", "#D16600", "#A55100"
        ];

        this.strokeWidth = 2;
        this.randomPointsNum = 80;
        this.outlineLimit = 6;
        this.beginX = 0;
        this.beginY = 0;
        this.ratio = 1;
        this.width = win.innerWidth;
        this.height = win.innerHeight;

        this.initialize();
    };

    Main.prototype.initialize = function(opt) {
        var _self = this;

        this.canvas = doc.getElementById("my-canvas");
        this.$canvas = $("#my-canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.$canvas.width(this.width);
        this.$canvas.height(this.height);
        this.canvas.width = this.width*this.ratio;
        this.canvas.height = this.height*this.ratio;
        this.ctx.scale(this.ratio, this.ratio);

        
        this.canvasBuffer = doc.createElement("canvas");
        this.$canvasBuffer = $(this.canvasBuffer);
        this.ctxBuffer = this.canvasBuffer.getContext("2d");
        
        this.$canvasBuffer.width(this.width);
        this.$canvasBuffer.height(this.height);
        this.canvasBuffer.width = this.width*this.ratio;
        this.canvasBuffer.height = this.height*this.ratio;
        this.ctxBuffer.scale(this.ratio, this.ratio);

       
        this.lines = [];
        this.triangles = [];
        this.shapes = [];
        this.delaunayPoints = [];
        this.points = this.makeRandomPoints();

        this.objectInitialize();
    };

    Main.prototype.getDelaunayIndex = function(num) {
        return num*3;
    };

    Main.prototype.objectInitialize = function() {
        var shape;

        
        for(var p=0, plen=this.points.length; p<plen; p++) {
            shape = new ns.Shape({
                color: "red",
                width: this.canvas.width,
                height: this.canvas.height,
                x: this.points[p][0],
                y: this.points[p][1],
                radius: 4,
                direction: 5*Math.sin(Math.PI*2*Math.random())
            });
            this.shapes.push(shape);
        }
        
    };
    

    Main.prototype.drawTriangles = function() {
        var shape, index, randColor, p1, p2, p3, existsPoints, delaunayPoints;
        this.triangles = [];
        this.lines = [];
        //this.points = [];

        /*
        for(var p=0, plen=this.shapes.length; p<plen; p++) {
            this.points.push([ this.shapes[p].x, this.shapes[p].y ]);
        }
        */

        this.delaunayPoints = ns.Delaunay.triangulate(this.points);

        for(var i=0, len=this.delaunayPoints.length/3; i<len; i++) {
            index = this.getDelaunayIndex(i);

            randColor = this.colors[i%this.colors.length];

            p1 = this.shapes[this.delaunayPoints[index]];
            p2 = this.shapes[this.delaunayPoints[index+1]];
            p3 = this.shapes[this.delaunayPoints[index+2]];

            this.ctxBuffer.save();
                this.ctxBuffer.lineWidth = 1;
                this.ctxBuffer.lineCap = "round";
                this.ctxBuffer.strokeStyle = randColor;
                this.ctxBuffer.fillStyle = randColor;
                this.ctxBuffer.beginPath();
                this.ctxBuffer.moveTo(p1.x, p1.y);
                this.ctxBuffer.lineTo(p2.x, p2.y);
                this.ctxBuffer.lineTo(p3.x, p3.y);
                this.ctxBuffer.closePath();
                this.ctxBuffer.stroke();
                this.ctxBuffer.fill();
            this.ctxBuffer.restore();
        }
    };


    Main.prototype.makeRandomPoint = function() {
        return [
            this.beginX+Math.random()*win.innerWidth,
            this.beginY+Math.random()*win.innerHeight
        ];
    };

    Main.prototype.makeRandomPoints = function() {
        var points = [],
            point;
        for(var i=0; i<this.randomPointsNum; i++) {
            points.push(this.makeRandomPoint());
        }
        return points;
    };


    Main.prototype.update = function() {
        for(var p=0, plen=this.shapes.length; p<plen; p++) {
            this.shapes[p].simpleUpdate();
        }

    };
    
    Main.prototype.render = function() {
        this.reset();
        this.drawTriangles();
        this.ctx.drawImage(                                                                                                                                                                                      
            this.ctxBuffer.canvas,                                                                                                                                                                               
            0, 0,                                                                                                                                                                                                
            this.width*this.ratio, this.height*this.ratio,                                                                                                                                                       
            0, 0,                                                                                                                                                                                                
            this.width, this.height  
        );
    };
    
    Main.prototype.reset = function() {
        this.ctxBuffer.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);                                                                                                                                         
    };


    /**
     * render
     *
     * @return {undefined}
     */
    Main.prototype.run = function() {
        window.requestAnimationFrame = (function(){
            return window.requestAnimationFrame     ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame     ||
                window.oRequestAnimationFrame       ||
                window.msRequestAnimationFrame      ||
                function(callback, element){                                                                                                                                                                 
                    window.setTimeout(callback, 1000 / 60);
                };                                                                                                                                                                                           
        })();

        var _self = this;

        var loop = function() {                                                                                                                                                                              
            _self.update();
            _self.render(); 
            requestAnimationFrame(loop);  
        };
        requestAnimationFrame(loop);  
    };

    ns.Main = Main;
    var Main = new Main();
    Main.run();
    
})(jQuery, window, window.document, window.app);

