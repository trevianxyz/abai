function renderSankey() {

  function colors(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  var colorString = 
  "EF4836F4D03F1BBC9BE26A6A9B59B68775A7BFBFBFC8D0462AB4C04B77BEE87E04E43A45A98B6F26C281ACB5C3F2784B8877A932C5D2E1E5EC578EBE67809F5555554C87B9BFCAD1796799F3C200";

  // exposed variables
  var attrs = {
    id: "ID" + Math.floor(Math.random() * 1000000),  // Id for event handlings
    svgWidth: 400,
    svgHeight: 400,
    marginTop: 15,
    marginBottom: 15,
    marginRight: 15,
    marginLeft: 15,
    max_places: 0,
    nodeWidth: 15,
    nodePadding: 10,
    curvature: 0.5,
    showLabels: true,
    includeValuesInLabel: true,
    fontSize: 13,
    fontWeight: 600,
    container: 'body',
    svgBColor: "#fff",
    svgTransparent: false,
    unit_prefix: "",
    unit_suffix: "",
    nodeBorder: 0,
    separators: { thousands: ",", decimal: "." },
    display_full_precision: true,
    defaultTextFill: '#666',
    defaultFont: 'sans-serif',
    defaultFlowOpacity: 0.3,
    defaultNodeOpacity: 0.8,
    defaultFlowColor: "#666666",
    defaultNodeColor: "#006699",
    flowColorInherit: "source",
    numberOfFlowingPoints: 10000,
    capturer: null,
    numPoints: 2025,
    data: null
  };

  // remove_zeroes: Strip off zeros from after any decimal	
  function remove_zeroes(number_string) {	
    return number_string	
        .replace( /(\.\d*?)0+$/, '$1' )	
        .replace( /\.$/, '');  // If no digits remain, remove the '.' as well.	
  }	
  // fix_separators: given a US-formatted number, replace with user's preferred separators:	
  function fix_separators(n, seps) {	
      // If desired format is not the US default, perform hacky-but-functional swap:	
      return ( seps.thousands !== ","	
          ?  // 3-step swap using ! as the placeholder:	
              n.replace(/,/g, "!")	
              .replace(/\./g, seps.decimal)	
              .replace(/!/g, seps.thousands)	
          : n );	
  }	
  // format_a_value: produce a fully prefixed, suffixed, & separated number for display:	
  function format_a_value(number_in, places, separators, prefix, suffix,	
      display_full_precision) {	
      var number_portion =	
          fix_separators(	
              d3.format( ",." + places + "f" )(number_in),	
              separators );	
      return prefix	
          + ( display_full_precision	
              ? number_portion	
              : remove_zeroes(number_portion) )	
          + suffix;	
  }	
  function units_format(n) {	
      return format_a_value(n,	
          attrs.max_places,  attrs.separators,	
          attrs.unit_prefix, attrs.unit_suffix,	
          attrs.display_full_precision);	
  };

  // rounds numbers at a specific digit after comma
  function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
      return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
      var arr = ("" + num).split("e");
      var sig = ""
      if(+arr[1] + scale > 0) {
        sig = "+";
      }
      return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
  }

  // innerFunctions which will update visuals
  var updateData, playPauseAnimation;

  // main chart object
  var main = function (selection) {
    selection.each(function scope() {
      // calculated properties
      var calc = {}
      calc.id = "ID" + Math.floor(Math.random() * 1000000);  // id for event handlings
      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;
      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

      var colorScale = d3.scaleOrdinal(colors(colorString));

      // flowing points variables
      var pointWidth = 6, 
          points = [],
          duration = 20000, 
          timer,
          intervalId,
          flowingLinkPadding = 6,
          ease = d3.easeLinear;

      // sankey layout
      var sankey = d3.sankey()
        .nodeWidth(attrs.nodeWidth)
        .nodePadding(attrs.nodePadding)
        .size([calc.chartWidth, calc.chartHeight])
        .nodes(attrs.data.nodes)
        .links(attrs.data.links)
        .curvature(attrs.curvature)
        .layout(50)

      // drawing containers
      var container = d3.select(this);

      pickColors();

      var svg = appendSvg();

      var chart = appendChartContainer();
      var flow = sankey.link();
      var gradientLinks = chart.patternify({ tag: "g", selector: "gradient-links" });
      var links = chart.patternify({ tag: "g", selector: "links" });
      var nodes = chart.patternify({ tag: "g", selector: "nodes" });

      var link = appendLinks();
      if (attrs.showLabels) {
          appendLabelsToLinks();
      }
      var node = appendNodes();
      appendNodeRect();
      appendNodeLabels();
      var gradientLink = appendGradientLinks();

      function appendSvg(){
        return container.patternify({ tag: 'svg', selector: 'svg-chart-container' })
                        .attr('width', attrs.svgWidth)
                        .attr('height', attrs.svgHeight)
                        .style("position", "absolute")
                        .attr('font-family', attrs.defaultFont);
      }

      function appendChartContainer(){
        return svg.patternify({ tag: 'g', selector: 'chart' })
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');
      }

      function appendLabelsToLinks(){
        return link.patternify({ tag: 'title', selector: 'link-title', data: d => [d] }) // Make tooltips for FLOWS
            .text(function (d) {
                return d.source.name + " → " + d.target.name;
            });
      }

      function appendLinks(){
        return links.patternify({ tag: "path", selector: "link", data: attrs.data.links })
                      .attr("id", function (d) {
                        return "link-" + d.source.name.replace(/ /g,"_") + "-" + d.target.name.replace(/ /g,"_");
                      })
                      .attr("d", flow)
                      .style("fill", "none")
                      .style("stroke-width", function (d) { return Math.max(1, d.dy); })
                      .style("stroke", function (d) { 
                            return d.direction == 'left-middle' ? d.source.color : d.target.color;

                            // return d.color ? d.color
                            //       : attrs.flowColorInherit == "source" ? d.source.color
                            //       : attrs.flowColorInherit  == "target" ? d.target.color
                            //       : attrs.defaultFlowColor;
                      })
                      .style("stroke-opacity", attrs.defaultFlowOpacity)
                      .on('mouseover', function(d){
                          d3.select(this).style( "stroke-opacity",
                              d.opacity_on_hover
                              || ( ( Number(attrs.defaultFlowOpacity) + 1 ) / 2 ) );
                          })
                      .on('mouseout', function(d){
                          d3.select(this).style( "stroke-opacity",
                              d.opacity || attrs.defaultFlowOpacity );
                          })
                      .sort(function (a, b) { return b.dy - a.dy; });
      }

      function appendGradientLinks () {
        return gradientLinks.patternify({ tag: "path", selector: "gradient-link", data: attrs.data.links })
            .attr("id", function (d) {
              return "gradient-link-" + d.source.name.replace(/ /g,"_") + "-" + d.target.name.replace(/ /g,"_");
            })
            .attr("d", flow)
            .style("fill", "none")
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .style('stroke', function(d) {
              var sourceColor = d.source.color.replace("#", "");
              var targetColor = d.target.color.replace("#", "");
              var id = 'c-' + sourceColor + '-to-' + targetColor;
              if (svg.select('#' + id).empty()) {
                //append the gradient def
                //append a gradient
                var gradient = svg.append('defs')
                  .append('linearGradient')
                  .attr('id', id)
                  .attr('x1', '0%')
                  .attr('y1', '0%')
                  .attr('x2', '100%')
                  .attr('y2', '0%')
                  .attr('spreadMethod', 'pad');

                gradient.append('stop')
                  .attr('offset', '0%')
                  .attr('stop-color', "#" + sourceColor)
                  .attr('stop-opacity', 1);

                gradient.append('stop')
                  .attr('offset', '100%')
                  .attr('stop-color', "#" + targetColor)
                  .attr('stop-opacity', 1);
              }
              return "url(#" + id + ")";
            })
            .style("opacity", 0)
            .attr('stroke-dashoffset', 0)
            .sort(function (a, b) { return b.dy - a.dy; })
            .each(setDash)
      }
      
      function setDash(d) {
        var d3this = d3.select(this);
        var totalLength = d3this.node().getTotalLength();
        d3this
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
      }

      function branchAnimate(nodeData) {
        var gradient_links = svg.selectAll(".gradient-link")
          .filter(function(gradientD) {
            return nodeData.sourceLinks.indexOf(gradientD) > -1
          });

        var nextLayerNodeData = [];
        gradient_links.each(function(d) {
          nextLayerNodeData.push(d.target);
        });

        gradient_links
          .style("opacity", null)
          .transition()
          .duration(400)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on("end", function() {
            nextLayerNodeData.forEach(function(d) {
              branchAnimate(d);
            });
          });
      } //end branchAnimate

      function appendNodes(){
        
        
        return nodes.patternify({ tag: "g", selector: "node", data: attrs.data.nodes })
                      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
                      .on("mouseover", branchAnimate)
                      .on("mouseout", function() {
                        //cancel all transitions by making a new one
                        gradientLink.transition();
                        gradientLink
                          .style("opacity", 0)
                          .each(function(d) {
                            setDash.call(this, d);
                          });
                      })
                      .call(d3.drag()
                              .on("start", function () { 
                                this.parentNode.appendChild(this); })
                              .on("drag", dragmove)
                            );
      }

      function appendNodeRect(){
          return node.patternify({ tag: "rect", selector: "node-rect", data: d => [d] })
              .attr("height", function (d) { return d.dy; })
              .attr("width", attrs.nodeWidth)
              .style("fill", function(d) {
                return d.color;
              })
              .attr( "shape-rendering", "crispEdges" )
              .style("fill-opacity",
                  function (d) {
                      return d.opacity || attrs.defaultNodeOpacity;
                  })
              .style( "stroke-width", attrs.nodeBorder )
              .style( "stroke", function (d) { return d3.rgb(d.color).darker(2); } )
      }

      function appendNodeLabels(){
        return node.patternify({ tag: "text", selector: "node-label", data: d => [d] })
                  .attr("x", -6)
                  .attr("y", function (d) { return d.dy / 2; })
                  .attr("dy", ".35em")
                  .attr("text-anchor", "end")
                  .attr("transform", null)
                  .text(
                      function (d) {
                          return attrs.showLabels
                            ? d.name
                                + ( attrs.includeValuesInLabel && d.direction === 'left'
                                    ? ": " + roundNumber(d.percent, 2) + '%'
                                    : "" )
                            : "";
                      })
                  .style("stroke-width", "0")
                  .style("font-family", attrs.defaultFont)
                  .style("font-size", attrs.fontSize + "px")
                  .style("font-weight", attrs.fontWeight)
                  .style("fill", attrs.defaultTextFill)
                  .filter( function (d) {
                        // If the x-coordinate of the data point is less than half the width
                        // of the graph, relocate the label to begin to the right of the
                        // node.
                        // Adjusted x by a node_width to bias the very middle of the graph
                        // to put labels on the left.
                        return ( d.x + attrs.nodeWidth ) < ( calc.chartWidth / 2 );
                      })
                  .attr("x", 6 + attrs.nodeWidth)
                  .attr("text-anchor", "start");
      }


      // set colors to nodes
      function pickColors() {
        attrs.data.nodes.forEach( function(node) {
              var first_word = ( /^\W*(\w+)/.exec(node.name) || ['','not a word'] )[1];
              node.color = colorScale(first_word);
        });
      }

      // define drag function for use in node definitions
      function dragmove(d) {
          // Calculate new position:
          d.x = Math.max(0, Math.min(calc.chartWidth - d.dx, d3.event.x));
          d.y = Math.max(0, Math.min(calc.chartHeight- d.dy, d3.event.y));
          d3.select(this).attr(
              "transform", "translate(" + d.x + "," + d.y + ")"
          );
          // Recalculate the flows between the links' new positions:
          sankey.relayout();
          // Put that new information in the SVG:
          link.attr("d", flow);
          gradientLink.attr("d", flow);
      }

      // smoothly handle data updating
      updateData = function () {
      }

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
        // if (containerRect.height > 0)
        //   attrs.svgHeight = containerRect.height;
      }

      handleWindowResize();
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

  // dynamic keys functions
  Object.keys(attrs).forEach(key => {
    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { return eval(` attrs['${key}'];`); }
      eval(string);
      return main;
    };
  });

  main.reverseGraph = function() {
    // reverse the links
    attrs.data.links.map(function(d){
      var tmp = d.source;
      d.source = d.target;
      d.target = tmp;
      return d;
    });
    // flip the colors
    attrs.flowColorInherit = attrs.flowColorInherit == 'target' ? 'source' : 'target';
    return main;
  }

  main.playPauseAnimation = function(play){
    if (typeof playPauseAnimation === "function"){
      playPauseAnimation(play);
    }
  };

  // set attrs as property
  main.attrs = attrs;

  // exposed update functions
  main.data = function (value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === 'function') {
      updateData();
    }
    return main;
  }

  // draw  visual
  main.draw = function () {
    d3.selectAll(attrs.container).call(main);
    return main;
  }

  return main;
}
