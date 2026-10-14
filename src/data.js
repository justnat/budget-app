export const currencies = ['$','€','£','SAR ','₹','C$','A$','¥'];
export const incomeCategories = ['Salary','Freelance','Investments','Side Hustle','Real Estate','Other'];
export const expenseCategories = ['Housing','Transportation','Food & Dining','Utilities','Entertainment','Healthcare','Personal','Savings & Investments','Debt Repayment','Other'];
export const demoBudget = {
  currency: '$',
  incomes: [
    { id:'inc-1', name:'Primary Salary', amount:4500, frequency:'monthly', category:'Salary' },
    { id:'inc-2', name:'Freelance Design', amount:800, frequency:'monthly', category:'Freelance' },
  ],
  expenses: [
    { id:'exp-1', name:'Apartment Rent', amount:1600, frequency:'monthly', category:'Housing', ruleClass:'need' },
    { id:'exp-2', name:'Utilities & Internet', amount:250, frequency:'monthly', category:'Utilities', ruleClass:'need' },
    { id:'exp-3', name:'Groceries', amount:550, frequency:'monthly', category:'Food & Dining', ruleClass:'need' },
    { id:'exp-4', name:'Car Payment & Gas', amount:420, frequency:'monthly', category:'Transportation', ruleClass:'need' },
    { id:'exp-5', name:'Dining Out & Entertainment', amount:350, frequency:'monthly', category:'Entertainment', ruleClass:'want' },
    { id:'exp-6', name:'Streaming Subscriptions', amount:45, frequency:'monthly', category:'Entertainment', ruleClass:'want' },
    { id:'exp-7', name:'401k & Roth IRA', amount:600, frequency:'monthly', category:'Savings & Investments', ruleClass:'savings' },
  ],
  goals: [
    { id:'goal-1', name:'Emergency Reserve', target:10000, current:4500, icon:'Shield' },
    { id:'goal-2', name:'Japan Summer Vacation', target:4000, current:2200, icon:'Plane' },
  ],
};
export const monthly = x => Number(x.amount || 0) * ({annually:1/12, weekly:52/12, biweekly:26/12}[x.frequency] || 1);
export const totals = state => {
  const income = state.incomes.reduce((a,x) => a + monthly(x), 0);
  const expenses = state.expenses.reduce((a,x) => a + monthly(x), 0);
  const net = income - expenses;
  return { income, expenses, net, rate: income > 0 ? Math.max(0, net / income * 100) : 0 };
};
export const money = (value, currency) => `${currency || '$'}${Number(value || 0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
