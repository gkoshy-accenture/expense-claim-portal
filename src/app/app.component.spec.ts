import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppComponent } from './app.component';
import { Claim } from './claim.model';
import { ClaimService } from './claim.service';
import { WORKSHOP } from './workshop.config';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let api: {
    getClaims: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
    createClaim: ReturnType<typeof vi.fn>;
  };

  const existing: Claim = {
    id: 7,
    employee: 'Maya Chen',
    category: 'Travel',
    amount: 184.2,
    description: 'Train',
    status: 'Approved',
    createdAt: '2026-11-11T10:00:00Z'
  };

  const validValue = { employee: 'Asha Rao', category: 'Travel', amount: 42.5, description: 'Taxi to the client' };

  beforeEach(() => {
    api = {
      getClaims: vi.fn().mockReturnValue(of([existing])),
      getCategories: vi.fn().mockReturnValue(of(['Travel', 'Meals'])),
      createClaim: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: ClaimService, useValue: api }]
    });
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent ?? '';

  it('has a name in the workshop config for the page header', () => {
    expect(WORKSHOP.workshopper.trim().length).toBeGreaterThan(0);
    expect(text()).toContain(WORKSHOP.workshopper);
  });

  it('lists the claims returned by the API', () => {
    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll('.claim-row');
    expect(rows.length).toBe(1);
    expect(text()).toContain('Maya Chen');
    expect(text()).toContain('Approved');
  });

  it('offers the categories returned by the API', () => {
    const options = (fixture.nativeElement as HTMLElement).querySelectorAll('#category option');
    // "Choose..." plus the two categories
    expect(options.length).toBe(3);
  });

  it('does not send an invalid form', () => {
    fixture.componentInstance.submit();
    expect(api.createClaim).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });

  it('sends a valid claim, clears the form and reloads the list', () => {
    api.createClaim.mockReturnValue(of({ ...existing, id: 8, employee: 'Asha Rao' }));
    fixture.componentInstance.form.setValue(validValue);

    fixture.componentInstance.submit();

    expect(api.createClaim).toHaveBeenCalledTimes(1);
    expect(api.createClaim).toHaveBeenCalledWith(validValue);
    expect(api.getClaims).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.form.controls.employee.value).toBe('');
  });

  it('shows the messages returned by the API when saving fails', () => {
    api.createClaim.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { errors: ['Choose a category from the list.'] } }))
    );
    fixture.componentInstance.form.setValue(validValue);

    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.errors')?.textContent).toContain(
      'Choose a category from the list.'
    );
  });

  it('shows a friendly message when the server cannot be reached', () => {
    api.createClaim.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    fixture.componentInstance.form.setValue(validValue);

    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(text()).toContain('Could not reach the server');
  });
});
