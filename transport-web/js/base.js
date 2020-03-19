$(function () {
//    echart_1();
	
    //echart_1 中国地图
    function echart_1() {
        // 基于准备好的dom，初始化echarts实例
        $.getJSON("/transport/json/chinamap",function(result){
            var myChart = echarts.init(document.getElementById('chart_1'));
   
            var mapName = 'china'
            var data = []
            var toolTipData = [];
    
            /*获取地图数据*/
            myChart.showLoading();
            var mapFeatures = echarts.getMap(mapName).geoJson.features;
            myChart.hideLoading();
            var geoCoordMap =result.axis ;
            var GZData=result.value;
    
            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var fromCoord = geoCoordMap[dataItem[0].name];
                    var toCoord = geoCoordMap[dataItem[1].name];
                    if (fromCoord && toCoord) {
                        res.push({
                            fromName: dataItem[0].name,
                            toName: dataItem[1].name,
                            coords: [fromCoord, toCoord]
                        });
                    }
                }
                return res;
            };
    
            var color = ['#c5f80e'];
            var series = [];
            [
                ['测试', GZData]
            ].forEach(function (item, i) {
                series.push({
                    name: item[0],
                    type: 'lines',
                    zlevel: 2,
                    symbol: ['none', 'arrow'],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: 'arrow',
                        symbolSize: 5
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                }, {
                    name: item[0],
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'left',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 8;
                    },
                    itemStyle: {
                        normal: {
                            color: color[i]
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                });
            });
    
            option = {
                tooltip: {
                    trigger: 'item'
                },
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            //          	color: '#ddd',
                            borderColor: 'rgba(147, 235, 248, 1)',
                            borderWidth: 1,
                            areaColor: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(	47,79,79, .1)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: 'rgba(128, 217, 248, 1)',
                            // shadowColor: 'rgba(255, 255, 255, 1)',
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 0
                        }
                    }
                },
                series: series
            };
   
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        }); 
    }
    //echart_2 中国铁路
    function echart_2() {
     // 基于准备好的dom，初始化echarts图表
     var myChart = echarts2.init(document.getElementById('chart_2'));
     var effect = {
         show: true,
         scaleSize: 1,
         period: 30, // 运动周期，无单位，值越大越慢
         color: '#fff',
         shadowColor: 'rgba(220,220,220,0.4)',
         shadowBlur: 5
     };

     function itemStyle(idx) {
         return {
             normal: {
                 color: '#fff',
                 borderWidth: 1,
                 borderColor: ['rgba(30,144,255,1)', 'lime'][idx],
                 lineStyle: {
                     //shadowColor : ['rgba(30,144,255,1)','lime'][idx], //默认透明
                     //shadowBlur: 10,
                     //shadowOffsetX: 0,
                     //shadowOffsetY: 0,
                     type: 'solid'
                 }
             }
         }
     };
     option = {
         color: ['rgba(30,144,255,1)', 'lime'],
         title: {
             text: '',
             subtext: '',
             sublink: '',
             x: 'center',
             textStyle: {
                 color: '#fff'
             }
         },
         tooltip: {
             trigger: 'item',
             formatter: '{b}'
         },
         legend: {
             orient: 'vertical',
             x: '2%',
             y: '3%',
             selectedMode: 'single',
             data: '',
             textStyle: {
                 color: '#fff'
             }
         },
         toolbox: {
             show: true,
             orient: 'vertical',
             x: 'right',
             y: 'center',
             padding: [0 ,30, 0 ,0],
             feature: {
                 mark: {
                     show: true
                 },
                 dataView: {
                     show: true,
                     readOnly: false
                 },
                 restore: {
                     show: true
                 },
                 saveAsImage: {
                     show: true
                 }
             }
         },
        series: '',
     };

     // 为echarts对象加载数据 
     myChart.setOption(option);
	 
    $.getJSON("/transport/json/chinarailway",function(result){
        var d=result.data;
		var s=[];
		for (var i=0; i < d.length; i++) {
			s.push({
                 name: d[i].name,
                 type: 'map',
                 roam: true,
                 hoverable: false,
                 mapType: 'china',
                 itemStyle: {
                     normal: {
                         borderColor: 'rgba(100,149,237,1)',
                         borderWidth: 0.5,
                         areaStyle: {
                             color: '#1b1b1b'
                         }
                     }
                 },
                 data: [],
                 markLine: {
                     symbol: ['circle', 'circle'],
                     symbolSize: 1,
                     effect: effect,
                     itemStyle: itemStyle(i),
                     smooth: true,
                     data: d[i].value
				 },
                 geoCoord: result.geo
			})
		};

        myChart.setOption({
            title: '',
            legend: {data: result.label},
            series: s
        });
	});
	 
     window.addEventListener("resize",function(){
         myChart.resize();
     });

    }
    //echart_4_1 运输线路长度1
    function echart_4_1() {
        var myChart = echarts.init(document.getElementById('chart_4_1'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '5%'
            },
            grid: {
                left: '3%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/lengthline",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_4_2 运输线路长度2
    function echart_4_2() {
        var myChart = echarts.init(document.getElementById('chart_4_2'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '10%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/lengthline",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_5 铁路客运站
    function echart_5() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_5'));
        
        option = {
           // backgroundColor: '#404a59',
            title: {
                text: '',
                subtext: '',
                sublink: '',
                left: 'center',
                y: '10%',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item',
        		formatter: function (params) {
                      if(typeof(params.value)[2] == "undefined"){
                      	return params.name + ' : ' + params.value;
                      }else{
                      	return params.name + ' : ' + params.value[2];
                      }
                    }
            },
        
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data:'',
                textStyle: {
                    color: '#fff'
                }
            },

            visualMap: {
        		x: '5%',
        		y: '80%',
                min: '',
                max: '',
                splitNumber: 5,
                color: ['#d94e5d','#eac736','#50a3ba'],
                textStyle: {
                    color: '#fff'
                }
            },
          
            geo: {
                show: true,
                map: 'china',
                maptype: 'china',
                label: {
                    normal: {
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: true,//禁止其放大缩小
                itemStyle: {
                    normal: {
                        //          	color: '#ddd',
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 1,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(	47,79,79, .2)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
            },
            series : [{
                name: '',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: '',
                symbolSize: '',
//                symbolSize: function (val) {
//                    return val[2] / 250 + 6;
//                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffeb7b'
                    }
                }
            },{
                name: '',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: '',
//                data: convertData(data.sort(function (a, b) {
//                    return b.value - a.value;
//                }).slice(0, 5)),

                symbolSize: '',  
//                symbolSize: function (val) {
//                   return val[2] / 2.5 + 6;
//                },

                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffd800',
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,.3)'
                    }
                },
                zlevel: 1
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        $.getJSON("/transport/json/railwaytraveller", function(result) {
            var data = result.data
            var geoCoordMap = result.axis
            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };

            myChart.setOption({
                title: {text: result.name, subtext: result.subname, sublink: result.sublink},
                legend: {data: ''},
                visualMap:{max: result.max, min: result.min}, 
                series:[
                    {name: '', data: convertData(data), symbolSize: function (val) {return val[2] *15/ result.max + 6;}},
                    {name: '', data: convertData(data.sort(function (a, b) {return b.value - a.value;}).slice(0, 5)), 
                    symbolSize: function (val) {return val[2] *15/ result.max + 6;}}
                ]
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    } 
    //echart_6 铁路货运站
    function echart_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_6'));
        
        option = {
           // backgroundColor: '#404a59',
            title: {
                text: '',
                subtext: '',
                sublink: '',
                left: 'center',
                y: '10%',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item',
        		formatter: function (params) {
                      if(typeof(params.value)[2] == "undefined"){
                      	return params.name + ' : ' + params.value;
                      }else{
                      	return params.name + ' : ' + params.value[2];
                      }
                    }
            },
        
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data:'',
                textStyle: {
                    color: '#fff'
                }
            },

            visualMap: {
        		x: '5%',
        		y: '80%',
                min: '',
                max: '',
                splitNumber: 5,
                color: ['#d94e5d','#eac736','#50a3ba'],
                textStyle: {
                    color: '#fff'
                }
            },
          
            geo: {
                show: true,
                map: 'china',
                maptype: 'china',
                label: {
                    normal: {
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: true,//禁止其放大缩小
                itemStyle: {
                    normal: {
                        //          	color: '#ddd',
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 1,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(	47,79,79, .2)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
            },
            series : [{
                name: '',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: '',
                symbolSize: '',
//                symbolSize: function (val) {
//                    return val[2] / 250 + 6;
//                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffeb7b'
                    }
                }
            },{
                name: '',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: '',
//                data: convertData(data.sort(function (a, b) {
//                    return b.value - a.value;
//                }).slice(0, 5)),

                symbolSize: '',  
//                symbolSize: function (val) {
//                   return val[2] / 2.5 + 6;
//                },

                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffd800',
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,.3)'
                    }
                },
                zlevel: 1
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        $.getJSON("/transport/json/railwayfreight", function(result) {
            var data = result.data
            var geoCoordMap = result.axis
            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };

            myChart.setOption({
                title: {text: result.name, subtext: result.subname, sublink: result.sublink},
                legend: {data: ''},
                visualMap:{max: result.max, min: result.min}, 
                series:[
                    {name: '', data: convertData(data), symbolSize: function (val) {return val[2] *15/ result.max + 6;}},
                    {name: '', data: convertData(data.sort(function (a, b) {return b.value - a.value;}).slice(0, 100)), 
                    symbolSize: function (val) {return val[2] *15/ result.max + 6;}}
                ]
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    //echart_7 民用汽车数
    function echart_7(){
        var myChart = echarts.init(document.getElementById('chart_7'));
        myChart.clear();

        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                top: '2%',
                left: '1%',
                textStyle: {
                    color: '#fff'
                },
                data: ''
            },
            color: '',
            series: '',            
        };


        myChart.setOption(option);

        $.getJSON("/transport/json/motor",function(result){
            var d=result.data
            var seriesData=[]
            for (var i=0;i<d.length;i+=2){
                seriesData.push({
                    name: result.data[i].name, 
                    type: 'pie',
                    selectedMode: 'single',
                    radius: result.data[i].radius, 
                    center: result.data[i].center,
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: result.data[i].data
                },{
                    name: result.data[i+1].name, 
                    type: 'pie',
                    radius: result.data[i+1].radius, 
                    center: result.data[i+1].center, 
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data: result.data[i+1].data
                })
            };
            myChart.setOption({
                legend: {data: result.label},
                color: result.color,
                series: seriesData,
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }	
    //echart_8 运输吞吐量
    function echart_8(){
        var myChart = echarts.init(document.getElementById('chart_8'));
        myChart.clear();

        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                top: '2%',
                left: '1%',
                textStyle: {
                    color: '#fff'
                },
                data: ''
            },
            color: '',
            series: '',            
        };

        myChart.setOption(option);

        $.getJSON("/transport/json/traffic",function(result){
            var d=result.data
            var seriesData=[]
            for (var i=0;i<d.length;i+=2){
                seriesData.push({
                    name: result.data[i].name, 
                    type: 'pie',
                    selectedMode: 'single',
                    radius: result.data[i].radius, 
                    center: result.data[i].center,
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: result.data[i].data
                },{
                    name: result.data[i+1].name, 
                    type: 'pie',
                    radius: result.data[i+1].radius, 
                    center: result.data[i+1].center, 
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data: result.data[i+1].data
                })
            };
            myChart.setOption({
                legend: {data: result.label},
                color: result.color,
                series: seriesData,
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    //echart_9 运输就业
    function echart_9() {
        var myChart = echarts.init(document.getElementById('chart_9'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '15%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '30%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: false},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/employ",function(result){
            myChart.setOption({
                title: '',
                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
	//echart_10 前十海港
    function echart_10() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_10'));
        myChart.clear();
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}百万吨"
            },
            legend: {
                x: 'center',
                y: '15%',
                data: '',
                icon: 'circle',
                textStyle: {
                    color: '#fff',
                }
            },
            calculable: true,
            series: [{
                name: '',
                type: 'pie',
                //起始角度，支持范围[0, 360]
                startAngle: 0,
                //饼图的半径，数组的第一项是内半径，第二项是外半径
                radius: ['5%', '80%'],
                //支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
                center: ['50%', '40%'],
                //是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
                // 'radius' 面积展现数据的百分比，半径展现数据的大小。
                //  'area' 所有扇区面积相同，仅通过半径展现数据大小
                roseType: 'area',
                startAngle: 0 ,
                //是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
                avoidLabelOverlap: false,
                color: '',
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}: {c}百万吨'
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length2: 1,
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: ''
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        $.getJSON("/transport/json/portTEU",function(result){
            myChart.setOption({
                legend: {data: result.label},
                series: [{color: result.color, data: result.data}]
            });
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    //echart_11 港口泊位
    function echart_11() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_11'));
        
        option = {
           // backgroundColor: '#404a59',
            title: {
                text: '',
                subtext: '',
                sublink: '',
                left: 'center',
                y: '10%',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item',
        		formatter: function (params) {
                      if(typeof(params.value)[2] == "undefined"){
                      	return params.name + ' : ' + params.value;
                      }else{
                      	return params.name + ' : ' + params.value[2];
                      }
                    }
            },
        
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data:'',
                textStyle: {
                    color: '#fff'
                }
            },

            visualMap: {
        		x: '5%',
        		y: '80%',
                min: '',
                max: '',
                splitNumber: 5,
                color: ['#d94e5d','#eac736','#50a3ba'],
                textStyle: {
                    color: '#fff'
                }
            },
          
            geo: {
                show: true,
                map: 'china',
                maptype: 'china',
                label: {
                    normal: {
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: true,//禁止其放大缩小
                itemStyle: {
                    normal: {
                        //          	color: '#ddd',
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 1,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(	47,79,79, .2)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
            },
            series : [{
                name: '',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: '',
                symbolSize: '',
//                symbolSize: function (val) {
//                    return val[2] / 250 + 6;
//                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffeb7b'
                    }
                }
            },{
                name: '',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: '',
//                data: convertData(data.sort(function (a, b) {
//                    return b.value - a.value;
//                }).slice(0, 5)),

                symbolSize: '',  
//                symbolSize: function (val) {
//                   return val[2] / 2.5 + 6;
//                },

                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffd800',
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,.3)'
                    }
                },
                zlevel: 1
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        $.getJSON("/transport/json/portberth", function(result) {
            var data = result.data
            var geoCoordMap = result.axis
            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };

            myChart.setOption({
                title: {text: result.name, subtext: result.subname, sublink: result.sublink},
                legend: {data: ''},
                visualMap:{max: result.max, min: result.min}, 
                series:[
                    {name: '', data: convertData(data), symbolSize: function (val) {return val[2] *15 / result.max + 6;}},
                    {name: '', data: convertData(data.sort(function (a, b) {return b.value - a.value;}).slice(0, 5)), 
                    symbolSize: function (val) {return val[2] *15 / result.max + 6;}}
                ]
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    //echart_12 港口万吨泊位
    function echart_12() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_12'));
        
        option = {
           // backgroundColor: '#404a59',
            title: {
                text: '',
                subtext: '',
                sublink: '',
                left: 'center',
                y: '10%',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item',
        		formatter: function (params) {
                      if(typeof(params.value)[2] == "undefined"){
                      	return params.name + ' : ' + params.value;
                      }else{
                      	return params.name + ' : ' + params.value[2];
                      }
                    }
            },
        
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data:'',
                textStyle: {
                    color: '#fff'
                }
            },

            visualMap: {
        		x: '5%',
        		y: '80%',
                min: '',
                max: '',
                splitNumber: 5,
                color: ['#d94e5d','#eac736','#50a3ba'],
                textStyle: {
                    color: '#fff'
                }
            },
          
            geo: {
                show: true,
                map: 'china',
                maptype: 'china',
                label: {
                    normal: {
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: true,//禁止其放大缩小
                itemStyle: {
                    normal: {
                        //          	color: '#ddd',
                        borderColor: 'rgba(147, 235, 248, 1)',
                        borderWidth: 1,
                        areaColor: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(	47,79,79, .2)' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        shadowColor: 'rgba(128, 217, 248, 1)',
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
            },
            series : [{
                name: '',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: '',
                symbolSize: '',
//                symbolSize: function (val) {
//                    return val[2] / 250 + 6;
//                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffeb7b'
                    }
                }
            },{
                name: '',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: '',
//                data: convertData(data.sort(function (a, b) {
//                    return b.value - a.value;
//                }).slice(0, 5)),

                symbolSize: '',  
//                symbolSize: function (val) {
//                   return val[2] / 2.5 + 6;
//                },

                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffd800',
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,.3)'
                    }
                },
                zlevel: 1
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        $.getJSON("/transport/json/portWDB", function(result) {
            var data = result.data
            var geoCoordMap = result.axis
            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };

            myChart.setOption({
                title: {text: result.name, subtext: result.subname, sublink: result.sublink},
                legend: {data: ''},
                visualMap:{max: result.max, min: result.min}, 
                series:[
                    {name: '', data: convertData(data), symbolSize: function (val) {return val[2] *15/ result.max + 6;}},
                    {name: '', data: convertData(data.sort(function (a, b) {return b.value - a.value;}).slice(0, 5)), 
                    symbolSize: function (val) {return val[2] *15/ result.max + 6;}}
                ]
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    //echart_13_1 快递发送量
    function echart_13_1() {
        var myChart = echarts.init(document.getElementById('chart_13_1'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '5%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/express",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_13_2 邮政发送量
    function echart_13_2() {
        var myChart = echarts.init(document.getElementById('chart_13_2'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '10%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/postal",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_14_1 客运平均距离
    function echart_14_1() {
        var myChart = echarts.init(document.getElementById('chart_14_1'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '5%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/lengthtraveller",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_14_2 货运平均距离
    function echart_14_2() {
        var myChart = echarts.init(document.getElementById('chart_14_2'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '10%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/lengthfreight",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_15_1 互联网人数
    function echart_15_1() {
        var myChart = echarts.init(document.getElementById('chart_15_1'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '5%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/netpeople",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_15_2 互联网端口数
    function echart_15_2() {
        var myChart = echarts.init(document.getElementById('chart_15_2'));
        myChart.clear();
        option = {
            title: { 
                text: '',
                x: 'center',
                top: '2%',
                textStyle: {
                    color: '#fff',
                    fontSize: 24
                }
            },

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 16
                },
                top: '10%'
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            toolbox: {
                orient: 'vertical',
                right: '1%',
                top: '2%',
                iconStyle: {
                    color: '#FFEA51',
                    borderColor: '#FFA74D',
                    borderWidth: 1,
                },
                feature: {
                    saveAsImage: {show: true},
                    magicType: {
                        show: true,
                        type: ['line','bar','stack','tiled']
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    rotate: 30,
                }
            },
            yAxis: {
                name: '',
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            color: '',
            series: '',
        };
        myChart.setOption(option);
        $.getJSON("/transport/json/netport",function(result){
            myChart.setOption({
                title: '',
//                legend: {data: result.legend},
                xAxis: {data: result.xlabel},
                yAxis: {name: result.yname},
                color: result.color,
                series: result.series
            });
        });

        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    //echart_3 GPS
    function echart_3(){
        var myChart = echarts.init(document.getElementById('chart_3'));

        var data = [
             {name: '海门', value: 9,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '鄂尔多斯', value: 12,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '招远', value: 12,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '舟山', value: 12,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '齐齐哈尔', value: 14,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '盐城', value: 15,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '赤峰', value: 16,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '青岛', value: 18,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '乳山', value: 18,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '金昌', value: 19,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '泉州', value: 21,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '莱西', value: 21,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '日照', value: 21,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '胶南', value: 22,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '南通', value: 23,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '拉萨', value: 24,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '云浮', value: 24,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '梅州', value: 25,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '文登', value: 25,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '上海', value: 25,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '攀枝花', value: 25,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '威海', value: 25,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '承德', value: 25,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '厦门', value: 26,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '汕尾', value: 26,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '潮州', value: 26,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '丹东', value: 27,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '太仓', value: 27,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '曲靖', value: 27,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '烟台', value: 28,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '福州', value: 29,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '瓦房店', value: 30,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '即墨', value: 30,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '抚顺', value: 31,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '玉溪', value: 31,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '张家口', value: 31,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '阳泉', value: 31,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '莱州', value: 32,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '湖州', value: 32,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '汕头', value: 32,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '昆山', value: 33,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '宁波', value: 33,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '湛江', value: 33,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '揭阳', value: 34,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '荣成', value: 34,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '连云港', value: 35,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '葫芦岛', value: 35,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '常熟', value: 36,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '东莞', value: 36,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '河源', value: 36,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '淮安', value: 36,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '泰州', value: 36,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '南宁', value: 37,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '营口', value: 37,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '惠州', value: 37,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '江阴', value: 37,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '蓬莱', value: 37,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '韶关', value: 38,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '嘉峪关', value: 38,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '广州', value: 38,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '延安', value: 38,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '太原', value: 39,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '清远', value: 39,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '中山', value: 39,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '昆明', value: 39,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '寿光', value: 40,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '盘锦', value: 40,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '长治', value: 41,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '深圳', value: 41,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '珠海', value: 42,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '宿迁', value: 43,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '咸阳', value: 43,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '铜川', value: 44,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '平度', value: 44,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '佛山', value: 44,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '海口', value: 44,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '江门', value: 45,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '章丘', value: 45,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '肇庆', value: 46,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '大连', value: 47,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '临汾', value: 47,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '吴江', value: 47,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '石嘴山', value: 49,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '沈阳', value: 50,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '苏州', value: 50,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '茂名', value: 50,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '嘉兴', value: 51,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '长春', value: 51,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '胶州', value: 52,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '银川', value: 52,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '张家港', value: 52,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '三门峡', value: 53,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '锦州', value: 54,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '南昌', value: 54,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '柳州', value: 54,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '三亚', value: 54,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '自贡', value: 56,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '吉林', value: 56,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '阳江', value: 57,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '泸州', value: 57,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '西宁', value: 57,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '宜宾', value: 58,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '呼和浩特', value: 58,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '成都', value: 58,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '大同', value: 58,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '镇江', value: 59,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '桂林', value: 59,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '张家界', value: 59,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '宜兴', value: 59,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '北海', value: 60,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '西安', value: 61,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '金坛', value: 62,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '东营', value: 62,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '牡丹江', value: 63,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '遵义', value: 63,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '绍兴', value: 63,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '扬州', value: 64,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '常州', value: 64,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '潍坊', value: 65,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '重庆', value: 66,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '台州', value: 67,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '南京', value: 67,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '滨州', value: 70,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '贵阳', value: 71,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '无锡', value: 71,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '本溪', value: 71,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '克拉玛依', value: 72,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '渭南', value: 72,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '马鞍山', value: 72,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '宝鸡', value: 72,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '焦作', value: 75,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '句容', value: 75,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '北京', value: 79,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '徐州', value: 79,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '衡水', value: 80,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '包头', value: 80,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '绵阳', value: 80,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '乌鲁木齐', value: 84,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '枣庄', value: 84,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '杭州', value: 84,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '淄博', value: 85,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '鞍山', value: 86,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '溧阳', value: 86,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '库尔勒', value: 86,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '安阳', value: 90,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '开封', value: 90,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '济南', value: 92,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '德阳', value: 93,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '温州', value: 95,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '九江', value: 96,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '邯郸', value: 98,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '临安', value: 99,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '兰州', value: 99,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '沧州', value: 100,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '临沂', value: 103,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '南充', value: 104,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '天津', value: 105,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '富阳', value: 106,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '泰安', value: 112,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '诸暨', value: 112,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '郑州', value: 113,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '哈尔滨', value: 114,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '聊城', value: 116,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '芜湖', value: 117,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '唐山', value: 119,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '平顶山', value: 119,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '邢台', value: 119,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '德州', value: 120,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '济宁', value: 120,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '荆州', value: 127,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '宜昌', value: 130,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '义乌', value: 132,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '丽水', value: 133,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '洛阳', value: 134,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '秦皇岛', value: 136,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '株洲', value: 143,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '石家庄', value: 147,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '莱芜', value: 148,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '常德', value: 152,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '保定', value: 153,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '湘潭', value: 154,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '金华', value: 157,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '岳阳', value: 169,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '长沙', value: 175,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '衢州', value: 177,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '廊坊', value: 170,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '菏泽', value: 175,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {name: '合肥', value: 180,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'},
             {
                name: '武汉', 
                value: 190,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'
            },
            {
                name: '大庆', 
                value: 150,
                address:'二道区东环域路2038号',
                typeName:'联运',
                area:'0.18',
                service:'东北地区'
            }
        ];
        var geoCoordMap = {
            '海门':[121.15,31.89],
            '鄂尔多斯':[109.781327,39.608266],
            '招远':[120.38,37.35],
            '舟山':[122.207216,29.985295],
            '齐齐哈尔':[123.97,47.33],
            '盐城':[120.13,33.38],
            '赤峰':[118.87,42.28],
            '青岛':[120.33,36.07],
            '乳山':[121.52,36.89],
            '金昌':[102.188043,38.520089],
            '泉州':[118.58,24.93],
            '莱西':[120.53,36.86],
            '日照':[119.46,35.42],
            '胶南':[119.97,35.88],
            '南通':[121.05,32.08],
            '拉萨':[91.11,29.97],
            '云浮':[112.02,22.93],
            '梅州':[116.1,24.55],
            '文登':[122.05,37.2],
            '上海':[121.48,31.22],
            '攀枝花':[101.718637,26.582347],
            '威海':[122.1,37.5],
            '承德':[117.93,40.97],
            '厦门':[118.1,24.46],
            '汕尾':[115.375279,22.786211],
            '潮州':[116.63,23.68],
            '丹东':[124.37,40.13],
            '太仓':[121.1,31.45],
            '曲靖':[103.79,25.51],
            '烟台':[121.39,37.52],
            '福州':[119.3,26.08],
            '瓦房店':[121.979603,39.627114],
            '即墨':[120.45,36.38],
            '抚顺':[123.97,41.97],
            '玉溪':[102.52,24.35],
            '张家口':[114.87,40.82],
            '阳泉':[113.57,37.85],
            '莱州':[119.942327,37.177017],
            '湖州':[120.1,30.86],
            '汕头':[116.69,23.39],
            '昆山':[120.95,31.39],
            '宁波':[121.56,29.86],
            '湛江':[110.359377,21.270708],
            '揭阳':[116.35,23.55],
            '荣成':[122.41,37.16],
            '连云港':[119.16,34.59],
            '葫芦岛':[120.836932,40.711052],
            '常熟':[120.74,31.64],
            '东莞':[113.75,23.04],
            '河源':[114.68,23.73],
            '淮安':[119.15,33.5],
            '泰州':[119.9,32.49],
            '南宁':[108.33,22.84],
            '营口':[122.18,40.65],
            '惠州':[114.4,23.09],
            '江阴':[120.26,31.91],
            '蓬莱':[120.75,37.8],
            '韶关':[113.62,24.84],
            '嘉峪关':[98.289152,39.77313],
            '广州':[113.23,23.16],
            '延安':[109.47,36.6],
            '太原':[112.53,37.87],
            '清远':[113.01,23.7],
            '中山':[113.38,22.52],
            '昆明':[102.73,25.04],
            '寿光':[118.73,36.86],
            '盘锦':[122.070714,41.119997],
            '长治':[113.08,36.18],
            '深圳':[114.07,22.62],
            '珠海':[113.52,22.3],
            '宿迁':[118.3,33.96],
            '咸阳':[108.72,34.36],
            '铜川':[109.11,35.09],
            '平度':[119.97,36.77],
            '佛山':[113.11,23.05],
            '海口':[110.35,20.02],
            '江门':[113.06,22.61],
            '章丘':[117.53,36.72],
            '肇庆':[112.44,23.05],
            '大连':[121.62,38.92],
            '临汾':[111.5,36.08],
            '吴江':[120.63,31.16],
            '石嘴山':[106.39,39.04],
            '沈阳':[123.38,41.8],
            '苏州':[120.62,31.32],
            '茂名':[110.88,21.68],
            '嘉兴':[120.76,30.77],
            '长春':[125.35,43.88],
            '胶州':[120.03336,36.264622],
            '银川':[106.27,38.47],
            '张家港':[120.555821,31.875428],
            '三门峡':[111.19,34.76],
            '锦州':[121.15,41.13],
            '南昌':[115.89,28.68],
            '柳州':[109.4,24.33],
            '三亚':[109.511909,18.252847],
            '自贡':[104.778442,29.33903],
            '吉林':[126.57,43.87],
            '阳江':[111.95,21.85],
            '泸州':[105.39,28.91],
            '西宁':[101.74,36.56],
            '宜宾':[104.56,29.77],
            '呼和浩特':[111.65,40.82],
            '成都':[104.06,30.67],
            '大同':[113.3,40.12],
            '镇江':[119.44,32.2],
            '桂林':[110.28,25.29],
            '张家界':[110.479191,29.117096],
            '宜兴':[119.82,31.36],
            '北海':[109.12,21.49],
            '西安':[108.95,34.27],
            '金坛':[119.56,31.74],
            '东营':[118.49,37.46],
            '牡丹江':[129.58,44.6],
            '遵义':[106.9,27.7],
            '绍兴':[120.58,30.01],
            '扬州':[119.42,32.39],
            '常州':[119.95,31.79],
            '潍坊':[119.1,36.62],
            '重庆':[106.54,29.59],
            '台州':[121.420757,28.656386],
            '南京':[118.78,32.04],
            '滨州':[118.03,37.36],
            '贵阳':[106.71,26.57],
            '无锡':[120.29,31.59],
            '本溪':[123.73,41.3],
            '克拉玛依':[84.77,45.59],
            '渭南':[109.5,34.52],
            '马鞍山':[118.48,31.56],
            '宝鸡':[107.15,34.38],
            '焦作':[113.21,35.24],
            '句容':[119.16,31.95],
            '北京':[116.46,39.92],
            '徐州':[117.2,34.26],
            '衡水':[115.72,37.72],
            '包头':[110,40.58],
            '绵阳':[104.73,31.48],
            '乌鲁木齐':[87.68,43.77],
            '枣庄':[117.57,34.86],
            '杭州':[120.19,30.26],
            '淄博':[118.05,36.78],
            '鞍山':[122.85,41.12],
            '溧阳':[119.48,31.43],
            '库尔勒':[86.06,41.68],
            '安阳':[114.35,36.1],
            '开封':[114.35,34.79],
            '济南':[117,36.65],
            '德阳':[104.37,31.13],
            '温州':[120.65,28.01],
            '九江':[115.97,29.71],
            '邯郸':[114.47,36.6],
            '临安':[119.72,30.23],
            '兰州':[103.73,36.03],
            '沧州':[116.83,38.33],
            '临沂':[118.35,35.05],
            '南充':[106.110698,30.837793],
            '天津':[117.2,39.13],
            '富阳':[119.95,30.07],
            '泰安':[117.13,36.18],
            '诸暨':[120.23,29.71],
            '郑州':[113.65,34.76],
            '哈尔滨':[126.63,45.75],
            '聊城':[115.97,36.45],
            '芜湖':[118.38,31.33],
            '唐山':[118.02,39.63],
            '平顶山':[113.29,33.75],
            '邢台':[114.48,37.05],
            '德州':[116.29,37.45],
            '济宁':[116.59,35.38],
            '荆州':[112.239741,30.335165],
            '宜昌':[111.3,30.7],
            '义乌':[120.06,29.32],
            '丽水':[119.92,28.45],
            '洛阳':[112.44,34.7],
            '秦皇岛':[119.57,39.95],
            '株洲':[113.16,27.83],
            '石家庄':[114.48,38.03],
            '莱芜':[117.67,36.19],
            '常德':[111.69,29.05],
            '保定':[115.48,38.85],
            '湘潭':[112.91,27.87],
            '金华':[119.64,29.12],
            '岳阳':[113.09,29.37],
            '长沙':[113,28.21],
            '衢州':[118.88,28.97],
            '廊坊':[116.7,39.53],
            '菏泽':[115.480656,35.23375],
            '合肥':[117.27,31.86],
            '武汉':[114.31,30.52],
            '大庆':[125.03,46.58]
        };

        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }

            }
            return res;
        };

        var option = {
            title: {
                text: '',
            },
            tooltip : {
                show: false,
                trigger: 'item',
                formatter: '{b}<br>{c}',
            },
            bmap: {
                center: [104.114129, 37.550339],
                zoom: 5,
                roam: true,  //鼠标缩放
                mapStyle: {
                    styleJson: [{
                        'featureType': 'land',   //土地颜色；
                        'elementType': 'all',
                        'stylers': {
                            'color': '#f5f3ef'
                        }
                    },{
                        'featureType': 'water',  //水颜色
                        'elementType': 'all',
                        'stylers': {
                            'color': '#a2c1de'
                        }
                    }, {
                        'featureType': 'railway',  //调整铁路颜色
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'highway', //调整高速道路颜色
                        'elementType': 'all',
                        'stylers': {
                            'color': '#fdfdfd'
                        }
                    }, {
                        'featureType': 'highway', //调整建筑物标签是否可视
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'arterial',    //调整一些干道颜色
                        'elementType': 'geometry',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'arterial',      
                        'elementType': 'geometry.fill',
                        'stylers': {
                            'color': '#fefefe'
                        }
                    }, {
                        'featureType': 'poi',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'green',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'subway',
                        'elementType': 'all',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'manmade',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'local',
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'arterial',
                        'elementType': 'labels',
                        'stylers': {
                            'visibility': 'off'
                        }
                    }, {
                        'featureType': 'boundary',  //边界颜色
                        'elementType': 'all',
                        'stylers': {
                            'color': '#bcab78'
                        }
                    }, {
                        'featureType': 'building',  //建筑颜色
                        'elementType': 'all',
                        'stylers': {
                            'color': '#d1d1d1'
                        }
                    }, {
                        'featureType': 'label',           //地名颜色；
                        'elementType': 'labels.text.fill',
                        'stylers': {
                            'color': '#898989'
                        }
                    }]
                }
            },
            series : [
                {
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data),
                    hoverAnimation: false,         //hover动画;
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#de1300'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
        
        // 获取百度地图实例，使用百度地图自带的控件
        var bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.addControl(new BMap.NavigationControl());  //左侧缩放；
        bmap.enableDragging();   //开启拖拽

        var opts = {
                    offset: {height:-5,width:5},
                    width : 250,     // 信息窗口宽度
                    height: 150,     // 信息窗口高度
                    title : "" , // 信息窗口标题
                    enableMessage:true//设置允许信息窗发送短息
                   };
        for(var i=0;i<data.length;i++){
            var icon = new BMap.Icon('../img/ico.png', new BMap.Size(10, 10), {
                anchor: new BMap.Size(5, 5)
            });
            var marker = new BMap.Marker(new BMap.Point(geoCoordMap[data[i].name][0],geoCoordMap[data[i].name][1]),{icon: icon});  // 创建标注
            var content = "<b>"+data[i].name+"</b><br><br>" +
                            "园区地址："+ data[i].address +"<br>" + 
                            "园区类型："+ data[i].typeName +"<br>" + 
                            "园区面积："+ data[i].area +"<br>" + 
                            "入驻企业："+ data[i].value +"家<br>"+ 
                            "服务范围："+ data[i].service;

            bmap.addOverlay(marker);               // 将标注添加到地图中            
            addClickHandler(content,marker);
        }
        function addClickHandler(content,marker){
            marker.addEventListener("mouseover",function(e){
                openInfo(content,e);
            });
            marker.addEventListener("mouseout",function(e){
                bmap.closeInfoWindow(); //关闭信息窗口
            });
        }
        function openInfo(content,e){
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
            bmap.openInfoWindow(infoWindow,point); //开启信息窗口
        }
    }
    //操作按钮
    $('.t_btn1').click(function () {
        $('.center_text').css('display', 'none');
        $('.t_cos1').css('display', 'block');
        echart_1();
    });
    $('.t_btn2').click(function () {
        $('.center_text').css('display', 'none');
        $('.t_cos2').css('display', 'block');
        echart_2();
    });
    $('.t_btn3').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos3').css('display', 'block');
        echart_3();
    });
    $('.t_btn4').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos4').css('display', 'block');
        echart_4_1();
		echart_4_2();
    });
    $('.t_btn5').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos5').css('display', 'block');
        echart_5();
    });
    $('.t_btn6').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos6').css('display', 'block');
        echart_6();
    });
    $('.t_btn7').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos7').css('display', 'block');
        echart_7();
    });
    $('.t_btn8').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos8').css('display', 'block');
        echart_8();
    });
    $('.t_btn9').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos9').css('display', 'block');
        echart_9();
    });
    $('.t_btn10').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos10').css('display', 'block');
        echart_10();
    });
    $('.t_btn11').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos11').css('display', 'block');
        echart_11();
    });
	$('.t_btn12').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos12').css('display', 'block');
        echart_12();
    });
    $('.t_btn13').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos13').css('display', 'block');
        echart_13_1();
		echart_13_2();
    });
    $('.t_btn14').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos14').css('display', 'block');
        echart_14_1();
		echart_14_2();
    });	
    $('.t_btn15').click(function(){
        $('.center_text').css('display', 'none');
        $('.t_cos15').css('display', 'block');
        echart_15_1();
		echart_15_2();
    });
    //获取地址栏参数
    $(function(){
        function getUrlParms(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
                if(r!=null)
                return unescape(r[2]);
                return null;
            }
            var id = getUrlParms("id");  
            if(id == 1){
                $('.center_text').css('display', 'none');
                $('.t_cos1').css('display', 'block');
                echart_1();
            }
            if(id == 2){
                $('.center_text').css('display', 'none');
                $('.t_cos2').css('display', 'block');
                echart_2();
            }
            if(id == 3){
                $('.center_text').css('display', 'none');
                $('.t_cos3').css('display', 'block');
                echart_3();
            }
            if(id == 4){
                $('.center_text').css('display', 'none');
                $('.t_cos4').css('display', 'block');
                echart_4_1();
				echart_4_2();
            }
            if(id == 5){
                $('.center_text').css('display', 'none');
                $('.t_cos5').css('display', 'block');
                echart_5();
            }
            if(id == 6){
                $('.center_text').css('display', 'none');
                $('.t_cos6').css('display', 'block');
                echart_6();
            }
            if(id == 7){
                $('.center_text').css('display', 'none');
                $('.t_cos7').css('display', 'block');
                echart_7();
            }
            if(id == 8){
                $('.center_text').css('display', 'none');
                $('.t_cos8').css('display', 'block');
                echart_8();
            }
            if(id == 9){
                $('.center_text').css('display', 'none');
                $('.t_cos9').css('display', 'block');
                echart_9();
            }
            if(id == 10){
                $('.center_text').css('display', 'none');
                $('.t_cos10').css('display', 'block');
                echart_10();
            }
            if(id == 11){
                $('.center_text').css('display', 'none');
                $('.t_cos11').css('display', 'block');
                echart_11();
            }
            if(id == 12){
                $('.center_text').css('display', 'none');
                $('.t_cos2').css('display', 'block');
                echart_12();
            }
            if(id == 13){
                $('.center_text').css('display', 'none');
                $('.t_cos13').css('display', 'block');
                echart_13_1();
                echart_13_2();
            }
            if(id == 14){
                $('.center_text').css('display', 'none');
                $('.t_cos14').css('display', 'block');
                echart_14_1();
                echart_14_2();
            }
            if(id == 15){
                $('.center_text').css('display', 'none');
                $('.t_cos15').css('display', 'block');
                echart_15_1();
                echart_15_2();
            }
    });
});
