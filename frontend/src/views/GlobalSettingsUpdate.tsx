import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as yup from 'yup';
import { Field, Formik, FormikProps } from 'formik';
import { EmailField, PasswordField, TextField } from '../form/fields/common';
import { RouteComponentProps, withRouter } from 'react-router';
import dimeTheme from '../layout/DimeTheme';
import { Theme } from '@material-ui/core';
import compose from '../utilities/compose';
import { MainStore } from '../stores/mainStore';
import { LogoIcon } from '../layout/icons';
import { HandleFormikSubmit } from '../types';
import { ApiStore } from '../stores/apiStore';
import { localizeSchema } from '../utilities/validation';
import { FormView } from '../form/FormView';
import Grid from '@material-ui/core/Grid';
import { DimePaper } from '../layout/DimePaper';
import { FormHeader } from '../layout/FormHeader';
import { GlobalSettings, GlobalSettingStore } from '../stores/globalSettingStore';
import { empty } from '../utilities/helpers';
import { MarkdownField } from '../form/fields/MarkdownField';

export interface Props extends RouteComponentProps {
  mainStore?: MainStore;
  globalSettingStore?: GlobalSettingStore;
}

const settingsSchema = localizeSchema(() =>
  yup.object({
    sender_name: yup.string().required(),
    sender_street: yup.string().required(),
    sender_zip: yup.string().required(),
    sender_city: yup.string().required(),
    sender_phone: yup.string().required(),
    sender_mail: yup.string().required(),
    sender_vat: yup.string().required(),
    sender_bank: yup.string().required(),
    sender_web: yup.string().required(),
  })
);

@compose(
  inject('mainStore', 'globalSettingStore'),
  observer
)
export class GlobalSettingsUpdate extends React.Component<Props> {
  public componentWillMount = () => {
    this.props.globalSettingStore!.fetchOne(0);
  };

  public handleSubmit = async (values: GlobalSettings) => {
    await this.props.globalSettingStore!.put(values);
  };

  public render() {
    const store = this.props.globalSettingStore!;
    return (
      <>
        <FormView
          paper={false}
          loading={empty(store.settings)}
          title={'Einstellungen'}
          validationSchema={settingsSchema}
          initialValues={store.settings}
          onSubmit={this.handleSubmit}
          render={(formikProps: FormikProps<GlobalSettings>) => {
            return (
              <form onSubmit={formikProps.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item>
                    <DimePaper>
                      <FormHeader>Dokumente</FormHeader>
                      <Field fullWidth required component={TextField} name={'sender_name'} label={'Name'} />
                      <Field fullWidth required component={TextField} name={'sender_street'} label={'Strasse'} />
                      <Field fullWidth required component={TextField} name={'sender_zip'} label={'PLZ'} />
                      <Field fullWidth required component={TextField} name={'sender_city'} label={'Ort'} />
                      <Field fullWidth required component={TextField} name={'sender_phone'} label={'Telefon'} />
                      <Field fullWidth required component={TextField} name={'sender_mail'} label={'Email'} />
                      <Field fullWidth required component={TextField} name={'sender_vat'} label={'MwSt. Nr.'} />
                      <Field fullWidth required component={TextField} name={'sender_bank'} label={'Kontonummer'} />
                      <Field fullWidth required component={TextField} name={'sender_web'} label={'Website'} />
                    </DimePaper>
                    <DimePaper>
                      <FormHeader>Allgemein</FormHeader>
                      <Field
                        fullWidth
                        required
                        component={MarkdownField}
                        name={'service_order_comment'}
                        label={'Beschreibung für Reihenfolge der Services'}
                      />
                    </DimePaper>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        />
      </>
    );
  }
}
