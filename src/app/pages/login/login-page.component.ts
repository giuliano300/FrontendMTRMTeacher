import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { UiIconComponent } from '../../ui-icon.component';
import { feedbackDialog } from '../../core/feedback-dialog';
@Component({selector:'app-login-page',standalone:true,imports:[FormsModule,UiIconComponent],templateUrl:'./login-page.component.html',styleUrl:'./login-page.component.scss'})
export class LoginPageComponent {
 private auth=inject(AuthService);private router=inject(Router);email='';password='';busy=false;
 async submit(){if(this.busy)return;this.busy=true;try{await this.auth.login(this.email,this.password);await this.router.navigateByUrl('/dashboard');}catch{await feedbackDialog({title:'Unable to sign in',eyebrow:'Teacher portal · Account access',icon:'lock',message:'Check your email address and password. Your teacher account must be enabled by the training office.'});}finally{this.busy=false;}}
}
