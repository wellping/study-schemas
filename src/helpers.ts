import { QuestionTypeSchema } from "./schemas/Question";
import { QuestionTypeType } from "./types";

export const QuestionType = QuestionTypeSchema.enum;
export const QUESTION_TYPES = QuestionTypeSchema.options;

export const NON_USER_QUESTION_TYPES: QuestionTypeType[] = [
  QuestionType.Branch,
  QuestionType.BranchWithRelativeComparison,
  QuestionType.Wrapper,
];
