export const jaccard = (a = [], b = []) => {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...a, ...b]).size || 1;
  return inter / union; // [0..1]
};

export const weightedScore01 = (me, cand) => {
  // Role compatibility: frontend <-> backend = 100%, same role = 50%
  const roleScore = (me.role !== cand.role) ? 1.0 : 0.5;
  
  // Interest similarity using Jaccard
  const interestScore = jaccard(me.interests, cand.interests);
  
  // 70% role compatibility + 30% shared interests
  return +(0.7 * roleScore + 0.3 * interestScore).toFixed(3); // [0..1]
};