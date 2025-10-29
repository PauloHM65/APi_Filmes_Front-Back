import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService, Movie } from '../../services/api.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  favorites$!: Observable<Movie[]>;
  error: string | null = null;

  ngOnInit(): void {
    this.favorites$ = this.apiService.getFavorites().pipe(
      catchError(err => {
        this.error = 'Não foi possível carregar os filmes favoritos.';
        console.error(err);
        return of([]);
      })
    );
  }

  goToDetails(movieId: string): void {
    this.router.navigate(['/details', movieId]);
  }

  trackByImdbID(index: number, movie: Movie): string {
    return movie.imdbID;
  }
}