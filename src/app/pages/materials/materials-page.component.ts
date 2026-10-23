import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { feedbackDialog } from '../../core/feedback-dialog';
import { UiIconComponent } from '../../ui-icon.component';
import { ApiService } from '../../core/api.service';
@Component({selector:'app-materials-page',standalone:true,imports:[CommonModule,UiIconComponent],templateUrl:'./materials-page.component.html',styleUrl:'./materials-page.component.scss'})
export class MaterialsPageComponent {
 private route=inject(ActivatedRoute);private router=inject(Router);selectedId='';
 constructor(){this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(p=>this.selectedId=p.get('material')??'');}
 get filtered(){return this.items.filter(x=>!this.selectedId||x.id===this.selectedId);}
 clearSelection(){void this.router.navigateByUrl('/materials');}
 private api=inject(ApiService);items:any[]=[];
 async ngOnInit(){try{this.items=await firstValueFrom(this.api.get<any[]>('/teacher/materials'));}catch{await feedbackDialog({title:'Materials unavailable',eyebrow:'Teaching · Learning materials',icon:'file',message:'The resource library could not be loaded. Please refresh the page or contact the training office.'});}}
 async download(item:any){try{const blob=await firstValueFrom(this.api.download('/materials/'+item.id+'/download'));const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=item.fileName;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{await feedbackDialog({title:'File unavailable',eyebrow:'Teaching · Learning materials',icon:'file',message:'This resource could not be downloaded. Please try again or ask the training office to check the file.'});}}
}
