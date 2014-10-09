var w = window.innerWidth - 40,
    h = window.innerHeight / 2 - 122;
var focusedTable,
    areaClassObj,
    tagTables = {},
    //    words = [],
    //    complete = 0,
    //    keyword = "",
    fontSize = d3.scale.sqrt().range([15, 90]),
    maxLength = 30,
    statusText = d3.select("#status");
var layout = d3.layout.cloud()
    .timeInterval(100)
    .size([w, h])
    .fontSize(function(d) { return fontSize(d.count); })
    .text(function(d) { return d.tag; })
    .on("end",  draw);
var margin = {top: 35, right: 8, bottom: 75, left: 90},
    widthh = w * 5 / 12 - margin.left - margin.right,
    heightt = window.innerHeight / 2 - margin.top - margin.bottom;
var x = d3.scale.linear()
    .range([0, widthh]);
var y = d3.scale.linear()
    .range([heightt, 0]);
var svgrabell = d3.select("#visrabel").append("svg")
    .attr("width", w)
    .attr("height", 29)
    .attr("id","rabel1")
    .style("background-color", "#3498db")
    .append("text")
    .attr({'x': 20, 'y': 25, 'font-size': 25, 'font-weight': 'bold', 'fill': '#ecf0f1'})
    .style("text-anchor", "start")
    .text("データ一覧:");
var svg = d3.select("#vis").append("svg")
    .attr("width", w-5)
    .attr("height", h)
    .style({"border": "#3498db", "border-style": "groove", "border-top": "none"});
var svgmap2 = d3.select("#visss").append("svg")
    .attr("width", w * 7 / 24)
    .attr("height", window.innerHeight / 2 - 37);
var svgmap = d3.select("#visss").append("svg")
    .attr("width", w * 7 / 24 - 10)
    .attr("height", window.innerHeight / 2 -37);
var svgcor = d3.select("#visss").append("svg")
    .attr("width", widthh + margin.left + margin.right)
    .attr("height", heightt + margin.top + margin.bottom - 37)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var background = svg.append("g"),
    vis = svg.append("g")
    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

var scale = 1;
function draw(data, bounds) {
    statusText.style("display", "none");
    scale = bounds ? Math.min(
			      w / Math.abs(bounds[1].x - w / 2),
			      w / Math.abs(bounds[0].x - w / 2),
			      h / Math.abs(bounds[1].y - h / 2),
			      h / Math.abs(bounds[0].y - h / 2)
			      ) / 2 : 1;
    var text = vis.selectAll("text")
	.data(data, function(d) { 
		console.log(d);
		return d.text; });
    text.transition()
	.duration(1000)
	text.enter().append("text")
	.attr("text-anchor", "middle")
	.attr("tag", function(d){return d.tag})
	.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
	.attr("correlation", 321)
	.style({"opacity": 1e-6, "font-size": function(d) { return d.size + "px"; }})
	.style("cursor", "hand")
	.text(function(d) { return d.name; })
	.on("click.1", count)
	.on("click.2", conservation)
	.on("click.3", plot)
	.on("click.4", mapping)
	.on("mouseover.3", function(d){
		d3.select(this)
		    .style({"font-family": "serif"})
		    }
	    )
	.on("mouseout.3", function(d){
		d3.select(this)
		    .style({ "font-family": "fantasy"})
		    }
	    )
	.transition()
	.duration(1000)
	.style("opacity", 1);
    text.style("font-family", "fantasy")
	.style("fill", "#3498db")
	.style("font-weight", "bold")
	.text(function(d) { return d.text; });
    var exitGroup = background.append("g")
	.attr("transform", vis.attr("transform"));
    vis.transition()
	.delay(1000)
	.duration(750)
	.attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}

//各軸でのデータ選択回数カウント
var svgcount = 0,
    svg2count = 0,
    radiobox = 1;
