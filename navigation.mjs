export const geometry=g=>g?.layout||{X0:300,X1:690,Y0:165,Y1:465,bridge:495,pontoon:650,ford:810};
export const cityInside=(p,g)=>{const {X0,X1,Y0,Y1}=geometry(g);return p.x>X0&&p.x<X1&&p.y>Y0&&p.y<Y1;};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const side=w=>w.side||({north:'north',south:'south',east:'east',west:'west',eastwall:'east',southwall:'south'}[w.id])||'south';
const gateIds=['north','south','east','west'];
export const canUsePortal=(u,w)=>w.hp<=0||(u.side==='defend'&&gateIds.includes(w.id))||(u.side==='attack'&&w.ladderReady&&['heavy','spear','light'].includes(u.type));
export function portalPoints(w){const s=side(w),dx=s==='west'?-24:s==='east'?24:0,dy=s==='north'?-24:s==='south'?24:0;return [{x:w.x+dx,y:w.y+dy},{x:w.x-dx,y:w.y-dy}];}
function crossings(a,b,g){const {X0,X1,Y0,Y1}=geometry(g);const hits=[];const dx=b.x-a.x,dy=b.y-a.y;for(const [axis,value,lo,hi] of [['x',X0,Y0,Y1],['x',X1,Y0,Y1],['y',Y0,X0,X1],['y',Y1,X0,X1]]){const delta=axis==='x'?dx:dy;if(Math.abs(delta)<1e-8)continue;const t=(value-a[axis])/delta;if(t<-1e-8||t>1+1e-8)continue;const p={x:a.x+dx*t,y:a.y+dy*t},other=axis==='x'?p.y:p.x;if(other>=lo-1e-8&&other<=hi+1e-8)hits.push({...p,t});}return hits;}
export function legalSegment(g,u,a,b){const {bridge,pontoon,ford}=geometry(g);
 for(const hit of crossings(a,b,g)){if(hit.t<1e-8&&!cityInside({x:a.x+(b.x-a.x)*.001,y:a.y+(b.y-a.y)*.001},g))continue;if(!g.walls.some(w=>canUsePortal(u,w)&&distance(hit,w)<=18))return false;}
 if(geometry(g).noRiver)return true;
 // Crossing the river is legal only at the bridge or the eastern ford.
 const dy=b.y-a.y,checks=[];if(Math.abs(dy)>1e-8){for(const y of [540,565,590]){const t=(y-a.y)/dy;if(t>0&&t<1)checks.push(a.x+(b.x-a.x)*t);}}if(a.y>540&&a.y<590)checks.push(a.x);if(b.y>540&&b.y<590)checks.push(b.x);if(checks.some(x=>!((Math.abs(x-bridge)<=18&&(g.bridges?.bridge??100)>=100)||(Math.abs(x-pontoon)<=18&&(g.bridges?.pontoon??0)>=100)||(Math.abs(x-ford)<=20&&!(g.level===2&&g.t<480)))))return false;
 return true;
}
function normalizedGoal(g,u,target){const goal={x:target.x,y:target.y};const w=g.walls.find(w=>distance(w,goal)<1);if(w){const [out,inn]=portalPoints(w);return cityInside(u,g)?inn:canUsePortal(u,w)?inn:out;}return goal;}
export function findRoute(g,u,target){const goal=normalizedGoal(g,u,target);if(legalSegment(g,u,u,goal))return [goal];
 const {X0,X1,Y0,Y1,bridge,pontoon,ford}=geometry(g);const nodes=[{x:u.x,y:u.y},goal];for(const x of [X0-24,X1+24,X0+24,X1-24])for(const y of [Y0-24,Y1+24,Y0+24,Y1-24])nodes.push({x,y});for(const x of [bridge,pontoon,ford])for(const y of [520,610])nodes.push({x,y});
 for(const w of g.walls)if(canUsePortal(u,w))nodes.push(...portalPoints(w));
 const dist=nodes.map(()=>Infinity),prev=nodes.map(()=>-1),done=new Set();dist[0]=0;
 for(let k=0;k<nodes.length;k++){let best=-1;for(let i=0;i<nodes.length;i++)if(!done.has(i)&&(best<0||dist[i]<dist[best]))best=i;if(best<0||!Number.isFinite(dist[best]))break;if(best===1){const route=[];let at=1;while(at>0){route.unshift(nodes[at]);at=prev[at];}return route;}done.add(best);for(let i=1;i<nodes.length;i++){if(done.has(i)||!legalSegment(g,u,nodes[best],nodes[i]))continue;const cost=dist[best]+distance(nodes[best],nodes[i]);if(cost<dist[i]){dist[i]=cost;prev[i]=best;}}}return null;
}
export function moveAlongRoute(g,u,target,dt,speed){const key=JSON.stringify(g.bridges||{})+':'+(g.level===2&&g.t<480)+g.walls.map(w=>`${w.id}:${w.hp<=0?1:0}:${w.ladderReady?1:0}`).join('|')+':'+u.side+':'+u.type;const cache=u.nav;const normalized=normalizedGoal(g,u,target);if(!cache||cache.key!==key||distance(cache.goal,normalized)>8||g.t-cache.at>4){u.nav={key,goal:normalized,at:g.t,route:findRoute(g,u,target)};}
 const path=u.nav.route;if(!path&&!geometry(g).noRiver&&u.y>540&&u.y<590&&((Math.abs(u.x-geometry(g).bridge)<19&&(g.bridges?.bridge??100)<100)||(Math.abs(u.x-geometry(g).pontoon)<19&&(g.bridges?.pontoon??0)<100))){u.y+=Math.sign(u.y-565||1)*Math.min(speed*dt,Math.abs((u.y<565?540:590)-u.y)+.01);u.nav=null;u.status='撤離斷橋';return false;}if(!path){u.status='道路受阻 · 等待突破';return false;}
 let budget=speed*dt;while(path.length&&budget>0){const p=path[0],dist=distance(u,p);if(dist<.01){path.shift();continue;}const step=Math.min(dist,budget),next={x:u.x+(p.x-u.x)/dist*step,y:u.y+(p.y-u.y)/dist*step};if(!legalSegment(g,u,u,next)){u.nav=null;u.status='道路受阻 · 等待突破';return false;}u.x=next.x;u.y=next.y;budget-=step;if(step>=dist-.001)path.shift();}
 return distance(u,normalized)<5;
}
