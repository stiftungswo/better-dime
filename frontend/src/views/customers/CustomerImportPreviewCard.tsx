import { Card, CardActions, CardContent, CardHeader, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { NonPersistedImportCustomer } from '../../stores/customerImportStore';
import compose from '../../utilities/compose';

const styles = ({ palette }: Theme) =>
  createStyles({
    root: {
      backgroundColor: palette.secondary.main,
    },
  });

type Props = {
  customerPreview: NonPersistedImportCustomer;
  index: number;
  removeItem: (value: number) => void;
} & WithStyles<typeof styles>;

export const CustomerImportPreviewCard = compose(withStyles(styles))((props: Props) => {
  const { customerPreview, classes, index, removeItem } = props;

  return (
    <Card classes={customerPreview.duplicate || customerPreview.invalid ? undefined : classes}>
      <CardHeader
        title={customerPreview.type === 'company' ? customerPreview.name : customerPreview.first_name! + ' ' + customerPreview.last_name!}
        action={
          <CardActions>
            <Button size="small" onClick={() => removeItem(index)}>
              Löschen
            </Button>
          </CardActions>
        }
      />
      <CardContent>
        <Typography variant={'body2'}>Duplikat: {customerPreview.duplicate ? 'Ja' : 'Nein'}</Typography>
        <Typography variant={'body2'}>Angaben ungültig: {customerPreview.invalid ? 'Ja' : 'Nein'}</Typography>

        <hr />

        <Typography variant={'body2'}>Typ: {customerPreview.type}</Typography>
        <Typography variant={'body2'}>Anrede: {customerPreview.salutation}</Typography>
        <Typography variant={'body2'}>Vorname: {customerPreview.first_name}</Typography>
        <Typography variant={'body2'}>Nachname: {customerPreview.last_name}</Typography>
        <Typography variant={'body2'}>Firma: {customerPreview.name}</Typography>
        <Typography variant={'body2'}>Abteilung: {customerPreview.department}</Typography>

        <hr />

        <Typography variant={'body2'}>E-Mail: {customerPreview.email}</Typography>
        <Typography variant={'body2'}>Hauptnummer: {customerPreview.main_number}</Typography>
        <Typography variant={'body2'}>Fax: {customerPreview.fax}</Typography>
        <Typography variant={'body2'}>Mobiltelefonnummer: {customerPreview.mobile_number}</Typography>

        <hr />

        <Typography variant={'body2'}>Strasse: {customerPreview.street}</Typography>
        <Typography variant={'body2'}>Addresszusatz: {customerPreview.supplement}</Typography>
        <Typography variant={'body2'}>Postleitzahl: {customerPreview.zip}</Typography>
        <Typography variant={'body2'}>Ortschaft: {customerPreview.city}</Typography>
        <Typography variant={'body2'}>Land: {customerPreview.country}</Typography>

        <hr />

        <Typography variant={'body2'}>Tarifgruppe: {customerPreview.rate_group_name}</Typography>
        <Typography variant={'body2'}>Tag: {customerPreview.customer_tag_name}</Typography>

        <hr />

        <Typography variant={'body2'}>Kommentar: {customerPreview.comment}</Typography>

        <hr />

        <Typography variant={'body2'}>Error: {customerPreview.error_message}</Typography>
      </CardContent>
    </Card>
  );
});
