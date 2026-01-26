// Bio templates for different roles and interests
// Templates use placeholders: {interests}, {experience}, {role}

const BIO_TEMPLATES = {
  frontend: [
    // Professional & detailed
    "Building pixel-perfect UIs with a passion for {interests}. {experience} developer who loves turning ideas into beautiful, functional interfaces. Looking for backend wizards to bring projects to life! 🎨",
    "Frontend developer specializing in {interests}. With {experience} experience, I focus on creating seamless user experiences. Ready to collaborate on innovative hackathon projects! ⚡",

    // Short & punchy
    "Frontend dev passionate about {interests}. {experience} level. Let's build something amazing! 🚀",
    "Crafting intuitive interfaces | {experience} | {interests} enthusiast | Always learning 📚",

    // Question-based
    "Want to create amazing UIs together? {experience} frontend engineer passionate about {interests}. Let's connect! 💡",

    // Problem-solver angle
    "I turn complex ideas into simple, elegant interfaces. {experience}-level dev focusing on {interests}. Need a frontend partner? 👋",

    // Story-based
    "Love making things look beautiful and work smoothly. {experience} frontend engineer exploring {interests}. Ready to hack and ship! 🌟",
  ],
  backend: [
    // Professional & detailed
    "Backend engineer specializing in {interests}. {experience} developer passionate about scalable architecture and clean code. Ready to build robust systems for your ideas! 🚀",
    "Building APIs and databases with focus on {interests}. {experience}-level engineer who loves solving complex problems. Looking for frontend partners to create complete solutions! ⚡",

    // Short & punchy
    "Backend architect | {experience} | {interests} | Let's build scalable solutions 💻",
    "Server-side specialist focusing on {interests}. {experience} experience. Ready to collaborate! 🔥",

    // Problem-solver angle
    "I make systems fast, secure, and reliable. {experience} backend dev passionate about {interests}. Let's architect something great! 🛠️",

    // Question-based
    "Need solid backend infrastructure? {experience} engineer specializing in {interests}. Ready to bring your ideas to life! 💡",

    // Story-based
    "Building the engines that power great products. {experience} backend developer excited about {interests}. Let's create together! 🚀",
  ],
};

// Interest-specific phrases to enrich templates
const INTEREST_PHRASES = {
  "AI&ML": [
    "machine learning",
    "neural networks",
    "data science",
    "intelligent systems",
  ],
  FinTech: [
    "financial technology",
    "payment systems",
    "blockchain finance",
    "digital banking",
  ],
  HealthTech: [
    "healthcare innovation",
    "medical technology",
    "digital health",
    "wellness solutions",
  ],
  EdTech: [
    "educational technology",
    "learning platforms",
    "online education",
    "knowledge sharing",
  ],
  Blockchain: [
    "decentralized systems",
    "smart contracts",
    "Web3",
    "distributed ledgers",
  ],
  GameDev: [
    "game development",
    "interactive experiences",
    "gaming technology",
    "player engagement",
  ],
  IoT: [
    "Internet of Things",
    "connected devices",
    "embedded systems",
    "smart technology",
  ],
  Cybersecurity: [
    "security systems",
    "threat protection",
    "secure applications",
    "data privacy",
  ],
  "Social Impact": [
    "making a difference",
    "social good",
    "community solutions",
    "positive change",
  ],
  "E-commerce": [
    "online retail",
    "digital commerce",
    "shopping experiences",
    "marketplace solutions",
  ],
  Ecology: [
    "environmental tech",
    "sustainability",
    "green solutions",
    "climate action",
  ],
  Economics: [
    "economic systems",
    "market analysis",
    "financial modeling",
    "business intelligence",
  ],
};

// Experience level descriptors
const EXPERIENCE_DESCRIPTORS = {
  junior: [
    "eager to learn",
    "growing my skills",
    "building experience",
    "passionate beginner",
  ],
  middle: ["experienced", "proven track record", "solid background", "capable"],
  senior: ["seasoned", "extensive experience", "veteran", "expert-level"],
};

/**
 * Fill template with user data
 * @param {string} template - Template string with placeholders
 * @param {Object} user - User profile data
 * @param {string} formattedInterests - Pre-formatted interests string
 * @returns {string} Filled template
 */
const fillTemplate = (template, user, formattedInterests) => {
  const experienceText =
    user.experience.charAt(0).toUpperCase() + user.experience.slice(1);

  return template
    .replace("{interests}", formattedInterests)
    .replace("{experience}", experienceText)
    .replace("{role}", user.role);
};

/**
 * Generate a bio from template
 * @param {Object} user - User profile data
 * @param {string} user.role - User's role (frontend/backend)
 * @param {Array<string>} user.interests - User's interests
 * @param {string} user.experience - User's experience level
 * @returns {string} Generated bio
 */
export const generateBioFromTemplate = (user) => {
  const { role, interests, experience } = user;

  if (!role || !interests || interests.length === 0 || !experience) {
    throw new Error("Missing required user data for bio generation");
  }

  // Select random template for role
  const templates = BIO_TEMPLATES[role] || BIO_TEMPLATES.frontend;
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Format interests with interest-specific phrases
  const formattedInterests = formatInterests(interests);

  // Fill template with user data
  return fillTemplate(template, user, formattedInterests);
};

