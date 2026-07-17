'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, BrainCircuit, CalendarDays, Check, ChevronRight, CircleHelp, Code2, Download, Flame, Gauge, Home, Menu, Play, RotateCcw, Settings, Sparkles, Trophy, Upload, X, Zap } from 'lucide-react';
import { lessons, type Lesson } from './lessons';

type QuizRecord = { answers: Record<string, number>; score: number; completed: boolean };
type Progress = {
  viewed: number[]; practice: number[]; completed: number[]; quizzes: Record<number, QuizRecord>;
  lastDay: number; highestStreak: number;
};

const emptyProgress: Progress = { viewed: [], practice: [], completed: [], quizzes: {}, lastDay: 1, highestStreak: 0 };
const key = 'react-reset-progress-v1';

function loadProgress(): Progress {
  if (typeof window === 'undefined') return emptyProgress;
  try { return { ...emptyProgress, ...JSON.parse(localStorage.getItem(key) || '{}') }; }
  catch { return emptyProgress; }
}

function navigate(path: string) {
  history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' });
}

function usePath() {
  const [path, setPath] = useState(typeof location === 'undefined' ? '/' : location.pathname);
  useEffect(() => { const fn = () => setPath(location.pathname); addEventListener('popstate', fn); return () => removeEventListener('popstate', fn); }, []);
  return path;
}

const nav = [
  ['/', 'Dashboard', Home], ['/lessons', 'Lessons', BookOpen], ['/review', 'Quiz Review', CircleHelp],
  ['/playground', 'Playground', Code2], ['/assessment', 'Final Assessment', Trophy]
] as const;

function Shell({ children, progress, setProgress }: { children: React.ReactNode; progress: Progress; setProgress: (p: Progress) => void }) {
  const path = usePath(); const [open, setOpen] = useState(false); const completed = progress.completed.length;
  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'react-reset-progress.json'; a.click(); URL.revokeObjectURL(url);
  };
  const importRef = useRef<HTMLInputElement>(null);
  const importProgress = async (file?: File) => { if (!file) return; try { setProgress({ ...emptyProgress, ...JSON.parse(await file.text()) }); } catch { alert('That progress file is not valid.'); } };
  return <div className="app-shell">
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    <aside className={open ? 'sidebar open' : 'sidebar'}>
      <button className="brand" onClick={() => navigate('/')}><span className="brand-mark">⚛</span><span>React <b>Reset</b><small>Prathick’s journey</small></span></button>
      <nav>{nav.map(([href, label, Icon]) => <button key={href} onClick={() => { navigate(href); setOpen(false); }} className={(href === '/' ? path === '/' : path.startsWith(href)) ? 'active' : ''}><Icon size={19}/>{label}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="mini-profile"><span>P</span><div><strong>Prathick</strong><small>B.Tech CSE • Year 1</small></div></div>
        <details><summary><Settings size={18}/> Progress settings</summary><div className="settings-actions">
          <button onClick={exportProgress}><Download size={15}/> Export</button>
          <button onClick={() => importRef.current?.click()}><Upload size={15}/> Import</button>
          <button className="danger" onClick={() => confirm('Reset every lesson, quiz and streak?') && setProgress(emptyProgress)}><RotateCcw size={15}/> Reset</button>
          <input ref={importRef} hidden type="file" accept="application/json" onChange={e => importProgress(e.target.files?.[0])}/>
        </div></details>
      </div>
    </aside>
    <main className="main"><header className="topbar"><div><strong>{completed === 45 ? 'Journey complete' : `Day ${String(progress.lastDay).padStart(2,'0')} of 45`}</strong><span>React 19.2 • modern functional React</span></div><div className="top-progress"><span>{Math.round(completed/45*100)}%</span><div><i style={{width:`${completed/45*100}%`}}/></div></div></header>{children}</main>
  </div>;
}

function Stat({ icon, label, value, note, color }: { icon: React.ReactNode; label: string; value: string; note: string; color: string }) {
  return <div className="stat"><span className="stat-icon" style={{color}}>{icon}</span><div><small>{label}</small><strong>{value}</strong><em>{note}</em></div></div>;
}

function calcStreak(completed: number[]) {
  const set = new Set(completed); let n = 0; for (let i = 1; i <= 45 && set.has(i); i++) n++; return n;
}

function weakConcepts(progress: Progress) {
  const counts: Record<string, number> = {};
  Object.entries(progress.quizzes).forEach(([d, record]) => Object.entries(record.answers).forEach(([id, answer]) => {
    const q = lessons[Number(d)-1]?.quiz.find(item => item.id === id); if (q && answer !== q.correct) counts[q.concept] = (counts[q.concept] || 0) + 1;
  }));
  return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,4);
}

