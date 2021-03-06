//rnsの基準点はtextの右上？左下？中心点？

var fill = d3.scale.category10();

var w = $('#display-wrapper-tag').width(), 
    h = 564;

var focusedTable,
    areaClassObj,
    tagTables = {},
    fontSize = d3.scale.log().range([20, 60]),
    maxLength = 30;
var layout = d3.layout.cloud()
    .timeInterval(100)
    .rotate(function(){return 0;/* make tags rotation*/})
    .size([w, h])
    .fontSize(function(d) { return fontSize(d.count); })
    .font(function(){
	return "fantasy"
    })
    .text(function(d) {return d.tag; })
    .on("end",  draw);
var margin = {top: 35, right: 8, bottom: 75, left: 90},
    widthh = w * 5 / 12 - margin.left - margin.right,
    heightt = window.innerHeight / 2 - margin.top - margin.bottom;
var x = d3.scale.linear()
    .range([0, widthh]);
var y = d3.scale.linear()
    .range([heightt, 0]);
var svg = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h);
var background = svg.append("g");
var vis = svg.append("g")
    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

var scale = 1;
//    statusText = d3.select("#status");
var directry = 'data/pen3/';
var box = [];

function sbvis(){
      $.ajax({
	    type: "POST",
		url: "sb.php",
		cache: false,
		data: "sampleVal=test",
		success: function(html){
		console.log(html);
	    }
	});
}




