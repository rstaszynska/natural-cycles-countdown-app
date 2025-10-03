import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [provideHttpClient(withFetch())],
}).catch((err) => console.error(err));
