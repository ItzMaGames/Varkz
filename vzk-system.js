const VZK_SYSTEM = {

// 💾 salvar arquivo
save(name, code){
localStorage.setItem("vzk_" + name, code);
},

// 📂 carregar arquivo
load(name){
return localStorage.getItem("vzk_" + name);
},

// 📋 listar arquivos
list(){
let files = [];

for(let i=0;i<localStorage.length;i++){
let k = localStorage.key(i);

if(k.startsWith("vzk_")){
files.push(k.replace("vzk_",""));
}
}

return files;
},

// 🗑 deletar arquivo
delete(name){
localStorage.removeItem("vzk_" + name);
}

};

// 📤 EXPORTAR .VZK (SEM .TXT)

async function exportVZK(code, filename="main.vzk"){

if(!filename.endsWith(".vzk")){
filename += ".vzk";
}

// API moderna (PC)
if(window.showSaveFilePicker){

try{

const handle = await showSaveFilePicker({
suggestedName: filename,
types:[{
description:"VARKZ File",
accept:{"application/octet-stream":[".vzk"]}
}]
});

const writable = await handle.createWritable();
await writable.write(code);
await writable.close();

return;

}catch(e){
console.log("fallback export usado");
}

}

// fallback universal (celular + PC)
const blob = new Blob([code], {type:"application/octet-stream"});
const a = document.createElement("a");

a.href = URL.createObjectURL(blob);
a.download = filename;
a.style.display = "none";

document.body.appendChild(a);
a.click();
document.body.removeChild(a);

URL.revokeObjectURL(a.href);
}

// 📥 IMPORTAR .VZK

function importVZK(callback){

const input = document.createElement("input");
input.type = "file";
input.accept = ".vzk";

input.onchange = e => {
const file = e.target.files[0];
const reader = new FileReader();

reader.onload = ev => {
callback(ev.target.result);
};

reader.readAsText(file);
};

input.click();
}