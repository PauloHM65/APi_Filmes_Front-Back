import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define a type for the movie object for better type safety
export interface Rating {
  Source: string;
  Value: string;
}

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Genre?: string;
  Plot?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  imdbRating?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Ratings?: Rating[];
  Metascore?: string;
  imdbVotes?: string;
  Type?: string;
  totalSeasons?: string;
  Response?: string;
}

export interface Review {
  id: string;
  imdbID: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Stats {
    totalSearches: number;
    genreCounts: { [key: string]: number };
    topGenre: string;
    decadeCounts: { [key: string]: number };
    favoriteDecade: string;
    averageRating: number;
    yearCounts: { [key: string]: number };
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // --- Movie Search ---
  searchMovies(title: string): Observable<Movie[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Movie[]>(`${this.baseUrl}/movies/search`, { params });
  }

  getMovieDetails(id: string): Observable<Movie> {
    
    return this.http.get<Movie>(`${this.baseUrl}/movies/details/${id}`);
  }

  // --- Favorites ---
  getFavorites(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/favorites`);
  }

  addFavorite(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/favorites`, movie);
  }

  removeFavorite(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/favorites/${id}`);
  }

  // --- Reviews ---
  getReviews(movieId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews/${movieId}`);
  }

  postReview(review: { imdbID: string; rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/reviews`, review);
  }

  deleteReview(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/reviews/${id}`);
  }

  // --- Stats ---
  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.baseUrl}/stats`);
  }
}