export const ID_REGEX = /^\w+$/;
export const idRegexErrorMessage = (name: string) =>
  `${name} can only include letters, numbers, and "_".`;

// We allow `[` and `]` in Question ID because `withVariable` uses "[__something__]".
export const QUESTION_ID_REGEX = /^[\w[\]]+$/;
export const questionIdRegexErrorMessage = (name: string) =>
  `${name} can only include letters, numbers, "_", "[", and "]".`;
