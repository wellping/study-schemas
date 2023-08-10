export const ID_REGEX = /^\w+$/;
export const idRegexErrorMessage = (name: string) =>
  `${name} can only include letters, numbers, and "_".`;

// We allow `[` and `]` in Question ID because `withVariable` uses "[__something__]".
export const QUESTION_ID_REGEX = /^[\w[\]]+$/;
export const questionIdRegexErrorMessage = (name: string) =>
  `${name} can only include letters, numbers, "_", "[", and "]".`;

// Used for the study's start date and end date (JSON dates).
export const DATETIME_REGEX =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/;
export const datetimeRegexErrorMessage = (name = "Datetime string") =>
  `${name} should be formatted like "2020-03-10T08:00:00.000Z".`;

// Used for pings frequency.
export const HOURMINUTESECOND_REGEX = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
export const hourMinuteSecondRegexErrorMessage = (
  name = "Hour-minute-second string",
) => `${name} should be in the format of "HH:mm:ss".`;

// Used for streams when date is used instead of days of the week.
export const DATE_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
export const dateRegexErrorMessage = (name = "Date string") =>
  `${name} should be formatted like "2020-03-10.`;