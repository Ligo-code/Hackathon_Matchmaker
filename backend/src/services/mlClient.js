export const getSemanticSimilarity01 = async (me, cand) => {
  const url = process.env.ML_SERVICE_URL;
  if (!url) return 0;

  try {
    const res = await fetch(`${url}/similarity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        a: buildProfileText(me),
        b: buildProfileText(cand),
      }),
    });

    if (!res.ok) return 0;
    const data = await res.json();
    // expected: { similarity01: 0.0..1.0 }
    return typeof data.similarity01 === "number" ? data.similarity01 : 0;
  } catch (e) {
    return 0;
  }
};

const buildProfileText = (u) => {
  // simple & deterministic
  const interests = Array.isArray(u.interests) ? u.interests.join(" ") : "";
  const bio = u.bio || "";
  return `${interests} ${bio}`.trim();
};
