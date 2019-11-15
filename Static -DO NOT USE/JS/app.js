var padding={top:20, right:40,bottom:0,left:0},
w=500-padding.left - padding.right,
h=500-padding.top - padding.bottom,
r=Math.min(w,h)/2
rotation=0,
oldrotation=0,
picked=100000,
oldpick=[],
color=d3.scale.category20();

var data =[
            {"label":"$100,000","value":1 , "category":"People"},
            {"label":"$60,000","value":2 , "category":"Before and After"},
            {"label":"$50,000","value":3,"category":"Thing"},
            {"label":"$30,000","value":4,"category":"Event"},
            {"label":"$50,000","value":5,"category":"Food and Drink"},
            {"label":"$80,000", "value":6,"category":"Movie Title"},
            {"label":"$55,000","value":7,"category":"People"},
            {"label":"$40,000","value":8,"category":"Phrase"},
            {"label":"$30,000","value":9,"category":"Place"},
            {"label":"$90,000","value":10,"category":"Living Thing"},
            {"label":"$50,000", "value":11,"category":"Movie Title"},
            {"label":"$30,000","value":12,"category":"Event"},
            {"label":"$90,000","value":13,"category":"Thing"},
            {"label":"Bankrupt","value":14,"category":"Oh better luck next time"},
            {"label":"$60,000","value":15,"category":"Food and Drink"},
            {"label":"$40,000", "value":16,"category":"People"},
            {"label":"$30,000","value":17,"category":"Person"},
            {"label":"Lose a turn","value":18,"category":"You lost a turn"},
            {"label":"$80,000","value":19,"category":"Event"},
            {"label":"$35,000","value":20,"category":"Before and after"},
            {"label":"$45,000","value":21,"category":"Event"},
            {"label":"$70,000","value":22,"category":"Food and Drink"},
        ];

var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width", w + padding.left + padding.right)
            .attr("height",h + padding.top + padding.bottom);

 var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," +(h/2 + padding.top) + ")");

var vis = container
            .append("g");
        
var pie = d3.layout.pie().sort(null).value(function(d){return 1;});

var arc = d3.svg.arc().outerRadius(r);

var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class","slice");

        arcs.append("path")
            .attr("fill", function(d,i){return color(i); })
            .attr("d", function(d) {return arc(d); });

        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + (d.outerRadius -10) +")";
        })
            .attr("text-anchor", "end")
            .text(function(d, i) {
                return data[i].label;
            });
        
        container.on("click", spin);


function spin(d){
            if(oldpick.length == (data.length - 1)){
                console.log("done");
                container.on("click",null);
                return;
            }

var ps = 360/data.length,
            pieslice = Math.round(1440/data.length),
            rng = Math.floor((Math.random() * 1440) + 360);

            rotation = (Math.round(rng/ps) *ps);

            picked = Math.round(data.length - (rotation %360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;
            
            if(oldpick.indexOf(picked) !==-1){
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }

            rotation +=90 - Math.round(ps/2);

            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){
                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#EEEEEE");

                    d3.select("#category h1")
                        .text(data[picked].category);
                    oldrotation = rotation;
                });
        }
        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"black"});

        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .style({"fill":"white","cursor":"pointer"});

        //spin text
        container.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({"font-weight":"bold", "font-size":"30px"});
        
        
function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                //no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }

            return array;
        }