import React, { useEffect, useRef } from 'react';

export default function AmChartsMulti({
  vendedores,
  motivosCancelamento,
  rankingRoupas,
}) {
  const chartVendedoresRef = useRef(null);
  const chartCancelamentosRef = useRef(null);
  const chartRankingRef = useRef(null);

  useEffect(() => {
    if (!window.am5 || !window.am5xy || !window.am5percent) return;
    const { am5, am5xy, am5percent, am5themes_Animated } = window;
    const roots = [];

    // 1. Colunas: Vendedores (Realizado vs Meta)
    if (chartVendedoresRef.current && vendedores?.length) {
      const root = am5.Root.new(chartVendedoresRef.current);
      roots.push(root);
      if (am5themes_Animated) root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout })
      );
      const x = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'nome',
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 20 }),
        })
      );
      x.data.setAll(vendedores);
      const y = chart.yAxes.push(
        am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
      );

      const s1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: 'Vendas',
          xAxis: x,
          yAxis: y,
          valueYField: 'vendasRealizadas',
          categoryXField: 'nome',
          fill: am5.color(0xbe185d),
          tooltip: am5.Tooltip.new(root, { labelText: '{name}: R$ {valueY}' }),
        })
      );
      s1.columns.template.setAll({ cornerRadiusTL: 6, cornerRadiusTR: 6 });
      s1.data.setAll(vendedores);

      const s2 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: 'Meta',
          xAxis: x,
          yAxis: y,
          valueYField: 'metaMensal',
          categoryXField: 'nome',
          fill: am5.color(0xfce7f3),
          stroke: am5.color(0xdb2777),
          tooltip: am5.Tooltip.new(root, { labelText: '{name}: R$ {valueY}' }),
        })
      );
      s2.columns.template.setAll({ cornerRadiusTL: 6, cornerRadiusTR: 6, strokeWidth: 2 });
      s2.data.setAll(vendedores);
    }

    // 2. Rosca: Motivos de Cancelamento
    if (chartCancelamentosRef.current && motivosCancelamento?.length) {
      const root = am5.Root.new(chartCancelamentosRef.current);
      roots.push(root);
      if (am5themes_Animated) root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, { innerRadius: am5.percent(55), layout: root.verticalLayout })
      );
      const s = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: 'percentual',
          categoryField: 'motivo',
          alignLabels: false,
        })
      );
      s.labels.template.set('visible', false);
      s.ticks.template.set('visible', false);
      s.slices.template.setAll({
        tooltipText: '{category}: {value}% (R$ {valorPerdido})',
      });
      s.data.setAll(motivosCancelamento);
    }

    // 3. Colunas: Top vs Bottom Roupas
    if (chartRankingRef.current && rankingRoupas?.length) {
      const root = am5.Root.new(chartRankingRef.current);
      roots.push(root);
      if (am5themes_Animated) root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, { panX: false, panY: false, layout: root.verticalLayout })
      );
      const x = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'nome',
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 20 }),
        })
      );
      x.data.setAll(rankingRoupas);
      const y = chart.yAxes.push(
        am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
      );

      const s = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: 'Receita',
          xAxis: x,
          yAxis: y,
          valueYField: 'faturamentoGerado',
          categoryXField: 'nome',
          tooltip: am5.Tooltip.new(root, { labelText: '{name}: R$ {valueY}' }),
        })
      );
      s.columns.template.adapters.add('fill', (fill, target) => {
        const item = target.dataItem?.dataContext;
        return item?.tipo === 'bottom' ? am5.color(0xf43f5e) : am5.color(0x9d174d);
      });
      s.columns.template.setAll({ cornerRadiusTL: 6, cornerRadiusTR: 6 });
      s.data.setAll(rankingRoupas);
    }

    return () => roots.forEach((r) => r.dispose());
  }, [vendedores, motivosCancelamento, rankingRoupas]);

  return (
    <div className="amcharts-grid-triplo">
      <div className="amchart-card">
        <div className="amchart-card-header">
          <div>
            <h4>🏆 Vendedores: Realizado vs Meta</h4>
            <span className="amchart-subtitulo">Desempenho da equipe</span>
          </div>
          <span className="badge-amchart-mini">amCharts 5</span>
        </div>
        <div className="amchart-container-mini" ref={chartVendedoresRef}></div>
      </div>

      <div className="amchart-card">
        <div className="amchart-card-header">
          <div>
            <h4>🚨 Motivos de Cancelamento</h4>
            <span className="amchart-subtitulo">Faturamento perdido</span>
          </div>
          <span className="badge-amchart-mini">amCharts 5 Donut</span>
        </div>
        <div className="amchart-container-mini" ref={chartCancelamentosRef}></div>
      </div>

      <div className="amchart-card">
        <div className="amchart-card-header">
          <div>
            <h4>👗 Roupas Mais vs Menos Vendidas</h4>
            <span className="amchart-subtitulo">Giro por modelo</span>
          </div>
          <span className="badge-amchart-mini">amCharts 5</span>
        </div>
        <div className="amchart-container-mini" ref={chartRankingRef}></div>
      </div>
    </div>
  );
}
