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
  @Input() tolerance = 0.95; // prevent unnecessary font changes

  private resizeObserver!: ResizeObserver;
  private mutationObserver!: MutationObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (typeof window === 'undefined') return; // SSR guard

    const element = this.el.nativeElement;

    const resize = () => {
      if (typeof window === 'undefined') return;

      const parent = element.parentElement;
      if (!parent) return;

      // start from maxFontSize
      element.style.fontSize = `${this.maxFontSize}px`;
      let fontSize = this.maxFontSize;

      // expand if necessary (length of text decreased or window resized)
      while (element.scrollWidth < parent.clientWidth && fontSize < this.maxFontSize) {
        fontSize += 1;
        element.style.fontSize = `${fontSize}px`;
        if (element.scrollWidth > parent.clientWidth) {
          fontSize -= 1; // last step overflowed, revert
          break;
        }
      }

      // shrink if necessary (length of text increased or window resized)
      while (element.scrollWidth > parent.clientWidth && fontSize > 1) {
        fontSize -= 1;
        element.style.fontSize = `${fontSize}px`;
      }

      // prevent tiny jumps using a tolerance threshold
      const currentSize = parseFloat(getComputedStyle(element).fontSize);
      if (fontSize / currentSize > this.tolerance && fontSize < currentSize) {
        element.style.fontSize = currentSize + 'px';
      }
    };

    // initial fit
    resize();

    // observe container resize
    this.resizeObserver = new ResizeObserver(resize);
    this.resizeObserver.observe(element.parentElement!);

    // observe text changes
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
export class App {
  private loadFromStorageSafe(key: string): string | null {
    const value = this.loadFromStorage(key);
    return value?.trim() ? value : null;
  }

  protected readonly title = signal<string | null>(this.loadFromStorageSafe('title'));
  protected readonly date = signal<string | null>(this.loadFromStorageSafe('date'));
  private readonly now = signal(new Date());

  protected readonly countdownTitle = computed(() => {
    const storedTitle = this.title();
    if (storedTitle && this.isBrowser()) return `Time to ${storedTitle}`;
    else if (this.isBrowser() && !storedTitle) return `Time to your event`;
    else return '';
  });

  protected readonly titlePresent = computed(() => {
    return this.isBrowser() && !!this.title();
  });

  protected readonly timeLeftTitle = computed(() => {
    const targetDate = this.date();
    if (this.isBrowser()) {
      if (!targetDate) return 'Enter a date to start countdown';
      else {
        const diff = this.calculateTimeLeft(new Date(targetDate), this.now());
        if (!diff) return 'Countdown finished!';
        return `${diff.days} days, ${diff.hours} h, ${diff.minutes} m, ${diff.seconds} s`;
      }
    } else return '';
  });

  protected quote: string | null = null;
  protected loadingQuote = true;

  private quoteServiceInstance = inject(QuoteService);

  constructor() {
    effect(() => {
      const datePicked = this.date();
      if (!datePicked) return;
      this.now.set(new Date());
      const diffMs = new Date(datePicked).getTime() - new Date().getTime();
      if (diffMs <= 0) return;
      setInterval(() => this.now.set(new Date()), 1000);
    });

    effect(() => {
      if (this.isBrowser()) {
        localStorage.setItem('title', this.title() || '');
      }
    });

    effect(() => {
      if (this.isBrowser()) {
        localStorage.setItem('date', this.date() || '');
      }
    });
  }

  ngOnInit() {
    this.fetchQuote();
  }

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

  private loadFromStorage(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  }
}
