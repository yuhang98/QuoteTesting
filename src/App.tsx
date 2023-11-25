import React from 'react';
import '@mantine/core/styles.css';
import {
  MantineProvider,
  AppShell,
  Burger,
  Group,
  Skeleton,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface dataTypes {
  content: string;
  author: string;
}

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [data, setData] = React.useState<dataTypes>();

  async function updateQuote() {
    try {
      const response = await fetch(
        'https://api.quotable.io/random?tags=technology,famous-quotes'
      );
      const { statusCode, statusMessage, ...data } = await response.json();
      if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
      setData(data);
    } catch (error) {
      // If the API request failed, log the error to console and update state
      // so that the error will be reflected in the UI.
      console.error(error);
      // setData({ content: 'Opps... Something went wrong' });
    }
  }

  // Run `updateQuote` once when component mounts
  React.useEffect(() => {
    updateQuote();
  }, []);

  // Do not render until the first quote is loaded
  if (!data) return null;
  const date = new Date().toJSON().slice(0, 10);
  return (
    <MantineProvider>
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 200, md: 300, lg: 400 },
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          Navbar
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Navbar>
        <AppShell.Main>
          {' '}
          <div
            style={{
              padding: '10px',
              fontFamily: 'Inter, san-serif',
            }}
          >
            <h1>Quote Generator</h1>
            <h2>By Yu Hang Lee</h2>
            <p>{data.content}</p>
            {data.author && <p>{data.author}</p>}
            <Button variant="default" onClick={updateQuote}>
              New Quote
            </Button>
            <p>Current date: {date}</p>
          </div>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
