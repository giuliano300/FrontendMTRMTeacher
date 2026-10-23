type DialogIcon = 'teacher' | 'course' | 'venue' | 'organisation' | 'archive' | 'person';
type Field = {
  name: string; label: string; value?: unknown; type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'password' | 'date' | 'datetime-local' | 'file';
  accept?: string;
  required?: boolean; full?: boolean; placeholder?: string; hint?: string; min?: number;
  options?: { value: string | number; label: string }[];
};
type Section = { title: string; fields: Field[] };

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

const paths: Record<DialogIcon, string> = {
  teacher: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4h5v11h-3M17 8h1M17 11h1"/>',
  course: '<path d="M4 3h13a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3V3Zm0 15a3 3 0 0 1 3-3h13M8 7h8M8 10h5"/>',
  venue: '<path d="M3 21h18M5 21V5l7-3 7 3v16M9 8h1M14 8h1M9 12h1M14 12h1M10 21v-5h4v5"/>',
  organisation: '<rect x="8" y="3" width="8" height="5" rx="1"/><rect x="2" y="16" width="7" height="5" rx="1"/><rect x="15" y="16" width="7" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  archive: '<rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v12h14V8M9 12h6"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>'
};

function header(title: string, eyebrow: string, icon: DialogIcon): string {
  return `<span class="dialog-heading"><span class="dialog-emblem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[icon]}</svg></span><span><span class="dialog-eyebrow">${escapeHtml(eyebrow)}</span><span class="dialog-title">${escapeHtml(title)}</span></span></span>`;
}

