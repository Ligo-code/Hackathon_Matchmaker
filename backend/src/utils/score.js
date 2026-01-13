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

// NEW: hybrid score = baseline + semantic (ML)
export const hybridScore01 = (baseline01, semantic01) => {
  // Keep baseline as anchor for interpretability & cold start robustness
  // Example weights: 0.65 baseline + 0.35 semantic
  const score = 0.65 * baseline01 + 0.35 * semantic01;
  return +score.toFixed(3);
};