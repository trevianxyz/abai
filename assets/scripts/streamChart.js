function renderStreamChart(params) {

  function colors(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  var colorString = 
  "EF4836F4D03F1BBC9BE26A6A9B59B68775A72AB4C04B77BEE87E04E43A45A98B6F26C281ACB5C3F2784B8877A932C5D2E1E5EC578EBE67809F5555554C87B9BFCAD1796799F3C200";


  // Exposed variables
  var attrs = {
    id: "ID" + Math.floor(Math.random() * 1000000),  // Id for event handlings
    svgWidth: 400,
    svgHeight: 400,
    marginTop: 5,
    marginBottom: 25,
    marginRight: 5,
    marginLeft: 45,
    container: 'body',
    defaultTextFill: '#2C3E50',
    defaultFont: 'Helvetica',
    data: null
  };


  //InnerFunctions which will update visuals
  var updateData;
  var filteredAreas = [];
  var allKeys = [];

  //Main chart object
  var main = function (selection) {
    selection.each(function scope() {

      //Calculated properties
      var calc = {}
      calc.id = "ID" + Math.floor(Math.random() * 1000000);  // id for event handlings
      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;
      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
      
      let years = attrs.data.map(d => d.year)
      let keys = d3.keys(attrs.data[0]).filter(x => x != "year" && !x.includes("(descr)"));
      let descriptionKeys = d3.keys(attrs.data[0]).filter(x => x.includes("(descr)"));

      allKeys = keys;

      keys = keys.filter(x => filteredAreas.indexOf(x) == -1);

      let stack = d3.stack()
        .keys(keys)
        //.offset(d3.stackOffsetWiggle)
        //.order(d3.stackOrderDescending);

      let layers = stack(attrs.data);

      let color = d3.scaleOrdinal(colors(colorString)).domain(allKeys);

      let xScale = d3.scaleBand().domain(years).range([0, calc.chartWidth]);

      let yScale = d3.scaleLinear()
        .domain([
          d3.min(layers, l => d3.min(l, d => d[0])),
          d3.max(layers, l => d3.max(l, d => d[1]))
        ])
        .range([calc.chartHeight, 0])

      let xAxis = d3.axisBottom(xScale);

      let area = d3.area()
      .curve(d3.curveBasis)
      .x(d => xScale(d.data.year) + xScale.bandwidth() / 2)
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))

      var buttons = d3.select('#buttons');

      buttons.patternify({ tag: 'button', selector: 'button', data: allKeys })
        .style('background-color', d => {
          if (filteredAreas.indexOf(d) == -1) {
            return color(d)
          } else {
            return '#ccc'
          }
        })
        .style('margin-left', '5px')
        .attr('data-key', d => d)
        .text(x => x)
        .on('click', function(d, i) {
          if (filteredAreas.indexOf(d) > -1) {
            let index = filteredAreas.indexOf(d);
            filteredAreas.splice(index, 1);
            d3.select(this).style('background-color', color(d));
          } else {
            filteredAreas.push(d);
            d3.select(this).style('background-color', '#ccc')
            d3.select('#infoBoardRight').select('div#board-' + i).remove()
          }
          
          main.run();
        })

      //Drawing containers
      var container = d3.select(this);

      //Add svg
      var svg = container.patternify({ tag: 'svg', selector: 'svg-chart-container' })
        .attr('width', attrs.svgWidth)
        .attr('height', attrs.svgHeight)
        .attr('font-family', attrs.defaultFont);

      //Add container g element
      var chart = svg.patternify({ tag: 'g', selector: 'chart' })
        .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');
      
      chart.patternify({ tag: 'g', selector: 'xAxisGroup' })
        .attr('transform', 'translate(' + (0) + ',' + calc.chartHeight + ')')
        .classed('axis', true)
        .call(xAxis);
      
      chart.patternify({ tag: 'path', selector: 'stream', data: layers })
        .attr('fill', (d, i) => color(d.key))
        .attr('cursor', 'pointer')
        .on('click', function (d, i) {
          if (!document.getElementById('board-' + i)) {

            let infoBoard = d3.select('#infoBoardRight');

            let descr = descriptionKeys.filter(x => x.includes(d.key))

            infoBoard.append('div')
                .style('color', color(d.key))
                .attr('id', 'board-' + i)
                .text(attrs.data[0][descr[0]])
            }
        })
        .transition()
        .duration(1500)
        .attr('d', area)

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