// Static, dependency-free regression checks for this GitHub Pages portfolio.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const pages=["index.html","cases/thesis.html","cases/rag.html","cases/insurance.html","cases/kubernetes.html","cases/seq2seq.html","cases/pegasus.html"];
const files=["assets/base.css","assets/studio.css","assets/studio.js","assets/architecture.js","assets/favicon.svg"];
const errors=[];
for(const relative of pages){
  const full=path.join(root,relative);
  if(!existsSync(full)){errors.push("Missing HTML page: "+relative);continue}
  const html=readFileSync(full,"utf8");
  const headings=(html.match(/<h1\b/gi)||[]).length;
  if(headings!==1)errors.push(relative+": expected exactly one h1; got "+headings);
  if(!html.includes('data-theme-toggle'))errors.push(relative+": theme toggle missing");
  if(!html.includes('data-mobile-trigger')||!html.includes('data-mobile-panel'))errors.push(relative+": mobile menu missing");
  if(relative.startsWith("cases/") && relative!=="cases/kubernetes.html"){
    if(!html.includes('data-architecture-project'))errors.push(relative+": architecture explorer missing");
    if(!html.includes('src="../assets/architecture.js"'))errors.push(relative+": architecture script missing");
  }
  if(/91\.8%\s*F1|anxiety detection|M\.Sc\. Mechatronics student/i.test(html))errors.push(relative+": outdated or unsupported claim");
  for(const img of html.matchAll(/<img\b([^>]+)>/gi)){
    if(!/\balt\s*=\s*["'][^"']*["']/i.test(img[1]))errors.push(relative+": image missing alt text");
  }
  for(const m of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)){
    const target=m[1];
    if(/^(https?:|mailto:|tel:|data:|javascript:)/i.test(target))continue;
    const [file,anchor]=target.split("#",2);
    const dest=file?path.resolve(path.dirname(full),decodeURIComponent(file)):full;
    if(!existsSync(dest)){errors.push(relative+": missing local target "+target);continue}
    if(anchor&&/\.html$/.test(dest)){
      const targetHtml=readFileSync(dest,"utf8");
      const wanted=decodeURIComponent(anchor).replace(/"/g,"&quot;");
      if(!targetHtml.includes('id="'+wanted+'"')&&!targetHtml.includes("id='"+wanted+"'"))errors.push(relative+": missing anchor "+target);
    }
  }
  console.log("Checked",relative);
}
for(const file of files)if(!existsSync(path.join(root,file)))errors.push("Missing asset: "+file);
try{execFileSync(process.execPath,["--check",path.join(root,"assets/studio.js")],{stdio:"pipe"})}
catch(e){errors.push("studio.js syntax check failed: "+(e.stderr?.toString()||e.message))}
try{execFileSync(process.execPath,["--check",path.join(root,"assets/architecture.js")],{stdio:"pipe"})}
catch(e){errors.push("architecture.js syntax check failed: "+(e.stderr?.toString()||e.message))}
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("PASS: all pages, local references, theme/navigation, and JavaScript syntax");
