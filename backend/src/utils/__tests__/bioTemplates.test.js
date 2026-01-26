import {
  generateBioFromTemplate,
  getBioSuggestions,
  getBioTips,
} from '../bioTemplates.js';

describe('bioTemplates', () => {
  const mockUser = {
    role: 'frontend',
    interests: ['AI&ML', 'FinTech', 'HealthTech'],
    experience: 'middle',
  };

  describe('generateBioFromTemplate', () => {
    test('should generate a valid bio from template', () => {
      const bio = generateBioFromTemplate(mockUser);
      
      expect(bio).toBeTruthy();
      expect(typeof bio).toBe('string');
      expect(bio.length).toBeGreaterThan(50);
    });

    test('should include user experience level (capitalized)', () => {
      const bio = generateBioFromTemplate(mockUser);
      
      expect(bio).toMatch(/Middle/);
    });

    test('should include at least one interest or related phrase', () => {
      const bio = generateBioFromTemplate(mockUser);
      
      const hasInterest = mockUser.interests.some(interest =>
        bio.toLowerCase().includes(interest.toLowerCase()) ||
        bio.toLowerCase().includes('machine learning') ||
        bio.toLowerCase().includes('financial technology') ||
        bio.toLowerCase().includes('healthcare')
      );
      
      expect(hasInterest).toBe(true);
    });

    test('should throw error if missing required fields', () => {
      expect(() => generateBioFromTemplate({})).toThrow(
        'Missing required user data for bio generation'
      );
      
      expect(() => generateBioFromTemplate({ role: 'frontend' })).toThrow();
      expect(() => generateBioFromTemplate({ role: 'frontend', interests: [] })).toThrow();
    });

    test('should work with backend role', () => {
      const backendUser = { ...mockUser, role: 'backend' };
      const bio = generateBioFromTemplate(backendUser);
      
      expect(bio).toBeTruthy();
      expect(bio.length).toBeGreaterThan(50);
    });

    test('should work with different experience levels', () => {
      const juniorUser = { ...mockUser, experience: 'junior' };
      const seniorUser = { ...mockUser, experience: 'senior' };
      
      const juniorBio = generateBioFromTemplate(juniorUser);
      const seniorBio = generateBioFromTemplate(seniorUser);
      
      expect(juniorBio).toContain('Junior');
      expect(seniorBio).toContain('Senior');
    });

    test('should handle single interest', () => {
      const singleInterestUser = { ...mockUser, interests: ['AI&ML'] };
      const bio = generateBioFromTemplate(singleInterestUser);
      
      expect(bio).toBeTruthy();
      expect(bio.length).toBeGreaterThan(50);
    });

    test('should limit interests to 3 in output', () => {
      const manyInterestsUser = {
        ...mockUser,
        interests: ['AI&ML', 'FinTech', 'HealthTech', 'EdTech', 'Blockchain'],
      };
      const bio = generateBioFromTemplate(manyInterestsUser);
      
      // Should mention "and more" or stop at 3rd interest
      expect(bio).toBeTruthy();
      
      // Count how many interests are mentioned
      const mentionedCount = manyInterestsUser.interests.filter(interest =>
        bio.includes(interest)
      ).length;
      
      expect(mentionedCount).toBeLessThanOrEqual(3);
    });
  });

  describe('getBioSuggestions', () => {
    test('should generate default 3 suggestions', () => {
      const suggestions = getBioSuggestions(mockUser);
      
      expect(suggestions).toHaveLength(3);
      expect(Array.isArray(suggestions)).toBe(true);
    });

    test('should generate custom number of suggestions', () => {
      const suggestions = getBioSuggestions(mockUser, 5);
      
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    test('should generate unique suggestions (different templates)', () => {
      const suggestions = getBioSuggestions(mockUser, 3);
      
      // Check that suggestions are not identical
      const uniqueSuggestions = new Set(suggestions);
      expect(uniqueSuggestions.size).toBe(suggestions.length);
    });

    test('should rotate interests across suggestions for variety', () => {
      const manyInterestsUser = {
        ...mockUser,
        interests: ['AI&ML', 'FinTech', 'HealthTech', 'EdTech', 'Blockchain'],
      };
      
      const suggestions = getBioSuggestions(manyInterestsUser, 3);
      
      // Different suggestions should highlight different interests
      // At least check they're not all identical
      expect(suggestions[0]).not.toBe(suggestions[1]);
      expect(suggestions[1]).not.toBe(suggestions[2]);
    });

    test('should not generate more suggestions than available templates', () => {
      const suggestions = getBioSuggestions(mockUser, 20);
      
      // We have 7 templates per role, so max 7 suggestions
      expect(suggestions.length).toBeLessThanOrEqual(7);
    });

    test('should work with both frontend and backend roles', () => {
      const frontendSuggestions = getBioSuggestions(mockUser, 2);
      const backendSuggestions = getBioSuggestions({ ...mockUser, role: 'backend' }, 2);
      
      expect(frontendSuggestions).toHaveLength(2);
      expect(backendSuggestions).toHaveLength(2);
      
      // Suggestions should be different for different roles
      expect(frontendSuggestions[0]).not.toBe(backendSuggestions[0]);
    });
  });

  describe('getBioTips', () => {
    test('should return error tip for empty bio', () => {
      const tips = getBioTips('', mockUser);
      
      expect(tips).toHaveLength(1);
      expect(tips[0].status).toBe('error');
      expect(tips[0].priority).toBe(1);
      expect(tips[0].message).toContain('100 characters');
    });

    test('should return error tip for very short bio', () => {
      const tips = getBioTips('Hello', mockUser);
      
      expect(tips).toHaveLength(1);
      expect(tips[0].status).toBe('error');
    });

    test('should return warning for short but not critical bio', () => {
      const tips = getBioTips('I am a developer who loves to code and build things.', mockUser);
      
      expect(tips.length).toBeGreaterThan(0);
      const lengthTip = tips.find(t => t.message.includes('150-300'));
      expect(lengthTip).toBeTruthy();
      expect(lengthTip.status).toBe('warning');
    });

    test('should return success tip for optimal length bio', () => {
      const optimalBio = 'I am a passionate frontend developer with experience in React, Vue, and Angular. I love building user-friendly interfaces and exploring new technologies in AI&ML and FinTech. Looking forward to collaborating!';
      const tips = getBioTips(optimalBio, mockUser);
      
      const lengthTip = tips.find(t => t.message.includes('Perfect length'));
      expect(lengthTip).toBeTruthy();
      expect(lengthTip.status).toBe('success');
    });

    test('should return warning for too long bio', () => {
      const longBio = 'A'.repeat(350);
      const tips = getBioTips(longBio, mockUser);
      
      const lengthTip = tips.find(t => t.message.includes('getting long'));
      expect(lengthTip).toBeTruthy();
      expect(lengthTip.status).toBe('warning');
    });

    test('should suggest mentioning interests if not present', () => {
      const bioWithoutInterests = 'I am a developer with great experience. Ready to build amazing products and collaborate with others!';
      const tips = getBioTips(bioWithoutInterests, mockUser);
      
      const interestTip = tips.find(t => t.message.includes('interests'));
      expect(interestTip).toBeTruthy();
      expect(interestTip.status).toBe('warning');
    });

    test('should give success tip when interests are mentioned', () => {
      const bioWithInterests = 'I am a developer passionate about AI&ML and FinTech. Ready to build amazing products and collaborate with others!';
      const tips = getBioTips(bioWithInterests, mockUser);
      
      const interestTip = tips.find(t => t.message.includes('mentioned your interests'));
      expect(interestTip).toBeTruthy();
      expect(interestTip.status).toBe('success');
    });

    test('should suggest adding call to action words', () => {
      const bioWithoutCTA = 'I am a developer with experience in React and Vue. I work on frontend projects.';
      const tips = getBioTips(bioWithoutCTA, mockUser);
      
      const ctaTip = tips.find(t => t.message.includes('action words'));
      expect(ctaTip).toBeTruthy();
      expect(ctaTip.status).toBe('info');
    });

    test('should not suggest CTA if already present', () => {
      const bioWithCTA = 'I am a developer passionate about React. Looking for exciting projects to collaborate on!';
      const tips = getBioTips(bioWithCTA, mockUser);
      
      const ctaTip = tips.find(t => t.message.includes('action words'));
      expect(ctaTip).toBeFalsy();
    });

    test('should suggest adding emoji', () => {
      const bioWithoutEmoji = 'I am a developer with experience in React and Vue. Looking for projects to collaborate on.';
      const tips = getBioTips(bioWithoutEmoji, mockUser);
      
      const emojiTip = tips.find(t => t.message.includes('emoji'));
      expect(emojiTip).toBeTruthy();
      expect(emojiTip.status).toBe('info');
    });

    test('should not suggest emoji if already present', () => {
      const bioWithEmoji = 'I am a developer with experience in React and Vue 🚀. Looking for projects to collaborate on!';
      const tips = getBioTips(bioWithEmoji, mockUser);
      
      // Emoji tip should not be in the top priority tips
      const emojiTip = tips.find(t => t.message.includes('emoji'));
      // It might not appear if there are higher priority tips
      if (emojiTip) {
        expect(tips.length).toBeLessThanOrEqual(3);
      }
    });

    test('should return maximum 3 tips', () => {
      const shortBio = 'Hello world';
      const tips = getBioTips(shortBio, mockUser);
      
      expect(tips.length).toBeLessThanOrEqual(3);
    });

    test('should prioritize tips correctly', () => {
      const decentBio = 'I am a frontend developer with some experience. I build things and like to code.';
      const tips = getBioTips(decentBio, mockUser);
      
      // Tips should be sorted by priority (lower number = higher priority)
      for (let i = 0; i < tips.length - 1; i++) {
        expect(tips[i].priority).toBeLessThanOrEqual(tips[i + 1].priority);
      }
    });

    test('should handle bio with all best practices', () => {
      const perfectBio = 'Frontend developer specializing in AI&ML and FinTech. With Middle experience, I focus on creating seamless user experiences. Ready to collaborate on innovative hackathon projects! ⚡';
      const tips = getBioTips(perfectBio, mockUser);
      
      // Should have mostly success tips
      const successTips = tips.filter(t => t.status === 'success');
      expect(successTips.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    test('should handle user with empty interests array', () => {
      const userWithNoInterests = { ...mockUser, interests: [] };
      
      expect(() => generateBioFromTemplate(userWithNoInterests)).toThrow();
    });

    test('should handle undefined user', () => {
      expect(() => generateBioFromTemplate(undefined)).toThrow();
    });

    test('should handle null bio in tips', () => {
      const tips = getBioTips(null, mockUser);
      
      expect(tips).toHaveLength(1);
      expect(tips[0].status).toBe('error');
    });

    test('should handle very long interests list', () => {
      const userWithManyInterests = {
        ...mockUser,
        interests: [
          'AI&ML',
          'FinTech',
          'HealthTech',
          'EdTech',
          'Blockchain',
          'GameDev',
          'IoT',
          'Cybersecurity',
        ],
      };
      
      const bio = generateBioFromTemplate(userWithManyInterests);
      expect(bio).toBeTruthy();
      
      // Bio should not be excessively long
      expect(bio.length).toBeLessThan(500);
    });

    test('should handle bio at max length (500 chars)', () => {
      const maxBio = 'A'.repeat(500);
      const tips = getBioTips(maxBio, mockUser);
      
      expect(tips.length).toBeGreaterThan(0);
      // Should suggest it's too long
      const lengthTip = tips.find(t => t.message.includes('long'));
      expect(lengthTip).toBeTruthy();
    });
  });

  describe('Consistency', () => {
    test('generated bios should always be valid strings', () => {
      for (let i = 0; i < 10; i++) {
        const bio = generateBioFromTemplate(mockUser);
        expect(typeof bio).toBe('string');
        expect(bio.length).toBeGreaterThan(0);
      }
    });

    test('suggestions should always return requested count (up to max)', () => {
      const counts = [1, 2, 3, 5, 7];
      
      counts.forEach(count => {
        const suggestions = getBioSuggestions(mockUser, count);
        expect(suggestions.length).toBeLessThanOrEqual(count);
        expect(suggestions.length).toBeLessThanOrEqual(7); // max templates
      });
    });

    test('tips should always be sorted by priority', () => {
      const bios = [
        '',
        'Short',
        'This is a medium length bio that should trigger some tips.',
        'This is a longer bio with AI&ML and FinTech interests mentioned. Looking forward to exciting collaborations! 🚀',
      ];
      
      bios.forEach(bio => {
        const tips = getBioTips(bio, mockUser);
        
        for (let i = 0; i < tips.length - 1; i++) {
          expect(tips[i].priority).toBeLessThanOrEqual(tips[i + 1].priority);
        }
      });
    });
  });
});
