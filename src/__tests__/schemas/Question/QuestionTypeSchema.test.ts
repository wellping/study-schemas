import { QuestionType } from "../../../helpers";
import { QuestionTypeSchema } from "../../../schemas/Question";

describe("QuestionTypeSchema", () => {
  test("should not change", () => {
    expect(QuestionTypeSchema).toMatchInlineSnapshot(`
      ZodEnum {
        "_def": Object {
          "typeName": "ZodEnum",
          "values": Array [
            "Slider",
            "ChoicesWithSingleAnswer",
            "ChoicesWithMultipleAnswers",
            "YesNo",
            "MultipleText",
            "HowLongAgo",
            "Branch",
            "BranchWithRelativeComparison",
            "Wrapper",
          ],
        },
        "default": [Function],
        "spa": [Function],
        "superRefine": [Function],
        "transform": [Function],
      }
    `);
  });

  test(".enum should be equal to QuestionType", () => {
    expect(QuestionTypeSchema.enum).toStrictEqual(QuestionType);
  });
});
