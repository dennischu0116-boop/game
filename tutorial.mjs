const step=(id,title,text,tip,condition,setup,focus)=>({id,title,text,tip,condition,setup,focus});
const order=(unit,action,target,extras={})=>({type:'order',unit,action,target,...extras});
const attack=[
 step('brief','先看懂戰局','你指揮六營共 4,800 人。左側選兵，中央選目標，右側查敵情；軍令在戰場下方。現在是戰術暫停，可以安心規劃。','勝利有兩條路：占領官署與另一處據點，或圍城斷糧迫使守軍投降。45:00 前須結束戰鬥。',{type:'read'},null,'.mission'),
 step('select','選取第四輕步營','在左側點選「輕步營」，或點地圖上的「斥」字軍旗。選中後，下方會顯示陸遙及部隊狀態。','兵力是目前可作戰人數；綠條是士氣，黃條是疲勞。輕步營適合先行偵察。',{type:'select',unit:'a4'},null,'[data-unit="a4"]'),
 step('scout','下達真正的偵察命令','選輕步營，將軍令設為「偵察」、目標設為「北嶺觀察點」，再按「傳達軍令」。只選目標或使用行軍不會完成偵察。','「帶我設定」只填好欄位，不會替你下令。你需要親自按傳達軍令。',order('a4','scout','hill'),{unit:'a4',action:'scout',target:'hill'},'#sendBtn'),
 step('observe','讓傳令與偵察完成','按 ▶ 推進時間。傳令兵先花 5–30 秒送達；輕步營抵達北嶺後，再觀察 18 秒，才會傳回東門情報。','可用 4×。重大軍報會自動暫停；先讀軍報，再恢復時間。等待時不必反覆重發命令。',{type:'intel'},null,'.time-controls'),
 step('intel','辨識東門的誘餌','切換右側「敵情」，比較各門目視兵力、回報時間與可信度。數字只涵蓋城門周邊可見敵軍，不包含其他城區與隱藏伏兵。','情報星級會隨時間下降。北嶺持續觀察與密探可補充判斷；密探消耗 3 補給，60 秒後回報。',{type:'tab',tab:'intel'},null,'.tabs'),
 step('archers','先用弓兵壓制南門','選第三弓兵營，設「攻擊／占領 → 南門」，陣型用「疏散陣」，傳達軍令。','疏散陣減少箭傷但近戰較弱；盾陣抗箭、移速慢；密集陣適合正面近戰，卻更怕遠射。',order('a3','attack','south',{formation:'loose'}),{unit:'a3',action:'attack',target:'south',formation:'loose'},'#formation'),
 step('siege','讓工程營破壞城門','選第六工程營，使用「投石機」，攻擊南門並傳令。投石機可在遠處逐步破壞這一段城防。','攻城槌更快但要靠近；雲梯架設 35 秒後協助附近步兵登城；井闌壓制守軍，盾車保護附近友軍。',order('a6','attack','south',{equipment:'catapult'}),{unit:'a6',action:'attack',target:'south',equipment:'catapult'},'#equipmentLabel'),
 step('plan','安排步兵跟進的協同計畫','選第一重步營，設「攻擊南門、盾陣」。按「安排協同計畫」，條件選「指定友軍開始交戰後」、部隊選第三弓兵營、延後 30 秒，再加入。','觸發條件成立後仍要傳令。你可在右側「軍令」確認計畫；重發一般軍令會清除該營舊計畫。',order('a1','attack','south',{formation:'shield',trigger:'engaged',triggerUnit:'a3',wait:30}),{unit:'a1',action:'attack',target:'south',formation:'shield',plan:true},'#planBtn'),
 step('guard','留下騎兵護糧','選第五騎兵營，下達「護衛糧營」。部隊會回到糧營附近待命，敵人靠近時依姿態迎戰。','運糧隊每 160 秒送糧。敵人可能出城截糧；將所有騎兵都投入城下，會讓後方暴露。',order('a5','guard',null),{unit:'a5',action:'guard',target:'camp'},'#action'),
 step('reserve','保留槍兵作為預備隊','選第二槍兵營，設定「就地休整」，傳達軍令，暫時保留它的兵力與體力。','疲勞高時傷害與速度下降。士氣低於設定門檻會潰退；撤回後重整至士氣 45 以上才可重新受令。',order('a2','rest',null),{unit:'a2',action:'rest',target:'camp'},'#retreatAt'),
 step('systems','認識其他可用戰術','「封鎖」須選東、西、南、北門之一；部隊抵達封鎖位置後，才加快守軍缺糧。不同城門的封鎖可疊加。火攻可破壞木門、糧營、糧倉及近處敵方攻城器械。','指定攻擊／攔截：先選友軍，再點敵軍。埋伏則選地點，準備 10 秒後，敵軍進入伏擊圈且可交戰才觸發。右側「交戰」可即時查看交戰對手；重疊部隊可從清單選取。雨、霧、夜晚會影響遠射、火攻或視野。',{type:'read'},null,'#action'),
 step('breach','推進時間，等候突破','恢復時間，觀察南門完整度下降。軍報若使時間暫停，讀完後再繼續。留意受損部隊，必要時先撤回輪換。','本步不會替你打仗。示範不保證破門；若攻勢失敗，請撤回休整或改圍城，亦可略過本步。若部隊潰退或計畫取消，可以回上一步重新部署；你也能暫停教學自由下令。',{type:'breach'},null,'#map'),
 step('office','進城奪取官署','城防已破。選第一重步營，改下「攻擊／占領 → 官署」，傳達新軍令。若該營正在潰退，等它重整後再下令。','先清除據點附近守軍才能占領。破口限制近戰展開；先偵察伏兵、圍城削弱補給，再輪換突入。',order('a1','attack','office'),{unit:'a1',action:'attack',target:'office'},'#target'),
 step('market','投入預備隊占領市集','選第二槍兵營，攻擊／占領市集並傳令。兩營分取據點，能避免所有人擠在官署。','可再令弓兵進城支援、輕步營接替疲憊部隊。仍須留意糧營，不要忘了後方。',order('a2','attack','market'),{unit:'a2',action:'attack',target:'market'},'#sendBtn'),
 step('finish','完成攻城並閱讀戰報','繼續指揮，直到官署及另一處據點被占領，或守軍投降。若戰局不利，也可在選單撤軍，保存餘部。','戰後會分別統計可作戰兵力、戰死與傷兵。存檔與教學進度儲存在此瀏覽器；可隨時從「教學」重看各章。',{type:'ended'},null,'.time-controls')
];
const defend=[
 step('dbrief','守城方的勝利條件','你有 2,600 人。守城預設新兵模式：攻軍分批投入，留出部署時間。守住官署與其他要地，拖到 45:00 援軍抵達，或擊潰攻軍，即可獲勝。不要只守城牆。','攻軍同時占領官署與另一處據點就會獲勝。先利用暫停安排南門與城內預備隊。',{type:'read'},null,'.mission'),
 step('dselect','找出你的預備隊','點選城內預備隊，查看許策率領的 800 人。這支部隊可以支援受壓的城門，或在破城後保衛官署。','己方兵力、士氣、疲勞較精確；敵軍在視野外不會持續顯示。',{type:'select',unit:'d5'},null,'[data-unit="d5"]'),
 step('dreserve','把預備隊部署到官署','下達「行軍至目標 → 官署」，陣型設「密集陣」，傳達軍令。','密集陣適合正面近戰但怕箭。盾陣抗箭、疏散陣減低遠射傷亡；衝鋒會消耗更多疲勞和陣型完整度。',order('d5','move','office',{formation:'dense'}),{unit:'d5',action:'move',target:'office',formation:'dense'},'#sendBtn'),
 step('dhold','穩住南門守軍','選南城守備，設「行軍至目標 → 南門、盾陣」，傳令。玩家部隊不會自動出城；請用行軍部署南門內側。出擊需另下指定攻擊或行軍軍令。','軍令有 5–30 秒延遲。標準姿態會就近迎戰；保守更偏向自衛，積極可短距離迎擊。',order('d1','move','south',{formation:'shield'}),{unit:'d1',action:'move',target:'south',formation:'shield'},'#formation'),
 step('dbow1','把東城弓隊調到南城射位','選東城弓隊，行軍至「南城東射位」，使用疏散陣並傳令。它能在城牆掩護下壓制靠近南門的攻軍。','靠近完整城牆的守方弓兵射程較遠，城牆也減少城外箭傷。不要讓弓兵走到城門外。',order('d2','move','southwatch',{formation:'loose'}),{unit:'d2',action:'move',target:'southwatch',formation:'loose'},'#target'),
 step('dbow2','讓北城弓兵交叉支援','選北城守備，行軍至「南城西射位」，使用疏散陣並傳令。南門現在由兩隊弓兵支援。','敵軍會分批投入。先建立防線，再恢復時間，不需要在開局就出城追擊。',order('d4','move','westwatch',{formation:'loose'}),{unit:'d4',action:'move',target:'westwatch',formation:'loose'},'#target'),
 step('dmarket','保留西城守備保護市集','選西城守備，行軍至市集，使用密集陣並傳令，確保城內第二道防線。','先不要派它去燒糧營。官署與另一處要地同時失守才會敗北；市集預備隊能爭取調兵時間。',order('d3','move','market',{formation:'dense'}),{unit:'d3',action:'move',target:'market',formation:'dense'},'#sendBtn'),
 step('dtime','親眼確認傳令延遲','恢復時間，觀察部隊從「傳令中」變成行軍或交戰，再看預備隊抵達官署。','空白鍵可暫停，平板可點上方 Ⅱ。暫停時仍可安排軍令與路線；不要為了讓它快走而重複發令。',{type:'arrived',unit:'d5'},null,'.time-controls'),
 step('dintel','查看城防與密探情報','切到右側「敵情」，查看各段城防完整度。若想掌握攻軍部署，可以在右下派遣密探。','分段城防讓敵人能集中轟擊。工程兵的投石機遠射、攻城槌近距離破門、雲梯可協助步兵登城。',{type:'tab',tab:'intel'},null,'.tabs'),
 step('draid','先守穩，再選擇是否出城','教學先保留西城守備在市集，不強制出城。若南門壓力已減輕，再自行選部隊「火攻 → 糧營」，或指定攻擊敵方工程營。','騷擾補給是可選戰術，不是開局必做事項。火攻需要接近；不要為了完成教學把第二道防線抽空。',{type:'read'},null,'#action'),
 step('dcontacts','看懂誰正在與誰交戰','選中一營，查看地圖下方「正在攻擊／正遭攻擊」，或右側「交戰」。交戰對象即時更新；金線表示正在攻擊，紅線表示受到攻擊。','軍旗直接標示部隊位置。點選軍旗會列出附近部隊，也可用「部隊清單」逐一選取。',{type:'read'},null,'#combatSummary'),
 step('dtactics','指定攔截與定點埋伏','先選友軍，再點敵軍，選「指定攻擊」或「攔截這支敵軍」，最後傳令。攔截只在受令位置附近的攔截圈內追擊；失聯後搜索最後位置。','埋伏先選地點，可指定敵軍。抵達後準備 10 秒，敵軍進入伏擊圈且可交戰才觸發，未被發現且補給高於 35 才有突襲優勢；斥候與密探能破解。未觸發時不主動開火。',{type:'read'},null,'#action'),
 step('dplan','學會輪換與協同','疲勞過高時，可先令另一營到達，再讓原營撤回重整。士氣低於設定門檻會潰退；恢復至 45 以上才能重新受令。','「安排協同計畫」可等前令完成、延後執行，或等待友軍抵達／交戰後才傳令。計畫可在右側「軍令」取消。',{type:'read'},null,'#planBtn'),
 step('dweather','掌握時間與補給','有戰鬥時使用 1×、2× 或 4×。20× 僅適合平靜時段，接戰即自動暫停。重大事件同樣會暫停，讀完軍報後須手動繼續。','攻軍若封鎖不同城門，守軍糧食消耗會加快。雨影響遠射與道路，霧和夜晚降低視野。糧盡會逐漸摧毀士氣。',{type:'read'},null,'.time-controls'),
 step('dfinish','守住要地，等待援軍','持續檢查城門與官署，調動預備隊並輪換。城牆被突破後，仍可透過城內據點戰挽回局勢。','戰後可查傷亡與存活將領。教學和存檔會保留於此瀏覽器；局勢不利時可在選單開城投降。',{type:'ended'},null,'.time-controls')
];
const legacyAttack=attack.map(s=>s.id),legacyDefend=defend.map(s=>s.id);
attack.splice(5,0,
 step('strategic','先決定圍城還是強攻','後續攻城步驟是操作示範，並非照做必勝。四門各部署至少 250 人執行封鎖；出城敵軍靠近會使封鎖失效，留預備隊攔截。','缺糧會削弱守军及伏擊。補給匱乏時嘗試勸降；強攻前先以偵察或密探排查伏兵。',{type:'read'},null,'#action'),
 step('targeting','指定攻擊與攔截','選己方部隊 → 點敵旗或部隊清單 → 指定攻擊／攔截 → 傳達軍令 → 恢復時間。只點選敵軍不會發令。','指定攻擊追蹤可見目標；攔截預判路線，但只在受令位置附近 220 範圍內追擊。完整城門擋住近戰；道路受阻時先破門或架梯，弓兵可隔牆射擊。失聯只搜索最後位置。',{type:'read'},null,'#sendBtn'),
 step('ambushlesson','如何設置伏擊','選己方部隊 → 軍令選埋伏 → 點地圖設伏擊點 → 可選伏擊對象 → 傳達軍令並恢復。部隊抵達後準備 10 秒，敵人進入 90 範圍且可交戰才觸發。','未觸發前不主動攻擊。未被偵察發現且補給高於 35，才有額外傷亡與士氣打擊；敵人隔著完整城門不會觸發步兵伏擊。',{type:'read'},null,'#action'),
 step('tools','五種工程器械怎麼選','選第六工程營，下方會出現器械選單。選器械、軍令、目標後必須重新傳令；只改選單不會更換正在使用的器械。','投石機：攻擊城門／牆段，遠程慢速破壞。攻城槌：同樣攻擊城門，近距離破門更快，需步兵護衛。',{type:'read'},null,'#equipmentLabel'),
 step('tools2','雲梯、井闌與盾車','雲梯：工程營攻擊城門／牆段，在城下工作 35 秒完成架設，再命重步、槍兵或輕步攻擊城內；騎兵與器械不能登梯。井闌：指定攻擊可見守軍，強化遠程壓制，不破門。','盾車：選盾車後下行軍命令，跟隨主力部署；附近 90 範圍內友軍承受的遠射傷害降低 35%，本身火力很低，也不破門。器械都受兵力、疲勞與天氣影響。',{type:'read'},null,'#equipmentLabel')
);
const riverAttack=[
 step('rbrief','第二關：臨川渡河戰','攻方 10 營共 6,800 人，守方 7 營共 3,600 人。石橋被拆，前 8 分鐘淺灘不能通行。官署與糧倉同時失守才算破城勝利。','本關有獨立部署，不繼承第一關傷亡。可修石橋、架浮橋，或等洪水退去再迂迴。',{type:'read'},null,'.mission'),
 step('rbridge','先建立渡河通道','選工程營，架橋／修橋 → 浮橋施工點，再傳令。施工需要補給，完成前保留部隊掩護。','石橋修復也可通行。此教學示範東側浮橋；不強制你使用唯一解法。',order('a6','build','pontoon'),{unit:'a6',action:'build',target:'pontoon'},'#action'),
 step('rescort','派護衛跟隨工兵','選第七護衛營，軍令選掩護友軍，目標選第六工程營，再傳令。護衛會跟隨施工部隊並迎擊靠近的敵軍。','可再派第八弓兵營掩護同一工兵；第十工兵營可另走西側修橋，避免全部兵力擠在一條路。',order('a7','escort','a6'),{unit:'a7',action:'escort',target:'a6'},'#action'),
 step('rscout','渡河後先偵察','部隊渡河後，讓輕步營偵察觀察點；查看各門回報時間，再選攻城方向。','不要把騎兵、步兵和工程營一起塞進破口。密探可揭露伏兵，交戰狀態即時顯示。',order('a4','scout','hill'),{unit:'a4',action:'scout',target:'hill'},'#target'),
 step('rnorth','北門是圍城關鍵','北門城防只有 70%，但守軍補給也由此進入。要圍城，應分兵封鎖北門並保護封鎖部隊。','只有封住南、東、西門，守軍仍可補糧。靠近封鎖部隊的守軍會令封鎖失效。',{type:'read'},null,'#action'),
 step('rgoals','奪取官署與糧倉','取得突破後先清除據點守軍，再分兵占領官署和糧倉。市集或兵營不能替代糧倉。','也可斷糧勸降。45:00 守方援軍抵達；不要把全部時間耗在正面城門。',{type:'read'},null,'.mission'),
 step('rfinish','戰後檢討','比較逐營輸出、承傷與攻城貢獻，確認工程營是否被保護、預備隊是否及時投入。','下次可試修石橋正面佯攻、浮橋東進，或退水後迂迴北門。',{type:'ended'},null,'.time-controls')];
