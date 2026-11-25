import React, { useMemo, useState } from 'react';

const navGroups = [
  { label: 'WORKSPACE', items: [['Overview','⌂'],['Transactions','⇄'],['Budgets','▤'],['Accounts','▣'],['Recurring','↻'],['Savings goals','◎']] },
  { label: 'WEALTH TOOLS', items: [['Investments','↗'],['Debt manager','▱'],['Net worth','◇'],['Bill calendar','▦']] },
  { label: 'INTELLIGENCE', items: [['Financial health','♥'],['Insights','✦'],['Tax planner','％'],['Loan calculator','∑'],['Savings challenges','✧'],['Reports','▥']] }
];
const initialTransactions = [
  {id:1,name:'Monthly salary',category:'Salary',date:'25 Nov 2026',account:'HDFC Savings',amount:52000,type:'Income',icon:'↗',color:'green'},
  {id:2,name:'Weekly groceries',category:'Food',date:'24 Nov 2026',account:'Main Wallet',amount:1850,type:'Expense',icon:'⌑',color:'orange'},
  {id:3,name:'Netflix subscription',category:'Entertainment',date:'23 Nov 2026',account:'ICICI Credit',amount:649,type:'Expense',icon:'▶',color:'pink'},
  {id:4,name:'Freelance project',category:'Freelance',date:'21 Nov 2026',account:'HDFC Savings',amount:8500,type:'Income',icon:'✧',color:'blue'},
  {id:5,name:'Fuel and commute',category:'Transport',date:'20 Nov 2026',account:'Main Wallet',amount:1200,type:'Expense',icon:'⌁',color:'purple'}
];
const money = n => '₹' + Number(n).toLocaleString('en-IN');
function Icon({children}) { return <span className="nav-icon">{children}</span>; }
function Card({children,className=''}) { return <section className={`card ${className}`}>{children}</section>; }
function Progress({value,color='var(--green)'}) { return <div className="progress"><span style={{width:`${Math.min(value,100)}%`,background:color}} /></div>; }

function LoginPage({ onLogin, onRegister, users }) {
  const rememberedDetails = (() => {
    try {
      return JSON.parse(localStorage.getItem('budgetwise_remembered_details')) || {};
    } catch {
      return {};
    }
  })();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(rememberedDetails.email || '');
  const [password, setPassword] = useState(rememberedDetails.password || '');
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedDetails.email));
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must contain at least 6 characters.'); return; }
    if (mode === 'register') {
      if (!name.trim()) { setError('Please enter your full name.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      if (users.some(user => user.email === cleanEmail)) { setError('An account with this email already exists.'); return; }
      setError('');
      if (rememberMe) {
        localStorage.setItem('budgetwise_remembered_details', JSON.stringify({ email: cleanEmail, password }));
      } else {
        localStorage.removeItem('budgetwise_remembered_details');
      }
      setSuccess('Registered successfully! Opening your dashboard...');
      setTimeout(() => onRegister({ name: name.trim(), email: cleanEmail, password }), 900);
      return;
    }
    const account = users.find(user => user.email === cleanEmail && user.password === password);
    if (!account) { setError('Incorrect email or password. Try the demo credentials or register.'); return; }
    setError('');
    if (rememberMe) {
      localStorage.setItem('budgetwise_remembered_details', JSON.stringify({ email: account.email, password }));
    } else {
      localStorage.removeItem('budgetwise_remembered_details');
    }
    setSuccess('Login successful! Welcome back.');
    setTimeout(() => onLogin(account.email, account.name), 700);
  };
  const switchMode = (next) => { setMode(next); setError(''); setSuccess(''); setConfirmPassword(''); };
  return <main className="login-screen">
    <section className="login-visual">
      <div className="login-brand"><span className="brand-mark">B<span>.</span></span><div><b>budgetwise</b><small>PERSONAL FINANCE</small></div></div>
      <div className="login-message"><span className="welcome-tag">✦ YOUR MONEY, YOUR WAY</span><h1>Make every<br/>rupee <em>count.</em></h1><p>A clearer view of your money starts here. Bring your spending, saving and financial goals into one calm workspace.</p><div className="login-preview"><div className="preview-top"><span>YOUR FINANCIAL SNAPSHOT</span><b>↗ 8.4%</b></div><small>Total balance</small><strong>₹50,500</strong><div className="preview-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="preview-foot"><span>Income <b>₹60,500</b></span><span>Expenses <b>₹6,729</b></span></div></div></div>
      <div className="login-visual-foot">PRIVATE FINANCE WORKSPACE <span>DESIGNED FOR CLARITY</span></div>
    </section>
    <section className="login-form-side"><form className="login-form" onSubmit={submit}>
      <span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span>
      <h2>{mode === 'login' ? 'Sign in to BudgetWise' : 'Create your account'}</h2>
      <p className="login-subtitle">{mode === 'login' ? 'Enter your details to open your financial dashboard.' : 'Join BudgetWise and organize your money in one place.'}</p>
      {mode === 'register' && <label>Full name<input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name" autoComplete="name"/></label>}
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="username"/></label>
      <label>Password<div className="password-wrap"><input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode==='login'?'current-password':'new-password'}/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?'Hide':'Show'}</button></div></label>
      {mode === 'register' && <label>Confirm password<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password"/></label>}
      <div className="login-options">
        <label className="remember-label">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          Remember my details on this device
        </label>
      </div>
      {error&&<div className="login-error">{error}</div>}
      {success&&<div className="login-success">{success}</div>}
      <button className="login-submit" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'} <span>→</span></button>
      <p className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button type="button" onClick={()=>switchMode(mode==='login'?'register':'login')}>{mode==='login'?'Register':'Sign in'}</button></p>
      <div className="login-divider"><span>LOCAL DEMO ACCOUNT</span></div>
      <p className="login-disclaimer">Your account and, if selected, remembered login details are saved in this browser. Do not use a real or reused password: browser localStorage is not secure for passwords.</p>
    </form><div className="login-copyright">© 2026 BudgetWise · Smart Personal Finance Manager</div></section>
  </main>;
}