function fta(){
    namebox.forEach(function(d, i){
       	    var doc, transx, transy;
	    if(document.getElementById(d[0][0]).transform.baseVal.length != 0){
		console.log(document.getElementById(d[0][0]).transform.baseVal.length);
		doc = document.getElementById(d[0][0]).getBBox();
		transx = document.getElementById(d[0][0]).transform.baseVal[0].matrix.e;
		transy = document.getElementById(d[0][0]).transform.baseVal[0].matrix.f;
		box[d[0][0]] = {'name': d[0][0], 'num': i,'w':doc.width, 'h':doc.height,'x0':transx, 'y0':transy - doc.height*0.4, 'x1':transx - doc.width/2, 'y1':transy - doc.height*0.8, 'x2':transx + doc.width/2, 'y2':transy, 'ns':[], 'rns':[], 'lns':[], 'uns':[], 'dns':[]};
	    }
	});

    //Decide order of FTA
    var rvalrank = [], order = [];
    Object.keys(box).forEach(function(d,i){
            var maxcount = 0;
            if(i == 0){
                order.push(box[d].name);
                rvalrank.push(box[d].x1);
            }else{
                for(var j=0; j<rvalrank.length; j++){
                    if(box[d].x1 < rvalrank[j]){
                        rvalrank.splice(j, 0, box[d].x1);
                        order.splice(j, 0, box[d].name);
                        maxcount = maxcount + 1;
			break;
                    }
                }
                if(maxcount == 0){
                    order.push(box[d].name);
                    rvalrank.push(box[d].x1);
                }
            }
        });
    order.forEach(function(d){
	    var dbox = document.getElementById(d).getBBox(),
		dx = document.getElementById(d).transform.baseVal[0].matrix.e,//文字の中心のx座標
		dx1 = document.getElementById(d).transform.baseVal[0].matrix.e - dbox.width/2,
		dy = document.getElementById(d).transform.baseVal[0].matrix.f - dbox.height*0.4,//文字の中心のy座標
		dy1 = document.getElementById(d).transform.baseVal[0].matrix.f - dbox.height*0.8;
	    //Find NS
	    var ns = [];
	    order.forEach(function(dd){
		    //Main NS
                    var ddbox = document.getElementById(dd).getBBox(),
			ddx = document.getElementById(dd).transform.baseVal[0].matrix.e,
			ddy = document.getElementById(dd).transform.baseVal[0].matrix.f - ddbox.height*0.4 ;
		    if(d != dd && Math.abs(dx - ddx) < ( dbox.width + ddbox.width ) * 0.45 && Math.abs(dy - ddy) < (dbox.height + ddbox.height) * 0.45){
			ns.push(dd);
		    }
		    //Sub NS
		    box[dd].ns = []; 
		    order.forEach(function(ddd){
			    var dddbox = document.getElementById(ddd).getBBox(),
				dddx = document.getElementById(ddd).transform.baseVal[0].matrix.e,
				dddy = document.getElementById(ddd).transform.baseVal[0].matrix.f - dddbox.height*0.4 ;
			    if(dd != ddd && Math.abs(ddx - dddx) < ( ddbox.width + dddbox.width ) * 0.45 && Math.abs(ddy - dddy) < (ddbox.height + dddbox.height) * 0.45){
				box[dd].ns.push(ddd);
			    }
			});
		});

            //Find RNS,LNS,UNS,DNS
            var rns = [], lns = [], uns = [], dns = [];
	    order.forEach(function(dd){
		    var ddbox = document.getElementById(dd).getBBox(),
			ddx1 = document.getElementById(dd).transform.baseVal[0].matrix.e - ddbox.width/2,
			ddy1 = document.getElementById(dd).transform.baseVal[0].matrix.f - ddbox.height*0.8 ;
		    box[dd].rns = [], box[dd].lns = [], box[dd].uns = [], box[dd].dns = [];
		    box[dd].ns.forEach(function(ddd){
			    var dddbox = document.getElementById(ddd).getBBox(),
				dddx1 = document.getElementById(ddd).transform.baseVal[0].matrix.e - dddbox.width/2,
				dddy1 = document.getElementById(ddd).transform.baseVal[0].matrix.f - dddbox.height*0.8 ;
			    if(ddx1 < dddx1){
				box[dd].rns.push(ddd);
			    }else if(ddx1 > dddx1){
				box[dd].lns.push(ddd);
			    }else{
				if(box[dd].num > box[ddd].num){
				    box[dd].rns.push(ddd);
				}else{
				    box[dd].lns.push(ddd);
				}
			    }
			    if(ddy1 < dddy1){
				box[dd].dns.push(ddd);
			    }else if(ddy1 > dddy1){
				box[dd].uns.push(ddd);
			    }else{
				if(box[dd].num > box[ddd].num){
				    box[dd].dns.push(ddd);
				}else{
				    box[dd].uns.push(ddd);
				}
			    }
			});
		});
	    //Find TNS
	    var count = [];
	    function rtns(dd) {
		count.push(box[dd].name);
                if (box[dd].rtns !== undefined) {
                    return box[dd].rtns;
                }
                return box[dd].rtns = Array.prototype.concat.apply(box[dd].rns, box[dd].rns.map(function(j) { //map:与えられた関数を配列のすべての要素に対して呼び出し、その結果からなる新しい配列を生成
                            if(count.indexOf(j) == -1){ //indexof:オブジェクト内に引数が見つからなかった場合 -1
                                return rtns(j);
                            }
                        }));
            }
            count = [];
            rtns(d);
            box[d].rtns = d3.set(box[d].rtns).values();
            box[d].rtns.some(function(v, i){
                    if (v=="undefined") box[d].rtns.splice(i,1);
                });
            function ltns(dd) {
                count.push(box[dd].name);
                if (box[dd].ltns !== undefined) {
                    return box[dd].ltns;
                }
                return box[dd].ltns = Array.prototype.concat.apply(box[dd].lns, box[dd].lns.map(function(j) {
                            if(count.indexOf(j) == -1){
                                return ltns(j);
                            }
                        }));
            }
	    count = [];
            ltns(d);
            box[d].ltns = d3.set(box[d].ltns).values();
            box[d].ltns.some(function(v, i){
                    if (v=="undefined") box[d].ltns.splice(i,1);
                });

            function utns(dd) {
                count.push(box[dd].name);
                if (box[dd].utns !== undefined) {
                    return box[dd].utns;
                }
                return box[dd].utns = Array.prototype.concat.apply(box[dd].uns, box[dd].uns.map(function(j) {
                            if(count.indexOf(j) == -1){
                                return utns(j);
                            }
                        }));
            }
            count = [];
            utns(d);
            box[d].utns = d3.set(box[d].utns).values();
            box[d].utns.some(function(v, i){
                    if (v=="undefined") box[d].utns.splice(i,1);
                });

            function dtns(dd) {
                count.push(box[dd].name);
                if (box[dd].dtns !== undefined) {
                    return box[dd].dtns;
                }
                return box[dd].dtns = Array.prototype.concat.apply(box[dd].dns, box[dd].dns.map(function(j) {
                            if(count.indexOf(j) == -1){
                                return dtns(j);
                            }
                        }));
            }
            count = [];
            dtns(d);
            box[d].dtns = d3.set(box[d].dtns).values();
            box[d].dtns.some(function(v, i){
                    if (v=="undefined") box[d].dtns.splice(i,1);
                });

	    //Force transfer
	    if(box[d].rns.length != 0){
                box[d].rns.sort(function(a,b){
                        return box[a].x0 - box[b].x0
		});
                var force = ( box[box[d].rns[0]].w + box[d].w )/2 - Math.abs( box[box[d].rns[0]].x0 - box[d].x0 );
                if( force <= (( box[box[d].rns[0]].h + box[d].h )/2 - Math.abs( box[box[d].rns[0]].y0 - box[d].y0 ))*1.2 ){
                    var forcex, forcey;
                    Object.keys(box[d].rtns).forEach(function(dd,i){
                            forcex = d3.select("text#" + box[d].rtns[dd])[0][0].transform.animVal[0].matrix.e + force;
                            forcey = d3.select("text#" + box[d].rtns[dd])[0][0].transform.animVal[0].matrix.f;
                            d3.select("text#" + box[d].rtns[dd])
				.attr("transform", "translate("+ forcex + " , " + forcey  + ")");
                        });
                }
            }
	    //left
            if(box[d].lns.length != 0){
                box[d].lns.sort(function(a,b){
                        return box[a].x0 - box[b].x0
			    });
                var force = ( box[box[d].lns[0]].w + box[d].w )/2 - Math.abs( box[box[d].lns[0]].x0 - box[d].x0 );
                if( force <= (( box[box[d].lns[0]].h + box[d].h )/2 - Math.abs( box[box[d].lns[0]].y0 - box[d].y0 ))*1.2 ){
                    var forcex, forcey;
                    Object.keys(box[d].ltns).forEach(function(dd,i){
                            forcex = d3.select("text#" + box[d].ltns[dd])[0][0].transform.animVal[0].matrix.e - force;
                            forcey = d3.select("text#" + box[d].ltns[dd])[0][0].transform.animVal[0].matrix.f;
                            d3.select("text#" + box[d].ltns[dd])
                                .attr("transform", "translate("+ forcex + " , " + forcey  + ")");
                        });
                }
            }
	    //up
	    //	    console.log(box[d]);
            if(box[d].uns.length != 0){
		box[d].uns.sort(function(a,b){
			return box[a].y0 - box[b].y0
			    });
		var force = ( box[box[d].uns[0]].h + box[d].h )/2 - Math.abs( box[box[d].uns[0]].y0 - box[d].y0 );
		if( force*1.2 <= ( box[box[d].uns[0]].w + box[d].w )/2 - Math.abs( box[box[d].uns[0]].x0 - box[d].x0 ) ){
		    var forcex, forcey;
		    Object.keys(box[d].utns).forEach(function(dd,i){
			    forcex = d3.select("text#" + box[d].utns[dd])[0][0].transform.animVal[0].matrix.e;
			    forcey = d3.select("text#" + box[d].utns[dd])[0][0].transform.animVal[0].matrix.f - force;
			    d3.select("text#" + box[d].utns[dd])
				.attr("transform", "translate("+ forcex + " , " + forcey  + ")");
			});
		}
            }
	    /*
            //Down
            if(box[d].dns.length != 0){
		console.log(box[d]);
		box[d].dns.sort(function(a,b){
			return box[a].y0 - box[b].y0
			    });
		var force = ( box[box[d].dns[0]].h + box[d].h )/2 - Math.abs( box[box[d].dns[0]].y0 - box[d].y0 );
		if( force*1.2 <= ( box[box[d].dns[0]].w + box[d].w )/2 - Math.abs( box[box[d].dns[0]].x0 - box[d].x0 ) ){
		    var forcex, forcey;
		    Object.keys(box[d].dns).forEach(function(dd,i){
			    forcex = d3.select("text#" + box[d].dtns[dd])[0][0].transform.animVal[0].matrix.e;
			    forcey = d3.select("text#" + box[d].dtns[dd])[0][0].transform.animVal[0].matrix.f + force;
			    d3.select("text#" + box[d].dtns[dd])
                                .attr("transform", "translate("+ forcex + " , " + forcey  + ")");
			});
		}
	    }
*/
	});
}

