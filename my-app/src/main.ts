import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideLottieOptions({
        player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    provideCacheableAnimationLoader(),
    provideHttpClient(),
    provideAnimations()
],
});
