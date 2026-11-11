/* Accessible, data-driven interactions. All interactive demos are illustrative, not live ML inference. */
(()=>{"use strict";
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const motionReduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const root=document.documentElement;
  const german=root.lang==="de";
  const toggle=$("[data-theme-toggle]");
  const systemDark=window.matchMedia("(prefers-color-scheme: dark)");
  function themeFromStorage(){try{return localStorage.getItem("sv-portfolio-theme")}catch(_){return null}}
  function setTheme(theme,persist=true){
    root.dataset.theme=theme;
    const themeMeta=document.querySelector('meta[name="theme-color"]');
    if(themeMeta)themeMeta.content=theme==="dark"?"#0b2922":"#fff8ec";
    if(toggle){toggle.setAttribute("aria-label",german?(theme==="dark"?"Theme — Hell":"Theme — Dunkel"):(theme==="dark"?"Theme — Light mode":"Theme — Dark mode"));toggle.setAttribute("aria-pressed",String(theme==="dark"))}
    if(persist){try{localStorage.setItem("sv-portfolio-theme",theme)}catch(_){}}
  }
  setTheme(themeFromStorage()||(systemDark.matches?"dark":"light"),false);
  toggle?.addEventListener("click",()=>setTheme(root.dataset.theme==="dark"?"light":"dark"));
  systemDark.addEventListener?.("change",e=>{if(!themeFromStorage())setTheme(e.matches?"dark":"light",false)});

  const mobileTrigger=document.querySelector("[data-mobile-trigger]");
  const mobilePanel=document.querySelector("[data-mobile-panel]");
  if(mobileTrigger&&mobilePanel){
    function setMobile(open){
      mobilePanel.hidden=!open;
      mobileTrigger.setAttribute("aria-expanded",String(open));
      mobileTrigger.setAttribute("aria-label",german?(open?"Menü schließen":"Menü öffnen"):(open?"Close navigation menu":"Open navigation menu"));
    }
    setMobile(false);
    mobileTrigger.addEventListener("click",()=>setMobile(mobilePanel.hidden));
    mobilePanel.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMobile(false)));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!mobilePanel.hidden){setMobile(false);mobileTrigger.focus()}});
    document.addEventListener("click",e=>{if(!mobilePanel.hidden&&!mobilePanel.contains(e.target)&&!mobileTrigger.contains(e.target))setMobile(false)});
    window.matchMedia("(min-width: 851px)").addEventListener?.("change",e=>{if(e.matches)setMobile(false)});
  }

  const progress=$(".scroll-progress");
  let raf=false;
  function updateProgress(){
    if(progress){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform="scaleX("+(max>0?Math.max(0,Math.min(1,scrollY/max)):1)+")"}
    raf=false
  }
  window.addEventListener("scroll",()=>{if(!raf){raf=true;requestAnimationFrame(updateProgress)}},{passive:true});
  window.addEventListener("resize",updateProgress,{passive:true});updateProgress();
  if("IntersectionObserver" in window&&!motionReduced.matches){
    root.classList.add("js-motion");
    const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");observer.unobserve(e.target)}})},{threshold:.08,rootMargin:"0px 0px -25px 0px"});
    $$(".reveal-on-scroll").forEach(el=>observer.observe(el));
  }else $$(".reveal-on-scroll").forEach(el=>el.classList.add("is-visible"));
  const evalData={
    cv:{accuracy:93.61,label:"Within-distribution five-fold cross-validation",detail:"The model was evaluated across five folds using familiar data distributions. This is a useful internal result, not a guarantee of performance on new people.",f1:"Macro F1 0.952"},
    louo:{accuracy:44.42,label:"Leave-one-user-out: average of users 1–6",detail:"Each test holds out an entire person. The sharp drop shows the model has trouble generalizing to new individuals. It motivated better monitoring and clearer limits.",f1:"Macro F1 0.397"},
    user7:{accuracy:36.96,label:"External labeled session: User 7",detail:"A separate 989-window labeled session provided another difficult check. Mean confidence was 0.858 even though accuracy was 36.96%; confident predictions can still be wrong.",f1:"Macro F1 0.350"}
  };
  const evaluation=$("[data-evaluation]");
  if(evaluation){
    const btns=$$("[data-eval-mode]",evaluation);
    const value=$("[data-eval-value]",evaluation),caption=$("[data-eval-caption]",evaluation),detail=$("[data-eval-detail]",evaluation),f1=$("[data-eval-f1]",evaluation),bar=$("[data-eval-fill]",evaluation);
    function pick(key){
      const d=evalData[key];if(!d)return;
      btns.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.evalMode===key)));
      if(value)value.textContent=d.accuracy.toFixed(2)+"%";
      if(caption)caption.textContent=d.label;
      if(detail)detail.textContent=d.detail;
      if(f1)f1.textContent=d.f1;
      if(bar){bar.style.width=d.accuracy+"%";bar.parentElement?.setAttribute("aria-label",d.accuracy.toFixed(2)+"% accuracy: "+d.label)}
    }
    btns.forEach(b=>b.addEventListener("click",()=>pick(b.dataset.evalMode)));pick(evaluation.dataset.default||"cv");
  }
  const stageInfo={
    thesis:[
      ["01","Ingestion","Read accelerometer and gyroscope sessions, bring their timestamps together and prepare a traceable input record.","6 wrist-sensor channels; target rate 50 Hz."],
      ["02","Validation","Check input structure, missing values, sensor ranges and recording assumptions before data enters the model.","Incorrect or inconsistent input should not silently continue."],
      ["03","Transformation","Convert units, apply the frozen training scaler and create four-second windows with two-second steps.","Model input: (N, 200, 6); do not mix session boundaries."],
      ["04","Inference","Use the frozen 1D-CNN–BiLSTM contract to estimate one of eleven activity labels for each window.","Outputs include predictions and confidence scores."],
      ["05","Evaluation","Compare with known labels when available, or report descriptive prediction statistics without pretending those are accuracy.","Accuracy requires matching ground-truth labels."],
      ["06","Monitoring","Look for low confidence, dominant classes, unusual transitions and sensor-distribution changes.","Monitoring creates evidence for human review, not medical conclusions."],
      ["07","Trigger","Combine monitoring signals into a decision. It can recommend review without changing the deployed model.","The default action is not automatic retraining."],
      ["08","Retraining — gated","Only with suitable labeled data and explicit review can a new candidate be trained.","Conditional stage; requires human approval."],
      ["09","Registration — gated","Keep candidate model versions and metadata traceable instead of silently replacing deployed artifacts.","Promotion is controlled and auditable."],
      ["10","Baseline update — gated","Update monitoring references only after an approved model/data change.","No unattended baseline mutation."]
    ],
    rag:[
      ["01","Documents","Collect tender files and associated metadata. A mix of PDF formats can make text extraction difficult.","Prototype documented over 6,126 source documents."],
      ["02","Extraction","Read text from PDFs, with OCR fallback when a scan has no usable text.","Extraction quality affects everything that follows."],
      ["03","Indexing","Split content into searchable passages and create vector representations.","A vector store helps match a question to related passages."],
      ["04","Question routing","Interpret the question and use available metadata such as IDs, year or region where relevant.","Exact identifier search and semantic search need different care."],
      ["05","Retrieval","Search Qdrant for likely evidence, optionally using reranking to choose better passages.","Retrieval can miss information even when the LLM writes fluently."],
      ["06","Answer and sources","Use the selected passages as context for a local language model and show evidence for review.","A fluent answer is not proof that the source was found."]
    ],
    mlops:[
      ["01","Data ingestion","Read the customer dataset and track what was received.","Data sources and boundaries must be understood."],
      ["02","Validation","Inspect schema, missing fields and dataset assumptions before training.","Incorrect data can create misleading model results."],
      ["03","Transformation","Prepare features and splits consistently.","Avoid leakage across training and evaluation."],
      ["04","Model training","Fit a candidate model and save its artifacts.","Training alone does not establish real-world quality."],
      ["05","Evaluation","Check model behavior on held-out data with leakage-safe procedures.","Older F1/precision/recall claims are withheld pending reevaluation."],
      ["06","Packaging","Expose inference via FastAPI and package the app with Docker.","The goal is a reproducible service."],
      ["07","AWS deployment workflow","Use GitHub Actions together with S3, ECR and EC2 workflow components.","A deployment workflow is distinct from proof of production reliability."]
    ],
    k8s:[
      ["01","Container","Package a simple Flask application using Docker.","The same image is used for each replica."],
      ["02","Deployment","Tell Kubernetes to maintain two running copies.","The Deployment works toward the desired state."],
      ["03","Service","Offer one stable endpoint while directing requests to healthy pods.","Traffic distribution is not necessarily exact round robin."],
      ["04","Failure experiment","Delete one pod and observe Kubernetes starting a replacement.","The local experiment demonstrates self-healing behavior."],
      ["05","Load experiment","Send test requests and inspect which pods handle them.","This tests distribution, not automatically increasing replicas."],
      ["06","Next learning step","Explore readiness probes, Horizontal Pod Autoscaler, observability and cloud clusters.","HPA was not implemented in the documented mini project."]
    ]
  };
  const explorer=$("[data-stage-explorer]");
  if(explorer){
    const type=explorer.dataset.stageExplorer,stages=stageInfo[type]||[];
    const buttons=$("[data-stages]",explorer),num=$("[data-stage-number]",explorer),title=$("[data-stage-title]",explorer),desc=$("[data-stage-description]",explorer),foot=$("[data-stage-foot]",explorer);
    function pick(i){const d=stages[i];if(!d)return;$$("[data-stage-index]",explorer).forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.stageIndex)===i)));if(num)num.textContent=d[0];if(title)title.textContent=d[1];if(desc)desc.textContent=d[2];if(foot)foot.textContent=d[3]}
    if(buttons){const groups=type==="thesis"?[stages.slice(0,7),stages.slice(7)]:[stages];let index=0;groups.forEach((group,gi)=>{const box=document.createElement("div");box.className="stage-group";const h=document.createElement("h3");h.textContent=type==="thesis"?(gi===0?"Core pipeline — always runs":"Conditional steps — approval required"):"Click a stage to inspect it";box.append(h);const grid=document.createElement("div");grid.className="stage-grid";group.forEach(d=>{const button=document.createElement("button");button.className="stage-node";button.type="button";button.dataset.stageIndex=index;button.setAttribute("aria-pressed","false");const n=document.createElement("span");n.textContent=d[0];button.append(n,document.createTextNode(d[1]));const j=index;button.addEventListener("click",()=>pick(j));grid.append(button);index++});box.append(grid);buttons.append(box)})}pick(0);
  }
  const ragDemo=$("[data-rag-demo]");
  if(ragDemo){
    const field=$("select",ragDemo),out=$("[data-demo-result]",ragDemo);
    const responses={
      topic:{q:"What are the required tender documents?",steps:["Identify the question topic","Search document passages","Choose relevant evidence","Generate an answer with source references"],answer:"The assistant would search for passages describing required tender documents. The exact answer depends on the indexed tender files."},
      id:{q:"Find tender DTAD-ID 20046891",steps:["Recognize an exact identifier","Search metadata / ID fields first","Retrieve the matching document","Return available passages"],answer:"An exact-ID lookup should not rely on a semantic guess. A missing match must be reported as missing."},
      multilingual:{q:"What are the minimum wage requirements?",steps:["Understand the English question","Find related German and English passages","Rerank retrieved evidence","Prepare an evidence-based answer"],answer:"Cross-language retrieval may miss precise terms, so relevant source passages must be checked."}
    };
    function render(){const d=responses[field.value]||responses.topic;out.replaceChildren();const p=document.createElement("p");p.textContent="Example question: "+d.q;out.append(p);const ol=document.createElement("ol");d.steps.forEach(x=>{const li=document.createElement("li");li.textContent=x;ol.append(li)});out.append(ol);const note=document.createElement("p");note.textContent=d.answer;out.append(note)}
    field.addEventListener("change",render);render();
  }
  const k8Demo=$("[data-k8s-demo]");
  if(k8Demo){
    const pods=$("[data-pods]",k8Demo),result=$("[data-k8s-result]",k8Demo),reset=$("[data-reset]",k8Demo),breakBtn=$("[data-break]",k8Demo);
    let phase="healthy";
    function render(){
      const state=phase==="healthy"?["Pod A — ready","Pod B — ready"]:phase==="deleted"?["Pod A — deleted","Pod B — ready"]:["Pod C — replacement ready","Pod B — ready"];
      pods.replaceChildren(...state.map((label,i)=>{const el=document.createElement("div");el.className="pod"+(phase==="deleted"&&i===0?" dead":"");const title=document.createElement("strong");title.textContent=label;const tag=document.createElement("span");tag.textContent=phase==="deleted"&&i===0?"One of two desired replicas is missing":"Flask app replica";el.append(title,tag);return el}));
      if(result)result.textContent=phase==="healthy"?"Two pods are available behind a Kubernetes Service.":phase==="deleted"?"One pod has been removed. Kubernetes sees that the desired replica count is not met.":"A replacement pod appears. The Deployment returns to its desired replica count of two.";
      if(breakBtn)breakBtn.textContent=phase==="healthy"?"Delete Pod A (simulation)":phase==="deleted"?"Show recovery":"Delete a pod (simulation)";
      if(breakBtn)breakBtn.disabled=phase==="recovered";
    }
    breakBtn?.addEventListener("click",()=>{phase=phase==="healthy"?"deleted":"recovered";render()});
    reset?.addEventListener("click",()=>{phase="healthy";render()});render();
  }
})();