import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Eye, Hand, Footprints, MessageCircle, Sparkles, Download, Upload, 
  Crown, Home, ChevronLeft, X, Puzzle, Eraser, Plus, Trash2,
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6
} from 'lucide-react';

// --- 数据结构 ---

type AttributeType = 'arms' | 'legs' | 'eyes' | 'mouth';

interface AttributeData {
  value: number;
  descriptor: string;
}

interface Specialty {
  name: string;
  description: string;
  type: 'starting' | 'advanced';
  effect?: string;
}

interface Role {
  id: string;
  name: string;
  tagline: string;
  description: string;
  attributeDescriptors: Record<AttributeType, string[]>;
  startingSpecialties: Specialty[];
  advancedSpecialties: Specialty[];
  suggestedNames: string[];
}

interface Title {
  id: string;
  name: string;
  date: string;
}

interface GoblinCharacter {
  name: string;
  roleId: string;
  attributes: Record<AttributeType, AttributeData>;
  appearance: string;
  selectedAdvancedSpecialty: string;
  pendingAchievements: string[];
  titles: Title[];
}

const ROLES: Role[] = [
  {
    id: "rowdy",
    name: "捣蛋鬼",
    tagline: "勇敢且机智",
    description: "你喜欢拆解事物。你知道自己体型小，所以找到了补偿方式：精巧的工具或机器。",
    attributeDescriptors: {
      arms: ["多毛的", "能干的", "粗糙的"],
      eyes: ["好奇的", "狂野的", "细长的"],
      legs: ["结实的", "有纹身的", "精瘦的"],
      mouth: ["有疤痕的", "湿润的", "凸牙的"]
    },
    suggestedNames: ["德卡", "格里扎", "洛巴", "巴克", "格鲁姆"],
    startingSpecialties: [
      { name: "老练", description: "手臂属性 +1。", type: "starting", effect: "+1 Arms" },
      { name: "有备无患", description: "花费专注制造一个手持工具或简单装置。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "能工巧匠", description: "用周围物品组装出一个杂乱但有用的机器。", type: "advanced" },
      { name: "敲击维护", description: "敲击机器让它突然停止或启动。", type: "advanced" },
      { name: "灵巧", description: "手臂属性 +1。", type: "advanced", effect: "+1 Arms" }
    ]
  },
  {
    id: "rascal",
    name: "惹事精",
    tagline: "顽皮且灵活",
    description: "你喜欢探索世界。你逃脱麻烦的本事至少和陷入麻烦的本事一样高超。",
    attributeDescriptors: {
      arms: ["戴手套的", "爱抓的", "灵活的"],
      eyes: ["好奇的", "惊慌的", "蒙面的"],
      legs: ["苗条的", "有活力的", "不安分的"],
      mouth: ["薄的", "快速的", "狡猾的"]
    },
    suggestedNames: ["艾姆兹", "卡拉", "提格", "查姆", "珀兹"],
    startingSpecialties: [
      { name: "敏捷", description: "腿脚属性 +1。", type: "starting", effect: "+1 Legs" },
      { name: "滑溜溜", description: "挤压身体通过不可能的空间。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "泰然自若", description: "进行杂技动作时可以忽略复杂情况。", type: "advanced" },
      { name: "发现宝贝", description: "询问TP这里是否有有用或有价值的东西。", type: "advanced" },
      { name: "迅捷", description: "腿脚属性 +1。", type: "advanced", effect: "+1 Legs" }
    ]
  },
  {
    id: "whiz-wart",
    name: "聪明蛋",
    tagline: "好奇且聪明",
    description: "你喜欢了解世界运作方式，并掌握了一点点魔法。",
    attributeDescriptors: {
      arms: ["娇小的", "干净的", "颤抖的"],
      eyes: ["疲惫的", "算计的", "洞悉的"],
      legs: ["粗糙的", "颤巍巍的", "柔软的"],
      mouth: ["粗厚的", "紧绷的", "棱角分明的"]
    },
    suggestedNames: ["阿莎", "恩卡", "薇卡", "格里", "米兹"],
    startingSpecialties: [
      { name: "博学", description: "眼睛属性 +1。", type: "starting", effect: "+1 Eyes" },
      { name: "精通魔法", description: "施放法术：召唤光球、微风、火焰或寒冰。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "奇思魔法", description: "变出视觉幻象，或发送简短心灵消息。", type: "advanced" },
      { name: "第三只眼", description: "观察魔法现象时获得额外信息。", type: "advanced" },
      { name: "精明", description: "眼睛属性 +1。", type: "advanced", effect: "+1 Eyes" }
    ]
  },
  {
    id: "rambler",
    name: "开心果",
    tagline: "和蔼且讨喜",
    description: "你是个出色的娱乐者。你喜爱结交新朋友，擅长用言语讲述故事。",
    attributeDescriptors: {
      arms: ["忙碌的", "修剪整齐的", "油腻的"],
      eyes: ["诚实的", "迷人的", "可爱的"],
      legs: ["笨拙的", "脏的", "冷静的"],
      mouth: ["大声的", "友好的", "傲慢的"]
    },
    suggestedNames: ["黛拉", "古利", "穆西", "金-吉", "吉格"],
    startingSpecialties: [
      { name: "雄辩", description: "嘴巴属性 +1。", type: "starting", effect: "+1 Mouth" },
      { name: "说书人", description: "讲故事让听众全神贯注或唤起强烈情感。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "大眼萌化", description: "让人觉得你很可爱，从而倾向于帮助你。", type: "advanced" },
      { name: "傻瓜开窍", description: "激励另一个地精，让对方获得专注。", type: "advanced" },
      { name: "巧舌", description: "嘴巴属性 +1。", type: "advanced", effect: "+1 Mouth" }
    ]
  }
];

// --- 组件 ---

const Button = ({ onClick, children, variant = 'primary', disabled = false, className = '' }: any) => {
  const base = "px-4 py-3 rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg select-none border-b-4";
  const variants = {
    primary: "bg-emerald-700 text-amber-50 hover:bg-emerald-600 disabled:bg-stone-400 border-emerald-900",
    secondary: "bg-stone-200 text-stone-800 hover:bg-stone-300 disabled:opacity-50 border-stone-400",
    accent: "bg-amber-500 text-stone-900 hover:bg-amber-400 border-amber-700",
    danger: "bg-red-700 text-white hover:bg-red-600 border-red-900",
    ghost: "bg-transparent text-stone-600 shadow-none border-none py-1 px-2"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', title, action }: any) => (
  <div className={`paper-bg border-2 border-stone-800 rounded-2xl shadow-[6px_6px_0px_0px_rgba(44,36,27,1)] p-5 relative ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-4 border-b-2 border-stone-800/10 pb-2">
         {title && <h3 className="font-display text-2xl text-stone-800">{title}</h3>}
         {action}
      </div>
    )}
    {children}
  </div>
);

// --- 主应用 ---

function App() {
  const [step, setStep] = useState(0); 
  const [character, setCharacter] = useState<GoblinCharacter>(() => {
    const saved = localStorage.getItem('goblin_v2');
    return saved ? JSON.parse(saved) : {
      name: "",
      roleId: "",
      appearance: "",
      selectedAdvancedSpecialty: "",
      pendingAchievements: [],
      titles: [],
      attributes: {
        arms: { value: 0, descriptor: "" },
        legs: { value: 0, descriptor: "" },
        eyes: { value: 0, descriptor: "" },
        mouth: { value: 0, descriptor: "" }
      }
    };
  });

  const [diceModal, setDiceModal] = useState({show: false, count: 0, label: ""});
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [synthName, setSynthName] = useState("");

  useEffect(() => {
    localStorage.setItem('goblin_v2', JSON.stringify(character));
  }, [character]);

  const getStat = (stat: AttributeType) => {
    if (!character.roleId) return 0;
    const base = character.attributes[stat].value;
    const role = ROLES.find(r => r.id === character.roleId);
    let bonus = 0;
    role?.startingSpecialties.forEach(s => { 
      if (s.effect?.toLowerCase().includes(stat)) bonus += 1; 
    });
    const adv = role?.advancedSpecialties.find(s => s.name === character.selectedAdvancedSpecialty);
    if (adv?.effect?.toLowerCase().includes(stat)) bonus += 1;
    return base + bonus;
  };

  const resetAll = () => {
    if(confirm("确定清空数据吗？")) {
      localStorage.removeItem('goblin_v2');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = JSON.stringify(character, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `地精_${character.name || '无名'}.json`;
    link.click();
  };

  // --- 渲染子步骤 ---

  const renderSheet = () => {
    const role = ROLES.find(r => r.id === character.roleId)!;
    const finalStats = {
      arms: getStat('arms'),
      legs: getStat('legs'),
      eyes: getStat('eyes'),
      mouth: getStat('mouth')
    };

    return (
      <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-pop">
        <div className="text-center relative py-6">
          <h1 className="text-5xl font-display text-emerald-900">{character.name || '新地精'}</h1>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">{role.name} · {role.tagline}</p>
          <div className="absolute top-0 right-0 flex gap-2">
            <button onClick={exportData} className="p-2 text-stone-400 hover:text-emerald-700 transition-colors"><Download size={20}/></button>
            <button onClick={resetAll} className="p-2 text-stone-400 hover:text-red-600 transition-colors"><Eraser size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'arms', label: '手臂', icon: Hand },
            { id: 'legs', label: '腿脚', icon: Footprints },
            { id: 'eyes', label: '眼睛', icon: Eye },
            { id: 'mouth', label: '嘴巴', icon: MessageCircle }
          ].map(s => (
            <Card key={s.id} className="p-4 text-center cursor-pointer active:scale-95 transition-transform" onClick={() => {
              setDiceModal({ show: true, count: finalStats[s.id as AttributeType], label: s.label });
              setDiceResults([]);
            }}>
              <div className="flex justify-center text-emerald-800 mb-1"><s.icon size={24}/></div>
              <div className="text-[10px] uppercase font-bold text-stone-400">{s.label}</div>
              <div className="text-4xl font-display">{finalStats[s.id as AttributeType]}</div>
              <div className="text-[10px] italic text-stone-500 mt-1 truncate">{character.attributes[s.id as AttributeType].descriptor || '平常的'}</div>
            </Card>
          ))}
        </div>

        <Card title="功绩与称号" action={<Button variant="ghost" onClick={() => setShowSynthesis(true)} disabled={character.pendingAchievements.filter(a=>a).length < 2}><Puzzle size={20}/></Button>}>
          <div className="space-y-3">
            {character.titles.map(t => (
              <div key={t.id} className="bg-amber-100 border border-amber-300 p-3 rounded-xl flex items-center gap-3">
                <Crown size={18} className="text-amber-600 shrink-0" />
                <div className="flex-1">
                  <div className="font-display text-lg leading-tight">{t.name}</div>
                  <div className="text-[10px] text-amber-700">{t.date}</div>
                </div>
                <button onClick={() => setCharacter({...character, titles: character.titles.filter(x=>x.id!==t.id)})} className="text-amber-900/30"><Trash2 size={16}/></button>
              </div>
            ))}
            {character.pendingAchievements.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  className="flex-1 p-2 bg-white/50 border rounded-lg text-sm" 
                  value={a} 
                  placeholder="记录新的功绩..." 
                  onChange={e => {
                    const next = [...character.pendingAchievements];
                    next[i] = e.target.value;
                    setCharacter({...character, pendingAchievements: next});
                  }} 
                />
                <button onClick={() => setCharacter({...character, pendingAchievements: character.pendingAchievements.filter((_, idx)=>idx!==i)})}><X size={16} className="text-stone-300"/></button>
              </div>
            ))}
            <Button variant="secondary" className="w-full py-2 text-xs" onClick={() => setCharacter({...character, pendingAchievements: [...character.pendingAchievements, ""]})}><Plus size={14}/> 记录功绩</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-display text-2xl border-b-2 border-stone-300">地精专长</h3>
          {role.startingSpecialties.map(s => (
            <div key={s.name} className="bg-white/50 p-3 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-emerald-800 text-sm">{s.name}</span>
                <span className="text-[10px] font-bold bg-stone-200 px-2 py-0.5 rounded-full uppercase">初始</span>
              </div>
              <p className="text-xs text-stone-600">{s.description}</p>
            </div>
          ))}
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
             <div className="flex justify-between items-center mb-1">
               <span className="font-bold text-emerald-900 text-sm">{character.selectedAdvancedSpecialty}</span>
               <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">高级</span>
             </div>
             <p className="text-xs text-stone-800">
               {role.advancedSpecialties.find(s => s.name === character.selectedAdvancedSpecialty)?.description}
             </p>
          </div>
        </div>

        <Button variant="ghost" className="w-full" onClick={() => setStep(0)}>返回主页</Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {step === 0 && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-12 animate-pop">
          <div className="text-center">
            <h1 className="text-6xl font-display text-emerald-900 mb-2">地精跑断腿</h1>
            <p className="text-stone-500 italic tracking-widest">Goblin Errands Tools</p>
          </div>
          
          <Card className="max-w-xs text-center relative">
            <div className="absolute -top-4 -right-4 bg-amber-400 px-2 py-1 rounded-lg font-bold text-xs rotate-6 shadow-md">新版上线</div>
            <p className="text-sm leading-relaxed text-stone-600">虽然你只是去买瓶酱油，但对于地精来说，这足以演变成一场史诗级的灾难。</p>
          </Card>

          <div className="w-full max-w-xs space-y-4">
            <Button onClick={() => setStep(1)} className="w-full py-5 text-2xl"><Sparkles size={24}/> 创建新角色</Button>
            {character.roleId && <Button variant="accent" onClick={() => setStep(5)} className="w-full py-4 text-xl"><Home size={20}/> 我的角色卡</Button>}
            <Button variant="secondary" className="w-full" onClick={() => document.getElementById('imp')?.click()}><Upload size={18}/> 导入档案</Button>
            <input id="imp" type="file" className="hidden" accept=".json" onChange={e => {
              const f = e.target.files?.[0];
              if(!f) return;
              const r = new FileReader();
              r.onload = ev => { setCharacter(JSON.parse(ev.target?.result as string)); setStep(5); };
              r.readAsText(f);
            }} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-md mx-auto p-4 space-y-6 animate-pop">
          <h2 className="text-4xl font-display text-center text-emerald-900 my-8">选择你的天职</h2>
          {ROLES.map(r => (
            <Card key={r.id} className="cursor-pointer hover:border-emerald-700 transition-all" onClick={() => { setCharacter({...character, roleId: r.id}); setStep(2); }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-display text-emerald-800">{r.name}</h3>
                <span className="text-[10px] font-bold bg-amber-200 px-2 py-0.5 rounded-full uppercase">{r.tagline}</span>
              </div>
              <p className="text-xs text-stone-600">{r.description}</p>
            </Card>
          ))}
          <Button variant="ghost" onClick={() => setStep(0)} className="w-full"><ChevronLeft size={16}/> 返回</Button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md mx-auto p-4 space-y-6 pb-24 animate-pop">
           <h2 className="text-3xl font-display text-center text-emerald-900">分配属性</h2>
           {['arms', 'legs', 'eyes', 'mouth'].map(id => (
             <Card key={id} title={id === 'arms' ? '手臂' : id === 'legs' ? '腿脚' : id === 'eyes' ? '眼睛' : '嘴巴'}>
               <div className="flex gap-2 mb-4">
                 {[1, 2, 3, 4].map(v => {
                   const isSelected = character.attributes[id as AttributeType].value === v;
                   const isUsed = !isSelected && Object.values(character.attributes).some(a => a.value === v);
                   return (
                     <button key={v} disabled={isUsed} onClick={() => {
                       const next = { ...character.attributes };
                       next[id as AttributeType].value = v;
                       setCharacter({...character, attributes: next});
                     }} className={`w-12 h-12 rounded-xl font-display text-2xl border-2 transition-all ${isSelected ? 'bg-emerald-600 text-white border-emerald-900 scale-110' : isUsed ? 'bg-stone-100 text-stone-200 border-stone-100' : 'bg-white border-stone-800'}`}>{v}</button>
                   );
                 })}
               </div>
               <div className="flex flex-wrap gap-2">
                 {ROLES.find(r=>r.id===character.roleId)!.attributeDescriptors[id as AttributeType].map(d => (
                   <button key={d} onClick={() => {
                     const next = { ...character.attributes };
                     next[id as AttributeType].descriptor = d;
                     setCharacter({...character, attributes: next});
                   }} className={`px-2 py-1 rounded-full text-[10px] border ${character.attributes[id as AttributeType].descriptor === d ? 'bg-amber-200 border-amber-600' : 'bg-white/50 border-stone-300'}`}>{d}</button>
                 ))}
               </div>
             </Card>
           ))}
           <div className="fixed bottom-0 left-0 w-full p-4 bg-[#fdf6e3]/90 backdrop-blur flex gap-3">
             <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">上一步</Button>
             <Button disabled={Object.values(character.attributes).some(a=>a.value===0)} onClick={() => setStep(3)} className="flex-1">继续</Button>
           </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md mx-auto p-4 space-y-6 animate-pop pb-24">
          <h2 className="text-3xl font-display text-emerald-900">完善资料</h2>
          <Card className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">地精大名</label>
              <input className="w-full p-3 bg-white border-2 border-stone-800 rounded-xl font-display text-2xl" value={character.name} onChange={e=>setCharacter({...character, name: e.target.value})} placeholder="起个名字..." />
              <div className="flex flex-wrap gap-1 mt-2">
                {ROLES.find(r=>r.id===character.roleId)!.suggestedNames.map(n => (
                  <span key={n} onClick={() => setCharacter({...character, name: n})} className="text-[10px] bg-stone-100 px-2 py-1 rounded cursor-pointer">{n}</span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">高级专长</label>
              <div className="space-y-2">
                {ROLES.find(r=>r.id===character.roleId)!.advancedSpecialties.map(s => (
                  <label key={s.name} className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer ${character.selectedAdvancedSpecialty === s.name ? 'bg-emerald-50 border-emerald-800' : 'bg-white border-stone-200'}`}>
                    <input type="radio" className="mt-1 accent-emerald-800" checked={character.selectedAdvancedSpecialty === s.name} onChange={() => setCharacter({...character, selectedAdvancedSpecialty: s.name})} />
                    <div className="flex-1">
                      <div className="font-bold text-sm text-emerald-900">{s.name}</div>
                      <div className="text-[10px] text-stone-500 leading-tight">{s.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </Card>
          <div className="fixed bottom-0 left-0 w-full p-4 bg-[#fdf6e3]/90 backdrop-blur flex gap-3">
             <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">上一步</Button>
             <Button disabled={!character.name || !character.selectedAdvancedSpecialty} onClick={() => setStep(5)} className="flex-1">完成创建</Button>
          </div>
        </div>
      )}

      {step === 5 && renderSheet()}

      {/* 骰子弹窗 */}
      {diceModal.show && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setDiceModal({...diceModal, show: false})}>
          <div className="paper-bg w-full max-w-xs rounded-3xl p-8 border-4 border-stone-800 shadow-2xl animate-pop text-center" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-display mb-2">{diceModal.label} 检定</h2>
            <div className="flex justify-center items-center gap-4 mb-8">
              <button onClick={() => setDiceModal({...diceModal, count: Math.max(1, diceModal.count - 1)})} className="w-10 h-10 rounded-full border-2 border-stone-800">-</button>
              <div className="text-5xl font-display">{diceModal.count}</div>
              <button onClick={() => setDiceModal({...diceModal, count: diceModal.count + 1})} className="w-10 h-10 rounded-full border-2 border-stone-800">+</button>
            </div>
            <Button onClick={() => {
              setIsRolling(true);
              setTimeout(() => {
                const res = Array.from({length: diceModal.count}, () => Math.floor(Math.random()*6)+1);
                setDiceResults(res);
                setIsRolling(false);
              }, 400);
            }} disabled={isRolling} className="w-full py-4 text-xl">{isRolling ? "摇晃中..." : "投掷！"}</Button>
            {diceResults.length > 0 && !isRolling && (
              <div className="mt-8 space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {diceResults.map((r, i) => {
                    const Icons = [null, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
                    const Icon = Icons[r] as any;
                    return <Icon key={i} size={32} className={r === Math.max(...diceResults) ? 'text-emerald-700' : 'text-stone-300'} />;
                  })}
                </div>
                <div className={`text-2xl font-display ${Math.max(...diceResults) === 6 ? 'text-emerald-600' : Math.max(...diceResults) >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                  {Math.max(...diceResults) === 6 ? "大获全胜！" : Math.max(...diceResults) >= 4 ? "勉强成功" : "彻底失败"}
                </div>
              </div>
            )}
            <Button variant="ghost" className="mt-6" onClick={() => setDiceModal({...diceModal, show: false})}>关闭</Button>
          </div>
        </div>
      )}

      {/* 称号合成 */}
      {showSynthesis && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="paper-bg w-full max-w-sm rounded-3xl p-6 border-4 border-stone-800 animate-pop">
            <h2 className="text-2xl font-display mb-4 flex items-center gap-2 text-amber-800"><Crown/> 称号合成</h2>
            <p className="text-xs text-stone-500 mb-4">将目前的功绩合成为一个响亮的称号，你会因此在部落中声名远扬（虽然可能是恶名）。</p>
            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
              {character.pendingAchievements.filter(a=>a).map((a, i) => (
                <div key={i} className="text-xs p-2 bg-white/50 rounded border border-stone-200 italic">“{a}”</div>
              ))}
            </div>
            <input className="w-full p-3 border-2 border-stone-800 rounded-xl mb-6 font-display text-xl" placeholder="输入称号，如：碎蛋者..." value={synthName} onChange={e=>setSynthName(e.target.value)} />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowSynthesis(false)} className="flex-1">取消</Button>
              <Button variant="accent" disabled={!synthName} className="flex-[2]" onClick={() => {
                const nt = { id: Date.now().toString(), name: synthName, date: new Date().toLocaleDateString() };
                setCharacter({...character, titles: [...character.titles, nt], pendingAchievements: []});
                setSynthName("");
                setShowSynthesis(false);
              }}>合成！</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);