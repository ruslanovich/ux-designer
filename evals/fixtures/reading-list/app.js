let saved;try{saved=JSON.parse(localStorage.getItem('reading-list')||'null')}catch{}
const model=ReadingModel.create(saved||ReadingModel.seed);let archived=false;
const $=id=>document.getElementById(id);
function persist(){localStorage.setItem('reading-list',JSON.stringify(model.all()));}
function render(){
 $('cards').replaceChildren();$('heading').textContent=archived?'Archived items':'Items';
 const rows=model.find($('search').value,archived);$('count').textContent=rows.length+' items';
 for(const r of rows){const card=document.createElement('article');card.className='card';
 const h=document.createElement('h2');h.textContent=r.title;const p=document.createElement('p');p.textContent=r.author;
 const status=document.createElement('select');status.setAttribute('aria-label','Reading status for '+r.title);
 for(const value of ['queued','reading','finished']){const option=new Option(value,value);option.selected=value===r.status;status.add(option)}
 status.onchange=()=>{model.status(r.id,status.value);persist()};
 const archive=document.createElement('button');archive.textContent=archived?'Restore':'Archive';archive.onclick=()=>{model.archive(r.id,!archived);persist();render()};
 card.append(h,p,status,archive);$('cards').append(card)}
}
$('active').onclick=()=>{archived=false;render()};$('archive').onclick=()=>{archived=true;render()};$('search').oninput=render;
$('add').onsubmit=e=>{e.preventDefault();try{model.add($('title').value,$('author').value);persist();$('title').value='';$('author').value='';$('notice').textContent='';render()}catch(error){$('notice').textContent=error.message}};render();