function Dashboard({ progress }: { progress: Progress }) {
  const completed = progress.completed.length; const streak = calcStreak(progress.completed); const last = Math.min(45, progress.lastDay || 1); const lesson = lessons[last-1];
  const quizValues = Object.values(progress.quizzes); const quizScore = quizValues.length ? Math.round(quizValues.reduce((a,q)=>a+q.score,0)/quizValues.length) : 0;
  const weak = weakConcepts(progress);
  return <div className="page dashboard">
    <section className="continue-panel"><div><span className="section-label">CONTINUE LEARNING</span><h1>Day {String(last).padStart(2,'0')}</h1><h2>{lesson.shortTitle}</h2><p>{lesson.goal}</p><div className="meta"><span>◷ 60 min</span><span>◎ {lesson.phase}</span></div></div><div className="atom-visual"><span>⚛</span><i/><i/><i/></div><button className="primary" onClick={() => navigate(`/day/${last}`)}><Play size={18}/> Continue learning</button></section>
    <section className="stats-grid">
      <Stat icon={<CalendarDays/>} label="Days completed" value={`${completed} / 45`} note={`${Math.round(completed/45*100)}% complete`} color="#00D4B3"/>
      <Stat icon={<Flame/>} label="Current streak" value={`${streak} days`} note={`Best ${Math.max(streak,progress.highestStreak)} days`} color="#F9D15B"/>
      <Stat icon={<BrainCircuit/>} label="Quiz score" value={`${quizScore}%`} note={`${quizValues.length} attempts`} color="#4DA3FF"/>
      <Stat icon={<Gauge/>} label="Overall progress" value={`${Math.round(completed/45*100)}%`} note={`${45-completed} days remain`} color="#7F13EC"/>
    </section>
    <div className="dash-columns"><section className="roadmap panel"><div className="panel-title"><h3>45-Day Roadmap</h3><button onClick={() => navigate('/lessons')}>View all <ChevronRight size={16}/></button></div>
      {['JavaScript Reset','React Fundamentals','Effects','Reusable Logic','Architecture','Real Applications','Production Thinking','Final Assessment'].map(phase => <div className="phase-row" key={phase}><span>{phase}</span><div>{lessons.filter(l=>l.phase===phase).map(l=><button key={l.day} title={l.title} onClick={()=>navigate(`/day/${l.day}`)} className={progress.completed.includes(l.day)?'done':l.day===last?'current':''}>{progress.completed.includes(l.day)?<Check size={13}/>:l.day}</button>)}</div></div>)}
    </section><aside className="dash-side"><section className="panel upcoming"><div className="panel-title"><h3>Upcoming</h3></div>{lessons.slice(last, last+3).map(l=><button key={l.day} onClick={()=>navigate(`/day/${l.day}`)}><span>{String(l.day).padStart(2,'0')}</span><div><strong>{l.shortTitle}</strong><small>{l.phase} • 60 min</small></div><ChevronRight size={16}/></button>)}</section>
      <section className="panel"><div className="panel-title"><h3>Weak concepts</h3></div>{weak.length ? weak.map(([c,n])=><div className="weak" key={c}><Zap size={16}/><span>{c}</span><small>{n} miss{n>1?'es':''}</small></div>) : <div className="empty"><Sparkles/> Complete quizzes to reveal patterns.</div>}</section>
    </aside></div>
  </div>;
}

function VisualExplainer({ lesson }: { lesson: Lesson }) {
  const [step, setStep] = useState(0); const labels = /Effect/.test(lesson.title) ? ['Render','Commit','Connect','Cleanup'] : /State|useState/.test(lesson.title) ? ['Event','Queue update','Next render','Commit UI'] : ['Input','Component','UI tree','DOM commit'];
  return <div className="visual-explainer"><div className="flow">{labels.map((label,i)=><div key={label} className={i<=step?'lit':''}><span>{i+1}</span><strong>{label}</strong>{i<labels.length-1&&<ChevronRight/>}</div>)}</div><p>{step===0?'Start with the trigger or current inputs.':step===1?'React calculates or queues the next work.':step===2?'A new UI description is produced and compared.':'Only necessary browser DOM changes are committed.'}</p><button onClick={()=>setStep((step+1)%4)}>Next step <ChevronRight size={16}/></button></div>;
}

