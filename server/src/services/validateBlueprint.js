export function validateBlueprint(raw){
 const issues=[];const unique=(list)=>new Set(list).size===list.length;
 if(!raw||typeof raw!=='object')return {ok:false,issues:['output is not an object']};
 for(const key of ['caseTitle','caseSummary','incident','suspects','timeline','evidence','solution'])if(!(key in raw))issues.push(`missing ${key}`);
 if(typeof raw.caseTitle!=='string'||raw.caseTitle.length<3||raw.caseTitle.length>80)issues.push('invalid caseTitle');
 if(typeof raw.caseSummary!=='string'||raw.caseSummary.length<40||raw.caseSummary.length>500)issues.push('invalid caseSummary');
 if(typeof raw.incident!=='string'||raw.incident.length<30||raw.incident.length>800)issues.push('invalid incident');
 if(!Array.isArray(raw.suspects)||raw.suspects.length<3||raw.suspects.length>5)issues.push('suspects must contain 3 to 5 entries');
 if(!Array.isArray(raw.timeline)||raw.timeline.length<4||raw.timeline.length>10)issues.push('timeline must contain 4 to 10 entries');
 if(!Array.isArray(raw.evidence)||raw.evidence.length<6||raw.evidence.length>10)issues.push('evidence must contain 6 to 10 entries');
 if(issues.length)return {ok:false,issues};
 const suspectIds=raw.suspects.map(x=>x.id);const evidenceIds=raw.evidence.map(x=>x.id);
 if(!unique(suspectIds)||suspectIds.some(x=>typeof x!=='string'||!x))issues.push('suspect IDs must be unique nonempty strings');
 if(!unique(evidenceIds)||evidenceIds.some(x=>typeof x!=='string'||!x))issues.push('evidence IDs must be unique nonempty strings');
 const requiredSuspect=['name','role','motive','alibi','profile'];
 for(const s of raw.suspects)if(requiredSuspect.some(k=>typeof s[k]!=='string'||!s[k].trim()))issues.push(`suspect ${s.id||'?'} has missing fields`);
 for(const e of raw.evidence)if(!['message','image','recording','document','statement'].includes(e.type)||!e.title||!e.content||typeof e.content!=='string')issues.push(`evidence ${e.id||'?'} has invalid type or content`);
 if(raw.evidence.some(e=>(e.relatedSuspectIds||[]).some(id=>!suspectIds.includes(id))))issues.push('evidence references an unknown suspect');
 if(raw.solution?.culpritSuspectId&&!suspectIds.includes(raw.solution.culpritSuspectId))issues.push('culprit is not a displayed suspect');
 const decisive=raw.solution?.decisiveEvidenceIds;
 if(!Array.isArray(decisive)||decisive.length<2||decisive.some(id=>!evidenceIds.includes(id)))issues.push('solution must cite at least two existing decisive evidence items');
 if(!raw.solution?.motive||!raw.solution?.method||!Array.isArray(raw.solution?.reasoningSteps)||raw.solution.reasoningSteps.length<2)issues.push('solution requires motive, method, and reasoning steps');
 if(!Array.isArray(raw.redHerrings)||!Array.isArray(raw.redHerrings))issues.push('redHerrings must be an array');
 if(Array.isArray(raw.redHerrings)&&raw.redHerrings.some(r=>!evidenceIds.includes(r.evidenceId)||!r.explanation))issues.push('red herrings must cite existing evidence and explain it');
 return {ok:issues.length===0,issues};
}
export function sanitizeBlueprint(raw){
 return {title:raw.caseTitle,summary:raw.caseSummary,incident:raw.incident,suspects:raw.suspects.map(s=>({id:s.id,name:s.name,role:s.role,motive:s.motive,alibi:s.alibi,profile:s.profile})),timeline:raw.timeline.map(t=>({time:t.time,event:t.event})),evidence:raw.evidence.map(e=>({id:e.id,title:e.title,type:e.type,content:e.content,source:e.source||'Case archive',timestamp:e.timestamp||'',relatedSuspectIds:e.relatedSuspectIds||[],altText:e.altText||''})),answerKey:{culpritSuspectId:raw.solution.culpritSuspectId,motive:raw.solution.motive,method:raw.solution.method,reasoningSteps:raw.solution.reasoningSteps,decisiveEvidenceIds:raw.solution.decisiveEvidenceIds,redHerrings:raw.redHerrings}};
}
