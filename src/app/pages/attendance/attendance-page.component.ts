import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TeacherDataService } from '../../core/teacher-data.service';
import { UiIconComponent } from '../../ui-icon.component';
import { editPanel } from '../../core/editor-panel';

@Component({selector:'app-attendance-page',standalone:true,imports:[CommonModule,FormsModule,UiIconComponent],templateUrl:'./attendance-page.component.html',styleUrl:'./attendance-page.component.scss'})
export class AttendancePageComponent {
  data=inject(TeacherDataService);route=inject(ActivatedRoute);
  private destroy=inject(DestroyRef);private requestId=0;
  private alive=true;constructor(){this.destroy.onDestroy(()=>this.alive=false);}
  session:any=null;sessionId='';message='';error='';loading=false;
  readonly labels:Record<number,string>={1:'Registered',2:'Present',3:'Absent',4:'Excused'};
  async ngOnInit(){
    try {await this.data.load();if(!this.alive)return;this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroy)).subscribe(p=>{this.sessionId=String(p.get('session')||this.data.dashboard.sessions[0]?.id||'');if(this.sessionId)void this.select();});}
    catch {this.error='The attendance register could not be loaded. Please try again.';}
  }
  async select(){
    const request=++this.requestId;
    this.loading=true;this.message='';this.error='';
    try {const session=await this.data.session(this.sessionId);if(request===this.requestId)this.session=session;}
    catch {if(request===this.requestId){this.session=null;this.error='This session could not be loaded. Please try again.';}}
    finally {if(request===this.requestId)this.loading=false;}
  }
  async record(item:any){
    const saved=await editPanel({title:'Record attendance',eyebrow:'Teaching · Attendance register',icon:'person',description:item.name+' · '+this.session.course,confirmText:'Save attendance',sections:[{title:'Attendance details',fields:[
      {name:'attendance',label:'Attendance',type:'select',required:true,value:item.attendance,full:true,options:Object.entries(this.labels).map(([value,label])=>({value,label}))},
      {name:'notes',label:'Notes',type:'textarea',value:item.notes,full:true,placeholder:'Add a note for this learner'}
    ]}],save:async values=>{await this.data.attendance(this.session.id,item.id,+values['attendance'],values['notes']||null);item.attendance=+values['attendance'];item.notes=values['notes'];}});
    if(saved)this.message='Attendance saved for '+item.name+'.';
  }
}
