import React, { useEffect, useRef } from 'react';

export default function AmChartRankingRoupas({ rankingRoupas = [] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.am5 || !window.am5xy || !chartRef.current || !rankingRoupas.length) return;
    const { am5, am5xy, am5themes_Animated } = window;

    const root = am5.Root.new(chartRef.current);
    if (am5themes_Animated) root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout })
    );

    const dados = rankingRoupas.map((r) => {
      let curto = r.nome;
      if (r.nome.includes('Calça')) curto = 'Calça Jeans';
      else if (r.nome.includes('Vestido')) curto = 'Vestido Midi';
      else if (r.nome.includes('Camiseta')) curto = 'Camiseta';
      return { ...r, nomeCurto: curto };
    });

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

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Receita',
        xAxis,
        yAxis,
        valueYField: 'faturamentoGerado',
        categoryXField: 'nomeCurto',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{nome}: R$ {valueY} ({statusGiro})',
        }),
      })
    );

    series.columns.template.adapters.add('fill', (fill, target) => {
      const item = target.dataItem?.dataContext;
      return item?.tipo === 'bottom' ? am5.color(0xf43f5e) : am5.color(0x9d174d);
    });

    series.columns.template.setAll({ cornerRadiusTL: 6, cornerRadiusTR: 6 });
    series.data.setAll(dados);

    return () => root.dispose();
  }, [rankingRoupas]);

  return (
    <div className="amchart-card">
      <div className="amchart-card-header">
        <div>
          <h4>👗 Roupas Mais vs Menos Vendidas</h4>
          <span className="amchart-subtitulo">Giro e receita por modelo</span>
        </div>
        <span className="badge-amchart-mini">amCharts 5</span>
      </div>
      <div className="amchart-container-mini" ref={chartRef}></div>
    </div>
  );
}