/**
 * Format interests list into readable text (limit to 3 max)
 * @param {Array<string>} interests - User's interests
 * @param {number} rotationIndex - Index for rotating interests to add variety (default: 0)
 * @returns {string} Formatted interests
 */
const formatInterests = (interests, rotationIndex = 0) => {
  if (!interests || interests.length === 0) return "technology";

  // Rotate interests based on index for variety in multiple suggestions
  const rotated = [...interests];
  for (let i = 0; i < rotationIndex % interests.length; i++) {
    rotated.push(rotated.shift());
  }

  // Limit to top 3 interests to avoid overly long text
  const topInterests = rotated.slice(0, 3);

  // Use interest-specific phrases for variety
  const enhancedInterests = topInterests.map((interest) => {
    const phrases = INTEREST_PHRASES[interest];
    if (phrases && Math.random() > 0.5) {
      return phrases[Math.floor(Math.random() * phrases.length)];
    }
    return interest;
  });

  if (enhancedInterests.length === 1) {
    return enhancedInterests[0];
  } else if (enhancedInterests.length === 2) {
    return `${enhancedInterests[0]} and ${enhancedInterests[1]}`;
  } else {
    // For 3 interests, format as "A, B, and C"
    const first = enhancedInterests[0];
    const second = enhancedInterests[1];
    const third = enhancedInterests[2];
    const suffix = interests.length > 3 ? ", and more" : `, and ${third}`;
    return `${first}, ${second}${suffix}`;
  }
};

/**
 * Get multiple bio suggestions (with interest rotation for variety)
 * @param {Object} user - User profile data
 * @param {number} count - Number of suggestions to generate (default: 3)
 * @returns {Array<string>} Array of generated bios
 */
export const getBioSuggestions = (user, count = 3) => {
  const suggestions = [];
  const usedTemplateIndices = new Set();

  const templates = BIO_TEMPLATES[user.role] || BIO_TEMPLATES.frontend;
  const maxCount = Math.min(count, templates.length);

  // Generate unique suggestions by tracking template indices
  let suggestionIndex = 0;
  while (suggestions.length < maxCount) {
    const templateIndex = Math.floor(Math.random() * templates.length);

    if (!usedTemplateIndices.has(templateIndex)) {
      usedTemplateIndices.add(templateIndex);

      // Generate bio from specific template with rotated interests for variety
      const template = templates[templateIndex];
      const formattedInterests = formatInterests(
        user.interests,
        suggestionIndex
      );
      const bio = fillTemplate(template, user, formattedInterests);

      suggestions.push(bio);
      suggestionIndex++;
    }
  }

  return suggestions;
};

/**
 * Get bio writing tips based on current bio (prioritized, max 3 tips)
 * @param {string} bio - Current bio text
 * @param {Object} user - User profile data
 * @returns {Array<Object>} Array of tips with status and message
 */
export const getBioTips = (bio, user) => {
  const tips = [];

  // Priority 1: Critical - no bio or too short
  if (!bio || bio.length < 50) {
    tips.push({
      status: "error",
      message: "Start by writing at least 100 characters about yourself.",
      priority: 1,
    });
    return tips; // Don't overwhelm user with more tips
  }

  // Priority 2: Important - length feedback
  if (bio.length < 100) {
    tips.push({
      status: "warning",
      message:
        "Add more details to reach the optimal length (150-300 characters).",
      priority: 2,
    });
  } else if (bio.length >= 150 && bio.length <= 300) {
    tips.push({
      status: "success",
      message: "Perfect length! Your bio is detailed and easy to read.",
      priority: 2,
    });
  } else if (bio.length > 300 && bio.length <= 500) {
    tips.push({
      status: "warning",
      message: "Your bio is getting long. Optimal range is 150-300 characters.",
      priority: 2,
    });
  }

  // Priority 3: Medium - interests mention (only if length is OK)
  if (bio.length >= 100 && user.interests) {
    const mentionsInterest = user.interests.some((interest) =>
      bio.toLowerCase().includes(interest.toLowerCase())
    );
    if (!mentionsInterest) {
      tips.push({
        status: "warning",
        message: `Try mentioning your interests (${user.interests
          .slice(0, 2)
          .join(", ")}) to improve matching.`,
        priority: 3,
      });
    } else {
      tips.push({
        status: "success",
        message: "Great! You mentioned your interests.",
        priority: 3,
      });
    }
  }

  // Priority 4 & 5: Low priority tips - only show if we have less than 2 tips already
  // This prevents overwhelming users with too many suggestions at once

  // Call to action
  const ctaWords = [
    "looking",
    "seeking",
    "excited",
    "ready",
    "love",
    "passionate",
    "want",
    "need",
  ];
  const hasCTA = ctaWords.some((word) => bio?.toLowerCase().includes(word));
  if (!hasCTA && tips.length < 2) {
    tips.push({
      status: "info",
      message:
        'Add action words like "looking for", "excited to", or "ready to" to show your enthusiasm.',
      priority: 4,
    });
  }

  // Emoji usage
  const hasEmoji = /[\p{Emoji}]/u.test(bio);
  if (!hasEmoji && tips.length < 2) {
    tips.push({
      status: "info",
      message:
        "Consider adding an emoji or two to make your bio more engaging! 🚀",
      priority: 5,
    });
  }

  // Sort by priority and return max 3 tips
  return tips.sort((a, b) => a.priority - b.priority).slice(0, 3);
};
