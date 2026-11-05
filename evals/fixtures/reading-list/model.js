(function (root) {
  const seed = [
    {id:1,title:'Designing Data-Intensive Applications',author:'Martin Kleppmann',status:'reading',archived:false},
    {id:2,title:'Information Architecture: For the Web and Beyond',author:'Louis Rosenfeld, Peter Morville, Jorge Arango',status:'queued',archived:false},
    {id:3,title:'The Design of Everyday Things',author:'Don Norman',status:'finished',archived:false},
    {id:4,title:'A very long article about keeping operational context while switching between many related tasks',author:'Example author',status:'queued',archived:false},
    {id:5,title:'Last year’s reading notes',author:'Personal notes',status:'finished',archived:true}
  ];
  function create(initial=seed) {
    let rows=initial.map(x=>({...x}));
    return {
      all:()=>rows.map(x=>({...x})),
      find:(query='',archived=false)=>rows.filter(x=>x.archived===archived && (x.title+' '+x.author).toLowerCase().includes(query.toLowerCase())).map(x=>({...x})),
      add(title,author='') { if(!title.trim()) throw new Error('Enter a title.'); const r={id:Math.max(0,...rows.map(x=>x.id))+1,title:title.trim(),author:author.trim(),status:'queued',archived:false}; rows.push(r); return {...r}; },
      status(id,value) { if(!['queued','reading','finished'].includes(value)) throw new Error('Invalid status'); const r=rows.find(x=>x.id===id); if(!r)throw new Error('Missing item');r.status=value; },
      archive(id,value=true) {const r=rows.find(x=>x.id===id);if(!r)throw new Error('Missing item');r.archived=value;}
    };
  }
  const api={create,seed};if(typeof module==='object')module.exports=api;else root.ReadingModel=api;
})(typeof window==='object'?window:globalThis);
