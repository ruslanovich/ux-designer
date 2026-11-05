const assert=require('node:assert/strict');const {create}=require('./model.js');
const m=create();const before=m.all().length;assert.throws(()=>m.add(' '));
const x=m.add('A new book','Reader');assert.equal(m.all().length,before+1);assert.equal(m.find('new book')[0].id,x.id);
m.status(x.id,'reading');assert.equal(m.find('new book')[0].status,'reading');
m.archive(x.id);assert.equal(m.find('new book').length,0);assert.equal(m.find('new book',true).length,1);
m.archive(x.id,false);assert.equal(m.find('new book').length,1);
const copy=m.all();copy[0].title='Mutation';assert.notEqual(m.all()[0].title,'Mutation');
console.log('Reading model: add, validation, search, status, archive, restore, and copy isolation pass. Browser behavior is not covered.');
