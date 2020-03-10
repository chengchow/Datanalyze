$(function () {
    echart_0();
    echart_1();
    echart_2_1();
    echart_2_2();
    echart_3();
    echart_4_1();
    echart_4_2();
	echart_5();
	echart_6();
	echart_7();
	echart_8();

    //echart_0 中国地图
    function echart_0() {
        // 基于准备好的dom，初始化echarts实例
        $.getJSON("/transport/json/chinamap",function(result){
            var myChart = echarts.init(document.getElementById('chart_0'));
   
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
                    roam: false,
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

    //echart_1 前十海港吞吐量
    function echart_1() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_1'));
        myChart.clear();
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}百万吨"
            },
            legend: {
                x: '10%',
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
                radius: ['10%', '90%'],
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
                        formatter: '{b}'
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

    //echart_2_1 快递发送量
    function echart_2_1() {
        var myChart = echarts.init(document.getElementById('chart_2_1'));
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
            grid: {
                left: '5%',
                right: '5%',
                top: '20%',
                bottom: '5%',
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

    //echart_2_2 邮政发送量
    function echart_2_2() {
        var myChart = echarts.init(document.getElementById('chart_2_2'));
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
            grid: {
                left: '5%',
                right: '5%',
                top: '20%',
                bottom: '5%',
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

    //echart_3 运输业就业信息
    function echart_3() {
        var myChart = echarts.init(document.getElementById('chart_3'));
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
                    fontSize: 12
                },
                top: '10%',
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

    //echart_4_1 互联网人数
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
            grid: {
                left: '5%',
                right: '5%',
                top: '20%',
                bottom: '5%',
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

    //echart_4_2 互联网端口数
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
            grid: {
                left: '5%',
                right: '5%',
                top: '20%',
                bottom: '5%',
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

    //echart_5 民用汽车数
    function echart_5(){
        var myChart = echarts.init(document.getElementById('chart_5'));
        myChart.clear();

        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
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
                    data: result.data[i+1].data
                })
            };
            myChart.setOption({
//                legend: {data: result.label},
                color: result.color,
                series: seriesData,
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }	

    //echart_6 铁路客运站
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
        		x: '0%',
        		y: '65%',
                min: '',
                max: '',
                splitNumber: 4,
                color: ['#d94e5d','#eac736','#50a3ba'],
                textStyle: {
                    color: '#fff',
                    fontsize: '8',
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
                roam: false,//禁止其放大缩小
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
//                title: {text: result.name, subtext: result.subname, sublink: result.sublink},
//                legend: {data: ''},
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

    //echart_7 铁路货运站
    function echart_7() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_7'));
        
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
        		y: '65%',
                min: '',
                max: '',
                splitNumber: 4,
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
                roam: false,//禁止其放大缩小
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
//                title: {text: result.name, subtext: result.subname, sublink: result.sublink},
//                legend: {data: ''},
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

    //echart_8 运输吞吐量
    function echart_8(){
        var myChart = echarts.init(document.getElementById('chart_8'));
        myChart.clear();

        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
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
                    data: result.data[i+1].data
                })
            };
            myChart.setOption({
//                legend: {data: result.label},
                color: result.color,
                series: seriesData,
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    //点击跳转
    $('.t_btn0').click(function(){
        window.location.href = './page/index.html?id=1';
    });
    $('.t_btn1').click(function(){
        window.location.href = "./page/index.html?id=10";
    });
    $('.t_btn2').click(function(){
        window.location.href = "./page/index.html?id=13";
    });
    $('.t_btn3').click(function(){
        window.location.href = "./page/index.html?id=9";
    });
    $('.t_btn4').click(function(){
        window.location.href = "./page/index.html?id=15";
    });
    $('.t_btn5').click(function(){
        window.location.href = "./page/index.html?id=7";
    });
    $('.t_btn6').click(function(){
        window.location.href = "./page/index.html?id=5";
    });
    $('.t_btn7').click(function(){
        window.location.href = "./page/index.html?id=6";
    });
    $('.t_btn8').click(function(){
        window.location.href = "./page/index.html?id=8";
    });
});
