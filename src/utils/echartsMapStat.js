const colorList = ['#284554', '#61a0a8', '#d48265', '#c23531', '#8B0A50', '#91c7ae', '#749f83',
  '#ca8622', '#bda29a', '#6e7074', '#546570',
  '#080808', '#800000', '#006400', '#191970'
];

/**
 * 生成图形
 * @param {Object} option
 * @param {Object} myChart
 */
export function createMapChart(option, myChart) {
  myChart.clear();
  myChart.setOption(option, true);
  //this.chart.resize();
}

/**
 * 默认地图(中国)
 * 基于模板：https://www.makeapie.com/editor.html?c=xi5eszo651
 * @param {Object} mapData
 * @param {Object} myChart
 */
export function createDefaultMapChart(mapData, myChart, echarts) {
  var mapName = mapData.mapName;
  var data = mapData.dataList;
  var geoCoordMap = {};
  /*获取地图数据*/
  myChart.showLoading();
  var mapFeatures = echarts.getMap(mapName).geoJson.features;
  myChart.hideLoading();
  mapFeatures.forEach(function(v) {
    // 地区名称
    var name = v.properties.name;
    // 地区经纬度
    geoCoordMap[name] = v.properties.cp;

  });
  var max = mapData.maxValue;
  var min = 0;
  var maxSize4Pin = 50,
    minSize4Pin = 20;

  var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
        });
      }
    }
    return res;
  };
  let option = {
    backgroundColor: '#404a59',
    title: {
      text: mapData.title,
      subtext: mapData.subTitle,
      x: 'center',
      textStyle: {
        color: '#ffffff',
        fontFamily: '等线',
        fontSize: 18
      },
      subtextStyle: {
        color: '#e7e7e7',
        fontSize: 15,
        fontFamily: '等线'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.data != null && params.data.days != null) {
          var toolTiphtml = params.data.name +
            '<br>天数:' + params.data.days +
            '<br>次数:' + params.data.counts +
            '<br>花费:' + params.data.cost + '元'
          return toolTiphtml;
        } else {
          return '';
        }
      }
    },
    visualMap: {
      show: true,
      min: min,
      max: max,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true,
      seriesIndex: [1],
      inRange: {
        // color: ['#ffc0cb', '#800080'] // 红紫
        color: ['#00557f', '#00246d'], // 蓝绿
      }
    },
    geo: {
      show: true,
      map: mapName,
      label: {
        show: false
      },
      emphasis: {
        show: true
      },
      roam: true,
      emphasis: {
        itemStyle: {
          areaColor: '#ffff7f'
        }
      },
      itemStyle: {
        //地图的背景颜色
        areaColor: '#bcbcbc',
        borderColor: '#111'
      }
    },
    series: [{
        name: '散点',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data),
        symbolSize: function(val) {
          return val[2] / 10;
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: true
        },
        emphasis: {
          label: {
            show: true
          }
        },
        itemStyle: {
          color: '#05C3F9'
        }
      },
      {
        type: 'map',
        map: mapName,
        geoIndex: 0,
        aspectScale: 0.75, //长宽比
        showLegendSymbol: false, // 存在legend时显示
        label: {
          show: true
        },
        emphasis: {
          label: {
            show: false,
            color: '#fff'
          },
          areaColor: '#2B91B7'
        },
        roam: true,
        itemStyle: {
          areaColor: '#031525',
          borderColor: '#3B5077'
        },
        animation: false,
        data: data
      },
      {
        name: '点',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin', //气泡

        symbolSize: function(val) {
          var a = (maxSize4Pin - minSize4Pin) / (max - min);
          var b = minSize4Pin - a * min;
          b = maxSize4Pin - a * max;
          return a * val[2] + b;
        },
        label: {
          formatter: '{@[2]}',
          show: true,
          color: '#fff',
          fontSize: 9
        },
        itemStyle: {
          color: '#F62157', //标志颜色
        },
        zlevel: 6,
        data: convertData(data),
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(data.sort(function(a, b) {
          return b.value - a.value;
        }).slice(0, 5)),
        //定义圆圈大小
        // symbolSize: function(val) {
        //   return val[2] / 25;
        // },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          formatter: '{b}',
          position: 'right',
          show: true
        },
        itemStyle: {
          color: 'yellow',
          shadowBlur: 10,
          shadowColor: 'yellow'
        },
        zlevel: 1
      },
    ]
  };
  createMapChart(option, myChart);
}

/**
 * 世界地图
 * 基于模板:https://www.makeapie.com/editor.html?c=xN8H0jI0xN
 * @param {Object} mapData
 * @param {Object} myChart
 */