function count(d){
    if(radiobox == 1){
	svgcount += 1;
    }else{
	svg2count += 1;
    }
}

//?_name, cor_dataに選択データ名、決定係数の保存
var correlation = 0,
    x_name, y_name, cor_data;
function conservation(d){
    var cor = d.tables[0].correlation
	if(radiobox == 1){
	    x_name = d.tag;
            for (var i = 0; i < cor.length; i++){
		if(cor[i].name === y_name){
		    cor_data = cor[i].value; 
		}
	    }
	}else{
	    y_name = d.tag;
            for (var i = 0; i < cor.length; i++){
		if(cor[i].name === x_name){
		    cor_data = cor[i].value; 
		}
	    }
	}
}

//地図表示、色塗り
var geo = "path#geo2.",
    iro = "red",
    maps = svgmap2,
    maps2 = svgmap, 
    axis ="X軸",
    max, min, colorScale, color;
function mapping(d){
    d3.json('japank.geojson', function(geojson){
	    var projection = d3.geo.mercator()
		.center([153, 28])
		.scale(700);
	    var path = d3.geo.path().projection(projection);
	    d3.json('StaticTables4.json', function(json){
		    d3main(geojson, json);
		});
	    function d3main(geojson, json){
		var b = d.tables[0];
		min = d3.extent(d.tables[0].data, function(d) {return d.value; })[0];
		max = d3.extent(d.tables[0].data, function(d) {return d.value; })[1];
		iro = "#16a085";
		if(radiobox == 2){
		    if(svg2count == 1){
			var g = svgmap.append('g')
	                    .attr("transform", "translate("+[-100, 100]+")");
			var map = g.selectAll('path')
			    .data(geojson.features)
			    .enter()
			    .append('path')
			    .attr({
				    "class":function(d){ return d.properties.PREF},
				    d: path,
				    stroke: '#bdc3c7',
				    id: 'geo1'
				})
			    .on('mouseover', function(){
				    d3.selectAll(".dot." + d3.select(this).attr('class') )
				    .attr({"opacity": 1, "r": 9})
				    .style("fill", "#f1c40f");
				})
			    .on('mouseout', function(){
				    d3.selectAll(".dot." + d3.select(this).attr('class') )
				    .attr({"opacity": 0.7, "r": 6})
				    .style("fill", "#16a085");
				})
			    .on("mouseover.2", function(d){
				    svgcor.append("g")
				    .attr("class", "dot")
				    .append("text")
				    .attr({'id': d3.select(this).attr('class'), 'x': 10, 'y': -5})
				    .style({'font-size': '25px', 'font-weight': 'bold', 'fill': '#ddd'})
				    .text( d3.select(this).attr('class'));
				})
			    .on("mouseout.2", function(d){
				    d3.select("text#" + d3.select(this).attr('class'))
				    .transition()
				    .duration(10)
				    .style("opacity",0)
				    .remove();
				});
			gradient1 = svgmap.append("svg:defs")
			    .append("svg1:linearGradient")
			    .attr("id", "gradient1")
			    .attr("x1", "0%")
			    .attr("y1", "0%")
			    .attr("x2", "100%")
			    .attr("y2", "0%")
			    
			    gradient1.append("svg:stop")
			    .attr("offset", "0%")
			    .attr("stop-color", "#ffffff")
			    .attr("stop-opacity", 1)
			    
			    gradient1.append("svg:stop")
			    .attr("offset", "100%")
			    .attr("stop-color", "#16a085")
			    .attr("stop-opacity", 1)
			    
			    svgmap.append("rect")
			    .attr({'width': 130, 'x': w * 7 / 24 - 120, 'y': window.innerHeight / 2 -72, 'height': 10, 'fill': 'url(#gradient1)'})
			    .style("text-anchor", "end");
			
			svgmap.append("text")
			    .attr({'class': 'label2', 'x': w * 7 / 24 -120 , 'y': window.innerHeight / 2 -48, 'font-size': 15, 'font-weight': 'bold'})
			    .style("text-anchor", "start")
			    .text("Min");
			svgmap.append("text")
			    .attr({'class': 'label2', 'x':  w * 7 / 24 - 65 , 'y':  window.innerHeight / 2 -48, 'font-size': 15, 'font-weight': 'bold'})
			    .style("text-anchor", "middle")
			    .text("値");
			svgmap.append("text")
			    .attr({'class': 'label2', 'x':  w * 7 / 24 - 10 , 'y':  window.innerHeight / 2 -48, 'font-size': 15, 'font-weight': 'bold'})
			    .style("text-anchor", "end")
			    .text("Max");
		    }
		}else{
		    if(svgcount == 1){
			var g = svgmap2.append('g')
			    .attr("transform", "translate("+[-100, 100]+")");
			var map = g.selectAll('path')
			    .data(geojson.features)
			    .enter()
			    .append('path')
			    .attr({
				    "class":function(d){ return d.properties.PREF},
				    d: path,
				    stroke: '#bdc3c7',
				    id: 'geo2'
				})
			    .on('mouseover', function(){
				    d3.selectAll(".dot." + d3.select(this).attr('class') )
				    .attr({"opacity": 1, "r": 9})
				    .style("fill", "#f1c40f");
				})
			    .on('mouseout', function(){
				    d3.selectAll(".dot." + d3.select(this).attr('class') )
				    .attr({"opacity": 0.7, "r": 6})
				    .style("fill", "#16a085");
				})
			    .on("mouseover.2", function(d){
				    svgcor.append("g")
				    .attr("class", "dot")
				    .append("text")
				    .attr({'id': d3.select(this).attr('class'), 'x': 10, 'y': -5})
				    .style({'font-size': '25px', 'font-weight': 'bold', 'fill': '#ddd'})
				    .text( d3.select(this).attr('class'));
				})
			    .on("mouseout.2", function(d){
				    d3.select("text#" + d3.select(this).attr('class'))
				    .transition()
				    .duration(10)
				    .style("opacity",0)
				    .remove();
				});
			gradient2 = svgmap.append("svg:defs")
			    .append("svg1:linearGradient")
			    .attr("id", "gradient2")
			    .attr("x1", "0%")
			    .attr("y1", "0%")
			    .attr("x2", "100%")
			    .attr("y2", "0%")
			    
			    gradient2.append("svg:stop")
			    .attr("offset", "0%")
			    .attr("stop-color", "#ffffff")
			    .attr("stop-opacity", 1)
			    
			    gradient2.append("svg:stop")
			    .attr("offset", "100%")
			    .attr("stop-color", "#16a085")
			    .attr("stop-opacity", 1)
			    
			    svgmap2.append("rect")
			    .attr({'width': 130, 'x': w * 7 / 24 - 120, 'y': window.innerHeight / 2 -72, 'height': 10, 'fill': 'url(#gradient2)'})
			    .style("text-anchor", "end");
			
			svgmap2.append("text")
			    .attr({'class': 'label2', 'x': w * 7 / 24 -120 , 'y': window.innerHeight / 2 -48, 'font-size': 15, 'font-weight': 'bold'})
			    .style("text-anchor", "start")
			    .text("Min");
			svgmap2.append("text")
			    .attr({'class': 'label2', 'x':  w * 7 / 24 - 65 , 'y':  window.innerHeight / 2 -48, 'font-size': 15, 'font-weight': 'bold'})
			    .style("text-anchor", "middle")
			    .text("値");
			svgmap2.append("text")
			    .attr({'class': 'label2', 'x':  w * 7 / 24 - 10 , 'y':  window.innerHeight / 2 -48, 'font-size': 15, 'font-weight': 'bold'})
			    .style("text-anchor", "end")
			    .text("Max");
		    }
		}
		colorScale = d3.scale.linear()
		    .domain([min, max])
		    .range(["white", iro]);
		b.data.map(function(d){
			coloring = colorScale(d.value);
			d3.select(geo + d.name).attr("fill", coloring);
			maps.selectAll(".label").remove();
			maps.selectAll(".label3").remove();
			if (b.name.length > 15 && b.name.length <= 20){
			    var px = "15px";
			}else if(b.name.length > 20){
			    var px = "13px";
			}else{
			    var px = "20px";
			}
			maps.append("text")
			    .attr({"class": "label", "x": w * 7 / 48, "y": 30})
			    .style({"text-anchor": "middle", 'font-size': px, 'font-weight': 'bold'})
			    .text(axis + ":" + b.name);<!--軸の名前に変える -->
							    }
		    )
		    ladio1();
		button();
		colorlabel();
		color();
	    }
	})
	}

