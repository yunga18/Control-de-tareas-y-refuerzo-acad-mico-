'use strict';
// La lista de docentes y la autorización viven en PostgreSQL, no en este archivo.
const Teacher = (() => {
  const config=window.YUNGA_AUTH_CONFIG||{};
  const ready=/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(config.supabaseUrl||'') && typeof config.publishableKey==='string' && (config.publishableKey.startsWith('sb_publishable_')||config.publishableKey.startsWith('eyJ'));
  let session=null,allowed=false,cloud=false,localState=null,revision=0,pending=null,timer=null,saving=false,conflict=false,message='',email='',sent=false,busy=false;
  const base=(config.supabaseUrl||'').replace(/\/$/,'');
  async function request(path,body,token=null) {
    const headers={apikey:config.publishableKey,'Content-Type':'application/json'};
    if(token)headers.Authorization='Bearer '+token;
    let res;
    try {res=await fetch(base+path,{method:'POST',headers,body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(15000)});} catch {throw Error('No se pudo conectar. Comprueba tu conexión y vuelve a intentar.');}
    const data=await res.json().catch(()=>null);
    if(!res.ok){const error=Error(res.status===401?'La sesión venció. Vuelve a entrar.':res.status===429?'Espera un minuto antes de solicitar otro código.':'No se pudo completar la operación. Revisa el código o la configuración del acceso.');error.status=res.status;error.code=data?.code;throw error;}
    return data;
  }
  async function token(){
    if(!session)throw Error('Inicia sesión como docente.');
    if(Date.now()/1000>session.expires_at-60){
      const next=await request('/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token});
      session={...next,expires_at:Date.now()/1000+next.expires_in};
    }
    return session.access_token;
  }
  async function rpc(name,body={}){return request('/rest/v1/rpc/'+name,body,await token());}
  function stamp(){
    const el=document.querySelector('#access-label');
    if(el)el.textContent=cloud?(allowed?'Docente · '+(pending||saving?'Sin guardar aún':message&&message!=='Todos los cambios se guardaron en la nube.'?'Revisar guardado':'Guardado en nube'):'Docente · sesión bloqueada'):'Estudiante · práctica local';
  }
  function panel(){
    return title('Acceso docente','Yunga School · clases, planificación y evaluación.')+`<div class="card auth-card"><span class="auth-mark" aria-hidden="true">YS</span><h2>Tu espacio para enseñar</h2><p>Entra con un código enviado a tu correo. Solo las cuentas autorizadas por la administración pueden abrir el espacio docente.</p>${cloud&&!allowed?'<div class="notice">La sesión se bloqueó. Exporta una copia antes de salir si hay cambios pendientes.</div><div class="actions">'+button('Exportar copia','export')+button('Cerrar sesión','auth-logout','','secondary')+'</div>':!ready?'<div class="notice"><strong>Activación pendiente.</strong> El acceso docente está cerrado hasta conectar el servicio de autenticación. Los estudiantes pueden seguir usando explicaciones, juegos y diagnósticos.</div>':`<form id="teacher-login-form"><div class="field"><label for="teacher-email">Correo del docente</label><input type="email" id="teacher-email" autocomplete="email" required maxlength="254" value="${E(email)}" ${sent?'readonly':''}></div>${sent?'<div class="field"><label for="teacher-code">Código recibido por correo</label><input id="teacher-code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" minlength="6" maxlength="10" required placeholder="Escribe el código"></div><p class="muted">Revisa también la carpeta de spam. El código es temporal y no se comparte con estudiantes.</p>':''}<button type="submit" class="btn" ${busy?'disabled':''}>${busy?'Comprobando…':sent?'Entrar como docente':'Enviar código'}</button>${sent?button('Usar otro correo','auth-reset','','secondary'):''}</form>`}${message?`<p class="auth-message" role="alert">${E(message)}</p>`:''}<p class="muted"><small>El contenido educativo es público. Los registros del espacio docente se almacenan aparte, con permisos comprobados por el servidor.</small></p><a href="#inicio">Volver a mi ruta →</a></div>`;
  }
  function toolbar(){return `<div class="notice teacher-session"><div><strong>Sesión docente</strong><br>${E(session?.user?.email||'')} · Espacio compartido de profesores<br><small>${E(message||'Los cambios se guardan en la nube. La práctica de otros dispositivos no se recibe automáticamente.')}</small></div><div class="actions">${button('Reintentar guardado','auth-retry','','secondary small')}${button('Cerrar sesión','auth-logout','','secondary small')}</div></div>`;}
  async function login(form){
    if(!ready||busy||cloud)return;
    if(!form.reportValidity())return;
    busy=true;message='';
    const entered=document.querySelector('#teacher-email').value.trim().toLowerCase();
    const code=document.querySelector('#teacher-code')?.value.trim();email=entered;
    render();
    try{
      if(!sent){
        // No se crean cuentas desde la web pública. Se crean en el panel de administración.
        await request('/auth/v1/otp',{email,create_user:false});
        sent=true;message='Si tu cuenta está habilitada, recibirás un código. Solo los docentes autorizados pueden entrar.';
      }else{
        const verified=await request('/auth/v1/verify',{email,token:code,type:'email'});
        session={...verified,expires_at:Date.now()/1000+verified.expires_in};
        if(await rpc('yunga_is_teacher')!==true)throw Error('Este correo no tiene permiso docente.');
        const data=await rpc('yunga_load_workspace');
        if(!data||typeof data.revision!=='number')throw Error('Falta configurar el espacio docente.');
        const loaded=data.payload===null?freshState():sanitize(data.payload);
        localState=state;state=loaded;revision=data.revision;pending=null;conflict=false;cloud=true;allowed=true;sent=false;message='';lessonTab='aprender';game=null;
        closeModal();location.hash='docente';
      }
    }catch(error){session=null;allowed=false;message=error.message;}
    finally{busy=false;render();stamp();}
  }
  function schedule(snapshot){pending=snapshot;message='Cambios pendientes de guardar.';clearTimeout(timer);timer=setTimeout(flush,600);stamp();}
  async function flush(){
    clearTimeout(timer);
    if(saving||!pending||!allowed||conflict)return !pending;
    saving=true;stamp();
    try{
      while(pending){
        const snapshot=pending;
        const next=await rpc('yunga_save_workspace',{p_payload:JSON.parse(snapshot),p_revision:revision});
        if(typeof next!=='number')throw Error('No se confirmó el guardado.');
        revision=next;if(pending===snapshot)pending=null;
      }
      message='Todos los cambios se guardaron en la nube.';
    }catch(error){
      conflict=error.code==='40001';
      message=conflict?'Otro profesor actualizó el espacio. Exporta tu copia y vuelve a entrar antes de combinar los cambios. No se sobrescribió su trabajo.':error.message+' Tus cambios siguen en esta pestaña: exporta una copia antes de cerrarla.';
      if(error.status===401||error.status===403){allowed=false;closeModal();}
      toast(message);
    }finally{saving=false;stamp();if(location.hash==='#docente')render();}
    return !pending;
  }
  async function logout(discard=false){
    if(saving){toast('Espera a que termine el guardado.');return;}
    if(!discard&&pending&&!(await flush())){
      openModal(`<h2>Hay cambios sin guardar</h2><p>${E(message)}</p><div class="actions">${button('Exportar copia','export')}${button('Seguir trabajando','close-modal','','secondary')}${button('Salir sin guardar','auth-discard','','danger')}</div>`);return;
    }
    const old=session;
    allowed=false;cloud=false;session=null;pending=null;clearTimeout(timer);message='';sent=false;conflict=false;
    if(localState)state=localState;localState=null;game=null;lessonTab='aprender';closeModal();location.hash='inicio';render();stamp();
    if(old)request('/auth/v1/logout',{},old.access_token).catch(()=>{});
  }
  function requireTeacher(){if(allowed&&cloud&&!conflict)return true;location.hash='docente';render();toast(conflict?'Exporta tu copia y vuelve a entrar para resolver el cambio de otro profesor.':'Entra con una cuenta docente autorizada.');return false;}
  document.addEventListener('submit',event=>{if(event.target.id==='teacher-login-form'){event.preventDefault();login(event.target);}});
  document.addEventListener('click',event=>{const a=event.target.closest('[data-action]')?.dataset.action;if(a==='auth-reset'){if(busy)return;sent=false;message='';render();}if(a==='auth-logout')logout();if(a==='auth-discard')logout(true);if(a==='auth-retry')flush();});
  window.addEventListener('beforeunload',event=>{if(cloud&&(pending||saving)){event.preventDefault();event.returnValue='';}});
  window.addEventListener('online',()=>{if(!conflict)flush();});
  return {ready,panel,toolbar,stamp,requireTeacher,schedule,isAllowed:()=>allowed&&cloud,isCloud:()=>cloud};
})();
