'use strict';
const EXPRESSIONS=[
[8,'+',3,'×',4],[20,'−',12,'÷',3],[24,'÷',6,'×',2],[18,'−',5,'+',2],
[6,'×',3,'−',8,'÷',2],[36,'÷',6,'+',4,'×',2],[30,'−',4,'×',5,'+',2],[48,'÷',4,'÷',3,'+',5],
[7,'+',24,'÷',6,'−',2],[9,'×',2,'÷',3,'+',1],[40,'−',18,'÷',3,'×',2],[5,'+',6,'×',2,'−',4,'÷',2]];
function nextOperation(tokens){for(let i=1;i<tokens.length;i+=2)if(tokens[i]==='×'||tokens[i]==='÷')return i;return tokens.length>1?1:-1;}
function applyOperation(a,op,b){if(op==='+')return a+b;if(op==='−')return a-b;if(op==='×')return a*b;if(op==='÷'&&b!==0)return a/b;throw Error('Operación no válida');}
function operationTrace(expression){const steps=[];let t=[...expression];while(t.length>1){const i=nextOperation(t),result=applyOperation(t[i-1],t[i],t[i+1]);const after=[...t.slice(0,i-1),result,...t.slice(i+2)];steps.push({before:[...t],index:i,a:t[i-1],op:t[i],b:t[i+1],result,after});t=after;}return steps;}
const MATCH_ROUNDS=[[0,1,2,3],[4,6,7,9],[0,4,8,10],[1,2,9,11]];
const DETECTIVES=[
{tokens:EXPRESSIONS[0],lines:['8 + 3 = 11','11 × 4 = 44'],bad:0,why:'Primero va 3 × 4, porque la multiplicación tiene prioridad sobre la suma.'},
{tokens:EXPRESSIONS[2],lines:['6 × 2 = 12','24 ÷ 12 = 2'],bad:0,why:'División y multiplicación tienen la misma prioridad: empieza por 24 ÷ 6, que está a la izquierda.'},
{tokens:[10,'+',12,'÷',3,'×',2,'−',1],lines:['12 ÷ 3 = 4','10 + 4 = 14','14 × 2 = 28','28 − 1 = 27'],bad:1,why:'El primer paso es correcto. Después aún queda 4 × 2: resuelve esa multiplicación antes de sumar 10.'},
{tokens:EXPRESSIONS[6],lines:['4 × 5 = 20','30 − 20 = 10','10 + 2 = 13'],bad:2,why:'El orden es correcto, pero la última cuenta falla: 10 + 2 = 12. También hay que revisar los cálculos.'}];
const HIERARCHY_MODES=[{id:'ruta',name:'Ruta de operaciones',icon:'↗',desc:'Toca la operación que sigue y transforma la expresión paso a paso.',count:12},{id:'completar',name:'Completa el camino',icon:'□',desc:'Encuentra el número que falta en cada paso.',count:6},{id:'unir',name:'Une cada resultado',icon:'⇄',desc:'Conecta expresiones con su resultado, respetando el orden.',count:4},{id:'detective',name:'Detective de errores',icon:'⌕',desc:'Encuentra el primer paso equivocado y descubre cómo corregirlo.',count:4}];
const HIERARCHY_IDS=HIERARCHY_MODES.flatMap(m=>Array.from({length:m.count},(_,i)=>m.id+'-'+i));