var checkx, checky, keydata;
function ladio(){//x軸のラジオボックスにチェックを入れた際の関数
    radiobox = 1,
    maps = svgmap2,
    maps2 = svgmap,
    geo = "path#geo2.",
    axis = "X軸";
    checkx = "☑",checky = "□";
    keydata = y_name;
}
function ladio1(){//y軸のラジオボックスにチェックを入れた際の関数
    radiobox = 2,
    maps = svgmap,
    maps2 = svgmap2,
    geo = "path#geo1.",
    axis = "Y軸";
    checkx = "□",checky = "☑";
    keydata = x_name;
}

//軸選択部分(id=viss)の内容更新
var svgbuttonx = d3.select("#viss").append("svg")
    .attr("width", 295 )
    .attr("height", 35)
    .attr("id","buttonx")
    .style("background-color", "#D3DEFB")
    .style({"border":"#3498db", "border-style":"groove", "border-top":"none", "border-right":"none", "border-bottom":"none"})
    .on("click", ladio)
    .on("click.a", button)
    .on("click.b", colorlabel)
    .on("click.c", color);
var svgbuttony = d3.select("#viss").append("svg")
    .attr("width", 195 )
    .attr("height", 35)
    .style("background-color", "#D3DEFB")
    .attr("id","buttony")
    .on("click", ladio1)
    .on("click.a", button)
    .on("click.b", colorlabel)
    .on("click.c", color);
