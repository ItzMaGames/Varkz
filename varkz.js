const VARKZ = {
  vars: {},
  commands: {},

  /* =========================
     REGISTRAR COMANDOS
  ========================= */
  register(name, fn) {
    this.commands[name] = fn;
  },

  /* =========================
     EXECUTOR DE UMA LINHA (Suporta múltiplos comandos por vírgula)
  ========================= */
  runLine(line, ctx, currentLineIndex) {
    line = line.trim();
    if (line === "" || line.startsWith("#")) return;

    // SUPORTE A VÍRGULA: Divide a linha por vírgulas, mas ignora as que estão dentro de aspas
    let parts = line.match(/(".*?"|[^,\s][^,]*[^,\s]|[^,\s])/g) || [line];
    
    // Se houver mais de uma parte separada por vírgula real, processa cada uma
    if (parts.length > 1 && !line.startsWith("?")) {
      parts.forEach(part => {
        this.runSingleCommand(part.trim(), ctx, currentLineIndex);
      });
    } else {
      this.runSingleCommand(line, ctx, currentLineIndex);
    }
  },

  /* =========================
     INTERPRETADOR DE COMANDO ÚNICO
  ========================= */
  runSingleCommand(line, ctx, currentLineIndex) {
    let cmd = "";
    let args = "";

    if (line.startsWith("?")) { cmd = "?"; args = line.substring(1).trim(); }
    else if (line.startsWith("~")) { cmd = "~"; args = line.substring(1).trim(); }
    else if (line.startsWith("++")) { cmd = "++"; args = line.substring(2).trim(); }
    else if (line.startsWith("--")) { cmd = "--"; args = line.substring(2).trim(); }
    else if (line.startsWith(">>")) { cmd = ">>"; args = line.substring(2).trim(); }
    else {
      cmd = line.split(" ")[0];
      args = line.substring(cmd.length).trim();
    }

    if (this.commands[cmd]) {
      try {
        this.commands[cmd](args, ctx);
      } catch (e) {
        let errorMsg = `ERRO NA LINHA ${currentLineIndex + 1}: ${e.message || e}`;
        console.error(errorMsg);
        ctx.output.push(errorMsg);
      }
    } else {
      let errorMsg = `ERRO DE SINTAXE linha: ${currentLineIndex + 1} (Comando '${cmd}' não existe)`;
      console.error(errorMsg);
      ctx.output.push(errorMsg);
    }
  },

  /* =========================
     ENGINE PRINCIPAL
  ========================= */
  run(code) {
    this.vars = {};
    let output = [];
    let rawLines = code.split("\n");

    let ctx = {
      vars: this.vars,
      output,
      lines: rawLines,
      index: 0
    };

    try {
      for (ctx.index = 0; ctx.index < rawLines.length; ctx.index++) {
        let line = rawLines[ctx.index].trim();
        if (line === "" || line.startsWith("#") || line.startsWith(":") || line.startsWith("!")) continue;
        this.runLine(rawLines[ctx.index], ctx, ctx.index);
      }
    } catch (e) {
      if (e !== "KILL") {
        let currentLine = ctx.index + 1;
        output.push(`ERRO CRÍTICO linha: ${currentLine}`);
      }
    }

    return output.join("\n");
  }
};

/* =====================================================
   🔥 CORE & BASE
===================================================== */
const setVar = (args, ctx) => {
  let [name, ...valueParts] = args.split("=");
  ctx.vars[name?.trim()] = valueParts.join("=").trim() || "";
};
VARKZ.register("var", setVar);
VARKZ.register("set", setVar);

VARKZ.register("show", (args, ctx) => {
  let text = args.trim();
  if (text.startsWith('"') && text.endsWith('"')) { ctx.output.push(text.slice(1, -1)); return; }
  for (const name in ctx.vars) { text = text.replaceAll("$" + name + "$", ctx.vars[name]); }
  if (ctx.vars[text] !== undefined) { ctx.output.push(String(ctx.vars[text])); return; }
  if (/[\+\-\*\:]/.test(text)) {
    let expression = text.replaceAll(":", "/");
    for (const name in ctx.vars) { expression = expression.replace(new RegExp(`\\b${name}\\b`, 'g'), ctx.vars[name]); }
    try {
      let result = Function(`"use strict"; return (${expression})`)();
      if (result !== undefined && !isNaN(result)) { ctx.output.push(String(result)); return; }
    } catch (e) { throw new Error("Cálculo inválido"); }
  }
  ctx.output.push(text);
});

