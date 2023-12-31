import React from 'react';
import '@mantine/core/styles.css';
import {
  MantineProvider,
  AppShell,
  Burger,
  Group,
  Button,
  SegmentedControl,
  Text,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface dataTypes {
  content: string;
  author: string;
}

type InnerObjectType = {
  text: string;
  author: string;
};

type MotivationTypes = {
  [key: number]: InnerObjectType;
};
function App() {
  const [opened, { toggle }] = useDisclosure();
  const [data, setData] = React.useState<dataTypes>();
  const [motivationData, setMotivationData] = React.useState<MotivationTypes>();

  const [value, setValue] = React.useState('quote');
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
  // console.log(data, ' data');

  async function updateMotivation() {
    try {
      const response = await fetch('https://type.fit/api/quotes');
      const { statusCode, statusMessage, ...data } = await response.json();
      if (!response.ok) throw new Error(`${statusCode} ${statusMessage}`);
      setMotivationData(data);
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
    updateMotivation();
  }, []);

  // Do not render until the first quote is loaded
  if (!data) return null;
  if (!motivationData) return null;
  console.log(motivationData, ' motivation');

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
          <Text style={{ marginBottom: '16px' }}>Navbar</Text>
          <SegmentedControl
            fullWidth
            size="lg"
            orientation="vertical"
            value={value}
            onChange={setValue}
            data={[
              { label: 'Quote', value: 'quote' },
              { label: 'Motivation', value: 'ng' },
              // { label: 'Vue', value: 'vue' },
              // { label: 'Svelte', value: 'svelte' },
            ]}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          {value === 'quote' && (
            <div
              style={{
                padding: '10px',
                fontFamily: 'Inter, san-serif',
              }}
            >
              <h1>Quote Generator</h1>
              <p>{data.content}</p>
              {data.author && <p>{data.author}</p>}
              <Button variant="default" onClick={updateQuote}>
                New Quote
              </Button>
              <p>Current date: {date}</p>
            </div>
          )}
          {value === 'ng' && (
            <div
              style={{
                padding: '10px',
                fontFamily: 'Inter, san-serif',
              }}
            >
              <Text>Motivation Generator</Text>
              {Object.entries(motivationData).map(([key, data]) => (
                <Box style={{ margin: '16px 0' }}>
                  <Text size="md" key={key} style={{ fontWeight: 'bold' }}>
                    {data.text}
                  </Text>
                  <Text size="sm">Author: {data.author}</Text>
                </Box>
              ))}
            </div>
          )}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
