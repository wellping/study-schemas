import * as z from "zod";

import { QuestionsListSchema } from "./Question";
import { QuestionIdSchema } from "./common";

export const StreamsSchema = z.record(QuestionsListSchema);

export const StreamsStartingQuestionIdsSchema = z.record(QuestionIdSchema);

export const StreamGroupMappingSchema = z.array(z.object({
  stream: z.string(),
  assignedGroup: z.array(z.string()).optional(),
})).optional();
