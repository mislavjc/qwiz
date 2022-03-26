import 'styles/global.scss';

import { Container } from '@mantine/core';
import { CustomColorSchemeProvider } from 'context/colorscheme';
import Inspect from 'inspx';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CustomSpotlightProvider } from 'context/spotlight';

const queryClient = new QueryClient();

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Qwiz</title>
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <CustomColorSchemeProvider>
            <CustomSpotlightProvider>
              <Inspect>
                <Container fluid px={0} sx={() => ({ minHeight: '100vh' })}>
                  {getLayout(<Component {...pageProps} />)}
                </Container>
              </Inspect>
            </CustomSpotlightProvider>
          </CustomColorSchemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
};

export default App;
