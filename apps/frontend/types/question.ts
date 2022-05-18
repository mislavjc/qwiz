import {
  Prisma,
  Question,
  QuestionCategory,
  QuestionContent,
  QuestionMode,
  QuizQuestion,
  User,
} from '@prisma/client';

export type QuestionWithContent = Question & { contents: QuestionContent[] };
export type QuestionWithContentAndOwnerAndCategoriesAndMode =
  QuestionWithContent & {
    owner?: User;
    categories?: QuestionCategory[];
    questionMode?: QuestionMode;
  };

export type QuestionCreateWithContentInput = Prisma.QuestionCreateInput & {
  contents: Prisma.QuestionContentCreateWithoutQuestionInput[];
};

export type QuizQuestionWithContents = QuizQuestion & {
  question: QuestionWithContent;
};
