import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const sandbox={};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(new URL('../juegos/operaciones/data.js',import.meta.url),'utf8'),sandbox);
const expected=['3/4','1/2','9/10','17/12','1/2','1/2','5/8','3/4','1/6','1/2','2/5','5/6','2/1','2/1','3/2','6/5'];
const results=vm.runInContext('MISSIONS.map(m=>({mission:m,result:calculate(m)}))',sandbox);
assert.equal(results.length,16);
for(const [i,{mission,result}]of results.entries()){
 assert.equal(result.n+'/'+result.d,expected[i],mission.id);
 assert(result.d>0&&Number.isInteger(result.d));
 assert(result.N>=0&&Number.isInteger(result.N));
 assert(result.D>0&&result.D<=36&&Number.isInteger(result.D));
}
assert.equal(vm.runInContext('lcm(4,6)',sandbox),12);
assert.equal(vm.runInContext('gcd(54,24)',sandbox),6);
console.log('16 fracciones verificadas: suma, resta, multiplicación y división.');
