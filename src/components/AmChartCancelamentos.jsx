import React, { useEffect, useRef } from 'react';

export default function AmChartCancelamentos({ motivosCancelamento = [] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.am5 || !window.am5percent || !chartRef.current || !motivosCancelamento.length) return;
    const { am5, am5percent, am5themes_Animated } = window;

    const root = am5.Root.new(chartRef.current);
    if (am5themes_Animated) root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(52),
        layout: root.verticalLayout,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'percentual',
        categoryField: 'motivo',
        alignLabels: false,
      })
    );
    series.labels.template.set('visible', false);
    series.ticks.template.set('visible', false);
    series.slices.template.setAll({
      tooltipText: '{category}: {value}% (R$ {valorPerdido})',
    });
    series.data.setAll(motivosCancelamento);

    // Legenda dos motivos logo abaixo da rosca
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 8,
        layout: root.verticalLayout,
      })
    );
    legend.labels.template.setAll({ fontSize: 11, maxWidth: 300 });
    legend.valueLabels.template.setAll({ fontSize: 11, fontWeight: 'bold' });
    legend.data.setAll(series.dataItems);

    return () => root.dispose();
  }, [motivosCancelamento]);

  return (
    <div className="amchart-card">
      <div className="amchart-card-header">
        <div>
          <h4>🚨 Motivos de Cancelamento</h4>
          <span className="amchart-subtitulo">Onde a receita está escapando</span>
        </div>
        <span className="badge-amchart-mini">amCharts 5 Donut</span>
      </div>
      <div className="amchart-container-mini" ref={chartRef}></div>
    </div>
  );
}