function App(){
  const savedUsers = (() => {
    try {
      const stored = localStorage.getItem('budgetwise_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  const savedSession = (() => {
    try {
      const stored = localStorage.getItem('budgetwise_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();
  const [loggedIn,setLoggedIn]=useState(Boolean(savedSession));
  const [userEmail,setUserEmail]=useState(savedSession?.email || '');
  const [userName,setUserName]=useState(savedSession?.name || '');
  const [users,setUsers]=useState(savedUsers);
  const [page,setPage]=useState('Overview');
  const [transactions,setTransactions]=useState(initialTransactions);
  const [showAdd,setShowAdd]=useState(false);
  const [showNotifications,setShowNotifications]=useState(false);
  const [period,setPeriod]=useState('This month');
  const [query,setQuery]=useState('');
  const [toast,setToast]=useState('');
  const [form,setForm]=useState({name:'',amount:'',type:'Expense',category:'Food'});
  const [paidBills,setPaidBills]=useState([]);
  const [challenge,setChallenge]=useState(2);
  const [loan,setLoan]=useState({principal:500000,rate:9,years:5});
  const [taxIncome,setTaxIncome]=useState(900000);
  const income=transactions.filter(t=>t.type==='Income').reduce((a,t)=>a+t.amount,0);
  const expenses=transactions.filter(t=>t.type==='Expense').reduce((a,t)=>a+t.amount,0);
  const filtered=transactions.filter(t=>`${t.name} ${t.category} ${t.account}`.toLowerCase().includes(query.toLowerCase()));
  const notify=(s)=>{setToast(s);setTimeout(()=>setToast(''),2500)};
  const addTransaction=(e)=>{e.preventDefault();if(!form.name||!form.amount)return;setTransactions([{id:Date.now(),name:form.name,category:form.category,date:'25 Nov 2026',account:'Main Wallet',amount:Number(form.amount),type:form.type,icon:form.type==='Income'?'↗':'⌑',color:form.type==='Income'?'green':'orange'},...transactions]);setShowAdd(false);setForm({name:'',amount:'',type:'Expense',category:'Food'});notify('Transaction added for this session');};
  const toggleBill=(id)=>setPaidBills(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const emi=useMemo(()=>{const p=Number(loan.principal),r=Number(loan.rate)/1200,n=Number(loan.years)*12;return r===0?p/n:p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)},[loan]);
  const renderNav=()=>navGroups.map(g=><div className="nav-group" key={g.label}><div className="nav-label">{g.label}</div>{g.items.map(([name,icon])=><button key={name} className={`nav-item ${page===name?'active':''}`} onClick={()=>{setPage(name);setQuery('')}}><Icon>{icon}</Icon>{name}{name==='Insights'&&<i className="new-dot"/>}</button>)}</div>);
  const header=(sub)=> <div className="page-heading"><div><div className="eyebrow">BUDGETWISE / {page.toUpperCase()}</div><h1>{page}</h1><p>{sub}</p></div><div className="heading-actions"><button className="icon-button" onClick={()=>setShowNotifications(!showNotifications)}>♧<b className="notification-dot"/></button><button className="primary-button" onClick={()=>setShowAdd(true)}>＋ Add transaction</button></div></div>;
  const transactionRows=(rows)=> <div className="table-wrap"><table><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th>ACCOUNT</th><th className="right">AMOUNT</th></tr></thead><tbody>{rows.map(t=><tr key={t.id}><td><div className="transaction-name"><span className={`tx-icon ${t.color}`}>{t.icon}</span><b>{t.name}</b></div></td><td>{t.category}</td><td>{t.date}</td><td>{t.account}</td><td className={`right amount ${t.type==='Income'?'positive':''}`}>{t.type==='Income'?'+':'−'}{money(t.amount)}</td></tr>)}</tbody></table></div>;
  const overview=()=> <>{header('Your money, clearly organized. Make confident decisions with one financial view.')}
    <div className="welcome-strip"><div><span className="welcome-tag">✦ YOUR FINANCIAL SNAPSHOT</span><h2>Good evening, Advay <span>✦</span></h2><p>You’re building better money habits. Here’s your overview for November.</p></div><div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-coin">₹</div><div className="art-spark">✦</div></div></div>
    <div className="stat-grid"><Card className="stat-card"><div className="stat-top"><span>Total balance</span><span className="stat-symbol">₹</span></div><h2>{money(50500+income-60500)}</h2><div className="stat-foot"><span className="trend up">↗ 8.4%</span><span>vs last month</span></div></Card><Card className="stat-card"><div className="stat-top"><span>Income this month</span><span className="stat-symbol green-text">↗</span></div><h2>{money(income)}</h2><div className="stat-foot"><span className="trend up">↗ 12.8%</span><span>vs last month</span></div></Card><Card className="stat-card"><div className="stat-top"><span>Expenses this month</span><span className="stat-symbol coral-text">↘</span></div><h2>{money(expenses)}</h2><div className="stat-foot"><span className="trend down">↘ 4.2%</span><span>vs last month</span></div></Card><Card className="stat-card health-stat"><div className="stat-top"><span>Financial health</span><span className="stat-symbol">♥</span></div><h2>82<span className="out-of">/100</span></h2><div className="stat-foot"><span className="health-pill">Excellent</span><span>+6 points</span></div></Card></div>
    <div className="content-grid main-grid"><Card><div className="card-heading"><div><h3>Cash flow</h3><p>Income vs expenses over the last 6 months</p></div><select value={period} onChange={e=>setPeriod(e.target.value)}><option>This month</option><option>Last 6 months</option><option>This year</option></select></div><div className="chart-legend"><span><i className="legend-dot income-dot"/>Income</span><span><i className="legend-dot expense-dot"/>Expenses</span></div><div className="bar-chart"><div className="y-labels"><span>₹60k</span><span>₹40k</span><span>₹20k</span><span>₹0</span></div><div className="bars">{[['Jun',42,23],['Jul',55,29],['Aug',48,34],['Sep',68,38],['Oct',58,31],['Nov',82,40]].map(([m,a,b])=><div className="bar-group" key={m}><div className="bar-pair"><i className="bar income-bar" style={{height:a+'%'}}/><i className="bar expense-bar" style={{height:b+'%'}}/></div><small>{m}</small></div>)}</div></div></Card>
    <Card><div className="card-heading"><div><h3>Spending breakdown</h3><p>Where your money goes</p></div><button className="text-button" onClick={()=>setPage('Insights')}>Details ↗</button></div><div className="donut-area"><div className="donut"><div><b>₹6,729</b><small>Total spent</small></div></div><div className="donut-legend">{[['Food & dining','32%','#3e9b79'],['Shopping','24%','#e8a15c'],['Transport','18%','#7b8bd8'],['Bills','16%','#df7770'],['Other','10%','#aab6b0']].map(x=><div key={x[0]}><i style={{background:x[2]}}/><span>{x[0]}</span><b>{x[1]}</b></div>)}</div></div></Card></div>
    <div className="content-grid lower-grid"><Card><div className="card-heading"><div><h3>Recent transactions</h3><p>Your latest money movement</p></div><button className="text-button" onClick={()=>setPage('Transactions')}>View all ↗</button></div>{transactionRows(transactions.slice(0,4))}</Card><Card><div className="card-heading"><div><h3>Budget overview</h3><p>Monthly category limits</p></div><button className="text-button" onClick={()=>setPage('Budgets')}>Manage ↗</button></div><div className="budget-list">{[['Food & dining',4680,7000],['Shopping',2900,5000],['Transport',1200,3000],['Entertainment',1649,2500]].map(([n,v,t])=><div className="budget-item" key={n}><div><b>{n}</b><span>{money(v)} <small>of {money(t)}</small></span></div><Progress value={v/t*100} color={v/t>.8?'#df7770':'#3e9b79'}/></div>)}</div></Card></div>
    <div className="content-grid feature-grid"><Card className="health-mini"><div className="mini-icon">♥</div><div><span className="eyebrow">FINANCIAL HEALTH</span><h3>You're doing well!</h3><p>Your savings rate is 28%, above the recommended 20% target.</p><button className="text-button" onClick={()=>setPage('Financial health')}>View score breakdown ↗</button></div><div className="score-ring"><b>82</b><small>/100</small></div></Card><Card className="bill-mini"><div className="card-heading"><div><h3>Coming up next</h3><p>Your upcoming payments</p></div><button className="text-button" onClick={()=>setPage('Bill calendar')}>Calendar ↗</button></div><div className="upcoming-row"><span className="bill-date">28<br/><small>NOV</small></span><div><b>Internet bill</b><small>Home utilities</small></div><strong>₹999</strong></div><div className="upcoming-row"><span className="bill-date">30<br/><small>NOV</small></span><div><b>Gym membership</b><small>Health & fitness</small></div><strong>₹1,200</strong></div></Card></div>
  </>;
  const pageContent=()=>{
    if(page==='Overview')return overview();
    if(page==='Transactions')return <>{header('Review and search your income and expenses.')}<Card><div className="card-heading"><div><h3>All transactions</h3><p>{transactions.length} entries in this demo session</p></div><input className="search" placeholder="Search transactions..." value={query} onChange={e=>setQuery(e.target.value)}/></div>{transactionRows(filtered)}</Card></>;
    if(page==='Budgets')return <>{header('Set spending limits and keep every category on track.')}<div className="stat-grid three"><Card className="stat-card"><div className="stat-top">Monthly budget</div><h2>₹17,500</h2><div className="stat-foot">Across 4 categories</div></Card><Card className="stat-card"><div className="stat-top">Amount spent</div><h2>₹10,429</h2><div className="stat-foot"><span className="trend up">59.6%</span> of total budget</div></Card><Card className="stat-card"><div className="stat-top">Remaining</div><h2>₹7,071</h2><div className="stat-foot">Available this month</div></Card></div><div className="tile-grid">{[['Food & dining','₹4,680','₹7,000',67],['Shopping','₹2,900','₹5,000',58],['Transport','₹1,200','₹3,000',40],['Entertainment','₹1,649','₹2,500',66],['Health','₹850','₹2,000',43],['Utilities','₹1,100','₹2,500',44]].map(([n,v,t,p])=><Card className="budget-tile" key={n}><div className="tile-icon">▤</div><h3>{n}</h3><div className="budget-amount"><b>{v}</b><span>of {t}</span></div><Progress value={p}/><small>{p}% used</small></Card>)}</div></>;
    if(page==='Accounts')return <>{header('A consolidated view of your money across accounts.')}<div className="tile-grid">{[['HDFC Savings','Bank account','₹38,500','•• 4821','green'],['Main Wallet','UPI wallet','₹8,200','UPI linked','blue'],['Cash','Cash account','₹3,800','Physical cash','orange'],['ICICI Credit','Credit card','−₹4,250','•• 1092','pink']].map(a=><Card className="account-tile" key={a[0]}><div className="account-top"><span className={`account-mark ${a[4]}`}>▣</span><span className="connected">● Connected</span></div><h3>{a[0]}</h3><p>{a[1]} · {a[3]}</p><h2>{a[2]}</h2></Card>)}</div><Card><h3>Account allocation</h3><div className="allocation"><span style={{width:'76%'}}/><span style={{width:'16%'}}/><span style={{width:'8%'}}/></div><div className="chart-legend"><span>● Savings 76%</span><span>● UPI 16%</span><span>● Cash 8%</span></div></Card></>;
    if(page==='Recurring')return <>{header('Keep track of subscriptions and repeating bills.')}<div className="stat-grid three"><Card className="stat-card"><div className="stat-top">Monthly recurring</div><h2>₹3,847</h2><div className="stat-foot">Across 5 payments</div></Card><Card className="stat-card"><div className="stat-top">Due this week</div><h2>₹1,648</h2><div className="stat-foot">2 upcoming payments</div></Card><Card className="stat-card"><div className="stat-top">Paid this month</div><h2>3 / 5</h2><div className="stat-foot">Payments completed</div></Card></div><Card><div className="card-heading"><div><h3>Subscriptions & recurring bills</h3><p>Illustrative monthly payment schedule</p></div></div>{[['Netflix','Entertainment','₹649','28 Nov'],['Internet','Utilities','₹999','28 Nov'],['Gym membership','Health','₹1,200','30 Nov'],['Spotify','Entertainment','₹119','02 Dec'],['Mobile plan','Utilities','₹880','05 Dec']].map((b,i)=><div className="list-row" key={b[0]}><span className="list-avatar">↻</span><div className="list-main"><b>{b[0]}</b><small>{b[1]} · {b[3]}</small></div><strong>{b[2]}</strong><span className="status-tag">{i<3?'Active':'Upcoming'}</span></div>)}</Card></>;
    if(page==='Savings goals')return <>{header('Turn your plans into achievable savings milestones.')}<div className="tile-grid">{[['New laptop','₹32,500','₹65,000',50,'▣'],['Emergency fund','₹18,000','₹50,000',36,'♥'],['Trip to Bali','₹12,000','₹40,000',30,'✈'],['New phone','₹8,000','₹25,000',32,'▧']].map(g=><Card className="goal-tile" key={g[0]}><div className="goal-icon">{g[4]}</div><h3>{g[0]}</h3><div className="goal-amount"><b>{g[1]}</b><span> / {g[2]}</span></div><Progress value={g[3]}/><div className="goal-foot"><span>{g[3]}% completed</span><span>Target progress</span></div></Card>)}</div></>;
    if(page==='Investments')return <>{header('See your investment mix and long-term portfolio at a glance.')}<div className="stat-grid three"><Card className="stat-card"><div className="stat-top">Portfolio value</div><h2>₹1,84,500</h2><div className="stat-foot"><span className="trend up">↗ 11.6%</span> illustrative return</div></Card><Card className="stat-card"><div className="stat-top">Invested amount</div><h2>₹1,65,000</h2><div className="stat-foot">Total contributions</div></Card><Card className="stat-card"><div className="stat-top">Unrealized gain</div><h2 className="green-text">+₹19,500</h2><div className="stat-foot">+11.8% overall</div></Card></div><Card><div className="card-heading"><div><h3>Portfolio allocation</h3><p>Sample investment distribution — not connected to a broker</p></div></div><div className="portfolio-bars">{[['Mutual funds',45,'₹83,025'],['Stocks',30,'₹55,350'],['Gold',15,'₹27,675'],['Fixed deposits',10,'₹18,450']].map((a,i)=><div className="portfolio-row" key={a[0]}><div><b>{a[0]}</b><strong>{a[1]}%</strong></div><Progress value={a[1]} color={['#3e9b79','#7b8bd8','#e8a15c','#df7770'][i]}/></div>)}</div></Card><Card className="notice-card">ⓘ <div><b>Illustrative portfolio only</b><p>Investment figures are sample display values. No live market prices, brokerage accounts or investment advice are connected.</p></div></Card></>;
    if(page==='Debt manager')return <>{header('Understand outstanding balances and plan repayments.')}<div className="stat-grid three"><Card className="stat-card"><div className="stat-top">Total outstanding</div><h2>₹3,45,000</h2><div className="stat-foot">Across 2 liabilities</div></Card><Card className="stat-card"><div className="stat-top">Monthly repayments</div><h2>₹9,850</h2><div className="stat-foot">Scheduled EMI total</div></Card><Card className="stat-card"><div className="stat-top">Debt-to-income</div><h2>18.9%</h2><div className="stat-foot"><span className="health-pill">Manageable</span></div></Card></div><Card><h3>Debt overview</h3>{[['Education loan','₹2,80,000','₹6,500',56],['Personal loan','₹65,000','₹3,350',72]].map(d=><div className="debt-row" key={d[0]}><div><b>{d[0]}</b><span>Outstanding {d[1]} · EMI {d[2]}/mo</span></div><div className="debt-progress"><Progress value={d[3]}/><small>{d[3]}% repayment progress</small></div></div>)}</Card></>;
    if(page==='Net worth')return <>{header('Understand what you own compared with what you owe.')}<Card className="networth-card"><span className="eyebrow">ESTIMATED NET WORTH</span><h2>₹8,24,500</h2><p>Assets − liabilities · illustrative snapshot</p><div className="networth-split"><div><small>Total assets</small><b>₹11,69,500</b></div><div><small>Total liabilities</small><b>₹3,45,000</b></div></div></Card><div className="content-grid"><Card><h3>Assets</h3>{[['Cash & bank accounts','₹50,500'],['Investments','₹1,84,500'],['Fixed deposits','₹2,35,000'],['Other assets','₹6,99,500']].map(x=><div className="simple-row" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</Card><Card><h3>Liabilities</h3>{[['Education loan','₹2,80,000'],['Personal loan','₹65,000']].map(x=><div className="simple-row" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</Card></div></>;
    if(page==='Bill calendar')return <>{header('A month-at-a-glance view of upcoming payment dates.')}<Card><div className="calendar-head"><button className="icon-button">‹</button><h3>November 2026</h3><button className="icon-button">›</button></div><div className="calendar-grid">{['S','M','T','W','T','F','S',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((d,i)=><div className={`${typeof d==='number'?'calendar-day':''} ${[28,30].includes(d)?'has-bill':''} ${d===25?'today':''}`} key={i}>{d}</div>)}</div><div className="bill-agenda"><h3>Upcoming payments</h3>{[['28 Nov','Internet bill','₹999'],['30 Nov','Gym membership','₹1,200'],['02 Dec','Spotify','₹119']].map((b,i)=><div className="simple-row" key={b[1]}><span><b>{b[0]}</b> · {b[1]}</span><strong>{b[2]}</strong><button className={`small-button ${paidBills.includes(i)?'done':''}`} onClick={()=>toggleBill(i)}>{paidBills.includes(i)?'Paid':'Mark paid'}</button></div>)}</div></Card></>;
    if(page==='Financial health')return <>{header('A snapshot of habits that influence your financial well-being.')}<Card className="health-score-card"><div className="score-ring large"><b>82</b><small>/100</small></div><div><span className="health-pill">Excellent health</span><h2>Your financial habits are on track.</h2><p>This illustrative score combines savings, budgeting, debt and cash-flow indicators.</p></div></Card><div className="tile-grid">{[['Savings rate','28%','Target: 20%',88],['Budget discipline','86/100','Within most limits',86],['Debt management','78/100','Debt-to-income 18.9%',78],['Emergency fund','36%','Of 6-month target',36]].map(x=><Card className="health-factor" key={x[0]}><span>{x[0]}</span><h2>{x[1]}</h2><Progress value={x[3]}/><small>{x[2]}</small></Card>)}</div></>;
    if(page==='Insights')return <>{header('Useful observations from the sample spending profile.')}<div className="insight-list">{[['✦','Your savings rate is strong','You are saving 28% of monthly income, above the 20% reference target.','Positive'],['↗','Food spending is your largest category','Food & dining accounts for 32% of the displayed monthly expenses.','Watch'],['◷','Three recurring payments are approaching','Review upcoming subscriptions and bills to avoid missed due dates.','Reminder'],['◎','You are halfway to your laptop goal','Your sample progress is 50%. Keeping a regular contribution can help.','Goal']].map(x=><Card className="insight-card" key={x[1]}><span className="insight-icon">{x[0]}</span><div><h3>{x[1]}</h3><p>{x[2]}</p><span className="status-tag">{x[3]}</span></div></Card>)}</div><Card className="notice-card">ⓘ <div><b>How insights work in this prototype</b><p>These are predefined example insights. They are not generated by an AI model or calculated from live account data.</p></div></Card></>;
    if(page==='Tax planner')return <>{header('Explore a simplified annual income and tax planning estimate.')}<Card className="calculator-card"><div><span className="eyebrow">ANNUAL TAXABLE INCOME</span><h2>Estimate your tax picture</h2><p>Adjust the sample annual income below to see a simple illustrative estimate.</p><label>Annual income (₹)<input type="number" value={taxIncome} onChange={e=>setTaxIncome(Number(e.target.value))}/></label><div className="tax-result"><span>Illustrative 10% estimate</span><b>{money(Math.max(0,taxIncome)*.10)}</b></div><small>This is not an official tax calculation. It ignores deductions, tax slabs, rebates and regime-specific rules.</small></div><div className="calculator-art">％</div></Card></>;
    if(page==='Loan calculator')return <>{header('Estimate a monthly EMI using principal, interest and tenure.')}<div className="content-grid loan-grid"><Card className="calculator-card"><h3>Loan details</h3><label>Loan amount<input type="number" value={loan.principal} onChange={e=>setLoan({...loan,principal:e.target.value})}/></label><label>Annual interest rate (%)<input type="number" step="0.1" value={loan.rate} onChange={e=>setLoan({...loan,rate:e.target.value})}/></label><label>Loan tenure (years)<input type="number" value={loan.years} onChange={e=>setLoan({...loan,years:e.target.value})}/></label></Card><Card className="emi-result"><span className="eyebrow">ESTIMATED MONTHLY EMI</span><h2>{money(Math.round(emi||0))}</h2><p>Estimated monthly repayment</p><div className="simple-row"><span>Principal</span><b>{money(loan.principal)}</b></div><div className="simple-row"><span>Total repayment</span><b>{money(Math.round((emi||0)*loan.years*12))}</b></div><div className="simple-row"><span>Interest amount</span><b>{money(Math.max(0,Math.round((emi||0)*loan.years*12-loan.principal)))}</b></div><small>Illustrative estimate. Actual lender terms may differ.</small></Card></div></>;
    if(page==='Reports')return <>{header('A consolidated overview of your financial activity.')}<div className="tile-grid">{[['Monthly summary','Income, expenses and savings'],['Category report','Spending by category'],['Budget performance','Planned vs actual spending'],['Net worth report','Assets and liabilities']].map(x=><Card className="report-tile" key={x[0]}><span className="report-icon">▥</span><h3>{x[0]}</h3><p>{x[1]}</p><button className="text-button" onClick={()=>notify('Report preview is part of the UI prototype')}>View report ↗</button></Card>)}</div><Card className="notice-card">ⓘ <div><b>Reports are sample previews</b><p>Export and report generation are not connected to a database in this review prototype.</p></div></Card></>;
    return <>{header('Small habits can make meaningful progress over time.')}<Card className="challenge-card"><span className="eyebrow">NOVEMBER SAVINGS CHALLENGE</span><h2>7-day mindful spending challenge</h2><p>Track one no-spend day at a time and build a more intentional relationship with money.</p><div className="challenge-days">{['M','T','W','T','F','S','S'].map((d,i)=><button className={i<challenge?'completed':''} onClick={()=>setChallenge(Math.max(0,Math.min(7,i+1)))} key={i}><b>{i<challenge?'✓':d}</b><small>Day {i+1}</small></button>)}</div><Progress value={challenge/7*100}/><div className="goal-foot"><span>{challenge} of 7 days completed</span><button className="primary-button" onClick={()=>setChallenge(Math.min(7,challenge+1))}>Complete a day +</button></div></Card><div className="tile-grid">{[['No-spend weekend','Avoid non-essential purchases','2 / 2 days',100],['Save ₹500 weekly','Set aside a small amount','₹300 / ₹500',60],['Review subscriptions','Check recurring expenses','Completed',100]].map(x=><Card className="health-factor" key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p><b>{x[2]}</b><Progress value={x[3]}/></Card>)}</div></>;
  };
  const saveUserAndLogin = (account) => {
    const updatedUsers = [...users, account];
    setUsers(updatedUsers);
    localStorage.setItem('budgetwise_users', JSON.stringify(updatedUsers));
    localStorage.setItem('budgetwise_session', JSON.stringify({ name: account.name, email: account.email }));
    setUserEmail(account.email);
    setUserName(account.name);
    setLoggedIn(true);
  };
  const loginUser = (email, name) => {
    const session = { email, name };
    localStorage.setItem('budgetwise_session', JSON.stringify(session));
    setUserEmail(email);
    setUserName(name);
    setLoggedIn(true);
  };
  const logoutUser = () => {
    localStorage.removeItem('budgetwise_session');
    setLoggedIn(false);
    setUserEmail('');
    setUserName('');
  };

  if (!loggedIn) return <LoginPage users={users} onRegister={saveUserAndLogin} onLogin={loginUser} />;
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">B<span>.</span></div><div><b>budgetwise</b><small>PERSONAL FINANCE</small></div></div><div className="profile-mini"><div className="avatar">AS</div><div><b>{userName || userEmail.split('@')[0]}</b><small>Personal account</small></div><button className="profile-logout" onClick={logoutUser} title="Sign out">↪</button></div><nav>{renderNav()}</nav><div className="sidebar-bottom"><div className="upgrade-card"><span>✦ BUDGETWISE PLUS</span><b>Build better money habits.</b><small>Explore your financial potential.</small><button onClick={()=>notify('Plus preview coming soon')}>Explore features ↗</button></div><button className="nav-item" onClick={()=>notify('Settings preview') }><Icon>⚙</Icon>Settings</button><div className="version">BUDGETWISE UI · REVIEW BUILD 1.0</div></div></aside><main className="main-area"><div className="mobile-top"><div className="brand-mark">B<span>.</span></div><b>budgetwise</b><button className="icon-button" onClick={()=>setShowNotifications(!showNotifications)}>♧</button></div><div className="main-inner">{pageContent()}<footer>BudgetWise · Smart Personal Finance Manager <span>Prototype for first review · Sample data</span></footer></div></main>{showNotifications&&<div className="notification-panel"><div className="card-heading"><h3>Notifications</h3><button className="text-button" onClick={()=>setShowNotifications(false)}>Close ×</button></div><div className="notice-item"><b>Upcoming payment</b><p>Internet bill of ₹999 is due on 28 Nov.</p></div><div className="notice-item"><b>Budget check-in</b><p>Your food budget is 67% used.</p></div><div className="notice-item"><b>Savings milestone</b><p>Your laptop goal is halfway complete.</p></div></div>}{showAdd&&<div className="modal-backdrop" onClick={()=>setShowAdd(false)}><form className="modal" onSubmit={addTransaction} onClick={e=>e.stopPropagation()}><div className="card-heading"><div><span className="eyebrow">QUICK ENTRY</span><h2>Add transaction</h2></div><button type="button" className="icon-button" onClick={()=>setShowAdd(false)}>×</button></div><label>Transaction name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Grocery shopping"/></label><label>Amount (₹)<input required type="number" min="1" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Enter amount"/></label><label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Expense</option><option>Income</option></select></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Food','Shopping','Transport','Entertainment','Bills','Salary','Freelance','Other'].map(c=><option key={c}>{c}</option>)}</select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowAdd(false)}>Cancel</button><button className="primary-button">Add transaction</button></div><small>Demo only: this entry remains in memory until you refresh the page.</small></form></div>}{toast&&<div className="toast">✓ {toast}</div>}</div>
}
export default App;
