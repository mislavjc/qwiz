export const paths = {
  home: () => '/',
  signIn: () => '/signin',
  signOut: () => '/signin?signOut=true',
  register: () => '/register',
  explore: () => '/explore',
  profile: () => '/profile',
  events: () => '/events',
  eventCreate: () => '/events/create',
  eventEdit: (id: string) => `/events/${id}/edit`,
  organizationPage: (id: string) => `/organization/${id}`,
  eventPage: (id: string) => `/events/${id}`,
  quiz: () => '/quiz',
  quizEdit: (id: string) => `/quiz/${id}/edit`,
  quizEditSlide: (id: string, slideId: string) => `/quiz/${id}/${slideId}`,
  questionPacks: () => '/question-packs',
  teams: () => '/teams',
  stats: () => '/stats',
  leaderboard: () => '/learderboard',
};
