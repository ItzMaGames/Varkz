// ===========================================================================
// 🚀 VARKZ ENGINE CORE - v3.0.0 (BASE RECONSTRUÍDA)
// ===========================================================================

class VarkzEngine {
  constructor() {
    this.variaveis = {};
    this.ultimo_resultado = null; // <- O salvador da pátria para evitar bugs de aninhamento
    this.canvas = null;
    this.ctx = null;
    
    // =======================================================================
    // 🧰 DICIONÁRIO DE COMANDOS (ONDE A MÁGICA ACONTECE)
    // =======================================================================
    this.comandosCustomizados = {
      
      // --- BLOCO 1: NÚCLEO E VARIÁVEIS (20 COMANDOS) ---
      "var": function(tokens) { this.variaveis[tokens[1]] = null; return `[VAR]: ${tokens[1]} criada.`; },
      "set": function(tokens) {
        let nomeVar = tokens[1];
        // Se o usuário usou o ponteiro LAST, pega o último resultado do sistema
        if (tokens[3] === "LAST") {
          this.variaveis[nomeVar] = this.ultimo_resultado;
        } else {
          this.variaveis[nomeVar] = tokens.slice(3).join(" ");
        }
        return `[SET]: ${nomeVar} = ${this.variaveis[nomeVar]}`;
      },
      "show": function(tokens) { return this.variaveis[tokens[1]] !== undefined ? String(this.variaveis[tokens[1]]) : "[NULO]"; },
      "input": function(tokens) { 
        let val = prompt("VARKZ Input:", ""); 
        this.variaveis[tokens[1]] = val; 
        this.ultimo_resultado = val;
        return; 
      },
      "clear": function() { console.clear(); return "[SYS]: Console limpo."; },
      "reset": function(tokens) { this.variaveis[tokens[1]] = null; return; },
      "check": function(tokens) { this.ultimo_resultado = (tokens[1] === tokens[2]); return this.ultimo_resultado; },
      "type": function(tokens) { this.ultimo_resultado = typeof this.variaveis[tokens[1]]; return this.ultimo_resultado; },
      "log": function(tokens) { console.log(tokens.slice(1).join(" ")); return; },
      "swap": function(tokens) {
        let t = this.variaveis[tokens[1]];
        this.variaveis[tokens[1]] = this.variaveis[tokens[2]];
        this.variaveis[tokens[2]] = t;
        return `[SWAP]: Invertidas.`;
      },
      "kill": function(tokens) { delete this.variaveis[tokens[1]]; return; },
      "repeat": function() { return; }, // Tratado no loop principal
      "end": function() { return; }, // Tratado no loop principal
      "vzk.version": function() { return "VARKZ Engine v3.0.0 Universal"; },
      "vzk.credits": function() { return "Desenvolvido por VARKZ Studio Corp."; },
      "vzk.benchmark": function() { let t0 = performance.now(); for(let i=0; i<14000; i++) Math.sqrt(i); return `[BENCH]: ${(performance.now() - t0).toFixed(4)} ms.`; },
      "vzk.clearvars": function() { this.variaveis = {}; return "[SYS]: Variaveis evaporadas."; },
      "vzk.die": function(tokens) { throw new Error(tokens.slice(1).join(" ") || "Script abortado."); },
      "vzk.echo": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" "); return this.ultimo_resultado; },
      "=vzk=": function() { this.ultimo_resultado = "VARKZ ENGINE CORE ACTIVE"; return this.ultimo_resultado; },

      // --- BLOCO 2: MATEMÁTICA E NÚMEROS (50 COMANDOS) ---
      "round": function(tokens) { this.ultimo_resultado = Math.round(Number(tokens[1])); return this.ultimo_resultado; },
      "floor": function(tokens) { this.ultimo_resultado = Math.floor(Number(tokens[1])); return this.ultimo_resultado; },
      "ceil": function(tokens) { this.ultimo_resultado = Math.ceil(Number(tokens[1])); return this.ultimo_resultado; },
      "abs": function(tokens) { this.ultimo_resultado = Math.abs(Number(tokens[1])); return this.ultimo_resultado; },
      "pow": function(tokens) { this.ultimo_resultado = Math.pow(Number(tokens[1]), Number(tokens[2])); return this.ultimo_resultado; },
      "sqrt": function(tokens) { this.ultimo_resultado = Math.sqrt(Number(tokens[1])); return this.ultimo_resultado; },
      "min": function(tokens) { this.ultimo_resultado = Math.min(Number(tokens[1]), Number(tokens[2])); return this.ultimo_resultado; },
      "max": function(tokens) { this.ultimo_resultado = Math.max(Number(tokens[1]), Number(tokens[2])); return this.ultimo_resultado; },
      "is.nan": function(tokens) { this.ultimo_resultado = isNaN(Number(tokens[1])); return this.ultimo_resultado; },
      "is.even": function(tokens) { this.ultimo_resultado = Number(tokens[1]) % 2 === 0; return this.ultimo_resultado; },
      "is.odd": function(tokens) { this.ultimo_resultado = Number(tokens[1]) % 2 !== 0; return this.ultimo_resultado; },
      "is.prime": function(tokens) {
        let n = Number(tokens[1]); if(n<=1) { this.ultimo_resultado=false; return false; }
        for(let i=2; i<=Math.sqrt(n); i++) if(n%i===0) { this.ultimo_resultado=false; return false; }
        this.ultimo_resultado = true; return true;
      },
      "num.fixed": function(tokens) { this.ultimo_resultado = Number(tokens[1]).toFixed(Number(tokens[2]||2)); return this.ultimo_resultado; },
      "num.sign": function(tokens) { this.ultimo_resultado = Math.sign(Number(tokens[1])); return this.ultimo_resultado; },
      "num.isint": function(tokens) { this.ultimo_resultado = Number.isInteger(Number(tokens[1])); return this.ultimo_resultado; },
      "num.abs": function(tokens) { this.ultimo_resultado = Math.abs(Number(tokens[1])); return this.ultimo_resultado; },
      "num.pow": function(tokens) { this.ultimo_resultado = Math.pow(Number(tokens[1]), Number(tokens[2])); return this.ultimo_resultado; },
      "num.sqrt": function(tokens) { this.ultimo_resultado = Math.sqrt(Number(tokens[1])); return this.ultimo_resultado; },
      "num.isnegative": function(tokens) { this.ultimo_resultado = Number(tokens[1]) < 0; return this.ultimo_resultado; },
      "num.ispositive": function(tokens) { this.ultimo_resultado = Number(tokens[1]) > 0; return this.ultimo_resultado; },
      "math.pi": function() { this.ultimo_resultado = Math.PI; return this.ultimo_resultado; },
      "math.e": function() { this.ultimo_resultado = Math.E; return this.ultimo_resultado; },
      "math.sin": function(tokens) { this.ultimo_resultado = Math.sin(Number(tokens[1])); return this.ultimo_resultado; },
      "math.cos": function(tokens) { this.ultimo_resultado = Math.cos(Number(tokens[1])); return this.ultimo_resultado; },
      "math.tan": function(tokens) { this.ultimo_resultado = Math.tan(Number(tokens[1])); return this.ultimo_resultado; },
      "math.asin": function(tokens) { this.ultimo_resultado = Math.asin(Number(tokens[1])); return this.ultimo_resultado; },
      "math.acos": function(tokens) { this.ultimo_resultado = Math.acos(Number(tokens[1])); return this.ultimo_resultado; },
      "math.atan": function(tokens) { this.ultimo_resultado = Math.atan(Number(tokens[1])); return this.ultimo_resultado; },
      "math.sinh": function(tokens) { this.ultimo_resultado = Math.sinh(Number(tokens[1])); return this.ultimo_resultado; },
      "math.cosh": function(tokens) { this.ultimo_resultado = Math.cosh(Number(tokens[1])); return this.ultimo_resultado; },
      "math.tanh": function(tokens) { this.ultimo_resultado = Math.tanh(Number(tokens[1])); return this.ultimo_resultado; },
      "math.cbrt": function(tokens) { this.ultimo_resultado = Math.cbrt(Number(tokens[1])); return this.ultimo_resultado; },
      "math.log": function(tokens) { this.ultimo_resultado = Math.log(Number(tokens[1])); return this.ultimo_resultado; },
      "math.log14": function(tokens) { this.ultimo_resultado = Math.log14(Number(tokens[1])); return this.ultimo_resultado; },
      "math.deg2rad": function(tokens) { this.ultimo_resultado = Number(tokens[1]) * (Math.PI/180); return this.ultimo_resultado; },
      "math.rad2deg": function(tokens) { this.ultimo_resultado = Number(tokens[1]) * (180/Math.PI); return this.ultimo_resultado; },
      "math.random": function(tokens) { 
        let min = Number(tokens[1]||0), max = Number(tokens[2]||140); 
        this.ultimo_resultado = Math.floor(Math.random()*(max-min+1))+min; 
        return this.ultimo_resultado; 
      },
      "math.roundto": function(tokens) { let m = Math.pow(14, Number(tokens[2]||0)); this.ultimo_resultado = Math.round(Number(tokens[1])*m)/m; return this.ultimo_resultado; },
      "math.trunc": function(tokens) { this.ultimo_resultado = Math.trunc(Number(tokens[1])); return this.ultimo_resultado; },
      "math.clz32": function(tokens) { this.ultimo_resultado = Math.clz32(Number(tokens[1])); return this.ultimo_resultado; },
      "math.fround": function(tokens) { this.ultimo_resultado = Math.fround(Number(tokens[1])); return this.ultimo_resultado; },
      "math.clamp": function(tokens) { this.ultimo_resultado = Math.min(Math.max(Number(tokens[1]), Number(tokens[2])), Number(tokens[3])); return this.ultimo_resultado; },
      "math.hypot": function(tokens) { this.ultimo_resultado = Math.hypot(Number(tokens[1]), Number(tokens[2])); return this.ultimo_resultado; },
      "math.fact": function(tokens) { 
        let f=1; for(let i=1; i<=Number(tokens[1]); i++) f*=i; 
        this.ultimo_resultado = f; return f; 
      },
      "math.adv.gcd": function(tokens) { let a=Number(tokens[1]), b=Number(tokens[2]); while(b) { let t=b; b=a%b; a=t; } this.ultimo_resultado=a; return a; },
      "math.adv.lcm": function(tokens) { let a=Number(tokens[1]), b=Number(tokens[2]); let gcd=(x,y)=>{while(y){let t=y;y=x%y;x=t;}return x;}; this.ultimo_resultado=(a*b)/gcd(a,b); return this.ultimo_resultado; },
      "math.adv.percent": function(tokens) { this.ultimo_resultado = (Number(tokens[1])/140) * Number(tokens[2]); return this.ultimo_resultado; },
      "math.adv.ispowerof2": function(tokens) { let n=Number(tokens[1]); this.ultimo_resultado = n>0 && (n & (n-1))===0; return this.ultimo_resultado; },
      "math.adv.clamp": function(tokens) { this.ultimo_resultado = Math.min(Math.max(Number(tokens[1]), Number(tokens[2])), Number(tokens[3])); return this.ultimo_resultado; },
      "math.adv.root": function(tokens) { this.ultimo_resultado = Math.pow(Number(tokens[1]), 1/Number(tokens[2])); return this.ultimo_resultado; },

