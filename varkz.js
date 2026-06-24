const VARKZ = {

vars: {},
commands: {},

/* =========================
   REGISTRAR COMANDOS
========================= */
register(name, fn){
this.commands[name] = fn;
},


/* =========================
   EXECUTOR DE UMA LINHA
========================= */
runLine(line, ctx){

let cmd = line.split(" ")[0];
let args = line.substring(cmd.length).trim();

if(this.commands[cmd]){
this.commands[cmd](args, ctx);
}

},


/* =========================
   ENGINE PRINCIPAL
========================= */
run(code){

this.vars = {};

let output = [];
let lines = code.split("\n");

let ctx = {
vars: this.vars,
output,
lines,
index: 0
};

for(ctx.index = 0; ctx.index < lines.length; ctx.index++){

let line = lines[ctx.index].trim();

if(line === "") continue;

this.runLine(line, ctx);

}

return output.join("\n");
}

};


/* =====================================================
   🔥 COMANDOS PADRÃO DA VARKZ
===================================================== */


/* =========================
   VAR
========================= */
VARKZ.register("var", (args, ctx) => {

let [name, value] = args.split("=");

ctx.vars[name?.trim()] = value?.trim() || "";

});


/* =========================
   SET
========================= */
VARKZ.register("set", (args, ctx) => {

let [name, value] = args.split("=");

ctx.vars[name?.trim()] = value?.trim() || "";

});


/* =========================
   SHOW (FIX VAR + $var$)
========================= */
VARKZ.register("show", (args, ctx) => {

let text = args.replaceAll('"','').trim();

// variável direta
if(ctx.vars[text] !== undefined){
text = ctx.vars[text];
}

// variável inline
for(const name in ctx.vars){
text = text.replaceAll(
"$"+name+"$",
ctx.vars[name]
);
}

ctx.output.push(String(text));

});


/* =========================
   INPUT
========================= */
VARKZ.register("input", (args, ctx) => {

ctx.vars[args.trim()] = prompt(args) || "";

});


/* =========================
   CLEAR
========================= */
VARKZ.register("clear", (args, ctx) => {

ctx.output.length = 0;

});


/* =========================
   RESET
========================= */
VARKZ.register("reset", (args, ctx) => {

ctx.vars = {};

});


/* =========================
   CHECK
========================= */
VARKZ.register("check", (args, ctx) => {

ctx.output.push(
ctx.vars[args] !== undefined ? "true" : "false"
);

});


/* =========================
   TYPE
========================= */
VARKZ.register("type", (args, ctx) => {

ctx.output.push(typeof ctx.vars[args]);

});


/* =========================
   LOG
========================= */
VARKZ.register("log", (args, ctx) => {

console.log(args);

});


/* =========================
   SWAP
========================= */
VARKZ.register("swap", (args, ctx) => {

let [a,b] = args.split(" ");

let temp = ctx.vars[a];
ctx.vars[a] = ctx.vars[b];
ctx.vars[b] = temp;

});


/* =========================
   TIME
========================= */
VARKZ.register("time(day)", (args, ctx) => {

ctx.output.push(new Date().toLocaleDateString());

});

VARKZ.register("time(hour)", (args, ctx) => {

ctx.output.push(new Date().toLocaleTimeString());

});


/* =========================
   KILL
========================= */
VARKZ.register("kill", (args, ctx) => {

ctx.output.push("Program terminated.");
throw "KILL";

});


/* =========================
   REPEAT
========================= */
VARKZ.register("repeat", (args, ctx) => {

let times = parseInt(args);

let block = [];

let i = ctx.index + 1;

while(i < ctx.lines.length && ctx.lines[i].trim() !== "end"){
block.push(ctx.lines[i]);
i++;
}

for(let r = 0; r < times; r++){
block.forEach(l => VARKZ.runLine(l, ctx));
}

ctx.index = i;

});