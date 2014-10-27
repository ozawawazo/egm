var fill = d3.scale.category20();

//var w =  window.innerHeight -350,
//    w = window.innerWidth - 100,
//    h = window.innerHeight  - 422;
var w = 400, h = 400;

var focusedTable,
    areaClassObj,
    tagTables = {},
    fontSize = d3.scale.sqrt().range([5, 90]),
    maxLength = 30;
var layout = d3.layout.cloud()
    .timeInterval(100)
    .rotate(function(){
        return Math.floor( Math.random() * 2 ) * 90 - 45;
    })
    .size([w, h])
    .fontSize(function(d) { return fontSize(d.count); })
    .font(function(){
	return "fantasy"
    })
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
//    statusText = d3.select("#status");
function draw(data, bounds) {
    //    statusText.style("display", "none");
    scale = bounds ? Math.min(
			      w / Math.abs(bounds[1].x - w / 2),
			      w / Math.abs(bounds[0].x - w / 2),
			      h / Math.abs(bounds[1].y - h / 2),
			      h / Math.abs(bounds[0].y - h / 2)
			      ) / 2 : 1;
    var text = vis.selectAll("text")
	.data(data, function(d) { return d.text; });
    text.enter().append("text")
	.attr("text-anchor", "middle")
	.attr("tag", function(d){
		//		console.log(d);
		return d.tag})
	//.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")"; })
	.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
	//	.attr("correlation", 321)
	.style({"font-size": function(d) { return d.size + "px"; }})
	.style("cursor", "hand")
	.text(function(d) { return d.name; })
	.on("mouseover.3", function(d){
		d3.select(this)
		    .style({"font-family": "serif"})
		    }
	    )
	.on("mouseout.3", function(d){
		d3.select(this)
		    .style({ "font-family": "fantsy"})
		    }
	    );
    text.style("fill", function(d) { return fill(d.text.toLowerCase()); })
	.style("font-weight", "bold")
	.text(function(d) { return d.text; });
    text.transition()
        .duration(1000);
    var exitGroup = background.append("g")
	.attr("transform", vis.attr("transform"));
    vis.transition()
	.delay(1000)
	.duration(750)
	.attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}

//軸選択部分(id=viss)の内容更新
var svgbuttonx = d3.select("#viss").append("svg")
    .attr("width", 203 )
    .attr("height", 35)
    .attr("id","buttonx")
    .style("background-color", "#D3DEFB")
    .style({"border":"#3498db", "border-style":"groove", "border-top":"none", "border-right":"none", "border-bottom":"none"})
    //    .on("click", ladio)
    .on("click.a", button)
    .on("click.b", colorlabel)
    //    .on("click.c", color);
var svgbuttony = d3.select("#viss").append("svg")
    .attr("width", 195 )
    .attr("height", 35)
    .style("background-color", "#D3DEFB")
    .attr("id","buttony")
    //    .on("click", ladio1)
    .on("click.a", button)
    .on("click.b", colorlabel)
    //    .on("click.c", color);
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
/*
function color(){//あるデータとの決定係数を抽出し、その値に基づき色を設定する
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
*/
//d3.json('StaticTables4.json', function(d) {
var namebox = [];
d3.csv('test_unidic.csv', function(d) {
	var count;
	d.forEach(function(dd) {
                count = 0;
                namebox.forEach(function(box){
                        //                      console.log(box[name]);
			if (dd.name == box[0]) {
			    box[1]++;
			    count = count+1;
			}
		    })
		    if(count == 0){
			tagTables[dd.name] = [];
			namebox.push([[dd.name], 1]);
		    }
	    });
	namebox.forEach(function(dd) {
		//		console.log(dd[0][0]);
		tagTables[dd[0][0]].push({//品詞、元の文書情報
			name: "後日挿入予定",
			data: 0,
			correlation: dd[1],
			cor: 0
			    });
	    });
	console.log(tagTables);
	for (var tag in tagTables) {
	    words.push({
		    tag: tag,
		    count: tagTables[tag][0].correlation,
		    tables: tagTables[tag]
			});
	}
	console.log(words);
	words.sort(function(word1, word2) {
		return word2.count - word1.count;
	    });
	console.log(fontSize.domain(d3.extent(words, function(w) {return w.count;})));
	console.log(layout);
	fontSize.domain(d3.extent(words, function(w) {return w.count;}));//この関数はreturn Math.sqrt(d.value)
	layout.stop()
	    .words(words.slice(0, 250))
	    .start();
    }
);

function paramName(id) {
    return "cd" + id[0].toUpperCase() + id.slice(1);
}
function submitWord() {
    var nocount = 0,
	mojisize,
	formText = d3.select("#word-form input").node(),
	word = encodeURI(formText.value),
	formtext = formText.value;

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
