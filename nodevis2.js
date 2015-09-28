//rnsの基準点はtextの右上？左下？中心点？

var fill = d3.scale.category20();

var w = $('#display-wrapper-tag').width(), 
    h = 564;

var focusedTable,
    areaClassObj,
    tagTables = {},
    fontSize = d3.scale.log().range([10, 50]),
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

var box = [],
    count = [];

function tagplacement(){
    namebox.forEach(function(d){
       	    var doc, transx, transy;
	    if(document.getElementById(d[0][0]) != null){
		doc = document.getElementById(d[0][0]).getBBox();
		transx = document.getElementById(d[0][0]).transform.baseVal[0].matrix.e;
		transy = document.getElementById(d[0][0]).transform.baseVal[0].matrix.f;
		box[d[0][0]] = {'name': d[0][0], 'w':doc.width, 'h':doc.height,'x0':transx, 'y0':transy - doc.height/2, 'x1':transx - doc.width/2, 'y1':transy - doc.height, 'x2':transx + doc.width/2, 'y2':transy, 'ns':[], 'rns':[], 'lns':[], 'uns':[], 'dns':[],'tns':[]}; //x0=中心点 ,x1=左上 , x2=右下
	    }
	});
    console.log(box);
    Object.keys(box).forEach(function(d){//NS配布
            Object.keys(box).forEach(function(dd){
                    if(box[d].name != box[dd].name && Math.abs(box[d].x0 - box[dd].x0) < (box[d].w + box[dd].w) * 0.45 && Math.abs(box[d].y0 - box[dd].y0) < (box[d].h + box[dd].h) * 0.45){
			box[d].ns.push(box[dd].name);
                    }//transform(textの中間,textのベースライン)
                });
        });
    Object.keys(box).forEach(function(dd,i){//各点に対するRNS,LNS,TNS,DNSの定義
	    box[dd].ns.forEach(function(d){
		    if(box[d].x1 > box[dd].x1){
			box[dd].rns.push(d);
		    }else if(box[d].x1 < box[dd].x1){
			box[dd].lns.push(d);
		    }else{
			if(box[d].w < box[dd].w){
			    box[dd].rns.push(d);
			}else{
			    box[dd].lns.push(d);
			}
		    }
		    if(box[d].y1 > box[dd].y1){
			box[dd].dns.push(d);
		    }else if(box[d].y1 < box[dd].y1){
			box[dd].uns.push(d);
		    }else{
			if(box[d].h < box[dd].h){
                            box[dd].dns.push(d);
                        }else{
                            box[dd].uns.push(d);
                        }
		    }
		});
	});
    Object.keys(box).forEach(function(d,i){//tnsの作成
	    function rtns(dd) {
		var da = box[dd];
		count.push(da.name); 
		if (da.rtns !== undefined) {
		    return da.rtns;
		}
		return da.rtns = Array.prototype.concat.apply(da.rns, da.rns.map(function(j) {
			    if(count.indexOf(j) == -1){
				console.log(count.indexOf(j));
				return rtns(j);
			    }
			}));
	    }
	    rtns(d);
	    count = [];
	    box[d].rtns = d3.set(box[d].rtns).values();
	    box[d].rtns.some(function(v, i){
		    if (v=="undefined") box[d].rtns.splice(i,1);    
		});	    
	    console.log(box[d]);
	    console.log(box[d].rns);
	    console.log(box[d].rtns);
            function ltns(dd) {
                var da = box[dd];
                count.push(da.name);
                if (da.ltns !== undefined) {
                    return da.ltns;
                }
                return da.ltns = Array.prototype.concat.apply(da.lns, da.lns.map(function(j) {
                            if(count.indexOf(j) == -1){
                                return ltns(j);
                            }
                        }));
            }
            ltns(d);
            count = [];
            box[d].ltns = d3.set(box[d].ltns).values();
            box[d].ltns.some(function(v, i){
                    if (v=="undefined") box[d].ltns.splice(i,1);
                });

            function utns(dd) {
                var da = box[dd];
                count.push(da.name);
                if (da.utns !== undefined) {
                    return da.utns;
                }
                return da.utns = Array.prototype.concat.apply(da.uns, da.uns.map(function(j) {
                            if(count.indexOf(j) == -1){
                                return utns(j);
                            }
                        }));
            }
            utns(d);
            count = [];
            box[d].utns = d3.set(box[d].utns).values();
            box[d].utns.some(function(v, i){
                    if (v=="undefined") box[d].utns.splice(i,1);
                });

            function dtns(dd) {
                var da = box[dd];
                count.push(da.name);
                if (da.dtns !== undefined) {
                    return da.dtns;
                }
                return da.dtns = Array.prototype.concat.apply(da.dns, da.dns.map(function(j) {
                            if(count.indexOf(j) == -1){
                                return dtns(j);
                            }
                        }));
            }
            dtns(d);
            count = [];
            box[d].dtns = d3.set(box[d].dtns).values();
            box[d].dtns.some(function(v, i){
                    if (v=="undefined") box[d].dtns.splice(i,1);
                });
	});
    //Right Horizontal Scan
    var rvalrank = [],
	rrank = []; //FTAを行う順番ぎめ
    Object.keys(box).forEach(function(d,i){
	    var maxcount = 0;
	    //	    if(box[d].x1 >= 0){
	    if(i == 0){
		rrank.push(box[d].name);
		rvalrank.push(box[d].x1);
	    }else{
		for(var j=0; j<rvalrank.length; j++){
		    if(box[d].x1 < rvalrank[j]){
			rvalrank.splice(j, 0, box[d].x1);
			rrank.splice(j, 0, box[d].name);
			maxcount = maxcount + 1;
			    break;
		    }        
		}
		if(maxcount == 0){
		    rrank.push(box[d].name);
		    rvalrank.push(box[d].x1);
		}
		//		}
	    }
	});
    console.log(rrank);
    rrank.forEach(function(dd){
	    //	    console.log(dd);
	    //	    console.log(box["為る"].rns.length);
	    if(box[dd].rns.length != 0){
		//Right Horizontal Scan
		box[dd].rns.sort(function(a,b){
			//			indexa = Math.sqrt( Math.pow(box[dd].x0- box[a].x0, 2) + Math.pow(box[dd].y0- box[a].y0, 2));
			//			indexb = Math.sqrt( Math.pow(box[dd].x0- box[b].x0, 2) + Math.pow(box[dd].y0- box[b].y0, 2));
			return box[a].x0 - box[b].x0});
		//		console.log(box[dd]);
		//		console.log(box[dd].rns);
		var force = ( box[box[dd].rns[0]].w + box[dd].w )/2 - Math.abs( box[box[dd].rns[0]].x0 - box[dd].x0 );
		if( force <= ( box[box[dd].rns[0]].h + box[dd].h )/2 - Math.abs( box[box[dd].rns[0]].y0 - box[dd].y0 ) ){
		    //Right Horizontal Transfer
		    var forcex, forcey;
		    Object.keys(box[dd].rns).forEach(function(d,i){
			    forcex = d3.select("text#" + box[dd].rns[d])[0][0].transform.animVal[0].matrix.e + force;
			    forcey = d3.select("text#" + box[dd].rns[d])[0][0].transform.animVal[0].matrix.f;
			    d3.select("text#" + box[dd].rns[d])
			      .attr("transform", "translate("+ forcex + " , " + forcey  + ")");
			});
		}
	    }
	});

    //left Horizontal Scan
    /*    rvalrank = [];
    rrank = [];
    ccount = 0; //FTAを行う順番ぎめ
    Object.keys(box).forEach(function(d,i){
	    maxcount = 0;
	    if(box[d].x0 < 0){
		if(ccount == 0){
		    rrank.push(box[d].name);
		    rvalrank.push(box[d].x0);
		    ccount = ccount +1;
		}else{
		    for(var j=0; j<rvalrank.length; j++){
			if(box[d].x0 > rvalrank[j]){
			    rvalrank.splice(j, 0, box[d].x0);
			    rrank.splice(j, 0, box[d].name);
			    maxcount = maxcount + 1;
			    break;
			}        
		    }
		    if(maxcount == 0){
			rrank.push(box[d].name);
			rvalrank.push(box[d].x0);
		    }
		    ccount = ccount + 1;
		}
	    }
	});*/
    rrank.forEach(function(dd){
	    if(box[dd].lns.length != 0){
		//left Horizontal Scan
		box[dd].lns.sort(function(a,b){
			//			indexa = Math.sqrt( Math.pow(box[dd].x0- box[a].x0, 2) + Math.pow(box[dd].y0- box[a].y0, 2));
			//			indexb = Math.sqrt( Math.pow(box[dd].x0- box[b].x0, 2) + Math.pow(box[dd].y0- box[b].y0, 2));
			return box[a].x0 - box[b].x0});
		var force = ( box[box[dd].lns[0]].w + box[dd].w )/2 - Math.abs( box[dd].x0 - box[box[dd].lns[0]].x0 );
		if( force <= ( box[box[dd].lns[0]].h + box[dd].h )/2 - Math.abs( box[dd].y0 - box[box[dd].lns[0]].y0 ) ){
		    //left Horizontal Transfer
		    Object.keys(box[dd].lns).forEach(function(d,i){
			    forcex = d3.select("text#" + box[dd].lns[d])[0][0].transform.animVal[0].matrix.e - force;
			    forcey = d3.select("text#" + box[dd].lns[d])[0][0].transform.animVal[0].matrix.f;
			    d3.select("text#" + box[dd].lns[d])
			      .attr("transform", "translate("+ forcex + " , " + forcey  + ")");
			});
		}
	    }
	});

    //Down Horizontal Scan
    /*    rvalrank = [];
    rrank = [];
    ccount = 0; //FTAを行う順番ぎめ
    Object.keys(box).forEach(function(d,i){
	    var maxcount = 0;
	    if(box[d].y0 >= 0){
		if(ccount == 0){
		    rrank.push(box[d].name);
		    rvalrank.push(box[d].x0);
		    ccount = ccount +1;
		}else{
		    for(var j=0; j<rvalrank.length; j++){
			if(box[d].y0 < rvalrank[j]){
			    rvalrank.splice(j, 0, box[d].y0);
			    rrank.splice(j, 0, box[d].name);
			    maxcount = maxcount + 1;
			    break;
			}        
		    }
		    if(maxcount == 0){
			rrank.push(box[d].name);
			rvalrank.push(box[d].y0);
		    }
		    ccount = ccount + 1;
		}
	    }
	});*/
    //    console.log(rrank);
    rrank.forEach(function(dd){
	    if(box[dd].dns.length != 0){
		//Down Horizontal Scan
		box[dd].dns.sort(function(a,b){
			//			indexa = Math.sqrt( Math.pow(box[dd].x0- box[a].x0, 2) + Math.pow(box[dd].y0- box[a].y0, 2));
			//			indexb = Math.sqrt( Math.pow(box[dd].x0- box[b].x0, 2) + Math.pow(box[dd].y0- box[b].y0, 2));
			return box[a].y0 - box[b].y0});
		console.log(box[dd]);
		console.log(box[dd].dns);
		var force = ( box[box[dd].dns[0]].h + box[dd].h )/2 - Math.abs( box[dd].y0- box[box[dd].dns[0]].y0 );
		if( force < ( box[box[dd].dns[0]].w + box[dd].w )/2 - Math.abs( box[dd].x0- box[box[dd].dns[0]].x0 ) ){
		    //Down Horizontal Transfer
		    var forcex, forcey;
		    Object.keys(box[dd].dns).forEach(function(d,i){
			    forcex = d3.select("text#" + box[dd].dns[d])[0][0].transform.animVal[0].matrix.e;
			    forcey = d3.select("text#" + box[dd].dns[d])[0][0].transform.animVal[0].matrix.f + force;
			    d3.select("text#" + box[dd].dns[d])
			      .attr("transform", "translate("+ forcex + " , " + forcey  + ")");
			});
		}
	    }
	});

    //Up Horizontal Scan
    /*    rvalrank = [];
    rrank = [];
    ccount = 0; //FTAを行う順番ぎめ
    Object.keys(box).forEach(function(d,i){
	    var maxcount = 0;
	    if(box[d].y0 < 0){
		if(ccount == 0){
		    rrank.push(box[d].name);
		    rvalrank.push(box[d].x0);
		    ccount = ccount +1;
		}else{
		    for(var j=0; j<rvalrank.length; j++){
			if(box[d].y0 > rvalrank[j]){
			    rvalrank.splice(j, 0, box[d].y0);
			    rrank.splice(j, 0, box[d].name);
			    maxcount = maxcount + 1;
			    break;
			}        
		    }
		    if(maxcount == 0){
			rrank.push(box[d].name);
			rvalrank.push(box[d].y0);
		    }
		    ccount = ccount + 1;
		}
	    }
	});*/
    rrank.forEach(function(dd){
	    if(box[dd].uns.length != 0){
		//Up Horizontal Scan
		box[dd].uns.sort(function(a,b){
			//			indexa = Math.sqrt( Math.pow(box[dd].x0- box[a].x0, 2) + Math.pow(box[dd].y0- box[a].y0, 2));
			//			indexb = Math.sqrt( Math.pow(box[dd].x0- box[b].x0, 2) + Math.pow(box[dd].y0- box[b].y0, 2));
			return box[a].y0 - box[b].y0});
		var force = ( box[box[dd].uns[0]].h + box[dd].h )/2 - Math.abs( box[dd].y0- box[box[dd].uns[0]].y0 );
		if( force < ( box[box[dd].uns[0]].w + box[dd].w )/2 - Math.abs( box[dd].x0- box[box[dd].uns[0]].x0 ) ){
		    //Up Horizontal Transfer
		    var forcex, forcey;
		    Object.keys(box[dd].uns).forEach(function(d,i){
			    forcex = d3.select("text#" + box[dd].uns[d])[0][0].transform.animVal[0].matrix.e;
			    forcey = d3.select("text#" + box[dd].uns[d])[0][0].transform.animVal[0].matrix.f - force;
			    d3.select("text#" + box[dd].uns[d])
			      .attr("transform", "translate("+ forcex + " , " + forcey  + ")");
			});
		}
	    }
	});
}