function button(){
    if(y_name == undefined){
	y_name = "";
    }
    d3.selectAll("#x_button").remove();
    svgbuttonx.append("text")
	.attr({'id':'x_button', 'x':20, 'y':25, 'font-size':25, 'font-weight':'bold', 'fill':'#3498db'})
	.style("text-anchor", "start")
	.text("軸選択:");
    svgbuttonx.append("text")
	.attr({'id': 'x_button', 'x': 110, 'y': 25, 'font-size': 20, 'font-weight': 'bold', 'fill': '#3498db'})
	.style("text-anchor", "start")
	.style("cursor", "hand")
	.text(checkx + "X軸「" + x_name + "」");
    d3.selectAll("#y_button").remove();
    svgbuttony.append("text")
	.attr({'id': 'y_button', 'x': 10, 'y': 25, 'font-size': 20, 'font-weight': 'bold', 'fill': '#3498db'})
	.style("text-anchor", "start")
	.style("cursor", "hand")
	.text(checky + "Y軸「" + y_name + "」");
}

//軸選択左部分(viss#label)の更新
var svglabel = d3.select("#viss").append("svg")
    .attr("width", w-495 )
    .attr("height", 34)
    .attr("id","rabel")
    .style("background-color", "#D3DEFB")
    .style({"border":"#3498db","border-style":"groove", "border-top":"none", "border-left":"none", "border-bottom":"none"});