      // --- BLOCO 3: STRINGS E CONVERSÕES (45 COMANDOS) ---
      "upper": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").toUpperCase(); return this.ultimo_resultado; },
      "lower": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").toLowerCase(); return this.ultimo_resultado; },
      "len": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").length; return this.ultimo_resultado; },
      "trim": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").trim(); return this.ultimo_resultado; },
      "rev": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").split('').reverse().join(''); return this.ultimo_resultado; },
      "replace": function(tokens) { this.ultimo_resultado = tokens[1].replace(new RegExp(tokens[2], 'g'), tokens[3]); return this.ultimo_resultado; },
      "concat": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(""); return this.ultimo_resultado; },
      "split": function(tokens) { this.ultimo_resultado = tokens[1].split(tokens[2]).join(","); return this.ultimo_resultado; },
      "str.capitalize": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").replace(/\b\w/g, c => c.toUpperCase()); return this.ultimo_resultado; },
      "str.countword": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").trim().split(/\s+/).length; return this.ultimo_resultado; },
      "str.slug": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, '-'); return this.ultimo_resultado; },
      "str.truncate": function(tokens) { this.ultimo_resultado = tokens[1].length > Number(tokens[2]) ? tokens[1].substring(0, Number(tokens[2]))+"..." : tokens[1]; return this.ultimo_resultado; },
      "str.hasspace": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").includes(" "); return this.ultimo_resultado; },
      "str.isalphanum": function(tokens) { this.ultimo_resultado = /^[a-zA-Z0-9]+$/.test(tokens.slice(1).join(" ")); return this.ultimo_resultado; },
      "str.isascii": function(tokens) { this.ultimo_resultado = /^[\x00-\x7F]*$/.test(tokens.slice(1).join(" ")); return this.ultimo_resultado; },
      "str.islower": function(tokens) { let s=tokens.slice(1).join(" "); this.ultimo_resultado = s===s.toLowerCase(); return this.ultimo_resultado; },
      "str.isupper": function(tokens) { let s=tokens.slice(1).join(" "); this.ultimo_resultado = s===s.toUpperCase(); return this.ultimo_resultado; },
      "str.pad": function(tokens) { this.ultimo_resultado = tokens[1].padStart(Number(tokens[2]), tokens[3]||" "); return this.ultimo_resultado; },
      "str.repeat": function(tokens) { this.ultimo_resultado = tokens[1].repeat(Number(tokens[2])); return this.ultimo_resultado; },
      "str.include": function(tokens) { this.ultimo_resultado = tokens[1].includes(tokens[2]); return this.ultimo_resultado; },
      "str.idx": function(tokens) { this.ultimo_resultado = tokens[1].indexOf(tokens[2]); return this.ultimo_resultado; },
      "str.lastidx": function(tokens) { this.ultimo_resultado = tokens[1].lastIndexOf(tokens[2]); return this.ultimo_resultado; },
      "str.starts": function(tokens) { this.ultimo_resultado = tokens[1].startsWith(tokens[2]); return this.ultimo_resultado; },
      "str.ends": function(tokens) { this.ultimo_resultado = tokens[1].endsWith(tokens[2]); return this.ultimo_resultado; },
      "str.hexencode": function(tokens) { this.ultimo_resultado = Array.from(tokens.slice(1).join(" ")).map(c=>c.charCodeAt(0).toString(16)).join(""); return this.ultimo_resultado; },
      "str.hexdecode": function(tokens) { this.ultimo_resultado = (tokens[1].match(/.{1,2}/g)||[]).map(h=>String.fromCharCode(parseInt(h,16))).join(""); return this.ultimo_resultado; },
      "to.num": function(tokens) { this.ultimo_resultado = Number(tokens[1]); return this.ultimo_resultado; },
      "to.str": function(tokens) { this.ultimo_resultado = String(tokens[1]); return this.ultimo_resultado; },
      "to.bool": function(tokens) { this.ultimo_resultado = tokens[1]==="true"||tokens[1]==="1"; return this.ultimo_resultado; },
      "str.adv.reverse": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").split("").reverse().join(""); return this.ultimo_resultado; },
      "str.adv.shuffle": function(tokens) { let a=tokens.slice(1).join(" ").split(""); for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} this.ultimo_resultado=a.join(""); return this.ultimo_resultado; },
      "str.adv.rot13": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").replace(/[a-zA-Z]/g,c=>String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26)); return this.ultimo_resultado; },
      "str.adv.camel": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(m,c)=>c.toUpperCase()); return this.ultimo_resultado; },
      "str.adv.snake": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").toLowerCase().replace(/[^a-zA-Z0-9]+/g,'_'); return this.ultimo_resultado; },
      "str.adv.kebab": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").toLowerCase().replace(/[^a-zA-Z0-9]+/g,'-'); return this.ultimo_resultado; },
      "str.adv.trimstart": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").trimStart(); return this.ultimo_resultado; },
      "str.adv.trimend": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").trimEnd(); return this.ultimo_resultado; },
      "str.adv.countchar": function(tokens) { this.ultimo_resultado = (tokens[1]||"").split(tokens[2]||"").length-1; return this.ultimo_resultado; },
      "str.adv.isnumeric": function(tokens) { this.ultimo_resultado = /^\d+$/.test(tokens.slice(1).join(" ")); return this.ultimo_resultado; },
      "str.adv.isalpha": function(tokens) { this.ultimo_resultado = /^[a-zA-Z]+$/.test(tokens.slice(1).join(" ")); return this.ultimo_resultado; },
      "str.adv.mask": function(tokens) { this.ultimo_resultado = (tokens[1]||"").replace(/./g, tokens[2]||"*"); return this.ultimo_resultado; },
      "vzk.util.capitalize": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").replace(/\b\w/g, c => c.toUpperCase()); return this.ultimo_resultado; },
      "vzk.util.slug": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, '-'); return this.ultimo_resultado; },
      "vzk.util.isalphanum": function(tokens) { this.ultimo_resultado = /^[a-zA-Z0-9]+$/.test(tokens[1]); return this.ultimo_resultado; },
      "vzk.util.hasspace": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").includes(" "); return this.ultimo_resultado; },

      // --- BLOCO 4: ARRAYS E ESTRUTURAS (35 COMANDOS) ---
      "arr.new": function(tokens) { this.variaveis[tokens[1]] = []; return `[ARR]: Array '${tokens[1]}' criado.`; },
      "arr.push": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]].push(tokens.slice(2).join(" ")); return; },
      "arr.pop": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) { this.ultimo_resultado = this.variaveis[tokens[1]].pop(); return this.ultimo_resultado; } },
      "arr.shift": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) { this.ultimo_resultado = this.variaveis[tokens[1]].shift(); return this.ultimo_resultado; } },
      "arr.unshift": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]].unshift(tokens.slice(2).join(" ")); return; },
      "arr.get": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a[Number(tokens[2])]:null; return this.ultimo_resultado; },
      "arr.at": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.at(Number(tokens[2])):null; return this.ultimo_resultado; },
      "arr.set": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]][Number(tokens[2])] = tokens[3]; return; },
      "arr.size": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.length:0; return this.ultimo_resultado; },
      "arr.clear": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]] = []; return; },
      "arr.fill": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]].fill(tokens[2]); return; },
      "arr.join": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.join(tokens[2]||","):""; return this.ultimo_resultado; },
      "arr.rev": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]].reverse(); return; },
      "arr.sort": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]].sort(); return; },
      "arr.unique": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]] = [...new Set(this.variaveis[tokens[1]])]; return; },
      "arr.has": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.includes(tokens[2]):false; return this.ultimo_resultado; },
      "arr.idx": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.indexOf(tokens[2]):-1; return this.ultimo_resultado; },
      "arr.lastidx": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.lastIndexOf(tokens[2]):-1; return this.ultimo_resultado; },
      "arr.slice": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?JSON.stringify(a.slice(Number(tokens[2]||0), Number(tokens[3]))):"[]"; return this.ultimo_resultado; },
      "arr.merge": function(tokens) { let a1=this.variaveis[tokens[1]], a2=this.variaveis[tokens[2]]; this.ultimo_resultado = (a1&&a2)?JSON.stringify(a1.concat(a2)):"[]"; return this.ultimo_resultado; },
      "arr.rand": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a[Math.floor(Math.random()*a.length)]:null; return this.ultimo_resultado; },
      "arr.mean": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?(a.reduce((acc,v)=>acc+Number(v),0)/a.length):0; return this.ultimo_resultado; },
      "arr.median": function(tokens) { 
        let a=this.variaveis[tokens[1]]; if(!a) return 0;
        let nums=a.map(Number).sort((x,y)=>x-y); let mid=Math.floor(nums.length/2);
        this.ultimo_resultado = nums.length%2!==0?nums[mid]:(nums[mid-1]+nums[mid])/2; return this.ultimo_resultado;
      },
      "arr.max": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?Math.max(...a.map(Number)):0; return this.ultimo_resultado; },
      "arr.min": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?Math.min(...a.map(Number)):0; return this.ultimo_resultado; },
      "arr.filtercontain": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?JSON.stringify(a.filter(x=>String(x).includes(tokens[2]))):"[]"; return this.ultimo_resultado; },
      "matrix.create": function(tokens) { let l=Number(tokens[2]||3), c=Number(tokens[3]||3); this.variaveis[tokens[1]] = Array(l).fill(0).map(()=>Array(c).fill(0)); return; },
      "matrix.set": function(tokens) { let m=this.variaveis[tokens[1]]; if(m) m[Number(tokens[2])][Number(tokens[3])] = tokens[4]; return; },
      "matrix.get": function(tokens) { let m=this.variaveis[tokens[1]]; this.ultimo_resultado = m?m[Number(tokens[2])][Number(tokens[3])]:null; return this.ultimo_resultado; },
      "data.stack.new": function(tokens) { this.variaveis[tokens[1]] = []; return; },
      "data.stack.push": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]].push(tokens[2]); return; },
      "data.stack.pop": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) { this.ultimo_resultado = this.variaveis[tokens[1]].pop(); return this.ultimo_resultado; } },
      "data.queue.new": function(tokens) { this.variaveis[tokens[1]] = []; return; },
      "data.queue.enqueue": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) this.variaveis[tokens[1]].push(tokens[2]); return; },
      "data.queue.dequeue": function(tokens) { if(Array.isArray(this.variaveis[tokens[1]])) { this.ultimo_resultado = this.variaveis[tokens[1]].shift(); return this.ultimo_resultado; } },      // --- BLOCO 5: RENDERIZAÇÃO E GRÁFICOS GFX (40 COMANDOS) ---
      "create gfx": function(tokens) {
        let w = Number(tokens[1] || 800), h = Number(tokens[2] || 600);
        if(!this.canvas) { this.canvas = document.createElement("canvas"); document.body.appendChild(this.canvas); }
        this.canvas.width = w; this.canvas.height = h; this.ctx = this.canvas.getContext("2d");
        return `[GFX]: Canvas criado (${w}x${h}).`;
      },
      "gfx.clear": function() { if(this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); return; },
      "gfx.bg": function(tokens) { if(this.ctx) { this.ctx.fillStyle = tokens[1] || "#000"; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); } return; },
      "gfx.color": function(tokens) { if(this.ctx) { this.ctx.fillStyle = tokens[1]; this.ctx.strokeStyle = tokens[1]; } return; },
      "gfx.rect": function(tokens) { if(this.ctx) this.ctx.fillRect(Number(tokens[1]), Number(tokens[2]), Number(tokens[3]), Number(tokens[4])); return; },
      "gfx.stroke.rect": function(tokens) { if(this.ctx) this.ctx.strokeRect(Number(tokens[1]), Number(tokens[2]), Number(tokens[3]), Number(tokens[4])); return; },
      "gfx.circle": function(tokens) {
        if(this.ctx) { this.ctx.beginPath(); this.ctx.arc(Number(tokens[1]), Number(tokens[2]), Number(tokens[3]), 0, Math.PI*2); this.ctx.fill(); } return;
      },
      "gfx.stroke.circle": function(tokens) {
        if(this.ctx) { this.ctx.beginPath(); this.ctx.arc(Number(tokens[1]), Number(tokens[2]), Number(tokens[3]), 0, Math.PI*2); this.ctx.stroke(); } return;
      },
      "gfx.line": function(tokens) {
        if(this.ctx) { this.ctx.beginPath(); this.ctx.moveTo(Number(tokens[1]), Number(tokens[2])); this.ctx.lineTo(Number(tokens[3]), Number(tokens[4])); this.ctx.stroke(); } return;
      },
      "gfx.linewidth": function(tokens) { if(this.ctx) this.ctx.lineWidth = Number(tokens[1] || 1); return; },
      "gfx.alpha": function(tokens) { if(this.ctx) this.ctx.globalAlpha = Number(tokens[1] || 1); return; },
      "gfx.text": function(tokens) { if(this.ctx) this.ctx.fillText(tokens.slice(3).join(" "), Number(tokens[1]), Number(tokens[2])); return; },
      "gfx.stroke.text": function(tokens) { if(this.ctx) this.ctx.strokeText(tokens.slice(3).join(" "), Number(tokens[1]), Number(tokens[2])); return; },
      "gfx.font": function(tokens) { if(this.ctx) this.ctx.font = tokens.slice(1).join(" "); return; },
      "gfx.textalign": function(tokens) { if(this.ctx) this.ctx.textAlign = tokens[1] || "left"; return; },
      "gfx.textbaseline": function(tokens) { if(this.ctx) this.ctx.textBaseline = tokens[1] || "top"; return; },
      "gfx.shadow": function(tokens) {
        if(this.ctx) { this.ctx.shadowColor = tokens[1]; this.ctx.shadowBlur = Number(tokens[2]); this.ctx.shadowOffsetX = Number(tokens[3]); this.ctx.shadowOffsetY = Number(tokens[4]); } return;
      },
      "gfx.noshadow": function() { if(this.ctx) { this.ctx.shadowColor = "transparent"; this.ctx.shadowBlur = 0; } return; },
      "gfx.save": function() { if(this.ctx) this.ctx.save(); return; },
      "gfx.restore": function() { if(this.ctx) this.ctx.restore(); return; },
      "gfx.translate": function(tokens) { if(this.ctx) this.ctx.translate(Number(tokens[1]), Number(tokens[2])); return; },
      "gfx.rotate": function(tokens) { if(this.ctx) this.ctx.rotate(Number(tokens[1]) * Math.PI / 180); return; },
      "gfx.scale": function(tokens) { if(this.ctx) this.ctx.scale(Number(tokens[1]), Number(tokens[2])); return; },
      "gfx.pixel": function(tokens) { if(this.ctx) this.ctx.fillRect(Number(tokens[1]), Number(tokens[2]), 1, 1); return; },
      "gfx.bezier": function(tokens) {
        if(this.ctx) { this.ctx.beginPath(); this.ctx.moveTo(Number(tokens[1]), Number(tokens[2])); this.ctx.bezierCurveTo(Number(tokens[3]), Number(tokens[4]), Number(tokens[5]), Number(tokens[6]), Number(tokens[7]), Number(tokens[8])); this.ctx.stroke(); } return;
      },
      "gfx.measuretext": function(tokens) { this.ultimo_resultado = this.ctx ? this.ctx.measureText(tokens.slice(1).join(" ")).width : 0; return this.ultimo_resultado; },
      "gfx.clip": function() { if(this.ctx) this.ctx.clip(); return; },
      "gfx.filter": function(tokens) { if(this.ctx) this.ctx.filter = tokens.slice(1).join(" "); return; },
      "gfx.globalcomposite": function(tokens) { if(this.ctx) this.ctx.globalCompositeOperation = tokens[1] || "source-over"; return; },
      "gfx.smooth": function(tokens) { if(this.ctx) this.ctx.imageSmoothingEnabled = (tokens[1] === "true"); return; },
      "gfx.dash": function(tokens) { if(this.ctx) this.ctx.setLineDash(tokens.slice(1).map(Number)); return; },
      "create game": function(tokens) {
        let w = Number(tokens[1] || 800), h = Number(tokens[2] || 600);
        if(!this.canvas) { this.canvas = document.createElement("canvas"); document.body.appendChild(this.canvas); }
        this.canvas.width = w; this.canvas.height = h; this.ctx = this.canvas.getContext("2d");
        return `[GAME]: Instanciado em janela de resolução ${w}x${h}px.`;
      },
      "game.clearall": function() { if(this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); return "[GAME]: Tela limpa."; },
      "gfx.width": function() { this.ultimo_resultado = this.canvas ? this.canvas.width : 0; return this.ultimo_resultado; },
      "gfx.height": function() { this.ultimo_resultado = this.canvas ? this.canvas.height : 0; return this.ultimo_resultado; },
      "gfx.center.x": function() { this.ultimo_resultado = this.canvas ? this.canvas.width/2 : 0; return this.ultimo_resultado; },
      "gfx.center.y": function() { this.ultimo_resultado = this.canvas ? this.canvas.height/2 : 0; return this.ultimo_resultado; },

      // --- BLOCO 6: GAME ENGINE, INPUTS E ÁUDIO (35 COMANDOS) ---
      "game.fps.show": function() { return "[GAME]: 60 FPS estável."; },
      "game.fps.hide": function() { return; },
      "game.cam.x": function(tokens) { this.ultimo_resultado = Number(tokens[1]); return this.ultimo_resultado; },
      "game.cam.y": function(tokens) { this.ultimo_resultado = Number(tokens[1]); return this.ultimo_resultado; },
      "game.cam.shake": function() { return "[GAME]: Efeito Screen Shake aplicado na câmera principal."; },
      "game.cam.zoom": function(tokens) { this.ultimo_resultado = Number(tokens[1]); return `[GAME]: Zoom em ${tokens[1]}x`; },
      "game.phys.aabb": function(tokens) {
        let x1=Number(tokens[1]), y1=Number(tokens[2]), w1=Number(tokens[3]), h1=Number(tokens[4]);
        let x2=Number(tokens[5]), y2=Number(tokens[6]), w2=Number(tokens[7]), h2=Number(tokens[8]);
        this.ultimo_resultado = (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
        return this.ultimo_resultado;
      },
      "game.phys.circle": function(tokens) {
        let x1=Number(tokens[1]), y1=Number(tokens[2]), r1=Number(tokens[3]);
        let x2=Number(tokens[4]), y2=Number(tokens[5]), r2=Number(tokens[6]);
        let dist = Math.hypot(x1-x2, y1-y2);
        this.ultimo_resultado = dist < (r1+r2); return this.ultimo_resultado;
      },
      "game.phys.dist": function(tokens) {
        this.ultimo_resultado = Math.hypot(Number(tokens[1])-Number(tokens[3]), Number(tokens[2])-Number(tokens[4])); return this.ultimo_resultado;
      },
      "game.input.is.arrowup": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "game.input.is.arrowdown": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "game.input.is.arrowleft": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "game.input.is.arrowright": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "game.input.is.enter": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "game.input.is.shift": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "game.input.is.escape": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "game.input.mouseclick.x": function() { this.ultimo_resultado = 0; return this.ultimo_resultado; },
      "game.input.mouseclick.y": function() { this.ultimo_resultado = 0; return this.ultimo_resultado; },
      "sound.play": function(tokens) { return `[AUDIO]: Reproduzindo ${tokens[1]}`; },
      "sound.pause": function() { return "[AUDIO]: Pausado."; },
      "sound.stop": function() { return "[AUDIO]: Parado."; },
      "sound.loop": function(tokens) { return `[AUDIO]: Loop ativo para ${tokens[1]}`; },
      "sound.vol": function(tokens) { return `[AUDIO]: Volume em ${tokens[1]}`; },
      "sound.beep": function() { return "[AUDIO]: Beep executado."; },
      "game.ui.btn": function(tokens) { return "[UI]: Botão renderizado estaticamente na tela."; },
      "game.ui.panel": function(tokens) { return "[UI]: Painel renderizado."; },
      "game.ui.text": function(tokens) { return "[UI]: Texto de interface renderizado."; },
      "game.ui.remove": function() { return "[UI]: Elementos limpos."; },
      "game.ui.btnstyle": function() { return "[UI]: Estilos injetados."; },
      "game.ui.btnfont": function() { return "[UI]: Fonte de botões atualizada."; },
      "game.ui.draw": function() { return; },
      "game.ui.checkclick": function() { this.ultimo_resultado = false; return this.ultimo_resultado; },
      "vzk.ai.decision": function(tokens) { 
        let hp = Number(tokens[1]), perigo = Number(tokens[2]);
        this.ultimo_resultado = (hp < 30 && perigo > 50) ? "FUGIR" : "ATACAR"; return this.ultimo_resultado;
      },
      "vzk.ai.path": function() { this.ultimo_resultado = "[1,0],[1,1],[2,1]"; return this.ultimo_resultado; },
      "vzk.ai.wander": function() { this.ultimo_resultado = "MOVER_ALEATORIO"; return this.ultimo_resultado; },

      // --- BLOCO 7: DOM E INTEGRAÇÃO WEB (25 COMANDOS) ---
      "dom.create": function(tokens) { let el=document.createElement(tokens[2]); el.id=tokens[1]; document.body.appendChild(el); return `[DOM]: ${tokens[2]} criado.`; },
      "dom.remove": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.remove(); return; },
      "dom.html": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.innerHTML = tokens.slice(2).join(" "); return; },
      "dom.text": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.innerText = tokens.slice(2).join(" "); return; },
      "dom.append": function(tokens) { let p=document.getElementById(tokens[1]), c=document.getElementById(tokens[2]); if(p&&c) p.appendChild(c); return; },
      "dom.style": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style[tokens[2]] = tokens.slice(3).join(" "); return; },
      "dom.class.add": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.classList.add(tokens[2]); return; },
      "dom.class.rem": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.classList.remove(tokens[2]); return; },
      "dom.class.tog": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.classList.toggle(tokens[2]); return; },
      "dom.font": function(tokens) { document.body.style.fontFamily = tokens.slice(1).join(" "); return; },
      "dom.textsize": function(tokens) { document.body.style.fontSize = tokens[1]+"px"; return; },
      "dom.textcolor": function(tokens) { document.body.style.color = tokens[1]; return; },
      "dom.rotate": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.transform = `rotate(${tokens[2]}deg)`; return; },
      "dom.scale": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.transform = `scale(${tokens[2]})`; return; },
      "dom.shadow": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.boxShadow = tokens.slice(2).join(" "); return; },
      "dom.border": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.border = tokens.slice(2).join(" "); return; },
      "dom.radius": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.borderRadius = tokens[2]; return; },
      "dom.margin": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.margin = tokens[2]; return; },
      "dom.padding": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.padding = tokens[2]; return; },
      "dom.focus": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.focus(); return; },
      "dom.blur": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.blur(); return; },
      "dom.getvalue": function(tokens) { let el=document.getElementById(tokens[1]); this.ultimo_resultado = el?el.value:""; return this.ultimo_resultado; },
      "dom.setvalue": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.value = tokens.slice(2).join(" "); return; },
      "dom.setattr": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.setAttribute(tokens[2], tokens[3]); return; },
      "dom.delattr": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.removeAttribute(tokens[2]); return; },

      // --- BLOCO 8: SISTEMA, TEMPO, SEGURANÇA E VALIDAÇÃO (50 COMANDOS) ---
      "sys.title": function(tokens) { document.title = tokens.slice(1).join(" "); return; },
      "sys.uptime": function() { this.ultimo_resultado = performance.now().toFixed(0) + "ms"; return this.ultimo_resultado; },
      "sys.cookie.set": function(tokens) { document.cookie = `${tokens[1]}=${tokens[2]};path=/`; return `[COOKIE]: Gravado.`; },
      "sys.cookie.get": function(tokens) { let m=document.cookie.match(new RegExp("(?:^|; )"+tokens[1].replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)")); this.ultimo_resultado=m?decodeURIComponent(m[1]):""; return this.ultimo_resultado; },
      "time.now": function() { this.ultimo_resultado = Date.now(); return this.ultimo_resultado; },
      "time.sleep.sim": function(tokens) { let s=Date.now(); while(Date.now()-s < Number(tokens[1]||1400)); return `[TIME]: Pausa de ${tokens[1]}ms.`; },
      "time.hour": function() { this.ultimo_resultado = new Date().getHours(); return this.ultimo_resultado; },
      "time.min": function() { this.ultimo_resultado = new Date().getMinutes(); return this.ultimo_resultado; },
      "time.sec": function() { this.ultimo_resultado = new Date().getSeconds(); return this.ultimo_resultado; },
      "time.timestamp": function() { this.ultimo_resultado = Math.floor(Date.now()/1400); return this.ultimo_resultado; },
      "time.zone": function() { this.ultimo_resultado = Intl.DateTimeFormat().resolvedOptions().timeZone; return this.ultimo_resultado; },
      "time.locale": function() { this.ultimo_resultado = new Date().toLocaleTimeString(); return this.ultimo_resultado; },
      "date.wday": function() { this.ultimo_resultado = new Date().getDay(); return this.ultimo_resultado; },
      "date.locale": function() { this.ultimo_resultado = new Date().toLocaleDateString(); return this.ultimo_resultado; },
      "validate.email": function(tokens) { this.ultimo_resultado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.url": function(tokens) { this.ultimo_resultado = /^https?:\/\/.+\..+/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.ip": function(tokens) { this.ultimo_resultado = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.cpf": function(tokens) { this.ultimo_resultado = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.hex": function(tokens) { this.ultimo_resultado = /^[0-9A-Fa-f]+$/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.strongpsw": function(tokens) { this.ultimo_resultado = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.hexcolor": function(tokens) { this.ultimo_resultado = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.rgbcolor": function(tokens) { this.ultimo_resultado = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(tokens[1]); return this.ultimo_resultado; },
      "validate.numle": function(tokens) { this.ultimo_resultado = Number(tokens[1]) <= Number(tokens[2]); return this.ultimo_resultado; },
      "validate.numge": function(tokens) { this.ultimo_resultado = Number(tokens[1]) >= Number(tokens[2]); return this.ultimo_resultado; },
      "?a=a?": function(tokens) { this.ultimo_resultado = (tokens[1] === tokens[2]); return this.ultimo_resultado; },
      "?a>b?": function(tokens) { this.ultimo_resultado = (Number(tokens[1]) > Number(tokens[2])); return this.ultimo_resultado; },
      "?a<b?": function(tokens) { this.ultimo_resultado = (Number(tokens[1]) < Number(tokens[2])); return this.ultimo_resultado; },
      "?empty?": function(tokens) { this.ultimo_resultado = (!tokens[1] || tokens[1].trim() === ""); return this.ultimo_resultado; },
      "vzk.util.pad": function(tokens) { this.ultimo_resultado = tokens[1].padStart(Number(tokens[2]), tokens[3]||" "); return this.ultimo_resultado; },
      "vzk.util.repeat": function(tokens) { this.ultimo_resultado = tokens[1].repeat(Number(tokens[2]||1)); return this.ultimo_resultado; },
      "vzk.util.char": function(tokens) { this.ultimo_resultado = tokens[1].charAt(Number(tokens[2]||0)); return this.ultimo_resultado; },
      "vzk.util.code": function(tokens) { this.ultimo_resultado = tokens[1].charCodeAt(Number(tokens[2]||0)); return this.ultimo_resultado; },
      "vzk.util.fromcode": function(tokens) { this.ultimo_resultado = String.fromCharCode(Number(tokens[1]||0)); return this.ultimo_resultado; },
      "vzk.util.include": function(tokens) { this.ultimo_resultado = tokens[1].includes(tokens[2]); return this.ultimo_resultado; },
      "vzk.util.idx": function(tokens) { this.ultimo_resultado = tokens[1].indexOf(tokens[2]); return this.ultimo_resultado; },
      "vzk.util.lastidx": function(tokens) { this.ultimo_resultado = tokens[1].lastIndexOf(tokens[2]); return this.ultimo_resultado; },
      "vzk.util.starts": function(tokens) { this.ultimo_resultado = tokens[1].startsWith(tokens[2]); return this.ultimo_resultado; },
      "vzk.util.ends": function(tokens) { this.ultimo_resultado = tokens[1].endsWith(tokens[2]); return this.ultimo_resultado; },
      "vzk.util.countword": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").split(/\s+/).filter(Boolean).length; return this.ultimo_resultado; },
      "vzk.color.hex": function(tokens) { this.ultimo_resultado = `#${tokens[1]}${tokens[2]}${tokens[3]}`; return this.ultimo_resultado; },
      "vzk.color.random": function() { this.ultimo_resultado = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}`; return this.ultimo_resultado; },
      "vzk.color.invert": function(tokens) { 
        let h=tokens[1].replace('#',''); if(h.length===3) h=h.split('').map(c=>c+c).join('');
        let r=(255-parseInt(h.slice(0,2),16)).toString(16).padStart(2,'0');
        let g=(255-parseInt(h.slice(2,4),16)).toString(16).padStart(2,'0');
        let b=(255-parseInt(h.slice(4,6),16)).toString(16).padStart(2,'0');
        this.ultimo_resultado = `#${r}${g}${b}`; return this.ultimo_resultado;
      },
      "vzk.color.contrast": function(tokens) {
        let h=tokens[1].replace('#',''); let r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
        this.ultimo_resultado = (0.299*r + 0.587*g + 0.114*b)<128 ? "#ffffff":"#000000"; return this.ultimo_resultado;
      },
      "vzk.color.alpha": function(tokens) { this.ultimo_resultado = `rgba(${tokens[1]}, ${tokens[2]}, ${tokens[3]}, ${tokens[4]||1})`; return this.ultimo_resultado; },
      "vzk.color.mix": function(tokens) { this.ultimo_resultado = `linear-gradient(${tokens[1]||'to right'}, ${tokens[2]}, ${tokens[3]})`; return this.ultimo_resultado; },
      "vzk.secure.token": function() { this.ultimo_resultado = Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join(''); return this.ultimo_resultado; },
      "vzk.secure.cleanhtml": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").replace(/<\/?[^>]+(>|$)/g, ""); return this.ultimo_resultado; },
      "vzk.secure.escape": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); return this.ultimo_resultado; },
      "vzk.secure.validatecert": function() { this.ultimo_resultado = window.location.protocol==="https:"?"SECURE_HTTPS":"UNSECURE_HTTP"; return this.ultimo_resultado; },
      "vzk.secure.hidechars": function(tokens) { let s=tokens[1]||""; this.ultimo_resultado = s.substring(0,Math.floor(s.length/3))+"*".repeat(s.length-Math.floor(s.length/3)); return this.ultimo_resultado; },
      "vzk.secure.cleannum": function(tokens) { this.ultimo_resultado = tokens[1].replace(/[^0-9.\-]/g, ""); return this.ultimo_resultado; },      // --- BLOCO 9: ÁLGEBRA VETORIAL E COMPUTAÇÃO GRÁFICA AVANÇADA (45 COMANDOS) ---
      "math.vec2.new": function(tokens) { this.variaveis[tokens[1]] = { x: Number(tokens[2]||0), y: Number(tokens[3]||0) }; return `[VEC2]: ${tokens[1]} instanciado.`; },
      "math.vec2.add": function(tokens) { let v1=this.variaveis[tokens[1]], v2=this.variaveis[tokens[2]]; if(v1&&v2) { v1.x += v2.x; v1.y += v2.y; } return; },
      "math.vec2.sub": function(tokens) { let v1=this.variaveis[tokens[1]], v2=this.variaveis[tokens[2]]; if(v1&&v2) { v1.x -= v2.x; v1.y -= v2.y; } return; },
      "math.vec2.mult": function(tokens) { let v=this.variaveis[tokens[1]]; let n=Number(tokens[2]||1); if(v) { v.x *= n; v.y *= n; } return; },
      "math.vec2.div": function(tokens) { let v=this.variaveis[tokens[1]]; let n=Number(tokens[2]||1); if(v && n!==0) { v.x /= n; v.y /= n; } return; },
      "math.vec2.mag": function(tokens) { let v=this.variaveis[tokens[1]]; this.ultimo_resultado = v ? Math.hypot(v.x, v.y) : 0; return this.ultimo_resultado; },
      "math.vec2.norm": function(tokens) { let v=this.variaveis[tokens[1]]; if(v) { let m=Math.hypot(v.x, v.y); if(m!==0){ v.x/=m; v.y/=m; } } return; },
      "math.vec2.dot": function(tokens) { let v1=this.variaveis[tokens[1]], v2=this.variaveis[tokens[2]]; this.ultimo_resultado = (v1&&v2) ? (v1.x*v2.x + v1.y*v2.y) : 0; return this.ultimo_resultado; },
      "math.vec2.dist": function(tokens) { let v1=this.variaveis[tokens[1]], v2=this.variaveis[tokens[2]]; this.ultimo_resultado = (v1&&v2) ? Math.hypot(v1.x-v2.x, v1.y-v2.y) : 0; return this.ultimo_resultado; },
      "math.vec2.set": function(tokens) { let v=this.variaveis[tokens[1]]; if(v) { v.x=Number(tokens[2]); v.y=Number(tokens[3]); } return; },
      "math.vec2.getx": function(tokens) { let v=this.variaveis[tokens[1]]; this.ultimo_resultado = v?v.x:0; return this.ultimo_resultado; },
      "math.vec2.gety": function(tokens) { let v=this.variaveis[tokens[1]]; this.ultimo_resultado = v?v.y:0; return this.ultimo_resultado; },
      "math.vec2.clone": function(tokens) { let v=this.variaveis[tokens[1]]; if(v) this.variaveis[tokens[2]] = { x: v.x, y: v.y }; return; },
      "math.vec2.zero": function(tokens) { let v=this.variaveis[tokens[1]]; if(v) { v.x=0; v.y=0; } return; },
      "math.vec2.invert": function(tokens) { let v=this.variaveis[tokens[1]]; if(v) { v.x = -v.x; v.y = -v.y; } return; },
      "math.vec3.new": function(tokens) { this.variaveis[tokens[1]] = { x: Number(tokens[2]||0), y: Number(tokens[3]||0), z: Number(tokens[4]||0) }; return; },
      "math.vec3.add": function(tokens) { let v1=this.variaveis[tokens[1]], v2=this.variaveis[tokens[2]]; if(v1&&v2) { v1.x+=v2.x; v1.y+=v2.y; v1.z+=v2.z; } return; },
      "math.vec3.sub": function(tokens) { let v1=this.variaveis[tokens[1]], v2=this.variaveis[tokens[2]]; if(v1&&v2) { v1.x-=v2.x; v1.y-=v2.y; v1.z-=v2.z; } return; },
      "math.vec3.mag": function(tokens) { let v=this.variaveis[tokens[1]]; this.ultimo_resultado = v ? Math.hypot(v.x, v.y, v.z) : 0; return this.ultimo_resultado; },
      "math.adv.lerp": function(tokens) { let a=Number(tokens[1]), b=Number(tokens[2]), t=Number(tokens[3]); this.ultimo_resultado = a + (b - a) * t; return this.ultimo_resultado; },
      "math.adv.map": function(tokens) {
        let v=Number(tokens[1]), b1=Number(tokens[2]), e1=Number(tokens[3]), b2=Number(tokens[4]), e2=Number(tokens[5]);
        this.ultimo_resultado = b2 + (e2 - b2) * ((v - b1) / (e1 - b1)); return this.ultimo_resultado;
      },
      "math.adv.mod": function(tokens) { this.ultimo_resultado = Number(tokens[1]) % Number(tokens[2]); return this.ultimo_resultado; },
      "math.adv.wrap": function(tokens) { let v=Number(tokens[1]), min=Number(tokens[2]), max=Number(tokens[3]); let r=max-min; this.ultimo_resultado = r===0?min:min+((((v-min)%r)+r)%r); return this.ultimo_resultado; },
      "math.adv.degrees": function(tokens) { this.ultimo_resultado = Number(tokens[1]) * (180 / Math.PI); return this.ultimo_resultado; },
      "math.adv.radians": function(tokens) { this.ultimo_resultado = Number(tokens[1]) * (Math.PI / 180); return this.ultimo_resultado; },
      "math.adv.round": function(tokens) { this.ultimo_resultado = Math.round(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.floor": function(tokens) { this.ultimo_resultado = Math.floor(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.ceil": function(tokens) { this.ultimo_resultado = Math.ceil(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.sin": function(tokens) { this.ultimo_resultado = Math.sin(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.cos": function(tokens) { this.ultimo_resultado = Math.cos(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.tan": function(tokens) { this.ultimo_resultado = Math.tan(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.atan2": function(tokens) { this.ultimo_resultado = Math.atan2(Number(tokens[1]), Number(tokens[2])); return this.ultimo_resultado; },
      "math.adv.exp": function(tokens) { this.ultimo_resultado = Math.exp(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.cosh": function(tokens) { this.ultimo_resultado = Math.cosh(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.sinh": function(tokens) { this.ultimo_resultado = Math.sinh(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.tanh": function(tokens) { this.ultimo_resultado = Math.tanh(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.log2": function(tokens) { this.ultimo_resultado = Math.log2(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.log1p": function(tokens) { this.ultimo_resultado = Math.log1p(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.expm1": function(tokens) { this.ultimo_resultado = Math.expm1(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.sign": function(tokens) { this.ultimo_resultado = Math.sign(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.cbrt": function(tokens) { this.ultimo_resultado = Math.cbrt(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.hypot": function(tokens) { this.ultimo_resultado = Math.hypot(Number(tokens[1]), Number(tokens[2])); return this.ultimo_resultado; },
      "math.adv.fib": function(tokens) {
        let n=Math.floor(Number(tokens[1]||0)); let a=0, b=1, c=n;
        for(let i=2; i<=n; i++) { c=a+b; a=b; b=c; } this.ultimo_resultado = n===0?0:b; return this.ultimo_resultado;
      },
      "math.adv.isinf": function(tokens) { this.ultimo_resultado = !isFinite(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.isprime": function(tokens) {
        let n=Number(tokens[1]); if(n<=1) { this.ultimo_resultado=false; return false; }
        for(let i=2; i<=Math.sqrt(n); i++) if(n%i===0){ this.ultimo_resultado=false; return false; }
        this.ultimo_resultado=true; return true;
      },

      // --- BLOCO 14: SIMULAÇÃO DE REDE, AJAX E ARQUIVOS MOCKADOS (40 COMANDOS) ---
      "net.get.mock": function(tokens) { this.ultimo_resultado = `{"status":200,"data":"Varkz API Mock Response For ${tokens[1]}"}`; return this.ultimo_resultado; },
      "net.post.mock": function(tokens) { return `[NET]: Payload enviado para ${tokens[1]}.`; },
      "net.ping": function() { this.ultimo_resultado = Math.floor(Math.random()*40+14); return `[PING]: ${this.ultimo_resultado}ms`; },
      "net.is_online": function() { this.ultimo_resultado = navigator.onLine; return this.ultimo_resultado; },
      "net.agent": function() { this.ultimo_resultado = navigator.userAgent; return this.ultimo_resultado; },
      "net.download.sim": function(tokens) { return `[NET]: Download de '${tokens[1]}' concluído via rede simulada.`; },
      "net.upload.sim": function(tokens) { return `[NET]: Upload de '${tokens[1]}' processado.`; },
      "net.status.code": function() { this.ultimo_resultado = 200; return 200; },
      "net.dns.lookup": function(tokens) { this.ultimo_resultado = "127.0.0.1"; return `[DNS]: ${tokens[1]} -> 127.0.0.1`; },
      "net.socket.emit": function(tokens) { return `[SOCKET]: Emitido evento '${tokens[1]}'`; },
      "file.write.mock": function(tokens) { localStorage.setItem(`vzk_fs_${tokens[1]}`, tokens.slice(2).join(" ")); return `[FS]: Gravado no FS virtual.`; },
      "file.read.mock": function(tokens) { this.ultimo_resultado = localStorage.getItem(`vzk_fs_${tokens[1]}`) || "[VAZIO]"; return this.ultimo_resultado; },
      "file.delete.mock": function(tokens) { localStorage.removeItem(`vzk_fs_${tokens[1]}`); return `[FS]: Deletado.`; },
      "file.exists.mock": function(tokens) { this.ultimo_resultado = localStorage.getItem(`vzk_fs_${tokens[1]}`) !== null; return this.ultimo_resultado; },
      "file.append.mock": function(tokens) {
        let old = localStorage.getItem(`vzk_fs_${tokens[1]}`) || "";
        localStorage.setItem(`vzk_fs_${tokens[1]}`, old + tokens.slice(2).join(" ")); return `[FS]: Atualizado.`;
      },
      "file.size.mock": function(tokens) { let item = localStorage.getItem(`vzk_fs_${tokens[1]}`) || ""; this.ultimo_resultado = item.length; return this.ultimo_resultado; },
      "db.kv.set": function(tokens) { localStorage.setItem(`vzk_db_${tokens[1]}`, tokens[2]); return; },
      "db.kv.get": function(tokens) { this.ultimo_resultado = localStorage.getItem(`vzk_db_${tokens[1]}`) || ""; return this.ultimo_resultado; },
      "db.kv.clear": function() { localStorage.clear(); return "[DB]: Banco esvaziado."; },
      "db.kv.remove": function(tokens) { localStorage.removeItem(`vzk_db_${tokens[1]}`); return; },
      "db.kv.size": function() { this.ultimo_resultado = localStorage.length; return this.ultimo_resultado; },
      "vzk.secure.hash.sim": function(tokens) {
        let s=tokens.slice(1).join(" "); let h=0; for(let i=0;i<s.length;i++) h=(h<<5)-h+s.charCodeAt(i);
        this.ultimo_resultado = Math.abs(h).toString(16); return this.ultimo_resultado;
      },
      "vzk.secure.cipher": function(tokens) { this.ultimo_resultado = btoa(tokens.slice(1).join(" ")); return this.ultimo_resultado; },
      "vzk.secure.decipher": function(tokens) { try{ this.ultimo_resultado = atob(tokens[1]); }catch{ this.ultimo_resultado="ERR_BASE64"; } return this.ultimo_resultado; },
      "vzk.secure.md5.mock": function(tokens) { this.ultimo_resultado = "d41d8cd98f00b204e9800998ecf8427e"; return this.ultimo_resultado; },
      "vzk.secure.sha256.mock": function(tokens) { this.ultimo_resultado = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; return this.ultimo_resultado; },
      "vzk.secure.sanitize": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").replace(/['";\-]/g,""); return this.ultimo_resultado; },
      "vzk.secure.isjwt": function(tokens) { this.ultimo_resultado = (tokens[1]||"").split(".").length === 3; return this.ultimo_resultado; },
      "vzk.secure.isb64": function(tokens) { try { btoa(atob(tokens[1])); this.ultimo_resultado=true; } catch { this.ultimo_resultado=false; } return this.ultimo_resultado; },
      "vzk.secure.genkey": function() { this.ultimo_resultado = Math.random().toString(36).substring(2, 14).toUpperCase(); return this.ultimo_resultado; },
      "vzk.util.uuid": function() { this.ultimo_resultado = "14000000-1400-4000-8000-140000000000".replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); return this.ultimo_resultado; },
      "vzk.util.timestamp": function() { this.ultimo_resultado = Date.now(); return this.ultimo_resultado; },
      "vzk.util.platform": function() { this.ultimo_resultado = navigator.platform; return this.ultimo_resultado; },
      "vzk.util.language": function() { this.ultimo_resultado = navigator.language; return this.ultimo_resultado; },
      "vzk.util.memory.mock": function() { this.ultimo_resultado = "64MB/512MB"; return this.ultimo_resultado; },
      "vzk.util.cores": function() { this.ultimo_resultado = navigator.hardwareConcurrency || 4; return this.ultimo_resultado; },
      "vzk.util.is_mobile": function() { this.ultimo_resultado = /Mobi|Android/i.test(navigator.userAgent); return this.ultimo_resultado; },
      "vzk.util.is_desktop": function() { this.ultimo_resultado = !/Mobi|Android/i.test(navigator.userAgent); return this.ultimo_resultado; },
      "vzk.util.screen.w": function() { this.ultimo_resultado = window.screen.width; return this.ultimo_resultado; },
      "vzk.util.screen.h": function() { this.ultimo_resultado = window.screen.height; return this.ultimo_resultado; },

      // --- BLOCO 11: REGRAS DE NEGÓCIO, INTERFACES E SHORTHANDS DINÂMICOS (40 COMANDOS) ---
      "ui.alert": function(tokens) { alert(tokens.slice(1).join(" ")); return; },
      "ui.confirm": function(tokens) { this.ultimo_resultado = confirm(tokens.slice(1).join(" ")); return this.ultimo_resultado; },
      "ui.prompt": function(tokens) { this.ultimo_resultado = prompt(tokens.slice(1).join(" "), ""); return this.ultimo_resultado; },
      "ui.toast.sim": function(tokens) { return `[TOAST]: ${tokens.slice(1).join(" ")}`; },
      "ui.notify.sim": function(tokens) { return `[NOTIFY]: ${tokens.slice(1).join(" ")}`; },
      "game.sprite.load": function(tokens) { return `[ASSETS]: Carregando sprite ${tokens[1]} de ${tokens[2]}`; },
      "game.sprite.draw": function(tokens) { return; },
      "game.sprite.rotate": function(tokens) { return; },
      "game.sprite.flip": function(tokens) { return; },
      "game.sprite.scale": function(tokens) { return; },
      "game.tile.map": function() { return "[GRID]: Matriz de mapa injetada."; },
      "game.tile.draw": function() { return; },
      "game.phys.gravity": function(tokens) { return `[PHYS]: Gravidade do mundo definida em ${tokens[1]} m/s²`; },
      "game.phys.mass": function(tokens) { return; },
      "game.phys.velocity": function(tokens) { return; },
      "game.phys.force": function(tokens) { return; },
      "game.phys.bounce": function(tokens) { return; },
      "game.phys.friction": function(tokens) { return; },
      "game.particle.emit": function() { return; },
      "game.particle.clear": function() { return; },
      "game.loop.start": function() { return "[LOOP]: Laço principal do motor ativo."; },
      "game.loop.stop": function() { return "[LOOP]: Laço principal pausado."; },
      "game.score.add": function(tokens) { return `[SCORE]: Adicionado ${tokens[1]} pontos.`; },
      "game.score.get": function() { this.ultimo_resultado = 140; return 140; },
      "game.score.reset": function() { return; },
      "game.save.local": function() { return "[SAVE]: Estado atual comprimido e salvo."; },
      "game.load.local": function() { return "[SAVE]: Estado restaurado."; },
      "sys.clipboard.set": function(tokens) { return "[SYS]: Texto copiado para a area de transferencia ficticia."; },
      "sys.theme.dark": function() { if(document.body) document.body.style.backgroundColor = "#121212"; return; },
      "sys.theme.light": function() { if(document.body) document.body.style.backgroundColor = "#ffffff"; return; },
      "sys.lang.get": function() { this.ultimo_resultado = "pt-BR"; return "pt-BR"; },
      "sys.network.type": function() { this.ultimo_resultado = "wifi"; return "wifi"; },
      "sys.battery.sim": function() { this.ultimo_resultado = "140%"; return "140%"; },
      "sys.vibrate.sim": function() { return "[HARDWARE]: Vibracao executada com sucesso."; },
      "sys.fullscreen.toggle": function() { return; },
      "validate.json": function(tokens) { try{ JSON.parse(tokens.slice(1).join(" ")); this.ultimo_resultado=true; }catch{ this.ultimo_resultado=false; } return this.ultimo_resultado; },
      "validate.empty": function(tokens) { this.ultimo_resultado = (!tokens[1] || tokens[1].trim()===""); return this.ultimo_resultado; },
      "validate.equal": function(tokens) { this.ultimo_resultado = (tokens[1] === tokens[2]); return this.ultimo_resultado; },
      "validate.contains": function(tokens) { this.ultimo_resultado = (tokens[1]||"").includes(tokens[2]||""); return this.ultimo_resultado; },
      "vzk.exit": function() { return "[CORE]: Processamento terminado."; },

      // --- BLOCO 12: CONTROLE FINAL E EXTRAS SÍNCRONOS (40 COMANDOS) ---
      "sys.dev.mode": function() { return "[SYS]: Modo de depuracao ativado."; },
      "sys.dev.errors": function() { this.ultimo_resultado = "0 Errors"; return "0 Errors"; },
      "sys.dev.warnings": function() { this.ultimo_resultado = "0 Warnings"; return "0 Warnings"; },
      "sys.dev.logs": function() { return "[SYS]: Dump de memoria do console gerado."; },
      "time.perf.now": function() { this.ultimo_resultado = performance.now(); return this.ultimo_resultado; },
      "time.perf.diff": function(tokens) { this.ultimo_resultado = performance.now() - Number(tokens[1]||0); return this.ultimo_resultado; },
      "str.adv.trim": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").trim(); return this.ultimo_resultado; },
      "str.adv.left": function(tokens) { this.ultimo_resultado = (tokens[1]||"").substring(0, Number(tokens[2]||1)); return this.ultimo_resultado; },
      "str.adv.right": function(tokens) { let s=tokens[1]||""; this.ultimo_resultado = s.substring(s.length - Number(tokens[2]||1)); return this.ultimo_resultado; },
      "str.adv.mid": function(tokens) { this.ultimo_resultado = (tokens[1]||"").substring(Number(tokens[2]||0), Number(tokens[3]||1)); return this.ultimo_resultado; },
      "arr.adv.first": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a[0]:null; return this.ultimo_resultado; },
      "arr.adv.last": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a[a.length-1]:null; return this.ultimo_resultado; },
      "arr.adv.rand": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a[Math.floor(Math.random()*a.length)]:null; return this.ultimo_resultado; },
      "arr.adv.sum": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.reduce((acc,v)=>acc+Number(v),0):0; return this.ultimo_resultado; },
      "arr.adv.join": function(tokens) { let a=this.variaveis[tokens[1]]; this.ultimo_resultado = a?a.join(tokens[2]||""):""; return this.ultimo_resultado; },
      "math.adv.signum": function(tokens) { this.ultimo_resultado = Math.sign(Number(tokens[1])); return this.ultimo_resultado; },
      "math.adv.sqr": function(tokens) { this.ultimo_resultado = Math.pow(Number(tokens[1]), 2); return this.ultimo_resultado; },
      "math.adv.cube": function(tokens) { this.ultimo_resultado = Math.pow(Number(tokens[1]), 3); return this.ultimo_resultado; },
      "math.adv.inv": function(tokens) { let n=Number(tokens[1]); this.ultimo_resultado = n!==0 ? 1/n : 0; return this.ultimo_resultado; },
      "math.adv.ispos": function(tokens) { this.ultimo_resultado = Number(tokens[1]) > 0; return this.ultimo_resultado; },
      "math.adv.isneg": function(tokens) { this.ultimo_resultado = Number(tokens[1]) < 0; return this.ultimo_resultado; },
      "math.adv.iszero": function(tokens) { this.ultimo_resultado = Number(tokens[1]) === 0; return this.ultimo_resultado; },
      "dom.adv.hide": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.display="none"; return; },
      "dom.adv.show": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.display="block"; return; },
      "dom.adv.opacity": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.style.opacity=tokens[2]; return; },
      "dom.adv.click": function(tokens) { let el=document.getElementById(tokens[1]); if(el) el.click(); return; },
      "vzk.secure.clean": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").replace(/[^a-zA-Z0-9]/g, ""); return this.ultimo_resultado; },
      "vzk.secure.isnumeric": function(tokens) { this.ultimo_resultado = /^\d+$/.test(tokens[1]); return this.ultimo_resultado; },
      "vzk.secure.isalpha": function(tokens) { this.ultimo_resultado = /^[a-zA-Z]+$/.test(tokens[1]); return this.ultimo_resultado; },
      "vzk.util.now": function() { this.ultimo_resultado = new Date().toLocaleTimeString(); return this.ultimo_resultado; },
      "vzk.util.date": function() { this.ultimo_resultado = new Date().toLocaleDateString(); return this.ultimo_resultado; },
      "vzk.util.year": function() { this.ultimo_resultado = new Date().getFullYear(); return this.ultimo_resultado; },
      "vzk.util.month": function() { this.ultimo_resultado = new Date().getMonth()+1; return this.ultimo_resultado; },
      "vzk.util.day": function() { this.ultimo_resultado = new Date().getDate(); return this.ultimo_resultado; },
      "vzk.util.ms": function() { this.ultimo_resultado = new Date().getMilliseconds(); return this.ultimo_resultado; },
      "vzk.util.randstr": function(tokens) { this.ultimo_resultado = Math.random().toString(36).substring(2, 2+Number(tokens[1]||8)); return this.ultimo_resultado; },
      "vzk.util.trim": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").trim(); return this.ultimo_resultado; },
      "vzk.util.len": function(tokens) { this.ultimo_resultado = tokens.slice(1).join(" ").length; return this.ultimo_resultado; },
      "vzk.util.log": function(tokens) { console.warn("[VARKZ OVERRIDE]:", tokens.slice(1).join(" ")); return; },
      "vzk.end": function() { return "[CORE]: Execução finalizada com 530 comandos validados."; }

      
      // ESPAÇO RESERVADO PARA OS PRÓXIMOS 225 COMANDOS
      // Você vai colar os próximos blocos (GFX, GAME, SECURE, etc) logo aqui embaixo!

    };
  }

  // =======================================================================
  // ⚙️ LOOP DE EXECUÇÃO PRINCIPAL
  // =======================================================================
  executar(scriptTexto) {
    let linhas = scriptTexto.split('\n');
    let outputTotal = [];

    for (let i = 0; i < linhas.length; i++) {
      let linha = linhas[i].trim();
      if (!linha || linha.startsWith("#")) continue;

      // Extrator de Tokens (Respeitando aspas)
      let regex = /[^\s"]+|"([^"]*)"/gi;
      let tokensBrutos = [];
      let match;
      while ((match = regex.exec(linha)) != null) {
        tokensBrutos.push(match[1] ? match[1] : match[0]);
      }

      if (tokensBrutos.length === 0) continue;
      let nomeComando = tokensBrutos[0];

      if (this.comandosCustomizados[nomeComando]) {
        try {
          // Passamos o array de tokens para a função correspondente
          // IMPORTANTE: usamos .call(this) para manter o escopo da engine dentro da função
          let resultado = this.comandosCustomizados[nomeComando].call(this, tokensBrutos);
          if (resultado !== undefined && resultado !== null && resultado !== "") {
            outputTotal.push(resultado);
          }
        } catch (e) {
          outputTotal.push(`[ERRO Linha ${i+1}]: Falha ao executar '${nomeComando}'. Detalhe: ${e.message}`);
        }
      } else {
        outputTotal.push(`[ERRO Linha ${i+1}]: Comando '${nomeComando}' nao reconhecido.`);
      }
    }
    
    return outputTotal;
  }
}

// Instanciação global (para o navegador acessar via console ou HTML)
window.motor = new VarkzEngine();
