import React from 'react';
import AmChartVendedores from './AmChartVendedores';
import AmChartCancelamentos from './AmChartCancelamentos';
import AmChartRankingRoupas from './AmChartRankingRoupas';

export default function AmChartsMulti({
  vendedores = [],
  motivosCancelamento = [],
  rankingRoupas = [],
}) {
  return (
    <div className="amcharts-grid-triplo">
      <AmChartVendedores vendedores={vendedores} />
      <AmChartCancelamentos motivosCancelamento={motivosCancelamento} />
      <AmChartRankingRoupas rankingRoupas={rankingRoupas} />
    </div>
  );
}