const riverDefend=[step('rdbrief','守住臨川渡口','你有 3,600 人。石橋已拆，淺灘前 8 分鐘封閉；攻軍必須架橋或等待退水。','玩家部隊不會自行出城。用弓兵觀察渡口、步兵守住城內要地；出擊拆橋須自行下令。',{type:'read'},null,'.mission'),step('rdnorth','守住北方糧道','北門未被有效封鎖時可持續補糧。注意敵軍從西端淺灘迂迴。','若要出城拆橋，先看對方掩護兵力；不要抽空官署與糧倉。',{type:'read'},null,'#action'),step('rdend','保全官署與糧倉','守到 45:00 或擊潰攻軍即可勝利。官署與糧倉同時失守會敗北。','可在城內設伏，利用有糧的据點掩護，輪換疲勞部隊。',{type:'ended'},null,'.mission')];
const fortressAttack=[
step('fbrief','第三關：朔風合圍戰','你有 10 營共 7,600 人，對手 7 營共 4,200 人。四條陸路持續輸入糧食；只盯著城門強攻，守軍會持續補糧。','本關没有河流。利用城外環路分兵封鎖，兵營在南、官署在城中，需分階段進城。',{type:'read'},null,'.mission'),
step('fblock','先控制東方糧道','選第七護衛營 → 封鎖 → 東門 → 傳令。至少 250 人抵達才計入有效封鎖。','守軍超過 150 人接近封鎖營 100 範圍會令封鎖失效；用弓兵掩護、騎兵攔截。',order('a7','encircle','east'),{unit:'a7',action:'encircle',target:'east'},'#action'),
step('fbonus','封鎖營獲得陣地優勢','封鎖營到位後承傷降低 35%，持續恢復疲勞；有效封鎖還可截獲補給，改善攻軍續戰力。','不要把低於 250 人的殘部留在封鎖線上；派預備隊接替，再讓殘部撤回。',{type:'read'},null,'#supplyState'),
step('fisolate','連續封住至少三門','再分兵到北、西或南門。三門有效封鎖維持 120 秒，即可讓守軍戰力降低 20%，攻方城防破壞提高 25%。','少於三門時合圍進度歸零。右側敵情會列出封鎖糧道與進度；四門全封會更快斷糧。',{type:'read'},null,'.tabs'),
step('fassault','選擇迫降或總攻','缺糧時派使者勸降；也可趁合圍優勢，用工程營集中攻城。占領官署與內城兵營才能以攻城獲勝。','抽走封鎖營前先調預備隊接班。把弓兵或騎兵留在城外攔截出城守軍。',{type:'read'},null,'.mission'),
step('fend','結算封鎖成果','持續指揮直到勝負確定，檢查戰損及各營貢獻。','封鎖營即使殺敵不高，也能替整支軍隊補糧、削弱守軍並創造突破時機。',{type:'ended'},null,'.time-controls')];
const fortressDefend=[step('fdbrief','守住朔風城','四條陸路可補糧，不能任由攻軍完成三門合圍。你有 7 營共 4,200 人。','部隊不會自行出城，請自行判斷時機，集中兵力攻擊最弱封鎖營。',{type:'read'},null,'.mission'),step('fdbreak','打斷合圍','超過 150 人靠近敵封鎖營 100 範圍，即可令該門封鎖失效。至少保持兩門暢通，防止三門合圍。','敵封鎖營有陣地減傷，不宜單營硬撞；用弓兵支援，並保留城內預備隊。',{type:'read'},null,'#action'),step('fdend','保住核心據點','官署和內城兵營同時失守即敗北。守至 45:00 或擊潰攻軍即可獲勝。','封鎖被打斷後敵方合圍進度立即歸零，可趁此休整或換防。',{type:'ended'},null,'.mission')];
export function stepsFor(role,level=1,revision=2){if(level===3)return role==='defend'?fortressDefend:fortressAttack;if(level===2)return role==='defend'?riverDefend:riverAttack.filter(s=>revision===2||s.id!=='rescort');return role==='defend'?defend:attack;}
export function ensureGuide(g){if(g.guide?.version===2){const old=g.role==='defend'?['dbrief','dselect','dreserve','dhold','dtime','dintel','draid','dplan','dweather','dfinish']:legacyAttack;const id=old[g.guide.index];g.guide.index=Math.max(0,(g.role==='defend'?legacyDefend:legacyAttack).indexOf(id));g.guide.version=3;}if(g.guide?.version===3){const ids=g.role==='defend'?legacyDefend:legacyAttack;g.guide.index=Math.max(0,stepsFor(g.role,g.level,g.mapRevision||0).findIndex(s=>s.id===ids[g.guide.index]));g.guide.version=4;}if(!g.guide||g.guide.version!==4)g.guide={version:4,enabled:true,index:0,completed:[],skipped:[]};g.guide.index=Math.max(0,Math.min(g.guide.index,stepsFor(g.role,g.level,g.mapRevision||0).length-1));return g.guide;}
export function stepComplete(g,s,ui={}){const c=s.condition;if(g.guide?.completed.includes(s.id))return true;switch(c.type){case 'read':return false;case 'select':return ui.selected===c.unit;case 'tab':return ui.tab===c.tab;case 'intel':return g.revealed;case 'breach':return !!g.ended||g.walls.some(w=>w.hp<=0);case 'ended':return !!g.ended;case 'arrived':return !!g.units.find(u=>u.id===c.unit)?.order?.arrived;case 'order':{const u=g.units.find(u=>u.id===c.unit);if(!u)return false;return [...u.pending,...u.plan,u.order].filter(Boolean).some(o=>o.action===c.action&&(c.target==null||o.target?.id===c.target)&&['formation','equipment','trigger','triggerUnit','wait'].every(k=>c[k]===undefined||o[k]===c[k]));}default:return false;}}
export function refreshGuide(g,ui){const q=ensureGuide(g),s=stepsFor(g.role,g.level,g.mapRevision||0)[q.index];if(q.enabled&&stepComplete(g,s,ui)&&!q.completed.includes(s.id)){q.completed.push(s.id);g.speed=0;return true;}return false;}
export function nextStep(g){const q=ensureGuide(g),list=stepsFor(g.role,g.level,g.mapRevision||0),s=list[q.index];if(s.condition.type==='read'&&!q.completed.includes(s.id))q.completed.push(s.id);if(!q.completed.includes(s.id))return false;if(q.index<list.length-1)q.index++;else q.enabled=false;g.speed=0;return true;}
