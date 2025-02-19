import {
  ActionIcon,
  Button,
  Chip,
  Chips,
  Collapse,
  FloatingTooltip,
  Group,
  LoadingOverlay,
  Overlay,
  Skeleton,
  Stack,
  Tooltip,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { FramerAnimatedListItem } from 'components/Framer/FramerAnimatedListItem';
import { useCurrentOrganizationInfo } from 'hooks/api/organizations';
import { useAvailableQuestions } from 'hooks/api/question';
import { useQuizQuestionCreate } from 'hooks/api/quiz-question/use-quiz-question-create';
import { useQuizQuestionUpdate } from 'hooks/api/quiz-question/use-quiz-question-update';
import { useSlides } from 'hooks/api/slide';
import { useAppColorscheme } from 'hooks/colorscheme';
import { generateArrayForRange } from 'lib/utils';
import { Sliders } from 'phosphor-react';
import { useMemo, useState } from 'react';
import { QuestionWithContentAndCategoriesAndMode } from 'types/api/question';
import { QuizQuestionCard } from './QuizQuestion/QuizQuestionCard';
import { SelectedQuestionModalContent } from './QuizQuestion/SelectedQuestionModalContent';
import { SidePanelWrapper } from './SidePanelWrapper';
import { useCurrentQuiz } from './use-current-quiz';
import { useCurrentSlide } from './use-current-slide';

export const SidePanelQuestions = () => {
  const { data: me } = useCurrentOrganizationInfo();
  const { data: questions, isLoading } = useAvailableQuestions();
  const { id: quizId } = useCurrentQuiz();
  const { data: slides } = useSlides(quizId);
  const { theme, isDark } = useAppColorscheme();
  const modals = useModals();

  const hasSlides = slides?.length > 0;

  const [filtersOpened, setFiltersOpened] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const shownQuestions = useMemo(() => {
    if (selectedFilter === 'all') {
      return questions;
    }
    if (selectedFilter === 'global') {
      return questions.filter((question) => question.ownerId === null);
    }
    if (selectedFilter === 'personal') {
      return questions.filter((question) => question.ownerId === me.id);
    }
    return [];
  }, [selectedFilter, questions]);

  const questionUseHandler = (
    question: QuestionWithContentAndCategoriesAndMode,
    id: string
  ) => {
    questionUseSelectedHandler(question.id);
    modals.closeModal(id);
  };

  const openQuestionModal = (
    question: QuestionWithContentAndCategoriesAndMode
  ) => {
    const isSelected = question.id === slide?.quizQuestion?.questionId;

    const id = modals.openModal({
      size: 'lg',
      title: 'Question details',
      children: (
        <Stack pt={4}>
          <SelectedQuestionModalContent question={question} />
          <Group position="right">
            {!isSelected && (
              <Button onClick={() => questionUseHandler(question, id)}>
                Use question
              </Button>
            )}
          </Group>
        </Stack>
      ),
    });
  };

  const { slide, id } = useCurrentSlide();
  const { mutate: updateQuizQuestion, isLoading: updateLoading } =
    useQuizQuestionUpdate(slide?.quizQuestion?.id);
  const { mutate: createQuizQuestion, isLoading: isCreateLoading } =
    useQuizQuestionCreate(id);

  const questionUseSelectedHandler = (questionId: string) => {
    if (slide.quizQuestion) {
      updateQuizQuestion({
        questionId,
      });
    } else {
      createQuizQuestion({
        quizId: slide.quizId,
        quizSlideId: slide.id,
        questionId,
      });
    }
  };

  return (
    <FloatingTooltip
      label="Create a slide first"
      disabled={hasSlides}
      sx={() => ({ width: '100%' })}
    >
      <SidePanelWrapper
        title="Available questions"
        slot={
          <Tooltip label="Filters" withArrow>
            <ActionIcon
              variant="hover"
              size="md"
              onClick={() => setFiltersOpened((prev) => !prev)}
            >
              <Sliders weight="duotone" size={24} />
            </ActionIcon>
          </Tooltip>
        }
      >
        {!hasSlides && (
          <Overlay
            opacity={0.6}
            color={isDark ? theme.colors.dark[5] : theme.colors.gray[0]}
            radius="md"
          />
        )}
        <Collapse in={filtersOpened} mb={12}>
          <Stack>
            <Chips
              multiple={false}
              value={selectedFilter}
              onChange={setSelectedFilter}
              size="sm"
            >
              <Chip value="all">All</Chip>
              <Chip value="global">Global</Chip>
              <Chip value="personal">Personal</Chip>
            </Chips>
          </Stack>
        </Collapse>

        <Stack spacing={8}>
          <LoadingOverlay visible={updateLoading || isCreateLoading} />
          {isLoading
            ? generateArrayForRange(8).map((n) => (
                <Skeleton key={n} visible height={120} radius="md" />
              ))
            : shownQuestions?.map((question) => (
                <FramerAnimatedListItem key={question.id} id={question.id}>
                  <QuizQuestionCard
                    question={question}
                    onSelect={openQuestionModal}
                    onUseQuestion={questionUseSelectedHandler}
                  />
                </FramerAnimatedListItem>
              ))}
        </Stack>
      </SidePanelWrapper>
    </FloatingTooltip>
  );
};
