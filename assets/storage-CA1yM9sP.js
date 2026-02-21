const t=(t,r)=>{try{const e=localStorage.getItem(t);return e?JSON.parse(e):r}catch(e){return r}},r=(t,r)=>{try{localStorage.setItem(t,JSON.stringify(r))}catch(e){}};export{t as l,r as s};
