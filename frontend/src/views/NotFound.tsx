import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { DimeAppBar } from '../layout/DimeAppBar';
import { DimeContent } from '../layout/DimeContent';

export default function NotFound() {
  return (
    <>
      <DimeAppBar title={''} />
      <DimeContent>
        <Typography variant={'h4'}>404</Typography>
        <Typography>Die Seite wurde nicht gefunden.</Typography>
      </DimeContent>
    </>
  );
}
