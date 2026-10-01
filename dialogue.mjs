import {storyFor} from './stories.mjs';
export const CHARACTERS={commander:{name:'主帥',role:'南軍 · 中軍統帥',image:'assets/commander.png'},strategist:{name:'軍師',role:'中軍 · 戰前參議',image:'assets/strategist.png'},defender:{name:'守將',role:'北境 · 城防統帥',image:'assets/defender.png'}};
const line=(speaker,text)=>({speaker,text});
export const DIALOGUES={
1:{scene:'初秋 · 青石城外，商道上的最後一輛糧車已駛入城門。',attack:[
line('strategist','將軍，青石城扼住北進商道。斥候回報，南門兵多，東門卻只見稀疏旗影。'),
line('commander','東門若真薄弱，便能少付些代價。但他們為何不把兵調過去？'),
line('strategist','昨夜有人看見箭車運往東城。城頭的人數，未必是城內的兵力。'),
line('commander','先讓輕步營占住觀察點。我要看清楚，再決定從哪裡進攻。'),
line('strategist','各營都在等您的軍令。這是您第一次獨掌兵符，急不得。'),
line('commander','那就從第一道軍令開始。先求明白，再求勝。')],defend:[
line('strategist','將軍，南軍先鋒到了。城門已閉，城外商旅也已疏散。'),
line('defender','援軍還有多久？我們不能把所有人都擺在城頭。'),
line('strategist','約四十五分鐘。可把預備隊藏在城內，以少量旗幟示敵。'),
line('defender','讓他們猜。弓兵守住射位，步兵留作接應，沒有命令不准出城。'),
line('strategist','若敵軍看穿東門的虛實呢？'),
line('defender','便換一處防線。城門是一道防線，城內還有我們。')]},
2:{scene:'連日大雨 · 臨川兩岸，斷木隨洪水流向下游。',attack:[
line('strategist','青石一帶的戰事牽動了糧道，雙方都在向臨川調兵。北境的秋糧，就存放在這座城裡。'),
line('commander','石橋已拆，淺灘也被淹了。工兵能從哪裡動手？'),
line('strategist','西側可以修石橋，東側可以另架浮橋。西端淺灘要等八分鐘，洪水才會退去。'),
line('commander','兩支工兵分開準備。先派護衛跟隨，再讓弓兵照應河岸。'),
line('strategist','守軍仍從北門補糧。渡過河後，還得有人繞去切斷那條路。'),
line('commander','先護住架橋的人，再談攻城。官署與糧倉，才是這一戰的目的。')],defend:[
line('strategist','石橋已拆，洪水也封住淺灘。敵軍暫時過不來，但工兵已在南岸集結。'),
line('defender','水只能替我們爭取時間。北門的糧車還進得來嗎？'),
line('strategist','糧道尚通。敵人若分路架橋，西門與東岸都可能受攻。'),
line('defender','弓兵觀察渡口，預備隊留在城內。先看清真正的渡河方向。'),
line('strategist','要不要現在出城，去拆他們的新橋？'),
line('defender','先看對岸有多少護衛。橋可以再拆，官署與糧倉不能一起丟。')]},
3:{scene:'秋末 · 朔風城外，四條驛路上仍有糧車往來。',attack:[
line('strategist','朔風城牆堅糧足。守將打算拖到冬日，讓我們在城下耗盡力氣。'),
line('commander','那便不照他的打算走。沙盤上的四條路，都是糧道？'),
line('strategist','正是。扼住糧道，既能斷他的糧，也能補我們的軍需。封鎖營還可依陣地休整。'),
line('commander','先分兵封鎖，再留騎兵攔截出城部隊。哪裡受壓，就派預備隊接替。'),
line('strategist','至少三門持續封鎖一百二十秒，便能形成合圍優勢。屆時再攻城，代價會小得多。'),
line('commander','好。先讓糧車停下來，再讓城門打開。若守將肯降，我們也不必強攻。')],defend:[
line('strategist','將軍，攻軍沒有立刻攻城。他們沿驛路分兵，正在建立封鎖陣地。'),
line('defender','他們盯上的是糧道。城牆能擋刀槍，卻不能替士兵變出糧食。'),
line('strategist','若三門同時被封住，合圍一旦站穩，我軍會越來越難守。'),
line('defender','找出最弱的一環。弓兵掩護，步兵集中出擊，不能一營一營地送出去。'),
line('strategist','城內要留下多少兵？'),
line('defender','官署與內城兵營都要有人。打開糧路是為了守城，不能為糧路丟了城。')]}
};
export function dialogueFor(level,role){return (DIALOGUES[level]||DIALOGUES[1])[role==='defend'?'defend':'attack'];}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function dialogueHTML(level,role,index){const story=storyFor(level),lines=dialogueFor(level,role),i=Math.max(0,Math.min(index,lines.length-1)),l=lines[i],person=CHARACTERS[l.speaker],pair=role==='defend'?['defender','strategist']:['commander','strategist'];return `<section class="story-dialogue" aria-label="${esc(story.title)}人物對話"><div class="dialogue-heading"><div><span class="eyebrow">${esc(story.chapter)} · ${role==='defend'?'守方':'攻方'}視角</span><h2>${esc(story.title)}</h2></div><button data-dialogue="skip">略過對話</button></div><p class="dialogue-scene">${esc((DIALOGUES[level]||DIALOGUES[1]).scene)}</p><div class="portrait-stage">${pair.map(id=>{const c=CHARACTERS[id];return `<figure class="portrait ${id===l.speaker?'speaking':'listening'}"><img src="${c.image}" alt="${c.name}人物立繪" width="512" height="768"><figcaption>${c.name}<span>${id===l.speaker?'正在說話':'聆聽'}</span></figcaption></figure>`;}).join('')}</div><div class="dialogue-box"><div class="speaker"><strong>${person.name}</strong><span>${person.role}</span></div><p class="dialogue-line" aria-live="polite" aria-atomic="true">${esc(l.text)}</p><div class="dialogue-controls"><button data-dialogue="prev" ${i===0?'disabled':''}>← 上一句</button><span aria-label="對話進度">${i+1} / ${lines.length}</span><button class="primary" data-dialogue="next">${i===lines.length-1?'展開軍議 →':'下一句 →'}</button></div></div><p class="dialogue-foot">戰局已暫停 · 可用左右方向鍵翻句 · 稍後可從「戰役背景」重看</p></section>`;}
