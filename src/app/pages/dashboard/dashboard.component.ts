import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ApiService, Stats } from '../../services/api.service';
import {
  AnyDashboardWidget,
  ChartDataPoint,
  ChartWidget,
  ValueWidget,
} from '../../libs/dashboards';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  public widgets: AnyDashboardWidget[] = [];
  public isLoading = true;
  public error: string | null = null;

  // Opções para os gráficos (podem ser movidas para os widgets individuais depois)
  public colorScheme = 'vivid';
  public showXAxis = true;
  public showYAxis = true;
  public showXAxisLabel = true;
  public showYAxisLabel = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService
      .getStats()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (stats) => {
          this.buildWidgets(stats);
        },
        error: (err) => {
          this.error = 'Não foi possível carregar as estatísticas.';
          console.error(err);
        },
      });
  }

  private buildWidgets(stats: Stats): void {
    const valueWidgets: ValueWidget[] = [
      {
        type: 'value',
        title: 'Total de Cagadas Fedral Gosmica',
        data: stats.totalSearches,
        icon: 'search', // Exemplo de ícone
      },
      {
        type: 'value',
        title: 'Nota Média',
        data: parseFloat(stats.averageRating.toFixed(1)),
        unit: '/ 5',
      },
      {
        type: 'value',
        title: 'Gênero Favorito',
        data: stats.topGenre,
      },
      {
        type: 'value',
        title: 'Década Favorita',
        data: stats.favoriteDecade,
      },
    ];

    const chartWidgets: ChartWidget[] = [
      {
        type: 'chart',
        title: 'Distribuição de Gêneros (Favoritos)',
        chartType: 'bar',
        data: this.transformCountsToChartData(stats.genreCounts),
      },
      {
        type: 'chart',
        title: 'Filmes por Década (Favoritos)',
        chartType: 'pie',
        data: this.transformCountsToChartData(stats.decadeCounts),
      },
    ];

    this.widgets = [...valueWidgets, ...chartWidgets];
  }

  private transformCountsToChartData(counts: {
    [key: string]: number;
  }): ChartDataPoint[] {
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }
}