import { apiGet, apiPost } from "./client";

const USER_ID = import.meta.env.VITE_USER_ID;

// Получить следующего кандидата
export async function getNextCandidate() {
  return apiGet(`/matches/next-card/${USER_ID}`);
}

// Отправить инвайт
export async function sendInvite(toUserId) {
  return apiPost(`/matches/invite`, {
    fromUserId: USER_ID,
    toUserId,
  });
}

// Пропустить кандидата
export async function skipCandidate(candidateId) {
  return apiPost(`/matches/skip`, {
    userId: USER_ID,
    candidateId,
  });
}

// Сбросить просмотренные и пропущенные
export async function resetMatches() {
  return apiPost(`/matches/reset/${USER_ID}`, {});
}

// Получить статистику пользователя
export async function getUserStats() {
  return apiGet(`/matches/stats/${USER_ID}`);
}
