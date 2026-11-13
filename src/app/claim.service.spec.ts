import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Claim } from './claim.model';
import { ClaimService } from './claim.service';

describe('ClaimService', () => {
  let service: ClaimService;
  let http: HttpTestingController;

  const claim: Claim = {
    id: 1,
    employee: 'Asha Rao',
    category: 'Travel',
    amount: 42.5,
    description: 'Taxi',
    status: 'Submitted',
    createdAt: '2026-11-11T10:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ClaimService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads claims from /api/claims', () => {
    let result: Claim[] = [];
    service.getClaims().subscribe((claims) => (result = claims));

    const req = http.expectOne('/api/claims');
    expect(req.request.method).toBe('GET');
    req.flush([claim]);

    expect(result).toEqual([claim]);
  });

  it('loads the category list from /api/categories', () => {
    let result: string[] = [];
    service.getCategories().subscribe((categories) => (result = categories));

    http.expectOne('/api/categories').flush(['Travel', 'Meals']);

    expect(result).toEqual(['Travel', 'Meals']);
  });

  it('posts a new claim to /api/claims', () => {
    const newClaim = { employee: 'Asha Rao', category: 'Travel', amount: 42.5, description: 'Taxi' };
    let saved: Claim | undefined;
    service.createClaim(newClaim).subscribe((c) => (saved = c));

    const req = http.expectOne('/api/claims');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newClaim);
    req.flush(claim);

    expect(saved).toEqual(claim);
  });
});