jQuery.fn.d3Click = function () {
    this.each(function (i, e) {
	    var evt = document.createEvent("MouseEvents");
	    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	    e.dispatchEvent(evt);
	});
};



var weight;
var sent;
d3.csv( directry + 'word-sentence.csv', function(dd) {
	weight = dd;
    });

function draw(data, bounds) {
    scale = bounds ? Math.min(
			      w / Math.abs(bounds[1].x - w / 2),
			      w / Math.abs(bounds[0].x - w / 2),
			      h / Math.abs(bounds[1].y - h / 2),
			      h / Math.abs(bounds[0].y - h / 2)
			      ) / 2 : 1;
    var text = vis.selectAll("text")
	.data(data, function(d) {
		return d.text; 
	    });
    text.enter().append("text")
	.attr("text-anchor", "middle")
	.attr("id", function(d){ return d.tag })
	.attr("tag", function(d){ return d.tag })
	.attr("sentence",function(d){ return tagbox2[d.tag]["sentence"] })
	.attr("transform", function(d) { return "translate(" + [tagbox2[d.tag]["x"], tagbox2[d.tag]["y"]] + ")"; })
	//	.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
	.style({"font-size": function(d) { return d.size + "px"; }})
	.style("cursor", "hand")
	.text(function(d) { return d.name; })
	.on("click", function(d){
		if(d3.select(this)[0][0].style.fill == "rgb(31, 119, 180)"){
		    d3.select(this)
			.style({"fill": "#e74c3c"});
		}else{
                    d3.select(this)
                        .style({"fill": "rgb(31, 119, 180)"});
		}
                tagbox2[d.tag]["sentence"].forEach(function(dd){
			$("rect#" + dd).d3Click();
		    });
	    }
	)
	.on("mouseover", function(d){
		tagbox2[d.tag]["sentence"].forEach(function(dd){
			d3.select("text#" + dd)
			    .style({"fill": "#e74c3c", "font-weight":"bold"});
		    });
	    }
	)
	.on("mouseout", function(d){
                tagbox2[d.tag]["sentence"].forEach(function(dd){
                        d3.select("text#" + dd)
                            .style({"fill": "black", "font-weight":"normal"});
                    });
	    }
        )
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
    
    text.style("fill", function(d) { return fill( tagbox2[d.tag]["cluster"]); } )
	.style("font-weight", "bold")
	.style("opacity", 1)
	.text(function(d) { return d.text; });
    text.transition()
	.duration(500);
    var exitGroup = background.append("g")
	.attr("transform", vis.attr("transform"));
    vis.transition()
	.delay(500)
	//       .duration(750)
	//       .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
	.attr("transform", "translate(" + [w >> 1, h >> 1] + ")");
    //    $(multilist());
}
/*
function cloudchange(){
    console.log("test");

    var namebox = [];
    d3.csv('tacs/hoge.csv', function(d) {
	    var count;
	    d.forEach(function(dd) {
		    count = 0;
		    namebox.forEach(function(box){
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
	    var hogee = [];
	    namebox.forEach(function(ddd){
		    hogee.push(ddd[0][0]);
		});
	    var send_data= JSON.stringify(hogee);
	    
	    $.ajax({
		    type: "POST",
			url: "tacs/text_write.php",
			//		contentType: "Content-Type: application/json; charset=UTF-8",
			cache: false,
			data: {item : send_data},
			success: function(html){
		    }
		});
	    
	    //nameboxの文字列で類似度計算
	    //tagTables : 各単語についての情報保管
	    //tagTableに類似度結果をpush
	    
	    namebox.forEach(function(dd) {
		    tagTables[dd[0][0]].push({//品詞、元の文書情報
			    sentence: "後日挿入予定",
				mds: 0,
				correlation: dd[1],
				cor: 0
				//			radio:0
				});
		});
	    
	    for (var tag in tagTables) {
		words.push({
			tag: tag,
			    count: tagTables[tag][0].correlation,
			    tables: tagTables[tag]
			    });
	    }
	    words.sort(function(word1, word2) {
		    return word2.count - word1.count;
		});
	    fontSize.domain(d3.extent(words, function(w) {return w.count;}));//この関数はreturn Math.sqrt(d.value)
	    layout.stop()
		.words(words.slice(0, 250))
		.start();
	    if (!document.createElement) return;
	}
	);
    
}
*/
/*
function highlights(d){
    vis.selectAll("text")
	.style({"fill": "rgb(31, 119, 180)"});
    d3.select(this)
	.style({"fill": "#e74c3c"});
	
}
*/

