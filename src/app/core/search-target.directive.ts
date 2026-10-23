import { OnInit, DestroyRef, Directive, ElementRef, HostBinding, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Directive({selector:'[searchTarget]',standalone:true})
export class SearchTargetDirective implements OnInit {
 @Input() searchTarget='';@HostBinding('attr.id') get id(){return this.searchTarget;}
 @HostBinding('class.search-target-selected') selected=false;
 private route=inject(ActivatedRoute);private element=inject(ElementRef<HTMLElement>);private destroy=inject(DestroyRef);
 private alive=true;
 constructor(){this.destroy.onDestroy(()=>this.alive=false);}
 ngOnInit(){this.route.fragment.pipe(takeUntilDestroyed(this.destroy)).subscribe(fragment=>{this.selected=fragment===this.searchTarget;if(this.selected){queueMicrotask(()=>{if(this.alive){this.element.nativeElement.scrollIntoView({block:'center'});this.element.nativeElement.setAttribute('tabindex','-1');this.element.nativeElement.focus({preventScroll:true});}});}});}
}