export function createWorldMapChart(mapData, myChart, echarts) {
  // 飞线颜色
  var flyLineColor = "yellow";
  //线条颜色
  var lineColor = "rgba(31,20,252,1)";
  //高亮地图填充色
  var lightColor = "red";
  // 散点图默认颜色
  var ScatterColor = "yellow"
  // 地图默认状态填充色
  var mapAreaColor = "#06265c"
  //字体颜色
  var textColor = "#fff";
  const unit = mapData.unit == null ? '' : mapData.unit;

  var geoCoordMap = mapData.geoCoordMapData;
  var BJData = mapData.dataList;
  var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push([{
            coord: fromCoord,
            value: dataItem[0].value
          },
          {
            coord: toCoord
          }
        ]);
      }
    }
    return res;
  };

  var series = [];
  [
    ["", BJData]
  ].forEach(function(item, i) {
    series.push({
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 1,
        rippleEffect: {
          //涟漪特效
          period: 6, //动画时间，值越小速度越快
          brushType: "stroke", //波纹绘制方式 stroke, fill
          scale: 4 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          show: true,
          position: "right", //显示位置
          offset: [8, 0], //偏移设置
          formatter: "{b}", //圆环显示文字
          color: textColor,
          fontSize: 10,
          lineHeight: 14,
          borderWidth: 1,
          backgroundColor: "#061a4c",
          borderColor: "#97b5f0",
          padding: 3
        },
        emphasis: {
          show: true
        },
        symbol: "circle",
        symbolSize: 12,
        itemStyle: {
          show: true,
          "color": ScatterColor,
          "shadowBlur": 10,
          "shadowColor": ScatterColor
        },
        data: item[1].map(function(dataItem) {
          return {
            name: dataItem.name,
            value: geoCoordMap[dataItem.name].concat([dataItem.value])
          };
        })
      },
      // 高亮显示中国
      {
        type: 'map',
        roam: true,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "180%",
        label: {
          show: false
        },
        itemStyle: {
          areaColor: mapAreaColor,
          borderColor: '#8F98A6'
        },
        emphasis: {
          color: lightColor,
          show: true
        },
        map: 'world', //使用
        data: [{
          "selected": true,
          "name": "China"
        }]
      },
    );
  });

  let option = {
    backgroundColor: '#000',
    title: {
      text: '',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#74aeae",
      borderColor: "#FFFFCC",
      showDelay: 0,
      hideDelay: 0,
      enterable: true,
      transitionDuration: 0,
      extraCssText: "z-index:100",
      formatter: function(params, ticket, callback) {
        //根据业务自己拓展要显示的内容
        var res = "";
        var name = params.name;
        var value = params.value[params.seriesIndex + 2];
        var ds = value == undefined ? '--' : value + unit;
        res =
          "<span style='color:#fff;'>" +
          name +
          "</span><br/>数据：" +
          ds;
        return res;
      }
    },
    geo: {
      show: false,
      map: "world",
      emphasis: {
        show: false
      },
      roam: true, //是否允许缩放
      layoutCenter: ["50%", "50%"], //地图位置
      layoutSize: "180%",
      itemStyle: {
        areaColor: mapAreaColor,
        borderColor: '#8F98A6'
      },
      emphasis: {
        areaColor: '#2a333d'
      }
    },
    series: series
  };
  createMapChart(option, myChart);
}

export function randomColor() {
  return 'rgb(' + [
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255)
  ].join(',') + ')';
}
/**
 * 中国迁移地图
 * 基于模板:https://www.makeapie.com/editor.html?c=xBkrP1lbqG
 * @param {Object} mapData
 * @param {Object} myChart
 */
