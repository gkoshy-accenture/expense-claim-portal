import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim, NewClaim } from './claim.model';

/** Talks to the Spring Boot API. Caddy routes /api/* to it, so no host name is needed here. */
@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.base}/claims`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/categories`);
  }

  createClaim(claim: NewClaim): Observable<Claim> {
    return this.http.post<Claim>(`${this.base}/claims`, claim);
  }
}
