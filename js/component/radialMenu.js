define([
'jquery',
'model/node', 
'chart/main',
'd3'], function($, Node, Chart){
  var screenHeight = $(window).height(),
      screenWidth = $(window).width()
      ;

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

  d3.svg.radialMenu = function(onClick){
    var arc,
        arc2,
        outerRadius = 230,
        innerRadius = 40,
        labelRadius = 220,
        typeRadius = 300,
        startAngle = Math.PI * 0.35,
        endAngle = Math.PI * 0.65,
        deltaAngle = (endAngle - startAngle) / Node.Attributes.length,
        deltaAngle2 = (endAngle - startAngle) / Chart.Types.length,
        g,
        gs,
        gs2,
        center,
        centerIcon,
        arcs,
        arcs2,
        visible = false,
        labels;

    function menu(){
      arc = d3.svg.arc()
              .outerRadius(outerRadius)
              .innerRadius(innerRadius);
      arc2 = d3.svg.arc() 
              .outerRadius(typeRadius)
              .innerRadius(outerRadius)
      ;

      Node.Attributes.forEach(function(attr, i){
        attr.startAngle = 0;
        attr.endAngle = deltaAngle;
        attr.subStartAngle = i * deltaAngle;
      });
        
      Chart.Types.forEach(function(type){
        type.startAngle = 0;
        type.endAngle = deltaAngle2;
      });

      g = this.append('g');
      
      gs = g
        .selectAll('g.attr')
        .data(Node.Attributes)
        .enter().append('g').attr('class', 'attr')
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
        .on('mouseover', function(attr){
          d3.select(this).transition().duration(150).style('opacity', 1);
          menu.showSub(attr);
        })
        .on('mouseout', function(){
          d3.select(this).transition().duration(150).style('opacity', 0.9);
        })
        .on('click', function(attr){
          menu.hide();

          onClick(attr, attr.charts[0].chart);
        })
        .on('contextmenu', function(){menu.hide(); d3.event.preventDefault();});
      ;
      
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

    function arcTransition(transition, status, startAngle, delta){
      var show = status == 'show';

      transition.attrTween('transform', function(d, i){
        var i = d3.interpolate(
          show ? startAngle : startAngle + delta * i, 
          show ? startAngle + delta * i : startAngle
        )
        ;

        return function(t){
          var angle = i(t); // - Math.PI / 2;
          return 'rotate(' + rad2deg(angle) + ')';
        }
      });
    }

    menu.show = function(x, y, node, mmap){
      if(y < 100)
        startAngle = Math.PI / 2;
      else if(screenHeight - 100 < y)
        startAngle = Math.PI / 2 - deltaAngle * Node.Attributes.length;
      else startAngle = Math.PI * 0.35;
      
      if(screenWidth - 200 < d3.event.x) {
        startAngle = Math.PI;
        if(screenHeight - 200 < y) {
          startAngle = Math.PI * 2 - deltaAngle * Node.Attributes.length;
        }
      }

      if(!node.children.length) return;
      node.isSelected = true;
      menu.node = node;
      menu.mmap = mmap;
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
          .call(arcTransition, 'show', startAngle, deltaAngle);

      menu.hideSub();
      visible = true;
    };

    menu.hide = function(){
      if(menu.node)menu.node.isSelected = false;
      center 
        .transition()
        .attr('r', 0)
      ;

      gs
        .transition()
        .call(arcTransition, 'hide', startAngle, deltaAngle)


      g
        .transition()
        .style('opacity', 0)
          .each('end', function(){
            g.style('display', 'none');
          });

      visible = false;
      menu.hideSub();
    };  
   
    menu.showSub = function(attr){
      gs2 = g
        .selectAll('g.type')
        .data(attr.charts, function(d){return d.name;})

      var enter = 
      gs2
        .enter()  
          .append('g')
          .attr('class', 'type');
      
      enter
        .append('path')
          .style('fill', 'white')
          .style('opacity', 0.9)
          .attr('stroke', '#aaa')
          .attr('stroke-width', '2px')
          .attr('stroke-opacity', 0.8)
          .on('click', function(chart){
            menu.hide();
            onClick(attr, chart.chart);
          })

      enter
        .append('path')
          .attr('d', function(chart){return chart.d;})
          .attr('shape-rendering', 'optimizeQuality') 
          .attr('opacity', 0.9)
          .attr('pointer-events', 'none')
          .attr('transform', function(chart){
            var center = arc2.centroid(chart),
                tr = translate(center[0], center[1]);
            if(chart.transform)
              tr += chart.transform;
            return tr;
          });

            
      arcs2 = gs2
        .select('path')
        .attr('d', arc2)
        .on('mouseover', function(){
          d3.select(this).transition().duration(150).style('opacity', 1);
        })
        .on('mouseout', function(){
          d3.select(this).transition().duration(150).style('opacity', 0.9);
        })
        .on('contextmenu', function(){menu.hide(); d3.event.preventDefault();});
      ;

      gs2
        .transition()
          .call(arcTransition, 'show', startAngle +  attr.subStartAngle, deltaAngle2);
      

      gs2.exit().remove();
    }

    menu.hideSub = function(){
      if(gs2)
        gs2
          .transition()
          .attr('opacity', 0)

  /*    gs2
        .transition()
        .call(arcTransition, 'hide', deltaAngle2)
*/
    };

    menu.toggle = function(x, y, node, mmap){
      if(visible) menu.hide();
      else menu.show(x, y, node, mmap);
    };

    return menu;
  };
});
