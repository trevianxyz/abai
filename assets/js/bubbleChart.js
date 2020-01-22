function renderBubbleChart(params) {

    // Exposed variables
    var attrs = {
      id: "ID" + Math.floor(Math.random() * 1000000),  // Id for event handlings
      svgWidth: 400,
      svgHeight: 400,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 5,
      marginLeft: 5,
      bubbleMinRadius: 20,
      bubbleMaxRadius: 30,
      container: 'body',
      data: null
    };


    //InnerFunctions which will update visuals
    var updateData;

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

        let focusedNode;

        let pack = d3.pack()
	        .size([calc.chartWidth, calc.chartHeight])
            .padding(1.5);

        let forceCollide = d3.forceCollide(d => d.r + 1);

        // ###### scales ######
        var scaleColor = d3.scaleOrdinal(d3.schemeSet3);

        let root = d3.hierarchy({ children: attrs.data })
            .sum(() => attrs.bubbleMaxRadius);

        // we use pack() to automatically calculate radius conveniently only
        // and get only the leaves
        let nodes = pack(root).leaves().map(node => {
            const data = node.data;
            return {
                x: (node.x - calc.chartWidth / 2) * 3, // magnify start position to have transition to center movement
                y: (node.y - calc.chartHeight / 2) * 3,
                r: 0, // for tweening
                radius: node.r,
                cat: data.Sector,
                name: data['Company Name'],
                desc: data['Text'],
                logo: '/assets/img/logos/' + data.logo,
                id:  data['Company Name'].replace(/ /g, '-')
            };
        });

        // ###### layouts #######
        var simulation = d3.forceSimulation(nodes)
              .force("collide", forceCollide)
              .force('charge', d3.forceManyBody())
              .force("x", d3.forceX().strength(0.05))
              .force("y", d3.forceY().strength(0.05))
              .on("tick", ticked);

        //Drawing containers
        var container = d3.select(this);

        //Add svg
        var svg = container.patternify({ tag: 'svg:svg', selector: 'svg-chart-container' })
          .attr("width", attrs.svgWidth)
          .attr("height", attrs.svgHeight)

        //Add container g element
        var chart = svg.patternify({ tag: 'g', selector: 'chart' })
          .attr('transform', 'translate(' + (calc.chartLeftMargin + calc.chartWidth / 2) + ',' + (calc.chartTopMargin + calc.chartHeight / 2) + ')');

        //Add legend container
        var legend = svg.patternify({ tag: 'g', selector: 'legend' })
          .attr('transform', `translate(${calc.chartLeftMargin}, ${calc.chartTopMargin})`)

        var node = chart.patternify({ tag: 'g', selector: 'node', data: nodes })
                        .call(d3.drag()
                            .on('start', (d) => {
                                if (!d3.event.active) { simulation.alphaTarget(0.2).restart(); }
                                d.fx = d.x;
                                d.fy = d.y;
                            })
                            .on('drag', (d) => {
                                d.fx = d3.event.x;
                                d.fy = d3.event.y;
                            })
                            .on('end', (d) => {
                                if (!d3.event.active) { simulation.alphaTarget(0); }
                                d.fx = null;
                                d.fy = null;
                            }));

        node.patternify({ tag: 'circle', selector: 'bubble', data: d => [d] })
            .attr('r', 0)
            .style('fill', d => scaleColor(d.cat))
            .attr('id', d => d.id)
            .transition().duration(2000).ease(d3.easeElasticOut)
                .tween('circleIn', (d) => {
                    let i = d3.interpolateNumber(0, d.radius);
                    return (t) => {
                        d.r = i(t);
                        simulation.force('collide', forceCollide);
                    };
                });

        node.append('clipPath')
                .attr('id', d => `clip-${d.id}`)
                .append('use')
                .attr('xlink:href', d => `#${d.id}`);

        node.patternify({ tag: 'image', selector: 'node-icon', data: d => [d] })
            .attr('clip-path', d => `url(#clip-${d.id})`)
            .attr('xlink:href', d => d.logo)
            .attr('x', d => -d.radius * 0.7)
            .attr('y', d => -d.radius * 0.7)
            .attr('height', d => d.radius * 2 * 0.7)
            .attr('width', d => d.radius * 2 * 0.7);

        let infoBox = node.patternify({ tag: 'foreignObject', selector: 'circle-overlay', data: d => [d] })
            .classed('hidden', true)
                .attr('x', -350 * 0.5 * 0.8)
                .attr('y', -350 * 0.5 * 0.8)
                .attr('height', 350 * 0.8)
                .attr('width', 350 * 0.8)
                    .append('xhtml:div')
                    .classed('circle-overlay__inner', true);

            infoBox.patternify({ tag: 'h2', selector: 'circle-overlay__title', data: d => [d] })
                .text(d => d.name);

            infoBox.patternify({ tag: 'p', selector: 'circle-overlay__body', data: d => [d] })
                .html(d => d.desc);


            node.on('click', (currentNode) => {
                d3.event.stopPropagation();

                let currentTarget = d3.event.currentTarget; // the <g> el

                if (currentNode === focusedNode) {
                    // no focusedNode or same focused node is clicked
                    return;
                }
                let lastNode = focusedNode;
                focusedNode = currentNode;

                simulation.alphaTarget(0.2).restart();

                // hide all circle-overlay
                d3.selectAll('.circle-overlay').classed('hidden', true);
                d3.selectAll('.node-icon').classed('node-icon--faded', false);

                // don't fix last node to center anymore
                if (lastNode) {
                    lastNode.fx = null;
                    lastNode.fy = null;
                    node.filter((d, i) => i === lastNode.index)
                        .transition().duration(2000).ease(d3.easePolyOut)
                        .tween('circleOut', () => {
                            let irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
                            return (t) => {
                                lastNode.r = irl(t);
                            };
                        })
                        .on('interrupt', () => {
                            lastNode.r = lastNode.radius;
                        });
                }

                d3.transition().duration(2000).ease(d3.easePolyOut)
                    .tween('moveIn', () => {
                        let ix = d3.interpolateNumber(currentNode.x, 0);
                        let iy = d3.interpolateNumber(currentNode.y, 0);
                        let ir = d3.interpolateNumber(currentNode.r, calc.chartHeight / 2 * 0.5);
                        return function (t) {
                            // console.log('i', ix(t), iy(t));
                            currentNode.fx = ix(t);
                            currentNode.fy = iy(t);
                            currentNode.r = ir(t);
                            simulation.force('collide', forceCollide);
                        };
                    })
                    .on('end', () => {
                        simulation.alphaTarget(0);
                        let $currentGroup = d3.select(currentTarget);
                        $currentGroup.select('.circle-overlay')
                            .classed('hidden', false);
                        $currentGroup.select('.node-icon')
                            .classed('node-icon--faded', true);

                    })
                    .on('interrupt', () => {
                        currentNode.fx = null;
                        currentNode.fy = null;
                        simulation.alphaTarget(0);
                    });

            });

            // blur
            d3.select(document).on('click', () => {
                let target = d3.event.target;
                // check if click on document but not on the circle overlay
                if (!target.closest('#circle-overlay') && focusedNode) {
                    focusedNode.fx = null;
                    focusedNode.fy = null;
                    simulation.alphaTarget(0.2).restart();
                    d3.transition().duration(2000).ease(d3.easePolyOut)
                        .tween('moveOut', function () {
                            console.log('tweenMoveOut', focusedNode);
                            let ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
                            return function (t) {
                                focusedNode.r = ir(t);
                                simulation.force('collide', forceCollide);
                            };
                        })
                        .on('end', () => {
                            focusedNode = null;
                            simulation.alphaTarget(0);
                        })
                        .on('interrupt', () => {
                            simulation.alphaTarget(0);
                        });

                    // hide all circle-overlay
                    d3.selectAll('.circle-overlay').classed('hidden', true);
                    d3.selectAll('.node-icon').classed('node-icon--faded', false);
                }
            });

        let legendItems = legend.patternify({
            tag: 'g',
            selector: 'legend-item',
            data: attrs.data.map(d => d.Sector).filter((value, index, self) => {
                return self.indexOf(value) === index;
            })
        })
        .attr('transform', (d, i) => `translate(0, ${i * 25})`)

        legendItems.patternify({ tag: 'circle', selector: 'legend-item-circle', data: d => [d] })
            .attr('r', 10)
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('fill', d => scaleColor(d))

        legendItems.patternify({ tag: 'text', selector: 'legend-item-text', data: d => [d] })
            .attr('x', 30)
            .attr('y', 16)
            .text(d => d)
            .attr('fill', '#2a2a2a')

        function ticked() {
            node
                .attr('transform', d => `translate(${d.x},${d.y})`)
                .select('circle')
                    .attr('r', d => d.r);
        }

        //RESPONSIVENESS
         d3.select(window).on('resize.' + attrs.id, function () {
          setDimensions();
         });

        function setDimensions() {
          var width = container.node().getBoundingClientRect().width;
          main.svgWidth(width);
          container.call(main);
        }

        // Smoothly handle data updating
        updateData = function () {

        }
        //#########################################  UTIL FUNCS ##################################

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
