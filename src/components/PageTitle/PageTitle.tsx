import { Center } from '@mantine/core';
import classes from './PageTitle.module.css';

export interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return <Center className={classes.root}>{title.toUpperCase()}</Center>;
}
