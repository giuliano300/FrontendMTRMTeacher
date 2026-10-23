import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError,throwError } from 'rxjs';
import { AuthService } from './auth.service';
export const authInterceptor:HttpInterceptorFn=(r,next)=>{
 const auth=inject(AuthService);const scoped=r.url.startsWith(auth.api+'/');
 return next(scoped&&auth.token?r.clone({setHeaders:{Authorization:`Bearer ${auth.token}`}}):r).pipe(catchError(error=>{if(scoped&&error.status===401&&auth.token)auth.logout();return throwError(()=>error);}));
};
