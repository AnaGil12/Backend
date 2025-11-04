import { IRunnerService, RunnerConfig, RunnerResult } from '../../domain/services/IRunnerService';
import { ProgrammingLanguage } from '../../domain/entities/Submission';
export declare class RunnerService implements IRunnerService {
    private readonly supportedLanguages;
    executeCode(config: RunnerConfig): Promise<RunnerResult>;
    private executePython;
    private executeJavaScript;
    private executeCpp;
    private executeJava;
    private runPythonTestCase;
    isLanguageSupported(language: ProgrammingLanguage): boolean;
    getSupportedLanguages(): ProgrammingLanguage[];
    getRunnerStats(): Promise<{
        activeRunners: number;
        totalExecutions: number;
        averageExecutionTime: number;
    }>;
}
//# sourceMappingURL=RunnerService.d.ts.map