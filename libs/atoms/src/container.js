import { makeStyles } from '@griffel/react';
// import space from '@tenli/2-space.macro';
// import mq from '@tenli/7-mq.macro';
// import merge from '@tenli/8-merge.macro';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles({
  section: {
    height: '100%',
  },
});

export function Container({ className, children, ...props }) {
  const styles = useStyles();

  return <div className={styles.section}>{children}</div>;
}

export default Container;
