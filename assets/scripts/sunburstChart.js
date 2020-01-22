function renderChart(params) {

  function colors(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  var colorString = "4C87B9F4D03F1BBC9BE26A6A9B59B68775A7BFBFBFC8D0462AB4C04B77BEE87E04E43A458775A7A98B6F";

  // Exposed variables
  var attrs = {
    id: "ID" + Math.floor(Math.random() * 1000000),  // Id for event handlings
    svgWidth: 400,
    svgHeight: 400,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    container: 'body',
    defaultTextFill: '#2C3E50',
    defaultFont: 'Helvetica',
    data: null
  };


  //InnerFunctions which will update visuals
  var updateData;

  //Main chart object
  var main = function (selection) {
    selection.each(function scope() {
      var scales, 
          layouts,
          userControls,
          formats,
          radius,
          tooltip,
          sunburst,
          title;

      //Calculated properties
      var calc = {}
      calc.id = "ID" + Math.floor(Math.random() * 1000000);  // id for event handlings
      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;
      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

      //Drawing containers
      var container = d3.select(this);

      //Add svg
      var svg = container.patternify({ tag: 'svg', selector: 'svg-chart-container' })
        .attr('width', attrs.svgWidth)
        .attr('height', attrs.svgHeight)
        .attr('font-family', attrs.defaultFont)
        .attr('overflow', 'visible');

      //Add container g element
      var chart = svg.patternify({ tag: 'g', selector: 'chart' })
        .attr('transform', 'translate(' + (calc.chartWidth / 2) + ',' + (calc.chartHeight / 2) + ')');

      //var trail = initializeBreadcrumbTrail();

      formats = {
        formatNumber: d3.format(",d")
      };

      tooltip = d3.componentsTooltip()
                    .container(svg)
                    .textColor("#fff")
                    .content([
                      {
                        left: "",
                        right: "{text}"
                      }
                    ]);

      radius = getRadius();

      scales = {
        x: d3.scaleLinear().range([0, 2 * Math.PI]),
        y: d3.scaleSqrt().range([0, radius]),
        color: d3.scaleOrdinal(colors(colorString)) 
      }

      layouts = {
        partition: d3.partition(),
        arc: d3.arc()
              .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, scales.x(d.x0))); })
              .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, scales.x(d.x1))); })
              .innerRadius(function(d) { return Math.max(0, scales.y(d.y0)); })
              .outerRadius(function(d) { return Math.max(0, scales.y(d.y1)); })
      }

      userControls = {
        drillDown: function(d) {
          chart.transition()
              .duration(750)
              .tween("scale", function() {
                var xd = d3.interpolate(scales.x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(scales.y.domain(), [d.y0, 1]),
                    yr = d3.interpolate(scales.y.range(), [d.y0 ? 20 : 0, radius]);

                return function(t) { 
                  scales.x.domain(xd(t)); 
                  scales.y.domain(yd(t)).range(yr(t)); 
                };
              })
              .selectAll("path")
              .attrTween("d", function(d) { 
                if(!d) {
                  return;
                }
                return function() 
                  { return layouts.arc(d); }; 
                });

          if (d.data.data.ID == 0) {
            title.attr('opacity', 1)
          } else {
            title.attr('opacity', 0)
          }
        },
        showInfo: function(d) {

          let infoBoardLeft = d3.select('#infoBoardLeft').html('');
          let infoBoardRight = d3.select('#infoBoardRight').html('');

          if (d.data.data.name.length) {
            infoBoardLeft.append('div')
              .style('color', scales.color((d.children ? d : d.parent).data.data.name))
              .html(d.data.data.name)
              .attr('id', `board-left-${d.data.data.ID}`);
          }

          if (d.data.data.Text.length) {
            infoBoardRight.append('div')
              .style('color', scales.color((d.children ? d : d.parent).data.data.name))
              .html(d.data.data.Text)
              .attr('id', `board-right-${d.data.data.ID}`);
          }
        },
        mouseover: function(d){
          // let sequenceArray = d.ancestors().reverse().shift();
          // updateBreadcrumbs(sequenceArray, "10%")

          var arcCenter = layouts.arc.centroid(d);
          var x = attrs.svgWidth / 2 + arcCenter[0];
          var y = attrs.svgHeight / 2 + arcCenter[1];
          var direction = "bottom";
          if (y - 50 < 0)
          {
            direction = "top";
          }
          else if (x > attrs.svgWidth / 2){
            direction = "right";
          }
          else if (x < attrs.svgWidth / 2){
            direction = "left";
          }
          tooltip
               .x(x)
               .y(y)
               .tooltipFill(scales.color((d.children ? d : d.parent).data.data.name))
               .direction(direction)
               .show({ text: d.data.data.name });

          userControls.showInfo(d);
        },
        mouseout: function(d){
          tooltip.hide();
          d3.select('#infoBoardLeft').html('');
          d3.select('#infoBoardRight').html('');
        }
      }
      
      sunburst = drawSunburst();
      title = drawRootTitle();
      
      function drawSunburst() {
        var root = d3.hierarchy(attrs.data).sum(function(d) {
          if (!d.children) return 1000;
        });
        
        return chart.patternify({ tag: 'path', selector: 'slice', data: layouts.partition(root).descendants() })
            .attr("d", layouts.arc)
            .attr('id', d => `slice-${d.data.data.ID}`)
            .style("fill", function(d) { return scales.color((d.children ? d : d.parent).data.data.name); })
            .on('click', userControls.drillDown)
            .on("mouseover", userControls.mouseover)
            .on("mouseout", userControls.mouseout)
       }

       function drawRootTitle() {
        let wrapWidth = d3.select('path#slice-0').node().getBoundingClientRect().width - 20;

        return chart.patternify({ tag: 'text', selector: 'title' })
          .attr('text-anchor', 'middle')
          .text(attrs.data.data.name)
          .attr('fill', '#fff')
          .attr('dy', 0)
          .attr('y', 0)
          .call(wrap, wrapWidth)
       }

       function initializeBreadcrumbTrail() {
          // Add the svg area.
          var trail = d3.select("#sequence")
              .patternify({ tag: 'svg', selector: 'sequence-svg' })
              .attr("width", radius * 2)
              .attr("height", 50)
              .attr("id", "trail");

          // Add the label at the end, for the percentage.
          trail.patternify({ tag: 'text', text: 'end-label' })
            .attr("id", "endlabel")
            .style("fill", "#000");

          return trail;
      }

      // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
      var b = {
        w: 75, h: 30, s: 3, t: 10
      };

      // Generate a string that describes the points of a breadcrumb polygon.
      function breadcrumbPoints(d, i) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
          points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
      }

      // Update the breadcrumb trail to show the current sequence and percentage.
      function updateBreadcrumbs(nodeArray, percentageString) {

        // Data join; key function combines name and depth (= position in sequence).
        var trail = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function(d) { return d.data.name + d.depth; });

        // Remove exiting nodes.
        trail.exit().remove();

        // Add breadcrumb and label for entering nodes.
        var entering = trail.enter().append("svg:g");

        entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function(d) { return colors[d.data.name]; });

        entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.data.name; });

        // Merge enter and update selections; set position for all nodes.
        entering.merge(trail).attr("transform", function(d, i) {
          return "translate(" + i * (b.w + b.s) + ", 0)";
        });

        // Now move and update the percentage at the end.
        d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select("#trail")
            .style("visibility", "");

      }

      // private functions
      function getRadius(){
        return (Math.min(calc.chartWidth / 2, calc.chartHeight / 2));
      }

      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }

      // Smoothly handle data updating
      updateData = function () {

      }

      handleWindowResize();


      //#########################################  UTIL FUNCS ##################################
      function handleWindowResize() {
        d3.select(window).on('resize.' + attrs.id, function () {
          setDimensions();
        });
      }


      function setDimensions() {
        setSvgWidthAndHeight();
        container.call(main);
      }

      function setSvgWidthAndHeight() {
        var containerRect = container.node().getBoundingClientRect();
        if (containerRect.width > 0)
          attrs.svgWidth = containerRect.width;
      }


      function debug() {
        if (attrs.isDebug) {
          //Stringify func
          var stringified = scope + "";

          // Parse variable names
          var groupVariables = stringified
            //Match var x-xx= {};
            .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
            //Match xxx
            .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
            //Get xxx
            .map(v => v[0].trim())

          //Assign local variables to the scope
          groupVariables.forEach(v => {
            main['P_' + v] = eval(v)
          })
        }
      }
      debug();
    });
  };

  //----------- PROTOTYEPE FUNCTIONS  ----------------------
  d3.selection.prototype.patternify = function (params) {
    var container = this;
    var selector = params.selector;
    var elementTag = params.tag;
    var data = params.data || [selector];

    // Pattern in action
    var selection = container.selectAll('.' + selector).data(data, (d, i) => {
      if (typeof d === "object") {
        if (d.id) {
          return d.id;
        }
      }
      return i;
    })
    selection.exit().remove();
    selection = selection.enter().append(elementTag).merge(selection)
    selection.attr('class', selector);
    return selection;
  }

  //Dynamic keys functions
  Object.keys(attrs).forEach(key => {
    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { return eval(` attrs['${key}'];`); }
      eval(string);
      return main;
    };
  });

  //Set attrs as property
  main.attrs = attrs;

  //Debugging visuals
  main.debug = function (isDebug) {
    attrs.isDebug = isDebug;
    if (isDebug) {
      if (!window.charts) window.charts = [];
      window.charts.push(main);
    }
    return main;
  }

  //Exposed update functions
  main.data = function (value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === 'function') {
      updateData();
    }
    return main;
  }

  // Run  visual
  main.run = function () {
    d3.selectAll(attrs.container).call(main);
    return main;
  }

  return main;
}
