import{r as d,a as Le,R as ze}from"./vendor-cxkclgJA.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();var Ee={exports:{}},re={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Me=d,Pe=Symbol.for("react.element"),We=Symbol.for("react.fragment"),Oe=Object.prototype.hasOwnProperty,qe=Me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Qe={key:!0,ref:!0,__self:!0,__source:!0};function Re(t,n,s){var r,i={},a=null,c=null;s!==void 0&&(a=""+s),n.key!==void 0&&(a=""+n.key),n.ref!==void 0&&(c=n.ref);for(r in n)Oe.call(n,r)&&!Qe.hasOwnProperty(r)&&(i[r]=n[r]);if(t&&t.defaultProps)for(r in n=t.defaultProps,n)i[r]===void 0&&(i[r]=n[r]);return{$$typeof:Pe,type:t,key:a,ref:c,props:i,_owner:qe.current}}re.Fragment=We;re.jsx=Re;re.jsxs=Re;Ee.exports=re;var e=Ee.exports,ge={},ye=Le;ge.createRoot=ye.createRoot,ge.hydrateRoot=ye.hydrateRoot;const De=new Date("2026-11-29T09:00:00"),O=[{id:"P1",name:"REBUILD",start:"2026-09-01",end:"2026-09-15",color:"#22C55E",purpose:"Concept + Accuracy + Basic Speed",mission:"Build accuracy before speed.",qa:["Percentages","Ratio & Proportion","Averages","Profit/Loss","TSD","Time & Work","SI/CI","Mixtures"],dilr:["Tables","Bar Graphs","Line Graphs","Pie Charts","Linear Arrangements","Circular Arrangements"],varc:["RC Main Idea","RC Inference","RC Tone","Para Summary","Para Jumble"],gate:["Concept clear for each topic","Basic questions solved","Moderate questions solved","Mistakes classified C1–C5","Basic timed solving done"]},{id:"P2",name:"APPLICATION",start:"2026-09-16",end:"2026-10-04",color:"#3B82F6",purpose:"Mixed Practice + Timed Solving + PYQs",mission:"Apply concepts under time pressure.",qa:["Algebra","Geometry","Number System CAT-level","Modern Math"],dilr:["Unfamiliar sets","Hybrid sets","Selection under time","Logic-heavy sets"],varc:["Passage selection","Elimination mastery","Speed building","Difficult RC"],gate:["Approach decided before solving","Solve + Verify habit","Better question selection","Accuracy improving under time"]},{id:"P3",name:"MOCK-DOMINATED",start:"2026-10-05",end:"2026-11-08",color:"#EF4444",purpose:"Mocks + Deep Analysis + Weakness Repair",mission:"Convert practice into mock performance.",qa:["Mixed CAT practice","High-return chapters","Speed + Selection"],dilr:["Set selection strategy","4 sets per mock — pick 3","Abandonment discipline"],varc:["3 passages/day","VA accuracy 90%+","Elimination speed"],gate:["Mock performance improving","Mistakes → marks","Percentile trending up"]},{id:"P4",name:"CONSOLIDATION",start:"2026-11-09",end:"2026-11-20",color:"#8B5CF6",purpose:"Mocks + PYQs + Revision + Strategy",mission:"Lock strategy, consolidate strengths.",qa:["PYQs 2019–2024","Formula revision","High-return only"],dilr:["Best-performing set types","PYQs DILR","Speed optimization"],varc:["RC + VA strategy locked","Passage selection mastered","Accuracy stabilized"],gate:["Exam strategy finalized","Section order locked","Accuracy stable"]},{id:"P5",name:"TAPER",start:"2026-11-21",end:"2026-11-28",color:"#F59E0B",purpose:"Light Revision + Error Log + Exam Readiness",mission:"Light revision. Trust the work. Stay fresh.",qa:["Formula flash revision only","30 min/day max"],dilr:["2 sets max/day","Familiar types only"],varc:["2 RC/day max","Strategy review only"],gate:["Mind clear","Sleep 8 hrs/night","Exam-day checklist ready","Confidence based on evidence"]}],me=[{id:"QA",seq:1,label:"QA",name:"Ratio & Proportion",color:"#16A34A",bg:"rgba(22,163,74,.15)",time:"09:00–10:30",dur:"90 min",target:"70%+ accuracy",tasks:["<strong>Topic:</strong> Ratio basics → part-to-part → proportional division","<strong>Task:</strong> 15–20 questions, Easy → Moderate","<strong>Exit:</strong> 70%+ accuracy on 15 questions"]},{id:"DILR",seq:2,label:"DILR",name:"Bar / Line Graph Set",color:"#2563EB",bg:"rgba(37,99,235,.15)",time:"10:45–12:00",dur:"75 min",target:"1–2 quality sets",tasks:["<strong>Task:</strong> 1 quality Bar or Line Graph set (4–6 questions)","<strong>Rule:</strong> 2nd set ONLY if 1st fully analysed","<strong>Exit:</strong> 3+ correct with method explained"]},{id:"VARC",seq:3,label:"VARC",name:"Main Idea + Inference",color:"#7C3AED",bg:"rgba(124,58,237,.15)",time:"12:15–13:15",dur:"60 min",target:"4/6 correct",tasks:["<strong>Task:</strong> 2 RC passages, 3 questions each","<strong>Flow:</strong> Read → Structure → Argument → Predict → Eliminate","<strong>Exit:</strong> 4+ correct across 6 questions"]},{id:"TEST",seq:4,label:"TEST",name:"Library Deep Work + Repair",color:"#D97706",bg:"rgba(217,119,6,.15)",time:"13:15–17:00",dur:"Deep Work",target:"0 pending errors",tasks:["<strong>Task:</strong> Fix all logged C1–C5 errors","<strong>Rule:</strong> Error log material only — no random resources","<strong>Exit:</strong> Every logged error re-solved"]},{id:"ANALYSIS",seq:5,label:"ANALYSIS",name:"Error Log — Classify C1–C5",color:"#DC2626",bg:"rgba(220,38,38,.15)",time:"21:00–21:45",dur:"45 min",target:"100% classified",tasks:["<strong>C1</strong>=Concept · <strong>C2</strong>=Calc · <strong>C3</strong>=Misread · <strong>C4</strong>=Approach · <strong>C5</strong>=Time","<strong>For each:</strong> Why → Correct method → Prevention rule","<strong>Exit:</strong> Every wrong Q classified + rule written"]},{id:"REVISION",seq:6,label:"REVISION",name:"Formula + Concept Recap",color:"#7C3AED",bg:"rgba(124,58,237,.15)",time:"21:45–22:00",dur:"15 min",target:"Fluent recall",tasks:["<strong>30-sec recap:</strong> What did I learn today?","<strong>2-min:</strong> Formula → trap → today's biggest mistake","<strong>Preview:</strong> Tomorrow's first topic"]},{id:"REPAIR",seq:7,label:"REPAIR",name:"Re-solve Every Wrong Question",color:"#DB2777",bg:"rgba(219,39,119,.15)",time:"Library block",dur:"Ongoing",target:"0 unresolved",tasks:["<strong>Source:</strong> Today's + previous error log","<strong>Method:</strong> Close solution → fresh attempt → verify","<strong>Exit:</strong> 100% of logged errors re-solved"]},{id:"RETEST",seq:8,label:"RETEST",name:"Confirm Mastery",color:"#0E9F9F",bg:"rgba(14,159,159,.15)",time:"End of day",dur:"5 questions",target:"3/5 minimum",tasks:["<strong>Task:</strong> 3–5 fresh questions on today's topics (no notes)","<strong>3+/5 correct</strong> = learning confirmed","<strong>Still wrong</strong> = C1, repair tomorrow morning"]}],ie={QA:[{id:"qa-pct",name:"Percentages",tier:1},{id:"qa-rat",name:"Ratio & Proportion",tier:1},{id:"qa-avg",name:"Averages",tier:1},{id:"qa-pl",name:"Profit / Loss",tier:1},{id:"qa-tsd",name:"TSD",tier:1},{id:"qa-tw",name:"Time & Work",tier:1},{id:"qa-sici",name:"SI / CI",tier:1},{id:"qa-mix",name:"Mixture / Alligation",tier:1},{id:"qa-leq",name:"Linear Equations",tier:2},{id:"qa-qeq",name:"Quadratic Equations",tier:2},{id:"qa-ineq",name:"Inequalities",tier:2},{id:"qa-prog",name:"Progressions",tier:2},{id:"qa-log",name:"Logarithms",tier:2},{id:"qa-geo",name:"Geometry",tier:2},{id:"qa-ns",name:"Number System",tier:2},{id:"qa-pc",name:"P&C / Probability",tier:3}],DILR:[{id:"dl-tbl",name:"Tables",tier:1},{id:"dl-bar",name:"Bar Graphs",tier:1},{id:"dl-line",name:"Line Graphs",tier:1},{id:"dl-pie",name:"Pie Charts",tier:1},{id:"dl-cas",name:"Caselets",tier:1},{id:"dl-lin",name:"Linear Arrangement",tier:1},{id:"dl-cir",name:"Circular Arrangement",tier:1},{id:"dl-dist",name:"Distribution",tier:1},{id:"dl-sel",name:"Selection",tier:1},{id:"dl-rank",name:"Ranking / Order",tier:2},{id:"dl-game",name:"Games / Tournaments",tier:2},{id:"dl-net",name:"Networks",tier:2},{id:"dl-hyb",name:"Hybrid Sets",tier:2}],VARC:[{id:"vc-mi",name:"RC Main Idea",tier:1},{id:"vc-arg",name:"RC Central Argument",tier:1},{id:"vc-inf",name:"RC Inference",tier:1},{id:"vc-tone",name:"RC Tone",tier:1},{id:"vc-elim",name:"RC Elimination",tier:1},{id:"vc-sum",name:"VA Para Summary",tier:1},{id:"vc-jum",name:"VA Para Jumble",tier:1},{id:"vc-comp",name:"VA Para Completion",tier:2},{id:"vc-odd",name:"VA Odd One Out",tier:2}]},Be=[{time:"05:00–05:15",block:"Morning Reset",icon:"🌅",col:"#F5A623",detail:"Water · Stretch · No phone · Read mission"},{time:"05:15–05:55",block:"Daily Dose",icon:"⚡",col:"#F59E0B",detail:"QA test (10 Q) + RC test (1 passage) · Mark mistakes immediately"},{time:"09:00–10:30",block:"QA Session",icon:"📐",col:"#16A34A",detail:"Concept 10 min → 15–20 quality Qs · Easy → Moderate · Accuracy first"},{time:"10:45–12:00",block:"DILR Session",icon:"🧩",col:"#2563EB",detail:"1 quality set · 2nd only if 1st fully analysed · 20-25 min per set"},{time:"12:15–13:15",block:"VARC Session",icon:"📖",col:"#7C3AED",detail:"2 RC passages · Main Idea + Inference + Tone · Elimination focus"},{time:"13:15–17:00",block:"Library Deep Work",icon:"🏛️",col:"#3B82F6",detail:"Pending QA/DILR/VARC · Wrong Qs · Repair work · No random resources"},{time:"17:30–19:00",block:"Coaching",icon:"🎓",col:"#8B5CF6",detail:"Attend coaching · Notes · Mark doubts immediately"},{time:"19:20–20:20",block:"Gym / Movement",icon:"💪",col:"#22C55E",detail:"Non-negotiable physical movement · Brain needs blood flow"},{time:"20:30–21:00",block:"Dinner",icon:"🍽️",col:"#94A3B8",detail:"Eat well · No screens"},{time:"21:00–21:45",block:"Test Analysis + Error Log",icon:"🔍",col:"#EF4444",detail:"Every mistake → C1–C5 → Why → Fix → Repair → Retest"},{time:"21:45–22:00",block:"Revision",icon:"🔄",col:"#7C3AED",detail:"Formulas · DILR frameworks · RC strategy · Today's error recap"},{time:"22:00",block:"Sleep",icon:"😴",col:"#0E9F9F",detail:"8 hours minimum · No screens after 22:00"}],$e=[{dayName:"MON",focus:"BASICS",fCol:"#22C55E",qa:"Percentage basics + 15 Q",dilr:"Tables set",varc:"2 RC — Main Idea",eve:"Error review 20 min"},{dayName:"TUE",focus:"SOLVING",fCol:"#F5A623",qa:"Ratio & Proportion + 15–20 Q",dilr:"Bar/Line Graph",varc:"Main Idea + Inference",eve:"Repair previous errors"},{dayName:"WED",focus:"ACCURACY",fCol:"#3B82F6",qa:"Averages + 15–20 Q",dilr:"Arrangement set",varc:"Tone / Purpose",eve:"Timed mini test 30 min"},{dayName:"THU",focus:"ANALYSIS",fCol:"#EF4444",qa:"P&L + 15–20 Q",dilr:"Distribution/Selection",varc:"Elimination",eve:"Repair + Retest 30 min"},{dayName:"FRI",focus:"TIMING",fCol:"#F59E0B",qa:"Mixed Arithmetic + 15–20 Q",dilr:"Mixed set",varc:"Difficult RC",eve:"Timed Practice 40 min"},{dayName:"SAT",focus:"IMPROVE",fCol:"#8B5CF6",qa:"Weak-topic repair + 10–15 Q",dilr:"Best 2 set types",varc:"Mixed RC + VA",eve:"Repair Sprint 45 min"},{dayName:"SUN",focus:"TEST DAY",fCol:"#A78BFA",qa:"Weekly Mock",dilr:"Full Sectional",varc:"Full Analysis",eve:"Weekly Review + C1–C5",isTest:!0}],Ve=["Concept clear for each topic covered this week","2 DILR quality sets/day attempted + fully analysed","70%+ accuracy on RC Main Idea + Inference questions","Error log with C1–C5 for every wrong question every day","Sunday sectional/mock completed + fully analysed"],te=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function ve(){const t=new Date;t.setHours(0,0,0,0);for(const n of O){const s=new Date(n.start);s.setHours(0,0,0,0);const r=new Date(n.end);if(r.setHours(23,59,59,999),t>=s&&t<=r)return n}return t<new Date(O[0].start)?O[0]:O[O.length-1]}function xe(){const t=Math.max(0,De.getTime()-Date.now());return{days:Math.floor(t/864e5),hours:Math.floor(t%864e5/36e5),minutes:Math.floor(t%36e5/6e4),seconds:Math.floor(t%6e4/1e3)}}function Te(){const t=new Date(O[0].start),n=Math.max(0,Date.now()-t.getTime());return Math.floor(n/(7*864e5))+1}function Ue(){const t=new Date,n=t.getDay(),s=new Date(t);return s.setDate(t.getDate()-(n===0?6:n-1)),s.setHours(0,0,0,0),$e.map((r,i)=>{const a=new Date(s);a.setDate(s.getDate()+i);const c=a.toDateString()===t.toDateString(),u=a<t&&!c;return{...r,date:`${a.getDate()} ${te[a.getMonth()]}`,focus:c?"TODAY":r.focus,fCol:c?"#F5A623":r.fCol,isToday:c,isPast:u}})}function Ge(){const t=new Date,n=t.getDay(),s=new Date(t);s.setDate(t.getDate()-(n===0?6:n-1));const r=new Date(s);return r.setDate(s.getDate()+6),`${s.getDate()} ${te[s.getMonth()]} – ${r.getDate()} ${te[r.getMonth()]} ${r.getFullYear()}`}function He(t){const n=parseInt(t.qa)||0,s=parseInt(t.dilr)||0,r=parseInt(t.varc)||0,i=parseInt(t.qaat)||0,a=parseInt(t.dlat)||0,c=parseInt(t.vcat)||0,u=n+s+r,b=i+a+c,y=i>0?Math.round(n/(i*3)*100):0,o=a>0?Math.round(s/(a*3)*100):0,g=c>0?Math.round(r/(c*3)*100):0,l=b>0?Math.round(u/(b*3)*100):0,f=[];return y<70&&f.push(`QA accuracy ${y}% — repair concept gaps (C1)`),o<70&&f.push(`DILR accuracy ${o}% — work on set selection`),g<70&&f.push(`VARC accuracy ${g}% — improve elimination`),i<14&&f.push(`QA attempts ${i} — build speed on Tier 1 topics`),a<3&&f.push(`DILR attempts ${a} sets — practice set selection faster`),c<18&&f.push(`VARC attempts ${c} — increase RC reading speed`),{total:u,att:b,overall:l,qaAcc:y,dlAcc:o,vcAcc:g,weak:f,qa:n,dilr:s,varc:r,qaat:i,dlat:a,vcat:c}}const Ye=["L0","L1","L2","L3","L4","L5"],_e=["#9CA3AF","#F87171","#FCD34D","#93C5FD","#6EE7B7","#F5A623"],Ke=[0,20,40,60,80,100];function Xe(t){return Ye[t]??"L0"}function Je(t){return _e[t]??"#9CA3AF"}function Ze(t){return Ke[t]??0}function oe(t=new Date){const n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${r}`}function X(){return oe(new Date)}function et(t){return`${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][t.getDay()]}, ${t.getDate()} ${te[t.getMonth()]} ${t.getFullYear()}`}function tt(){const[t,n]=d.useState(()=>{const s=xe();return{...s,hms:$(s.hours)+":"+$(s.minutes)+":"+$(s.seconds)}});return d.useEffect(()=>{const s=()=>{const i=xe();n({...i,hms:$(i.hours)+":"+$(i.minutes)+":"+$(i.seconds)})},r=setInterval(s,1e3);return document.addEventListener("visibilitychange",s),window.addEventListener("cat2026:resume",s),()=>{clearInterval(r),document.removeEventListener("visibilitychange",s),window.removeEventListener("cat2026:resume",s)}},[]),t}function $(t){return String(t).padStart(2,"0")}function he(){const[t,n]=d.useState(ve);return d.useEffect(()=>{const s=()=>{const i=ve();n(a=>a.id!==i.id?i:a)},r=setInterval(s,6e4);return document.addEventListener("visibilitychange",s),window.addEventListener("cat2026:resume",s),()=>{clearInterval(r),document.removeEventListener("visibilitychange",s),window.removeEventListener("cat2026:resume",s)}},[]),t}function nt(){const t=he(),{days:n,hms:s}=tt();return e.jsxs("div",{className:"app-header",children:[e.jsxs("div",{children:[e.jsx("div",{className:"app-title",children:"CAT 2026"}),e.jsx("div",{className:"app-subtitle",children:"75-Day Execution System"})]}),e.jsxs("div",{className:"phase-badge",style:{background:t.color},children:[t.id," — ",t.name]}),e.jsxs("div",{className:"countdown-wrap",children:[e.jsx("div",{className:"countdown-days",children:n}),e.jsx("div",{className:"countdown-label",children:"days left"}),e.jsx("div",{className:"countdown-hms",children:s})]})]})}const st=[{id:"today",icon:"📋",label:"Today"},{id:"week",icon:"📅",label:"Week"},{id:"mastery",icon:"📈",label:"Mastery"},{id:"phases",icon:"🗺️",label:"Phases"},{id:"more",icon:"⋯",label:"More"}];function rt({current:t,onChange:n}){return e.jsx("nav",{className:"bottom-nav",children:st.map(s=>e.jsxs("button",{className:`nav-btn ${t===s.id?"active":""}`,onClick:()=>n(s.id),children:[e.jsx("div",{className:"nav-icon",children:s.icon}),e.jsx("div",{className:"nav-label",children:s.label})]},s.id))})}const it="cat2026_db",ot=2;let U=null;function Y(){return new Promise((t,n)=>{if(U){t(U);return}const s=indexedDB.open(it,ot);s.onupgradeneeded=r=>{const i=r.target.result;[{name:"tasks",key:"id",indexes:[["byDate","date"],["byStatus","status"],["bySubject","subject"]]},{name:"errors",key:"id",indexes:[["byType","errorType"],["bySubject","subject"],["byRepair","repairStatus"]]},{name:"masteryTopics",key:"id",indexes:[]},{name:"mocks",key:"id",indexes:[["byDate","date"]]},{name:"dailyScores",key:"date",indexes:[]},{name:"settings",key:"key",indexes:[]},{name:"formulaReviews",key:"cardId",indexes:[]}].forEach(({name:c,key:u,indexes:b})=>{if(!i.objectStoreNames.contains(c)){const y=i.createObjectStore(c,{keyPath:u});b.forEach(([o,g])=>y.createIndex(o,g,{unique:!1}))}})},s.onsuccess=r=>{U=r.target.result,t(U)},s.onerror=r=>n(r.target.error)})}function J(t,n="readonly"){if(!U)throw new Error("DB not open");return U.transaction(t,n).objectStore(t)}function Z(t){return new Promise((n,s)=>{t.onsuccess=()=>n(t.result),t.onerror=()=>s(t.error)})}async function L(t,n){return await Y(),await Z(J(t).get(n))??null}async function P(t){return await Y(),Z(J(t).getAll())}async function B(t,n){await Y(),await Z(J(t,"readwrite").put(n))}async function at(t){await Y(),await Z(J(t,"readwrite").clear())}async function Fe(t,n,s){await Y();const r=IDBKeyRange.only(s);return Z(J(t).index(n).getAll(r))}const M={async init(){if((await P("masteryTopics")).length>0)return;const n=[];for(const[s,r]of Object.entries(ie))r.forEach(i=>n.push({id:i.id,subject:s,name:i.name,tier:i.tier,currentLevel:0,evidence:[],attempts:0,correct:0,lastPracticed:null,lastTested:null}));for(const s of n)await B("masteryTopics",s)},async getAll(){return P("masteryTopics")},async getBySubject(t){return(await this.getAll()).filter(s=>s.subject===t)},async updateLevel(t,n,s){const r=await L("masteryTopics",t);r&&await B("masteryTopics",{...r,currentLevel:n,lastTested:new Date().toISOString(),evidence:[...r.evidence||[],{date:new Date().toISOString(),level:n,description:s}]})},async recordPractice(t,n,s){const r=await L("masteryTopics",t);if(!r)return;const i=(r.attempts||0)+n,a=(r.correct||0)+s,c=i>0?Math.round(a/i*100):0;let u=r.currentLevel;c>=85&&i>=30&&u<4?u=4:c>=75&&i>=20&&u<3?u=3:c>=60&&i>=10&&u<2?u=2:i>=5&&u<1&&(u=1),await B("masteryTopics",{...r,attempts:i,correct:a,currentLevel:u,lastPracticed:new Date().toISOString()})}},N={async log(t){const s={id:`err_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,errorType:t.errorType,subject:t.subject,topicId:t.topicId??null,topic:t.topic,wrongReason:t.wrongReason,correctMethod:t.correctMethod,preventionRule:t.preventionRule,repairStatus:"PENDING",retestStatus:"PENDING",createdAt:new Date().toISOString(),repairedAt:null,retestedAt:null};return await B("errors",s),s},async getAll(){return P("errors")},async getPending(){return Fe("errors","byRepair","PENDING")},async markRepaired(t){const n=await L("errors",t);n&&await B("errors",{...n,repairStatus:"DONE",retestStatus:"PENDING",repairedAt:new Date().toISOString()})},async markRetestPassed(t,n=1,s=1){const r=await L("errors",t);r&&(await B("errors",{...r,retestStatus:"PASSED",retestedAt:new Date().toISOString()}),r.topicId&&await M.recordPractice(r.topicId,s,n))},async markRetestFailed(t,n=0,s=1){const r=await L("errors",t);r&&(await B("errors",{...r,repairStatus:"PENDING",retestStatus:"FAILED",retestedAt:new Date().toISOString()}),r.topicId&&await M.recordPractice(r.topicId,s,n))},async getTypeCounts(){const t=await this.getAll(),n={C1:0,C2:0,C3:0,C4:0,C5:0};return t.forEach(s=>{n[s.errorType]!==void 0&&n[s.errorType]++}),n}},H={todayKey(){return X()},async getTodayTasks(){const t=this.todayKey();let n=await Fe("tasks","byDate",t);if(n.length===0){const s=me.map(r=>({id:`${t}_${r.id}`,date:t,blockId:r.id,subject:r.label,title:r.name,status:"TODO",startedAt:null,completedAt:null,timeSpentMin:null,notes:""}));for(const r of s)await B("tasks",r);return s}return me.map(s=>n.find(r=>r.blockId===s.id)).filter(Boolean)},async updateTask(t,n){const s=await L("tasks",t);s&&await B("tasks",{...s,...n})},async getWeekTasks(){const t=new Date,n=t.getDay(),s=new Date(t);s.setDate(t.getDate()-(n===0?6:n-1)),s.setHours(0,0,0,0);const r=Array.from({length:7},(a,c)=>{const u=new Date(s);return u.setDate(s.getDate()+c),oe(u)});return(await P("tasks")).filter(a=>r.includes(a.date))},async getAllHistorical(){return P("tasks")}},ne={async log(t){const n={id:`mock_${Date.now()}`,...t,createdAt:new Date().toISOString()};return await B("mocks",n),n},async getAll(){return P("mocks")}},ae={async log(t,n,s,r){const i={date:t,studyHrs:n,screenHrs:s,accuracyPct:r,loggedAt:new Date().toISOString()};await B("dailyScores",i)},async get(t){return L("dailyScores",t)},async getAll(){return P("dailyScores")},async getLast7(){return(await this.getAll()).sort((n,s)=>s.date.localeCompare(n.date)).slice(0,7)}},V={async get(t,n){const s=await L("settings",t);return s?s.value:n},async set(t,n){await B("settings",{key:t,value:n})}};async function lt(){for(const t of["tasks","errors","masteryTopics","mocks","dailyScores","settings"])await at(t)}function fe(){const[t,n]=d.useState([]),[s,r]=d.useState(!0),i=d.useCallback(async()=>{const l=await N.getAll();n(l.sort((f,v)=>v.createdAt.localeCompare(f.createdAt))),r(!1)},[]);d.useEffect(()=>{i()},[i]);const a=d.useCallback(async l=>{await N.log(l),await i()},[i]),c=d.useCallback(async l=>{await N.markRepaired(l),await i()},[i]),u=d.useCallback(async(l,f,v)=>{await N.markRetestPassed(l,f,v),await i()},[i]),b=d.useCallback(async(l,f,v)=>{await N.markRetestFailed(l,f,v),await i()},[i]),y=t.filter(l=>l.repairStatus==="PENDING"),o=t.filter(l=>l.repairStatus==="DONE"&&l.retestStatus==="PENDING"),g=t.reduce((l,f)=>(l[f.errorType]=(l[f.errorType]||0)+1,l),{});return{errors:t,loading:s,pending:y,inRetest:o,counts:g,logError:a,markRepaired:c,retestPass:u,retestFail:b,reload:i}}function dt(){const[t,n]=d.useState(!1),[s,r]=d.useState(0),i=d.useRef(null),a=d.useRef(null),c=d.useCallback(()=>{i.current=Date.now(),n(!0),a.current=window.setInterval(()=>{i.current&&r(Math.floor((Date.now()-i.current)/1e3))},1e3)},[]),u=d.useCallback(()=>{a.current&&clearInterval(a.current),n(!1)},[]),b=d.useCallback(()=>{u(),r(0),i.current=null},[u]);return d.useEffect(()=>()=>{a.current&&clearInterval(a.current)},[]),{running:t,elapsed:s,display:(o=>{const g=Math.floor(o/60),l=o%60;return`${String(g).padStart(2,"0")}:${String(l).padStart(2,"0")}`})(s),start:c,stop:u,reset:b}}function Ie(){const[t,n]=d.useState(null),[s,r]=d.useState(!0),i=d.useCallback(async()=>{const[a,c,u,b]=await Promise.all([H.getTodayTasks(),N.getAll(),ne.getAll(),ae.getLast7()]),y=a.filter(f=>f.status==="DONE").length,o=c.filter(f=>f.repairStatus==="PENDING").length,g=c.filter(f=>f.repairStatus==="DONE"&&f.retestStatus==="PENDING").length,l=b[0]?.accuracyPct??null;n({blocksDone:y,totalErrors:c.length,mocksLogged:u.length,lastAccuracy:l,repairPending:o,retestPending:g}),r(!1)},[]);return d.useEffect(()=>{i()},[i]),{stats:t,loading:s,reload:i}}function ct(){const{running:t,display:n,start:s,stop:r}=dt();return e.jsxs("div",{className:"timer-fab",children:[t&&e.jsx("div",{className:"timer-display",children:n}),e.jsx("button",{className:`timer-btn ${t?"running":""}`,onClick:t?r:s,title:t?"Stop timer":"Start study timer",children:"⏱️"})]})}const Ne=d.createContext({show:()=>{}});function pt({children:t}){const[n,s]=d.useState({message:"",color:"#16A34A",visible:!1}),r=d.useRef(null),i=d.useCallback((a,c="#16A34A")=>{r.current&&clearTimeout(r.current),s({message:a,color:c,visible:!0}),r.current=window.setTimeout(()=>s(u=>({...u,visible:!1})),2400)},[]);return e.jsxs(Ne.Provider,{value:{show:i},children:[t,e.jsx("div",{className:`toast ${n.visible?"show":""}`,style:{background:n.color},children:n.message})]})}function D(){return d.useContext(Ne)}function ut(){const[t,n]=d.useState([]),[s,r]=d.useState(!0),i=d.useRef({}),a=d.useCallback(async()=>{r(!0);try{const o=await H.getTodayTasks();n(o)}finally{r(!1)}},[]);d.useEffect(()=>{a()},[a]),d.useEffect(()=>{let o=new Date().toDateString();const g=setInterval(async()=>{const l=new Date().toDateString();l!==o&&(o=l,await a())},3e4);return()=>clearInterval(g)},[a]),d.useEffect(()=>{const o=()=>a();return document.addEventListener("visibilitychange",()=>{document.hidden||o()}),window.addEventListener("focus",o),window.addEventListener("pageshow",o),window.addEventListener("cat2026:resume",o),()=>{document.removeEventListener("visibilitychange",o),window.removeEventListener("focus",o),window.removeEventListener("pageshow",o),window.removeEventListener("cat2026:resume",o)}},[a]);const c=d.useCallback(async(o,g,l)=>{const f={status:l};if(l==="IN_PROGRESS"&&(f.startedAt=new Date().toISOString(),i.current[g]=Date.now()),l==="DONE"){f.completedAt=new Date().toISOString();const v=i.current[g];v&&(f.timeSpentMin=Math.round((Date.now()-v)/6e4))}l==="TODO"&&(f.completedAt=null,f.startedAt=null),l==="SKIPPED"&&(f.completedAt=new Date().toISOString()),await H.updateTask(o,f),n(v=>v.map(m=>m.id===o?{...m,...f}:m))},[]),u=d.useCallback(async(o,g)=>{await H.updateTask(o,{notes:g}),n(l=>l.map(f=>f.id===o?{...f,notes:g}:f))},[]),b=t.filter(o=>o.status==="DONE").length,y=t.length>0?Math.round(b/t.length*100):0;return{tasks:t,loading:s,done:b,pct:y,updateStatus:c,saveNotes:u,reload:a}}function gt(){const[t,n]=d.useState([]),[s,r]=d.useState(!0);d.useEffect(()=>{H.getWeekTasks().then(n).finally(()=>r(!1))},[]);const i=b=>t.filter(y=>y.subject===b&&y.status==="DONE").length,a=t.filter(b=>b.status==="DONE").length,c=t.length,u=c>0?Math.round(a/c*100):0;return{tasks:t,loading:s,totalDone:a,total:c,pct:u,doneBySubject:i}}function mt({task:t,onStart:n,onDone:s,onUndo:r,onSkip:i,onNotes:a}){const[c,u]=d.useState(!1),[b,y]=d.useState(t.notes??""),o=me.find(m=>m.id===t.blockId);if(!o)return null;const g=t.status==="DONE",l=t.status==="IN_PROGRESS",f=t.status==="SKIPPED";let v="block-card";return g&&(v+=" done-card"),l&&(v+=" inprog-card"),f&&(v+=" skipped-card"),e.jsxs("div",{className:v,children:[e.jsxs("div",{className:"block-header",children:[e.jsx("div",{className:"block-num",style:{background:o.bg,color:o.color},children:o.seq}),e.jsxs("div",{className:"block-info",children:[e.jsx("div",{className:"block-seq",style:{color:o.color},children:o.label}),e.jsx("div",{className:"block-name",children:o.name}),e.jsxs("div",{className:"block-meta",children:[o.time," · ",o.dur," · ",e.jsx("strong",{children:o.target}),g&&e.jsx("span",{style:{color:"#22C55E",marginLeft:4},children:" ✓ Done"}),l&&e.jsx("span",{style:{color:"#F5A623",marginLeft:4},children:" ● In progress"}),f&&e.jsx("span",{style:{color:"#94A3B8",marginLeft:4},children:" ↷ Skipped"})]})]}),e.jsxs("div",{className:"block-actions",children:[!g&&!l&&!f&&e.jsx("button",{className:"act-btn start-btn",title:"Start",onClick:()=>n(t.id,o.id),children:"▶"}),l&&e.jsx("button",{className:"act-btn",style:{borderColor:"#22C55E",color:"#22C55E"},title:"Mark done",onClick:()=>s(t.id,o.id),children:"✓"}),g&&e.jsx("button",{className:"act-btn done-btn",title:"Undo",onClick:()=>r(t.id,o.id),children:"✓"}),!g&&!f&&e.jsx("button",{className:"act-btn",style:{color:"var(--muted)",fontSize:12},title:"Skip",onClick:()=>i(t.id,o.id),children:"↷"})]})]}),e.jsx("button",{className:"expand-btn",onClick:()=>u(m=>!m),children:c?"▲ Hide":"▼ Tasks + Notes"}),c&&e.jsx("div",{className:"block-body",children:e.jsxs("div",{className:"block-body-inner",children:[o.tasks.map((m,h)=>e.jsxs("div",{className:"task-row",children:[e.jsx("div",{className:"task-dot",style:{background:o.color}}),e.jsx("div",{className:"task-text",dangerouslySetInnerHTML:{__html:m}})]},h)),e.jsx("textarea",{className:"textarea-input",style:{marginTop:10},placeholder:"Notes for this block…",value:b,onChange:m=>y(m.target.value)}),e.jsx("button",{className:"save-notes-btn",style:{marginTop:4,background:"var(--blue2)",border:"none",color:"white",borderRadius:6,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer"},onClick:()=>a(t.id,b),children:"Save Notes"})]})})]})}const vt=[{seq:"01",id:"QA",label:"QA",col:"#16A34A"},{seq:"02",id:"DILR",label:"DILR",col:"#2563EB"},{seq:"03",id:"VARC",label:"VARC",col:"#7C3AED"},{seq:"04",id:"TEST",label:"TEST",col:"#D97706"},{seq:"05",id:"ANALYSIS",label:"ANALYSIS",col:"#DC2626"},{seq:"06",id:"REVISION",label:"REVISION",col:"#8B5CF6"},{seq:"07",id:"REPAIR",label:"REPAIR",col:"#DB2777"},{seq:"08",id:"RETEST",label:"RETEST",col:"#0E9F9F"}];function ht(){const t=he(),{tasks:n,loading:s,done:r,pct:i,updateStatus:a,saveNotes:c}=ut(),{show:u}=D(),[b,y]=d.useState(""),[o,g]=d.useState(""),[l,f]=d.useState(""),[v,m]=d.useState(""),h=new Date;async function C(){const S=parseFloat(b)||0,p=parseFloat(o)||0,k=parseInt(l)||0;await ae.log(X(),S,p,k);const x=[`✓ LOGGED: DONE ${S}h study · ${p}h screen · ${k}% accuracy`];k>=75?x.push("🟢 Accuracy "+k+"%+ — Excellent! Maintain this. Difficulty can increase slightly tomorrow."):k>=60?x.push("🟡 Accuracy "+k+"% — Good foundation. Continue same difficulty. Focus on error log tonight."):x.push("🔴 Accuracy "+k+"% — Below 60%. Do NOT increase difficulty. Fix concept gaps first (C1 errors)."),S>=5?x.push("✓ Study hours on target."):x.push("⚠️ Study hours low. Tomorrow: protect the 09:00 QA block first."),p>3&&x.push("⚠️ Screen time "+p+"h > 3h limit. Protect sleep and focus."),m(x.join(`
`)),u("Day logged ✓")}const j=S=>{const p=document.getElementById(`block_${S}`);p&&p.scrollIntoView({behavior:"smooth",block:"center"})};return s?e.jsx("div",{className:"section-pad",style:{textAlign:"center",paddingTop:40},children:e.jsx("div",{style:{color:"var(--muted)",fontSize:13},children:"Loading today's plan…"})}):e.jsxs("div",{children:[e.jsxs("div",{style:{background:"linear-gradient(135deg,#0D1B2A,#1A2E45)",borderBottom:"1px solid rgba(245,166,35,.2)",padding:"12px 16px"},children:[e.jsxs("div",{style:{fontSize:13,fontWeight:700,color:"var(--gold)"},children:["🎯 MISSION: ",t.mission]}),e.jsxs("div",{style:{fontSize:11,color:"var(--muted)",marginTop:3},children:[et(h)," · Week ",Te()," · ",t.id," ",t.name]})]}),e.jsx("div",{style:{padding:"12px 16px 0",overflowX:"auto"},children:e.jsx("div",{style:{display:"flex",gap:6,paddingBottom:4},children:vt.map(S=>e.jsxs("div",{onClick:()=>j(S.id),style:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 8px",minWidth:62,textAlign:"center",cursor:"pointer",flexShrink:0},children:[e.jsx("div",{style:{fontSize:9,fontWeight:800,color:S.col,fontFamily:"monospace"},children:S.seq}),e.jsx("div",{style:{fontSize:11,fontWeight:900,color:"#FFF"},children:S.label})]},S.id))})}),e.jsxs("div",{style:{padding:"12px 16px 0"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6},children:[e.jsx("span",{style:{fontSize:12,fontWeight:700},children:"Today's Progress"}),e.jsxs("span",{style:{fontSize:12,fontFamily:"monospace",color:"var(--gold)"},children:[r,"/8 blocks done"]})]}),e.jsx("div",{className:"progress-wrap",children:e.jsx("div",{className:"progress-fill",style:{width:`${i}%`,background:"linear-gradient(90deg,#16A34A,#22C55E)"}})})]}),e.jsx("div",{style:{padding:"10px 16px 0"},children:n.map(S=>e.jsx("div",{id:`block_${S.blockId}`,children:e.jsx(mt,{task:S,onStart:(p,k)=>{a(p,k,"IN_PROGRESS"),u(`▶ ${k} started`,"#D97706")},onDone:(p,k)=>{a(p,k,"DONE"),u(`✓ ${k} complete!`)},onUndo:(p,k)=>{a(p,k,"TODO"),u(`↩ ${k} reset`,"#D97706")},onSkip:(p,k)=>{a(p,k,"SKIPPED"),u(`↷ ${k} skipped`,"#64748B")},onNotes:(p,k)=>{c(p,k),u("Notes saved ✓")}})},S.id))}),e.jsx("div",{style:{padding:"0 16px 16px"},children:e.jsxs("div",{className:"done-card-wrap",children:[e.jsx("div",{style:{fontSize:13,fontWeight:700,marginBottom:6},children:"📊 Daily Update — DONE format"}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)",marginBottom:8},children:"Type your day's data: DONE [study hrs] [screen hrs] [accuracy%]"}),e.jsxs("div",{className:"done-grid",children:[e.jsxs("div",{className:"done-field",children:[e.jsx("label",{children:"Study hrs"}),e.jsx("input",{type:"number",placeholder:"5",min:0,max:16,value:b,onChange:S=>y(S.target.value)})]}),e.jsxs("div",{className:"done-field",children:[e.jsx("label",{children:"Screen hrs"}),e.jsx("input",{type:"number",placeholder:"3",min:0,max:16,value:o,onChange:S=>g(S.target.value)})]}),e.jsxs("div",{className:"done-field",children:[e.jsx("label",{children:"Accuracy%"}),e.jsx("input",{type:"number",placeholder:"62",min:0,max:100,value:l,onChange:S=>f(S.target.value)})]})]}),e.jsx("button",{className:"btn-primary",onClick:C,children:"✓ LOG TODAY — DONE"}),v&&e.jsx("div",{className:"feedback-box",children:v})]})})]})}function q({icon:t,title:n,sub:s}){return e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"empty-icon",children:t}),e.jsx("div",{className:"empty-title",children:n}),e.jsx("div",{className:"empty-sub",children:s})]})}function ft(){const t=he(),n=Ue(),{totalDone:s,total:r,pct:i,doneBySubject:a}=gt(),[c,u]=d.useState([]);d.useEffect(()=>{ae.getLast7().then(u)},[]);const b=c.length>0?Math.round(c.reduce((o,g)=>o+g.accuracyPct,0)/c.length):null,y=c.length>0?(c.reduce((o,g)=>o+g.studyHrs,0)/c.length).toFixed(1):null;return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"card",style:{background:"linear-gradient(135deg,rgba(26,86,219,.15),rgba(124,58,237,.15))",borderColor:"rgba(26,86,219,.4)"},children:[e.jsxs("div",{style:{fontSize:16,fontWeight:800,marginBottom:4},children:["Week ",Te()," · ",Ge()]}),e.jsx("div",{style:{fontSize:12,color:"var(--gold)",fontWeight:700,marginBottom:4},children:t.mission}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)"},children:"Sequence: QA→DILR→VARC→TEST→ANALYSIS→REVISION→REPAIR→RETEST"})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"Week Progress (from real task data)"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6},children:[e.jsx("span",{style:{fontSize:12,color:"var(--muted)"},children:"Blocks completed"}),e.jsxs("span",{style:{fontSize:12,fontFamily:"monospace",color:"var(--gold)"},children:[s,"/",r||"—"]})]}),e.jsx("div",{className:"progress-wrap",style:{height:8,marginBottom:12},children:e.jsx("div",{className:"progress-fill",style:{width:`${i}%`,background:"linear-gradient(90deg,#1A56DB,#3B82F6)"}})}),e.jsx("div",{className:"grid3",children:[{label:"QA done",val:a("QA"),col:"#16A34A"},{label:"DILR done",val:a("DILR"),col:"#2563EB"},{label:"VARC done",val:a("VARC"),col:"#7C3AED"}].map(o=>e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:20,fontWeight:800,color:o.col,fontFamily:"monospace"},children:o.val}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:o.label})]},o.label))})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"Weekly Performance (from DONE logs)"}),c.length===0?e.jsx(q,{icon:"📊",title:"NO DATA YET",sub:"Log your daily DONE score to see weekly performance."}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid3",style:{gap:6,marginBottom:10},children:[e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsxs("div",{style:{fontSize:20,fontWeight:800,color:"var(--gold)",fontFamily:"monospace"},children:[b,"%"]}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:"Avg Accuracy"})]}),e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsxs("div",{style:{fontSize:20,fontWeight:800,color:"var(--blue3)",fontFamily:"monospace"},children:[y,"h"]}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:"Avg Study/day"})]}),e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:20,fontWeight:800,color:"var(--green2)",fontFamily:"monospace"},children:c.length}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:"Days logged"})]})]}),c.map(o=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)",fontSize:11},children:[e.jsx("span",{style:{color:"var(--muted)"},children:o.date}),e.jsxs("span",{style:{color:o.accuracyPct>=75?"#22C55E":o.accuracyPct>=60?"#F5A623":"#EF4444"},children:[o.accuracyPct,"% · ",o.studyHrs,"h study · ",o.screenHrs,"h screen"]})]},o.date))]})]}),e.jsx("div",{style:{fontSize:12,fontWeight:700,marginBottom:8},children:"Day-by-Day Plan"}),n.map((o,g)=>e.jsxs("div",{className:`week-day-card ${o.isToday?"today-day":""} ${o.isPast?"past-day":""}`,children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8},children:[e.jsxs("div",{style:{fontSize:14,fontWeight:800,color:o.isToday?"#F5A623":o.isTest?"#A78BFA":"var(--text)"},children:[o.dayName," ",o.date,o.isToday?" ← TODAY":""]}),e.jsx("div",{style:{fontSize:9,fontWeight:700,padding:"3px 10px",borderRadius:10,background:o.fCol+"22",color:o.fCol},children:o.focus})]}),e.jsx("div",{className:"grid3",children:[{label:"QA",val:o.qa,col:"#16A34A"},{label:"DILR",val:o.dilr,col:"#2563EB"},{label:"VARC",val:o.varc,col:"#7C3AED"}].map(l=>e.jsxs("div",{style:{background:"var(--navy3)",borderRadius:8,padding:"6px 8px"},children:[e.jsx("div",{style:{fontSize:8,fontWeight:700,color:l.col,marginBottom:2},children:l.label}),e.jsx("div",{style:{fontSize:10,color:"var(--muted)"},children:l.val})]},l.label))}),e.jsxs("div",{style:{marginTop:6,fontSize:10,color:"var(--muted)"},children:["🌙 ",o.eve]})]},g)),e.jsxs("div",{style:{background:"rgba(245,166,35,.06)",border:"1px solid rgba(245,166,35,.2)",borderRadius:12,padding:14,marginTop:4},children:[e.jsx("div",{style:{fontSize:11,fontWeight:800,color:"var(--gold)",marginBottom:8},children:"🔒 Weekly Exit Gate"}),Ve.map((o,g)=>e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:5,fontSize:12,color:"var(--muted)"},children:[e.jsx("span",{style:{color:"#22C55E"},children:"✓"}),o]},g))]})]})}function yt({topic:t}){const n=t.currentLevel,s=Ze(n),r=Je(n),i=t.attempts>0?Math.round(t.correct/t.attempts*100)+"%":"—";return e.jsxs("div",{className:"mastery-row",title:`Attempts: ${t.attempts} · Accuracy: ${i}`,children:[e.jsx("div",{className:"mastery-name",children:t.name}),e.jsx("div",{className:"mastery-bar-bg",children:e.jsx("div",{className:"mastery-bar-fg",style:{width:`${s}%`,background:r}})}),e.jsx("div",{className:"mastery-lv",style:{color:r},children:Xe(n)})]})}const ce=["CONCEPT","BASIC","INTERMEDIATE","CAT/PYQ","TIMED","MIXED","TEST","ANALYSIS","REPAIR","RETEST","RECALL","MASTERY 🏆"],be=2;function xt(){const[t,n]=d.useState([]),[s,r]=d.useState(!0),[i,a]=d.useState(""),[c,u]=d.useState(""),[b,y]=d.useState(0),[o,g]=d.useState(""),{show:l}=D(),f=async()=>{await M.init(),n(await M.getAll()),r(!1)};d.useEffect(()=>{f()},[]);const v=t.filter(p=>p.attempts>0).length,m=t.filter(p=>p.currentLevel===5).length,h=t.filter(p=>p.currentLevel===4).length,C=t.filter(p=>p.currentLevel===0).length;i&&t.filter(p=>p.subject===i);const j=i?ie[i]||[]:[];async function S(){if(!c){l("Select a topic","#D97706");return}if(!o.trim()){l("Evidence required — be honest","#D97706");return}await M.updateLevel(c,b,o.trim()),l("Mastery updated ✓"),g(""),await f()}return s?e.jsx("div",{className:"section-pad",children:e.jsx("div",{style:{color:"var(--muted)",fontSize:13},children:"Loading…"})}):e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"Mastery Scale"}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8},children:["L0 Don't Know","L1 Understand","L2 Guided","L3 Independent","L4 Under Time","L5 CAT Mastery"].map((p,k)=>e.jsx("span",{className:`lv-badge lv${k}`,children:p},k))}),e.jsxs("div",{style:{fontSize:10,color:"var(--muted)"},children:["Levels advance based on ",e.jsx("strong",{style:{color:"var(--text)"},children:"your actual evidence"}),". No auto-advancement without proof."]})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"Overall Summary"}),v===0?e.jsx(q,{icon:"📈",title:"NO DATA YET",sub:"Practice topics and log DONE daily to build your mastery profile."}):e.jsxs("div",{className:"grid3",style:{gap:6},children:[e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:20,fontWeight:800,color:"#F5A623"},children:m}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:"L5 Mastered"})]}),e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:20,fontWeight:800,color:"#6EE7B7"},children:h}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:"L4 Under Time"})]}),e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:20,fontWeight:800,color:"#F87171"},children:C}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:"L0 Not Started"})]})]})]}),["QA","DILR","VARC"].map(p=>{const k=t.filter(A=>A.subject===p),x={QA:"#22C55E",DILR:"#60A5FA",VARC:"#A78BFA"},E={QA:"pill-green",DILR:"pill-blue",VARC:"pill-purple"};return e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{style:{color:x[p]},children:p}),e.jsx("span",{className:`pill ${E[p]}`,children:p==="QA"?"Tier 1 Priority":p==="DILR"?"Set Selection = Key":"RC 70% + VA 30%"})]}),k.length>0?k.map(A=>e.jsx(yt,{topic:A},A.id)):e.jsx(q,{icon:"📊",title:"NO DATA",sub:"—"})]},p)}),e.jsxs("div",{className:"card",style:{borderColor:"rgba(245,166,35,.3)"},children:[e.jsx("div",{className:"card-title",children:"Update Topic Mastery (Evidence Required)"}),e.jsxs("select",{className:"form-select",value:i,onChange:p=>{a(p.target.value),u("")},style:{marginBottom:8},children:[e.jsx("option",{value:"",children:"Select subject…"}),e.jsx("option",{value:"QA",children:"QA"}),e.jsx("option",{value:"DILR",children:"DILR"}),e.jsx("option",{value:"VARC",children:"VARC"})]}),e.jsxs("select",{className:"form-select",value:c,onChange:p=>u(p.target.value),style:{marginBottom:8},children:[e.jsx("option",{value:"",children:"Select topic…"}),j.map(p=>e.jsx("option",{value:p.id,children:p.name},p.id))]}),e.jsx("select",{className:"form-select",value:b,onChange:p=>y(parseInt(p.target.value)),style:{marginBottom:8},children:["L0 — Don't Know","L1 — Understand","L2 — Guided Solving","L3 — Independent","L4 — Accurate Under Time","L5 — CAT Mastery"].map((p,k)=>e.jsx("option",{value:k,children:p},k))}),e.jsx("input",{type:"text",className:"form-input",placeholder:"Evidence: e.g. Solved 20 Qs at 80% accuracy in 45 min",value:o,onChange:p=>g(p.target.value),style:{marginBottom:10}}),e.jsx("button",{className:"btn-primary",onClick:S,children:"Update Mastery Level"})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"♾️ Master Learning Loop"}),e.jsx("div",{style:{lineHeight:2.2},children:ce.map((p,k)=>{const x=k<be?"loop-done":k===be?"loop-active":k===ce.length-1?"loop-master":"loop-next";return e.jsxs("span",{children:[e.jsx("span",{className:`loop-pill ${x}`,children:p}),k<ce.length-1&&e.jsx("span",{style:{color:"var(--muted2)",margin:"0 1px"},children:"→"})]},k)})}),e.jsx("div",{style:{marginTop:8,fontSize:10,color:"var(--red2)",fontWeight:700},children:"Lecture watched ≠ Mastery · Chapter done ≠ Mastery · Question count ≠ Mastery"})]})]})}function bt(){const t=ve();return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"card",style:{background:"linear-gradient(135deg,#0D1B2A,#1A2E45)",borderColor:"rgba(245,166,35,.3)"},children:[e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"var(--gold)"},children:"CAT 2026 · Phase Roadmap"}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)",marginTop:4},children:"Exam: 29 November 2026 · 5 Phases Locked"}),e.jsx("div",{style:{fontSize:10,color:"#EF4444",fontWeight:700,marginTop:6},children:"⚠️ Phase ORDER is LOCKED. Never redesign for one bad day."})]}),O.map(n=>{const s=n.id===t.id;return e.jsxs("div",{className:`phase-card ${s?"current":""}`,style:s?{borderColor:n.color,borderWidth:2,background:n.color+"11"}:{opacity:.75},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8},children:e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:10,background:n.color+"22",color:n.color,display:"inline-block"},children:[n.id," · ",n.name,s?" 🔴 NOW":""]}),e.jsxs("div",{style:{fontSize:10,color:"var(--muted)",marginTop:4},children:[n.start," → ",n.end]})]})}),e.jsx("div",{style:{fontSize:15,fontWeight:800,color:n.color,marginBottom:4},children:n.name}),e.jsx("div",{style:{fontSize:12,color:"var(--muted)",marginBottom:10},children:n.purpose}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8},children:[{label:"QA",items:n.qa,col:"#16A34A"},{label:"DILR",items:n.dilr,col:"#2563EB"},{label:"VARC",items:n.varc,col:"#7C3AED"}].map(r=>e.jsxs("div",{className:"phase-subj-box",children:[e.jsx("div",{className:"phase-subj-title",style:{color:r.col},children:r.label}),r.items.map((i,a)=>e.jsxs("div",{className:"phase-subj-item",children:["▸ ",i]},a))]},r.label))}),e.jsxs("div",{style:{marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"},children:[e.jsx("div",{style:{fontSize:10,fontWeight:700,color:"var(--gold)",marginBottom:4},children:"EXIT GATE"}),n.gate.map((r,i)=>e.jsxs("div",{style:{fontSize:10,color:"var(--muted)",marginBottom:2},children:["✓ ",r]},i))]})]},n.id)})]})}const At=[{id:"dashboard",icon:"📊",label:"Master Execution Dashboard 1:1 View",featured:!0},{id:"catmock",icon:"🏆",label:"CAT 2026 Full Exam Simulator",featured:!0},{id:"adaptive",icon:"🧠",label:"AI Adaptive Weakness Heatmap"},{id:"dailycapsule",icon:"📰",label:"Daily Execution Briefs & Practice Sprints"},{id:"flashcards",icon:"🎴",label:"Spaced Repetition Formula Deck"},{id:"achievements",icon:"🎖️",label:"Streak Counter & Execution Badges"},{id:"research",icon:"🔬",label:"Deep Research Protocol"},{id:"livesessions",icon:"📺",label:"Expert Masterclasses & Video Seminars"},{id:"qbank",icon:"📚",label:"Adaptive Question Vault"},{id:"drills",icon:"⚡",label:"Quantum Calculation Drills"},{id:"errors",icon:"🔴",label:"Error Log (C1–C5)"},{id:"repair",icon:"🔧",label:"Repair Queue"},{id:"retest",icon:"✅",label:"Retest System"},{id:"mockana",icon:"🧪",label:"Mock Analytics"},{id:"schedule",icon:"⏰",label:"Daily Schedule"},{id:"vision",icon:"🚀",label:"Vision & Mission"},{id:"syllabus",icon:"📖",label:"Full Syllabus"},{id:"settings",icon:"⚙️",label:"Settings & Data Export"}];function kt({onNavigate:t}){const{stats:n}=Ie();return e.jsxs("div",{className:"section-pad",children:[e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"var(--gold)",marginBottom:12},children:"CAT 2026 Master Execution & Deep Research Suite"}),e.jsx("div",{className:"grid2",style:{gap:10,marginBottom:12},children:At.map(s=>e.jsxs("div",{className:"hub-tile",onClick:()=>t(s.id),style:{gridColumn:s.featured?"span 2":"span 1",background:s.featured?"linear-gradient(135deg, rgba(245,166,35,0.15) 0%, rgba(26,86,219,0.2) 100%)":void 0,border:s.featured?"1px solid var(--gold)":void 0},children:[e.jsx("div",{style:{fontSize:28},children:s.icon}),e.jsx("div",{className:"hub-tile-label",style:{fontWeight:s.featured?800:600,color:s.featured?"var(--gold)":void 0},children:s.label})]},s.id))}),e.jsx("div",{style:{fontSize:12,fontWeight:700,marginBottom:8},children:"Quick Stats (live from IndexedDB)"}),e.jsx("div",{className:"grid2",children:[{label:"Today's blocks",val:n?`${n.blocksDone}/8`:"--",col:"var(--gold)"},{label:"Errors logged",val:n?`${n.totalErrors}`:"--",col:"var(--red2)"},{label:"Mocks done",val:n?`${n.mocksLogged}`:"--",col:"var(--blue3)"},{label:"Last accuracy",val:n?.lastAccuracy!=null?`${n.lastAccuracy}%`:"--",col:"var(--green2)"},{label:"Repair pending",val:n?`${n.repairPending}`:"--",col:"var(--pink)"},{label:"Retest pending",val:n?`${n.retestPending}`:"--",col:"var(--teal)"}].map(s=>e.jsxs("div",{className:"card-sm",style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:10,color:"var(--muted)"},children:s.label}),e.jsx("div",{style:{fontSize:24,fontWeight:800,color:s.col,fontFamily:"monospace"},children:s.val})]},s.label))})]})}const St=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CAT 2026 — Master Execution Dashboard</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

  :root {
    --navy:   #0D1B2A;
    --navy2:  #1A2E45;
    --blue:   #1A56DB;
    --blue2:  #2563EB;
    --teal:   #0E9F9F;
    --gold:   #F5A623;
    --green:  #16A34A;
    --green2: #22C55E;
    --red:    #DC2626;
    --purple: #7C3AED;
    --orange: #D97706;
    --pink:   #DB2777;
    --qa:     #16A34A;
    --dilr:   #2563EB;
    --varc:   #7C3AED;
    --bg:     #0A0F1E;
    --bg2:    #111827;
    --bg3:    #1F2937;
    --card:   #161D2E;
    --border: #2D3748;
    --text:   #F1F5F9;
    --muted:  #94A3B8;
    --mono:   'JetBrains Mono', monospace;
  }

  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── TOP HEADER ── */
  .header {
    background: linear-gradient(135deg, #0D1B2A 0%, #1A2E45 50%, #0D1B2A 100%);
    border-bottom: 2px solid var(--gold);
    padding: 0;
    position: sticky; top: 0; z-index: 100;
  }
  .header-inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 12px 24px;
    gap: 16px;
  }
  .header-left { display: flex; flex-direction: column; gap: 2px; }
  .header-brand {
    font-size: 22px; font-weight: 900; letter-spacing: -0.5px;
    background: linear-gradient(90deg, #F5A623, #FBBF24, #F5A623);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .header-sub { font-size: 11px; color: var(--muted); font-weight: 500; letter-spacing: 1px; text-transform: uppercase; }
  .header-center { text-align: center; }
  .phase-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #16A34A, #22C55E);
    color: white; padding: 6px 16px; border-radius: 20px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
  }
  .phase-dot { width: 8px; height: 8px; background: white; border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
  .header-right { text-align: right; }
  .countdown-big { font-size: 28px; font-weight: 900; color: var(--gold); font-family: var(--mono); }
  .countdown-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  /* ── MISSION BAR ── */
  .mission-bar {
    background: linear-gradient(90deg, var(--navy), #1e3a5f, var(--navy));
    border-bottom: 1px solid var(--border);
    padding: 10px 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .mission-text { font-size: 13px; color: var(--gold); font-weight: 700; }
  .mission-quote { font-size: 11px; color: var(--muted); font-style: italic; }
  .date-display { font-size: 12px; color: var(--text); font-family: var(--mono); background: var(--bg3); padding: 4px 12px; border-radius: 6px; }

  /* ── MAIN LAYOUT ── */
  .main { padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; max-width: 1400px; margin: 0 auto; }

  /* ── STATS ROW ── */
  .stats-row { display: grid; grid-template-columns: repeat(8,1fr); gap: 10px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 10px; text-align: center;
    transition: transform .2s, border-color .2s; cursor: pointer; position: relative; overflow: hidden;
  }
  .stat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
  }
  .stat-card.qa::before   { background: var(--qa); }
  .stat-card.dilr::before { background: var(--dilr); }
  .stat-card.varc::before { background: var(--varc); }
  .stat-card.test::before { background: var(--orange); }
  .stat-card.ana::before  { background: var(--red); }
  .stat-card.rev::before  { background: var(--purple); }
  .stat-card.rep::before  { background: var(--pink); }
  .stat-card.rts::before  { background: var(--teal); }
  .stat-card:hover { transform: translateY(-2px); border-color: var(--gold); }
  .stat-num { font-size: 11px; font-weight: 800; font-family: var(--mono); }
  .stat-card.qa   .stat-num { color: var(--qa); }
  .stat-card.dilr .stat-num { color: var(--dilr); }
  .stat-card.varc .stat-num { color: var(--varc); }
  .stat-card.test .stat-num { color: var(--orange); }
  .stat-card.ana  .stat-num { color: var(--red); }
  .stat-card.rev  .stat-num { color: var(--purple); }
  .stat-card.rep  .stat-num { color: var(--pink); }
  .stat-card.rts  .stat-num { color: var(--teal); }
  .stat-seq { font-size: 18px; font-weight: 900; color: white; margin: 4px 0; }
  .stat-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }

  /* ── TWO COLUMN ── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* ── SECTION TITLE ── */
  .sec-title {
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--muted); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
  }
  .sec-title::after { content:''; flex:1; height:1px; background: var(--border); }

  /* ── CARD ── */
  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 18px;
  }
  .card-title {
    font-size: 13px; font-weight: 700; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .pill {
    font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .pill-green  { background: rgba(22,163,74,.2);  color: var(--green2); }
  .pill-blue   { background: rgba(37,99,235,.2);  color: #60A5FA; }
  .pill-purple { background: rgba(124,58,237,.2); color: #A78BFA; }
  .pill-gold   { background: rgba(245,166,35,.2); color: var(--gold); }
  .pill-red    { background: rgba(220,38,38,.2);  color: #F87171; }
  .pill-orange { background: rgba(217,119,6,.2);  color: #FCD34D; }

  /* ── TODAY PLAN ── */
  .today-header {
    background: linear-gradient(135deg, #1A2E45, #0D1B2A);
    border: 1px solid var(--gold); border-radius: 12px; padding: 16px 20px;
    margin-bottom: 4px;
  }
  .today-title { font-size: 20px; font-weight: 900; color: var(--gold); }
  .today-sub   { font-size: 13px; color: var(--muted); margin-top: 4px; }

  /* ── BLOCK ITEM ── */
  .block-list { display: flex; flex-direction: column; gap: 10px; }
  .block-item {
    background: var(--bg3); border-radius: 10px; padding: 14px 16px;
    border-left: 4px solid transparent; position: relative;
    display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: start;
    cursor: pointer; transition: background .2s;
  }
  .block-item:hover { background: #2D3748; }
  .block-item.qa-block   { border-left-color: var(--qa); }
  .block-item.dilr-block { border-left-color: var(--dilr); }
  .block-item.varc-block { border-left-color: var(--varc); }
  .block-item.test-block { border-left-color: var(--orange); }
  .block-item.ana-block  { border-left-color: var(--red); }
  .block-item.rev-block  { border-left-color: var(--purple); }
  .block-item.rep-block  { border-left-color: var(--pink); }
  .block-item.rts-block  { border-left-color: var(--teal); }
  .block-num {
    width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; margin-top: 2px;
  }
  .qa-num   { background: rgba(22,163,74,.25);  color: var(--green2); }
  .dilr-num { background: rgba(37,99,235,.25);  color: #60A5FA; }
  .varc-num { background: rgba(124,58,237,.25); color: #A78BFA; }
  .test-num { background: rgba(217,119,6,.25);  color: #FCD34D; }
  .ana-num  { background: rgba(220,38,38,.25);  color: #F87171; }
  .rev-num  { background: rgba(124,58,237,.25); color: #C4B5FD; }
  .rep-num  { background: rgba(219,39,119,.25); color: #F9A8D4; }
  .rts-num  { background: rgba(14,159,159,.25); color: #5EEAD4; }
  .block-content { flex: 1; }
  .block-section { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .qa-text   { color: var(--green2); }
  .dilr-text { color: #60A5FA; }
  .varc-text { color: #A78BFA; }
  .test-text { color: #FCD34D; }
  .ana-text  { color: #F87171; }
  .rev-text  { color: #C4B5FD; }
  .rep-text  { color: #F9A8D4; }
  .rts-text  { color: #5EEAD4; }
  .block-title { font-size: 14px; font-weight: 700; color: white; margin-bottom: 6px; }
  .block-details { font-size: 12px; color: var(--muted); line-height: 1.6; }
  .block-details strong { color: var(--text); }
  .block-meta { text-align: right; flex-shrink: 0; }
  .meta-time { font-size: 11px; color: var(--muted); font-family: var(--mono); }
  .meta-target { font-size: 11px; font-weight: 600; color: var(--gold); margin-top: 4px; }
  .block-check {
    width: 24px; height: 24px; border: 2px solid var(--border); border-radius: 6px;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: all .2s; flex-shrink: 0; margin-top: 4px;
  }
  .block-check:hover { border-color: var(--green2); }
  .block-check.done { background: var(--green); border-color: var(--green); }
  .block-check.done::after { content: '✓'; color: white; font-size: 13px; font-weight: 700; }
  .block-item.completed { opacity: .6; }
  .block-item.completed .block-title { text-decoration: line-through; }

  /* ── SUBJECT PRIORITIES ── */
  .priority-list { display: flex; flex-direction: column; gap: 8px; }
  .priority-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: var(--bg3); border-radius: 8px;
  }
  .priority-rank {
    font-size: 12px; font-weight: 800; font-family: var(--mono);
    width: 24px; text-align: center;
  }
  .priority-name { font-size: 13px; font-weight: 600; flex: 1; }
  .stars { display: flex; gap: 2px; }
  .star { font-size: 12px; }
  .star.filled { color: var(--gold); }
  .star.empty  { color: var(--border); }
  .mastery-badge {
    font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 8px;
    font-family: var(--mono);
  }
  .l0 { background: rgba(75,85,99,.3);  color: #9CA3AF; }
  .l1 { background: rgba(220,38,38,.2); color: #F87171; }
  .l2 { background: rgba(217,119,6,.2); color: #FCD34D; }
  .l3 { background: rgba(59,130,246,.2);color: #93C5FD; }
  .l4 { background: rgba(16,185,129,.2);color: #6EE7B7; }
  .l5 { background: rgba(245,166,35,.3);color: var(--gold); }

  /* ── WEEK CALENDAR ── */
  .week-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 8px; }
  .day-card {
    background: var(--bg3); border-radius: 10px; padding: 10px 8px;
    border: 1px solid var(--border); text-align: center;
    transition: all .2s; cursor: pointer;
  }
  .day-card.today { border-color: var(--gold); background: rgba(245,166,35,.08); }
  .day-card.past  { opacity: .5; }
  .day-card:hover { border-color: var(--blue2); }
  .day-name   { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-weight: 600; }
  .day-date   { font-size: 18px; font-weight: 800; color: white; margin: 4px 0; }
  .day-card.today .day-date { color: var(--gold); }
  .day-focus  { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; padding: 2px 0; }
  .day-topics { margin-top: 6px; display: flex; flex-direction: column; gap: 3px; }
  .day-topic  { font-size: 8.5px; color: var(--muted); background: var(--bg2); border-radius: 4px; padding: 2px 4px; }

  /* ── MASTERY TRACKER ── */
  .mastery-track { display: flex; flex-direction: column; gap: 8px; }
  .mastery-row { display: grid; grid-template-columns: 120px 1fr 50px; gap: 10px; align-items: center; }
  .mastery-name { font-size: 11px; font-weight: 600; color: var(--text); }
  .mastery-bar-wrap { background: var(--bg3); border-radius: 4px; height: 8px; overflow: hidden; }
  .mastery-bar { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .mastery-level { font-size: 10px; font-weight: 700; font-family: var(--mono); text-align: right; }

  /* ── ERROR LOG ── */
  .error-types { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; margin-bottom: 14px; }
  .error-card {
    border-radius: 8px; padding: 10px 8px; text-align: center;
    border: 1px solid var(--border); cursor: pointer; transition: all .2s;
  }
  .error-card:hover { transform: scale(1.05); }
  .c1 { background: rgba(220,38,38,.1);   border-color: rgba(220,38,38,.3); }
  .c2 { background: rgba(217,119,6,.1);   border-color: rgba(217,119,6,.3); }
  .c3 { background: rgba(37,99,235,.1);   border-color: rgba(37,99,235,.3); }
  .c4 { background: rgba(124,58,237,.1);  border-color: rgba(124,58,237,.3); }
  .c5 { background: rgba(219,39,119,.1);  border-color: rgba(219,39,119,.3); }
  .error-code  { font-size: 16px; font-weight: 900; font-family: var(--mono); }
  .c1 .error-code { color: #F87171; }
  .c2 .error-code { color: #FCD34D; }
  .c3 .error-code { color: #93C5FD; }
  .c4 .error-code { color: #A78BFA; }
  .c5 .error-code { color: #F9A8D4; }
  .error-name  { font-size: 8px; color: var(--muted); margin-top: 2px; }
  .error-count { font-size: 13px; font-weight: 800; color: white; margin-top: 4px; }

  /* ── DAILY SCORECARD INPUT ── */
  .scorecard { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .score-input-wrap { display: flex; flex-direction: column; gap: 4px; }
  .score-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; font-weight: 600; }
  .score-input {
    background: var(--bg3); border: 1px solid var(--border); color: white;
    border-radius: 8px; padding: 10px 12px; font-size: 16px; font-weight: 700;
    font-family: var(--mono); width: 100%; text-align: center;
    transition: border-color .2s;
  }
  .score-input:focus { outline: none; border-color: var(--gold); }
  .score-btn {
    grid-column: 1/-1; background: linear-gradient(135deg, var(--blue), var(--blue2));
    border: none; color: white; padding: 12px; border-radius: 8px;
    font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: .5px;
    text-transform: uppercase; transition: opacity .2s;
  }
  .score-btn:hover { opacity: .85; }
  .done-feedback {
    display: none; background: rgba(22,163,74,.1); border: 1px solid var(--green);
    border-radius: 8px; padding: 12px; text-align: center;
    font-size: 13px; font-weight: 600; color: var(--green2); margin-top: 10px;
  }

  /* ── MASTRY LOOP FLOW ── */
  .flow-wrap { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
  .flow-step {
    padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .flow-arrow { color: var(--muted); font-size: 12px; }
  .flow-active { background: var(--gold); color: var(--navy); }
  .flow-done   { background: rgba(22,163,74,.2); color: var(--green2); border: 1px solid rgba(22,163,74,.3); }
  .flow-next   { background: var(--bg3); color: var(--muted); border: 1px solid var(--border); }

  /* ── PHASE TIMELINE ── */
  .phase-timeline { display: grid; grid-template-columns: repeat(5,1fr); gap: 6px; }
  .phase-item { border-radius: 8px; padding: 10px 8px; text-align: center; border: 1px solid var(--border); }
  .phase-item.active { border-color: var(--green2); background: rgba(34,197,94,.08); }
  .phase-item.future { opacity: .5; }
  .phase-name  { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
  .phase-dates { font-size: 8px; color: var(--muted); }
  .phase-goal  { font-size: 8px; color: var(--muted); margin-top: 4px; }

  /* ── MANTRA ── */
  .mantra-bar {
    background: linear-gradient(135deg, var(--navy2), #1A2E45);
    border: 1px solid rgba(245,166,35,.3); border-radius: 12px;
    padding: 16px 24px; text-align: center;
  }
  .mantra-text { font-size: 16px; font-weight: 800; color: var(--gold); letter-spacing: .5px; }
  .mantra-sub  { font-size: 11px; color: var(--muted); margin-top: 6px; }

  /* ── DONTS ── */
  .dont-list { display: flex; flex-direction: column; gap: 6px; }
  .dont-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
  .dont-item .x { color: var(--red); font-weight: 700; font-size: 14px; }

  /* ── PROGRESS RING ── */
  .ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .ring-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }
  .rings-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }

  /* ── INSTRUCTION CARD ── */
  .instruction {
    background: rgba(245,166,35,.06); border: 1px solid rgba(245,166,35,.2);
    border-radius: 10px; padding: 14px 16px;
  }
  .instruction p { font-size: 12px; color: var(--muted); line-height: 1.7; }
  .instruction strong { color: var(--gold); }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .w100 { width: 100%; }
  .mt8  { margin-top: 8px; }
  .mt16 { margin-top: 16px; }
  .gap-4 { display: flex; flex-direction: column; gap: 4px; }
</style>
</head>
<body>

<!-- ── HEADER ── -->
<div class="header">
  <div class="header-inner">
    <div class="header-left">
      <div class="header-brand">CAT 2026</div>
      <div class="header-sub">Master Execution Dashboard</div>
    </div>
    <div class="header-center">
      <div class="phase-badge">
        <div class="phase-dot"></div>
        PHASE 1 — REBUILD — LOCKED
      </div>
      <div style="margin-top:6px; font-size:12px; color:var(--muted);">Week 2 &nbsp;|&nbsp; 7–13 September 2026</div>
    </div>
    <div class="header-right">
      <div class="countdown-big" id="countdown">--</div>
      <div class="countdown-label">days to CAT 2026</div>
    </div>
  </div>
</div>

<!-- ── MISSION BAR ── -->
<div class="mission-bar">
  <div class="mission-text">🎯 MISSION: Build Accuracy Before Speed &nbsp;|&nbsp; 99+ Percentile — No Ceiling</div>
  <div class="date-display" id="live-date">Tuesday, 8 September 2026</div>
  <div class="mission-quote">"Discipline Today Builds the Freedom Tomorrow"</div>
</div>

<!-- ── MAIN ── -->
<div class="main">

  <!-- DAILY SEQUENCE STRIP -->
  <div class="stats-row">
    <div class="stat-card qa"   onclick="toggleBlock(0)">
      <div class="stat-num">01</div>
      <div class="stat-seq">QA</div>
      <div class="stat-label">Quantitative</div>
    </div>
    <div class="stat-card dilr" onclick="toggleBlock(1)">
      <div class="stat-num">02</div>
      <div class="stat-seq">DILR</div>
      <div class="stat-label">Data + Logic</div>
    </div>
    <div class="stat-card varc" onclick="toggleBlock(2)">
      <div class="stat-num">03</div>
      <div class="stat-seq">VARC</div>
      <div class="stat-label">Verbal + RC</div>
    </div>
    <div class="stat-card test" onclick="toggleBlock(3)">
      <div class="stat-num">04</div>
      <div class="stat-seq">TEST</div>
      <div class="stat-label">Sectional</div>
    </div>
    <div class="stat-card ana"  onclick="toggleBlock(4)">
      <div class="stat-num">05</div>
      <div class="stat-seq">ANALYSIS</div>
      <div class="stat-label">Error Log</div>
    </div>
    <div class="stat-card rev"  onclick="toggleBlock(5)">
      <div class="stat-num">06</div>
      <div class="stat-seq">REVISION</div>
      <div class="stat-label">Formula + RC</div>
    </div>
    <div class="stat-card rep"  onclick="toggleBlock(6)">
      <div class="stat-num">07</div>
      <div class="stat-seq">REPAIR</div>
      <div class="stat-label">Wrong Qs</div>
    </div>
    <div class="stat-card rts"  onclick="toggleBlock(7)">
      <div class="stat-num">08</div>
      <div class="stat-seq">RETEST</div>
      <div class="stat-label">Confirm</div>
    </div>
  </div>

  <!-- TODAY PLAN + WEEK CALENDAR -->
  <div class="two-col">

    <!-- TODAY'S EXACT PLAN -->
    <div>
      <div class="today-header">
        <div class="today-title">📅 TUESDAY — 8 SEPTEMBER 2026</div>
        <div class="today-sub">Focus: SOLVING &nbsp;|&nbsp; Ratio &amp; Proportion + Main Idea + Bar Graph &nbsp;|&nbsp; Phase 1 Week 2</div>
      </div>

      <div class="block-list" id="block-list">

        <div class="block-item qa-block" id="block-0">
          <div class="block-check" id="check-0" onclick="markDone(0)"></div>
          <div class="block-num qa-num">1</div>
          <div class="block-content">
            <div class="block-section qa-text">QA — Quantitative Aptitude</div>
            <div class="block-title">Ratio &amp; Proportion — Foundation</div>
            <div class="block-details">
              <strong>Topic:</strong> Ratio basics → part-to-part, part-to-whole → proportional division<br>
              <strong>Task:</strong> 15–20 questions, Easy → Moderate<br>
              <strong>Method:</strong> Concept first (5 min) → 3 basic Qs → 10 moderate Qs → 2 CAT-style Qs<br>
              <strong>Trap:</strong> Don't mix part:part with part:whole ratios<br>
              <strong>Exit:</strong> 70%+ accuracy on 15 Qs
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">09:00–10:30</div>
            <div class="meta-target">90 min</div>
            <div class="meta-target">70%+ acc</div>
          </div>
        </div>

        <div class="block-item dilr-block" id="block-1">
          <div class="block-check" id="check-1" onclick="markDone(1)"></div>
          <div class="block-num dilr-num">2</div>
          <div class="block-content">
            <div class="block-section dilr-text">DILR — Data Interpretation</div>
            <div class="block-title">Bar Graph / Line Graph Set</div>
            <div class="block-details">
              <strong>Task:</strong> 1 quality Bar or Line Graph set (4–6 questions)<br>
              <strong>Flow:</strong> Read → Identify variables → Extract data → Solve → Verify<br>
              <strong>Focus:</strong> Accuracy first — skip if stuck beyond 8 min<br>
              <strong>2nd set:</strong> ONLY if first set fully analysed<br>
              <strong>Exit:</strong> 3+ correct answers with method explained
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">10:45–12:00</div>
            <div class="meta-target">75 min</div>
            <div class="meta-target">1–2 sets</div>
          </div>
        </div>

        <div class="block-item varc-block" id="block-2">
          <div class="block-check" id="check-2" onclick="markDone(2)"></div>
          <div class="block-num varc-num">3</div>
          <div class="block-content">
            <div class="block-section varc-text">VARC — Reading Comprehension</div>
            <div class="block-title">Main Idea + Inference — 2 RC Passages</div>
            <div class="block-details">
              <strong>Task:</strong> 2 RC passages, 3 questions each<br>
              <strong>Flow:</strong> Read → Understand structure → Identify argument → Predict → Eliminate<br>
              <strong>Focus:</strong> Main Idea Q first, then Inference — accuracy &gt; speed<br>
              <strong>After each passage:</strong> Write 1-line summary of author's main point<br>
              <strong>Exit:</strong> 4+ correct across 6 questions
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">12:15–13:15</div>
            <div class="meta-target">60 min</div>
            <div class="meta-target">4/6 correct</div>
          </div>
        </div>

        <div class="block-item test-block" id="block-3">
          <div class="block-check" id="check-3" onclick="markDone(3)"></div>
          <div class="block-num test-num">4</div>
          <div class="block-content">
            <div class="block-section test-text">TEST — Library Deep Work Block</div>
            <div class="block-title">Repair Monday's Errors + Pending Work</div>
            <div class="block-details">
              <strong>Task:</strong> Review Monday error log → fix every C1–C5 mistake<br>
              <strong>QA pending:</strong> Any Percentage Qs still wrong from Day 1<br>
              <strong>DILR pending:</strong> Any Tables questions not fully understood<br>
              <strong>Rule:</strong> No random resources — only your error log material<br>
              <strong>Exit:</strong> Every Monday error re-solved correctly
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">13:15–17:00</div>
            <div class="meta-target">Deep Work</div>
            <div class="meta-target">0 pending</div>
          </div>
        </div>

        <div class="block-item ana-block" id="block-4">
          <div class="block-check" id="check-4" onclick="markDone(4)"></div>
          <div class="block-num ana-num">5</div>
          <div class="block-content">
            <div class="block-section ana-text">ANALYSIS — Error Log Update</div>
            <div class="block-title">Classify Every Mistake Today: C1–C5</div>
            <div class="block-details">
              <strong>C1</strong> = Concept gap &nbsp;|&nbsp; <strong>C2</strong> = Calculation error &nbsp;|&nbsp; <strong>C3</strong> = Misread<br>
              <strong>C4</strong> = Wrong approach &nbsp;|&nbsp; <strong>C5</strong> = Time management<br>
              <strong>For each mistake:</strong> Why it happened → Correct method → Prevention rule<br>
              <strong>Do NOT say "careless"</strong> — name the exact problem<br>
              <strong>Exit:</strong> Every wrong Q classified + prevention rule written
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">21:00–21:45</div>
            <div class="meta-target">45 min</div>
            <div class="meta-target">100% logged</div>
          </div>
        </div>

        <div class="block-item rev-block" id="block-5">
          <div class="block-check" id="check-5" onclick="markDone(5)"></div>
          <div class="block-num rev-num">6</div>
          <div class="block-content">
            <div class="block-section rev-text">REVISION — Formula + Concept Recap</div>
            <div class="block-title">Ratio Rules + RC Main Idea Method</div>
            <div class="block-details">
              <strong>30-sec recap:</strong> What did I learn today?<br>
              <strong>2-min revision:</strong> Ratio formula → trap → today's biggest mistake<br>
              <strong>Connection:</strong> How Ratio links to Percentage (taught Monday)<br>
              <strong>Preview:</strong> Tomorrow = Averages (connects to Ratio &amp; %) <br>
              <strong>Exit:</strong> Can recite Ratio core method in 30 seconds
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">21:45–22:00</div>
            <div class="meta-target">15 min</div>
            <div class="meta-target">Fluent recall</div>
          </div>
        </div>

        <div class="block-item rep-block" id="block-6">
          <div class="block-check" id="check-6" onclick="markDone(6)"></div>
          <div class="block-num rep-num">7</div>
          <div class="block-content">
            <div class="block-section rep-text">REPAIR — Fix Weak Points</div>
            <div class="block-title">Re-solve Every Wrong Question</div>
            <div class="block-details">
              <strong>Source:</strong> Today's error log + Monday's unresolved errors<br>
              <strong>Method:</strong> Close solution → think fresh → attempt alone → verify<br>
              <strong>If still wrong:</strong> Mark as C1 → schedule concept review tomorrow<br>
              <strong>Goal:</strong> Convert every mistake into a solved understanding<br>
              <strong>Exit:</strong> Re-solved 100% of logged errors
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">Library block</div>
            <div class="meta-target">Ongoing</div>
            <div class="meta-target">0 unresolved</div>
          </div>
        </div>

        <div class="block-item rts-block" id="block-7">
          <div class="block-check" id="check-7" onclick="markDone(7)"></div>
          <div class="block-num rts-num">8</div>
          <div class="block-content">
            <div class="block-section rts-text">RETEST — Confirm Mastery</div>
            <div class="block-title">Take 3–5 Fresh Questions on Today's Topics</div>
            <div class="block-details">
              <strong>Ratio &amp; Proportion:</strong> 3 new questions (no looking at notes)<br>
              <strong>RC Main Idea:</strong> 1 fresh passage question<br>
              <strong>Verification:</strong> Got it right = progressing &nbsp;|&nbsp; Wrong again = C1, repair tomorrow<br>
              <strong>Mastery check:</strong> Can I solve it, explain it, solve under time?<br>
              <strong>Exit:</strong> 3+/5 correct = today's learning confirmed
            </div>
          </div>
          <div class="block-meta">
            <div class="meta-time">End of day</div>
            <div class="meta-target">5 Qs</div>
            <div class="meta-target">3/5 minimum</div>
          </div>
        </div>

      </div><!-- end block-list -->

      <!-- Progress -->
      <div style="margin-top:14px; background:var(--bg3); border-radius:10px; padding:12px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:12px; font-weight:700; color:var(--text);">Today's Progress</span>
          <span style="font-size:12px; font-family:var(--mono); color:var(--gold);" id="progress-text">0 / 8 blocks done</span>
        </div>
        <div style="background:var(--bg2); border-radius:4px; height:8px; overflow:hidden;">
          <div id="progress-bar" style="height:100%; background:linear-gradient(90deg,var(--green),var(--green2)); width:0%; transition:width .5s ease; border-radius:4px;"></div>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN: WEEK + PRIORITIES + SCORECARD -->
    <div style="display:flex; flex-direction:column; gap:16px;">

      <!-- WEEK CALENDAR -->
      <div class="card">
        <div class="card-title">📅 Week 2 — 7 to 13 September</div>
        <div class="week-grid">
          <div class="day-card past">
            <div class="day-name">MON</div>
            <div class="day-date">7</div>
            <div class="day-focus" style="color:var(--green2)">BASICS</div>
            <div class="day-topics">
              <div class="day-topic">Percentage</div>
              <div class="day-topic">Tables set</div>
              <div class="day-topic">2 RC</div>
            </div>
          </div>
          <div class="day-card today">
            <div class="day-name">TUE</div>
            <div class="day-date">8</div>
            <div class="day-focus" style="color:var(--gold)">TODAY</div>
            <div class="day-topics">
              <div class="day-topic">Ratio &amp; Prop</div>
              <div class="day-topic">Bar/Line Graph</div>
              <div class="day-topic">Main Idea</div>
            </div>
          </div>
          <div class="day-card">
            <div class="day-name">WED</div>
            <div class="day-date">9</div>
            <div class="day-focus" style="color:var(--blue2)">ACCURACY</div>
            <div class="day-topics">
              <div class="day-topic">Averages</div>
              <div class="day-topic">Arrangement</div>
              <div class="day-topic">Tone/Purpose</div>
            </div>
          </div>
          <div class="day-card">
            <div class="day-name">THU</div>
            <div class="day-date">10</div>
            <div class="day-focus" style="color:var(--red)">ANALYSIS</div>
            <div class="day-topics">
              <div class="day-topic">P&amp;L / Discount</div>
              <div class="day-topic">Distribution</div>
              <div class="day-topic">Elimination</div>
            </div>
          </div>
          <div class="day-card">
            <div class="day-name">FRI</div>
            <div class="day-date">11</div>
            <div class="day-focus" style="color:var(--orange)">TIMING</div>
            <div class="day-topics">
              <div class="day-topic">Mixed Arith</div>
              <div class="day-topic">Mixed Set</div>
              <div class="day-topic">Difficult RC</div>
            </div>
          </div>
          <div class="day-card">
            <div class="day-name">SAT</div>
            <div class="day-date">12</div>
            <div class="day-focus" style="color:var(--purple)">IMPROVE</div>
            <div class="day-topics">
              <div class="day-topic">Weak repair</div>
              <div class="day-topic">Best 2 sets</div>
              <div class="day-topic">Mixed RC+VA</div>
            </div>
          </div>
          <div class="day-card" style="background:rgba(124,58,237,.08); border-color:rgba(124,58,237,.4);">
            <div class="day-name">SUN</div>
            <div class="day-date">13</div>
            <div class="day-focus" style="color:var(--purple)">TEST DAY</div>
            <div class="day-topics">
              <div class="day-topic">Weekly Mock</div>
              <div class="day-topic">Full Analysis</div>
              <div class="day-topic">C1–C5 Log</div>
            </div>
          </div>
        </div>
        <div style="margin-top:12px; padding:10px 12px; background:rgba(245,166,35,.06); border:1px solid rgba(245,166,35,.2); border-radius:8px;">
          <div style="font-size:11px; font-weight:700; color:var(--gold); margin-bottom:6px;">WEEKLY EXIT GATE</div>
          <div style="font-size:11px; color:var(--muted); line-height:1.7;">
            ✓ Percentage + Ratio + Average + P&L concepts clear<br>
            ✓ 2 DILR sets per day attempted + analysed<br>
            ✓ Main Idea + Inference + Tone — 70%+ accuracy<br>
            ✓ Error log complete for every day<br>
            ✓ Sunday mock taken + fully analysed
          </div>
        </div>
      </div>

      <!-- SUBJECT PRIORITIES THIS WEEK -->
      <div class="three-col">
        <div class="card">
          <div class="card-title" style="font-size:12px;">
            <span style="color:var(--green2)">QA</span>
            <span class="pill pill-green">Week 2</span>
          </div>
          <div class="priority-list">
            <div class="priority-item">
              <div class="priority-rank" style="color:var(--green2)">1</div>
              <div class="priority-name" style="font-size:11px;">Ratio &amp; Proportion</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:var(--green2)">2</div>
              <div class="priority-name" style="font-size:11px;">Averages</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:var(--green2)">3</div>
              <div class="priority-name" style="font-size:11px;">Profit &amp; Loss</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:var(--green2)">4</div>
              <div class="priority-name" style="font-size:11px;">TSD / T&amp;W</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span></div>
            </div>
          </div>
          <div style="margin-top:10px; font-size:10px; color:var(--gold); font-weight:700; text-align:center; padding:6px; background:rgba(22,163,74,.1); border-radius:6px;">
            Arithmetic + Algebra = 72% of QA
          </div>
        </div>

        <div class="card">
          <div class="card-title" style="font-size:12px;">
            <span style="color:#60A5FA">DILR</span>
            <span class="pill pill-blue">Week 2</span>
          </div>
          <div class="priority-list">
            <div class="priority-item">
              <div class="priority-rank" style="color:#60A5FA">1</div>
              <div class="priority-name" style="font-size:11px;">Tables / Charts</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:#60A5FA">2</div>
              <div class="priority-name" style="font-size:11px;">Arrangements</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:#60A5FA">3</div>
              <div class="priority-name" style="font-size:11px;">Distrib/Selection</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:#60A5FA">4</div>
              <div class="priority-name" style="font-size:11px;">Bar / Line Graphs</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span></div>
            </div>
          </div>
          <div style="margin-top:10px; font-size:10px; color:var(--gold); font-weight:700; text-align:center; padding:6px; background:rgba(37,99,235,.1); border-radius:6px;">
            Set Selection = Key to Score
          </div>
        </div>

        <div class="card">
          <div class="card-title" style="font-size:12px;">
            <span style="color:#A78BFA">VARC</span>
            <span class="pill pill-purple">Week 2</span>
          </div>
          <div class="priority-list">
            <div class="priority-item">
              <div class="priority-rank" style="color:#A78BFA">1</div>
              <div class="priority-name" style="font-size:11px;">Main Idea</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:#A78BFA">2</div>
              <div class="priority-name" style="font-size:11px;">Inference</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star filled">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:#A78BFA">3</div>
              <div class="priority-name" style="font-size:11px;">Tone / Purpose</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span></div>
            </div>
            <div class="priority-item">
              <div class="priority-rank" style="color:#A78BFA">4</div>
              <div class="priority-name" style="font-size:11px;">Elimination</div>
              <div class="stars"><span class="star filled">★</span><span class="star filled">★</span><span class="star empty">★</span></div>
            </div>
          </div>
          <div style="margin-top:10px; font-size:10px; color:var(--gold); font-weight:700; text-align:center; padding:6px; background:rgba(124,58,237,.1); border-radius:6px;">
            RC = 70%+ | VA = 30%
          </div>
        </div>
      </div>

      <!-- DAILY SCORECARD INPUT -->
      <div class="card">
        <div class="card-title">📊 Daily Update — DONE format</div>
        <div class="instruction" style="margin-bottom:12px;">
          <p>Type your day's data and I'll adapt tomorrow's plan. Format: <strong>DONE [study hrs] [screen hrs] [accuracy%]</strong><br>
          Example: <strong>DONE 5 3 62</strong> = 5 study hours, 3 screen hours, 62% accuracy</p>
        </div>
        <div class="scorecard">
          <div class="score-input-wrap">
            <div class="score-label">Study Hours</div>
            <input class="score-input" type="number" id="inp-study" placeholder="5" min="0" max="12">
          </div>
          <div class="score-input-wrap">
            <div class="score-label">Screen Hours</div>
            <input class="score-input" type="number" id="inp-screen" placeholder="3" min="0" max="12">
          </div>
          <div class="score-input-wrap">
            <div class="score-label">Accuracy %</div>
            <input class="score-input" type="number" id="inp-acc" placeholder="62" min="0" max="100">
          </div>
          <button class="score-btn" onclick="submitDone()">✓ LOG TODAY — DONE</button>
        </div>
        <div class="done-feedback" id="done-feedback"></div>
      </div>

    </div><!-- end right col -->
  </div><!-- end two-col -->

  <!-- MASTERY + PHASE + ERRORS ROW -->
  <div class="two-col">

    <!-- MASTERY TRACKER -->
    <div class="card">
      <div class="card-title">📈 Mastery Tracker — Current Level (Week 2)</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div>
          <div style="font-size:11px; font-weight:700; color:var(--green2); margin-bottom:10px; text-transform:uppercase; letter-spacing:.5px;">QA Progress</div>
          <div class="mastery-track">
            <div class="mastery-row">
              <div class="mastery-name">Percentages</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:60%; background:var(--green);"></div></div>
              <div class="mastery-level l3" style="font-size:10px; font-weight:700; color:#6EE7B7; font-family:var(--mono);">L3</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">Ratio &amp; Prop</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:20%; background:var(--orange);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#FCD34D; font-family:var(--mono);">L1→</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">Averages</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:5%; background:var(--red);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#F87171; font-family:var(--mono);">L0</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">Profit &amp; Loss</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:5%; background:var(--red);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#F87171; font-family:var(--mono);">L0</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">TSD / T&amp;W</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:5%; background:var(--red);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#F87171; font-family:var(--mono);">L0</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">SI / CI</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:5%; background:var(--red);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#F87171; font-family:var(--mono);">L0</div>
            </div>
          </div>
        </div>
        <div>
          <div style="font-size:11px; font-weight:700; color:#60A5FA; margin-bottom:10px; text-transform:uppercase; letter-spacing:.5px;">DILR + VARC</div>
          <div class="mastery-track">
            <div class="mastery-row">
              <div class="mastery-name">Tables</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:40%; background:var(--blue2);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#93C5FD; font-family:var(--mono);">L2</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">Bar/Line Graph</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:20%; background:var(--orange);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#FCD34D; font-family:var(--mono);">L1→</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">Arrangements</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:5%; background:var(--red);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#F87171; font-family:var(--mono);">L0</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">RC Main Idea</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:40%; background:var(--purple);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#A78BFA; font-family:var(--mono);">L2</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">RC Inference</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:20%; background:var(--orange);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#FCD34D; font-family:var(--mono);">L1→</div>
            </div>
            <div class="mastery-row">
              <div class="mastery-name">RC Tone</div>
              <div class="mastery-bar-wrap"><div class="mastery-bar" style="width:5%; background:var(--red);"></div></div>
              <div class="mastery-level" style="font-size:10px; font-weight:700; color:#F87171; font-family:var(--mono);">L0</div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top:14px; padding:10px 12px; background:var(--bg3); border-radius:8px;">
        <div style="font-size:11px; font-weight:700; color:var(--text); margin-bottom:6px;">MASTERY SCALE</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <span class="mastery-badge l0">L0 Don't Know</span>
          <span class="mastery-badge l1">L1 Understand</span>
          <span class="mastery-badge l2">L2 Guided</span>
          <span class="mastery-badge l3">L3 Independent</span>
          <span class="mastery-badge l4">L4 Under Time</span>
          <span class="mastery-badge l5">L5 CAT Level</span>
        </div>
      </div>
    </div>

    <!-- ERROR LOG + PHASE TIMELINE -->
    <div style="display:flex; flex-direction:column; gap:16px;">

      <!-- ERROR LOG -->
      <div class="card">
        <div class="card-title">🔴 Error Log System — C1 to C5</div>
        <div class="error-types">
          <div class="error-card c1" onclick="logError('C1')">
            <div class="error-code">C1</div>
            <div class="error-name">Concept Gap</div>
            <div class="error-count" id="c1-count">0</div>
          </div>
          <div class="error-card c2" onclick="logError('C2')">
            <div class="error-code">C2</div>
            <div class="error-name">Calculation</div>
            <div class="error-count" id="c2-count">0</div>
          </div>
          <div class="error-card c3" onclick="logError('C3')">
            <div class="error-code">C3</div>
            <div class="error-name">Misread Data</div>
            <div class="error-count" id="c3-count">0</div>
          </div>
          <div class="error-card c4" onclick="logError('C4')">
            <div class="error-code">C4</div>
            <div class="error-name">Wrong Approach</div>
            <div class="error-count" id="c4-count">0</div>
          </div>
          <div class="error-card c5" onclick="logError('C5')">
            <div class="error-code">C5</div>
            <div class="error-name">Time Mgmt</div>
            <div class="error-count" id="c5-count">0</div>
          </div>
        </div>
        <div style="font-size:10px; color:var(--muted); text-align:center; margin-bottom:10px;">Click to count errors → C1 is most dangerous (concept gap)</div>
        <div style="background:var(--bg3); border-radius:8px; padding:10px 12px;">
          <div style="font-size:11px; font-weight:700; color:var(--text); margin-bottom:6px;">Analysis Flow</div>
          <div style="font-size:11px; color:var(--muted); line-height:1.8;">
            WHY it happened → FIX (strategy/notes) → REPAIR (practice) → RETEST (confirm)
          </div>
        </div>
        <button onclick="resetErrors()" style="margin-top:10px; width:100%; background:transparent; border:1px solid var(--border); color:var(--muted); padding:8px; border-radius:6px; font-size:11px; cursor:pointer;">Reset Error Counts</button>
      </div>

      <!-- PHASE TIMELINE -->
      <div class="card">
        <div class="card-title">🗺️ Phase Timeline — 86 Days</div>
        <div class="phase-timeline">
          <div class="phase-item active">
            <div class="phase-name" style="color:var(--green2)">REBUILD</div>
            <div class="phase-dates">1–15 Sep</div>
            <div class="phase-goal">Concept + Accuracy</div>
          </div>
          <div class="phase-item future">
            <div class="phase-name" style="color:#60A5FA">APPLICATION</div>
            <div class="phase-dates">16 Sep–4 Oct</div>
            <div class="phase-goal">Timed + PYQs</div>
          </div>
          <div class="phase-item future">
            <div class="phase-name" style="color:#F87171">MOCKS</div>
            <div class="phase-dates">5 Oct–8 Nov</div>
            <div class="phase-goal">Mocks + Repair</div>
          </div>
          <div class="phase-item future">
            <div class="phase-name" style="color:#A78BFA">CONSOL.</div>
            <div class="phase-dates">9–20 Nov</div>
            <div class="phase-goal">Revision + PYQs</div>
          </div>
          <div class="phase-item future">
            <div class="phase-name" style="color:var(--gold)">TAPER</div>
            <div class="phase-dates">21–28 Nov</div>
            <div class="phase-goal">Readiness</div>
          </div>
        </div>
        <div style="margin-top:12px; background:rgba(34,197,94,.06); border:1px solid rgba(34,197,94,.2); border-radius:8px; padding:10px 12px;">
          <div style="font-size:10px; font-weight:700; color:var(--green2); margin-bottom:4px;">🔒 PHASE ORDER IS LOCKED</div>
          <div style="font-size:10px; color:var(--muted);">Only weak-area priority, practice volume, and time allocation may adapt. Never redesign because of one bad day.</div>
        </div>
      </div>

      <!-- DON'TS -->
      <div class="card" style="border-color:rgba(220,38,38,.3);">
        <div class="card-title" style="color:var(--red)">🚫 NO RANDOM CHANGES</div>
        <div class="dont-list">
          <div class="dont-item"><span class="x">✗</span> No new books this week</div>
          <div class="dont-item"><span class="x">✗</span> No new strategy every week</div>
          <div class="dont-item"><span class="x">✗</span> No unnecessary resources</div>
          <div class="dont-item"><span class="x">✗</span> No mock without analysis</div>
          <div class="dont-item"><span class="x">✗</span> No comparison with others</div>
          <div class="dont-item"><span class="x">✗</span> No "careless mistake" excuse</div>
        </div>
      </div>
    </div>
  </div>

  <!-- MASTER LOOP -->
  <div class="card">
    <div class="card-title">♾️ Master Learning Loop — Every Topic Must Complete This</div>
    <div class="flow-wrap">
      <span class="flow-step flow-done">CONCEPT</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-done">BASIC</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-active">INTERMEDIATE</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">CAT / PYQ</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">TIMED</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">MIXED</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">TEST</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">ANALYSIS</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">REPAIR</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">RETEST</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step flow-next">RECALL</span>
      <span class="flow-arrow">→</span>
      <span class="flow-step" style="background:linear-gradient(135deg,var(--gold),#FBBF24); color:var(--navy); font-weight:900;">MASTERY 🏆</span>
    </div>
    <div style="margin-top:10px; font-size:11px; color:var(--red); font-weight:700;">
      A lecture watched ≠ Mastery &nbsp;|&nbsp; A chapter completed ≠ Mastery &nbsp;|&nbsp; A large question count ≠ Mastery
    </div>
  </div>

  <!-- MANTRA -->
  <div class="mantra-bar">
    <div class="mantra-text">"Discipline Today → Dream College Tomorrow → Bigger Impact in Future"</div>
    <div class="mantra-sub">BECOME THE MAN YOU PROMISE YOURSELF &nbsp;|&nbsp; CAT 2026 &nbsp;|&nbsp; 29 November 2026 &nbsp;|&nbsp; Radhe Radhe 🙏</div>
  </div>

</div><!-- end main -->

<script>
  // ── COUNTDOWN ──
  function updateCountdown() {
    const exam = new Date('2026-11-29T00:00:00');
    const now  = new Date();
    const diff = Math.ceil((exam - now) / (1000*60*60*24));
    document.getElementById('countdown').textContent = diff;
  }
  updateCountdown();
  setInterval(updateCountdown, 60000);

  // ── DATE ──
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();
  document.getElementById('live-date').textContent =
    days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();

  // ── BLOCK TOGGLE ──
  let doneBlocks = new Set();
  function markDone(idx) {
    const check = document.getElementById('check-' + idx);
    const block = document.getElementById('block-' + idx);
    if (doneBlocks.has(idx)) {
      doneBlocks.delete(idx);
      check.classList.remove('done');
      block.classList.remove('completed');
    } else {
      doneBlocks.add(idx);
      check.classList.add('done');
      block.classList.add('completed');
    }
    updateProgress();
  }
  function toggleBlock(idx) { markDone(idx); }
  function updateProgress() {
    const n = doneBlocks.size;
    document.getElementById('progress-text').textContent = n + ' / 8 blocks done';
    document.getElementById('progress-bar').style.width = (n/8*100) + '%';
  }

  // ── ERROR LOG ──
  let errors = {C1:0, C2:0, C3:0, C4:0, C5:0};
  function logError(type) {
    errors[type]++;
    document.getElementById(type.toLowerCase() + '-count').textContent = errors[type];
  }
  function resetErrors() {
    for (let k in errors) { errors[k] = 0; document.getElementById(k.toLowerCase()+'-count').textContent = 0; }
  }

  // ── DONE SUBMIT ──
  function submitDone() {
    const study  = document.getElementById('inp-study').value  || '?';
    const screen = document.getElementById('inp-screen').value || '?';
    const acc    = document.getElementById('inp-acc').value    || '?';
    const fb = document.getElementById('done-feedback');
    fb.style.display = 'block';

    let msg = \`✓ LOGGED: DONE \${study} \${screen} \${acc}\\n\`;
    const accNum = parseInt(acc);
    if (accNum >= 75) {
      msg += \`🟢 Accuracy \${acc}% — Excellent! Maintain this. Difficulty can increase slightly tomorrow.\`;
    } else if (accNum >= 60) {
      msg += \`🟡 Accuracy \${acc}% — Good foundation. Continue same difficulty. Focus on error log tonight.\`;
    } else {
      msg += \`🔴 Accuracy \${acc}% — Below 60%. Do NOT increase difficulty. Fix concept gaps first (C1 errors).\`;
    }
    const studyNum = parseFloat(study);
    if (studyNum >= 5) msg += \`\\n✓ Study hours on target.\`;
    else msg += \`\\n⚠️ Study hours low. Tomorrow: protect the 09:00 QA block first.\`;
    const screenNum = parseFloat(screen);
    if (screenNum > 3) msg += \`\\n⚠️ Screen time \${screen} hrs > 3 hrs limit. Protect sleep and focus.\`;

    fb.textContent = msg;
    fb.style.whiteSpace = 'pre-line';
  }
<\/script>
</body>
</html>
`;function jt({onBack:t}){return e.jsx("div",{style:{width:"100%",height:"100%",display:"flex",flexDirection:"column"},children:e.jsx("iframe",{srcDoc:St,style:{flex:1,width:"100%",border:"none",display:"block",background:"#0A0F1E"},title:"Master Execution Dashboard"})})}const _=[{id:1,section:"VARC",type:"MCQ",question:'RC Passage snippet: "The rapid evolution of generative AI has reshaped creative industries, raising fundamental questions about copyright, originality, and the value of human authorship." What is the central thesis of the author?',options:["Generative AI is illegal under copyright law","AI is transforming creative industries and challenging ideas of authorship","Human authorship will become completely obsolete","Copyright laws should prohibit AI development"],correctAnswer:"1",explanation:"The passage highlights how generative AI is reshaping creative industries and raising questions on authorship and copyright."},{id:2,section:"VARC",type:"MCQ",question:'Para Summary: "While renewable energy capacity is expanding globally, grid infrastructure limitations often prevent full utilization, leading to energy curtailment." Summarize in one sentence.',options:["Renewable energy expansion is limited by inadequate grid infrastructure","Grid infrastructure is expanding faster than renewable energy","Energy curtailment is necessary for grid safety","Renewable energy is unreliable for power grids"],correctAnswer:"0",explanation:"Option A accurately summarizes both key elements: expanding capacity vs. grid infrastructure limitations causing curtailment."},{id:3,section:"DILR",type:"MCQ",question:"DILR Set: Four students A, B, C, D scored 40, 50, 60, 70 in a test. A scored more than B. D scored less than C. B scored more than D. Who scored the highest?",options:["A","B","C","D"],correctAnswer:"2",explanation:"Scores are 40, 50, 60, 70. Order from constraints: C (70) > A > B > D (40). Highest score is C (70)."},{id:4,section:"DILR",type:"TITA",question:"In a matrix of 3 rows and 3 columns, the sum of each row and column is 15. If row 1 entries are 8 and 3 in positions (1,1) and (1,2), what is entry (1,3)?",correctAnswer:"4",explanation:"8 + 3 + x = 15 => x = 4."},{id:5,section:"QA",type:"MCQ",question:"If the price of petrol increases by 20%, by what percentage must a driver reduce consumption to keep total expenditure constant?",options:["16.67%","20%","25%","15%"],correctAnswer:"0",explanation:"Reduction = x / (100 + x) = 20 / 120 = 1/6 = 16.67%."},{id:6,section:"QA",type:"TITA",question:"Find the log value: log₂ (64). Type your numerical answer.",correctAnswer:"6",explanation:"2⁶ = 64, so log₂ (64) = 6."}];function wt({onBack:t}){const[n,s]=d.useState("VARC"),[r,i]=d.useState(0),[a,c]=d.useState({}),[u,b]=d.useState({}),[y,o]=d.useState(2400),[g,l]=d.useState(!1),{show:f}=D(),v=_.filter(A=>A.section===n),m=v[r]||v[0];d.useEffect(()=>{if(g)return;const A=setInterval(()=>{o(w=>w<=1?(clearInterval(A),h(),0):w-1)},1e3);return()=>clearInterval(A)},[g,n]);const h=()=>{n==="VARC"?(s("DILR"),i(0),o(2400),f("VARC Time Up! Switched to DILR section","#F59E0B")):n==="DILR"?(s("QA"),i(0),o(2400),f("DILR Time Up! Switched to QA section","#F59E0B")):(l(!0),f("Exam Completed & Submitted!","#22C55E"))},C=A=>{const w=Math.floor(A/60),R=A%60;return`${w.toString().padStart(2,"0")}:${R.toString().padStart(2,"0")}`},j=A=>{c(w=>({...w,[m.id]:A}))},S=()=>{b(A=>({...A,[m.id]:!A[m.id]}))},p=()=>{c(A=>{const w={...A};return delete w[m.id],w})},k=()=>{r<v.length-1?i(A=>A+1):f("End of current section. Use section tabs to switch or submit exam.","#38BDF8")},x=async(A,w)=>{try{await N.log({errorType:w,subject:A.section,topic:`${A.section} Mock Exam Q${A.id}`,wrongReason:"Incorrect answer in CAT/MAT Full Mock Exam.",correctMethod:A.explanation,preventionRule:`Review ${A.type} accuracy rules and time selection.`}),f(`Logged ${w} error to Error Log & Repair Queue!`,"#EF4444")}catch{f("Failed to log error","#DC2626")}},E=()=>{let A=0,w=0,R=0,T=0;_.forEach(le=>{const de=a[le.id];de===void 0||de.trim()===""?T++:de.trim()===le.correctAnswer?(w++,A+=3):(R++,le.type==="MCQ"&&(A-=1))});const F=_.length*3,I=w+R>0?Math.round(w/(w+R)*100):0,Q=Math.min(99.9,Math.max(50,Math.round(50+A/F*49.9)));return{score:A,correct:w,wrong:R,unattempted:T,maxScore:F,accuracy:I,estPercentile:Q}};if(g){const A=E();return e.jsxs("div",{style:{padding:16,maxWidth:800,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{background:"#0D1B2A",padding:20,borderRadius:12,border:"1px solid #22C55E",marginBottom:16,textAlign:"center"},children:[e.jsx("div",{style:{fontSize:32,marginBottom:8},children:"🏆"}),e.jsx("h2",{style:{fontSize:22,fontWeight:900,color:"#22C55E",margin:0},children:"CAT / MAT Mock Test Complete"}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 16px"},children:"Instant Scorecard & Detailed Performance Analysis"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(110px, 1fr))",gap:10},children:[e.jsxs("div",{style:{background:"#1E293B",padding:12,borderRadius:8},children:[e.jsx("div",{style:{fontSize:11,color:"#94A3B8"},children:"Total Score"}),e.jsxs("div",{style:{fontSize:22,fontWeight:900,color:"#F5A623"},children:[A.score," / ",A.maxScore]})]}),e.jsxs("div",{style:{background:"#1E293B",padding:12,borderRadius:8},children:[e.jsx("div",{style:{fontSize:11,color:"#94A3B8"},children:"Est. Percentile"}),e.jsxs("div",{style:{fontSize:22,fontWeight:900,color:"#38BDF8"},children:[A.estPercentile,"%ile"]})]}),e.jsxs("div",{style:{background:"#1E293B",padding:12,borderRadius:8},children:[e.jsx("div",{style:{fontSize:11,color:"#94A3B8"},children:"Accuracy"}),e.jsxs("div",{style:{fontSize:22,fontWeight:900,color:"#22C55E"},children:[A.accuracy,"%"]})]}),e.jsxs("div",{style:{background:"#1E293B",padding:12,borderRadius:8},children:[e.jsx("div",{style:{fontSize:11,color:"#94A3B8"},children:"Correct / Wrong"}),e.jsxs("div",{style:{fontSize:18,fontWeight:800,color:"#F1F5F9"},children:[e.jsx("span",{style:{color:"#22C55E"},children:A.correct})," / ",e.jsx("span",{style:{color:"#EF4444"},children:A.wrong})]})]})]})]}),e.jsx("h3",{style:{fontSize:16,fontWeight:800,color:"#F5A623",marginBottom:12},children:"Detailed Solution & Error Log Engine"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:_.map((w,R)=>{const T=a[w.id],W=T!==void 0&&T.trim()===w.correctAnswer,F=T===void 0||T.trim()==="";return e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:10,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8},children:[e.jsxs("span",{style:{fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:4,background:"#1E293B",color:"#38BDF8"},children:["Q",R+1," • ",w.section," • ",w.type]}),e.jsx("span",{style:{fontSize:12,fontWeight:800,color:W?"#22C55E":F?"#94A3B8":"#EF4444"},children:W?"✅ +3 Marks":F?"⚪ Unattempted (0)":"❌ -1 Mark"})]}),e.jsx("div",{style:{fontSize:13,color:"#F1F5F9",marginBottom:8},children:w.question}),e.jsxs("div",{style:{fontSize:12,color:"#CBD5E1",background:"#1E293B",padding:10,borderRadius:6,marginBottom:8},children:["💡 ",e.jsx("strong",{children:"Explanation:"})," ",w.explanation]}),!W&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"},children:[e.jsx("span",{style:{fontSize:11,color:"#94A3B8"},children:"Log mistake to Repair Queue:"}),["C1","C2","C3","C4","C5"].map(I=>e.jsxs("button",{onClick:()=>x(w,I),style:{background:"#EF4444",border:"none",color:"#FFF",borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:800,cursor:"pointer"},children:["+ ",I]},I))]})]},w.id)})}),e.jsx("button",{onClick:()=>l(!1),style:{marginTop:16,width:"100%",padding:"12px",borderRadius:8,background:"#1A56DB",color:"#FFF",fontWeight:800,border:"none",cursor:"pointer"},children:"🔄 Retake CAT/MAT Mock Test"})]})}return e.jsxs("div",{style:{padding:16,maxWidth:900,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:12,border:"1px solid #1E293B",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:18,fontWeight:900,color:"#F5A623"},children:"CAT / MAT Full Pattern Exam Engine"}),e.jsx("div",{style:{fontSize:12,color:"#94A3B8"},children:"Sectional Timers • MCQ + TITA Format • Real Exam Interface"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsxs("div",{style:{background:"#1E293B",padding:"6px 14px",borderRadius:8,textAlign:"center",border:"1px solid #334155"},children:[e.jsxs("div",{style:{fontSize:10,color:"#94A3B8"},children:["Time Left (",n,")"]}),e.jsxs("div",{style:{fontSize:16,fontWeight:900,color:"#EF4444",fontFamily:"monospace"},children:["⏱️ ",C(y)]})]}),e.jsx("button",{onClick:()=>l(!0),style:{background:"#DC2626",color:"#FFF",fontWeight:800,padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12},children:"Submit Exam"})]})]}),e.jsx("div",{style:{display:"flex",gap:8,marginBottom:16},children:["VARC","DILR","QA"].map(A=>e.jsxs("button",{onClick:()=>{s(A),i(0)},style:{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:800,border:n===A?"1px solid #F5A623":"1px solid #334155",background:n===A?"#1A56DB":"#1E293B",color:n===A?"#FFF":"#94A3B8",cursor:"pointer"},children:[A," Section (",_.filter(w=>w.section===A).length," Qs)"]},A))}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 240px",gap:16},children:[e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,paddingBottom:8,borderBottom:"1px solid #1E293B"},children:[e.jsxs("div",{style:{fontSize:14,fontWeight:800,color:"#38BDF8"},children:["Question ",r+1," of ",v.length," (",m.type,")"]}),e.jsxs("div",{style:{fontSize:11,color:"#94A3B8"},children:["Marking: +3 for Correct, ",m.type==="MCQ"?"-1 for Incorrect":"0 for Incorrect (TITA)"]})]}),e.jsx("div",{style:{fontSize:14,color:"#F1F5F9",marginBottom:16,lineHeight:1.5},children:m.question}),m.type==="MCQ"&&m.options&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:10,marginBottom:16},children:m.options.map((A,w)=>{const R=a[m.id]===String(w);return e.jsxs("button",{onClick:()=>j(String(w)),style:{textAlign:"left",padding:"10px 14px",borderRadius:8,fontSize:13,border:R?"1px solid #22C55E":"1px solid #334155",background:R?"rgba(34,197,94,0.15)":"#1E293B",color:R?"#4ADE80":"#CBD5E1",cursor:"pointer"},children:[e.jsxs("strong",{children:[String.fromCharCode(65+w),"."]})," ",A]},w)})}),m.type==="TITA"&&e.jsxs("div",{style:{marginBottom:16},children:[e.jsx("div",{style:{fontSize:12,color:"#94A3B8",marginBottom:6},children:"Type your numerical response below:"}),e.jsx("input",{type:"text",value:a[m.id]||"",onChange:A=>j(A.target.value),placeholder:"Enter answer (e.g. 4)",style:{width:"100%",padding:"10px 14px",borderRadius:8,background:"#1E293B",border:"1px solid #38BDF8",color:"#FFF",fontSize:14,outline:"none"}})]}),e.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap",paddingTop:12,borderTop:"1px solid #1E293B"},children:[e.jsx("button",{onClick:k,style:{background:"#22C55E",color:"#FFF",border:"none",padding:"8px 16px",borderRadius:6,fontWeight:800,cursor:"pointer"},children:"Save & Next"}),e.jsx("button",{onClick:S,style:{background:u[m.id]?"#F5A623":"#1E293B",color:u[m.id]?"#000":"#F5A623",border:"1px solid #F5A623",padding:"8px 14px",borderRadius:6,fontWeight:700,cursor:"pointer"},children:u[m.id]?"Unmark Review":"Mark for Review"}),e.jsx("button",{onClick:p,style:{background:"#1E293B",color:"#94A3B8",border:"1px solid #334155",padding:"8px 14px",borderRadius:6,cursor:"pointer"},children:"Clear Response"})]})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{fontSize:12,fontWeight:800,color:"#F5A623",marginBottom:10},children:["Question Palette (",n,")"]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:8},children:v.map((A,w)=>{const R=a[A.id],T=R!==void 0&&R.trim()!=="",W=u[A.id];let F="#1E293B",I="#334155",Q="#CBD5E1";return T&&W?(F="#8B5CF6",I="#A78BFA",Q="#FFF"):T?(F="#22C55E",I="#4ADE80",Q="#FFF"):W&&(F="#F5A623",I="#FBBF24",Q="#000"),e.jsx("button",{onClick:()=>i(w),style:{padding:"8px 0",borderRadius:6,fontSize:12,fontWeight:800,background:F,border:`1px solid ${I}`,color:Q,cursor:"pointer"},children:w+1},A.id)})}),e.jsxs("div",{style:{marginTop:16,fontSize:10,color:"#94A3B8",display:"flex",flexDirection:"column",gap:4},children:[e.jsx("div",{children:"🟢 Answered"}),e.jsx("div",{children:"🟡 Marked for Review"}),e.jsx("div",{children:"🟣 Answered & Marked"}),e.jsx("div",{children:"⚪ Not Answered"})]})]})]})]})}function Ct({onBack:t}){const[n,s]=d.useState([]),[r,i]=d.useState(!0);d.useEffect(()=>{async function o(){try{const g=await M.getAll();s(g)}catch(g){console.error("Failed to load mastery topics",g)}finally{i(!1)}}o()},[]);const a=n.filter(o=>o.subject==="QA"),c=n.filter(o=>o.subject==="DILR"),u=n.filter(o=>o.subject==="VARC"),b=[...n].sort((o,g)=>o.currentLevel-g.currentLevel).slice(0,3),y=o=>o>=4?"#22C55E":o>=2?"#F5A623":"#EF4444";return e.jsxs("div",{style:{padding:16,maxWidth:900,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:24},children:"🧠"}),e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#F5A623",margin:0},children:"AI Adaptive Weakness Heatmap"})]}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:"Real-time subject proficiency analysis and AI-recommended daily targets"})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(26,86,219,0.2) 0%, rgba(245,166,35,0.15) 100%)",padding:16,borderRadius:12,border:"1px solid #1A56DB",marginBottom:20},children:[e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#38BDF8",marginBottom:6},children:"🎯 AI Personalized Priority Plan for Today"}),e.jsx("div",{style:{fontSize:12,color:"#CBD5E1",marginBottom:12},children:"Based on your latest practice accuracy, the AI engine has prioritized these 3 topics for maximum score improvement:"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:10},children:b.map((o,g)=>e.jsxs("div",{style:{background:"#0D1B2A",padding:12,borderRadius:8,border:"1px solid #334155"},children:[e.jsxs("div",{style:{fontSize:10,fontWeight:800,color:"#F5A623"},children:["PRIORITY ",g+1," • ",o.subject]}),e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#F1F5F9",margin:"4px 0"},children:o.name}),e.jsxs("div",{style:{fontSize:11,color:"#94A3B8"},children:["Current Mastery: Level ",o.currentLevel,"/5"]})]},o.id))})]}),e.jsx("h2",{style:{fontSize:16,fontWeight:800,color:"#F1F5F9",marginBottom:12},children:"Topic Proficiency Heatmap (All Subjects)"}),r?e.jsx("div",{style:{color:"#94A3B8",fontSize:13},children:"Analyzing topic mastery data..."}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#22C55E",marginBottom:12},children:"📐 Quantitative Aptitude (QA)"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))",gap:10},children:a.map(o=>e.jsxs("div",{style:{background:"#1E293B",padding:10,borderRadius:8,borderLeft:`4px solid ${y(o.currentLevel)}`},children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#F1F5F9"},children:o.name}),e.jsxs("div",{style:{fontSize:10,color:y(o.currentLevel),fontWeight:800,marginTop:4},children:["Level ",o.currentLevel," / 5"]})]},o.id))})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#38BDF8",marginBottom:12},children:"🧩 Data Interpretation & Logical Reasoning (DILR)"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))",gap:10},children:c.map(o=>e.jsxs("div",{style:{background:"#1E293B",padding:10,borderRadius:8,borderLeft:`4px solid ${y(o.currentLevel)}`},children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#F1F5F9"},children:o.name}),e.jsxs("div",{style:{fontSize:10,color:y(o.currentLevel),fontWeight:800,marginTop:4},children:["Level ",o.currentLevel," / 5"]})]},o.id))})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#A78BFA",marginBottom:12},children:"📖 Verbal Ability & Reading Comprehension (VARC)"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))",gap:10},children:u.map(o=>e.jsxs("div",{style:{background:"#1E293B",padding:10,borderRadius:8,borderLeft:`4px solid ${y(o.currentLevel)}`},children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#F1F5F9"},children:o.name}),e.jsxs("div",{style:{fontSize:10,color:y(o.currentLevel),fontWeight:800,marginTop:4},children:["Level ",o.currentLevel," / 5"]})]},o.id))})]})]})]})}const Et=[{id:"qa-pct",subject:"QA",topic:"Percentages",title:"Successive % Change",front:"Net % change after two successive changes of A% and B%?",back:`A + B + (A×B)/100 %
e.g. +20% then -10% → 20 - 10 - 2 = 8%`,tip:"Use +A for increase, -A for decrease. The A×B/100 term is what people forget."},{id:"qa-rat",subject:"QA",topic:"Ratio & Proportion",title:"Combining Ratios",front:"A:B = 2:3 and B:C = 4:5 — find A:B:C",back:"Make B equal in both: A:B=8:12, B:C=12:15 → A:B:C = 8:12:15",tip:"Always equalise the common term before combining — never cross-multiply directly."},{id:"qa-avg",subject:"QA",topic:"Averages",title:"Sum from Average",front:"Avg of 5 numbers is 20, a 6th number makes the new avg 22. Find the 6th number.",back:"Old sum = 100. New sum = 22×6 = 132. 6th number = 132-100 = 32",tip:"Never add averages directly — always convert to SUM = Average × Count first."},{id:"qa-pl",subject:"QA",topic:"Profit / Loss",title:"SP from CP and Profit%",front:"CP = 400, profit = 15%. Find SP. Also: Discount is on which price?",back:`SP = CP × (1 + 15/100) = 460
Discount is always on Marked Price, never on CP.`,tip:"Profit/Loss % is always on Cost Price. Discount % is always on Marked Price. Mixing these is the #1 trap."},{id:"qa-tsd",subject:"QA",topic:"Time-Speed-Distance",title:"Relative Speed",front:"Two trains moving toward each other vs. same direction — how does relative speed differ?",back:`Opposite directions: relative speed = sum of speeds
Same direction: relative speed = difference of speeds`,tip:"Convert km/hr to m/s by ×5/18 before working with train-length problems."},{id:"qa-tw",subject:"QA",topic:"Time & Work",title:"Combined Work Rate",front:"A finishes a job in 10 days, B in 15 days. How long together?",back:"Rate of A = 1/10, Rate of B = 1/15. Combined = 1/10+1/15 = 1/6 → 6 days",tip:"Work with RATES (1/days), never raw day-counts, when combining workers."},{id:"qa-sici",subject:"QA",topic:"SI / CI",title:"CI − SI Difference (2 years)",front:"Difference between CI and SI on principal P at rate R% for 2 years?",back:"CI − SI = P × (R/100)²",tip:"CI is always ≥ SI. The gap between them grows every additional year."},{id:"qa-mix",subject:"QA",topic:"Mixture / Alligation",title:"Alligation Rule",front:"Mixture of two components at prices C1 and C2, mean price M — find the mixing ratio.",back:`Ratio = (C2 − M) : (M − C1)
Draw the cross-diagram: cheaper price and dearer price on either side of mean.`,tip:"Always draw the alligation cross — don't try to solve it as a pure algebra equation under time pressure."},{id:"qa-leq",subject:"QA",topic:"Linear Equations",title:"Word Problem → Equation",front:"What is the single most common mistake in linear equation word problems?",back:"Misreading which quantity is the unknown — always define your variable in writing before forming the equation.",tip:"Re-read the question after forming the equation — check it actually answers what was asked."},{id:"qa-qeq",subject:"QA",topic:"Quadratic Equations",title:"Sum & Product of Roots",front:"For ax² + bx + c = 0 with roots α, β — sum and product?",back:`Sum (α+β) = −b/a
Product (α×β) = c/a`,tip:"Check the SIGN of b/a carefully — this is where most errors happen under time pressure."},{id:"qa-ineq",subject:"QA",topic:"Inequalities",title:"Sign Flip Rule",front:"When does an inequality sign flip?",back:"Multiplying or dividing both sides by a NEGATIVE number flips the sign.",tip:"Never multiply both sides by a variable of unknown sign — split into cases instead."},{id:"qa-prog",subject:"QA",topic:"Progressions",title:"AP and GP Sum Formulas",front:"Sum of n terms of an AP and a GP?",back:`AP: Sn = n/2 × (2a + (n−1)d)
GP: Sn = a(rⁿ−1)/(r−1), r ≠ 1`,tip:'GP sum formula breaks when r=1 (every term is just "a") — handle that case separately.'},{id:"qa-log",subject:"QA",topic:"Logarithms",title:"Core Log Identities",front:"log(ab), log(a/b), and log(aⁿ)?",back:`log(ab) = log a + log b
log(a/b) = log a − log b
log(aⁿ) = n·log a`,tip:"log is undefined for zero or negative numbers — always check the domain first."},{id:"qa-geo",subject:"QA",topic:"Geometry",title:"Right Triangle: Inradius & Circumradius",front:"For a right triangle with legs a, b and hypotenuse c — inradius r and circumradius R?",back:`r = (a + b − c) / 2
R = c / 2`,tip:"Never assume a diagram is drawn to scale — use only the numbers given."},{id:"qa-ns",subject:"QA",topic:"Number System",title:"HCF × LCM Rule",front:"Relationship between HCF and LCM of two numbers?",back:"HCF × LCM = Product of the two numbers (true for exactly TWO numbers only)",tip:"This rule does NOT extend to three or more numbers — a very common false generalisation."},{id:"qa-pc",subject:"QA",topic:"P&C / Probability",title:"Permutation vs Combination",front:"When do you use nPr vs nCr?",back:`nPr — order matters (arrangement)
nCr — order doesn't matter (selection)`,tip:'Ask "does swapping two chosen items create a new outcome?" — yes means permutation.'},{id:"dl-tbl",subject:"DILR",topic:"Tables",title:"Reading a Table Correctly",front:"First two things to check before solving any table-based set?",back:"Row/column headers and their UNITS — a table with unlabelled units is where the trap usually is.",tip:"Don't assume — re-read the header row every time you switch which column you're reading."},{id:"dl-bar",subject:"DILR",topic:"Bar Graphs",title:"Estimate, Don't Calculate",front:"When comparing bar heights across a large dataset, what's the fastest approach?",back:"Visually estimate relative height first — only calculate exact values when the question demands precision.",tip:"Precision costs time you don't have. Estimate first, verify only if two options are close."},{id:"dl-line",subject:"DILR",topic:"Line Graphs",title:"Slope = Rate of Change",front:"What does the steepness of a line graph segment tell you?",back:"Steeper slope = faster rate of change. A flat segment means no change over that interval.",tip:"The steepest segment isn't always the highest value — don't confuse slope with magnitude."},{id:"dl-pie",subject:"DILR",topic:"Pie Charts",title:"% to Absolute Conversion",front:"A pie chart shows 25% for a category. How do you get the absolute value?",back:"Absolute value = (% share) × Total. You need the TOTAL — it's often given separately, don't skip it.",tip:"Avoid angle-based calculation (360° method) — direct % × Total is faster and less error-prone."},{id:"dl-cas",subject:"DILR",topic:"Caselets",title:"Extract Before You Solve",front:"Best first step when facing a dense text-based caselet?",back:"Pull every number and relationship into a mini-table BEFORE attempting any question.",tip:"Re-reading the passage for every question wastes more time than one upfront extraction pass."},{id:"dl-lin",subject:"DILR",topic:"Linear Arrangement",title:"Fill Definite Positions First",front:"Best strategy order when solving a linear arrangement puzzle?",back:"Place all DEFINITE (directly stated) positions first, then work out relative/indirect clues.",tip:"Draw the line and number the seats before writing anything — don't solve it purely in your head."},{id:"dl-cir",subject:"DILR",topic:"Circular Arrangement",title:"Facing In vs Facing Out",front:'If people face the CENTER, does "immediate right" mean clockwise or anti-clockwise?',back:`Facing center: right = anti-clockwise, left = clockwise.
Facing outward: this flips — right = clockwise.`,tip:"Always re-check whether the puzzle says facing in or facing out before applying direction rules."},{id:"dl-dist",subject:"DILR",topic:"Distribution",title:"Grid Before Guessing",front:'Best representation for a "who got what" distribution puzzle?',back:"A grid: people as rows, items/categories as columns. Fill known constraints as ticks/crosses first.",tip:"Never try to hold more than 2-3 unresolved distribution slots in your head — write it down."},{id:"dl-sel",subject:"DILR",topic:"Selection",title:"List, Then Eliminate",front:'Best approach for "select a committee that satisfies these conditions" puzzles?',back:"List all raw possibilities first, then apply each constraint one at a time to eliminate.",tip:"Applying constraints in the WRONG order can look like a dead-end — if stuck, try a different constraint first."},{id:"dl-rank",subject:"DILR",topic:"Ranking / Order",title:"Build the Comparison Chain",front:'How do you handle "A is taller than B but shorter than C" style clues?',back:"Build a single ordered chain (e.g. C > A > B) and merge every new clue into that one chain.",tip:'Watch for indirect clues ("A is not the shortest") — these narrow possibilities without giving a direct comparison.'},{id:"dl-game",subject:"DILR",topic:"Games / Tournaments",title:"Draw the Bracket",front:"Best way to track a knockout tournament's results?",back:"Draw the actual bracket/fixture tree and fill in winners round by round — don't track it as a text list.",tip:"For round-robin formats, use a grid (team vs team) instead of a bracket."},{id:"dl-net",subject:"DILR",topic:"Networks",title:"Trace, Don't Assume",front:"How do you verify a path exists between two nodes in a network puzzle?",back:"Physically trace the connection on the diagram step by step — don't assume a path exists just because both nodes are connected to a common third node.",tip:"Redraw a simplified version of the network if the original diagram is cluttered."},{id:"dl-hyb",subject:"DILR",topic:"Hybrid Sets",title:"Identify the Dominant Structure",front:"A set mixes a table with logical conditions — where do you start?",back:"Extract the table data first (treat it as pure DI), then layer the logical constraints on top as a second pass.",tip:"Don't try to solve both halves simultaneously — sequence it: data extraction, then logic."},{id:"vc-mi",subject:"VARC",topic:"RC Main Idea",title:"Main Idea ≠ First Sentence",front:"Where should you look to identify a passage's main idea?",back:"The main idea usually emerges from the FIRST and LAST paragraphs together, not just the opening line.",tip:"A correct Main Idea answer must cover the WHOLE passage — reject options that only describe one paragraph."},{id:"vc-arg",subject:"VARC",topic:"RC Central Argument",title:"Argument vs Topic",front:`What's the difference between a passage's "topic" and its "central argument"?`,back:"Topic = what it's about (a noun). Central argument = what CLAIM the author is making about that topic (a stance).",tip:`If your answer to "what's the argument" is just a noun phrase, you've found the topic, not the argument.`},{id:"vc-inf",subject:"VARC",topic:"RC Inference",title:"Inference Must Be Supported, Not Stated",front:'What makes an inference question option wrong even if it "sounds true"?',back:"If it isn't directly derivable from the passage's actual statements, it's an assumption, not an inference — reject it.",tip:"A correct inference is a small logical step from stated facts — not new information the author never implied."},{id:"vc-tone",subject:"VARC",topic:"RC Tone",title:"Spot Evaluative Language",front:"How do you detect an author's tone quickly?",back:"Scan for evaluative words (critical, however, unfortunately, remarkably, must) — these reveal attitude, not just facts.",tip:"Tone questions are rarely about the whole passage — the tone in the LAST paragraph often decides the answer."},{id:"vc-elim",subject:"VARC",topic:"RC Elimination",title:"Close-Option Elimination",front:"Two RC options seem equally correct — how do you decide?",back:"Go back to the passage. Pick the option directly supported by the text; eliminate the one that over-extends or adds unstated detail.",tip:'The "almost right" option often adds one extra claim the passage never made — hunt for that extra word.'},{id:"vc-sum",subject:"VARC",topic:"VA Para Summary",title:"Summary Length Test",front:"What's the fastest way to eliminate wrong Para Summary options?",back:"Reject options that are too NARROW (cover only one example) or too BROAD (add ideas not in the passage).",tip:"The correct summary is usually the shortest one that still captures the full argument — not the most detailed."},{id:"vc-jum",subject:"VARC",topic:"VA Para Jumble",title:"Find the Opening Sentence First",front:"What identifies the opening sentence of a jumbled paragraph?",back:"It introduces the topic WITHOUT relying on a pronoun or connector that refers back to something already said.",tip:"Look for mandatory pairs (a sentence that must directly follow another) before guessing the full order."},{id:"vc-comp",subject:"VARC",topic:"VA Para Completion",title:"Match Tone and Direction",front:"How do you pick the correct final sentence of a paragraph?",back:"It must continue the same tone AND logical direction the paragraph was already heading in — not introduce a new idea.",tip:`If an option feels like a "twist," it's almost always wrong — completions extend, they don't surprise.`},{id:"vc-odd",subject:"VARC",topic:"VA Odd One Out",title:"Find What Breaks the Theme",front:"How do you find the odd sentence out among 4-5 related sentences?",back:"Look for the one sentence introducing a new entity/idea not connected to the others, or contradicting the shared theme.",tip:"Read all sentences as a group first — the odd one is usually clear only once you see the shared thread."}],Rt={1:1,2:3,3:7,4:14,5:30},Ae={async getAll(){return P("formulaReviews")},async getForCard(t){return L("formulaReviews",t)},async recordRating(t,n){const s=await this.getForCard(t);let r=s?.boxLevel??1;n==="Hard"?r=1:n==="Medium"?r=Math.max(2,Math.min(r,2)):r=Math.min((s?.boxLevel??2)+1,5);const i=Rt[r]??1,a=new Date;a.setDate(a.getDate()+i);const c={cardId:t,boxLevel:r,nextReviewDate:oe(a),lastRating:n,reviewCount:(s?.reviewCount??0)+1};return await B("formulaReviews",c),c},async isDueToday(t,n){const s=n.find(r=>r.cardId===t);return s?s.nextReviewDate<=X():!0}};function Dt({onBack:t}){const[n,s]=d.useState("ALL"),[r,i]=d.useState(0),[a,c]=d.useState(!1),[u,b]=d.useState([]),[y,o]=d.useState(!0),{show:g}=D();d.useEffect(()=>{Ae.getAll().then(x=>{b(x),o(!1)})},[]);const l=d.useMemo(()=>{const x=new Map;return u.forEach(E=>x.set(E.cardId,E)),x},[u]),f=x=>{const E=l.get(x);return!E||E.nextReviewDate<=X()},v=Et.filter(x=>n==="ALL"||x.subject===n),m=v.filter(x=>f(x.id)),h=v.filter(x=>!f(x.id)),C=[...m,...h],j=C[r]||C[0],S=m.length,p=()=>{c(!1),i(x=>(x+1)%C.length)};async function k(x){if(!j)return;const E=await Ae.recordRating(j.id,x);b(w=>[...w.filter(R=>R.cardId!==j.id),E]);const A=E.boxLevel===1?"tomorrow":`in ${E.boxLevel>=5?30:E.boxLevel>=4?14:E.boxLevel>=3?7:3} days`;x==="Easy"&&g(`✅ Saved — next review ${A}`,"#22C55E"),x==="Medium"&&g(`⚡ Saved — next review ${A}`,"#F5A623"),x==="Hard"&&g("🔴 Saved — back in the deck tomorrow","#EF4444"),p()}return y?e.jsx("div",{style:{padding:16,color:"#94A3B8",textAlign:"center"},children:"Loading revision deck…"}):e.jsxs("div",{style:{padding:16,maxWidth:650,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12},children:[e.jsxs("div",{children:[e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#F5A623",margin:0},children:"🎴 Revision Deck — Spaced Repetition"}),e.jsxs("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:["All 38 Tier-1/Tier-2 syllabus topics · ",S," due today"]})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsx("div",{style:{display:"flex",gap:8,marginBottom:16},children:["ALL","QA","DILR","VARC"].map(x=>e.jsx("button",{onClick:()=>{s(x),i(0),c(!1)},style:{flex:1,padding:"8px",borderRadius:8,fontSize:12,fontWeight:800,background:n===x?"#1A56DB":"#1E293B",color:n===x?"#FFF":"#94A3B8",border:"none",cursor:"pointer"},children:x},x))}),j?e.jsxs(e.Fragment,{children:[e.jsxs("div",{onClick:()=>c(!a),style:{minHeight:240,background:"linear-gradient(135deg, #0D1B2A 0%, #1E293B 100%)",padding:24,borderRadius:16,border:`1px solid ${f(j.id)?"#F5A623":"#38BDF8"}`,textAlign:"center",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",marginBottom:16,position:"relative",whiteSpace:"pre-line"},children:[e.jsxs("div",{style:{position:"absolute",top:12,left:14,fontSize:10,fontWeight:800,color:"#38BDF8",background:"#0D1B2A",padding:"2px 8px",borderRadius:4},children:[j.subject," • ",j.topic]}),f(j.id)&&e.jsx("div",{style:{position:"absolute",top:12,right:14,fontSize:9,fontWeight:800,color:"#0A0F1E",background:"#F5A623",padding:"2px 8px",borderRadius:4},children:"DUE TODAY"}),e.jsx("div",{style:{fontSize:12,color:"#94A3B8",marginTop:20},children:j.title}),e.jsx("div",{style:{fontSize:16,fontWeight:800,color:"#F1F5F9",margin:"10px 0"},children:a?j.back:j.front}),a?e.jsxs("div",{style:{fontSize:12,color:"#4ADE80",background:"rgba(34,197,94,0.1)",padding:"6px 12px",borderRadius:6,marginTop:10},children:["💡 ",j.tip]}):e.jsx("div",{style:{fontSize:11,color:"#F5A623",fontStyle:"italic",marginTop:10},children:"👆 Tap to reveal"})]}),e.jsxs("div",{style:{fontSize:11,color:"#64748B",textAlign:"center",marginBottom:10},children:["Card ",r+1," / ",C.length]}),a&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:10},children:[e.jsx("button",{onClick:()=>k("Hard"),style:{padding:12,borderRadius:8,background:"#EF4444",color:"#FFF",fontWeight:800,border:"none",cursor:"pointer",fontSize:12},children:"🔴 Hard"}),e.jsx("button",{onClick:()=>k("Medium"),style:{padding:12,borderRadius:8,background:"#F5A623",color:"#000",fontWeight:800,border:"none",cursor:"pointer",fontSize:12},children:"⚡ Medium"}),e.jsx("button",{onClick:()=>k("Easy"),style:{padding:12,borderRadius:8,background:"#22C55E",color:"#FFF",fontWeight:800,border:"none",cursor:"pointer",fontSize:12},children:"✅ Easy"})]})]}):e.jsx("div",{style:{textAlign:"center",padding:40,color:"#94A3B8"},children:"No cards in this filter."})]})}function Bt({onBack:t}){const{stats:n}=Ie(),s=[{id:"b1",title:"Execution Flame",icon:"🔥",desc:"Maintained a 3-day consecutive study execution streak.",unlocked:!0,progressText:"Streak: 3 Days Active"},{id:"b2",title:"Accuracy Champion",icon:"🎯",desc:"Achieved 70%+ overall accuracy on practice sessions.",unlocked:(n?.lastAccuracy||0)>=70,progressText:n?.lastAccuracy!=null?`Current: ${n.lastAccuracy}%`:"0/70%"},{id:"b3",title:"Repair Master",icon:"🔧",desc:"Logged and repaired at least 5 C1–C5 errors.",unlocked:(n?.totalErrors||0)>=5,progressText:`${n?.totalErrors||0} / 5 Errors Logged`},{id:"b4",title:"Mock Dominator",icon:"🏆",desc:"Completed and submitted 1 full CAT mock exam.",unlocked:(n?.mocksLogged||0)>=1,progressText:`${n?.mocksLogged||0} / 1 Mocks Completed`},{id:"b5",title:"Speed Demon",icon:"⚡",desc:"Mastered 10 fraction-percentage speed recall cards.",unlocked:!0,progressText:"Speed Drills Unlocked"}],r=s.filter(i=>i.unlocked).length;return e.jsxs("div",{style:{padding:16,maxWidth:800,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:24},children:"🎖️"}),e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#F5A623",margin:0},children:"Gamified Streak & Badges"})]}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:"Earn execution badges, maintain your daily streak, and unlock study rewards"})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsxs("div",{style:{background:"linear-gradient(135deg, #1E293B 0%, #0D1B2A 100%)",padding:20,borderRadius:12,border:"1px solid #F5A623",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11,fontWeight:800,color:"#F5A623"},children:"DAILY STREAK"}),e.jsx("div",{style:{fontSize:28,fontWeight:900,color:"#FFF",display:"flex",alignItems:"center",gap:6},children:"🔥 3 Days Active Streak"}),e.jsx("div",{style:{fontSize:12,color:"#94A3B8",marginTop:2},children:"Keep completing daily blocks to maintain your streak!"})]}),e.jsxs("div",{style:{textAlign:"center",background:"rgba(245,166,35,0.1)",padding:"12px 18px",borderRadius:10,border:"1px solid rgba(245,166,35,0.3)"},children:[e.jsx("div",{style:{fontSize:11,color:"#F5A623",fontWeight:800},children:"UNLOCKED"}),e.jsxs("div",{style:{fontSize:20,fontWeight:900,color:"#FFF"},children:[r," / ",s.length]})]})]}),e.jsx("h2",{style:{fontSize:16,fontWeight:800,color:"#F1F5F9",marginBottom:12},children:"Execution Badges & Milestones"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:12},children:s.map(i=>e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:i.unlocked?"1px solid #22C55E":"1px solid #1E293B",opacity:i.unlocked?1:.6},children:[e.jsx("div",{style:{fontSize:32,marginBottom:8},children:i.icon}),e.jsxs("div",{style:{fontSize:15,fontWeight:800,color:i.unlocked?"#4ADE80":"#94A3B8"},children:[i.title," ",i.unlocked&&"✅"]}),e.jsx("p",{style:{fontSize:12,color:"#CBD5E1",margin:"4px 0 10px",lineHeight:1.4},children:i.desc}),e.jsx("div",{style:{fontSize:11,fontWeight:700,color:i.unlocked?"#22C55E":"#F5A623",background:"#1E293B",padding:"4px 8px",borderRadius:4,display:"inline-block"},children:i.progressText})]},i.id))})]})}const pe=[{id:"db-35",briefNumber:35,date:"TODAY",subject:"VARC",title:"Daily Execution Brief #35 — RC Philosophy & Critical Reasoning",targetTimeMin:15,pdfName:"1788495345869-EXECUTION-BRIEF-(35).pdf",passageText:"Philosophical inquiry often challenges common sense by questioning fundamental assumptions about reality, knowledge, and morality. While common sense provides a pragmatic framework for daily survival, it frequently relies on unexamined biases and cultural conditioning. Philosophy subjects these tacit beliefs to rigorous logical scrutiny.",questions:[{question:"According to the passage, why does philosophy challenge common sense?",options:["Because common sense is completely useless for daily survival","Because common sense relies on unexamined biases and tacit beliefs","Because philosophy prefers pragmatic frameworks over logic","Because cultural conditioning makes common sense morally superior"],correctIndex:1,explanation:"The passage explicitly states that common sense relies on unexamined biases and cultural conditioning, which philosophy subjects to scrutiny."}]},{id:"db-19",briefNumber:19,date:"Yesterday",subject:"LRDI",title:"Daily Execution Brief #19 — Matrix Distribution & Ranking Set",targetTimeMin:20,pdfName:"1786941891031-EXECUTION-BRIEF-(19).pdf",questions:[{question:"Five executives P, Q, R, S, T travel to 5 cities. P does not go to Delhi or Mumbai. Q goes to Bangalore. R goes to Mumbai. Which city does P go to if S goes to Delhi and T goes to Chennai?",options:["Hyderabad","Delhi","Mumbai","Bangalore"],correctIndex:0,explanation:"Given cities: Delhi (S), Mumbai (R), Bangalore (Q), Chennai (T). The remaining city for P is Hyderabad."}]},{id:"db-4",briefNumber:4,date:"3 Days Ago",subject:"QA",title:"Daily Execution Brief #4 — Arithmetic & Ratio Shortcuts",targetTimeMin:12,pdfName:"1785210819292-EXECUTION-BRIEF-(4).pdf",questions:[{question:"A sum of money doubles itself at simple interest in 8 years. In how many years will it become 4 times itself?",options:["16 years","24 years","32 years","12 years"],correctIndex:1,explanation:"Simple interest earned in 8 yrs = 100% of P (to double). To become 4 times, interest needed = 300% of P. Time = 3 × 8 = 24 years."}]}];function Tt({onBack:t}){const[n,s]=d.useState("ALL"),[r,i]=d.useState("db-35"),[a,c]=d.useState({}),{show:u}=D(),b=pe.filter(l=>n==="ALL"||l.subject===n),y=pe.find(l=>l.id===r)||pe[0],o=(l,f)=>{c(v=>({...v,[`${y.id}_${l}`]:f})),u("Response submitted! Solution unlocked.","#38BDF8")},g=l=>{u(`📥 Downloaded ${l.title} PDF!`,"#22C55E")};return e.jsxs("div",{style:{padding:16,maxWidth:900,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:24},children:"📰"}),e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#F5A623",margin:0},children:"Daily Execution Briefs & Practice Sprints"})]}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:"Daily curated RC passages, DILR logic sets, Quant speed briefs, and downloadable PDF study guides"})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsx("div",{style:{background:"#0D1B2A",padding:12,borderRadius:12,border:"1px solid #1E293B",marginBottom:16,display:"flex",gap:8,overflowX:"auto"},children:["ALL","VARC","LRDI","QA"].map(l=>e.jsx("button",{onClick:()=>s(l),style:{padding:"6px 16px",borderRadius:20,fontSize:12,fontWeight:800,border:n===l?"1px solid #F5A623":"1px solid #334155",background:n===l?"#1A56DB":"#1E293B",color:n===l?"#FFF":"#94A3B8",cursor:"pointer"},children:l==="ALL"?"🌐 All Execution Briefs":`${l} Briefs`},l))}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"260px 1fr",gap:16},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:10},children:[e.jsxs("div",{style:{fontSize:12,fontWeight:800,color:"#F5A623"},children:["Briefs History (",b.length,")"]}),b.map(l=>e.jsxs("div",{onClick:()=>i(l.id),style:{background:l.id===y.id?"linear-gradient(135deg, #1E293B 0%, #0F172A 100%)":"#0D1B2A",border:l.id===y.id?"1px solid #F5A623":"1px solid #1E293B",padding:12,borderRadius:10,cursor:"pointer"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4},children:[e.jsxs("span",{style:{fontSize:10,fontWeight:800,background:"#1A56DB",color:"#FFF",padding:"2px 6px",borderRadius:4},children:["#",l.briefNumber," • ",l.subject]}),e.jsx("span",{style:{fontSize:10,color:"#94A3B8"},children:l.date})]}),e.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#F1F5F9"},children:l.title})]},l.id))]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:20,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8},children:[e.jsxs("div",{children:[e.jsxs("span",{style:{fontSize:11,fontWeight:800,color:"#F5A623",background:"rgba(245,166,35,0.1)",padding:"2px 8px",borderRadius:4},children:["Daily Brief #",y.briefNumber," • ",y.subject]}),e.jsx("h2",{style:{fontSize:18,fontWeight:800,color:"#F1F5F9",margin:"6px 0 2px"},children:y.title})]}),e.jsxs("button",{onClick:()=>g(y),style:{background:"#22C55E",color:"#FFF",fontWeight:800,border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,cursor:"pointer"},children:["📄 Download PDF Guide (",y.pdfName.slice(-12),")"]})]}),y.passageText&&e.jsxs("div",{style:{background:"#1E293B",padding:14,borderRadius:8,fontSize:13,color:"#CBD5E1",lineHeight:1.6,marginBottom:16,borderLeft:"3px solid #38BDF8"},children:[e.jsx("strong",{children:"📖 Reading Comprehension Passage:"}),e.jsx("p",{style:{margin:"6px 0 0"},children:y.passageText})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:16},children:y.questions.map((l,f)=>{const v=a[`${y.id}_${f}`],m=v!==void 0,h=v===l.correctIndex;return e.jsxs("div",{style:{background:"#1E293B",padding:16,borderRadius:10},children:[e.jsxs("div",{style:{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:10},children:["Question ",f+1,": ",l.question]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:12},children:l.options.map((C,j)=>{let S="#0D1B2A",p="#334155",k="#CBD5E1";return m&&(j===l.correctIndex?(S="rgba(34,197,94,0.2)",p="#22C55E",k="#4ADE80"):j===v&&(S="rgba(239,68,68,0.2)",p="#EF4444",k="#FCA5A5")),e.jsxs("button",{onClick:()=>!m&&o(f,j),disabled:m,style:{textAlign:"left",padding:"10px 14px",borderRadius:8,fontSize:13,background:S,border:`1px solid ${p}`,color:k,cursor:m?"default":"pointer"},children:[String.fromCharCode(65+j),". ",C]},j)})}),m&&e.jsxs("div",{style:{padding:12,borderRadius:8,background:h?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${h?"#22C55E":"#EF4444"}`},children:[e.jsx("div",{style:{fontWeight:800,color:h?"#22C55E":"#EF4444",marginBottom:4},children:h?"✅ Correct Answer!":"❌ Incorrect Answer"}),e.jsxs("div",{style:{fontSize:12,color:"#CBD5E1"},children:["💡 ",e.jsx("strong",{children:"Explanation:"})," ",l.explanation]})]})]},f)})})]})]})]})}const Ft=[{id:"qb-1",exam:"CAT",subject:"QA",topic:"Percentages",difficulty:"CAT Level",question:"In a class, 60% of students passed in Math and 70% passed in English. If 20% failed in both subjects, what percentage of students passed in both subjects?",options:["30%","40%","50%","60%"],correctIndex:2,explanation:"% Failed in Math = 40%, Failed in English = 30%. Failed in at least one = 40 + 30 - 20 = 50%. Passed in both = 100 - 50 = 50%."},{id:"qb-2",exam:"MAT",subject:"QA",topic:"Profit & Loss",difficulty:"Moderate",question:"A trader marks his goods 40% above cost price and allows a discount of 20%. What is his net profit percentage?",options:["12%","15%","18%","20%"],correctIndex:0,explanation:"Net multiplier = 1.4 × 0.8 = 1.12 => 12% profit."},{id:"qb-3",exam:"NMAT",subject:"VARC",topic:"Vocabulary & Analogy",difficulty:"Easy",question:"Choose the option that best expresses the meaning of EPHEMERAL:",options:["Permanent","Transient","Substantial","Glorious"],correctIndex:1,explanation:"Ephemeral means lasting for a very short time (transient/fleeting)."},{id:"qb-4",exam:"SNAP",subject:"DILR",topic:"Analytical Reasoning",difficulty:"Moderate",question:"If A is to the West of B, B is to the South of C, and C is to the East of D, in which direction is A with respect to D?",options:["North-West","South-East","South-West","Cannot be determined without distance"],correctIndex:3,explanation:"Since distances between the points are not specified, relative direction depends on distances and cannot be determined."},{id:"qb-5",exam:"XAT",subject:"QA",topic:"Functions & Graphs",difficulty:"Hard",question:"Find the minimum value of f(x) = x² + 4/x² for all x > 0.",options:["2","4","8","16"],correctIndex:1,explanation:"By AM-GM inequality: (x² + 4/x²)/2 ≥ √(x² × 4/x²) = √4 = 2. So x² + 4/x² ≥ 4."}];function It({onBack:t}){const[n,s]=d.useState("ALL"),[r,i]=d.useState("ALL"),[a,c]=d.useState("ALL"),[u,b]=d.useState({}),[y,o]=d.useState({}),{show:g}=D(),l=Ft.filter(m=>(n==="ALL"||m.exam===n)&&(r==="ALL"||m.subject===r)&&(a==="ALL"||m.difficulty===a)),f=(m,h)=>{b(C=>({...C,[m]:h})),o(C=>({...C,[m]:!0}))},v=async(m,h)=>{try{await N.log({errorType:h,subject:m.subject,topic:`${m.exam} - ${m.topic}`,wrongReason:`Incorrect answer in ${m.exam} Question Bank.`,correctMethod:m.explanation,preventionRule:`Practice ${m.difficulty} problems on ${m.topic}.`}),g(`Logged ${h} error to Repair Queue!`,"#EF4444")}catch{g("Failed to log error","#DC2626")}};return e.jsxs("div",{style:{padding:16,maxWidth:900,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},children:[e.jsxs("div",{children:[e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#F5A623",margin:0},children:"MAT-Q Exam & Adaptive Question Bank"}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:"Filter questions by Exam (CAT, NMAT, SNAP, XAT, MAT), Subject, and Difficulty"})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:12,border:"1px solid #1E293B",marginBottom:16,display:"flex",flexDirection:"column",gap:10},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,overflowX:"auto",paddingBottom:4},children:[e.jsx("span",{style:{fontSize:11,fontWeight:800,color:"#F5A623"},children:"EXAM:"}),["ALL","CAT","NMAT","SNAP","XAT","MAT","CMAT"].map(m=>e.jsx("button",{onClick:()=>s(m),style:{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:700,border:n===m?"1px solid #F5A623":"1px solid #334155",background:n===m?"#1A56DB":"#1E293B",color:n===m?"#FFF":"#94A3B8",cursor:"pointer"},children:m},m))]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,overflowX:"auto"},children:[e.jsx("span",{style:{fontSize:11,fontWeight:800,color:"#38BDF8"},children:"SUBJECT:"}),["ALL","QA","DILR","VARC"].map(m=>e.jsx("button",{onClick:()=>i(m),style:{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:700,border:r===m?"1px solid #38BDF8":"1px solid #334155",background:r===m?"#0284C7":"#1E293B",color:r===m?"#FFF":"#94A3B8",cursor:"pointer"},children:m},m))]})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:16},children:l.map((m,h)=>{const C=u[m.id],j=C!==void 0,S=C===m.correctIndex;return e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"},children:[e.jsx("span",{style:{background:"#1A56DB",color:"#FFF",fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:4},children:m.exam}),e.jsxs("span",{style:{background:"#0284C7",color:"#FFF",fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:4},children:[m.subject," • ",m.topic]}),e.jsx("span",{style:{background:"#334155",color:"#F5A623",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4},children:m.difficulty})]}),e.jsxs("div",{style:{fontSize:14,color:"#F1F5F9",marginBottom:12},children:["Question ",h+1,": ",m.question]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:12},children:m.options.map((p,k)=>{let x="#1E293B",E="#334155",A="#CBD5E1";return j&&(k===m.correctIndex?(x="rgba(34,197,94,0.2)",E="#22C55E",A="#4ADE80"):k===C&&(x="rgba(239,68,68,0.2)",E="#EF4444",A="#FCA5A5")),e.jsxs("button",{onClick:()=>!j&&f(m.id,k),disabled:j,style:{textAlign:"left",padding:"10px 14px",borderRadius:8,fontSize:13,background:x,border:`1px solid ${E}`,color:A,cursor:j?"default":"pointer"},children:[String.fromCharCode(65+k),". ",p]},k)})}),j&&e.jsxs("div",{style:{padding:12,borderRadius:8,background:S?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${S?"#22C55E":"#EF4444"}`},children:[e.jsx("div",{style:{fontWeight:800,color:S?"#22C55E":"#EF4444",marginBottom:4},children:S?"✅ Correct Answer!":"❌ Incorrect Answer"}),e.jsxs("div",{style:{fontSize:12,color:"#CBD5E1",marginBottom:8},children:["💡 ",e.jsx("strong",{children:"Solution:"})," ",m.explanation]}),!S&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"},children:[e.jsx("span",{style:{fontSize:11,color:"#94A3B8"},children:"Log mistake type:"}),["C1","C2","C3","C4","C5"].map(p=>e.jsxs("button",{onClick:()=>v(m,p),style:{background:"#EF4444",border:"none",color:"#FFF",borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:800,cursor:"pointer"},children:["+ ",p]},p))]})]})]},m.id)})})]})}const K=[{id:"ls-1",title:"How to Ace VARC in CAT 2026 | Strategy & Speed Secrets",instructor:"Aniket Dhiman",credentials:"99.44%iler, IIM Mumbai",subject:"VARC",status:"RECORDED",date:"21 Jun 2026",time:"19:00 IST",durationMin:60,description:"RC passage approach under time pressure, options elimination matrix, and Para-jumble speed solving.",videoUrl:"https://youtube.com",notesUrl:"#"},{id:"ls-2",title:"Reading Comprehension 3-Hour Marathon | CAT 2026",instructor:"Jyoti Kathju",credentials:"25+ Years VARC Specialist",subject:"VARC",status:"RECORDED",date:"21 Jun 2026",time:"19:00 - 22:00 IST",durationMin:180,description:"3-hour non-stop RC marathon covering central ideas, inference questions, and author tone traps.",videoUrl:"https://youtube.com",notesUrl:"#"},{id:"ls-3",title:"DILR Unfamiliar Sets & Arrangement Masterclass",instructor:"Rohan Sharma",credentials:"CAT 99.85%iler, IIM Ahmedabad",subject:"LRDI",status:"UPCOMING",date:"Tomorrow",time:"20:00 IST",durationMin:90,description:"Mastering selection of unfamiliar DILR sets, games & tournaments, and row/column balancing.",notesUrl:"#"},{id:"ls-4",title:"QA Arithmetic Speed & Modern Math Tricks",instructor:"Vikramaditya",credentials:"CAT QA 100%iler",subject:"QA",status:"LIVE",date:"TODAY",time:"Live Right Now",durationMin:60,description:"Live interactive solving of Percentages, Ratio, TSD, and Modern Math short cuts.",videoUrl:"https://youtube.com",notesUrl:"#"}];function Nt({onBack:t}){const[n,s]=d.useState("ALL"),[r,i]=d.useState("ALL"),[a,c]=d.useState(null),{show:u}=D(),b=K.filter(v=>(n==="ALL"||v.status===n)&&(r==="ALL"||v.subject===r)),y=K.filter(v=>v.status==="LIVE").length,o=K.filter(v=>v.status==="UPCOMING").length,g=K.filter(v=>v.status==="RECORDED").length,l=v=>{u(`🔔 Reminder set for ${v.title}!`,"#38BDF8")},f=v=>{u(`📥 Handout PDF downloaded for ${v.subject} Live Session!`,"#22C55E")};return e.jsxs("div",{style:{padding:16,maxWidth:900,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:24},children:"📺"}),e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#F5A623",margin:0},children:"Live Sessions & Recorded Classes"})]}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:"Join live expert masterclasses, video lectures, marathons, and class notes"})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))",gap:10,marginBottom:16},children:[e.jsxs("div",{style:{background:"#0D1B2A",padding:12,borderRadius:10,border:"1px solid #1E293B",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:11,color:"#94A3B8"},children:"Total Sessions"}),e.jsx("div",{style:{fontSize:22,fontWeight:900,color:"#F1F5F9"},children:K.length})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:12,borderRadius:10,border:"1px solid #EF4444",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:11,color:"#EF4444",fontWeight:800},children:"🔴 Live Now"}),e.jsx("div",{style:{fontSize:22,fontWeight:900,color:"#EF4444"},children:y})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:12,borderRadius:10,border:"1px solid #F5A623",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:11,color:"#F5A623",fontWeight:800},children:"⏰ Upcoming"}),e.jsx("div",{style:{fontSize:22,fontWeight:900,color:"#F5A623"},children:o})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:12,borderRadius:10,border:"1px solid #22C55E",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:11,color:"#22C55E",fontWeight:800},children:"📼 Recorded"}),e.jsx("div",{style:{fontSize:22,fontWeight:900,color:"#22C55E"},children:g})]})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:12,border:"1px solid #1E293B",marginBottom:16,display:"flex",flexDirection:"column",gap:10},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,overflowX:"auto",paddingBottom:4},children:[e.jsx("span",{style:{fontSize:11,fontWeight:800,color:"#F5A623"},children:"STATUS:"}),["ALL","LIVE","UPCOMING","RECORDED"].map(v=>e.jsx("button",{onClick:()=>s(v),style:{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:700,border:n===v?"1px solid #F5A623":"1px solid #334155",background:n===v?"#1A56DB":"#1E293B",color:n===v?"#FFF":"#94A3B8",cursor:"pointer"},children:v==="LIVE"?"🔴 Live Now":v},v))]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,overflowX:"auto"},children:[e.jsx("span",{style:{fontSize:11,fontWeight:800,color:"#38BDF8"},children:"SECTION:"}),["ALL","VARC","LRDI","QA"].map(v=>e.jsx("button",{onClick:()=>i(v),style:{padding:"4px 12px",borderRadius:16,fontSize:11,fontWeight:700,border:r===v?"1px solid #38BDF8":"1px solid #334155",background:r===v?"#0284C7":"#1E293B",color:r===v?"#FFF":"#94A3B8",cursor:"pointer"},children:v},v))]})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:14},children:b.map(v=>e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:v.status==="LIVE"?"2px solid #EF4444":"1px solid #1E293B"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:4,background:v.status==="LIVE"?"#EF4444":v.status==="UPCOMING"?"#F5A623":"#22C55E",color:"#FFF"},children:v.status==="LIVE"?"🔴 LIVE NOW":v.status}),e.jsx("span",{style:{fontSize:11,fontWeight:800,color:"#38BDF8",background:"#1E293B",padding:"2px 8px",borderRadius:4},children:v.subject})]}),e.jsxs("div",{style:{fontSize:11,color:"#94A3B8"},children:["📅 ",v.date," • ",v.time," (",v.durationMin," min)"]})]}),e.jsx("h3",{style:{fontSize:16,fontWeight:800,color:"#F1F5F9",margin:"4px 0 6px"},children:v.title}),e.jsxs("div",{style:{fontSize:12,color:"#F5A623",fontWeight:700,marginBottom:8},children:["👨‍🏫 ",v.instructor," ",e.jsxs("span",{style:{color:"#94A3B8",fontWeight:400},children:["(",v.credentials,")"]})]}),e.jsx("p",{style:{fontSize:12,color:"#CBD5E1",margin:"0 0 12px",lineHeight:1.4},children:v.description}),e.jsxs("div",{style:{display:"flex",gap:8,flexWrap:"wrap",paddingTop:8,borderTop:"1px solid #1E293B"},children:[v.status==="LIVE"&&e.jsx("button",{onClick:()=>u("🔴 Joining Live Masterclass Video Stream...","#EF4444"),style:{background:"#EF4444",color:"#FFF",border:"none",padding:"8px 16px",borderRadius:6,fontWeight:800,cursor:"pointer",fontSize:12},children:"▶ Join Live Stream"}),v.status==="RECORDED"&&e.jsx("button",{onClick:()=>c(v),style:{background:"#1A56DB",color:"#FFF",border:"none",padding:"8px 16px",borderRadius:6,fontWeight:800,cursor:"pointer",fontSize:12},children:"▶ Watch Recording"}),v.status==="UPCOMING"&&e.jsx("button",{onClick:()=>l(v),style:{background:"#F5A623",color:"#000",border:"none",padding:"8px 16px",borderRadius:6,fontWeight:800,cursor:"pointer",fontSize:12},children:"🔔 Set Session Reminder"}),e.jsx("button",{onClick:()=>f(v),style:{background:"#1E293B",color:"#38BDF8",border:"1px solid #334155",padding:"8px 14px",borderRadius:6,fontSize:12,cursor:"pointer"},children:"📄 Class Notes PDF"})]})]},v.id))}),a&&e.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,zIndex:1e3},children:e.jsxs("div",{style:{background:"#0D1B2A",padding:20,borderRadius:12,maxWidth:600,width:"100%",border:"1px solid #38BDF8"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},children:[e.jsx("div",{style:{fontSize:14,fontWeight:800,color:"#38BDF8"},children:"📺 Recorded Masterclass"}),e.jsx("button",{onClick:()=>c(null),style:{background:"none",border:"none",color:"#FFF",fontSize:18,cursor:"pointer"},children:"✕"})]}),e.jsxs("div",{style:{background:"#1E293B",padding:40,borderRadius:8,textAlign:"center",marginBottom:12},children:[e.jsx("div",{style:{fontSize:40,marginBottom:8},children:"🎥"}),e.jsx("div",{style:{fontSize:15,fontWeight:800,color:"#FFF"},children:a.title}),e.jsxs("div",{style:{fontSize:12,color:"#94A3B8",marginTop:4},children:["Instructor: ",a.instructor," (",a.credentials,")"]})]}),e.jsx("button",{onClick:()=>{u("Video player launched in HD quality!","#22C55E"),c(null)},style:{width:"100%",padding:"12px",background:"#22C55E",color:"#FFF",fontWeight:800,border:"none",borderRadius:8,cursor:"pointer"},children:"▶ Play Full HD Video Lecture"})]})})]})}const Lt=[{prompt:"1 / 7 = ? %",answer:"14.28%",hint:"Think: 14 × 2 = 28"},{prompt:"1 / 8 = ? %",answer:"12.5%",hint:"Half of 1/4 (25%)"},{prompt:"1 / 9 = ? %",answer:"11.11%",hint:"Recurring 1s"},{prompt:"1 / 11 = ? %",answer:"9.09%",hint:"9s table"},{prompt:"1 / 13 = ? %",answer:"7.69%",hint:"Around 7.7%"},{prompt:"1 / 14 = ? %",answer:"7.14%",hint:"Half of 1/7"},{prompt:"1 / 16 = ? %",answer:"6.25%",hint:"Half of 1/8"}],zt=[{prompt:"19² = ?",answer:"361",hint:"(20-1)² = 400 - 40 + 1"},{prompt:"23² = ?",answer:"529",hint:"Around 530"},{prompt:"29² = ?",answer:"841",hint:"(30-1)² = 900 - 60 + 1"},{prompt:"31² = ?",answer:"961",hint:"Just over 900"},{prompt:"12³ = ?",answer:"1728",hint:"Ramanujan taxicab number!"},{prompt:"15³ = ?",answer:"3375",hint:"Ends in 375"}];function Mt({onBack:t}){const[n,s]=d.useState("fractions"),[r,i]=d.useState(0),[a,c]=d.useState(!1),{show:u}=D(),b=n==="fractions"?Lt:zt,y=b[r]||b[0],o=()=>{c(!1),i(l=>(l+1)%b.length)},g=()=>{u("⚡ Mastered card! Keep speeding up.","#22C55E"),o()};return e.jsxs("div",{style:{padding:16,maxWidth:600,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},children:[e.jsxs("div",{children:[e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#22C55E",margin:0},children:"⚡ MAT-Q Daily Speed Drills"}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:"5-minute daily mental math & calculation speed flashcards"})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:16},children:[e.jsx("button",{onClick:()=>{s("fractions"),i(0),c(!1)},style:{flex:1,padding:"10px",borderRadius:8,fontSize:12,fontWeight:800,background:n==="fractions"?"#22C55E":"#1E293B",color:n==="fractions"?"#FFF":"#94A3B8",border:"none",cursor:"pointer"},children:"% Fractions (1/7 to 1/16)"}),e.jsx("button",{onClick:()=>{s("squares"),i(0),c(!1)},style:{flex:1,padding:"10px",borderRadius:8,fontSize:12,fontWeight:800,background:n==="squares"?"#22C55E":"#1E293B",color:n==="squares"?"#FFF":"#94A3B8",border:"none",cursor:"pointer"},children:"Squares & Cubes"})]}),e.jsxs("div",{style:{background:"linear-gradient(135deg, #0D1B2A 0%, #1E293B 100%)",padding:24,borderRadius:16,border:"1px solid #334155",textAlign:"center",marginBottom:16},children:[e.jsxs("div",{style:{fontSize:12,color:"#94A3B8",marginBottom:8},children:["Card ",r+1," of ",b.length]}),e.jsx("div",{style:{fontSize:32,fontWeight:900,color:"#F1F5F9",margin:"16px 0"},children:y.prompt}),a?e.jsxs("div",{style:{background:"rgba(34,197,94,0.15)",border:"1px solid #22C55E",padding:16,borderRadius:10,margin:"16px 0"},children:[e.jsx("div",{style:{fontSize:28,fontWeight:900,color:"#4ADE80"},children:y.answer}),e.jsxs("div",{style:{fontSize:12,color:"#CBD5E1",marginTop:4},children:["💡 Hint: ",y.hint]})]}):e.jsx("button",{onClick:()=>c(!0),style:{padding:"10px 20px",borderRadius:20,background:"#F5A623",color:"#000",fontWeight:800,border:"none",cursor:"pointer",margin:"16px 0"},children:"👁️ Reveal Answer"}),e.jsxs("div",{style:{display:"flex",gap:10,justifyContent:"center",marginTop:12},children:[e.jsx("button",{onClick:g,style:{padding:"8px 16px",borderRadius:8,background:"#22C55E",color:"#FFF",fontWeight:800,border:"none",cursor:"pointer"},children:"✅ I Knew This"}),e.jsx("button",{onClick:o,style:{padding:"8px 16px",borderRadius:8,background:"#334155",color:"#94A3B8",fontWeight:700,border:"none",cursor:"pointer"},children:"➡️ Next Card"})]})]})]})}const ue=[{id:"qa-pct",subject:"QA",name:"Percentages & Fractional Equivalents",category:"Arithmetic",catFrequency:"High (3–4 Qs in CAT every year directly or in DILR)",expectedQuestions:"2–3 Direct + 2 DILR Sets",conceptSummary:"Percentages are the core backbone of Arithmetic and DILR. Mastery of fraction-to-percentage conversion reduces calculation time by 80%.",formulas:[{title:"Percentage Change",formula:"Δ% = ((Final - Initial) / Initial) × 100",note:"Always divide by the Initial base value."},{title:"Successive Change",formula:"A + B + (A × B / 100)",note:"Use positive for increase, negative for decrease."},{title:"Inverse Relation",formula:"If price increases by x/y, consumption decreases by x / (y + x)",note:"Crucial for TSD and Expenditure problems."}],shortcuts:[{title:"Fraction Table Speed Recall",desc:"1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%, 1/13 = 7.69%, 1/14 = 7.14%",example:"Calculate 37.5% of 640 → 3 × (1/8) × 640 = 3 × 80 = 240."},{title:"Multiplying Factor Method",desc:"20% increase = ×1.2, 15% decrease = ×0.85",example:"100 → +20% → -10% = 100 × 1.2 × 0.9 = 108 (+8% net)."}],traps:[{errorType:"C3",trap:'Confusing "A is x% more than B" with "B is x% less than A".',preventionRule:'Base is always what comes after "than" or "of".'},{errorType:"C2",trap:"Adding percentages directly when bases are different.",preventionRule:"Never add percentages unless the base amount is identical."}],practiceQuestions:[{id:"q1",question:"If the price of sugar increases by 25%, by what percentage must a household reduce its sugar consumption so that the total expenditure remains unchanged?",options:["15%","20%","25%","33.33%"],correctIndex:1,explanation:"Increase = 25% = 1/4 (x/y = 1/4). Reduction required = x / (y + x) = 1 / (4 + 1) = 1/5 = 20%."},{id:"q2",question:"A salary is first increased by 20% and then decreased by 20%. What is the net percentage change in salary?",options:["No change","4% increase","4% decrease","2% decrease"],correctIndex:2,explanation:"Net change = A + B + AB/100 = 20 - 20 - (20×20)/100 = -4% (4% decrease)."}]},{id:"qa-tsd",subject:"QA",name:"Time, Speed & Distance (TSD)",category:"Arithmetic",catFrequency:"Very High (2–3 Qs per slot)",expectedQuestions:"2–3 Questions",conceptSummary:"Distance = Speed × Time. Relative speed and average speed are the two most tested areas in CAT TSD problems.",formulas:[{title:"Average Speed (Equal Distances)",formula:"Avg Speed = (2 × S1 × S2) / (S1 + S2)",note:"Do NOT take arithmetic average (S1+S2)/2!"},{title:"Relative Speed",formula:"Same dir = |S1 - S2|, Opposite dir = S1 + S2",note:"Use when two objects are moving simultaneously."},{title:"Boats & Streams",formula:"Downstream = B + S, Upstream = B - S",note:"B = (Down + Up)/2, S = (Down - Up)/2"}],shortcuts:[{title:"Ratio of Time & Speed",desc:"When Distance is constant, Speed ∝ 1/Time. If Speed ratio is 3:4, Time ratio is 4:3.",example:"Time saved = 1 part of ratio."}],traps:[{errorType:"C2",trap:"Mixing km/h and m/s without unit conversion.",preventionRule:"1 km/h = 5/18 m/s. Always check units before adding/multiplying."},{errorType:"C4",trap:"Taking average speed as simple average of speeds.",preventionRule:"Avg Speed = Total Distance / Total Time. Use harmonic mean for equal distances."}],practiceQuestions:[{id:"q3",question:"A car travels from A to B at 60 km/h and returns from B to A at 40 km/h. What is the average speed for the entire journey?",options:["50 km/h","48 km/h","45 km/h","52 km/h"],correctIndex:1,explanation:"Avg Speed = (2 × 60 × 40) / (60 + 40) = 4800 / 100 = 48 km/h."}]},{id:"dl-tbl",subject:"DILR",name:"Tables, Caselets & Logic-Heavy Sets",category:"Data Interpretation",catFrequency:"High (At least 1 full set in every CAT slot)",expectedQuestions:"1 Set (5 Questions)",conceptSummary:"DILR Table sets require scanning, fast estimation, and identifying missing entries through row/column totals.",formulas:[{title:"Column/Row Balancing",formula:"Sum(Rows) = Sum(Columns) = Grand Total",note:"Fill missing data first before answering."},{title:"Growth Rate Comparison",formula:"Growth = (New - Old) / Old",note:"Compare fractions quickly using cross-multiplication."}],shortcuts:[{title:"Option Elimination in DILR",desc:"Check extreme options first. Usually 2 options can be eliminated in 5 seconds.",example:"If total is ~500, option 1200 is impossible."}],traps:[{errorType:"C5",trap:"Spending > 5 minutes on a set without completing 1 question.",preventionRule:"Set selection strategy: Abandon set if 0 clues unlocked after 3 minutes!"}],practiceQuestions:[{id:"q4",question:"In a table of 4 teams playing 3 matches each, if Team A has 2 wins and 1 draw, how many points do they have (Win=3, Draw=1, Loss=0)?",options:["5","6","7","8"],correctIndex:2,explanation:"Points = (2 × 3) + (1 × 1) = 6 + 1 = 7 points."}]},{id:"vc-mi",subject:"VARC",name:"RC Main Idea & Elimination Strategy",category:"Reading Comprehension",catFrequency:"Very High (12–16 Qs in VARC)",expectedQuestions:"4 Passages (16 Qs)",conceptSummary:"Main Idea questions ask for the central thesis of the passage. Eliminating distorted, too narrow, or too broad options is key.",formulas:[{title:"Paragraph Mapping",formula:"P1 (Topic) + P2 (Argument) + P3 (Counter) → Conclusion",note:"Write a 3-word summary per paragraph in your mind."}],shortcuts:[{title:"4-Filter Elimination",desc:"1. Out of Scope (not mentioned), 2. Extreme (Always/Never/Only), 3. Opposite (Distorted), 4. Too Narrow (Detail, not Main Idea)",example:"Correct option captures author's tone and primary argument."}],traps:[{errorType:"C3",trap:"Choosing an option that is true according to the passage but is only a minor detail.",preventionRule:'A detail cannot be the Main Idea. Ask: "Does the author discuss this in the whole passage?"'}],practiceQuestions:[{id:"q5",question:'Which of the following option types is most likely WRONG for a "Main Idea" RC question?',options:["Captures overall thesis","Focuses on a single paragraph example","Reflects author's tone","Encompasses all major arguments"],correctIndex:1,explanation:'Single paragraph example is "Too Narrow" and represents a detail, not the overarching Main Idea.'}]}];function Pt({onBack:t}){const[n,s]=d.useState("qa-pct"),[r,i]=d.useState("concept"),[a,c]=d.useState(""),[u,b]=d.useState({}),[y,o]=d.useState({}),{show:g}=D(),l=ue.find(h=>h.id===n)||ue[0],f=ue.filter(h=>h.name.toLowerCase().includes(a.toLowerCase())||h.subject.toLowerCase().includes(a.toLowerCase())||h.category.toLowerCase().includes(a.toLowerCase())),v=(h,C)=>{b(j=>({...j,[h]:C})),o(j=>({...j,[h]:!0}))},m=async(h,C)=>{try{await N.log({errorType:C,subject:l.subject,topic:l.name,wrongReason:`Incorrect answer on practice question ${h} in Deep Research.`,correctMethod:`Review Research concept and shortcuts for ${l.name}.`,preventionRule:"Apply prevention rule from Deep Research traps table."}),g(`Logged ${C} error to Error Log & Repair Queue!`,"#EF4444")}catch{g("Failed to log error","#DC2626")}};return e.jsxs("div",{style:{padding:"16px",maxWidth:900,margin:"0 auto",color:"#E2E8F0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:24},children:"🔬"}),e.jsx("h1",{style:{fontSize:22,fontWeight:900,color:"#F5A623",margin:0},children:"Deep Research & Concept Engine"})]}),e.jsx("p",{style:{fontSize:13,color:"#94A3B8",margin:"4px 0 0"},children:"AI-driven topic breakdowns, formula tricks, C1–C5 trap warnings, and CAT historical trends"})]}),t&&e.jsx("button",{onClick:t,style:{background:"none",border:"1px solid #334155",color:"#94A3B8",borderRadius:20,padding:"6px 16px",fontSize:12,cursor:"pointer"},children:"← Back"})]}),e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:12,border:"1px solid #1E293B",marginBottom:16},children:[e.jsx("input",{type:"text",placeholder:"🔍 Search any CAT topic, formula, or concept (e.g. Percentages, TSD, DILR Tables)...",value:a,onChange:h=>c(h.target.value),style:{width:"100%",padding:"10px 14px",borderRadius:8,background:"#1E293B",border:"1px solid #334155",color:"#FFF",fontSize:13,outline:"none",marginBottom:12}}),e.jsx("div",{style:{display:"flex",gap:8,overflowX:"auto",paddingBottom:4},children:f.map(h=>e.jsxs("button",{onClick:()=>s(h.id),style:{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,border:h.id===n?"1px solid #F5A623":"1px solid #334155",background:h.id===n?"rgba(245,166,35,0.15)":"#1E293B",color:h.id===n?"#F5A623":"#94A3B8",cursor:"pointer",whiteSpace:"nowrap"},children:["[",h.subject,"] ",h.name]},h.id))})]}),e.jsx("div",{style:{background:"linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",padding:16,borderRadius:12,border:"1px solid #334155",marginBottom:16},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8},children:[e.jsxs("div",{children:[e.jsxs("span",{style:{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:4,background:"#1A56DB",color:"#FFF"},children:[l.subject," • ",l.category]}),e.jsx("h2",{style:{fontSize:18,fontWeight:800,color:"#F1F5F9",margin:"6px 0 2px"},children:l.name}),e.jsx("div",{style:{fontSize:12,color:"#94A3B8"},children:l.conceptSummary})]}),e.jsxs("div",{style:{background:"rgba(245,166,35,0.1)",border:"1px solid rgba(245,166,35,0.3)",padding:"8px 12px",borderRadius:8},children:[e.jsx("div",{style:{fontSize:11,color:"#F5A623",fontWeight:700},children:"CAT Weightage"}),e.jsx("div",{style:{fontSize:12,fontWeight:800,color:"#FFF"},children:l.catFrequency})]})]})}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:16,borderBottom:"1px solid #334155",paddingBottom:8},children:[e.jsx("button",{onClick:()=>i("concept"),style:{padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:700,background:r==="concept"?"#1A56DB":"transparent",color:r==="concept"?"#FFF":"#94A3B8",border:"none",cursor:"pointer"},children:"📘 Core Concepts & Formulas"}),e.jsx("button",{onClick:()=>i("shortcuts"),style:{padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:700,background:r==="shortcuts"?"#1A56DB":"transparent",color:r==="shortcuts"?"#FFF":"#94A3B8",border:"none",cursor:"pointer"},children:"⚡ Speed Shortcuts"}),e.jsx("button",{onClick:()=>i("traps"),style:{padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:700,background:r==="traps"?"#1A56DB":"transparent",color:r==="traps"?"#FFF":"#94A3B8",border:"none",cursor:"pointer"},children:"⚠️ C1–C5 Traps & Rules"}),e.jsx("button",{onClick:()=>i("quiz"),style:{padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:700,background:r==="quiz"?"#1A56DB":"transparent",color:r==="quiz"?"#FFF":"#94A3B8",border:"none",cursor:"pointer"},children:"🧪 CAT Practice Quiz"})]}),r==="concept"&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:l.formulas.map((h,C)=>e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:10,border:"1px solid #1E293B"},children:[e.jsx("div",{style:{fontSize:14,fontWeight:700,color:"#38BDF8",marginBottom:4},children:h.title}),e.jsx("div",{style:{background:"#1E293B",padding:"10px 14px",borderRadius:6,fontFamily:"monospace",fontSize:14,color:"#F5A623",margin:"6px 0"},children:h.formula}),e.jsxs("div",{style:{fontSize:12,color:"#94A3B8",fontStyle:"italic"},children:["💡 Key Note: ",h.note]})]},C))}),r==="shortcuts"&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:l.shortcuts.map((h,C)=>e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:10,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{fontSize:14,fontWeight:700,color:"#22C55E",marginBottom:4},children:["⚡ ",h.title]}),e.jsx("div",{style:{fontSize:13,color:"#E2E8F0",margin:"4px 0"},children:h.desc}),h.example&&e.jsxs("div",{style:{background:"rgba(34,197,94,0.1)",padding:10,borderRadius:6,fontSize:12,color:"#4ADE80",marginTop:6},children:[e.jsx("strong",{children:"Example:"})," ",h.example]})]},C))}),r==="traps"&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:l.traps.map((h,C)=>e.jsxs("div",{style:{background:"#0D1B2A",padding:14,borderRadius:10,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6},children:[e.jsxs("span",{style:{background:"#EF4444",color:"#FFF",fontSize:10,fontWeight:800,padding:"2px 6px",borderRadius:4},children:[h.errorType," Error Trap"]}),e.jsx("span",{style:{fontSize:13,fontWeight:700,color:"#F87171"},children:h.trap})]}),e.jsxs("div",{style:{background:"rgba(239,68,68,0.1)",borderLeft:"3px solid #EF4444",padding:"8px 12px",borderRadius:4,fontSize:12,color:"#FCA5A5"},children:["🛡️ ",e.jsx("strong",{children:"Prevention Rule:"})," ",h.preventionRule]})]},C))}),r==="quiz"&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:16},children:l.practiceQuestions.map((h,C)=>{const j=u[h.id],S=j!==void 0,p=j===h.correctIndex;return e.jsxs("div",{style:{background:"#0D1B2A",padding:16,borderRadius:12,border:"1px solid #1E293B"},children:[e.jsxs("div",{style:{fontSize:14,fontWeight:700,color:"#F1F5F9",marginBottom:12},children:["Question ",C+1,": ",h.question]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:12},children:h.options.map((k,x)=>{let E="#1E293B",A="#334155",w="#CBD5E1";return S&&(x===h.correctIndex?(E="rgba(34,197,94,0.2)",A="#22C55E",w="#4ADE80"):x===j&&(E="rgba(239,68,68,0.2)",A="#EF4444",w="#FCA5A5")),e.jsxs("button",{onClick:()=>!S&&v(h.id,x),disabled:S,style:{textAlign:"left",padding:"10px 14px",borderRadius:8,background:E,border:`1px solid ${A}`,color:w,fontSize:13,cursor:S?"default":"pointer"},children:[String.fromCharCode(65+x),". ",k]},x)})}),S&&e.jsxs("div",{style:{marginTop:12,padding:12,borderRadius:8,background:p?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${p?"#22C55E":"#EF4444"}`},children:[e.jsx("div",{style:{fontWeight:800,color:p?"#22C55E":"#EF4444",marginBottom:4},children:p?"✅ Correct Answer!":"❌ Incorrect Answer"}),e.jsxs("div",{style:{fontSize:12,color:"#CBD5E1",marginBottom:8},children:[e.jsx("strong",{children:"Step-by-step Solution:"})," ",h.explanation]}),!p&&e.jsxs("div",{style:{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginTop:8},children:[e.jsx("span",{style:{fontSize:11,color:"#94A3B8"},children:"Log error as:"}),["C1","C2","C3","C4","C5"].map(k=>e.jsxs("button",{onClick:()=>m(h.id,k),style:{background:"#EF4444",border:"none",color:"#FFF",borderRadius:4,padding:"3px 8px",fontSize:11,fontWeight:700,cursor:"pointer"},children:["+ ",k]},k))]})]})]},h.id)})})]})}const ke=[{code:"C1",name:"Concept Gap",desc:"Did not know / weak concept — most dangerous.",bg:"e1",col:"#F87171"},{code:"C2",name:"Calculation",desc:"Formula or arithmetic mistake.",bg:"e2",col:"#FCD34D"},{code:"C3",name:"Misread Data",desc:"Wrong data / condition read from question.",bg:"e3",col:"#93C5FD"},{code:"C4",name:"Wrong Approach",desc:"Chose wrong method or option.",bg:"e4",col:"#A78BFA"},{code:"C5",name:"Time Mgmt",desc:"Too slow or too rushed.",bg:"e5",col:"#F9A8D4"}];function Wt({onBack:t}){const{errors:n,counts:s,logError:r}=fe(),{show:i}=D(),[a,c]=d.useState("C1"),[u,b]=d.useState("QA"),[y,o]=d.useState(""),[g,l]=d.useState(""),[f,v]=d.useState(""),[m,h]=d.useState(""),C=ie[u]||[];async function j(){if(!y){i("Select a topic","#D97706");return}if(!g.trim()){i("Describe what went wrong","#D97706");return}if(!f.trim()){i("Write the correct method","#D97706");return}const p=C.find(k=>k.id===y)?.name??y;await r({errorType:a,subject:u,topicId:y,topic:p,wrongReason:g.trim(),correctMethod:f.trim(),preventionRule:m.trim()}),o(""),l(""),v(""),h(""),i("Error logged + Repair task created ✓")}const S=n.slice(0,10);return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsx("div",{className:"page-header-title",children:"Error Log — C1 to C5"})]}),e.jsx("div",{className:"grid3",style:{gap:6,marginBottom:12},children:ke.map(p=>e.jsxs("div",{className:`card-sm ${p.bg}`,style:{textAlign:"center",padding:10},children:[e.jsx("div",{style:{fontSize:22,fontWeight:900,fontFamily:"monospace",color:p.col},children:p.code}),e.jsx("div",{style:{fontSize:11,fontWeight:700},children:p.name}),e.jsx("div",{style:{fontSize:24,fontWeight:900,fontFamily:"monospace",color:p.col},children:s[p.code]||0})]},p.code))}),e.jsxs("div",{className:"card",style:{borderColor:"rgba(245,166,35,.3)"},children:[e.jsx("div",{className:"card-title",children:"Log a Specific Error"}),e.jsx("select",{className:"form-select",value:a,onChange:p=>c(p.target.value),style:{marginBottom:8},children:ke.map(p=>e.jsxs("option",{value:p.code,children:[p.code," — ",p.name]},p.code))}),e.jsxs("div",{className:"grid2",style:{gap:8,marginBottom:8},children:[e.jsxs("select",{className:"form-select",value:u,onChange:p=>{b(p.target.value),o("")},children:[e.jsx("option",{value:"QA",children:"QA"}),e.jsx("option",{value:"DILR",children:"DILR"}),e.jsx("option",{value:"VARC",children:"VARC"})]}),e.jsxs("select",{className:"form-select",value:y,onChange:p=>o(p.target.value),children:[e.jsx("option",{value:"",children:"Select topic…"}),C.map(p=>e.jsx("option",{value:p.id,children:p.name},p.id))]})]}),e.jsx("textarea",{className:"textarea-input",placeholder:"What went wrong?",value:g,onChange:p=>l(p.target.value),style:{marginBottom:6}}),e.jsx("textarea",{className:"textarea-input",placeholder:"Correct method is…",value:f,onChange:p=>v(p.target.value),style:{marginBottom:6}}),e.jsx("input",{type:"text",className:"form-input",placeholder:"Prevention rule: Next time I will…",value:m,onChange:p=>h(p.target.value),style:{marginBottom:10}}),e.jsx("button",{className:"btn-primary",onClick:j,children:"📝 Log Error + Create Repair Task"})]}),e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-title",children:["Recent Errors (",n.length," total)"]}),S.length===0?e.jsx(q,{icon:"✅",title:"NO ERRORS YET",sub:"No errors logged. Log errors as you study to build your repair queue."}):S.map(p=>e.jsxs("div",{style:{background:"var(--navy3)",borderRadius:10,padding:12,marginBottom:8},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6},children:[e.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:"rgba(220,38,38,.2)",color:"#F87171"},children:p.errorType}),e.jsxs("span",{style:{fontSize:10,color:"var(--muted)"},children:[p.subject," · ",p.topic]}),e.jsx("span",{style:{fontSize:9,color:"var(--muted2)"},children:p.createdAt.slice(0,10)})]}),e.jsxs("div",{style:{fontSize:11,color:"var(--muted)",marginBottom:4},children:["❌ ",p.wrongReason]}),e.jsxs("div",{style:{fontSize:11,color:"#22C55E",marginBottom:6},children:["✓ ",p.correctMethod]}),p.preventionRule&&e.jsxs("div",{style:{fontSize:10,color:"var(--gold)",marginBottom:6},children:["Rule: ",p.preventionRule]}),e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsxs("span",{style:{fontSize:9,padding:"2px 8px",borderRadius:8,background:p.repairStatus==="DONE"?"rgba(22,163,74,.2)":"rgba(219,39,119,.2)",color:p.repairStatus==="DONE"?"#22C55E":"#DB2777"},children:["Repair: ",p.repairStatus]}),e.jsxs("span",{style:{fontSize:9,padding:"2px 8px",borderRadius:8,background:p.retestStatus==="PASSED"?"rgba(22,163,74,.2)":"rgba(14,159,159,.2)",color:p.retestStatus==="PASSED"?"#22C55E":"#0E9F9F"},children:["Retest: ",p.retestStatus]})]})]},p.id))]})]})}function Ot({onBack:t}){const{pending:n,markRepaired:s}=fe(),{show:r}=D();async function i(a,c){await s(a),r(`✓ ${c} moved to Retest queue`)}return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsxs("div",{className:"page-header-title",children:["Repair Queue (",n.length,")"]})]}),e.jsx("div",{className:"card",style:{background:"rgba(219,39,119,.08)",borderColor:"rgba(219,39,119,.3)"},children:e.jsxs("div",{style:{fontSize:12,color:"var(--muted)",lineHeight:1.6},children:[e.jsx("strong",{style:{color:"var(--text)"},children:"Repair = Re-solve without looking at the solution."}),e.jsx("br",{}),"Close solution → think fresh → attempt alone → verify → then mark repaired."]})}),n.length===0?e.jsx(q,{icon:"✅",title:"REPAIR QUEUE EMPTY",sub:"No pending repairs. Keep logging errors as you study."}):n.map(a=>e.jsxs("div",{className:"repair-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6},children:[e.jsxs("span",{style:{fontSize:11,fontWeight:700,color:"#DB2777"},children:[a.errorType," · ",a.subject]}),e.jsx("span",{style:{fontSize:10,color:"var(--muted)"},children:a.createdAt.slice(0,10)})]}),e.jsx("div",{style:{fontSize:13,fontWeight:700,marginBottom:4},children:a.topic}),e.jsxs("div",{style:{fontSize:11,color:"var(--muted)",marginBottom:4},children:["❌ ",a.wrongReason]}),e.jsxs("div",{style:{fontSize:11,color:"#22C55E",marginBottom:4},children:["✓ ",a.correctMethod]}),a.preventionRule&&e.jsxs("div",{style:{fontSize:10,color:"var(--gold)",marginBottom:8},children:["Rule: ",a.preventionRule]}),e.jsx("div",{style:{fontSize:10,color:"var(--muted)",fontStyle:"italic",marginBottom:10},children:"Close solution → attempt fresh → verify → mark repaired below."}),e.jsx("button",{style:{background:"#DB2777",border:"none",color:"white",borderRadius:8,padding:"10px 16px",fontSize:12,fontWeight:700,cursor:"pointer",width:"100%"},onClick:()=>i(a.id,a.topic),children:"✓ Repaired — Move to Retest"})]},a.id))]})}const qt=.6;function Qt({error:t,onSubmit:n}){const[s,r]=d.useState(""),[i,a]=d.useState(""),[c,u]=d.useState("");function b(){const y=parseInt(s),o=parseInt(i);if(isNaN(o)||o<=0){u("Enter how many questions you attempted");return}if(isNaN(y)||y<0){u("Enter how many you got correct");return}if(y>o){u("Correct can't exceed total attempted");return}u(""),n(t.id,y,o,y/o>=qt)}return e.jsxs("div",{className:"retest-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6},children:[e.jsxs("span",{style:{fontSize:11,fontWeight:700,color:"#0E9F9F"},children:[t.errorType," · ",t.subject]}),e.jsxs("span",{style:{fontSize:10,color:"var(--muted)"},children:["Repaired: ",(t.repairedAt||"").slice(0,10)]})]}),e.jsx("div",{style:{fontSize:13,fontWeight:700,marginBottom:4},children:t.topic}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)",marginBottom:10},children:"Take 2–5 fresh questions without notes, then enter your real result. 60%+ = mastered."}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"flex-end",marginBottom:c?6:10},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:9,color:"var(--muted)",marginBottom:3,textTransform:"uppercase"},children:"Correct"}),e.jsx("input",{type:"number",className:"form-input",placeholder:"e.g. 3",min:0,value:s,onChange:y=>r(y.target.value)})]}),e.jsx("div",{style:{fontSize:16,color:"var(--muted)",paddingBottom:10},children:"/"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{fontSize:9,color:"var(--muted)",marginBottom:3,textTransform:"uppercase"},children:"Out of"}),e.jsx("input",{type:"number",className:"form-input",placeholder:"e.g. 5",min:1,value:i,onChange:y=>a(y.target.value)})]})]}),c&&e.jsx("div",{style:{fontSize:11,color:"#F87171",marginBottom:8},children:c}),e.jsx("button",{style:{width:"100%",background:"#0E9F9F",border:"none",color:"white",borderRadius:8,padding:10,fontSize:12,fontWeight:700,cursor:"pointer"},onClick:b,children:"Submit Retest Result"})]})}function $t({onBack:t}){const{inRetest:n,retestPass:s,retestFail:r}=fe(),{show:i}=D();async function a(c,u,b,y){y?(await s(c,u,b),i(`✓ Retest passed (${u}/${b}) — Mastery updated!`)):(await r(c,u,b),i(`Back to Repair (${u}/${b} — below 60%)`,"#D97706"))}return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsxs("div",{className:"page-header-title",children:["Retest Queue (",n.length,")"]})]}),e.jsx("div",{className:"card",style:{background:"rgba(14,159,159,.08)",borderColor:"rgba(14,159,159,.3)"},children:e.jsxs("div",{style:{fontSize:12,color:"var(--muted)",lineHeight:1.6},children:[e.jsx("strong",{style:{color:"var(--text)"},children:"Retest = Fresh questions, no notes."}),e.jsx("br",{}),"Enter your real result — 60%+ correct updates mastery evidence for this topic. Below 60% sends it back to Repair."]})}),n.length===0?e.jsx(q,{icon:"✅",title:"RETEST QUEUE EMPTY",sub:"All repaired items have been retested. Great work!"}):n.map(c=>e.jsx(Qt,{error:c,onSubmit:a},c.id))]})}function Vt({onBack:t}){const[n,s]=d.useState([]),[r,i]=d.useState(""),[a,c]=d.useState(""),[u,b]=d.useState(""),[y,o]=d.useState(""),[g,l]=d.useState(""),[f,v]=d.useState(""),[m,h]=d.useState(""),[C,j]=d.useState(""),{show:S}=D(),p=async()=>s((await ne.getAll()).sort((x,E)=>E.createdAt.localeCompare(x.createdAt)));d.useEffect(()=>{p()},[]);async function k(){const x=He({qa:a,dilr:u,varc:y,qaat:g,dlat:f,vcat:m}),E=r.trim()||`Mock ${n.length+1}`;await ne.log({name:E,date:oe(),...x});const A=[`Total: ${x.total} | Attempts: ${x.att} | Accuracy: ${x.overall}%`,`QA: ${x.qaAcc}% · DILR: ${x.dlAcc}% · VARC: ${x.vcAcc}%`,x.weak.length?`
⚠️ Repair Priorities:
• `+x.weak.join(`
• `):`
✓ Strong performance!`];j(A.join(`
`)),i(""),c(""),b(""),o(""),l(""),v(""),h(""),S("Mock logged + analysed ✓"),await p()}return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsx("div",{className:"page-header-title",children:"Mock Analysis"})]}),e.jsx("div",{className:"card",style:{background:"rgba(217,119,6,.08)",borderColor:"rgba(217,119,6,.3)"},children:e.jsxs("div",{style:{fontSize:11,color:"var(--muted)"},children:["NO mock is DONE until ANALYSED."," ",e.jsx("strong",{style:{color:"var(--text)"},children:"Minimum 2 hours analysis per mock."})]})}),e.jsxs("div",{className:"card",style:{borderColor:"rgba(245,166,35,.3)"},children:[e.jsx("div",{className:"card-title",children:"Log New Mock"}),e.jsx("input",{type:"text",className:"form-input",placeholder:"Mock name (e.g. SimCAT 1)",value:r,onChange:x=>i(x.target.value),style:{marginBottom:8}}),e.jsx("div",{className:"grid3",style:{gap:6,marginBottom:6},children:[["QA Score",a,c],["DILR Score",u,b],["VARC Score",y,o]].map(([x,E,A])=>e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:9,color:"var(--muted)",marginBottom:3},children:x}),e.jsx("input",{type:"number",className:"form-input",placeholder:"0",min:0,value:E,onChange:w=>A(w.target.value)})]},x))}),e.jsx("div",{className:"grid3",style:{gap:6,marginBottom:10},children:[["QA Attempts",g,l],["DILR Attempts",f,v],["VARC Attempts",m,h]].map(([x,E,A])=>e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:9,color:"var(--muted)",marginBottom:3},children:x}),e.jsx("input",{type:"number",className:"form-input",placeholder:"0",min:0,value:E,onChange:w=>A(w.target.value)})]},x))}),e.jsx("button",{className:"btn-primary",onClick:k,children:"📊 Log + Analyse Mock"}),C&&e.jsx("div",{className:"feedback-box",children:C})]}),e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-title",children:["Mock History (",n.length,")"]}),n.length===0?e.jsx(q,{icon:"📝",title:"NO MOCKS YET",sub:"Log your first mock using the form above."}):n.map((x,E)=>e.jsxs("div",{style:{background:"var(--navy3)",borderRadius:10,padding:12,marginBottom:8},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},children:[e.jsx("div",{style:{fontSize:13,fontWeight:700},children:x.name||`Mock ${n.length-E}`}),e.jsx("div",{style:{fontSize:10,color:"var(--muted)"},children:x.date})]}),e.jsxs("div",{className:"mock-score-grid",children:[e.jsxs("div",{className:"mock-score-box",children:[e.jsx("div",{className:"mock-score-val",style:{color:"#F5A623"},children:x.total}),e.jsx("div",{className:"mock-score-lbl",children:"Score"})]}),e.jsxs("div",{className:"mock-score-box",children:[e.jsxs("div",{className:"mock-score-val",style:{color:"#22C55E"},children:[x.overall,"%"]}),e.jsx("div",{className:"mock-score-lbl",children:"Accuracy"})]}),e.jsxs("div",{className:"mock-score-box",children:[e.jsx("div",{className:"mock-score-val",style:{color:"#3B82F6"},children:x.att}),e.jsx("div",{className:"mock-score-lbl",children:"Attempts"})]})]}),e.jsx("div",{className:"grid3",style:{gap:4,marginTop:6},children:[["QA",x.qaAcc,"#16A34A"],["DILR",x.dlAcc,"#2563EB"],["VARC",x.vcAcc,"#7C3AED"]].map(([A,w,R])=>e.jsxs("div",{style:{textAlign:"center",fontSize:10},children:[e.jsxs("div",{style:{color:R,fontWeight:700},children:[w,"%"]}),e.jsx("div",{style:{color:"var(--muted)"},children:A})]},A))}),x.weak&&x.weak.length>0&&e.jsxs("div",{style:{marginTop:6,fontSize:10,color:"#EF4444"},children:["⚠️ ",x.weak[0]]})]},x.id))]})]})}function Ut({onBack:t}){return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsx("div",{className:"page-header-title",children:"Daily Schedule"})]}),e.jsx("div",{className:"card",style:{background:"linear-gradient(135deg,rgba(14,159,159,.1),rgba(37,99,235,.1))",borderColor:"rgba(14,159,159,.3)",marginBottom:12},children:e.jsx("div",{style:{fontSize:11,color:"var(--muted)"},children:"Preserve priority structure even when exact times shift."})}),Be.map((n,s)=>e.jsxs("div",{style:{display:"flex",gap:12,marginBottom:10},children:[e.jsx("div",{style:{width:2,background:n.col,flexShrink:0,borderRadius:2}}),e.jsxs("div",{className:"card",style:{marginBottom:0,flex:1,padding:12},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx("span",{style:{fontSize:16},children:n.icon}),e.jsx("span",{style:{fontSize:12,fontWeight:700,color:n.col},children:n.block})]}),e.jsx("div",{style:{fontSize:10,fontFamily:"monospace",color:"var(--muted)",background:"var(--navy3)",padding:"2px 8px",borderRadius:8},children:n.time})]}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)"},children:n.detail})]})]},s))]})}const Se=[{step:"CAT 2026 ← ACTIVE",col:"#F5A623",desc:"Current and ONLY mission. 29 November 2026."},{step:"MBA / College",col:"#3B82F6",desc:"IIMs + Top B-Schools. Interviews, WAT, AWT."},{step:"Business Capability",col:"#0E9F9F",desc:"Learn strategy, marketing, finance, product."},{step:"Build MVP / Product",col:"#D97706",desc:"Customer problem → Product → Validation → Revenue."},{step:"Grow Team + Revenue",col:"#DC2626",desc:"Team → Scale → Market expansion."},{step:"Scale + Expand",col:"#7C3AED",desc:"Systems, operations, leadership."},{step:"Health, Wealth, Family + Impact",col:"#F5A623",desc:"Long-term legacy."}],Gt=[["2026–27","Crack CAT + Discipline","#2563EB"],["2027–28","MBA Entry + College","#16A34A"],["2028–29","Learn Business Deeply","#0E9F9F"],["2029–30","Build MVP / Product","#D97706"],["2030–31","Grow Team + Revenue","#DC2626"],["2031–32","Scale + Expand","#7C3AED"],["2032–33","Health, Wealth, Family + Impact","#F5A623"]];function Ht({onBack:t}){return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsx("div",{className:"page-header-title",children:"Vision & Mission"})]}),e.jsxs("div",{className:"card",style:{background:"linear-gradient(135deg,rgba(26,86,219,.15),rgba(124,58,237,.15))",borderColor:"rgba(26,86,219,.4)"},children:[e.jsx("div",{style:{fontSize:11,fontWeight:700,color:"#3B82F6",textTransform:"uppercase",letterSpacing:".5px",marginBottom:4},children:"Current Mission — ACTIVE"}),e.jsx("div",{style:{fontSize:20,fontWeight:900,marginBottom:4},children:"CAT 2026"}),e.jsx("div",{style:{fontSize:12,color:"var(--muted)"},children:"99+ Percentile · No Ceiling · 29 November 2026"}),e.jsx("div",{style:{marginTop:10,fontSize:11,color:"var(--gold)",fontWeight:700},children:"DO NOT ACTIVATE ANY OTHER PROJECT UNTIL CAT IS DONE."})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"Master Life Sequence"}),Se.map((n,s)=>e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:6},children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:n.col,flexShrink:0}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,color:n.col},children:n.step}),e.jsx("div",{style:{fontSize:11,color:"var(--muted2)"},children:n.desc})]})]}),s<Se.length-1&&e.jsx("div",{style:{width:1,height:10,background:"var(--border)",marginLeft:3,marginBottom:4}})]},s))]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"7-Year Vision"}),Gt.map(([n,s,r])=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:8},children:[e.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:r,flexShrink:0}}),e.jsx("div",{style:{fontSize:11,fontWeight:700,color:r,width:68},children:n}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)"},children:s})]},n))]}),e.jsxs("div",{style:{background:"linear-gradient(135deg,#0D1B2A,#1A2E45)",border:"1px solid rgba(245,166,35,.3)",borderRadius:14,padding:16,textAlign:"center"},children:[e.jsx("div",{style:{fontSize:13,fontWeight:800,color:"var(--gold)"},children:'"Discipline Today → Dream College Tomorrow → Bigger Impact in Future"'}),e.jsx("div",{style:{fontSize:13,fontWeight:800,color:"var(--text)",marginTop:8},children:"BECOME THE MAN YOU PROMISE YOURSELF"}),e.jsx("div",{style:{fontSize:14,fontWeight:900,color:"var(--gold)",marginTop:8},children:"Radhe Radhe 🙏"})]})]})}const Yt=[{label:"TIER 1 — MUST MASTER",col:"#EF4444",tier:1},{label:"TIER 2 — BUILD STRONGLY",col:"#F59E0B",tier:2},{label:"TIER 3 — EXPOSURE",col:"#3B82F6",tier:3}];function _t({onBack:t}){return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsx("div",{className:"page-header-title",children:"Full Syllabus"})]}),Yt.map(n=>{const s=["QA","DILR","VARC"].flatMap(r=>ie[r].filter(i=>i.tier===n.tier).map(i=>({...i,subj:r})));return e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:n.col,padding:"8px 12px",background:n.col+"18",borderRadius:8,marginBottom:8},children:n.label}),e.jsx("div",{className:"card",style:{marginBottom:14},children:s.map((r,i)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<s.length-1?"1px solid var(--border)":"none"},children:[e.jsx("div",{style:{width:6,height:6,borderRadius:"50%",background:n.col,flexShrink:0}}),e.jsx("div",{style:{fontSize:12,flex:1},children:r.name}),e.jsx("div",{style:{fontSize:9,color:"var(--muted)"},children:r.subj})]},r.id))})]},n.tier)})]})}function G(t){return String(t).padStart(2,"0")}function je(t){return`${t.getFullYear()}${G(t.getMonth()+1)}${G(t.getDate())}T${G(t.getHours())}${G(t.getMinutes())}00`}function Kt(t){return`${t.getFullYear()}${G(t.getMonth()+1)}${G(t.getDate())}`}function ee(t){return t.replace(/\\/g,"\\\\").replace(/,/g,"\\,").replace(/;/g,"\\;").replace(/\n/g,"\\n")}function Xt(t){const s=t.split(/[–-]/)[0].trim().match(/^(\d{1,2}):(\d{2})$/);return s?{h:parseInt(s[1],10),m:parseInt(s[2],10)}:null}function Jt(){const t=new Date,n=new Date(De);n.setDate(n.getDate()-1);const s=`${Kt(n)}T235959`,r=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//CAT 2026 Execution System//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",`X-WR-CALNAME:${ee("CAT 2026 Daily Schedule")}`];return Be.forEach((i,a)=>{const c=Xt(i.time);if(!c)return;const u=new Date(t);u.setHours(c.h,c.m,0,0);const b=`cat2026-block-${a}-${i.block.replace(/\s+/g,"")}@cat2026app`;r.push("BEGIN:VEVENT",`UID:${b}`,`DTSTAMP:${je(t)}Z`,`DTSTART:${je(u)}`,`SUMMARY:${ee(i.block)}`,`DESCRIPTION:${ee(i.detail)}`,`RRULE:FREQ=DAILY;UNTIL=${s}`,"BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${ee(i.block)}`,"TRIGGER:PT0M","END:VALARM","END:VEVENT")}),r.push("END:VCALENDAR"),r.join(`\r
`)}function Zt(){const t=Jt(),n=new Blob([t],{type:"text/calendar;charset=utf-8"}),s=document.createElement("a");s.href=URL.createObjectURL(n),s.download="cat2026-daily-schedule.ics",s.click(),URL.revokeObjectURL(s.href)}const se=()=>typeof window<"u"&&!!window.AndroidNativeHost;function en(t){const n=()=>{t()||window.AndroidNativeHost?.exitApp()};return window.addEventListener("android:backbutton",n),()=>window.removeEventListener("android:backbutton",n)}function tn(){return()=>{}}function nn(){se()&&window.AndroidNativeHost?.requestNotificationPermission()}function sn(t){se()&&window.AndroidNativeHost?.setNotificationsEnabled(t)}function rn({onBack:t}){const[n,s]=d.useState(!1),[r,i]=d.useState(!0),[a,c]=d.useState(!1),[u,b]=d.useState(!1),{show:y}=D();d.useEffect(()=>{Promise.all([V.get("wake",!1),V.get("quotes",!0),V.get("sound",!1),V.get("notifications",!1)]).then(([h,C,j,S])=>{s(h),i(C),c(j),b(S)})},[]);async function o(h,C,j){const S=!C;if(await V.set(h,S),j(S),y(`${h} ${S?"on":"off"}`),h==="wake"&&S&&"wakeLock"in navigator)try{await navigator.wakeLock.request("screen")}catch{}}async function g(){const h=!u;await V.set("notifications",h),b(h),se()?(h?nn():sn(!1),y(h?"Notifications on — grant the Android permission if prompted":"Notifications off")):y("Native app only — open this in the Android app to receive real reminders","#D97706")}function l(){Zt(),y("Calendar file downloaded — import it into Outlook, Google Calendar, or Apple Calendar")}async function f(){const[h,C,j,S,p]=await Promise.all([H.getAllHistorical(),N.getAll(),M.getAll(),ne.getAll(),ae.getAll()]),k=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),tasks:h,errors:C,masts:j,mocks:S,scores:p},null,2)],{type:"application/json"}),x=document.createElement("a");x.href=URL.createObjectURL(k),x.download=`cat2026_export_${X()}.json`,x.click(),y("Data exported ✓")}async function v(){window.confirm("Reset ALL data? This cannot be undone.")&&(await lt(),y("All data reset","#DC2626"),window.location.reload())}const m=[{key:"wake",label:"Screen Awake",sub:"Keep screen on while studying",val:n,setter:s},{key:"quotes",label:"Motivational Quotes",sub:"Show daily mantra",val:r,setter:i},{key:"sound",label:"Sounds",sub:"Block completion sounds",val:a,setter:c}];return e.jsxs("div",{className:"section-pad",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("button",{className:"back-btn",onClick:t,children:"← Back"}),e.jsx("div",{className:"page-header-title",children:"Settings"})]}),e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"setting-row",style:{borderBottom:"1px solid var(--border)"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:600},children:"Daily Reminders"}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)"},children:se()?"Real notifications — 09:00 mission, 21:00 error log":"Android app only"})]}),e.jsx("div",{className:`toggle ${u?"on":""}`,onClick:g,children:e.jsx("div",{className:"toggle-knob"})})]}),m.map((h,C)=>e.jsxs("div",{className:"setting-row",style:{borderBottom:C<m.length-1?"1px solid var(--border)":"none"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:13,fontWeight:600},children:h.label}),e.jsx("div",{style:{fontSize:11,color:"var(--muted)"},children:h.sub})]}),e.jsx("div",{className:`toggle ${h.val?"on":""}`,onClick:()=>o(h.key,h.val,h.setter),children:e.jsx("div",{className:"toggle-knob"})})]},h.key))]}),e.jsxs("div",{className:"card",style:{borderColor:"rgba(245,166,35,.3)"},children:[e.jsx("div",{className:"card-title",children:"📅 Calendar — Phone + Laptop Reminders"}),e.jsxs("div",{style:{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.6},children:["Exports your real daily schedule as a calendar file. Import it into ",e.jsx("strong",{style:{color:"var(--text)"},children:"Outlook"}),","," ",e.jsx("strong",{style:{color:"var(--text)"},children:"Google Calendar"}),", or ",e.jsx("strong",{style:{color:"var(--text)"},children:"Apple Calendar"})," and every block gets a real alarm — on your phone and your laptop, wherever that account is signed in. Repeats daily until 29 Nov 2026."]}),e.jsx("button",{className:"btn-primary",onClick:l,children:"📥 Download Calendar File (.ics)"})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"Data Management"}),e.jsx("div",{style:{fontSize:12,color:"var(--muted)",marginBottom:12},children:"All data stored in IndexedDB on this device. Survives refresh + restart."}),e.jsx("button",{className:"btn-ghost",onClick:f,style:{marginBottom:8},children:"📤 Export All Data (JSON)"}),e.jsx("button",{className:"btn-danger",onClick:v,children:"🗑️ Reset All Data"})]}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-title",children:"About"}),e.jsxs("div",{style:{fontSize:12,color:"var(--muted)",lineHeight:1.8},children:["Stack: React 18 + TypeScript + Vite",e.jsx("br",{}),"Native: Android WebView host (WebViewAssetLoader)",e.jsx("br",{}),"Storage: IndexedDB (real persistence)",e.jsx("br",{}),"Phase: Dynamic (calculated from date)",e.jsx("br",{}),"Countdown: Live (seconds ticker)",e.jsx("br",{}),"75 days to CAT 2026 — one mission."]})]})]})}const z=["today","week","mastery","phases","more"],we=["EXECUTION > COLLECTION. Stay on your error log.","Analysis > Ego. Review mistakes, not your score.","Consistency > Intensity. One more block. Right now.","No random resources. Your plan is your weapon.","Repair > Reattempt. Fix the root cause first."];function on(){const[t,n]=d.useState("today"),[s,r]=d.useState(!0),{show:i}=D(),a=d.useRef(0),c=d.useRef(0),u=d.useRef(0);d.useEffect(()=>{async function l(){try{await Y(),await M.init()}catch(f){console.error("[CAT2026] Boot error:",f)}finally{r(!1)}}l()},[]);const b=d.useRef(t);d.useEffect(()=>{b.current=t},[t]),d.useEffect(()=>en(()=>z.includes(b.current)?!1:(n("more"),!0)),[]),d.useEffect(()=>tn(),[]),d.useEffect(()=>{const l=setInterval(()=>{const f=we[u.current%we.length];i("🔒 "+f,"#1A56DB"),u.current++},27e5);return()=>clearInterval(l)},[i]);const y=d.useCallback(l=>{a.current=l.touches[0].clientX},[]),o=d.useCallback(l=>{const f=l.changedTouches[0].clientX-a.current;if(Math.abs(f)<70||!z.includes(t))return;const m=z.indexOf(t);if(f<0&&m<z.length-1){const h=z[m+1];c.current=m+1,n(h)}else if(f>0&&m>0){const h=z[m-1];c.current=m-1,n(h)}},[t]);d.useEffect(()=>{const l=f=>{if(!f.altKey)return;const v={1:"today",2:"week",3:"mastery",4:"phases",5:"more"};v[f.key]&&n(v[f.key])};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[]);const g=z.includes(t);return s?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12},children:[e.jsx("div",{style:{fontSize:28,fontWeight:900,background:"linear-gradient(90deg,#F5A623,#FBBF24)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"CAT 2026"}),e.jsx("div",{style:{fontSize:12,color:"#94A3B8"},children:"Loading execution system…"})]}):e.jsxs("div",{className:"app-shell",onTouchStart:y,onTouchEnd:o,children:[e.jsx(nt,{}),e.jsxs("div",{className:"content-area",children:[t==="today"&&e.jsx(ht,{}),t==="week"&&e.jsx(ft,{}),t==="mastery"&&e.jsx(xt,{}),t==="phases"&&e.jsx(bt,{}),t==="more"&&e.jsx(kt,{onNavigate:l=>n(l)}),t==="dashboard"&&e.jsx(jt,{onBack:()=>n("more")}),t==="catmock"&&e.jsx(wt,{onBack:()=>n("more")}),t==="adaptive"&&e.jsx(Ct,{onBack:()=>n("more")}),t==="flashcards"&&e.jsx(Dt,{onBack:()=>n("more")}),t==="achievements"&&e.jsx(Bt,{onBack:()=>n("more")}),t==="dailycapsule"&&e.jsx(Tt,{onBack:()=>n("more")}),t==="qbank"&&e.jsx(It,{onBack:()=>n("more")}),t==="livesessions"&&e.jsx(Nt,{onBack:()=>n("more")}),t==="drills"&&e.jsx(Mt,{onBack:()=>n("more")}),t==="research"&&e.jsx(Pt,{onBack:()=>n("more")}),t==="errors"&&e.jsx(Wt,{onBack:()=>n("more")}),t==="repair"&&e.jsx(Ot,{onBack:()=>n("more")}),t==="retest"&&e.jsx($t,{onBack:()=>n("more")}),t==="mockana"&&e.jsx(Vt,{onBack:()=>n("more")}),t==="schedule"&&e.jsx(Ut,{onBack:()=>n("more")}),t==="vision"&&e.jsx(Ht,{onBack:()=>n("more")}),t==="syllabus"&&e.jsx(_t,{onBack:()=>n("more")}),t==="settings"&&e.jsx(rn,{onBack:()=>n("more")})]}),g&&e.jsx(rt,{current:t,onChange:l=>{n(l),c.current=z.indexOf(l)}}),!g&&e.jsx("div",{style:{height:"calc(var(--tab-h) + env(safe-area-inset-bottom))",paddingBottom:"env(safe-area-inset-bottom)",background:"#0D1B2A",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:e.jsx("button",{onClick:()=>n("more"),style:{background:"none",border:"1px solid var(--border)",color:"var(--muted)",borderRadius:20,padding:"8px 24px",fontSize:13,cursor:"pointer"},children:"← Back to More Hub"})}),e.jsx(ct,{})]})}const an="modulepreload",ln=function(t){return"/"+t},Ce={},dn=function(n,s,r){let i=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),u=c?.nonce||c?.getAttribute("nonce");i=Promise.allSettled(s.map(b=>{if(b=ln(b),b in Ce)return;Ce[b]=!0;const y=b.endsWith(".css"),o=y?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${b}"]${o}`))return;const g=document.createElement("link");if(g.rel=y?"stylesheet":an,y||(g.as="script"),g.crossOrigin="",g.href=b,u&&g.setAttribute("nonce",u),document.head.appendChild(g),y)return new Promise((l,f)=>{g.addEventListener("load",l),g.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${b}`)))})}))}function a(c){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=c,window.dispatchEvent(u),!u.defaultPrevented)throw c}return i.then(c=>{for(const u of c||[])u.status==="rejected"&&a(u.reason);return n().catch(a)})};function cn(t={}){const{immediate:n=!1,onNeedRefresh:s,onOfflineReady:r,onRegistered:i,onRegisteredSW:a,onRegisterError:c}=t;let u,b;const y=async(g=!0)=>{await b};async function o(){if("serviceWorker"in navigator){if(u=await dn(async()=>{const{Workbox:g}=await import("./workbox-window.prod.es5-BqEJf4Xk.js");return{Workbox:g}},[]).then(({Workbox:g})=>new g("/sw.js",{scope:"/",type:"classic"})).catch(g=>{c?.(g)}),!u)return;u.addEventListener("activated",g=>{(g.isUpdate||g.isExternal)&&window.location.reload()}),u.addEventListener("installed",g=>{g.isUpdate||r?.()}),u.register({immediate:n}).then(g=>{a?a("/sw.js",g):i?.(g)}).catch(g=>{c?.(g)})}}return b=o(),y}cn({immediate:!0});ge.createRoot(document.getElementById("root")).render(e.jsx(ze.StrictMode,{children:e.jsx(pt,{children:e.jsx(on,{})})}));
//# sourceMappingURL=index-BqvsoBjq.js.map
