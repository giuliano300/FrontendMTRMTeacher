import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UiIconComponent } from '../../ui-icon.component';
import { ApiService } from '../../core/api.service';
import { editPanel } from '../../core/editor-panel';

@Component({selector:'app-profile-page',standalone:true,imports:[UiIconComponent],templateUrl:'./profile-page.component.html',styleUrl:'./profile-page.component.scss'})
export class ProfilePageComponent {
  private api=inject(ApiService);
  name='';email='';phone='';qualifications='';loaded=false;error='';
  async ngOnInit(){await this.load();}
  async load(){
    try {const x=await firstValueFrom(this.api.get<any>('/teacher/profile'));this.name=x.firstName+' '+x.lastName;this.email=x.email;this.phone=x.phone||'';this.qualifications=x.qualifications||'';this.loaded=true;this.error='';}
    catch {this.error='Your profile could not be loaded. Please try again.';}
  }
  async edit(){
    if(!this.loaded)return;
    const saved=await editPanel({title:'Edit my profile',eyebrow:'Account · Contact details',icon:'person',description:'Update your contact details and teaching expertise. Your name and sign-in email are managed by MTRM Administration.',confirmText:'Save profile',sections:[{title:'Contact and expertise',fields:[
      {name:'phone',label:'Phone number',type:'tel',value:this.phone,full:true,placeholder:'+356'},
      {name:'qualifications',label:'Qualifications',type:'textarea',value:this.qualifications,full:true,placeholder:'Professional qualifications and areas of expertise'}
    ]}],save:values=>firstValueFrom(this.api.put('/teacher/profile',{phone:values['phone'],qualifications:values['qualifications']}))});
    if(saved)await this.load();
  }
}
