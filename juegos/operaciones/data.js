'use strict';
const OPERATIONS={sum:{name:'Sumar',symbol:'+',color:'blue',rule:'Para sumar, primero usamos partes del mismo tamaño.'},sub:{name:'Restar',symbol:'−',color:'rose',rule:'Para restar, primero usamos partes del mismo tamaño.'},mul:{name:'Multiplicar',symbol:'×',color:'blue',rule:'Multiplicamos numerador por numerador y denominador por denominador.'},div:{name:'Dividir',symbol:'÷',color:'rose',rule:'Dividimos multiplicando por la fracción inversa de la segunda.'}};
const MISSION_DATA={sum:[[1,4,2,4],[1,3,1,6],[2,5,1,2],[3,4,2,3]],sub:[[3,4,1,4],[5,6,1,3],[7,8,1,4],[5,4,1,2]],mul:[[1,2,1,3],[2,3,3,4],[3,5,2,3],[5,4,2,3]],div:[[1,2,1,4],[2,3,1,3],[3,4,1,2],[4,5,2,3]]};
const MISSIONS=Object.entries(MISSION_DATA).flatMap(([op,list])=>list.map(([a,b,c,d],i)=>({id:op+'-'+i,op,a,b,c,d,index:i})));
function gcd(a,b){return b?gcd(b,a%b):Math.abs(a);}
function lcm(a,b){return a*b/gcd(a,b);}
function calculate(m){let D,A,B,N;if(m.op==='sum'||m.op==='sub'){D=lcm(m.b,m.d);A=m.a*D/m.b;B=m.c*D/m.d;N=m.op==='sum'?A+B:A-B;}else{A=m.a*(m.op==='mul'?m.c:m.d);B=m.b*(m.op==='mul'?m.d:m.c);N=A;D=B;}const g=gcd(N,D);return{D,A,B,N,g,n:N/g,d:D/g};}
