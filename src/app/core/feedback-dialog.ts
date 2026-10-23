import Swal from 'sweetalert2';
import { escapeHtml } from './editor-panel';

type Icon = 'play' | 'check' | 'alert' | 'lock' | 'file';
const paths:Record<Icon,string> = {
 play:'<path d="m9 5 11 7-11 7z"/>',
 check:'<path d="m5 12 4 4L19 6"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>',
 alert:'<path d="m12 3 10 18H2zM12 9v5M12 17h.01"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
 file:'<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h4"/>'
};
function heading(title:string,eyebrow:string,icon:Icon) {
 return `<span class="dialog-heading"><span class="dialog-emblem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[icon]}</svg></span><span><span class="dialog-eyebrow">${escapeHtml(eyebrow)}</span><span class="dialog-title">${escapeHtml(title)}</span></span></span>`;
}
export async function feedbackDialog(options:{title:string;message:string;tone?:'error'|'success';icon?:Icon;eyebrow?:string}) {
 await Swal.fire({
  title:heading(options.title,options.eyebrow??'WAMAN · Workspace',options.icon??(options.tone==='success'?'check':'alert')),
  html:`<p class="dialog-description">${escapeHtml(options.message)}</p>`,
  customClass:{popup:'waman-dialog waman-feedback waman-feedback-'+(options.tone??'error'),actions:'dialog-actions'},
  showCloseButton:true,closeButtonAriaLabel:'Close notification',confirmButtonText:'Got it'
 });
}
export async function confirmAction(options:{title:string;eyebrow:string;icon:Icon;description:string;details:{title:string;description:string}[];note?:string;confirmText:string;action:()=>Promise<unknown>}):Promise<boolean> {
 const result=await Swal.fire({
  title:heading(options.title,options.eyebrow,options.icon),
  html:`<p class="dialog-description">${escapeHtml(options.description)}</p><div class="dialog-impact"><h3>Before you continue</h3>${options.details.map(x=>`<div class="dialog-impact-row"><span class="impact-dot" aria-hidden="true"></span><div><strong>${escapeHtml(x.title)}</strong><p>${escapeHtml(x.description)}</p></div></div>`).join('')}</div>${options.note?`<p class="dialog-notice">${escapeHtml(options.note)}</p>`:''}`,
  customClass:{popup:'waman-dialog waman-action',actions:'dialog-actions'},
  showCloseButton:true,closeButtonAriaLabel:'Close confirmation',showCancelButton:true,cancelButtonText:'Cancel',confirmButtonText:options.confirmText,
  reverseButtons:true,focusCancel:true,showLoaderOnConfirm:true,
  allowOutsideClick:()=>!Swal.isLoading(),allowEscapeKey:()=>!Swal.isLoading(),
  preConfirm:async()=>{const close=Swal.getCloseButton();if(close)close.disabled=true;try{await options.action();return true;}catch(error:any){Swal.showValidationMessage(escapeHtml(error?.error?.message||'Unable to update the session. Please try again.'));return false;}finally{if(close)close.disabled=false;}}
 });
 return result.isConfirmed;
}
