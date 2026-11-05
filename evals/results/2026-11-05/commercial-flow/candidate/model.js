(function(root){
 const seed=[
  {id:101,customer:'Acme East',title:'Inspection of loading-bay access controller and related intermittent sensor fault',status:'new',assignee:'',due:'Today',history:['Request received']},
  {id:102,customer:'North Pier',title:'Air handling unit service',status:'waiting',assignee:'Lee',due:'Tomorrow',history:['Created','Waiting for access']},
  {id:103,customer:'Acme East',title:'Replace entrance lighting',status:'scheduled',assignee:'Sam',due:'Friday',history:['Created','Assigned to Sam']},
  {id:104,customer:'West Studio',title:'Temperature sensor',status:'draft',assignee:'',due:'Unscheduled',history:['Draft saved']}
 ];
 function create(input=seed){let records=input.map(x=>({...x,history:[...x.history]}));let views=[];
 const canEdit=role=>['dispatcher','admin'].includes(role);const copy=r=>({...r,history:[...r.history]});
 return {
  list(query='',status='all'){return records.filter(r=>(status==='all'||r.status===status)&&(r.customer+' '+r.title+' '+r.id).toLowerCase().includes(query.toLowerCase())).map(copy)},
  detail(id){const r=records.find(x=>x.id===id);return r?copy(r):null},
  assign(ids,name,role){if(!canEdit(role))throw new Error('Your role cannot assign work.');if(!name.trim())throw new Error('Choose a technician.');return ids.map(id=>{const r=records.find(x=>x.id===id);if(!r)return{id,ok:false,error:'Work order not found'};if(r.status==='draft')return{id,ok:false,error:'Complete the draft before assignment'};r.assignee=name;r.status='scheduled';r.history.push('Assigned to '+name);return{id,ok:true}})},
  saveView(name,query,status){if(!name.trim())throw new Error('Name this view.');const v={name:name.trim(),query,status};views=views.filter(x=>x.name!==v.name);views.push(v);return {...v}},
  views(){return views.map(v=>({...v}))},
  exportCSV(role){if(role!=='admin')throw new Error('Only admins can export.');const cell=x=>'"'+String(x).replaceAll('"','""')+'"';return [['id','customer','title','status','assignee'],...records.map(r=>[r.id,r.customer,r.title,r.status,r.assignee])].map(row=>row.map(cell).join(',')).join('\n')}
 } }
 const api={seed,create};if(typeof module==='object')module.exports=api;else root.ServiceModel=api;
})(typeof window==='object'?window:globalThis);
