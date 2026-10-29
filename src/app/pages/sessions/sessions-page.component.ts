import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { TeacherDataService } from '../../core/teacher-data.service';
import { UiIconComponent } from '../../ui-icon.component';
import { confirmAction,feedbackDialog } from '../../core/feedback-dialog';
@Component({selector:'app-sessions-page',standalone:true,imports:[CommonModule,UiIconComponent],templateUrl:'./sessions-page.component.html',styleUrl:'./sessions-page.component.scss'})
export class SessionsPageComponent {
 data=inject(TeacherDataService);pending=false;
 canStart(item:any){return ['Draft','Confirmed'].includes(item.status);}
 canComplete(item:any){return ['Draft','Confirmed','InProgress'].includes(item.status);}
 statusLabel(status:string){return status==='InProgress'?'In progress':status;}
 async ngOnInit(){await this.load();}
 async load(){try{await this.data.load();}catch{await feedbackDialog({title:'Sessions unavailable',eyebrow:'Teaching · My sessions',message:'Your schedule could not be loaded. Please refresh the page and try again.'});}}
 async update(item:any,status:number,label:string){
  if(this.pending||(status===3&&!this.canStart(item))||(status===4&&!this.canComplete(item)))return;this.pending=true;
  try {
   const completed=status===4;
   const saved=await confirmAction({title:completed?'Complete this session?':'Start this session?',eyebrow:'Teaching · Session progress',icon:completed?'check':'play',description:item.course,
    details:completed?[{title:'Review attendance',description:'Make sure the attendance register is up to date for every learner.'},{title:'Ready for certification',description:'The training office will be able to issue certificates to learners marked present.'}]:[{title:'Session in progress',description:'This session will be marked as started. You can record attendance from the Attendance page.'}],
    note:completed?'You cannot reopen a completed session from the teacher portal. Contact the training office if a correction is needed.':undefined,
    confirmText:completed?'Complete session':'Start session',action:()=>this.data.status(item.id,status)});
   if(saved)await this.load();
  }finally{this.pending=false;}
 }
}
