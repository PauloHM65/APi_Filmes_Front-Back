import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap, tap, catchError, forkJoin } from 'rxjs';
import { ApiService, Movie, Review } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private router = inject(Router);

  movie$: Observable<Movie | null> | undefined;
  reviews$: Observable<Review[]> | undefined;
  isFavorite$: Observable<boolean> | undefined;

  newReview = { rating: 3, comment: '' };
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.movie$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error = 'ID do filme não encontrado.';
          this.isLoading = false;
          return of(null);
        }

        this.isLoading = true;
        this.loadInitialData(id);
        
        return this.apiService.getMovieDetails(id).pipe(
          tap(() => this.isLoading = false),
          catchError(err => {
            this.error = 'Não foi possível carregar os detalhes do filme.';
            this.isLoading = false;
            console.error(err);
            return of(null);
          })
        );
      })
    );
  }

  loadInitialData(id: string): void {
    this.reviews$ = this.apiService.getReviews(id);
    this.isFavorite$ = this.checkIfFavorite(id);
  }

  checkIfFavorite(id: string): Observable<boolean> {
    return this.apiService.getFavorites().pipe(
      switchMap(favorites => of(favorites.some(fav => fav.imdbID === id)))
    );
  }

  toggleFavorite(movie: Movie): void {
    this.isFavorite$?.pipe(tap(isFav => {
      if(isFav) {
        this.apiService.removeFavorite(movie.imdbID).subscribe(() => {
          this.isFavorite$ = of(false);
        });
      } else {
        this.apiService.addFavorite(movie).subscribe(() => {
          this.isFavorite$ = of(true);
        });
      }
    })).subscribe();
  }

  onReviewSubmit(imdbID: string): void {
    if (this.newReview.comment && this.newReview.rating) {
      this.apiService.postReview({ ...this.newReview, imdbID }).subscribe(() => {
        // Reset form and reload reviews
        this.newReview = { rating: 3, comment: '' };
        this.reviews$ = this.apiService.getReviews(imdbID);
      });
    }
  }

  deleteReview(reviewId: string, imdbID: string): void {
    this.apiService.deleteReview(reviewId).subscribe(() => {
      this.reviews$ = this.apiService.getReviews(imdbID);
    });
  }
}