function CodeBlock({ children, label }: { children: string; label: string }) { return <div className="code-block"><span>{label}</span><pre><code>{children}</code></pre></div>; }

function Quiz({ lesson, progress, setProgress }: { lesson: Lesson; progress: Progress; setProgress: (p: Progress)=>void }) {
  const saved = progress.quizzes[lesson.day]; const [answers,setAnswers]=useState<Record<string,number>>(saved?.answers||{}); const [submitted,setSubmitted]=useState(saved?.completed||false);
  const submit=()=>{ if(Object.keys(answers).length<lesson.quiz.length){alert('Answer all 7 questions first.');return;} const score=Math.round(lesson.quiz.filter(q=>answers[q.id]===q.correct).length/lesson.quiz.length*100); setSubmitted(true); setProgress({...progress,quizzes:{...progress.quizzes,[lesson.day]:{answers,score,completed:true}}});};
  const retry=()=>{setAnswers({});setSubmitted(false)};
  return <section className="lesson-section quiz"><div className="section-heading"><span>J</span><div><h2>Daily quiz</h2><p>7 questions • prediction, debugging, and scenarios</p></div></div>{lesson.quiz.map((q,i)=><div className="question" key={q.id}><strong>{i+1}. {q.prompt}</strong><small>{q.type}</small><div>{q.options.map((o,idx)=><button disabled={submitted} key={o} onClick={()=>setAnswers({...answers,[q.id]:idx})} className={`${answers[q.id]===idx?'selected':''} ${submitted&&idx===q.correct?'correct':''} ${submitted&&answers[q.id]===idx&&idx!==q.correct?'wrong':''}`}>{o}</button>)}</div>{submitted&&<p className={answers[q.id]===q.correct?'ok':'no'}>{answers[q.id]===q.correct?'Correct. ':'Not quite. '}{q.explanation}</p>}</div>)}<div className="quiz-actions">{submitted?<><strong>Score: {Math.round(lesson.quiz.filter(q=>answers[q.id]===q.correct).length/lesson.quiz.length*100)}%</strong><button onClick={retry}><RotateCcw size={16}/> Retry</button></>:<button className="primary" onClick={submit}>Submit quiz</button>}</div></section>;
}

