import { useStyles } from '../styles/404.styles';
import { Title, Text, Button, Container, Group } from '@mantine/core';
import Link from 'next/link';

export default function Custom404() {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Something went wrong...</Title>
      <Text color="dimmed" size="lg" align="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.
      </Text>
      <Group position="center">
        <Link href="/" passHref>
          <Button variant="subtle" size="md">
            Take me back to home page
          </Button>
        </Link>
      </Group>
    </Container>
  );
}