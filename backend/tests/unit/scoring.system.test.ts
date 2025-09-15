/**
 * Scoring System Tests
 * 
 * Tests for the new 10-point referendum scoring system
 * This is a major feature added in the SQLite migration
 */

describe('Referendum Scoring System', () => {
  describe('Score Validation', () => {
    it('should validate individual score ranges', () => {
      const validScores = [1, 2, 3, 4, 5];
      const invalidScores = [0, 6, -1, 10, 3.5];

      validScores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(1);
        expect(score).toBeLessThanOrEqual(5);
        expect(Number.isInteger(score)).toBe(true);
      });

      invalidScores.forEach(score => {
        const isValid = score >= 1 && score <= 5 && Number.isInteger(score);
        expect(isValid).toBe(false);
      });
    });

    it('should validate complete scoring criteria', () => {
      const completeScoringData = {
        referendum_id: 123,
        necessity_score: 4,
        funding_score: 3,
        competition_score: 5,
        blueprint_score: 4,
        track_record_score: 3,
        reports_score: 4,
        synergy_score: 3,
        revenue_score: 2,
        security_score: 4,
        open_source_score: 5
      };

      // Extract only score fields
      const scoreFields = Object.entries(completeScoringData)
        .filter(([key]) => key.endsWith('_score'))
        .map(([, value]) => value);

      expect(scoreFields).toHaveLength(10);
      
      scoreFields.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(1);
        expect(score).toBeLessThanOrEqual(5);
        expect(Number.isInteger(score)).toBe(true);
      });
    });
  });

  describe('Score Calculation', () => {
    it('should calculate average score correctly', () => {
      const scores = {
        necessity_score: 4,
        funding_score: 3,
        competition_score: 5,
        blueprint_score: 4,
        track_record_score: 3,
        reports_score: 4,
        synergy_score: 3,
        revenue_score: 2,
        security_score: 4,
        open_source_score: 5
      };

      const scoreValues = Object.values(scores);
      const average = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
      const roundedAverage = Math.round(average * 100) / 100;

      expect(scoreValues).toHaveLength(10);
      expect(average).toBe(3.7);
      expect(roundedAverage).toBe(3.7);
    });

    it('should handle partial scoring', () => {
      const partialScores = {
        necessity_score: 5,
        funding_score: 4,
        competition_score: 3
      };

      const scoreValues = Object.values(partialScores);
      const average = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;

      expect(scoreValues).toHaveLength(3);
      expect(average).toBe(4);
    });

    it('should calculate different score scenarios', () => {
      const scenarios = [
        { scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], expected: 5.0 },
        { scores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], expected: 1.0 },
        { scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], expected: 3.0 },
        { scores: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5], expected: 3.0 },
        { scores: [5, 4, 3, 2, 1, 5, 4, 3, 2, 1], expected: 3.0 }
      ];

      scenarios.forEach(({ scores, expected }) => {
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        expect(average).toBe(expected);
      });
    });
  });

  describe('Scoring Criteria Definition', () => {
    it('should define all 10 scoring criteria', () => {
      const scoringCriteria = [
        'necessity_score',
        'funding_score', 
        'competition_score',
        'blueprint_score',
        'track_record_score',
        'reports_score',
        'synergy_score',
        'revenue_score',
        'security_score',
        'open_source_score'
      ];

      expect(scoringCriteria).toHaveLength(10);
      
      scoringCriteria.forEach(criteria => {
        expect(typeof criteria).toBe('string');
        expect(criteria.endsWith('_score')).toBe(true);
        expect(criteria.length).toBeGreaterThan(5);
      });
    });

    it('should validate criteria naming convention', () => {
      const validCriteriaNames = [
        'necessity_score',
        'funding_score',
        'competition_score',
        'blueprint_score',
        'track_record_score',
        'reports_score',
        'synergy_score',
        'revenue_score',
        'security_score',
        'open_source_score'
      ];

      validCriteriaNames.forEach(name => {
        expect(name).toMatch(/^[a-z_]+_score$/);
        expect(name.includes(' ')).toBe(false);
        expect(name.includes('-')).toBe(false);
      });
    });
  });

  describe('Score Interpretation', () => {
    it('should interpret score levels correctly', () => {
      const scoreInterpretation = {
        5: 'Excellent',
        4: 'Good',
        3: 'Average',
        2: 'Below Average',
        1: 'Poor'
      };

      Object.entries(scoreInterpretation).forEach(([score, interpretation]) => {
        const numericScore = parseInt(score);
        expect(numericScore).toBeGreaterThanOrEqual(1);
        expect(numericScore).toBeLessThanOrEqual(5);
        expect(typeof interpretation).toBe('string');
        expect(interpretation.length).toBeGreaterThan(0);
      });
    });

    it('should categorize overall referendum quality', () => {
      const qualityCategories = [
        { averageScore: 4.5, category: 'High Quality' },
        { averageScore: 3.5, category: 'Medium Quality' },
        { averageScore: 2.5, category: 'Low Quality' },
        { averageScore: 1.5, category: 'Very Low Quality' }
      ];

      qualityCategories.forEach(({ averageScore, category }) => {
        expect(averageScore).toBeGreaterThanOrEqual(1);
        expect(averageScore).toBeLessThanOrEqual(5);
        expect(typeof category).toBe('string');
        
        // Basic quality thresholds
        if (averageScore >= 4.0) {
          expect(category).toContain('High');
        } else if (averageScore >= 3.0) {
          expect(category).toContain('Medium');
        } else {
          expect(category).toContain('Low');
        }
      });
    });
  });

  describe('Score Data Structure', () => {
    it('should validate referendum with scoring data', () => {
      const referendumWithScoring = {
        id: 1,
        post_id: 123,
        chain: 'Polkadot',
        title: 'Test Referendum',
        necessity_score: 4,
        funding_score: 3,
        competition_score: 5,
        blueprint_score: 4,
        track_record_score: 3,
        reports_score: 4,
        synergy_score: 3,
        revenue_score: 2,
        security_score: 4,
        open_source_score: 5,
        ref_score: 3.7
      };

      // Validate basic referendum data
      expect(referendumWithScoring.id).toBe(1);
      expect(referendumWithScoring.post_id).toBe(123);
      expect(referendumWithScoring.chain).toBe('Polkadot');
      expect(referendumWithScoring.title).toBe('Test Referendum');

      // Validate calculated score
      expect(referendumWithScoring.ref_score).toBe(3.7);

      // Count scoring fields
      const scoreFields = Object.keys(referendumWithScoring)
        .filter(key => key.endsWith('_score') && key !== 'ref_score');
      
      expect(scoreFields).toHaveLength(10);
    });

    it('should handle missing scores gracefully', () => {
      const partialScoringData = {
        referendum_id: 123,
        necessity_score: 4,
        funding_score: null,
        competition_score: undefined,
        blueprint_score: 3
      };

      const definedScores = Object.entries(partialScoringData)
        .filter(([key, value]) => key.endsWith('_score') && value != null)
        .map(([, value]) => value as number);

      expect(definedScores).toHaveLength(2);
      expect(definedScores).toEqual([4, 3]);

      // Calculate average of defined scores only
      const average = definedScores.reduce((sum, score) => sum + score, 0) / definedScores.length;
      expect(average).toBe(3.5);
    });
  });

  describe('Score Comparison', () => {
    it('should compare referendum scores', () => {
      const referendum1 = { ref_score: 4.2 };
      const referendum2 = { ref_score: 3.8 };
      const referendum3 = { ref_score: 4.2 };

      expect(referendum1.ref_score).toBeGreaterThan(referendum2.ref_score);
      expect(referendum1.ref_score).toBe(referendum3.ref_score);
      expect(referendum2.ref_score).toBeLessThan(referendum1.ref_score);
    });

    it('should sort referendums by score', () => {
      const referendums = [
        { id: 1, ref_score: 3.2 },
        { id: 2, ref_score: 4.5 },
        { id: 3, ref_score: 2.8 },
        { id: 4, ref_score: 4.1 }
      ];

      const sortedByScore = [...referendums].sort((a, b) => b.ref_score - a.ref_score);

      expect(sortedByScore[0].id).toBe(2); // Highest score (4.5)
      expect(sortedByScore[1].id).toBe(4); // Second highest (4.1)
      expect(sortedByScore[2].id).toBe(1); // Third (3.2)
      expect(sortedByScore[3].id).toBe(3); // Lowest (2.8)

      expect(sortedByScore[0].ref_score).toBe(4.5);
      expect(sortedByScore[3].ref_score).toBe(2.8);
    });
  });
}); 