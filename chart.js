async function drawChart() {

  // 1. Access data
  const dataset = await d3.csv("data.csv")
  const data = d3.groups(dataset, d => +d.year).map(
    ([year, data_shooting]) => {return {year, data_shooting}}
  )
 
  const heightAccessor = d => +d.fatalities

  // 2. Create chart dimensions

  let dimensions = {
    width: window.innerWidth * 0.5,
    height: 800,
    margin: {
      top: 55,
      right: 15,
      bottom: 40,
      left: 80,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      // .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.width}`)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // 4. Create scalesM-27.62622470982899,-3.A27.62622470982899,27.62622470982899,0,1,1,27.62622470982899,0L0,0Z
  const arc_half = (desired_width) => `M ${-desired_width/2}, 0 A ${desired_width/2}, ${desired_width/2}, 0, 1, 1, ${desired_width/2}, 0Z`
//TODO 这个改成log什么的，反正不能是线性
  const yearScale = d3.scaleBand()
                      .domain(d3.range(1999, 2022))
                      .range([dimensions.boundedHeight,dimensions.margin.top])
  const arc_height = d3.scaleLinear([0, 60], [0, yearScale.bandwidth()*28])

//TODO 这得让每年都是十二个月，来对应
  const dateParser = d3.timeParse("%Y-%m-%d")

  const timeScale = d3.scaleTime()
                      .domain([new Date("2000-01-01"), new Date("2000-12-30")])
                      .rangeRound([0, dimensions.boundedWidth])
//TODO 换一个方法分开years,scaleband/scalelinear对年份好像效果一样。。

  // 5. Draw data
      // <svg><g>第一个g</g></svg>

  const arcs = bounds.append('g')
        .selectAll('g')
        .data(data) // this will have only 4 elements in it
        .join('g')
        //? you cant use attr here, why???
          .style("transform", (d, i) => `translateY(${
              yearScale(d.year)
            }px)`)
          .style('isolation', "isolate")

  const arc_path = arcs.selectAll("path")
        .data(d => d.data_shooting)
        .join("path")
          .style("transform", d => `translateX(${
              timeScale(dateParser(d.map_date))
            }px)`)
          .attr("d", (d) => {
            // console.log(arc_half(arc_height(heightAccessor(d))))
            return arc_half(arc_height(Math.sqrt(2*heightAccessor(d)/Math.PI)))
          })
          .attr('fill', '#fac0c0')
          .style('opacity', 0.65)
          .attr("stroke", "red")
          .style("mix-blend-mode", "multiply")

  // 6. Draw peripherals

 

  // // 7. Interaction
  // const nameAccessor = d => d.name
  // const acreAccessor = d => d.acres
  // // text
  // const tooltip_text = triangle.append('g')
  //         .attr('class', 'text')
  // const fire_name = tooltip_text.append('text')
  //         .attr('x',0)
  //         .attr('y',-20)
  // const acre_number = tooltip_text.append('text')
  //         .attr('x',0)
  //         .attr('y',-6)

  // function onMouseEnter(event,d) {
  //   //draw the path to emphasize
  //   // dim the fill


  //   // add class: active to the tooltip_text
  //   // only show what is active
  //   const tooltip = d3.select(event.currentTarget.parentNode)
  //     .select('.text')
  //     .classed('active', true)
  //     .style('opacity', 1)

  //   const text = event.currentTarget.parentNode.getElementsByTagName('text')
  //   // attach fire_name
  //   d3.select(text[0])
  //     .text(nameAccessor(d))
  //   d3.select(text[1])
  //     .text(acreAccessor(d))
    
  //   // transfrom tooltip_text
  //   d3.selectAll('.text.active')
  //     .style('transform', `translate(${timeScale(new Date(d.map_date))}px,
  //                                    ${spikeHeight(d.acres)-30}px)`)

    
  // }

  // function onMouseLeave(){
  //   d3.selectAll('.text.active')
  //     .style('opacity', 0)
  // }
}


drawChart()