/* =====================================================
   🧠 CONDICIONAIS, SYMBOLS & REPETIÇÃO
===================================================== */
VARKZ.register("?", (args, ctx) => {
  let fullBlock = args; let lookAheadIndex = ctx.index + 1;
  if (!fullBlock.includes(":")) {
    while (lookAheadIndex < ctx.lines.length) {
      let nextLine = ctx.lines[lookAheadIndex].trim();
      if (nextLine.startsWith(":")) fullBlock += " " + nextLine;
      else if (nextLine.startsWith("!")) { fullBlock += " " + nextLine; break; }
      else if (nextLine !== "" && !nextLine.startsWith("#")) break;
      lookAheadIndex++;
    }
  }
  let parts = fullBlock.split(":");
  let conditionPart = parts[0].replace("?", "").trim();
  if (!parts[1]) throw new Error("Condicional ausente");
  let executionParts = parts[1].split("!");
  let ifTrueCmd = executionParts[0].trim();
  let ifFalseCmd = executionParts[1] ? executionParts[1].trim() : null;
  let match = conditionPart.match(/(.+?)\s*(==|!=|>|<|=)\s*(.+)/);
  if (!match) throw new Error("Condição inválida");
  let [, left, operator, right] = match;
  let v1 = ctx.vars[left.trim()] !== undefined ? ctx.vars[left.trim()] : left.trim();
  let v2 = ctx.vars[right.trim()] !== undefined ? ctx.vars[right.trim()] : right.trim();
  let n1 = !isNaN(v1) && v1 !== "" ? Number(v1) : v1;
  let n2 = !isNaN(v2) && v2 !== "" ? Number(v2) : v2;
  let met = false;
  if (operator === "=" || operator === "==") met = (n1 == n2);
  else if (operator === "!=") met = (n1 != n2);
  else if (operator === ">") met = (n1 > n2);
  else if (operator === "<") met = (n1 < n2);
  if (met) VARKZ.runLine(ifTrueCmd, ctx, ctx.index);
  else if (ifFalseCmd) VARKZ.runLine(ifFalseCmd, ctx, ctx.index);
});

VARKZ.register("~", (args, ctx) => {
  let parts = args.split("~"); let range = parts[0].trim();
  let target = parts[1] ? parts[1].replace(">", "").trim() : null;
  let [min, max] = range.split(":").map(Number);
  ctx.vars[target] = String(Math.floor(Math.random() * (max - min + 1)) + min);
});
VARKZ.register("++", (args, ctx) => { ctx.vars[args.trim()] = String((Number(ctx.vars[args.trim()]) || 0) + 1); });
VARKZ.register("--", (args, ctx) => { ctx.vars[args.trim()] = String((Number(ctx.vars[args.trim()]) || 0) - 1); });
VARKZ.register(">>", (args, ctx) => { ctx.vars[args.trim()] = prompt(`Entrada [${args.trim()}]:`) || ""; });
VARKZ.register("repeat", (args, ctx) => {
  let times = parseInt(args) || 0; let block = []; let i = ctx.index + 1;
  while (i < ctx.lines.length && ctx.lines[i].trim() !== "end") { block.push(ctx.lines[i]); i++; }
  ctx.index = i;
  for (let r = 0; r < times; r++) { block.forEach(line => VARKZ.runLine(line, ctx, ctx.index)); }
});

/* =====================================================
   🚀 PACOTE EXTRA DE +40 NOVOS COMANDOS INOVADORES
===================================================== */

// --- MANIPULAÇÃO DE STRINGS / TEXTO ---
VARKZ.register("upper", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = ctx.vars[args].toUpperCase(); });
VARKZ.register("lower", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = ctx.vars[args].toLowerCase(); });
VARKZ.register("len", (args, ctx) => { let [v, t] = args.split(">"); ctx.vars[t.trim()] = String((ctx.vars[v.trim()] || "").length); });
VARKZ.register("trim", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = ctx.vars[args].trim(); });
VARKZ.register("rev", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = ctx.vars[args].split("").reverse().join(""); });
VARKZ.register("replace", (args, ctx) => {
  let [varName, findVal, newVal] = args.split(" ");
  if(ctx.vars[varName]) ctx.vars[varName] = ctx.vars[varName].replaceAll(findVal, newVal);
});
VARKZ.register("concat", (args, ctx) => {
  let [target, ...vars] = args.split(" ");
  ctx.vars[target] = vars.map(v => ctx.vars[v] !== undefined ? ctx.vars[v] : v).join("");
});
VARKZ.register("split", (args, ctx) => {
  let [varName, sep, targetArr] = args.split(" ");
  if(ctx.vars[varName]) ctx.vars[targetArr] = ctx.vars[varName].split(sep).join(",");
});

