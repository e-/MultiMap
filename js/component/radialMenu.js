define(['model/node', 'd3'], function(Node){
  function translate(x, y){
    return 'translate(' + x + ',' + y + ')';
  }
  
  function disabled(){
    d3.event.preventDefault();
  }

  function deg2rad(x){
    return x / 180 * Math.PI;
  }

  function rad2deg(x){
    return x * 180 / Math.PI;
  }

  d3.svg.radialMenu = function(){
    var arc,
        outerRadius = 230,
        innerRadius = 40,
        labelRadius = 220,
        startAngle = Math.PI * 0.35,
        endAngle = Math.PI * 0.65,
        deltaAngle = (endAngle - startAngle) / Node.Attributes.length,
        g,
        gs,
        center,
        centerIcon,
        arcs,
        visible = false,
        labels;

    function menu(){
      arc = d3.svg.arc()
              .outerRadius(outerRadius)
              .innerRadius(innerRadius);
      
      Node.Attributes.forEach(function(attr){
        attr.startAngle = 0;
        attr.endAngle = deltaAngle;
      });

      g = this.append('g');
      
      gs = g
        .selectAll('g')
        .data(Node.Attributes)
        .enter().append('g')
      ;
      
      arcs = 
      gs
        .append('path')
        .attr('d', arc)
        .style('fill', 'white')
        .style('opacity', 0.9)
        .attr('stroke', '#aaa')
        .attr('stroke-width', '2px')
        .attr('stroke-opacity', 0.8)
        .on('mouseover', function(){
          d3.select(this).transition().duration(150).style('opacity', 1);
        })
        .on('mouseout', function(){
          d3.select(this).transition().duration(150).style('opacity', 0.9);
        })
        .on('contextmenu', function(){menu.hide(); d3.event.preventDefault();});
      ;

      g.attr('transform', translate(500, 500));

      labels = gs
          .append('text')
          .attr('class', 'label')
          .text(function(attr){return attr.realName;})
          .style('font-size', '0.9em')
          .style('text-anchor', 'end')
          .attr('transform', function(attr){
            var angle = deltaAngle / 2 - Math.PI / 2,
                x = labelRadius * Math.cos(angle),
                y = labelRadius * Math.sin(angle);
            
            return 'translate(' + x + ', ' + y + ') rotate(' + rad2deg(angle) + ')';
          });

      center = 
      g
        .append('circle')
        .attr('fill', 'white')
        .attr('stroke', '#aaa')
        .attr('stroke-width', '2px')
        .attr('stroke-opacity', 0.8)
        .style('opacity', 0.9)
        .on('click', function(){
          menu.hide();
        })
        .on('contextmenu', function(){menu.hide(); d3.event.preventDefault();});

        
      centerIcon = g.append('text').text('\ue014').style('font-family', 'Glyphicons Halflings').attr('font-size', '3em');

      g.style('display', 'none');
      menu.hide();
      //menu.show();
    }

    function arcTransition(transition, status){
      var show = status == 'show';

      transition.attrTween('transform', function(d, i){
        var i = d3.interpolate(
          show ? startAngle : startAngle + deltaAngle * i, 
          show ? startAngle + deltaAngle * i : startAngle
        )
        ;

        return function(t){
          var angle = i(t); // - Math.PI / 2;
          return 'rotate(' + rad2deg(angle) + ')';
        }
      });
    }

    menu.show = function(x, y){
      g
        .attr('transform', translate(x, y))
        .style('display', 'inline')
        .transition()
          .style('opacity', 1);
      
      center  
        .transition()
          .attr('r', innerRadius)

      gs
        .transition()
          .call(arcTransition, 'show');

      visible = true;
    };

    menu.hide = function(){
      center 
        .transition()
        .attr('r', 0)
      ;

      gs
        .transition()
        .call(arcTransition, 'hide')

      g
        .transition()
        .style('opacity', 0)
          .each('end', function(){
            g.style('display', 'none');
          });

      visible = false;
    };  

    menu.toggle = function(x, y){
      if(visible) menu.hide();
      else menu.show(x, y);
    };

    return menu;
  };
});
