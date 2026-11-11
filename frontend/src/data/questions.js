// Centralized initial question bank keyed by exam id, with a 'default' fallback.
// Pure seed data without circular dependencies.
export const questions = {
  'jee-main': [
    { id: 'j1', subject: 'Physics', topic: 'Mechanics', q: 'A body of mass 2 kg accelerates at 3 m/s². Net force?', o: ['1.5 N', '5 N', '6 N', '9 N'], a: 2, e: 'F = ma = 2 × 3 = 6 N.' },
    { id: 'j2', subject: 'Mathematics', topic: 'Calculus', q: 'd/dx (x²) at x = 3 is:', o: ['3', '6', '9', '2'], a: 1, e: 'd/dx x² = 2x → 6.' },
    { id: 'j3', subject: 'Chemistry', topic: 'Physical Chemistry', q: 'pH of a neutral solution at 25°C:', o: ['0', '7', '14', '1'], a: 1, e: 'Neutral water has pH 7 at 25°C.' },
  ],
  'ssc-cgl': [
    { id: 's1', subject: 'Quantitative', topic: 'Percentage', q: '20% of 250 is:', o: ['40', '50', '60', '25'], a: 1, e: '0.2 × 250 = 50.' },
    { id: 's2', subject: 'General Awareness', topic: 'Polity', q: 'Who presides over the Rajya Sabha?', o: ['Prime Minister', 'Speaker', 'Vice-President', 'President'], a: 2, e: 'The Vice-President is ex-officio Chairman.' },
    { id: 's3', subject: 'Reasoning', topic: 'Series', q: 'Next in series: 2, 4, 8, 16, ?', o: ['24', '32', '30', '20'], a: 1, e: 'Each term doubles.' },
  ],
  default: [
    { id: 'd1', subject: 'Quantitative Aptitude', topic: 'Arithmetic', q: 'If 5 pens cost ₹50, 8 pens cost?', o: ['₹70', '₹80', '₹90', '₹100'], a: 1, e: '₹10 per pen × 8 = ₹80.' },
    { id: 'd2', subject: 'Reasoning', topic: 'Verbal Reasoning', q: 'Odd one out: Apple, Mango, Carrot, Banana', o: ['Apple', 'Mango', 'Carrot', 'Banana'], a: 2, e: 'Carrot is a vegetable.' },
  ],
};
