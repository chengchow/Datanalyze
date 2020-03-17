$(function () {
    echart_0();
    echart_1();
    echart_2();
    echart_3();
    echart_4();
    echart_5();
    echart_6();
    echart_7();
    echart_8();

    //echart_0 主机地图
    function echart_0() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_0'));
        
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
        
            visualMap: {
        		x: '0%',
        		y: '65%',
                min: '',
                max: '',
                splitNumber: 4,
                show: false,
                color: ['#d94e5d','#eac736','#50a3ba'],
                textStyle: {
                    color: '#fff',
                    fontsize: '8',
                }
            },
          
            geo: {
                zoom: 1.15,
                show: true,
                map: '上海',
                maptype: '上海',
                label: {
                    normal: {
                        show: true,
                        textStyle: {color: "#4bf316"}
                    },
                    emphasis: {
                        show: true,
                        textStyle: '#fff'
                    }
                },
                roam: false,//禁止其放大缩小
                itemStyle: {
                    normal: {
                        color: '#ddd',
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
                symbolSize: '',  
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

        $.getJSON("/monitor/json/hostmap", function(result) {
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
                visualMap:{max: result.max, min: result.min}, 
                series:[
                    {name: '', data: convertData(data), symbolSize: function (val) {return val[2] *5/ result.max + 12;}},
                    {name: '', data: convertData(data.sort(function (a, b) {return b.value - a.value;}).slice(0, 5)), 
                    symbolSize: function (val) {return val[2] *5/ result.max + 12;}}
                ]
            })
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    } 


    //echart_1 预警触发趋势
    function echart_1() {
        var myChart = echarts.init(document.getElementById('chart_1'));
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

            legend: {
                data: '',
                textStyle:{
                    color: '#fff',
                    fontSize: 12
                },
                top: '10%',
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
        $.getJSON("/monitor/json/event",function(result){
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

    //echart_2 本月端口超时比例
    function echart_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_2'));
        myChart.clear();
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
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
                radius: ['20%', '60%'],
                //支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
                center: ['50%', '65%'],
                //是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
                // 'radius' 面积展现数据的百分比，半径展现数据的大小。
                //  'area' 所有扇区面积相同，仅通过半径展现数据大小
                //roseType: 'area',
                startAngle: 0 ,
                //是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
                avoidLabelOverlap: true,
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
                        length: 20,
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

        $.getJSON("/monitor/json/nowport",function(result){
            myChart.setOption({
                legend: {data: result.label},
                series: [{color: result.color, data: result.data}]
            });
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }


    //echart_3 负载触发趋势
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
        $.getJSON("/monitor/json/loadavg",function(result){
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

    //echart_4 本月事务触发比例
    function echart_4() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_4'));
        myChart.clear();
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
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
                radius: ['20%', '60%'],
                //支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
                center: ['50%', '65%'],
                //是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
                // 'radius' 面积展现数据的百分比，半径展现数据的大小。
                //  'area' 所有扇区面积相同，仅通过半径展现数据大小
                //roseType: 'area',
                startAngle: 0 ,
                //是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
                avoidLabelOverlap: true,
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
                        length: 20,
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

        $.getJSON("/monitor/json/nowevent",function(result){
            myChart.setOption({
                legend: {data: result.label},
                series: [{color: result.color, data: result.data}]
            });
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }



    //echart_5 端口触发趋势
    function echart_5() {
        var myChart = echarts.init(document.getElementById('chart_5'));
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
        $.getJSON("/monitor/json/port",function(result){
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


    //echart_6 本月事务触发比例
    function echart_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_6'));
        myChart.clear();
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
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
                radius: ['20%', '80%'],
                //支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
                center: ['50%', '50%'],
                //是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
                // 'radius' 面积展现数据的百分比，半径展现数据的大小。
                //  'area' 所有扇区面积相同，仅通过半径展现数据大小
                roseType: 'radius',
                startAngle: 0 ,
                //是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
                avoidLabelOverlap: true,
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
                        length: 1,
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

        $.getJSON("/monitor/json/nowport10",function(result){
            myChart.setOption({
                legend: {data: result.label},
                series: [{name: result.title, color: result.color, data: result.data}]
            });
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    //echart_7 本月事务触发比例
    function echart_7() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_7'));
        myChart.clear();
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
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
                radius: ['20%', '80%'],
                //支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
                center: ['50%', '50%'],
                //是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
                // 'radius' 面积展现数据的百分比，半径展现数据的大小。
                //  'area' 所有扇区面积相同，仅通过半径展现数据大小
                roseType: 'radius',
                startAngle: 0 ,
                //是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
                avoidLabelOverlap: true,
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
                        length: 1,
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

        $.getJSON("/monitor/json/port10",function(result){
            myChart.setOption({
                legend: {data: result.label},
                series: [{name: result.title, color: result.color, data: result.data}]
            });
        });

        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }


    //echart_8 磁盘触发趋势图
    function echart_8() {
        var myChart = echarts.init(document.getElementById('chart_8'));
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
        $.getJSON("/monitor/json/disk",function(result){
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

});