var cor_value,
    words = [],
    tagbox2 = {};

var xpmax = 0, xmmax = 0, ypmax = 0, ymmax = 0, sente;
//d3.csv( directry + 'mds-clu.csv', function(d) {//data about tags
d3.csv( directry + 'mds.csv', function(d) {
	d.forEach(function(dd){
		if(dd["x"] - xpmax > 0){
		    xpmax = dd["x"];
		}
		if(dd["x"] - xmmax < 0){
		    xmmax = dd["x"];
		}
		
                if(dd["y"] - ypmax > 0){
                    ypmax = dd["y"];
                }
		if(dd["y"] - ymmax < 0){
                    ymmax = dd["y"];
                }
	    });
	var xscale = d3.scale.linear()
	    .domain([xmmax, xpmax])
	    .range([-$('#vis').width()*0.43, $('#vis').width()*0.43]);
	var yscale = d3.scale.linear()
	    .domain([ymmax, ypmax])
	    .range([-$('#vis').height()*0.25, $('#vis').height()*0.47]);
	/*
	var cluscale = d3.scale.linear()
	    .domain([0, d3.max(d, function(dd) { return dd.cluster; })])
	    .range([0,10])
	*/
	d.forEach(function(dd){
		sent = [];
		dd.x = xscale(dd["x"]);
		dd.y = yscale(dd["y"]);
		weight.forEach(function(ddd){
                        if (dd["tag"] == ddd.word){
			    sent.push(ddd.sen1);
                            sent.push(ddd.sen2);
                            sent.push(ddd.sen3);
                            sent.push(ddd.sen4);
                            sent.push(ddd.sen5);
                            sent.push(ddd.sen6);
                            sent.push(ddd.sen7);
                            sent.push(ddd.sen8);
                            sent.push(ddd.sen9);
			    sente = [];
			    for (var i = 0; i < sent.length; ++i) {
				if (sent[i] !== undefined) sente.push(sent[i]);
			    }
                        }
                    });
		dd.sentence = sente;
		//              dd.cluster = cluscale(dd["cluster"]);
		tagbox2[dd["tag"]] = dd;
	    });
	
	
    }
);

