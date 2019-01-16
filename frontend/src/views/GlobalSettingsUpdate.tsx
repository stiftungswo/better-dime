import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as yup from 'yup';
import { FormikProps } from 'formik';
import { TextField } from '../form/fields/common';
import { RouteComponentProps } from 'react-router';
import compose from '../utilities/compose';
import { MainStore } from '../stores/mainStore';
import { localizeSchema } from '../utilities/validation';
import { FormView } from '../form/FormView';
import Grid from '@material-ui/core/Grid';
import { DimePaper } from '../layout/DimePaper';
import { FormHeader } from '../layout/FormHeader';
import { GlobalSettings, GlobalSettingStore } from '../stores/globalSettingStore';
import { empty } from '../utilities/helpers';
import { MarkdownField } from '../form/fields/MarkdownField';
import { DimeField } from '../form/fields/formik';

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
                      <DimeField required component={TextField} name={'sender_name'} label={'Name'} />
                      <DimeField required component={TextField} name={'sender_street'} label={'Strasse'} />
                      <DimeField required component={TextField} name={'sender_zip'} label={'PLZ'} />
                      <DimeField required component={TextField} name={'sender_city'} label={'Ort'} />
                      <DimeField required component={TextField} name={'sender_phone'} label={'Telefon'} />
                      <DimeField required component={TextField} name={'sender_mail'} label={'Email'} />
                      <DimeField required component={TextField} name={'sender_vat'} label={'MwSt. Nr.'} />
                      <DimeField required component={TextField} name={'sender_bank'} label={'Kontonummer'} />
                      <DimeField required component={TextField} name={'sender_web'} label={'Website'} />
                    </DimePaper>
                    <DimePaper>
                      <FormHeader>Allgemein</FormHeader>
                      <DimeField
                        delayed
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
