import * as z from "zod";

import {
  StreamNameSchema,
  QuestionIdSchema,
  ChoicesListSchema,
  ChoiceSchema,
  GetSchemaOptions,
} from "./common";
import { ID_REGEX, idRegexErrorMessage } from "../regexes";

export const SLIDER_DEFAULTS = {
  DEFAULT_VALUE: 50,
  MIN_VALUE: 0,
  MAX_VALUE: 100,
  STEP: 1,
};

export const QuestionTypeSchema = z.enum([
  "Slider",
  "ChoicesWithSingleAnswer",
  "ChoicesWithMultipleAnswers",
  "YesNo",
  "MultipleText",
  "HowLongAgo",
  "Branch",
  "BranchWithRelativeComparison",
  "Wrapper",
]);

export const QuestionImageOptionsSchema = z.object({
  /**
   * An image URL or an Base64 image data.
   */
  url: z.string(),

  style: z.object({
    width: z.union([z.number().positive(), z.string()]),

    height: z.union([z.number().positive(), z.string()]),

    maxHeight: z.number().positive().optional(),

    maxWidth: z.number().positive().optional(),

    /**
     * If `width` or `height` is set to `"auto"`, this has to be set with the
     * aspect ratio (width:height) of the image.
     *
     * See https://stackoverflow.com/a/61708419/2603230
     */
    aspectRatio: z.number().positive().optional(),
  }),

  position: z.union([z.literal("inDescriptionBox"), z.literal("left")]),
});

const _BaseQuestionSchema = z.object({
  /**
   * The question ID.
   */
  id: QuestionIdSchema,

  /**
   * The question type.
   */
  type: QuestionTypeSchema,

  /**
   * The question text.
   */
  question: z.string(),

  /**
   * The optional question description that will be shown below the question
   * title.
   */
  description: z.string().optional(),

  /**
   * The optional question image that will be shown below the question title
   * and description (if any).
   */
  image: QuestionImageOptionsSchema.optional(),

  /**
   * Add a button with custom label above the "Next"/"PNA" buttons.
   * Clicking this button is equivalent to clicking "Next" without answering.
   */
  extraCustomNextWithoutAnsweringButton: z.string().optional(),

  /**
   * Default values to replace placeholder variables like `[__NAME__]`.
   */
  defaultPlaceholderValues: z.record(z.any()).optional(),

  /**
   * The optional fallback next IDs.
   */
  fallbackNext: z
    .object({
      /**
       * If not `undefined`, this will replace `next` when the user prefers not
       * to answer this question.
       */
      preferNotToAnswer: QuestionIdSchema.nullable().optional(),

      /**
       * If not `undefined`, this will replace `next` when the user presses the
       * "Next" button without interacting with the question UI (the slider,
       * the selection buttons, etc.).
       */
      nextWithoutAnswering: QuestionIdSchema.nullable().optional(),
    })
    .optional(),

  /**
   * The question ID of the next question.
   */
  next: QuestionIdSchema.nullable(),
});
const getBaseQuestionSchema = ({
  strict = __WELLPING_SHOULD_USE_STRICT_SCHEMA__,
}: GetSchemaOptions) =>
  strict ? _BaseQuestionSchema.strict() : _BaseQuestionSchema;

