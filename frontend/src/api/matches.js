import { apiGet, apiPost } from "./client";

const USER_ID = "690516d603df32cfec6c432d"; //temp

export async function getNextCandidate() {
  return apiGet(`/api/dashboard/next-card/${USER_ID}`);
}

export async function sendInvite(toUserId) {
  return apiPost(`/api/dashboard/invite`, {
    fromUserId: USER_ID,
    toUserId,
  });
}

export async function skipCandidate(candidateId) {
  return apiPost(`/api/dashboard/skip`, {
    userId: USER_ID,
    candidateId,
  });
}

export async function resetMatches() {
  return apiPost(`/api/dashboard/reset/${USER_ID}`, {});
}

export async function getUserStats() {
  return apiGet(`/api/dashboard/stats/${USER_ID}`);
}
