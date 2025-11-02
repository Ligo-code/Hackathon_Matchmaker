import { apiGet, apiPost } from "./client";
//get all
export async function getIncomingRequests() {
  return apiGet(`/api/requests/me/incoming`);
}

// accept
export async function acceptRequest(inviteId) {
  return apiPost(`/api/requests/${inviteId}/accept`);
}

// decline
export async function rejectRequest(inviteId) {
  return apiPost(`/api/requests/${inviteId}/reject`);
}
