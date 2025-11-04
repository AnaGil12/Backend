import { IChallengeRepository } from '../../../domain/repositories/IChallengeRepository';
import { ICourseRepository } from '../../../domain/repositories/ICourseRepository';
import { CreateChallengeRequest, Challenge } from '../../../domain/entities/Challenge';

export class CreateChallengeUseCase {
  constructor(
    private challengeRepository: IChallengeRepository,
    private courseRepository: ICourseRepository
  ) {}

  async execute(request: CreateChallengeRequest, userId: string): Promise<Challenge> {
    // Verify course exists and user has access
    const course = await this.courseRepository.findById(request.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if user is professor of the course
    if (!course.professorIds.includes(userId)) {
      throw new Error('Unauthorized: Only course professors can create challenges');
    }

    // Validate test cases
    if (!request.testCases || request.testCases.length === 0) {
      throw new Error('At least one test case is required');
    }

    // Create challenge
    const challengeData: CreateChallengeRequest = {
      ...request,
      testCases: request.testCases.map((testCase, index) => ({
        ...testCase,
        order: index + 1
      }))
    };

    return await this.challengeRepository.create(challengeData);
  }
}

