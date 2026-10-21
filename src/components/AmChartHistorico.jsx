import React, { useEffect, useRef } from 'react';

export default function AmChartHistorico({ dados }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.am5 || !window.am5xy || !chartRef.current || !dados?.length) {
      return;
    }

    const am5 = window.am5;
    const am5xy = window.am5xy;
    const am5themes_Animated = window.am5themes_Animated;

    const root = am5.Root.new(chartRef.current);
    if (am5themes_Animated) {
      root.setThemes([am5themes_Animated.new(root)]);
    }

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'mes',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );
    xAxis.data.setAll(dados);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Faturamento Mensal',
        xAxis,
        yAxis,
        valueYField: 'faturamento',
        categoryXField: 'mes',
        stroke: am5.color(0x9d174d),
        fill: am5.color(0x9d174d),
        tooltip: am5.Tooltip.new(root, {
          labelText: '{categoryX}: R$ {valueY}',
        }),
      })
    );

    series.strokes.template.setAll({ strokeWidth: 3 });
    series.fills.template.setAll({
      fillOpacity: 0.15,
      visible: true,
    });

    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0x9d174d),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
        }),
      })
    );

    series.data.setAll(dados);
    chart.set('cursor', am5xy.XYCursor.new(root, {}));

    return () => {
      root.dispose();
    };
  }, [dados]);

  return (
    <div className="amchart-card-full">
      <div className="amchart-card-header">
        <div>
          <h3>📈 Histórico Mensal de Vendas & Faturamento</h3>
          <span className="amchart-subtitulo">
            Evolução temporal (últimos 6 meses) gerada via amCharts 5
          </span>
        </div>
        <span className="badge-amchart">amCharts 5 • Line Series</span>
      </div>
      <div className="amchart-container-linha" ref={chartRef}></div>
    </div>
  );
}
