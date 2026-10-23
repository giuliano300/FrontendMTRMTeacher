import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
@Injectable({providedIn:'root'})
export class AuthService {
 private http=inject(HttpClient);private router=inject(Router);
 readonly api=['localhost','127.0.0.1'].includes(location.hostname)?'http://127.0.0.1:5158/api':location.origin+'/api';
 get token(){return localStorage.getItem('mtrm_teacher_token_v2')||'';}
 get authenticated(){return !!this.token;}
 async login(email:string,password:string){
  const x=await firstValueFrom(this.http.post<any>(this.api+'/auth/login',{email,password,portal:'teacher'}));
  if(x.user?.role!=='Teacher')throw new Error('Teacher account required');
  localStorage.setItem('mtrm_teacher_token_v2',x.token);localStorage.setItem('mtrm_teacher_name',x.user.displayName);
 }
 logout(){localStorage.removeItem('mtrm_teacher_token_v2');localStorage.removeItem('mtrm_teacher_name');void this.router.navigateByUrl('/login');}
}