// --- OPERAÇÕES MATEMÁTICAS AVANÇADAS ---
VARKZ.register("round", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = String(Math.round(Number(ctx.vars[args]))); });
VARKZ.register("floor", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = String(Math.floor(Number(ctx.vars[args]))); });
VARKZ.register("ceil", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = String(Math.ceil(Number(ctx.vars[args]))); });
VARKZ.register("abs", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = String(Math.abs(Number(ctx.vars[args]))); });
VARKZ.register("pow", (args, ctx) => { let [v, exp] = args.split(" "); ctx.vars[v] = String(Math.pow(Number(ctx.vars[v]), Number(exp))); });
VARKZ.register("sqrt", (args, ctx) => { if(ctx.vars[args]) ctx.vars[args] = String(Math.sqrt(Number(ctx.vars[args]))); });
VARKZ.register("min", (args, ctx) => { let [t, a, b] = args.split(" "); ctx.vars[t] = String(Math.min(Number(ctx.vars[a]||a), Number(ctx.vars[b]||b))); });
VARKZ.register("max", (args, ctx) => { let [t, a, b] = args.split(" "); ctx.vars[t] = String(Math.max(Number(ctx.vars[a]||a), Number(ctx.vars[b]||b))); });

// --- ARRAYS / LISTAS (Simuladas por Strings separadas por vírgula) ---
VARKZ.register("arr.new", (args, ctx) => { ctx.vars[args.trim()] = ""; });
VARKZ.register("arr.push", (args, ctx) => {
  let [name, val] = args.split(" "); let realVal = ctx.vars[val] !== undefined ? ctx.vars[val] : val;
  ctx.vars[name] = ctx.vars[name] ? ctx.vars[name] + "," + realVal : realVal;
});
VARKZ.register("arr.get", (args, ctx) => {
  let [name, idx, target] = args.split(" "); let list = ctx.vars[name].split(",");
  ctx.vars[target] = list[Number(idx)] || "";
});
VARKZ.register("arr.size", (args, ctx) => { let [name, target] = args.split(" "); ctx.vars[target] = String(ctx.vars[name] ? ctx.vars[name].split(",").length : 0); });
VARKZ.register("arr.pop", (args, ctx) => {
  let list = ctx.vars[args.trim()].split(","); list.pop(); ctx.vars[args.trim()] = list.join(",");
});

// --- SISTEMA, DATA E UTILITÁRIOS ---
VARKZ.register("time(ms)", (args, ctx) => { ctx.output.push(String(Date.now())); });
VARKZ.register("sleep", (args, ctx) => { /* Bloqueio síncrono simulado leve */ let start = Date.now(); while(Date.now() - start < parseInt(args)){} });
VARKZ.register("env.lang", (args, ctx) => { ctx.vars[args.trim()] = navigator.language; });
VARKZ.register("env.platform", (args, ctx) => { ctx.vars[args.trim()] = navigator.userAgent; });
VARKZ.register("clear", (args, ctx) => { ctx.output.length = 0; });
VARKZ.register("reset", (args, ctx) => { ctx.vars = {}; });
VARKZ.register("check", (args, ctx) => { ctx.output.push(ctx.vars[args] !== undefined ? "true" : "false"); });
VARKZ.register("type", (args, ctx) => { ctx.output.push(typeof ctx.vars[args]); });
VARKZ.register("log", (args, ctx) => { console.log(args); });
VARKZ.register("kill", (args, ctx) => { ctx.output.push("Program terminated."); throw "KILL"; });
VARKZ.register("swap", (args, ctx) => {
  let [a, b] = args.split(" "); let temp = ctx.vars[a]; ctx.vars[a] = ctx.vars[b]; ctx.vars[b] = temp;
});

// --- INTERAÇÃO COM WEB, CONTEXTO E DOM HTML ---
VARKZ.register("web.redirect", (args, ctx) => { window.location.href = args.trim(); });
VARKZ.register("web.alert", (args, ctx) => { alert(args); });
VARKZ.register("dom.title", (args, ctx) => { document.title = args; });
VARKZ.register("dom.write", (args, ctx) => {
  let text = args; for (const name in ctx.vars) { text = text.replaceAll("$" + name + "$", ctx.vars[name]); }
  let div = document.createElement("div"); div.innerHTML = text; document.body.appendChild(div);
});
VARKZ.register("dom.color", (args, ctx) => { document.body.style.backgroundColor = args.trim(); });
VARKZ.register("storage.set", (args, ctx) => { let [k, v] = args.split(" "); localStorage.setItem(k, ctx.vars[v]||v); });
VARKZ.register("storage.get", (args, ctx) => { let [k, v] = args.split(" "); ctx.vars[v] = localStorage.getItem(k) || ""; });

// --- CONVERSÕES DE TIPOS & EXTRAS ---
VARKZ.register("to.num", (args, ctx) => { ctx.vars[args] = String(Number(ctx.vars[args]) || 0); });
VARKZ.register("to.str", (args, ctx) => { ctx.vars[args] = String(ctx.vars[args]); });
VARKZ.register("is.nan", (args, ctx) => { let [v, t] = args.split(" "); ctx.vars[t] = String(isNaN(Number(ctx.vars[v]))); });
VARKZ.register("vzk.version", (args, ctx) => { ctx.output.push("VARKZ Engine v2.5.0 (2026 Edition)"); });
