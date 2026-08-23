const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) throw new Error('inline script not found');
const styleMatch = html.match(/<style>([\s\S]*)<\/style>/);
if (!styleMatch) throw new Error('style block not found');

const elements = new Map();
function elementFor(selector) {
  if (!elements.has(selector)) {
    elements.set(selector, {
      value: '',
      innerHTML: '',
      textContent: '',
      disabled: false,
      style: {},
      dataset: {},
      onclick: null,
      oninput: null,
      onchange: null
    });
  }
  return elements.get(selector);
}

const storage = new Map();
const context = {
  console,
  Math,
  JSON,
  Date,
  setTimeout,
  clearTimeout,
  document: {
    querySelector: elementFor,
    querySelectorAll: () => []
  },
  window: { scrollTo() {} },
  localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key)
  },
  navigator: { clipboard: { writeText: async () => {} } },
  confirm: () => true
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(
  scriptMatch[1] + `\n;globalThis.__test={
    blankTask,initialState,scoreTask,verdictFor,evidenceFor,allDeepAnswered,
    detailComplete,render,setState:value=>{state=value},getState:()=>state
  };`,
  context
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(elements.get('#screen').innerHTML.includes('매주 되풀이하던 일을 줄이고'), 'intro did not render');
assert(!elements.get('#screen').innerHTML.includes('AI 직원'), 'customer-facing intro still uses AI 직원');

const high = Object.assign(context.__test.blankTask(), {
  name: '상담 문의 답변', minutes: 60, freq: 4,
  pattern: 5, transfer: 5, risk: 5,
  data: 5, criteria: 5, exceptions: 1, approval: 5,
  apps: '카카오 → 예약표 → 달력'
});
const highScore = context.__test.scoreTask(high);
assert(highScore.need === 100, `high-need score expected 100, got ${highScore.need}`);
assert(highScore.ready === 100, `high-readiness score expected 100, got ${highScore.ready}`);
assert(context.__test.verdictFor(highScore).label === '이번 주에 먼저 줄여볼 일', 'high score verdict mismatch');

const prepare = Object.assign(context.__test.blankTask(), {
  name: '자료 취합', minutes: 90, freq: 4,
  pattern: 5, transfer: 5, risk: 5,
  data: 1, criteria: 1, exceptions: 5, approval: 1,
  apps: '문자 → 종이 → 파일'
});
const prepareScore = context.__test.scoreTask(prepare);
assert(prepareScore.need >= 70 && prepareScore.ready < 65, 'prepare-first quadrant inputs invalid');
assert(context.__test.verdictFor(prepareScore).label === '자료와 기준부터 정리할 일', 'prepare-first verdict mismatch');

const low = Object.assign(context.__test.blankTask(), {
  name: '가끔 하는 메모', minutes: 10, freq: 1,
  pattern: 1, transfer: 1, risk: 1,
  data: 5, criteria: 5, exceptions: 1, approval: 5,
  apps: '메모장'
});
const lowScore = context.__test.scoreTask(low);
assert(lowScore.need < 70 && lowScore.ready >= 65, 'later-convenience quadrant inputs invalid');
assert(context.__test.verdictFor(lowScore).label === '급하지 않지만 나중에 편해질 일', 'later verdict mismatch');

const blank = context.__test.blankTask();
assert(context.__test.allDeepAnswered(blank) === false, 'blank deep answers should not pass');
assert(context.__test.detailComplete(blank) === false, 'blank detail should not pass');
Object.assign(high, {
  trigger: '문의가 오면', sources: '문의와 가격표', steps: '확인 → 분류 → 초안',
  outcome: '답변과 기록 완료', criteriaText: '가격표 기준',
  humanText: '예외와 환불은 직접 판단', saveNext: '상담표에 저장'
});
assert(context.__test.allDeepAnswered(high) === true, 'complete deep answers should pass');
assert(context.__test.detailComplete(high) === true, 'complete detail should pass');

const task2 = Object.assign(context.__test.blankTask(), low, { id: 'task2', name: '가끔 하는 공지' });
const task3 = Object.assign(context.__test.blankTask(), prepare, { id: 'task3', name: '자료 취합' });
high.id = 'task1';
const resultState = {
  ...context.__test.initialState(),
  phase: 'result', business: '필라테스 회원 상담', scene: '오전마다 문의를 확인해요',
  tasks: [high, task2, task3], selectedIds: ['task1', 'task2', 'task3'],
  selectionInitialized: true, deepIndex: 2
};
context.__test.setState(resultState);
context.__test.render();
const resultHtml = elements.get('#screen').innerHTML;
assert(resultHtml.includes('왜 이 일이 잡혔나요?'), 'result evidence section missing');
assert(resultHtml.includes('갑자기 수업 신청이 아닙니다'), 'soft conversion bridge missing');
assert(!resultHtml.includes('undefined') && !resultHtml.includes('NaN'), 'result contains undefined or NaN');

const textControls = [...html.matchAll(/<(input|textarea)\b[^>]*>/g)].map(match => match[0]);
assert(textControls.length >= 6, 'expected text controls not found');
for (const control of textControls) {
  assert(/placeholder=/.test(control), `text control missing placeholder: ${control}`);
}

const blankTargets = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(match => match[0]);
for (const anchor of blankTargets) {
  assert(/rel="noopener noreferrer"/.test(anchor), `unsafe target blank link: ${anchor}`);
}
assert(!/href="http:/.test(html), 'insecure http link found');

let cssDepth = 0;
for (const character of styleMatch[1]) {
  if (character === '{') cssDepth += 1;
  if (character === '}') cssDepth -= 1;
  assert(cssDepth >= 0, 'CSS closing brace appears before an opening brace');
}
assert(cssDepth === 0, `unbalanced CSS braces: ${cssDepth}`);

for (const asset of [
  'assets/fonts/Paperlogy-6SemiBold.ttf',
  'assets/fonts/Paperlogy-7Bold.ttf',
  'assets/fonts/Paperlogy-8ExtraBold.ttf',
  'assets/fonts/Pretendard-SemiBold.woff2',
  'assets/proof/week1-kimjinsuk.png',
  'assets/proof/week1-student.png',
  'assets/proof/week1-bakeryon.png',
  'assets/proof/week1-blissbaking.png'
]) {
  const fullPath = path.join(root, asset);
  assert(fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0, `missing asset: ${asset}`);
}

console.log('PASS: syntax, scoring quadrants, required answers, result rendering, placeholders, links, and assets');
