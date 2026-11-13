import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Claim } from './claim.model';
import { ClaimService } from './claim.service';
import { WORKSHOP } from './workshop.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly api = inject(ClaimService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly workshop = WORKSHOP;
  readonly claims = signal<Claim[]>([]);
  readonly categories = signal<string[]>([]);
  readonly errors = signal<string[]>([]);
  readonly saving = signal(false);

  // The same rules as the API, so most mistakes are caught before the request is sent.
  readonly form = this.fb.group({
    employee: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    category: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(10000)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
  });

  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (items) => this.categories.set(items),
      error: (err) => this.errors.set(this.messagesFrom(err))
    });
    this.loadClaims();
  }

  loadClaims(): void {
    this.api.getClaims().subscribe({
      next: (items) => this.claims.set(items),
      error: (err) => this.errors.set(this.messagesFrom(err))
    });
  }

  submit(): void {
    this.errors.set([]);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.api
      .createClaim({
        employee: value.employee,
        category: value.category,
        amount: Number(value.amount),
        description: value.description
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.form.reset();
          this.loadClaims();
        },
        error: (err) => this.errors.set(this.messagesFrom(err))
      });
  }

  /** True when a field has been touched and fails validation (used to show a red border). */
  showInvalid(name: 'employee' | 'category' | 'amount' | 'description'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  private messagesFrom(err: unknown): string[] {
    const body = (err as HttpErrorResponse | undefined)?.error as { errors?: unknown } | undefined;
    if (body && Array.isArray(body.errors)) {
      return body.errors.map(String);
    }
    return ['Could not reach the server. Try again in a moment.'];
  }
}
