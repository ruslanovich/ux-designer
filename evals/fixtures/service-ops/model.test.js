const assert=require('node:assert/strict');const {create}=require('./model.js');const m=create();
assert.equal(m.list('Acme').length,2);assert.equal(m.list('','waiting')[0].id,102);assert.equal(m.list('','draft')[0].id,104);
assert.throws(()=>m.assign([101],'Lee','technician'));assert.equal(m.detail(101).assignee,'');
const r=m.assign([101,104,999],'Lee','dispatcher');assert.deepEqual(r.map(x=>x.ok),[true,false,false]);assert.equal(m.detail(101).status,'scheduled');assert.equal(m.detail(104).status,'draft');assert.equal(m.detail(101).history.at(-1),'Assigned to Lee');
m.saveView('Waiting','North','waiting');assert.deepEqual(m.views(),[{name:'Waiting',query:'North',status:'waiting'}]);assert.throws(()=>m.exportCSV('dispatcher'));assert.match(m.exportCSV('admin'),/"101","Acme East"/);
console.log('Service model: filtering, drafts, role restrictions, partial assignment, history, saved views, and export pass. Browser behavior is not covered.');