function LessonPage({ lesson, progress, setProgress }: { lesson: Lesson; progress: Progress; setProgress: (p: Progress)=>void }) {
  const [solution,setSolution]=useState(false);
  useEffect(()=>{ if(!progress.viewed.includes(lesson.day)) setProgress({...progress,viewed:[...progress.viewed,lesson.day],lastDay:lesson.day}); },[lesson.day]);
  const attempted=progress.practice.includes(lesson.day); const quizDone=progress.quizzes[lesson.day]?.completed; const eligible=progress.viewed.includes(lesson.day)&&attempted&&quizDone;
  const complete=()=>{if(!eligible)return; const completed=[...new Set([...progress.completed,lesson.day])].sort((a,b)=>a-b); const next=Math.min(45,lesson.day+1); setProgress({...progress,completed,lastDay:next,highestStreak:Math.max(progress.highestStreak,calcStreak(completed))});};
  return <div className="page lesson-page"><div className="lesson-hero"><button onClick={()=>navigate('/lessons')}>← All lessons</button><span>Day {String(lesson.day).padStart(2,'0')} • {lesson.phase}</span><h1>{lesson.title}</h1><p>{lesson.goal}</p><div className="lesson-checks"><span className="yes"><Check/> Explanation viewed</span><span className={attempted?'yes':''}>{attempted&&<Check/>} Practice</span><span className={quizDone?'yes':''}>{quizDone&&<Check/>} Quiz</span></div></div>
    <section className="lesson-section"><div className="section-heading"><span>A</span><div><h2>Today’s goal</h2><p>What “understood” looks like</p></div></div><p>{lesson.goal}</p></section>
    <section className="lesson-section split"><div><div className="section-heading"><span>B</span><div><h2>Why this exists</h2></div></div><p>{lesson.why}</p></div><div><div className="section-heading"><span>C</span><div><h2>Simple mental model</h2></div></div><p>{lesson.mentalModel}</p></div></section>
    <section className="lesson-section"><div className="section-heading"><span>D</span><div><h2>Visual explanation</h2><p>Click through the execution trace</p></div></div><VisualExplainer lesson={lesson}/></section>
    <section className="lesson-section"><div className="section-heading"><span>E</span><div><h2>How React works internally</h2><p>Render → compare → commit</p></div></div><p>{lesson.internal}</p><div className="this-means"><strong>This means:</strong> rendering calculates; committing changes the browser. Do not treat them as the same moment.</div></section>
    <section className="lesson-section"><div className="section-heading"><span>F</span><div><h2>Syntax breakdown</h2></div></div><p>{lesson.syntax}</p><CodeBlock label="Minimal example">{lesson.minimal}</CodeBlock></section>
    <section className="lesson-section"><div className="section-heading"><span>G</span><div><h2>Examples and behaviour</h2></div></div><div className="code-grid"><CodeBlock label="Real-world example">{lesson.realWorld}</CodeBlock><CodeBlock label="Incorrect">{lesson.incorrect}</CodeBlock><CodeBlock label="Corrected">{lesson.corrected}</CodeBlock></div><p>{lesson.behavior}</p></section>
    <section className="lesson-section"><div className="section-heading"><span>H</span><div><h2>Common mistakes</h2></div></div><ul className="mistakes">{lesson.mistakes.map(m=><li key={m}>{m}</li>)}</ul></section>
    <section className="lesson-section practice"><div className="section-heading"><span>I</span><div><h2>Mini practice task</h2><p>10–20 minutes</p></div></div><p>{lesson.task}</p><details><summary>Hint 1</summary><p>{lesson.hints[0]}</p></details><details><summary>Hint 2</summary><p>{lesson.hints[1]}</p></details><div className="practice-actions"><button onClick={()=>{if(!attempted)setProgress({...progress,practice:[...progress.practice,lesson.day]})}} className={attempted?'done-button':''}>{attempted?<><Check/> Marked attempted</>:<>I started the task</>}</button><button onClick={()=>setSolution(!solution)}>{solution?'Hide':'Show'} solution</button></div>{solution&&<div className="solution"><strong>Solution approach</strong><p>{lesson.solution}</p></div>}</section>
    <Quiz lesson={lesson} progress={progress} setProgress={setProgress}/>
    <section className="lesson-section resources"><div className="section-heading"><span>K</span><div><h2>Video and references</h2></div></div><div className="resource-card"><Play/><div><strong>{lesson.video.title}</strong><span>{lesson.video.duration}</span><p>{lesson.video.reason}</p><a href={lesson.video.url} target="_blank">Watch verified video ↗</a></div></div><div className="reference-links"><a href={lesson.docs} target="_blank">Official lesson reference ↗</a><a href={lesson.deeper} target="_blank">React 19.2 Learn docs ↗</a></div></section>
    <section className="completion"><div><h2>{progress.completed.includes(lesson.day)?'Lesson complete':'Ready to complete?'}</h2><p>Explanation {progress.viewed.includes(lesson.day)?'✓':'○'} • Practice {attempted?'✓':'○'} • Quiz {quizDone?'✓':'○'}</p></div><button className="primary" disabled={!eligible||progress.completed.includes(lesson.day)} onClick={complete}>{progress.completed.includes(lesson.day)?'Completed':eligible?'Mark complete':'Finish all 3 steps'}</button></section>
    <div className="day-nav"><button disabled={lesson.day===1} onClick={()=>navigate(`/day/${lesson.day-1}`)}>← Previous</button><button disabled={lesson.day===45} onClick={()=>navigate(`/day/${lesson.day+1}`)}>Next →</button></div>
  </div>;
}

