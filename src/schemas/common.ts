/**
 * These are common schemas that are used by other schemas.
 * It is moved here to avoid circular dependency.
 */
import * as z from "zod";

import {
  ID_REGEX,
  idRegexErrorMessage,
  QUESTION_ID_REGEX,
  questionIdRegexErrorMessage,
} from "../regexes";

/**
 * Used to indicate a key should not be in an object.
 */
export const EXCLUDE_KEY_SCHEMA = z.never().optional(); // a.k.a. `z.undefined()`

export const StudyIdSchema = z
  .string()
  .nonempty()
  .regex(ID_REGEX, {
    message: idRegexErrorMessage("Study ID"),
  });

export const StreamNameSchema = z
  .string()
  .nonempty()
  .regex(ID_REGEX, {
    message: idRegexErrorMessage("Stream name"),
  });

export const QuestionIdSchema = z
  .string()
  .nonempty()
  .regex(QUESTION_ID_REGEX, {
    message: questionIdRegexErrorMessage("Question ID"),
  });

export const PingIdSchema = z
  .string()
  .nonempty()
  .regex(ID_REGEX, {
    message: idRegexErrorMessage("Stream name"),
  });

/**
 * Note: This isn't current used anywhere because this breaks the type
 * inference (it will set the type to `any`).
 *
 * This is a workaround such that the error message for missing it will be
 * > Issue #0: invalid_type at
 * > Required
 * instead of the more confusing
 * > Issue #0: invalid_union at
 * > Invalid input
 *
 * Notice that if an `.optional()` follows, it is unnecessary to use this.
 *
 * Probably don't need to use it after https://github.com/vriad/zod/issues/97
 * is addressed.
 */
export const CustomNullable = (Schema: z.ZodType<any, any>, path: string[]) =>
  Schema.nullable().refine((val) => {
    if (val === undefined) {
      z.null().parse(val, { path });
    }
    return true;
  });

export const ChoiceSchema = z.string().nonempty();

export const ChoicesListSchema = z
  .array(ChoiceSchema)
  .nonempty()
  .refine(
    (choices) => {
      // Check if there is any duplicate items.
      // https://stackoverflow.com/a/7376645
      return choices.length === new Set(choices).size;
    },
    {
      message: "There should not be duplicate elements in the choices list.",
    },
  );

export type GetSchemaOptions = {
  strict?: boolean;
};