function draw(data, bounds) {
    //    statusText.style("display", "none");
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
	.attr("id", function(d){return d.tag})
	.attr("tag", function(d){
		return d.tag})
       	.attr("transform", function(d) { return "translate(" + [tagbox2[d.tag]["x"], tagbox2[d.tag]["y"]] + ")"; })
	//	.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
	.style({"font-size": function(d) { return d.size + "px"; }})
	.style("cursor", "hand")
	.text(function(d) { return d.name; })
	.on("click", highlights)
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
    text.style("fill", "black" /*  function(d) { return fill(d.text.toLowerCase()); } */ )
	.style("font-weight", "bold")
        .style("opacity", 1)
	.text(function(d) { return d.text; });
    text.transition()
        .duration(1000);
    var exitGroup = background.append("g")
	.attr("transform", vis.attr("transform"));
    vis.transition()
	.delay(1000)
	.duration(750)
	.attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
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
function highlights(d){
    var i = 1;
    while(i < 32){
	if(tagbox2[d.tag][i] == undefined){
	    break;
	}else{
	    var j = 0;
	    while(j < 352){
		if(tagbox2[d.tag][i] == document.getElementsByClassName("vertices")[0].getElementsByTagName("text")[j].textContent){
	        }
		j = j + 1;
	    }
	}
	i = i + 1;
    }
}

var cor_value,
    words = [];
var tagbox;
var tagbox2 = {};
var scale = d3.scale.linear()
    .domain([-0.5, 0.5])
    .range([-$('#vis').width()/2, $('#vis').width()/2]);
var xpmax = 0, xmmax = 0, ypmax = 0, ymmax = 0;
d3.csv('data/pen/mds.csv', function(d) {//data about tags
	tagbox = d;
	d.forEach(function(dd){
		if(dd["prex"] > xpmax){
		    xpmax = dd["prex"];
		}else if(dd["prex"] < xmmax){
		    xmmax = dd["prex"];
		}
                if(dd["prey"] > ypmax){
                    ypmax = dd["prey"];
                }else if(dd["prey"] < ymmax){
                    ymmax = dd["prey"];
                }
	    });

	var xscale = d3.scale.linear()
	    .domain([-0.3, 0.3])
	    .range([-$('#vis').width()/2, $('#vis').width()/2]);
	var yscale = d3.scale.linear()
	    .domain([-0.2, 0.2])
	    .range([-$('#vis').height()/2, $('#vis').height()/2]);
	
	d.forEach(function(dd){
		dd.x = xscale(dd["prex"]);
		dd.y = yscale(dd["prey"]);
		tagbox2[dd["tag"]] = dd;
	});
    }
);

var sentencebox;
d3.csv('data/pen/mor-node_words_weight.csv', function(d) {//data about tags
        sentencebox = d;
    }
);

var namebox = [];
d3.csv('data/pen/unidic.csv', function(d) {
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