function Lessons({ progress }: { progress: Progress }) { return <div className="page"><div className="page-heading"><span>45 daily mental models</span><h1>Course roadmap</h1><p>Open future lessons whenever you need them. Progress unlocks through explanation, practice, and quiz.</p></div><div className="lesson-list">{lessons.map(l=><button key={l.day} onClick={()=>navigate(`/day/${l.day}`)} className={progress.completed.includes(l.day)?'completed':''}><span>{progress.completed.includes(l.day)?<Check/>:String(l.day).padStart(2,'0')}</span><div><small>{l.phase} • {new Date(`${l.date}T00:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</small><strong>{l.title}</strong><em>{progress.quizzes[l.day] ? `Quiz ${progress.quizzes[l.day].score}%` : '60 minutes'}</em></div><ChevronRight/></button>)}</div></div>; }

function Review({ progress }: { progress: Progress }) {
  const misses = lessons.flatMap(l => { const rec=progress.quizzes[l.day]; return rec ? l.quiz.filter(q=>rec.answers[q.id]!==q.correct).map(q=>({l,q,answer:rec.answers[q.id]})) : []; });
  return <div className="page"><div className="page-heading"><span>Turn mistakes into memory</span><h1>Quiz review</h1><p>{misses.length} question{misses.length===1?'':'s'} to revisit across {Object.keys(progress.quizzes).length} quizzes.</p></div>{misses.length?<div className="review-list">{misses.map(({l,q,answer})=><article key={q.id}><span>Day {l.day} • {q.concept}</span><h3>{q.prompt}</h3><p className="wrong-answer">Your answer: {q.options[answer]||'Not answered'}</p><p className="right-answer">Correct: {q.options[q.correct]}</p><p>{q.explanation}</p><button onClick={()=>navigate(`/day/${l.day}`)}>Review lesson <ChevronRight size={15}/></button></article>)}</div>:<div className="big-empty"><BrainCircuit/><h2>No mistakes recorded yet</h2><p>Complete a quiz and your missed concepts will collect here automatically.</p><button className="primary" onClick={()=>navigate('/day/1')}>Start Day 1</button></div>}</div>;
}

function Playground() {
  const [code,setCode]=useState(`function Greeting({ name }) {\n  return <h2>Hello, {name}!</h2>;\n}\n\n<Greeting name="Prathick" />`);
  return <div className="page"><div className="page-heading"><span>Predict before you run</span><h1>React playground</h1><p>Edit the examples. This safe local playground visualizes the JSX output without uploading your code.</p></div><div className="playground"><div><div className="editor-bar"><span>App.tsx</span><button onClick={()=>setCode('')}>Clear</button></div><textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/></div><div className="preview"><span>Concept preview</span><div><div className="preview-orbit">⚛</div><h2>{code.match(/name="([^"]+)/)?.[1] ? `Hello, ${code.match(/name="([^"]+)/)?.[1]}!` : 'Your UI appears here'}</h2><p>Try changing the <code>name</code> prop. The preview intentionally supports this focused lesson example.</p></div></div></div></div>;
}

function Assessment({ progress }: { progress: Progress }) {
  const unlocked=progress.completed.length>=40;
  return <div className="page"><div className="assessment-hero"><Trophy/><span>Day 45</span><h1>Build without the training wheels</h1><p>One mixed quiz, five debugging traces, and a small production-style React challenge.</p><button disabled={!unlocked} className="primary" onClick={()=>navigate('/day/45')}>{unlocked?'Begin final assessment':`Complete ${40-progress.completed.length} more lessons to unlock`}</button></div><div className="assessment-grid"><article><strong>01</strong><h3>Mixed mental-model quiz</h3><p>State, effects, refs, architecture, TypeScript, and performance.</p></article><article><strong>02</strong><h3>Debugging review</h3><p>Predict output, find stale state, repair effects, and explain render traces.</p></article><article><strong>03</strong><h3>Independent app challenge</h3><p>Build a study tracker with routing, persistence, validation, and tests.</p></article></div></div>;
}

export default function App() {
  const path=usePath(); const [progress,setProgressState]=useState<Progress>(emptyProgress);
  useEffect(() => setProgressState(loadProgress()), []);
  const setProgress=(p:Progress)=>{setProgressState(p);if(typeof window!=='undefined')localStorage.setItem(key,JSON.stringify(p));};
  const content=useMemo(()=>{const match=path.match(/^\/day\/(\d+)$/); if(match){const lesson=lessons[Number(match[1])-1]; return lesson?<LessonPage key={lesson.day} lesson={lesson} progress={progress} setProgress={setProgress}/>:<Dashboard progress={progress}/>;} if(path==='/lessons')return <Lessons progress={progress}/>; if(path==='/review')return <Review progress={progress}/>; if(path==='/playground')return <Playground/>; if(path==='/assessment')return <Assessment progress={progress}/>; return <Dashboard progress={progress}/>;},[path,progress]);
  return <Shell progress={progress} setProgress={setProgress}>{content}</Shell>;
}
