import { weightedScore01 } from './score.js';

/**
 * Calculate match score between two users (0-100)
 */
export const calculateMatchScore = (user1, user2) => {
  if (!user1 || !user2) return 0;
  
  const score01 = weightedScore01(user1, user2);
  return Math.round(score01 * 100); // Convert to 0-100 range
};

/**
 * Get candidate users for matching (not seen, not skipped, not already invited)
 */
export const getCandidates = async (currentUser, userModel, inviteModel) => {
  const excludeIds = [
    currentUser._id,
    ...currentUser.seenUsers,
    ...currentUser.skippedUsers
  ];
  
  // Also exclude users we already sent invites to
  const sentInvites = await inviteModel.find({ from: currentUser._id }).distinct('to');
  excludeIds.push(...sentInvites);
  
  return await userModel.find({
    _id: { $nin: excludeIds },
    isActive: true
  });
};

/**
 * Get next candidate with highest match score
 */
export const getNextCandidate = async (currentUser, userModel, inviteModel) => {
  const candidates = await getCandidates(currentUser, userModel, inviteModel);
  
  if (candidates.length === 0) {
    return null; // No more candidates
  }
  
  // Calculate match scores for all candidates
  const candidatesWithScores = candidates.map(candidate => ({
    ...candidate.toObject(),
    matchScore: calculateMatchScore(currentUser, candidate)
  }));
  
  // Sort by match score and add some randomness
  candidatesWithScores.sort((a, b) => {
    const scoreDiff = b.matchScore - a.matchScore;
    // If scores are close (within 10 points), add randomness
    if (Math.abs(scoreDiff) <= 10) {
      return Math.random() - 0.5;
    }
    return scoreDiff;
  });
  
  return candidatesWithScores[0];
};

/**
 * Reset user's seen/skipped lists for new matching cycle
 */
export const resetUserLists = async (userId, userModel) => {
  return await userModel.findByIdAndUpdate(
    userId,
    { 
      $set: { 
        seenUsers: [], 
        skippedUsers: [] 
      } 
    },
    { new: true }
  );
};