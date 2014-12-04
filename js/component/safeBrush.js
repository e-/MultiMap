define(['d3'], function(){
  var THRESHOLD = 5;

  d3.svg.safeBrush = function(){
    var x = d3.scale.linear(),
        y = d3.scale.linear(),
        rect,
        startX,
        startY,
        brushing = false,
        handlers = {}
    ;

    function brush(){
      rect = this.append('rect').attr('fill', 'black').attr('opacity', 0.3).attr('pointer-events','none');

      this
        .on('mousedown', function(){
          if(d3.event.which != 1) return;
          startX = d3.event.offsetX;
          startY = d3.event.offsetY;
          rect.style('display', 'inline').attr('width', 0).attr('height', 0);
          brushing = true;
        })
        .on('mousemove', function(){
          if(d3.event.which != 1) return;
          if(brushing) {
            var endX = d3.event.offsetX,
                endY = d3.event.offsetY,
                x = Math.min(startX, endX),
                y = Math.min(startY, endY),
                width = Math.abs(endX - startX),
                height = Math.abs(endY - startY)
            
            rect
              .attr('x', x)
              .attr('y', y)
              .attr('width', width)
              .attr('height', height)
            
            if(handlers['brush']) {
              handlers['brush'](x, y, x + width, y + height);
            }
          }
        })
        .on('mouseup', function(){
          if(d3.event.which != 1) return;
          brushing = false;
          var endX = d3.event.offsetX,
              endY = d3.event.offsetY
              ;
/*          if(Math.abs(startX - endX) < THRESHOLD || Math.abs(startY - endY) < THRESHOLD)*/
          rect.style('display', 'none');
        })
      ;
    }

    brush.x = function(value){
      x = value;
      return brush;
    };

    brush.y = function(value){
      y = value;
      return brush;
    };

    brush.on = function(event, handler) {
      handlers[event] = handler;
      return brush;
    }

    return brush;
  };
});
