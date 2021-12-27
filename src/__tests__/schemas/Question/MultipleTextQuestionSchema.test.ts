import { QuestionType } from "../../../helpers";
import { MultipleTextQuestionSchema } from "../../../schemas/Question";

describe("MultipleTextQuestionSchema", () => {
  test("type", () => {
    const question = {
      id: "Feel_Ideal",
      question: "Multiple text question",
      indexName: "INDEX",
      variableName: "TARGET_NAME",
      max: 3,
      next: "Next_Question",
    };

    expect(() => {
      MultipleTextQuestionSchema.parse({
        ...question,
        type: QuestionType.MultipleText,
      });
    }).not.toThrowError();

    expect(() => {
      MultipleTextQuestionSchema.parse({
        ...question,
        type: QuestionType.HowLongAgo,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  describe("indexName", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.MultipleText,
      question: "Multiple text question",
      variableName: "TARGET_NAME",
      max: 3,
      next: "Next_Question",
    };

    test("should not be undefined", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be null", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          indexName: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be empty", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          indexName: "",
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should be question ID-compatible string", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          indexName: "INDEX",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          indexName: "hello_world",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          indexName: "HELLO WORLD",
        });
      }).toThrowErrorMatchingSnapshot("space");

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          indexName: "__+O+__",
        });
      }).toThrowErrorMatchingSnapshot("special characters");
    });
  });

  describe("variableName", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.MultipleText,
      question: "Multiple text question",
      indexName: "INDEX",
      max: 3,
      next: "Next_Question",
    };

    test("should not be undefined", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be null", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          variableName: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be empty", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          variableName: "",
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should be question ID-compatible string", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          variableName: "TARGET",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          variableName: "target_name",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          variableName: "HELLO WORLD",
        });
      }).toThrowErrorMatchingSnapshot("space");

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          variableName: "__+O+__",
        });
      }).toThrowErrorMatchingSnapshot("special characters");
    });
  });

  describe("placeholder", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.MultipleText,
      question: "Multiple text question",
      variableName: "TARGET_NAME",
      indexName: "INDEX",
      max: 3,
      next: "Next_Question",
    };

    test("can be undefined", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
        });
      }).not.toThrowError();
    });

    test("should not be null", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          placeholder: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("can be empty", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          placeholder: "",
        });
      }).not.toThrowError();
    });

    test("can be any string", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          placeholder: "Enter a name...",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          placeholder: "Do something!",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          placeholder: "千里之行始于足下",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          placeholder: "???***!!!---",
        });
      }).not.toThrowError();
    });
  });

  describe("dropdownChoices", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.MultipleText,
      question: "Multiple text question",
      variableName: "TARGET_NAME",
      indexName: "INDEX",
      max: 3,
      next: "Next_Question",
    };

    test("can be undefined", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
        });
      }).not.toThrowError();
    });

    test("should not be null", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          dropdownChoices: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be empty object", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          dropdownChoices: {},
        });
      }).toThrowErrorMatchingSnapshot();
    });

    describe("choices", () => {
      test("should not be null", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: null },
          });
        }).toThrowErrorMatchingSnapshot();
      });

      test("should not be anything besides array and string", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: 4 },
          });
        }).toThrowErrorMatchingSnapshot("number");

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              choices: {
                "HELLO WORLD": "hi!",
              },
            },
          });
        }).toThrowErrorMatchingSnapshot("object");
      });

      test("should not be empty array", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: [] },
          });
        }).toThrowErrorMatchingSnapshot();
      });

      test("should be an array of strings", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: ["hello", "world"] },
          });
        }).not.toThrowError();

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: ["Hello world!"] },
          });
        }).not.toThrowError();

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: ["黄河远上白云间", "昔人已乘黄鹤去"] },
          });
        }).not.toThrowError();
      });

      test("choices string cannot be empty", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: ["", "world"] },
          });
        }).toThrowErrorMatchingSnapshot();

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: [""] },
          });
        }).toThrowErrorMatchingSnapshot();
      });

      test("choices should not be duplicated", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: ["world", "world"] },
          });
        }).toThrowErrorMatchingSnapshot();

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: ["行路难", "行路难"] },
          });
        }).toThrowErrorMatchingSnapshot();
      });

      test("can be string", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: "NAMES" },
          });
        }).not.toThrowError();

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { choices: "helloworld" },
          });
        }).not.toThrowError();
      });
    });

    describe("forceChoice", () => {
      const questionDropdownChoices = {
        choices: ["HELLO!", "arefly.com!", "WORLD!"],
      };

      test("can be undefined", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              ...questionDropdownChoices,
            },
          });
        }).not.toThrowError();
      });

      test("should not be null", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              ...questionDropdownChoices,
              forceChoice: null,
            },
          });
        }).toThrowErrorMatchingSnapshot();
      });

      test("should not be anything other than boolean", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              ...questionDropdownChoices,
              forceChoice: "true",
            },
          });
        }).toThrowErrorMatchingSnapshot("string true");

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              ...questionDropdownChoices,
              forceChoice: 1,
            },
          });
        }).toThrowErrorMatchingSnapshot("number");
      });

      test("can be true or false", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              ...questionDropdownChoices,
              forceChoice: true,
            },
          });
        }).not.toThrowError();

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              ...questionDropdownChoices,
              forceChoice: false,
            },
          });
        }).not.toThrowError();
      });

      test("should not be set if choices is not set", () => {
        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: {
              forceChoice: true,
            },
          });
        }).toThrowErrorMatchingSnapshot("true");

        expect(() => {
          MultipleTextQuestionSchema.parse({
            ...question,
            dropdownChoices: { forceChoice: false },
          });
        }).toThrowErrorMatchingSnapshot("false");
      });
    });
  });

  describe("max", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.MultipleText,
      question: "Multiple text question",
      variableName: "TARGET_NAME",
      indexName: "INDEX",
      next: "Next_Question",
    };

    test("should not be undefined", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be null", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          max: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be decimal", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          max: 3.1415,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be zero or negative", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          max: 0,
        });
      }).toThrowErrorMatchingSnapshot("zero");

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          max: -1,
        });
      }).toThrowErrorMatchingSnapshot("negative integer");

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          max: -2.5,
        });
      }).toThrowErrorMatchingSnapshot("negative decimal");
    });

    test("can be any positive integer", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          max: 3,
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          max: 7,
        });
      }).not.toThrowError();
    });
  });

  describe("maxMinus", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.MultipleText,
      question: "Multiple text question",
      variableName: "TARGET_NAME",
      indexName: "INDEX",
      max: 3,
      next: "Next_Question",
    };

    test("can be undefined", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
        });
      }).not.toThrowError();
    });

    test("should not be null", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          maxMinus: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should be question ID", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          maxMinus: "Hello",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          maxMinus: "hello_world",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          maxMinus: "HELLO WORLD",
        });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("repeatedItemStartId", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.MultipleText,
      question: "Multiple text question",
      variableName: "TARGET_NAME",
      indexName: "INDEX",
      max: 3,
      next: "Next_Question",
    };

    test("can be undefined", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
        });
      }).not.toThrowError();
    });

    test("should not be null", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          repeatedItemStartId: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should be question ID", () => {
      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          repeatedItemStartId: "Hello",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          repeatedItemStartId: "hello_world",
        });
      }).not.toThrowError();

      expect(() => {
        MultipleTextQuestionSchema.parse({
          ...question,
          repeatedItemStartId: "HELLO WORLD",
        });
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
