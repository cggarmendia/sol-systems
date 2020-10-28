import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LangInterceptor } from '../interceptors/lang/lang.interceptor';
import { HttpLoggerInterceptor } from './http-logger/http-logger.interceptor';

export const interceptors = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLoggerInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LangInterceptor,
    multi: true,
  }
];