export const getSliderQuestionSchema = (options: GetSchemaOptions) =>
  getBaseQuestionSchema(options)
    .extend({
      type: z.literal(QuestionTypeSchema.enum.Slider),
      slider: z.tuple([z.string(), z.string()]), // [left, right]
      minimumValue: z.number().optional(),
      maximumValue: z.number().optional(),
      step: z.number().optional(),
      defaultValue: z.number().optional(),
      defaultValueFromQuestionId: QuestionIdSchema.optional(),
      displayCurrentValueToUser: z.boolean().optional(),
    })
    .refine(
      (question) => {
        const defaultValue =
          question.defaultValue ?? SLIDER_DEFAULTS.DEFAULT_VALUE;
        if (question.defaultValue) {
          const minValue = question.minimumValue ?? SLIDER_DEFAULTS.MIN_VALUE;
          const maxValue = question.maximumValue ?? SLIDER_DEFAULTS.MAX_VALUE;
          if (
            question.defaultValue < minValue ||
            question.defaultValue > maxValue
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          `\`defaultValue\` (default: ${SLIDER_DEFAULTS.DEFAULT_VALUE}) should be ` +
          `in the range of \`minimumValue\` (default: ${SLIDER_DEFAULTS.MIN_VALUE}) ` +
          `and \`maximumValue\` (default: ${SLIDER_DEFAULTS.MAX_VALUE})`,
      },
    );
export const SliderQuestionSchema = getSliderQuestionSchema({});

export const getChoicesQuestionSchema = (options: GetSchemaOptions) =>
  getBaseQuestionSchema(options)
    .extend({
      type: z.union([
        z.literal(QuestionTypeSchema.enum.ChoicesWithSingleAnswer),
        z.literal(QuestionTypeSchema.enum.ChoicesWithMultipleAnswers),
      ]),
      choices: z.union([z.string(), ChoicesListSchema]),
      specialCasesStartId: z
        // We use an array of tuples here so that the special case next question is
        // deterministic in the case of ChoicesWithMultipleAnswers.
        .array(z.tuple([ChoiceSchema, QuestionIdSchema.nullable()]))
        .optional(),
      randomizeChoicesOrder: z.boolean().optional(),
      randomizeExceptForChoiceIds: z.array(z.string()).optional(),
    })
    .refine(
      (question) => {
        if (
          question.specialCasesStartId &&
          Array.isArray(question.specialCasesStartId) &&
          question.choices
        ) {
          if (typeof question.choices === "string") {
            // Can't check if it is using reusable choices.
            return true;
          }
          for (const specialCase of question.specialCasesStartId) {
            if (!question.choices.includes(specialCase[0])) {
              return false;
            }
          }
        }
        return true;
      },
      {
        message:
          "Choices keys in `specialCasesStartId` must also be in `choices`.",
        path: ["specialCasesStartId"],
      },
    )
    .refine(
      (question) => {
        if (
          question.randomizeExceptForChoiceIds &&
          !question.randomizeChoicesOrder
        ) {
          return false;
        }
        return true;
      },
      {
        message:
          "`randomizeExceptForChoiceIds` should only be set when " +
          "`randomizeChoicesOrder` is set to `true`.",
        path: ["randomizeExceptForChoiceIds"],
      },
    )
    .refine(
      (question) => {
        if (
          question.choices &&
          question.randomizeExceptForChoiceIds &&
          question.randomizeChoicesOrder
        ) {
          if (typeof question.choices === "string") {
            // Can't check if it is using reusable choices.
            return true;
          }
          for (const exceptKey of question.randomizeExceptForChoiceIds) {
            if (!question.choices.includes(exceptKey)) {
              return false;
            }
          }
        }
        return true;
      },
      {
        message:
          "Keys in `randomizeExceptForChoiceIds` should also be present in " +
          "`choices`.",
        path: ["randomizeExceptForChoiceIds"],
      },
    );
export const ChoicesQuestionSchema = getChoicesQuestionSchema({});

// https://github.com/colinhacks/zod/issues/454
export const getChoicesWithSingleAnswerQuestionSchema = (
  options: GetSchemaOptions,
) =>
  getChoicesQuestionSchema(options).refine(
    (question) => {
      return question.type === QuestionTypeSchema.enum.ChoicesWithSingleAnswer;
    },
    {
      message: `The type of ChoicesWithSingleAnswerQuestionSchema must be ${QuestionTypeSchema.enum.ChoicesWithSingleAnswer}`,
      path: ["type"],
    },
  );
export const ChoicesWithSingleAnswerQuestionSchema =
  getChoicesWithSingleAnswerQuestionSchema({});

export const getChoicesWithMultipleAnswersQuestionSchema = (
  options: GetSchemaOptions,
) =>
  getChoicesQuestionSchema(options).refine(
    (question) => {
      return (
        question.type === QuestionTypeSchema.enum.ChoicesWithMultipleAnswers
      );
    },
    {
      message: `The type of ChoicesWithMultipleAnswersQuestionSchema must be ${QuestionTypeSchema.enum.ChoicesWithMultipleAnswers}`,
      path: ["type"],
    },
  );
export const ChoicesWithMultipleAnswersQuestionSchema =
  getChoicesWithMultipleAnswersQuestionSchema({});

export const getYesNoQuestionSchema = (options: GetSchemaOptions) =>
  getBaseQuestionSchema(options).extend({
    type: z.literal(QuestionTypeSchema.enum.YesNo),
    branchStartId: z
      .object({
        yes: QuestionIdSchema.nullable().optional(),
        no: QuestionIdSchema.nullable().optional(),
      })
      .strict()
      .optional(),
    // Currently only `yes` is supported and also can only followup after 3 days
    // and 7 days with the same stream.
    addFollowupStream: z
      .object({
        yes: StreamNameSchema.optional(),
        // TODO: no: StreamNameSchema.optional(),
      })
      .strict()
      .optional(),
  });
export const YesNoQuestionSchema = getYesNoQuestionSchema({});

export const getMultipleTextQuestionSchema = (options: GetSchemaOptions) =>
  getBaseQuestionSchema(options).extend({
    // `id` will store the number of text fields answered.
    type: z.literal(QuestionTypeSchema.enum.MultipleText),
    indexName: z
      .string()
      .nonempty()
      .regex(ID_REGEX, {
        // Because `indexName` might be used in Question ID.
        message: idRegexErrorMessage("index name"),
      }),
    variableName: z
      .string()
      .nonempty()
      .regex(ID_REGEX, {
        // Because `variableName` might be used in Question ID.
        message: idRegexErrorMessage("variable name"),
      }),
    placeholder: z.string().optional(),
    keyboardType: z.string().optional(),
    dropdownChoices: z
      .object({
        choices: z.union([z.string(), ChoicesListSchema]),
        forceChoice: z.boolean().optional(),
        alwaysShowChoices: z.boolean().optional(),
      })
      .optional(),
    max: z.number().int().positive(),
    // The max number of text field will be `max` minus the number of text the
    // participant entered in `maxMinus` question.
    maxMinus: QuestionIdSchema.optional(),
    repeatedItemStartId: QuestionIdSchema.optional(),
  });
export const MultipleTextQuestionSchema = getMultipleTextQuestionSchema({});

export const getHowLongAgoQuestionSchema = (options: GetSchemaOptions) =>
  getBaseQuestionSchema(options).extend({
    type: z.literal(QuestionTypeSchema.enum.HowLongAgo),
  });
export const HowLongAgoQuestionSchema = getHowLongAgoQuestionSchema({});

export const getBranchQuestionSchema = (options: GetSchemaOptions) =>
  getBaseQuestionSchema(options).extend({
    // This is not actually a question (it will not be displayed to the user)
    type: z.literal(QuestionTypeSchema.enum.Branch),
    condition: z.object({
      questionId: QuestionIdSchema,
      questionType: z.union([
        z.literal(QuestionTypeSchema.enum.MultipleText),
        z.literal(QuestionTypeSchema.enum.ChoicesWithSingleAnswer),
      ]),
      compare: z.literal("equal"),
      target: z.union([z.number(), z.string()]),
    }),
    branchStartId: z.object({
      true: QuestionIdSchema.nullable().optional(),
      false: QuestionIdSchema.nullable().optional(),
    }),
  });
export const BranchQuestionSchema = getBranchQuestionSchema({});

export const getBranchWithRelativeComparisonQuestionSchema = (
  options: GetSchemaOptions,
) =>
  getBaseQuestionSchema(options).extend({
    // This is not actually a question (it will not be displayed to the user)
    type: z.literal(QuestionTypeSchema.enum.BranchWithRelativeComparison),
    branchStartId: z.record(QuestionIdSchema.nullable()),
  });
export const BranchWithRelativeComparisonQuestionSchema =
  getBranchWithRelativeComparisonQuestionSchema({});

/**
 * This question is used so that we could first follow the `innerNext` until
 * we are at a `null` `next`. Then we execute the `next` of this question.
 */
export const getWrapperQuestionSchema = (options: GetSchemaOptions) =>
  getBaseQuestionSchema(options).extend({
    // This is not actually a question (it will not be displayed to the user)
    type: z.literal(QuestionTypeSchema.enum.Wrapper),
    innerNext: QuestionIdSchema,
  });
export const WrapperQuestionSchema = getWrapperQuestionSchema({});

export const getQuestionSchema = (options: GetSchemaOptions) =>
  z
    .union([
      getSliderQuestionSchema(options),
      getChoicesWithSingleAnswerQuestionSchema(options),
      getChoicesWithMultipleAnswersQuestionSchema(options),
      getYesNoQuestionSchema(options),
      getMultipleTextQuestionSchema(options),
      getHowLongAgoQuestionSchema(options),
      getBranchQuestionSchema(options),
      getBranchWithRelativeComparisonQuestionSchema(options),
      getWrapperQuestionSchema(options),
    ])
    .refine((question) => {
      /**
       * This is to tell user in more details what is going wrong.
       *
       * `...Schema.parse` should throw error if any, replacing the default
       * error.
       *
       * The `default:` clause should handle the case where the type is invalid.
       */
      switch (question.type) {
        case QuestionTypeSchema.enum.Slider:
          getSliderQuestionSchema(options).parse(question);
          break;

        case QuestionTypeSchema.enum.ChoicesWithSingleAnswer:
          getChoicesWithSingleAnswerQuestionSchema(options).parse(question);
          break;

        case QuestionTypeSchema.enum.ChoicesWithMultipleAnswers:
          getChoicesWithMultipleAnswersQuestionSchema(options).parse(question);
          break;

        case QuestionTypeSchema.enum.YesNo:
          getYesNoQuestionSchema(options).parse(question);
          break;

        case QuestionTypeSchema.enum.MultipleText:
          getMultipleTextQuestionSchema(options).parse(question);
          break;

        case QuestionTypeSchema.enum.HowLongAgo:
          getHowLongAgoQuestionSchema(options).parse(question);
          break;

        case QuestionTypeSchema.enum.Branch:
          getBranchQuestionSchema(options).parse(question);
          break;

        case QuestionTypeSchema.enum.BranchWithRelativeComparison:
          getBranchWithRelativeComparisonQuestionSchema(options).parse(
            question,
          );
          break;

        case QuestionTypeSchema.enum.Wrapper:
          getWrapperQuestionSchema(options).parse(question);
          break;

        default:
          getBaseQuestionSchema(options).parse(question);
          break;
      }
      return true;
    });
export const QuestionSchema = getQuestionSchema({});

export const getQuestionsListSchema = (options: GetSchemaOptions) =>
  z
    .record(getQuestionSchema(options))
    .refine(
      (questions) => {
        for (const questionId in questions) {
          if (questionId !== questions[questionId].id) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          "The key for the question in questions list should be same as " +
          "its question ID.",
      },
    )
    .refine(
      (questions) => {
        const questionKeys = Object.keys(questions);
        for (const questionId in questions) {
          const nextId = questions[questionId].next;
          if (nextId !== null && !questionKeys.includes(nextId)) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          "A question's `next` question ID is not present in the question list.",
      },
    );
export const QuestionsListSchema = getQuestionsListSchema({});