function colorlabel() {
    gradient = svglabel.append("svg:defs")
	.append("svg:linearGradient")
	.attr("id", "gradient")
	.attr("x1", "0%")
	.attr("y1", "0%")
	.attr("x2", "100%")
	.attr("y2", "0%")
    gradient.append("svg:stop")
	.attr("offset", "0%")
	.attr("stop-color", "#f6949c")
	.attr("stop-opacity", 1)	
    gradient.append("svg:stop")
	.attr("offset", "100%")
	.attr("stop-color", "#0000ff")
	.attr("stop-opacity", 1)	
    svglabel.append("rect")
	.attr({'width': 180, 'x': w - 679, 'y': 3, 'height': 13, 'fill': 'url(#gradient)'})
	.style("text-anchor", "end");
    svglabel.append("text")
	.attr({'class': 'label2', 'x': w - 679, 'y': 32, 'font-size': 15, 'font-weight': 'bold'})
	.style("text-anchor", "start")
	.text("0");
    svglabel.append("text")
	.attr({'class': 'label2', 'x': w - 594, 'y': 32, 'font-size': 15, 'font-weight': 'bold'})
	.style("text-anchor", "middle")
	.text("相関");
    svglabel.append("text")
	.attr({'class': 'label2', 'x': w - 502 , 'y': 32, 'font-size': 15, 'font-weight': 'bold'})
	.style("text-anchor", "end")
	.text("1");
    if(keydata == undefined){
	keydata = " ";
    }
    d3.selectAll("#ruijido").remove();
    d3.select("#rabel")
	.append("text")
	.attr({'id':'ruijido','x': w - 691, 'y': 25, 'font-size': 25, 'font-weight': 'bold', 'fill': '#3498db'})
	.style("text-anchor", "end")
	.text("文字色：データ「"+ keydata +"」との相関");
}


var cor_value,
    words = [];
function color(){
    words.forEach(function(dd){
	    var cor = dd.tables[0].correlation,
		c = d3.interpolateRgb(d3.hsl("hsl(0,100%,80%)"), d3.hsl("hsl(240,100%,50%)"));
	    
	    for (var i = 0; i < cor.length; i++){
		if(cor[i].name === keydata){
		    cor_value = cor[i].value;
		}
	    }
	    var a = c(cor_value),
		text = vis.selectAll("text");
	    for (var i = 0; i < cor.length; i++){
		if(text[0][i].textContent === dd.tag){
		    text[0][i].style.fill = a;    
		}
	    }
	}
	)
}

d3.json('StaticTables4.json', function(d) {
	d.table_info.forEach(function(dd) {
		if (tagTables[dd.tags] === undefined) {
		    tagTables[dd.tags] = [];
		}
		tagTables[dd.tags].push({
			name: dd.table_name,
			    data: dd.data,
			    correlation: dd.correlation,
			    cor: 0
			    });
	    });
	for (var tag in tagTables) {
	    words.push({
		    tag: tag,
			count: tagTables[tag].length,
			tables: tagTables[tag]
			});
	}
	words.sort(function(word1, word2) {
		return word2.count - word1.count;
	    });
	
	fontSize.domain(d3.extent(words, function(w) {return w.count;}));
	layout.stop()
	    .words(words.slice(0, 250))
	    .start();
    }
);

var scatter = [];
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

