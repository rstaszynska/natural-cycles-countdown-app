import {
  Component,
  signal,
  computed,
  effect,
  inject,
  Injectable,
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

//  FitText Directive
@Directive({
  selector: '[appFitText]',
  standalone: true,
})
export class FitTextDirective implements AfterViewInit, OnDestroy {
  @Input() maxFontSize = 80;
  @Input() tolerance = 0.95;

  private resizeObserver!: ResizeObserver;
  private mutationObserver!: MutationObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    const element = this.el.nativeElement;

    const resize = () => {
      if (typeof window === 'undefined') return;
      const parent = element.parentElement;
      if (!parent) return;

      let fontSize = this.maxFontSize;
      element.style.fontSize = `${fontSize}px`;

      while (element.scrollWidth < parent.clientWidth && fontSize < this.maxFontSize) {
        fontSize += 1;
        element.style.fontSize = `${fontSize}px`;
        if (element.scrollWidth > parent.clientWidth) {
          fontSize -= 1;
          break;
        }
      }

      while (element.scrollWidth > parent.clientWidth && fontSize > 1) {
        fontSize -= 1;
        element.style.fontSize = `${fontSize}px`;
      }

      const currentSize = parseFloat(getComputedStyle(element).fontSize);
      if (fontSize / currentSize > this.tolerance && fontSize < currentSize) {
        element.style.fontSize = currentSize + 'px';
      }
    };

    resize();

    this.resizeObserver = new ResizeObserver(resize);
    this.resizeObserver.observe(element.parentElement!);

    this.mutationObserver = new MutationObserver(resize);
    this.mutationObserver.observe(element, { childList: true, characterData: true, subtree: true });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }
}

// Quote Service
@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private apiUrl = 'https://dummyjson.com/quotes/random';
  constructor(private http: HttpClient) {}
  getRandomQuote(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatFormFieldModule, MatInputModule, CommonModule, FitTextDirective],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal<string | null>(this.loadFromStorageSafe('title'));
  protected readonly date = signal<string | null>(this.loadFromStorageSafe('date'));
  private readonly now = signal(new Date());

  protected readonly countdownTitle = computed(() => {
    const storedTitle = this.title();
    if (storedTitle && this.isBrowser()) return `Time to ${storedTitle}`;
    else if (this.isBrowser() && !storedTitle) return `Time to your event`;
    else return '';
  });

  protected readonly titlePresent = computed(() => this.isBrowser() && !!this.title());

  protected readonly timeLeftTitle = computed(() => {
    const targetDate = this.date();
    if (!this.isBrowser()) return '';
    if (!targetDate) return 'Enter a date to start countdown';
    const diff = this.calculateTimeLeft(new Date(targetDate), this.now());
    return diff
      ? `${diff.days} days, ${diff.hours} h, ${diff.minutes} m, ${diff.seconds} s`
      : 'Countdown finished!';
  });

  protected quote: string | null = null;
  protected loadingQuote = true;

  // Flag for mobile landscape
  protected isMobileLandscape = false;
  private mql?: MediaQueryList;

  private quoteServiceInstance = inject(QuoteService);

  constructor() {
    // Countdown timer effect
    effect(() => {
      const datePicked = this.date();
      if (!datePicked) return;
      this.now.set(new Date());
      const diffMs = new Date(datePicked).getTime() - new Date().getTime();
      if (diffMs <= 0) return;
      setInterval(() => this.now.set(new Date()), 1000);
    });

    // LocalStorage sync
    effect(() => {
      if (this.isBrowser()) localStorage.setItem('title', this.title() || '');
    });
    effect(() => {
      if (this.isBrowser()) localStorage.setItem('date', this.date() || '');
    });
  }

  ngOnInit() {
    this.fetchQuote();

    if (this.isBrowser()) {
      this.mql = window.matchMedia('(orientation: landscape) and (max-width: 768px)');
      this.isMobileLandscape = this.mql.matches;
      this.mql.addEventListener('change', this.handleOrientationChange);
    }
  }

  ngOnDestroy() {
    this.mql?.removeEventListener('change', this.handleOrientationChange);
  }

  private handleOrientationChange = (e: MediaQueryListEvent) => {
    this.isMobileLandscape = e.matches;
  };

  fetchQuote() {
    this.loadingQuote = true;
    this.quoteServiceInstance.getRandomQuote().subscribe({
      next: (data) => {
        this.quote = data.quote;
        this.loadingQuote = false;
      },
      error: () => {
        this.quote = 'Failed to load quote.';
        this.loadingQuote = false;
      },
    });
  }

  private calculateTimeLeft(target: Date, now: Date) {
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return null;
    const seconds = Math.floor(diffMs / 1000) % 60;
    const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private loadFromStorageSafe(key: string): string | null {
    const value = this.loadFromStorage(key);
    return value?.trim() ? value : null;
  }

  private loadFromStorage(key: string): string | null {
    if (this.isBrowser()) return localStorage.getItem(key);
    return null;
  }
}
