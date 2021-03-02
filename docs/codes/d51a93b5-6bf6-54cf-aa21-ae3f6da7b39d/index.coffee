(($, win, doc) ->
    
  'use strict' 
    
  class Main
        
    constructor: ->
      @width = win.innerWidth
      @height = win.innerHeight

      @initialize()
    
    initialize: ->
      @canvas = doc.getElementById('my-canvas')
      
      @ctx = @canvas.getContext("2d")
      @canvas.width = @width
      @canvas.height = @height
      @ctx.strokeStyle = "#fff"
      
      @run()
        
    clear: (ctx)->
      ctx.clearRect 0, 0, @width, @height
    
    render: ->
      @ctx.beginPath()
      @ctx.moveTo 100, 100
      @ctx.lineTo 300, 300
      @ctx.stroke()
      @ctx.closePath()
    
    run: ->        
      @render()
            
  main = new Main
    
) jQuery, window, window.document