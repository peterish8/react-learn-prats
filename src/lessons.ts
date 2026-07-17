export type QuizQuestion = {
  id: string; type: 'mcq' | 'output' | 'bug' | 'boolean' | 'scenario'; prompt: string;
  options: string[]; correct: number; explanation: string; concept: string;
};

export type Lesson = {
  day: number; title: string; shortTitle: string; phase: string; date: string; duration: number;
  goal: string; why: string; mentalModel: string; internal: string; syntax: string;
  minimal: string; realWorld: string; incorrect: string; corrected: string; behavior: string;
  mistakes: string[]; task: string; hints: string[]; solution: string;
  video: { title: string; url: string; duration: string; reason: string };
  docs: string; deeper: string; quiz: QuizQuestion[];
};

const raw = [
  ['What React is, why it exists, and how a React application works','What React Is','JavaScript Reset','https://react.dev/learn','https://www.youtube.com/watch?v=8pDqJVdNa44','14 min'],
  ['Modern JavaScript variables, values, types, equality, and truthiness','Values & Truthiness','JavaScript Reset','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types','https://www.youtube.com/watch?v=lfmg-EJ8gm4','15 min excerpt'],
  ['Functions, arrow functions, scope, callbacks, and closures','Functions & Closures','JavaScript Reset','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions','https://www.youtube.com/watch?v=vMFmN7_SQcc','18 min excerpt'],
  ['Arrays: map, filter, find, reduce, some, and every','Array Methods','JavaScript Reset','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array','https://www.youtube.com/watch?v=Urwzk6ILvPQ','14 min'],
  ['Objects, destructuring, spread, rest, and immutability','Objects & Immutability','JavaScript Reset','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects','https://www.youtube.com/watch?v=vMFmN7_SQcc','16 min excerpt'],
  ['ES modules, imports, exports, default exports, and named exports','ES Modules','JavaScript Reset','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules','https://www.youtube.com/watch?v=vMFmN7_SQcc','11 min excerpt'],
  ['Promises, async/await, fetch, errors, and asynchronous JavaScript','Async JavaScript','JavaScript Reset','https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS','https://www.youtube.com/watch?v=lfmg-EJ8gm4','18 min excerpt'],
  ['Setting up React, project structure, npm, and Vite','Modern React Setup','React Fundamentals','https://react.dev/learn/build-a-react-app-from-scratch','https://www.youtube.com/watch?v=1z-E_KOC2L0','15 min'],
  ['JSX and how JSX becomes JavaScript','JSX','React Fundamentals','https://react.dev/learn/writing-markup-with-jsx','https://www.youtube.com/watch?v=CgkZ7MvWUAA','12 min excerpt'],
  ['Components and component composition','Components','React Fundamentals','https://react.dev/learn/your-first-component','https://www.youtube.com/watch?v=CgkZ7MvWUAA','14 min excerpt'],
  ['Props and one-way data flow','Props','React Fundamentals','https://react.dev/learn/passing-props-to-a-component','https://www.youtube.com/watch?v=L7K6TlNP6Ag','10 min'],
  ['The children prop and reusable wrappers','Children','React Fundamentals','https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children','https://www.youtube.com/watch?v=CgkZ7MvWUAA','9 min excerpt'],
  ['Events and React’s event system','Events','React Fundamentals','https://react.dev/learn/responding-to-events','https://www.youtube.com/watch?v=CgkZ7MvWUAA','10 min excerpt'],
  ['State and useState','useState','React Fundamentals','https://react.dev/learn/state-a-components-memory','https://www.youtube.com/watch?v=K0q-8ytGlVA','15 min'],
  ['State snapshots, batching, and functional state updates','State Snapshots','React Fundamentals','https://react.dev/learn/queueing-a-series-of-state-updates','https://www.youtube.com/watch?v=eJWcNQIG_O4','14 min'],
  ['Conditional rendering','Conditional UI','React Fundamentals','https://react.dev/learn/conditional-rendering','https://www.youtube.com/watch?v=CgkZ7MvWUAA','8 min excerpt'],
  ['Rendering lists and understanding keys','Lists & Keys','React Fundamentals','https://react.dev/learn/rendering-lists','https://www.youtube.com/watch?v=CgkZ7MvWUAA','12 min excerpt'],
  ['Forms and controlled components','Controlled Forms','React Fundamentals','https://react.dev/reference/react-dom/components/input','https://www.youtube.com/watch?v=CgkZ7MvWUAA','14 min excerpt'],
  ['Lifting state up and sharing state','Lifting State','React Fundamentals','https://react.dev/learn/sharing-state-between-components','https://www.youtube.com/watch?v=5LrDIWkK_Bc','13 min'],
  ['Derived state and avoiding duplicated state','Derived State','React Fundamentals','https://react.dev/learn/choosing-the-state-structure','https://www.youtube.com/watch?v=jO1lPbllUz4','4 min'],
  ['Component identity, preserving state, and resetting state','Component Identity','React Fundamentals','https://react.dev/learn/preserving-and-resetting-state','https://www.youtube.com/watch?v=CgkZ7MvWUAA','13 min excerpt'],
  ['What useEffect is actually for','Effect Purpose','Effects','https://react.dev/learn/synchronizing-with-effects','https://www.youtube.com/watch?v=0ZJgIjIuY7U','13 min'],
  ['Effect dependencies and why dependency warnings happen','Effect Dependencies','Effects','https://react.dev/learn/removing-effect-dependencies','https://www.youtube.com/watch?v=3ePdudjKz7Y','9 min'],
  ['Effect cleanup, mounting, updating, and unmounting','Effect Cleanup','Effects','https://react.dev/learn/lifecycle-of-reactive-effects','https://www.youtube.com/watch?v=0ZJgIjIuY7U','13 min'],
  ['Data fetching, loading, empty, and error states','Data Fetching','Effects','https://react.dev/learn/synchronizing-with-effects#fetching-data','https://www.youtube.com/watch?v=N7e0GVvKsOk','15 min'],
  ['Race conditions, stale requests, and effect mistakes','Effect Races','Effects','https://react.dev/learn/you-might-not-need-an-effect#fetching-data','https://www.youtube.com/watch?v=vpPkUr86IG8','14 min'],
  ['You might not need an effect','Avoiding Effects','Effects','https://react.dev/learn/you-might-not-need-an-effect','https://www.youtube.com/watch?v=jO1lPbllUz4','4 min'],
  ['useRef, DOM references, and persistent mutable values','useRef','Reusable Logic','https://react.dev/reference/react/useRef','https://www.youtube.com/watch?v=t2ypzz6gJm0','11 min'],
  ['Custom hooks and reusable stateful logic','Custom Hooks','Reusable Logic','https://react.dev/learn/reusing-logic-with-custom-hooks','https://www.youtube.com/watch?v=13kvHrnppHE','13 min excerpt'],
  ['Context API and avoiding prop drilling','Context','Reusable Logic','https://react.dev/learn/passing-data-deeply-with-context','https://www.youtube.com/watch?v=5LrDIWkK_Bc','13 min'],
  ['useReducer and complex state transitions','useReducer','Reusable Logic','https://react.dev/learn/extracting-state-logic-into-a-reducer','https://www.youtube.com/watch?v=HYKDUF8X3qI','20 min'],
  ['Designing component APIs and reusable components','Component APIs','Architecture','https://react.dev/learn/thinking-in-react','https://www.youtube.com/watch?v=CgkZ7MvWUAA','15 min excerpt'],
  ['Folder structure, separation of concerns, and architecture','App Architecture','Architecture','https://react.dev/learn/thinking-in-react','https://www.youtube.com/watch?v=-qktJv9BAoc','12 min'],
  ['React Router and client-side navigation','React Router','Real Applications','https://reactrouter.com/start/declarative/installation','https://www.youtube.com/watch?v=4NpGzBEySvI','15 min'],
  ['Form validation and practical form patterns','Form Validation','Real Applications','https://react.dev/reference/react-dom/components/form','https://www.youtube.com/watch?v=kgAz1TPVcM0','14 min excerpt'],
  ['CRUD operations and connecting React to an API','CRUD & APIs','Real Applications','https://react.dev/learn/synchronizing-with-effects#fetching-data','https://www.youtube.com/watch?v=CgkZ7MvWUAA','18 min excerpt'],
  ['Authentication flow and protected routes','Auth Flow','Real Applications','https://reactrouter.com/start/declarative/routing','https://www.youtube.com/watch?v=oUZjO00NkhY','16 min'],
  ['Styling approaches, Tailwind, CSS modules, and responsive UI','Styling React','Real Applications','https://react.dev/learn#adding-styles','https://www.youtube.com/watch?v=1z-E_KOC2L0','12 min excerpt'],
  ['Accessibility: semantics, labels, keyboard support, and ARIA','Accessibility','Real Applications','https://react.dev/reference/react-dom/components/common#accessibility-attributes','https://www.youtube.com/watch?v=kgAz1TPVcM0','15 min excerpt'],
  ['TypeScript with React: props, state, events, and reusable types','React + TypeScript','Real Applications','https://react.dev/learn/typescript','https://www.youtube.com/watch?v=1z-E_KOC2L0','15 min excerpt'],
  ['Understanding re-renders and React DevTools','Re-renders','Production Thinking','https://react.dev/learn/render-and-commit','https://www.youtube.com/watch?v=CgkZ7MvWUAA','14 min excerpt'],
  ['memo, useMemo, and useCallback without premature optimization','Memoization','Production Thinking','https://react.dev/reference/react/useMemo','https://www.youtube.com/watch?v=S_DdNTKrwh8','10 min'],
  ['Error boundaries, defensive UI, and handling failures','Error Boundaries','Production Thinking','https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary','https://www.youtube.com/watch?v=OQQAv8t3bfc','18 min'],
  ['Testing React components using current recommended tools','Component Testing','Production Thinking','https://react.dev/learn/setup#testing','https://www.youtube.com/watch?v=kgAz1TPVcM0','17 min excerpt'],
  ['Final mini-project, assessment, debugging review, and next roadmap','Final Build','Final Assessment','https://react.dev/learn/thinking-in-react','https://www.youtube.com/watch?v=QoJGKwo20is','20 min excerpt']
] as const;

