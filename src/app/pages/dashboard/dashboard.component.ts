import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService, Stats } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  stats$!: Observable<Stats | null>;
  error: string | null = null;

  // Chart data
  genreChartData$: Observable<any[]> | undefined;
  yearChartData$: Observable<any[]> | undefined;

  // Chart options
  view: [number, number] = [700, 400];
  colorScheme = 'vivid';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabelGenre = 'Gênero';
  xAxisLabelYear = 'Ano';
  showYAxisLabel = true;
  yAxisLabel = 'Quantidade';

  ngOnInit(): void {
    this.stats$ = this.apiService.getStats().pipe(
      catchError(err => {
        this.error = 'Não foi possível carregar as estatísticas.';
        console.error(err);
        return of(null);
      })
    );
    

    this.genreChartData$ = this.stats$.pipe(
        map(stats => {
            if (!stats) return [];
            return Object.entries(stats.genreCounts).map(([name, value]) => ({ name, value }));
        })
    );

    this.yearChartData$ = this.stats$.pipe(
        map(stats => {
            if (!stats) return [];
            const sortedYears = Object.entries(stats.yearCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => parseInt(a.name) - parseInt(b.name)); // Sort by year

            return [{
                name: 'Filmes Buscados', // Series name
                series: sortedYears
            }];
        })
    );
  }
}