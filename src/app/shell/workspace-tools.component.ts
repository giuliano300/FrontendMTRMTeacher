import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, filter, of, switchMap, timer } from 'rxjs';
import { ApiService } from '../core/api.service';
import { UiIconComponent } from '../ui-icon.component';
interface SearchItem {id:string;category:string;title:string;detail:string;url:string}
interface Notice {id:string;version:string;title:string;detail:string;url:string;kind:string}
@Component({selector:'workspace-tools',standalone:true,imports:[CommonModule,UiIconComponent],templateUrl:'./workspace-tools.component.html',styleUrl:'./workspace-tools.component.scss'})
export class WorkspaceToolsComponent {
 @Input() portal:'admin'|'teacher'='admin';@Input() initials='';
 @ViewChild('searchInput') searchInput?:ElementRef<HTMLInputElement>;
 private api=inject(ApiService);private router=inject(Router);private destroy=inject(DestroyRef);private element=inject(ElementRef);
 private terms=new Subject<string>();private scopeKey='';private read:Record<string,string>={};
 query='';results:SearchItem[]=[];hasMore=false;searchOpen=false;searchBusy=false;searchError='';active=-1;
 notificationsOpen=false;notices:Notice[]=[];noticeBusy=false;noticeError='';updatedAt='';storageUnavailable=false;
 constructor(){
  this.terms.pipe(switchMap(q=>q.length<2?of({items:[],hasMore:false,error:''}):timer(240).pipe(switchMap(()=>this.api.get<{items:SearchItem[];hasMore:boolean}>('/workspace/search?q='+encodeURIComponent(q))),catchError(()=>of({items:[],hasMore:false,error:'Search is unavailable. Please try again.'})))),takeUntilDestroyed(this.destroy)).subscribe(result=>{this.results=result.items;this.hasMore=result.hasMore;this.searchError='error' in result?result.error:'';this.searchBusy=false;this.active=-1;});
  this.router.events.pipe(filter(x=>x instanceof NavigationEnd),takeUntilDestroyed(this.destroy)).subscribe(()=>{this.searchOpen=false;this.notificationsOpen=false;this.refreshNotices();});
  timer(0,60000).pipe(takeUntilDestroyed(this.destroy)).subscribe(()=>{if(document.visibilityState==='visible')this.refreshNotices();});
 }
 search(value:string){this.query=value.slice(0,120);this.results=[];this.searchError='';this.active=-1;this.searchOpen=true;this.notificationsOpen=false;this.searchBusy=this.query.trim().length>=2;this.terms.next(this.query.trim());}
 clear(){this.search('');this.searchInput?.nativeElement.focus();}
 key(event:KeyboardEvent){
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();this.searchOpen=true;if(this.results.length)this.active=(this.active+(event.key==='ArrowDown'?1:-1)+this.results.length)%this.results.length;}
  if(event.key==='Enter'&&this.searchOpen&&this.results.length){event.preventDefault();this.go(this.results[Math.max(0,this.active)].url);}
  if(event.key==='Escape'){this.searchOpen=false;this.notificationsOpen=false;}
 }
 @HostListener('document:keydown',['$event']) shortcut(event:KeyboardEvent){if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();this.searchInput?.nativeElement.focus();this.searchOpen=true;}if(event.key==='Escape'){this.searchOpen=false;this.notificationsOpen=false;}}
 @HostListener('document:click',['$event']) outside(event:MouseEvent){if(!this.element.nativeElement.contains(event.target)){this.searchOpen=false;this.notificationsOpen=false;}}
 go(url:string,event?:Event){event?.preventDefault();this.searchOpen=false;this.notificationsOpen=false;void this.router.navigateByUrl(url);}
 toggleNotices(){this.notificationsOpen=!this.notificationsOpen;this.searchOpen=false;if(this.notificationsOpen)this.refreshNotices();}
 refreshNotices(){
  if(this.noticeBusy)return;this.noticeBusy=true;this.noticeError='';
  this.api.get<{items:Notice[];generatedAt:string;scopeKey:string}>('/workspace/notifications').pipe(takeUntilDestroyed(this.destroy)).subscribe({next:r=>{
   this.notices=r.items;this.updatedAt=r.generatedAt;const key='mtrm-notifications-v1:'+this.portal+':'+r.scopeKey;
   if(key!==this.scopeKey){this.scopeKey=key;try{const value=JSON.parse(localStorage.getItem(key)||'{}');this.read=value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{this.read={};}}
   this.noticeBusy=false;
  },error:()=>{this.noticeBusy=false;this.noticeError='Updates could not be refreshed. Please retry.';}});
 }
 isUnread(item:Notice){return this.read[item.id]!==item.version;}
 get unread(){return this.notices.filter(x=>this.isUnread(x)).length;}
 private persist(){try{localStorage.setItem(this.scopeKey,JSON.stringify(Object.fromEntries(Object.entries(this.read).slice(-200))));}catch{this.storageUnavailable=true;}}
 markAll(){for(const item of this.notices)this.read[item.id]=item.version;this.persist();}
 openNotice(item:Notice,event:Event){this.read[item.id]=item.version;this.persist();this.go(item.url,event);}
}