window.setTimeout( highlightss, 10 );
function highlightss(){
    d3.csv( directry + 'mor-node_words_weight.csv', function(d) {//data about tags

	});
}

var namebox = [];
d3.csv( directry + 'unidic.csv', function(d) {
	var count;
	d.forEach(function(dd) {
                count = 0;
                namebox.forEach(function(box1){
			if (dd.name == box1[0]) {
			    box1[1]++;
			    count = count+1;
			}
		    });
		if(count == 0){
		    tagTables[dd.name] = [];
		    namebox.push([[dd.name], 1]);
		}
	    });
	var hogee = [];
	namebox.forEach(function(ddd){
		hogee.push(ddd[0][0]);
	    });
	var send_data= JSON.stringify(hogee);

	$.ajax({
		type: "POST",
		url: "tacs/text_write.php",
		    //		contentType: "Content-Type: application/json; charset=UTF-8",
		cache: false,
		data: {item : send_data},
		success: function(html){
		}
	    });

	//nameboxの文字列で類似度計算
	//tagTables : 各単語についての情報保管
	//tagTableに類似度結果をpush

	namebox.forEach(function(dd) {
		tagTables[dd[0][0]].push({//品詞、元の文書情報
			sentence: "後日挿入予定",
			mds: 0,
			correlation: dd[1],
			cor: 0
			    //			radio:0
			    });
	    });

	for (var tag in tagTables) {
	    words.push({
		    tag: tag,
		    count: tagTables[tag][0].correlation,
		    tables: tagTables[tag]
			});
	}
	words.sort(function(word1, word2) {
		return word2.count - word1.count;
	    });
	fontSize.domain(d3.extent(words, function(w) {return w.count;}));//この関数はreturn Math.sqrt(d.value)
	layout.stop()
	    .words(words.slice(0, 250))
	    .start();
	if (!document.createElement) return;
    }
);

/*
function multilist() {//add tag to multilist
    if (!document.createElement) return;

    words.forEach(function(words2){
            var opt = document.createElement("option");
            opt.className = "elem-selectable";
	    var str = document.createTextNode(words2.tag);
	    opt.appendChild(str);//add tag's info
	    document.getElementById("multi-select").insertBefore(opt, null);//add tag to list
        });

    $(function(){
	    $('#multi-select').multiSelect({
		    selectableHeader: "<div class='custom-header'>Add tags</div>",
			selectionHeader: "<div class='custom-header'>Remove tags</div>"	
			});
	});
}
*/
d3.select('#recreate-tagcloud')
    .on('submit', function() {
	    console.log("aaaa");
	    //タグのcountを設定する。

    }
	);
