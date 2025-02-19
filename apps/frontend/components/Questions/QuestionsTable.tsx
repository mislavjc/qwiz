import {
  Button,
  createStyles,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { QuestionElementType } from '@prisma/client';
import { QuestionCreateModal } from 'components/Quiz/QuizQuestion/QuizQuestionCreateModal';
import { useInputAccentStyles } from 'components/UI/use-input-styles';
import { useAppColorscheme } from 'hooks/colorscheme';
import { MagnifyingGlass, TextT } from 'phosphor-react';
import { ChangeEvent, useMemo, useState } from 'react';
import { QuestionWithContentAndCategoriesAndMode } from 'types/api/question';
import { QuestionTableRow } from './QuestionTableRow';

interface Props {
  questions: QuestionWithContentAndCategoriesAndMode[];
  loading?: boolean;
}

type RowData = QuestionWithContentAndCategoriesAndMode;

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  const keys = data?.[0] ? Object.keys(data[0]) : [];
  return data?.filter((item) =>
    keys.some((key) => {
      const textualContent =
        item.contents
          ?.filter((c) => c.type === QuestionElementType.TEXT)
          .map((c) => c.content.toLowerCase()) ?? [];
      const categories =
        item.categories?.map((c) => c.name.toLowerCase()) ?? [];
      return [...textualContent, ...categories].some((c) => c.includes(query));
    })
  );
}

export const QuestionsTable = ({ questions, loading }: Props) => {
  const { classes, cx } = useStyles();
  const { classes: inputClasses } = useInputAccentStyles();
  const { isDark } = useAppColorscheme();
  const [scrolled, setScrolled] = useState(false);

  // Filters
  const [search, setSearch] = useState('');

  const headings = [
    'Textual',
    'Visual',
    'Scope',
    'Categories',
    'Created',
    'Availability',
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const sortedData = useMemo(
    () => filterData(questions, search),
    [questions, search]
  );

  const ths = (
    <tr>
      {headings.map((heading, i) => (
        <th className={classes.th} key={i}>
          {heading}
        </th>
      ))}
    </tr>
  );

  const rows = sortedData?.map((element) => (
    <QuestionTableRow question={element} key={element.id} />
  ));

  const [showQuestionModal, setShowQuestionModal] = useState(false);

  return (
    <Stack spacing="sm" mt="xs">
      <QuestionCreateModal
        opened={showQuestionModal}
        setOpened={setShowQuestionModal}
      />
      <Paper withBorder radius="sm" pt={2}>
        <Group mx={8} my={8} mb={16} position="apart">
          <TextInput
            sx={() => ({ flex: 1 })}
            placeholder="Search by content or categories"
            size="md"
            value={search}
            onChange={handleSearchChange}
            icon={<MagnifyingGlass size={18} weight="duotone" />}
            classNames={inputClasses}
          />
          <Button
            leftIcon={<TextT size={18} weight="duotone" />}
            variant={isDark ? 'light' : 'filled'}
            color={isDark ? 'orange' : 'dark'}
            size="md"
            onClick={() => setShowQuestionModal(true)}
          >
            Create question
          </Button>
        </Group>

        <ScrollArea
          sx={() => ({
            width: '100%',
            height: 'calc(100vh - 290px)',
          })}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table fontSize="sm" highlightOnHover>
            <LoadingOverlay visible={loading} />
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              {ths}
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Stack>
  );
};

const useStyles = createStyles((theme) => ({
  th: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '12px !important',
  },

  header: {
    position: 'sticky',
    zIndex: 20,
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));
