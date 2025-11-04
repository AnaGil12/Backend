import { IAIAssistantService, ChallengeSuggestion } from '../../domain/services/IAIAssistantService';
export declare class AIAssistantService implements IAIAssistantService {
    private readonly openaiApiKey;
    constructor();
    generateChallengeIdeas(topic: string, count?: number): Promise<ChallengeSuggestion[]>;
    generateTestCases(challengeDescription: string, count?: number): Promise<Array<{
        input: string;
        expectedOutput: string;
        isHidden: boolean;
    }>>;
    validateTestCase(input: string, expectedOutput: string, language: string): Promise<boolean>;
    suggestImprovements(challengeDescription: string): Promise<string[]>;
}
//# sourceMappingURL=AIAssistantService.d.ts.map