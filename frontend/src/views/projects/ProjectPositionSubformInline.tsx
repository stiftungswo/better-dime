import * as React from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import { TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Project, ProjectPosition } from '../../types';
import { ServiceSelector } from '../../form/entitySelector/ServiceSelector';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import CurrencyField from '../../form/fields/CurrencyField';
import { ServiceStore } from '../../stores/serviceStore';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Button from '@material-ui/core/Button/Button';
import { Service } from '../services/types';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import { formikFieldCompatible } from '../../form/fields/Select';

export interface Props {
  serviceStore?: ServiceStore;
  formikProps: FormikProps<Project>;
  name: string;
}

@compose(
  inject('serviceStore'),
  observer
)
export default class ProjectPositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
  };

  public componentWillMount = () => this.props.serviceStore!.fetchAll();

  public render() {
    const { values } = this.props.formikProps;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar title={'Services'} numSelected={0} addAction={() => this.setState({ dialogOpen: true })} />
            <div style={{ overflowX: 'auto' }}>
              <Table padding={'dense'} style={{ minWidth: '1200px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '20%' }}>Service</TableCell>
                    <TableCell style={{ width: '20%' }}>Beschreibung</TableCell>
                    <TableCell style={{ width: '15%' }}>Tarif</TableCell>
                    <TableCell style={{ width: '15%' }}>Einheit</TableCell>
                    <TableCell style={{ width: '10%' }}>MwSt.</TableCell>
                    <TableCell style={{ width: '10%' }}>Anzahl</TableCell>
                    <TableCell style={{ width: '10%' }}>Total CHF</TableCell>
                    <TableCell style={{ width: '10%' }}>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.positions.map((p: ProjectPosition, index: number) => {
                    const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                    return (
                      <TableRow key={index}>
                        <TableCell>{this.props.serviceStore!.getName(values.positions[index].service_id)}</TableCell>
                        <TableCell>
                          <Field delayed component={TextField} name={name('description')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed required component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field required component={RateUnitSelector} name={name('rate_unit_id')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field required delayed component={PercentageField} name={name('vat')} margin={'none'} />
                        </TableCell>
                        <TableCell>{p.efforts_value}</TableCell>
                        <TableCell>{p.charge}</TableCell>
                        <TableCell>
                          <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {this.state.dialogOpen && (
              <NewDialog
                open
                onClose={() => this.setState({ dialogOpen: false })}
                rateGroupId={values.rate_group_id}
                onSubmit={arrayHelpers.push}
              />
            )}
          </>
        )}
      />
    );
  }
}

interface NDProps {
  open: boolean;
  onClose: () => void;
  serviceStore?: ServiceStore;
  rateGroupId: number;
  onSubmit: (template: any) => void;
}

@compose(
  inject('serviceStore'),
  observer
)
class NewDialog extends React.Component<NDProps> {
  state = {
    serviceId: undefined,
  };

  handleSubmit = () => {
    this.props.serviceStore!.notifyProgress(async () => {
      const service = (await this.props.serviceStore!.fetchOne(this.state.serviceId!)) as Service;
      const rate = service.service_rates.find(r => r.rate_group_id === this.props.rateGroupId);
      if (!rate) {
        throw new Error('no rate was found');
      }
      this.props.onSubmit({
        description: '',
        vat: 0.077, // this should probably be configurable somewhere; user settings?
        service_id: service.id,
        rate_unit_id: rate.rate_unit_id,
        price_per_rate: rate.value,
      });
      this.props.onClose();
    });
  };

  render() {
    return (
      <Dialog open onClose={this.props.onClose}>
        <DialogTitle>Service hinzufügen</DialogTitle>
        <DialogContent>
          <ServiceSelector
            fullWidth
            {...formikFieldCompatible({
              label: 'Service',
              value: this.state.serviceId,
              onChange: serviceId => this.setState({ serviceId }),
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit} disabled={!this.state.serviceId}>
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
