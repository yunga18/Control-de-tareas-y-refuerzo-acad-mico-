import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const h={};vm.createContext(h);vm.runInContext(fs.readFileSync(new URL('../juegos/jerarquia/data.js',import.meta.url),'utf8'),h);
const expected=[20,16,8,15,14,14,12,9,9,7,28,15];
const traces=vm.runInContext('EXPRESSIONS.map(operationTrace)',h);assert.equal(traces.length,expected.length);
for(const [i,steps]of traces.entries()){assert.equal(steps.at(-1).result,expected[i]);for(const s of steps){assert(Number.isInteger(s.result)&&s.result>=0);assert.notEqual(s.op==='÷'?s.b:1,0);}}
assert.equal(vm.runInContext("nextOperation([24,'÷',6,'×',2])",h),1);
assert.equal(vm.runInContext("nextOperation([18,'−',5,'+',2])",h),1);
const pairGroups=vm.runInContext('MATCH_ROUNDS.map(ids=>ids.map(i=>operationTrace(EXPRESSIONS[i]).at(-1).result))',h);pairGroups.forEach(g=>assert.equal(new Set(g).size,4));
assert.equal(vm.runInContext('HIERARCHY_IDS.length',h),26);
assert.deepEqual(Array.from(vm.runInContext('DETECTIVES.map(d=>operationTrace(d.tokens).at(-1).result)',h)),[20,8,17,12]);
const l={};vm.createContext(l);vm.runInContext(fs.readFileSync(new URL('../juegos/oraciones/data.js',import.meta.url),'utf8'),l);
assert.equal(vm.runInContext('LANGUAGE_IDS.length',l),20);
const sentences=vm.runInContext('SENTENCES',l);assert.equal(sentences.length,12);for(const s of sentences){assert(s.s&&s.v&&s.c);assert.equal(new Set([s.s,s.v,s.c]).size,3);}
assert.equal(sentences[0].s,'La niña');assert.equal(sentences[0].v,'lee');assert.equal(sentences[0].c,'un cuento');assert.equal(sentences[7].c,'en el sofá');
console.log('PASS: 12 expresiones, prioridad compartida e izquierda a derecha; parejas sin ambigüedad; 26 retos de jerarquía y 20 retos de oraciones.');
