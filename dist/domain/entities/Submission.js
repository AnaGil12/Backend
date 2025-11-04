"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgrammingLanguage = exports.SubmissionStatus = void 0;
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["QUEUED"] = "QUEUED";
    SubmissionStatus["RUNNING"] = "RUNNING";
    SubmissionStatus["ACCEPTED"] = "ACCEPTED";
    SubmissionStatus["WRONG_ANSWER"] = "WRONG_ANSWER";
    SubmissionStatus["TIME_LIMIT_EXCEEDED"] = "TIME_LIMIT_EXCEEDED";
    SubmissionStatus["RUNTIME_ERROR"] = "RUNTIME_ERROR";
    SubmissionStatus["COMPILATION_ERROR"] = "COMPILATION_ERROR";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var ProgrammingLanguage;
(function (ProgrammingLanguage) {
    ProgrammingLanguage["PYTHON"] = "python";
    ProgrammingLanguage["JAVASCRIPT"] = "javascript";
    ProgrammingLanguage["CPP"] = "cpp";
    ProgrammingLanguage["JAVA"] = "java";
})(ProgrammingLanguage || (exports.ProgrammingLanguage = ProgrammingLanguage = {}));
//# sourceMappingURL=Submission.js.map