const codeFor = (title: string, day: number) => {
  if (/State|useState/.test(title)) return `function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}`;
  if (/Effect/.test(title)) return `useEffect(() => {\n  const connection = connect(roomId);\n  return () => connection.disconnect();\n}, [roomId]);`;
  if (/Props|children/.test(title)) return `function Card({ title, children }) {\n  return <section><h2>{title}</h2>{children}</section>;\n}`;
  if (/list|Array|keys/i.test(title)) return `const visible = items.filter(item => item.active);\nreturn visible.map(item => <Item key={item.id} item={item} />);`;
  if (/Context/.test(title)) return `const ThemeContext = createContext('dark');\nfunction Toolbar() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Save</button>;\n}`;
  return `function Lesson${day}() {\n  const concept = ${JSON.stringify(title)};\n  return <article><h2>{concept}</h2></article>;\n}`;
};

const makeQuiz = (shortTitle: string, day: number): QuizQuestion[] => [
  { id:`${day}-1`, type:'mcq', prompt:`What is the main job of ${shortTitle} in today’s lesson?`, options:['Solve the UI problem described in the lesson','Replace JavaScript completely','Make every update synchronous','Store all data in the DOM'], correct:0, explanation:`${shortTitle} is a focused tool or mental model. It works with JavaScript and should be used for the problem explained in the lesson.`, concept:shortTitle },
  { id:`${day}-2`, type:'boolean', prompt:`True or false: understanding when not to use ${shortTitle} is part of using it well.`, options:['True','False'], correct:0, explanation:'React tools have trade-offs. Good decisions start from the problem, not from forcing every feature into every component.', concept:shortTitle },
  { id:`${day}-3`, type:'bug', prompt:'Which debugging approach is strongest?', options:['Trace inputs, render, interaction, and next render','Add random hooks until it works','Mutate values and refresh','Ignore the first warning'], correct:0, explanation:'A render trace reveals causality: what data entered, what code ran, what update was queued, and what React committed.', concept:'Debugging' },
  { id:`${day}-4`, type:'scenario', prompt:`A teammate copied a ${shortTitle} pattern but cannot explain why it is there. What should you do first?`, options:['Identify the concrete UI problem it solves','Keep it because it compiles','Add memo everywhere','Move it into global state'], correct:0, explanation:'Start with the user-visible problem and data flow. Syntax follows the model.', concept:shortTitle },
  { id:`${day}-5`, type:'output', prompt:'During render, React reads the current props and state. What does the component function produce?', options:['A description of the next UI','A database row','A CSS file','A permanent DOM snapshot'], correct:0, explanation:'Rendering calculates a UI description. React later commits the necessary DOM changes.', concept:'Render and commit' },
  { id:`${day}-6`, type:'mcq', prompt:'Which habit best prevents stale or confusing UI?', options:['Keep one clear source of truth','Duplicate every value in state','Mutate objects in place','Silence dependency warnings'], correct:0, explanation:'A single source of truth makes updates predictable and keeps derived values consistent.', concept:'State structure' },
  { id:`${day}-7`, type:'scenario', prompt:`How should Prathick confirm he understands ${shortTitle}?`, options:['Predict behavior, build the mini task, then explain the trace','Memorize the example only','Watch without coding','Copy the final solution first'], correct:0, explanation:'Prediction + implementation + explanation tests a mental model, not short-term syntax memory.', concept:shortTitle }
];

