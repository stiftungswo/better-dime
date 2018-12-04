import React from 'react';
import { MainStore } from '../../stores/mainStore';
import { Grid, Input, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import { DimePaper } from '../../layout/DimeLayout';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Field, Formik } from 'formik';
import { SwitchField } from '../../form/fields/common';
import { CustomerTagSelector } from '../../form/entitySelector/CustomerTagSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';

interface Props {
  mainStore?: MainStore;
}

const initialValues = {
  customer_tags: [],
  hidden: false,
  file: null,
  rate_group_id: 1,
};

@compose(
  inject('mainStore'),
  observer
)
export class CustomerImportForm extends React.Component<Props> {
  public postFileToCheck(file: File) {
    console.log(file);
  }

  public render() {
    return (
      <DimePaper>
        <Typography gutterBottom variant={'h5'}>
          Daten importieren
        </Typography>

        <Formik
          initialValues={initialValues}
          onSubmit={e => console.log(e)}
          render={formikProps => (
            <>
              <Typography variant="body1" gutterBottom>
                Die Kunden in der Import-Datei werden mit den unteren Attributen in die Datenbank importiert. Wenn du verschiedene Attribute
                verwenden möchtest, müssen dafür separate Import-Dateien importiert werden.
              </Typography>
              <Grid container spacing={24} alignItems={'center'}>
                <Grid item xs={12} md={3}>
                  <Field delayed fullWidth component={CustomerTagSelector} label={'Kundentags auswählen'} name={'customer_tags'} />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Field delayed fullWidth component={SwitchField} name={'hidden'} label={'Kunden verstecken?'} />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Field delayed fullWidth component={RateGroupSelector} label={'Tarifgruppe auswählen'} name={'rate_group_id'} />
                </Grid>
              </Grid>

              <Grid container alignItems={'center'} spacing={24}>
                <Grid item xs={12} md={4}>
                  <a
                    href={this.props.mainStore!.getPrintUrl('customers/import/template')}
                    target={'_blank'}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <Button fullWidth color={'primary'} variant="contained">
                      Import-Vorlage herunterladen
                    </Button>
                  </a>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    component={Input}
                    type={'file'}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const file = new Blob([event.currentTarget.files![0]], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      });
                      const formData = new FormData();
                      formData.append('importFile', file, event.currentTarget.files![0].name);

                      this.props.mainStore!.api.post('customers/import/verify', formData);
                    }}
                    style={{ display: 'none' }}
                    id={'contained-button-file'}
                  />
                  <label htmlFor="contained-button-file">
                    <Button fullWidth variant="contained" component="span">
                      Import überprüfen
                    </Button>
                  </label>
                </Grid>
              </Grid>
            </>
          )}
        />
      </DimePaper>
    );
  }
}
