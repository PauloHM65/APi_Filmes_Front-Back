import { ChartConfiguration, ChartType } from 'chart.js';

/**
 * Interface base genérica para um item do dashboard.
 * @template T O tipo de dado que este item do dashboard irá conter.
 */
export interface DashboardItem<T> {
  title: string;
  data: T;
}

/**
 * Tipo de dado para um widget que exibe um único valor numérico ou de texto.
 */
export type SingleValueData = number | string;

/**
 * Define a estrutura de um único ponto de dado para um gráfico (ex: uma barra, uma fatia de pizza).
 */
export interface ChartDataPoint {
  name: string;
  value: number;
}

/**
 * Interface para um widget que exibe uma métrica de valor único.
 * Herda de DashboardItem, especificando o tipo de dado.
 */
export interface ValueWidget extends DashboardItem<SingleValueData> {
  type: 'value';
  /** Opcional: Unidade a ser exibida junto ao valor (ex: "filmes", "GB", "%"). */
  unit?: string;
  /** Opcional: Nome de um ícone a ser exibido no card. */
  icon?: string;
}

/**
 * Interface para um widget que exibe um gráfico.
 * Herda de DashboardItem, especificando que os dados são uma lista de pontos de gráfico.
 */
export interface ChartWidget extends DashboardItem<ChartDataPoint[]> {
  type: 'chart';
  /** O tipo de gráfico a ser renderizado (ex: 'bar', 'pie', 'line'). */
  chartType: ChartType;
  /** Opcional: Objeto de configuração avançada para o Chart.js. */
  chartOptions?: ChartConfiguration['options'];
}

/**
 * Tipo de união para representar qualquer tipo de widget possível no dashboard.
 * Facilita o uso em arrays e templates.
 */
export type AnyDashboardWidget = ValueWidget | ChartWidget;
