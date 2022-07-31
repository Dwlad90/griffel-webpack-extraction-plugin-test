import Link from "next/link";
import { makeStyles } from "@griffel/react";
import { Container } from '@test/atoms';

const useClassNames = makeStyles({
  page: {
    color: "salmon",
    paddingLeft: '1em'
  }
});

export default function IndexPage() {
  const classes = useClassNames();

  return (
    <Container>
      <div className={classes.page}>
        Hello World.{" "}
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </Container>
  );
}