function plot(d){
    var datata = d.tables[0].data;
    if(radiobox == 1){
	if(svgcount == 1){
	    datata.forEach(function(dd){
		    scatter.push({
			    name : dd.name,
				xdata : dd.value,
				xname : d.tables[0].name
				})
			})
		}else{
	    scatter.forEach(function(dd){
		    datata.forEach(function(ddd){
			    if(ddd.name === dd.name){
				dd.xdata = ddd.value;
				dd.xname = d.tables[0].name;
			    }
			})
			})
		}
    }else{
	scatter.forEach(function(dd){
		datata.forEach(function(ddd){
			if(ddd.name === dd.name){
			    dd.ydata = ddd.value;
			    dd.yname = d.tables[0].name;
			}
		    })
		    })
	    }
    if(scatter[0].xdata != null && scatter[0].ydata != null){
	scatter.forEach(function(data) {
                d.x = +data.xdata;
                d.y = +data.ydata;
	    });
	svgcor.selectAll(".cor").remove();
        svgcor.append("g")
	    .append('text')
	    .attr({'class': 'cor', 'id': 'corLabel', 'x': 10, 'y': 35})
	    .style({'font-size': '30px', 'font-weight': 'bold', 'fill': '#95a5a6'})
	    .call(function(selection) {
		    selection.append("tspan")
			.text("R");
		    selection.append("tspan")
			.attr("baseline-shift", "super")
			.text(2);
		    selection.append("tspan")
			.text(" = " + cor_data);
		});
        x.domain(d3.extent(scatter, function(d) {return d.xdata; })).nice();
        y.domain(d3.extent(scatter, function(d) {return d.ydata; })).nice();
	svgcor.selectAll(".tick").remove();
	svgcor.selectAll(".dot").remove();
	svgcor.selectAll(".label").remove();
	svgcor.selectAll(".bestfit").remove();
	
	var a, b, c, d2, d;
	var avX = 0, avY = 0, sXY = 0, sXX = 0;
	for (var n = 0; n < scatter.length; n++) {
	    avX += scatter[n].xdata / scatter.length;
	    avY += scatter[n].ydata / scatter.length;
	}
	for (var n = 0; n < scatter.length; n++) {
	    sXY += (scatter[n].xdata-avX) * (scatter[n].ydata-avY);
	    sXX += (scatter[n].xdata-avX) * (scatter[n].xdata-avX);
	}
	a = sXY / sXX;
	b = avY - a * avX;
	var x1 = 0, y1 = y(b + a * x.domain()[0] );
	var x2 = x(d3.extent(scatter, function(d) {return d.xdata;})[1]);
	var y2 = y(a * d3.extent(scatter, function(d) {return d.xdata; })[1] + b);
	svgcor.append("g")
	    .append('line')
	    .attr('class', 'bestfit')
	    .attr({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2})
	    .transition()
	    .duration(1500)
	    .style({'stroke-width': '5px', 'opacity': 1, 'stroke': '#95a5a6'});
	
	if (scatter[0].xname.length > 15 && scatter[0].xname.length <= 20){
	    var px0 = "15px";
	}else if(scatter[0].xname.length > 20){
	    var px0 = "13px";
	}else{
	    var px0 = "20px";
	}
	if (scatter[1].yname.length > 15 && scatter[1].yname.length <= 20){
	    var px1 = "15px";
	}else if(scatter[1].yname.length > 20){
	    var px1 = "13px";
	}else{
	    var px1 = "20px";
	}
        svgcor.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightt + ")")
            .call(xAxis)
            .append("text")
            .attr({"class": "label", "x": 226, "y": 37})
            .style({"text-anchor": "middle", 'font-size': px0, 'font-weight': 'bold'})
            .text(scatter[0].xname);<!--ここをx軸の名前に変える -->
        svgcor.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	    .attr({"class": "label", "x": "-"+ heightt / 2 , "y": -70 , "dy": ".71em", "transform": "rotate(-90)"})
            .style({"text-anchor": "middle", 'font-size': px1, 'font-weight': 'bold'})
	    .text(scatter[0].yname);<!--ここをy軸の名前に変える -->
        svgcor.selectAll(".dot")
	    .data(scatter)
	    .enter().append("circle")
	    .attr("class", function(d){ return "dot " + d.name})
	    .attr({"color": "#16a085", "opacity": "0.7", "r": 6})
	    .attr("cx", function(d) { return x(d.xdata); })
	    .attr("cy", function(d) { return y(d.ydata); })
	    .style("fill", "#16a085");

        svgcor.selectAll(".dot")
	    .on("mouseover", function(d){
		    d3.select(this)
			.transition()
			.attr("r",9);
		})
	    .on("mouseout", function(d){
		    d3.select(this)
			.transition()
			.attr("r",6);
		})
	svgcor.selectAll(".dot")
	    .on("mouseover.2", function(d){
		    svgcor.append("g")
			.attr("class", "dot")
			.append("text")
			.attr({'id': d.name, 'x': 10, 'y': -5})
			.style({'font-size': '25px', 'font-weight': 'bold', 'fill': '#ddd'})
			.text(d.name + ": x=" + d.xdata + ", y=" + d.ydata );
		})
	    .on("mouseout.2", function(d){
		    d3.select("text#" + d.name)
			.transition()
			.duration(100)
			.style("opacity",0)
			.remove();
		});
	
    }
};

