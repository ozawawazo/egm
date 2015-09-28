//rnsの基準点はtextの右上？左下？中心点？

var fill = d3.scale.category10();

var w = $('#display-wrapper-tag').width(), 
    h = 564;

var scale = 1;
//    statusText = d3.select("#status");
var directry = 'data/car15/';
var box = [];

// for experiment
var myFirebaseRef = new Firebase("https://nodevis-experiment.firebaseio.com/"),
    start = new Date(),
    now;

function correct(d){
    console.log(d);
    now = new Date();
    myFirebaseRef.push({
	    //	    author: "Firebase",
	    task : "1",
		result: "Correct",
		answer: d,
		time: parseInt((now.getTime() - start.getTime()) / 1000)
	});
    alert("正解です。このウィンドウを閉じて次のタスクを行ってください。");
}
function incorrect(d){
    now = new Date();
    myFirebaseRef.push({
            //      author: "Firebase",
	    task : "1",
		result: "Incorrect",
		answer: d,
		time: parseInt((now.getTime() - start.getTime()) / 1000)
		});
    alert("不正解です。このウィンドウを閉じて次のタスクを行ってください。");

}


var weight;
var sent,befoword;
d3.csv( directry + 'word-sentence.csv', function(dd) {
	weight = dd;
    });



d3.select('#recreate-tagcloud')
    .on('submit', function() {
	    console.log("aaaa");
	    //タグのcountを設定する。

    }
	);

//trash

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

jQuery.fn.d3Click = function () {
    this.each(function (i, e) {
	    var evt = document.createEvent("MouseEvents");
	    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	    e.dispatchEvent(evt);
	});
};

/*
function multilist() {//add tag to multilist
    if (!document.createElement) return;

    words.forEach(function(words2){
            var opt = document.createElement("option");
            opt.className = "elem-selectable";
	    var str = document.createTextNode(words2.tag);
	    opt.appendChild(str);//add tag's info
	    document.getElementsByName("multi-select")[0].insertBefore(opt, null);//add tag to list
        });

    $(function(){
	    $('#multi-select').multiSelect({
		    selectableHeader: "<div class='custom-header'>Add tags</div>",
			selectionHeader: "<div class='custom-header'>Remove tags</div>"	
			});
	});
}
*/

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