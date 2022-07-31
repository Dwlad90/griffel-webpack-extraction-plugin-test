import Link from "next/link";
import { makeStyles } from "@griffel/react";

const useClassNames = makeStyles({
  page: {
    color: "salmon",
    paddingLeft:'1em',
    paddingRight: '1em',
    marginLeft: '1rem',
    backgroundColor: 'blue'
  }
});

export default function IndexPage() {
  const classes = useClassNames();

  return (
    <div className={classes.page}>
      Hello World.{" "}
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}