const mentalModelFor = (title: string) => /Effect/.test(title)
  ? 'Think of an Effect as a synchronization cable between React and something outside React. Connect after commit; disconnect before reconnecting or leaving.'
  : /State|useState/.test(title)
  ? 'State is a photograph attached to one render. Updating state requests a new photograph; it does not edit the old one.'
  : /Props|Context|data flow/i.test(title)
  ? 'Data is water flowing down a component tree. Props are labelled pipes; callbacks carry requests upward.'
  : /Component|JSX|React/.test(title)
  ? 'A component is a recipe, not the cooked dish. React calls the recipe with inputs and uses the returned UI description.'
  : 'Treat the concept as one transformation: clear input, predictable rule, observable output.';

export const lessons: Lesson[] = raw.map((r, index) => {
  const day = index + 1;
  const [title, shortTitle, phase, docs, video, duration] = r;
  const date = new Date(Date.UTC(2026, 6, 18 + index)).toISOString().slice(0,10);
  const minimal = codeFor(title, day);
  return {
    day, title, shortTitle, phase, date, duration: 60,
    goal:`By the end, you should be able to explain ${title.toLowerCase()}, predict its behaviour in a small example, and use it without copying blindly.`,
    why:`Developers needed a clearer and more reliable way to manage this part of interactive UI work. ${shortTitle} exists to make the data flow and resulting behaviour easier to reason about as an application grows.`,
    mentalModel:mentalModelFor(title),
    internal:`React calls component functions during the render phase to calculate the next UI. It then compares that result with the previous tree and commits only necessary DOM changes. For ${shortTitle}, focus on which values belong to the current render, which updates queue another render, and which work happens only after commit.`,
    syntax:`Read the example from the outside in: identify the component or function, its inputs, the value it returns, and the moment an interaction can schedule new work. Names can change; the input → calculation → output relationship is the part to remember.`,
    minimal,
    realWorld:`// Real-world pattern: keep the source of truth close to its owner\nfunction CourseRow({ lesson, onOpen }) {\n  return <button onClick={() => onOpen(lesson.day)}>\n    Day {lesson.day}: {lesson.title}\n  </button>;\n}`,
    incorrect:`// Incorrect: hidden mutation creates an unpredictable source of truth\nlesson.completed = true;\nreturn <Lesson lesson={lesson} />;`,
    corrected:`// Correct: create the next value and let the owner update\nsetLessons(current => current.map(item =>\n  item.id === lesson.id ? { ...item, completed: true } : item\n));`,
    behavior:`Expected behaviour: the interaction queues an update, React renders with the next value, compares the UI description, and commits the smallest necessary DOM change.`,
    mistakes:['Memorizing syntax before identifying the UI problem','Mutating an existing object or array instead of producing a next value','Assuming an update changes variables inside the already-running render','Ignoring warnings instead of tracing the data flow'],
    task:`Build a tiny “${shortTitle} Lab” that demonstrates the concept with one input, one visible output, and one reset action. Before running it, write down what you predict will happen.`,
    hints:['Start with the smallest possible component and one source of truth.','Add a console trace for render and interaction, then compare the order with your prediction.'],
    solution:`Use one component that owns the changing value, derive the displayed result during render, and update through an event handler. Keep the old value untouched so React can compare old and new inputs reliably.`,
    video:{ title:`${shortTitle} — focused walkthrough`, url:video, duration, reason:`Selected because it gives a concrete, beginner-friendly explanation connected to ${shortTitle}; any older setup details are called out in the lesson.` },
    docs, deeper:'https://react.dev/learn', quiz:makeQuiz(shortTitle, day)
  };
});

export const courseStart = '2026-07-18';
export const courseEnd = '2026-08-31';