function fieldHtml(field: Field): string {
  const id = `dialog-${field.name}`;
  const attributes = `id="${id}" name="${field.name}" ${field.required ? 'required' : ''} ${field.hint ? `aria-describedby="${id}-hint"` : ''}`;
  let control: string;
  if (field.type === 'file') {
    control = `<input ${attributes} type="file" accept="${escapeHtml(field.accept)}">`;
  } else if (field.type === 'select') {
    control = `<select ${attributes}><option value="">Select ${escapeHtml(field.label.toLowerCase())}</option>${(field.options ?? []).map(option => `<option value="${escapeHtml(option.value)}" ${String(field.value) === String(option.value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select>`;
  } else if (field.type === 'textarea') {
    control = `<textarea ${attributes} rows="3" placeholder="${escapeHtml(field.placeholder)}">${escapeHtml(field.value)}</textarea>`;
  } else {
    control = `<input ${attributes} type="${field.type ?? 'text'}" value="${escapeHtml(field.value)}" placeholder="${escapeHtml(field.placeholder)}" ${field.min !== undefined ? `min="${field.min}" step="1"` : ''}>`;
  }
  return `<div class="dialog-field ${field.full ? 'full' : ''}"><label for="${id}">${escapeHtml(field.label)}${field.required ? '<span class="required-mark" aria-hidden="true">*</span>' : '<span class="optional-label">Optional</span>'}</label>${control}${field.hint ? `<small id="${id}-hint">${escapeHtml(field.hint)}</small>` : ''}</div>`;
}


/** A native side sheet: browser focus trapping/inert background, not a centred popup. */
export async function editPanel(options: {
  title: string; eyebrow: string; icon: DialogIcon; description: string; confirmText: string;
  sections: Section[]; save: (values: Record<string, string>, files: Record<string, File | undefined>) => Promise<unknown>;
}): Promise<boolean> {
  if (document.querySelector('.waman-editor-panel[open]')) return false;
  const fields = options.sections.flatMap(section => section.fields);
  const previousFocus = document.activeElement as HTMLElement | null;
  const panel = document.createElement('dialog');
  panel.className = 'waman-editor-panel';
  panel.setAttribute('aria-labelledby', 'editor-title');
  panel.setAttribute('aria-describedby', 'editor-description');
  panel.innerHTML = `<form class="editor-layout" novalidate>
    <header class="editor-head"><h2 id="editor-title">${header(options.title, options.eyebrow, options.icon)}</h2><button type="button" class="editor-close" aria-label="Close panel">×</button></header>
    <div class="editor-body"><p class="dialog-description" id="editor-description">${escapeHtml(options.description)}</p>
    <fieldset class="editor-fields">${options.sections.map((section,index) => `<section class="editor-section"><h3><span>${String(index+1).padStart(2,'0')}</span>${escapeHtml(section.title)}</h3><div class="dialog-grid">${section.fields.map(fieldHtml).join('')}</div></section>`).join('')}</fieldset>
    <p class="dialog-required-note"><span>*</span> Required fields</p></div>
    <footer class="editor-footer"><p class="editor-error" role="alert" tabindex="-1" hidden></p><div class="editor-discard" hidden><strong>Discard unsaved changes?</strong><span>Your changes have not been saved.</span><div><button type="button" class="editor-keep">Keep editing</button><button type="button" class="editor-discard-confirm">Discard changes</button></div></div>
    <div class="editor-footer-actions"><span class="editor-status" role="status">Changes are saved when you confirm.</span><button type="button" class="editor-cancel">Cancel</button><button type="submit" class="editor-save">${escapeHtml(options.confirmText)}</button></div></footer></form>`;
  document.body.append(panel);
  const form = panel.querySelector<HTMLFormElement>('form')!;
  const fieldset = panel.querySelector<HTMLFieldSetElement>('fieldset')!;
  const controls = Array.from(fieldset.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'));
  const initial = controls.map(control => control.value);
  const error = panel.querySelector<HTMLElement>('.editor-error')!;
  const discard = panel.querySelector<HTMLElement>('.editor-discard')!;
  const submit = panel.querySelector<HTMLButtonElement>('.editor-save')!;
  const status = panel.querySelector<HTMLElement>('.editor-status')!;
  const close = panel.querySelector<HTMLButtonElement>('.editor-close')!;
  const cancel = panel.querySelector<HTMLButtonElement>('.editor-cancel')!;
  const events = new AbortController();
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  let busy = false, done = false;
  return new Promise<boolean>(resolve => {
    const dirty = () => controls.some((control,index) => control.value !== initial[index]);
    const finish = (saved: boolean) => {
      if(done) return;
      done = true;
      events.abort();
      panel.close(); panel.remove();
      document.body.style.overflow = previousOverflow;
      if(previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
      resolve(saved);
    };
    const requestClose = () => {
      if(busy) return;
      if(!dirty()) { finish(false); return; }
      discard.hidden = false;
      panel.querySelector<HTMLButtonElement>('.editor-keep')!.focus();
    };
    close.addEventListener('click', requestClose, {signal:events.signal});
    cancel.addEventListener('click', requestClose, {signal:events.signal});
    panel.addEventListener('cancel', event => {event.preventDefault();requestClose();}, {signal:events.signal});
    panel.addEventListener('click', event => {
      const rect=panel.getBoundingClientRect();
      if(event.target===panel && (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)) requestClose();
    }, {signal:events.signal});
    panel.querySelector('.editor-keep')!.addEventListener('click', () => {discard.hidden=true;controls[0]?.focus();}, {signal:events.signal});
    panel.querySelector('.editor-discard-confirm')!.addEventListener('click', () => finish(false), {signal:events.signal});
    window.addEventListener('beforeunload', event => {if(dirty()||busy){event.preventDefault();event.returnValue='';}}, {signal:events.signal});
    form.addEventListener('input', event => {
      status.textContent=dirty()?'Unsaved changes':'Changes are saved when you confirm.';
      (event.target as HTMLElement).removeAttribute('aria-invalid');error.hidden=true;
    }, {signal:events.signal});
    form.addEventListener('change', () => {status.textContent=dirty()?'Unsaved changes':'Changes are saved when you confirm.';}, {signal:events.signal});
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if(busy) return;
      discard.hidden=true;error.hidden=true;
      const values: Record<string,string> = {};
      for(const [index,field] of fields.entries()) {
        const control=controls[index];
        control.removeAttribute('aria-invalid');
        values[field.name]=field.type==='password'?control.value:control.value.trim();
        if((field.required&&!values[field.name]) || !control.checkValidity()) {
          control.setAttribute('aria-invalid','true');
          error.textContent=`Please enter a valid ${field.label.toLowerCase()}.`;
          error.hidden=false;control.focus();return;
        }
      }
      busy=true;fieldset.disabled=true;submit.disabled=true;close.disabled=true;cancel.disabled=true;
      panel.setAttribute('aria-busy','true');submit.textContent='Saving…';status.textContent='Saving your changes…';
      const files:Record<string,File|undefined>={};
      for(const control of controls) if(control instanceof HTMLInputElement&&control.type==='file') files[control.name]=control.files?.[0];
      try {await options.save(values,files);finish(true);}
      catch(cause:any) {
        error.textContent=cause?.error?.message || cause?.message || 'Unable to save. Please review the details and try again.';
        error.hidden=false;error.focus();
      }
      finally {
        busy=false;fieldset.disabled=false;submit.disabled=false;close.disabled=false;cancel.disabled=false;
        panel.removeAttribute('aria-busy');submit.textContent=options.confirmText;status.textContent='Unsaved changes';
      }
    }, {signal:events.signal});
    panel.showModal();
    controls[0]?.focus({preventScroll:true});
  });
}