export function createChinaTransferMapChart(mapData, myChart) {
  const unit = mapData.unit == null ? '' : mapData.unit;
  var geoCoordMap = mapData.geoCoordMapData;
  var planePath =
    'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
  var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord],
          value: dataItem[1].value
        });
      }
    }
    return res;
  };

  var series = [];
  for (let i = 0; i < mapData.detailDataList.length; i++) {
    var item = mapData.detailDataList[i];
    var seColor = randomColor();
    var seName = item.name;
    series.push({
      name: seName,
      type: 'lines',
      zlevel: 1,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        color: '#fff',
        symbolSize: 3
      },
      lineStyle: {
        color: seColor,
        width: 0,
        curveness: 0.2
      },
      data: convertData(item.dataList)
    }, {
      name: seName,
      type: 'lines',
      zlevel: 2,
      symbol: ['none', 'arrow'],
      symbolSize: 10,
      effect: {
        show: true,
        period: 6,
        trailLength: 0,
        symbol: planePath,
        symbolSize: 15
      },
      lineStyle: {
        color: seColor,
        width: 1,
        opacity: 0.6,
        curveness: 0.2
      },
      data: convertData(item.dataList)
    }, {
      name: seName,
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 2,
      rippleEffect: {
        brushType: 'stroke'
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        color: seColor,//字体颜色
      },
      symbolSize: function(val) {
        return 10;
      },
      data: item.dataList.map(function(dataItem) {
        return {
          name: dataItem[1].name,
          value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
        };
      })
    });
  }

  let option = {
    backgroundColor: '#404a59',
    title: {
      text: mapData.title,
      subtext: mapData.subTitle,
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params, ticket, callback) {
        //console.log(params)
        if (params.seriesType == "effectScatter") {
          return params.seriesName+":" + params.data.name + " " + params.data.value[2]+unit;
        } else if (params.seriesType == "lines") {
          return params.seriesName+"线路: "+params.data.fromName + ">" + params.data.toName + "<br />" + params.data.value+unit;
        } else {
          return params.name;
        }
      }
    },
    legend: {
      orient: 'vertical',
      top: 'bottom',
      left: 'right',
      data: mapData.legendData,
      textStyle: {
        color: '#fff'
      },
      selectedMode: 'multiple',
    },
    geo: {
      map: 'china',
      emphasis: {
        show: true,
        color: '#fff'
      },
      roam: true,
      itemStyle: {
        areaColor: '#323c48',
        borderColor: '#404a59'
      },
      emphasis: {
        areaColor: '#2a333d'
      }
    },
    series: series
  };
  createMapChart(option, myChart);
}

/**
 * 世界迁移地图
 * 基于模板:https://www.makeapie.com/editor.html?c=xN8H0jI0xN
 * @param {Object} mapData
 * @param {Object} myChart
 */
