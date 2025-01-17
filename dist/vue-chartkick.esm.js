/*!
 * Vue Chartkick v1.1.1
 * Create beautiful JavaScript charts with one line of Vue. A forked version of Vue Chartkick (https://www.chartkick.com/vue)
 * git+https://github.com/Josmun55/vue-chartkick.git
 * MIT License
 */

import Chartkick from 'chartkick';
export { default } from 'chartkick';
import { h } from 'vue';

var chartId = 1;

var createComponent = function(app, tagName, chartType) {
  var chartProps = [
    "adapter", "bytes", "code", "colors", "curve", "dataset", "decimal", "discrete", "donut", "download", "empty", "label",
    "legend", "library", "loading", "max", "messages", "min", "points", "precision", "prefix", "refresh",
    "round", "stacked", "suffix", "thousands", "title", "xmax", "xmin", "xtitle", "ytitle", "zeros"
  ];
  app.component(tagName, {
    props: ["data", "id", "width", "height"].concat(chartProps),
    render: function() {
      // check if undefined so works with empty string
      var loading = this.chartOptions.loading !== undefined ? this.chartOptions.loading : "Loading...";

      // h() accepts VNodes,
      // but limit to string since it may be used by Chartkick.js
      if (typeof loading !== "string") {
        throw new Error("loading must be a string")
      }

      return h(
        "div",
        {
          id: this.chartId,
          style: this.chartStyle
        },
        [loading]
      )
    },
    data: function() {
      return {
        chartId: null
      }
    },
    computed: {
      chartStyle: function() {
        // hack to watch data and options
        this.data;
        this.chartOptions;

        return {
          height: this.height || "300px",
          lineHeight: this.height || "300px",
          width: this.width || "100%",
          textAlign: "center",
          color: "#999",
          fontSize: "14px",
          fontFamily: "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif"
        }
      },
      chartOptions: function() {
        var options = {};
        var props = chartProps;
        for (var i = 0; i < props.length; i++) {
          var prop = props[i];
          if (this[prop] !== undefined) {
            options[prop] = this[prop];
          }
        }
        return options
      }
    },
    created: function() {
      this.chartId = this.chartId || this.id || ("chart-" + chartId++);
    },
    mounted: function() {
      this.updateChart();
    },
    updated: function() {
      this.updateChart();
    },
    beforeUnmount: function() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
    methods: {
      updateChart: function() {
        if (this.data !== null) {
          if (this.chart) {
            this.chart.updateData(this.data, this.chartOptions);
          } else {
            this.chart = new chartType(this.chartId, this.data, this.chartOptions);
          }
        } else if (this.chart) {
          this.chart.destroy();
          this.chart = null;
          this.$el.innerText = "Loading...";
        }
      }
    }
  });
};

Chartkick.install = function(app, options) {
  if (options && options.adapter) {
    Chartkick.addAdapter(options.adapter);
  }
  createComponent(app, "line-chart", Chartkick.LineChart);
  createComponent(app, "pie-chart", Chartkick.PieChart);
  createComponent(app, "column-chart", Chartkick.ColumnChart);
  createComponent(app, "bar-chart", Chartkick.BarChart);
  createComponent(app, "area-chart", Chartkick.AreaChart);
  createComponent(app, "scatter-chart", Chartkick.ScatterChart);
  createComponent(app, "geo-chart", Chartkick.GeoChart);
  createComponent(app, "timeline", Chartkick.Timeline);
};
