import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { ApiService, Movie } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Using a Subject for real-time search term handling
  private searchTerm = new Subject<string>();
  
  movies$!: Observable<Movie[]>;
  isLoading = false;
  error: string | null = null;

  constructor() {
    this.movies$ = this.searchTerm.pipe(
      debounceTime(300), // Wait for 300ms pause in events
      distinctUntilChanged(), // Ignore if next search term is same as previous
      tap(() => {
        this.isLoading = true;
        this.error = null;
      }),
      switchMap(term => {
        if (!term.trim()) {
          return of([]); // If search term is empty, return empty array
        }
        return this.apiService.searchMovies(term).pipe(
          catchError(err => {
            this.error = 'Ocorreu um erro ao buscar os filmes. Tente novamente mais tarde.';
            console.error(err);
            return of([]); // Return an empty array on error
          })
        );
      }),
      tap(() => this.isLoading = false)
    );
  }

  // Push a new search term into the stream
  onSearch(term: string): void {
    this.searchTerm.next(term);
  }

  // For *ngFor performance
  trackByImdbID(index: number, movie: Movie): string {
    return movie.imdbID;
  }

  // Navigate to movie details page
  goToDetails(movieId: string): void {
    this.router.navigate(['/details', movieId]);
  }
}