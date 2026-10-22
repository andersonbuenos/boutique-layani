import React, { useEffect, useRef } from 'react';

export default function AmChartVendedores({ vendedores = [] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.am5 || !window.am5xy || !chartRef.current || !vendedores.length) return;
    const { am5, am5xy, am5themes_Animated } = window;

    const root = am5.Root.new(chartRef.current);
    if (am5themes_Animated) root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout })
    );

    const dados = vendedores.map((v) => ({
      ...v,
      nomeCurto: v.nome.split(' ')[0],
    }));

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      cellStartLocation: 0.15,
      cellEndLocation: 0.85,
    });
    xRenderer.labels.template.setAll({
      rotation: -20,
      centerY: am5.p50,
      centerX: am5.p100,
      fontSize: 11,
      paddingTop: 8,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'nomeCurto',
        renderer: xRenderer,
      })
    );
    xAxis.data.setAll(dados);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
    );

    const s1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Vendas Realizadas',
        xAxis,
        yAxis,
        valueYField: 'vendasRealizadas',
        categoryXField: 'nomeCurto',
        fill: am5.color(0x9d174d),
        tooltip: am5.Tooltip.new(root, { labelText: '{nome}: R$ {valueY}' }),
      })
    );
    s1.columns.template.setAll({ cornerRadiusTL: 6, cornerRadiusTR: 6 });
    s1.data.setAll(dados);

    const s2 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Meta',
        xAxis,
        yAxis,
        valueYField: 'metaMensal',
        categoryXField: 'nomeCurto',
        fill: am5.color(0xfce7f3),
        stroke: am5.color(0xdb2777),
        tooltip: am5.Tooltip.new(root, { labelText: 'Meta {nome}: R$ {valueY}' }),
      })
    );
    s2.columns.template.setAll({ cornerRadiusTL: 6, cornerRadiusTR: 6, strokeWidth: 2 });
    s2.data.setAll(dados);

    return () => root.dispose();
  }, [vendedores]);

  return (
    <div className="amchart-card">
      <div className="amchart-card-header">
        <div>
          <h4>🏆 Vendedores: Realizado vs Meta</h4>
          <span className="amchart-subtitulo">Desempenho da equipe comercial</span>
        </div>
        <span className="badge-amchart-mini">amCharts 5</span>
      </div>
      <div className="amchart-container-mini" ref={chartRef}></div>
    </div>
  );
}