function paramName(id) {
    return "cd" + id[0].toUpperCase() + id.slice(1);
}
function submitWord() {
    var nocount = 0,
    mojisize;
    var formText = d3.select("#word-form input").node();
    var word = encodeURI(formText.value);
    var formtext = formText.value;

    function abbstr(text, len) {
	var count = 0;
	var str = "";
	for (i=0; i < text.length; i++){
	    var n = escape(text.charAt(i));
            count++; 
	    if (count > len) {return str+"...";}
	    str += text.charAt(i);
	}
	return text;
    }
    if(formtext !== ""){
	d3.selectAll("#keyword").remove();
	d3.select("#rabel1")
	    .append("text")
	    .attr({'id':'keyword', 'x': w - 20, 'y': 25, 'font-size': 25, 'font-weight': 'bold', 'fill': '#ecf0f1'})
	    .style("text-anchor", "end")
	    .text("キーワード「" +  abbstr(formtext, 6) + "」の類似度計算中…");
	
	d3.csv("writetext.php?word=" + word, function(data) {
		var sim = {};
		data.forEach(function (d) {
			sim[d.word2] = d.similality;
			if(isNaN(d.similality) || d.similality == 0.0){
			    sim[d.word2] = 0.01;
			}else{
			    nocount += 1;
			}
		    }
		    );
		words.forEach(function (word) {
			word.similality = sim[word.tag];
			word.count = sim[word.tag]*sim[word.tag]*10;
		    });
    var layout = d3.layout.cloud()
	.size([w, h])
	.fontSize(function(d) { return fontSize(d.count); })
	.on("end",  draw);
    fontSize.domain(d3.extent(words, function(w) {return w.count;}));
    layout.stop()
          .words(words.slice(0, 250))
          .start();
    color();
    var text = vis.selectAll("text");
    text.transition()
        .duration(100)
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .style("font-size", function(d) { return d.size + "px"; });
   d3.select("#rabel1")
    .append("text")
    .attr({'x': 150, 'y': 25, 'font-size': 15, 'font-weight': 'bold', 'fill': '#ecf0f1'})
    .style("text-anchor", "start")
    .text("単語をクリックするとそれに関するデータが表示されます");
  if( nocount == 0){
      mojisize = "キーワード「" +  abbstr(formtext, 6) + "」では検索できません";
  }else{
      mojisize = "文字サイズ：キーワード「" +  abbstr(formtext, 6) + "」との類似度";
  }
  d3.selectAll("#keyword").remove();
  d3.select("#rabel1")
    .append("text")
      .attr({'id':'keyword', 'x': w - 20, 'y': 25, 'font-size': 25, 'font-weight': 'bold', 'fill': '#ecf0f1'})
    .style("text-anchor", "end")
    .text(mojisize);
  });
 }else{
     d3.selectAll("#keyword").remove();
     d3.select("#rabel1")
	 .append("text")
	 .attr({'id':'keyword', 'x': w - 20, 'y': 25, 'font-size': 25, 'font-weight': 'bold', 'fill': '#ecf0f1'})
	 .style("text-anchor", "end")
	 .text("キーワードを入力して下さい");
 }


  formText.value = "";
  return false;
}
