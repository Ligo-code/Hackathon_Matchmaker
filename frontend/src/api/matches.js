import { apiGet, apiPost } from "./client";

export async function getNextCandidate() {
  return apiGet(`/api/dashboard/me/next-card`);
}

export async function sendInvite(toUserId) {
  return apiPost(`/api/dashboard/invite`, {
    toUserId,
  });
}

export async function skipCandidate(candidateId) {
  return apiPost(`/api/dashboard/skip`, {
    candidateId,
  });
}

export async function resetMatches() {
  return apiPost(`/api/dashboard/me/reset`, {});
}

export async function getUserStats() {
  return apiGet(`/api/dashboard/me/stats`);
}