export function createWorldTransferMapChart(mapData, myChart) {
  // 飞线颜色
  var flyLineColor = "yellow";
  //线条颜色
  var lineColor = "rgba(142, 0, 0, 1.0)";
  //高亮地图填充色
  var lightColor = "red";
  // 散点图默认颜色
  var ScatterColor = "yellow"
  // 地图默认状态填充色
  var mapAreaColor = "#06265c"
  //字体颜色
  var textColor = "#fff";

  var geoCoordMap = mapData.geoCoordMapData;
  var BJData = mapData.dataList;
  var centerCity = mapData.centerCity;
  var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push([{
            coord: fromCoord,
            value: dataItem[0].value
          },
          {
            coord: toCoord
          }
        ]);
      }
    }
    return res;
  };

  var series = [];
  [
    [centerCity, BJData]
  ].forEach(function(item, i) {
    series.push({
        "type": "lines",
        "zlevel": 3,
        "effect": {
          "show": true,
          "period": 4,
          "trailLength": 0.7,
          "symbol": "arrow",
          "symbolSize": 3,
          "color": flyLineColor
        },
        "lineStyle": {
          "normal": {
            "width": 0,
            "curveness": 0.2
          }
        },
        "data": convertData(item[1])
      }, {
        "type": "lines",
        "zlevel": 2,
        "symbolSize": 10,
        "effect": {
          "show": false,
          "period": 6,
          "trailLength": 0
        },
        "lineStyle": {
          "color": lineColor,
          "width": 1,
          "opacity": 0.8,
          "curveness": 0.2
        },
        "data": convertData(item[1])
      }, {
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 1,
        rippleEffect: {
          //涟漪特效
          period: 6, //动画时间，值越小速度越快
          brushType: "stroke", //波纹绘制方式 stroke, fill
          scale: 4 //波纹圆环最大限制，值越大波纹越大
        },
        label: {
          show: true,
          position: "right", //显示位置
          offset: [8, 0], //偏移设置
          formatter: "{b}", //圆环显示文字
          color: textColor,
          fontSize: 10,
          lineHeight: 14,
          borderWidth: 1,
          backgroundColor: "#061a4c",
          borderColor: "#97b5f0",
          padding: 3
        },
        emphasis: {
          show: true
        },
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          show: true,
          "color": ScatterColor,
          "shadowBlur": 10,
          "shadowColor": ScatterColor
        },
        data: item[1].map(function(dataItem) {
          return {
            name: dataItem[0].name,
            value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
          };
        })
      },
      //被攻击点 大头针
      {
        type: "scatter",
        coordinateSystem: "geo",
        zlevel: 2,
        rippleEffect: {
          period: 4,
          brushType: "stroke",
          scale: 4
        },
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          color: textColor,

          fontSize: 10,
          lineHeight: 14,
          borderWidth: 1,
          backgroundColor: "#061a4c",
          borderColor: "#97b5f0",
          padding: 3
        },
        emphasis: {
          show: true
        },
        symbol: "pin",
        symbolSize: 30,
        itemStyle: {
          show: true,
          color: ScatterColor
        },
        data: [{
          name: item[0],
          value: geoCoordMap[item[0]].concat([100])
        }]
      },
      // 被攻击点 散点
      {
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        symbol: "circle",
        symbolSize: 12,
        rippleEffect: {
          //涟漪特效
          period: 4, //动画时间，值越小速度越快
          brushType: "fill", //波纹绘制方式 stroke, fill
          scale: 12 //波纹圆环最大限制，值越大波纹越大
        },
        itemStyle: {
          show: true,
          "shadowBlur": 12,
          "shadowColor": "red",
          "color": {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [{
                offset: 0,
                color: 'red' // 0% 处的颜色
              }, {
                offset: 0.8,
                color: 'transparent'
              },
              {
                offset: 1,
                color: 'red' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        label: {
          show: false
        },
        data: [{
          name: item[0],
          value: geoCoordMap[item[0]].concat([100])
        }]
      },
      // 高亮显示中国
      {
        type: 'map',
        roam: true,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "180%",
        label: {
          show: false
        },

        itemStyle: {
          areaColor: mapAreaColor,
          borderColor: '#8F98A6'
        },
        emphasis: {
          show: false,
          areaColor: lightColor
        },
        map: 'world', //使用
        data: [{
          "selected": true,
          "name": "China"
        }]
      },
    );
  });

  let option = {
    backgroundColor: '#000',
    title: {
      text: '',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#74aeae",
      borderColor: "#FFFFCC",
      showDelay: 0,
      hideDelay: 0,
      enterable: true,
      transitionDuration: 0,
      extraCssText: "z-index:100",
      formatter: function(params, ticket, callback) {
        //根据业务自己拓展要显示的内容
        var res = "";
        var name = params.name;
        var value = params.value[params.seriesIndex + 2];
        var ds = value == undefined ? '--' : value + unit;
        res =
          "<span style='color:#fff;'>" +
          name +
          "</span><br/>数据：" +
          ds;
        return res;
      }
    },
    geo: {
      show: false,
      map: "world",
      label: {
        emphasis: {
          show: false
        }
      },
      roam: true, //是否允许缩放
      layoutCenter: ["50%", "50%"], //地图位置
      layoutSize: "180%",
      itemStyle: {
        areaColor: mapAreaColor,
        borderColor: '#8F98A6'
      },
      emphasis: {
        areaColor: '#2a333d'
      }
    },

    series: series
  };
  createMapChart(option, myChart);
}

/**
 * 基于地点的地图统计（有默认的最高Top的显示）
 * @param {Object} mapData
 * @param {Object} myChart
 */
export function createLocationMapChart(mapData, myChart) {
  let geoCoordMap = mapData.geoCoordMapData;
  let data = mapData.dataList;
  let convertData = function(data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        });
      }
    }
    return res;
  };
  const nn = data.length;
  const min = mapData.min;
  const max = mapData.max;
  let mm = max - min;
  //计算图标大小,取5-25之间的值
  let caleSize = function(v) {
    if (mm == 0) {
      //都是一样的
      return nn <= 10 ? 15 : 10;
    }
    var s = (parseInt(v) - min) / mm * 20 + 5;
    return Math.round(s);
  };
  //最高的
  let topSize = 0;
  let ds = mapData.dataList.length;
  if (ds == 0) {
    topSize = 0;
  } else if (ds <= 3) {
    topSize = 1;
  } else if (ds <= 5) {
    topSize = 3;
  } else {
    topSize = 5;
  }
  let option = {
    backgroundColor: '#404a59',
    title: {
      text: mapData.title,
      subtext: '--',
      sublink: '--',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return params.name + ' : ' + params.value[2] + mapData.unit;
      }
    },
    legend: {
      orient: 'vertical',
      y: 'bottom',
      x: 'right',
      data: [mapData.name],
      textStyle: {
        color: '#fff'
      }
    },
    geo: {
      map: 'china',
      label: {
        show: true,
        emphasis: {
          show: true
        }
      },
      roam: true,
      emphasis: {
        itemStyle: {
          areaColor: '#ffffff'
        }
      },
      itemStyle: {
        normal: {
          //地图的背景颜色
          areaColor: '#323c48',
          borderColor: '#111'
        }
      }
    },
    series: [{
        name: mapData.name,
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data),
        symbolSize: function(val) {
          return caleSize(val[2]);
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        emphasis: {
          show: true
        },
        itemStyle: {
          color: '#ddb926'
        }
      },
      {
        name: 'Top ' + topSize,
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(data.sort(function(a, b) {
          return b.value - a.value;
        }).slice(0, 6)),
        symbolSize: function(val) {
          return caleSize(val[2]);
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          formatter: '{b}',
          position: 'right',
          color: '#f4e925',
          show: true
        },
        itemStyle: {
          color: '#f4e925',
          shadowBlur: 10,
          shadowColor: '#333'
        },
        zlevel: 1
      }
    ]
  };
  createMapChart(option, myChart);
}
