'use strict';
const SENTENCES=[
{s:'La niña',v:'lee',c:'un cuento',question:'¿Qué lee la niña?'},
{s:'Mi hermano',v:'prepara',c:'la merienda',question:'¿Qué prepara mi hermano?'},
{s:'Los pájaros',v:'construyen',c:'un nido',question:'¿Qué construyen los pájaros?'},
{s:'El jardinero',v:'riega',c:'las flores',question:'¿Qué riega el jardinero?'},
{s:'Las estudiantes',v:'escriben',c:'una carta',question:'¿Qué escriben las estudiantes?'},
{s:'La profesora',v:'explica',c:'la lección',question:'¿Qué explica la profesora?'},
{s:'Nosotros',v:'visitamos',c:'el museo',question:'¿Qué visitamos nosotros?'},
{s:'El gato',v:'duerme',c:'en el sofá',question:'¿Dónde duerme el gato?'},
{s:'Mis amigas',v:'juegan',c:'en el parque',question:'¿Dónde juegan mis amigas?'},
{s:'Tu primo',v:'dibuja',c:'un paisaje',question:'¿Qué dibuja tu primo?'},
{s:'La abuela',v:'compra',c:'frutas frescas',question:'¿Qué compra la abuela?'},
{s:'Los niños',v:'cuidan',c:'el jardín',question:'¿Qué cuidan los niños?'}];
const PARTS=[{id:'s',name:'Sujeto',hint:'De quién se dice algo. En estos ejemplos, es quien realiza la acción.',question:'¿De quién hablamos?',css:'subject'},{id:'v',name:'Verbo',hint:'La palabra que expresa la acción en estos ejemplos y concuerda con el sujeto.',question:'¿Qué hace o hacen?',css:'verb'},{id:'c',name:'Complemento',hint:'Añade información al verbo: qué, dónde u otros detalles.',question:'¿Qué información completa la acción?',css:'complement'}];
const COMPLETE_SENTENCES=[{sentence:0,missing:'v'},{sentence:2,missing:'s'},{sentence:7,missing:'c'},{sentence:4,missing:'v'},{sentence:11,missing:'s'},{sentence:8,missing:'c'}];
const LANGUAGE_MODES=[{id:'identifica',name:'Detectives de oraciones',icon:'⌕',desc:'Encuentra el sujeto, el verbo y el complemento en una oración.',count:6},{id:'completar',name:'La pieza que falta',icon:'□',desc:'Completa una oración con la parte indicada.',count:6},{id:'unir',name:'Une las partes',icon:'⇄',desc:'Conecta cada fragmento con su función.',count:4},{id:'ordenar',name:'Construye una oración',icon:'▤',desc:'Coloca las piezas en el orden sujeto, verbo y complemento.',count:4}];
const LANGUAGE_IDS=LANGUAGE_MODES.flatMap(m=>Array.from({length:m.count},(_,i)=>m.id+'-'+i));
