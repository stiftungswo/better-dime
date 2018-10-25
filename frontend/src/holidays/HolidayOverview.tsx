import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid/Grid';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import { Holiday, HolidayStore } from '../store/holidayStore';
import * as yup from 'yup';
import { Field, Formik, FormikBag } from 'formik';
import { DatePickerWithValidation, NumberFieldWithValidation, TextFieldWithValidation } from '../form/common';
import { DeleteButton } from '../utilities/ConfirmationDialog';

interface Props {
  holidayStore?: HolidayStore;
}

const schema = yup.object({
  name: yup.string().required(),
  date: yup.date().required(),
  duration: yup.number().required(),
});

@inject('holidayStore')
@observer
export default class HolidayOverview extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.holidayStore!.fetchAll();
  }

  public updateHoliday = (values: Holiday, formikBag: FormikBag<any, any>) => {
    console.log('update holoday: ', values);
    this.props.holidayStore!.put(values).then(() => formikBag.setSubmitting(false));
  };

  public render() {
    return (
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={6}>
          <Typography component="h1" variant="h5">
            Feiertage
          </Typography>
        </Grid>

        <Grid item={true} container={true} xs={6} justify={'flex-end'}>
          <Button variant="contained">
            Aktualisieren
            <RefreshIcon />
          </Button>
          {/*<UnstyledLink to={'/employees/new'}>*/}
          {/*<Button variant={'contained'} color={'primary'}>*/}
          {/*Hinzufügen*/}
          {/*<AddIcon />*/}
          {/*</Button>*/}
          {/*</UnstyledLink>*/}
        </Grid>

        <Grid item={true} xs={12}>
          {this.props!.holidayStore!.holidays.length === 0 && <p>Keine Feiertage.</p>}
          {this.props!.holidayStore!.holidays.length !== 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Datum</TableCell>
                  <TableCell>Dauer</TableCell>
                  <TableCell>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props!.holidayStore!.holidays.map((holiday: Holiday) => (
                  <Formik
                    key={holiday.id}
                    initialValues={holiday}
                    validationSchema={schema}
                    onSubmit={this.updateHoliday}
                    render={props => (
                      <TableRow>
                        <TableCell>
                          <Field component={TextFieldWithValidation} name={'name'} fullWidth />
                        </TableCell>
                        <TableCell>
                          <Field component={DatePickerWithValidation} name={'date'} fullWidth />
                        </TableCell>
                        <TableCell>
                          <Field component={NumberFieldWithValidation} name={'duration'} fullWidth />
                        </TableCell>
                        <TableCell>
                          <Button variant={'text'} disabled={props.isSubmitting} onClick={props.submitForm}>
                            <SaveIcon />
                          </Button>
                          <DeleteButton onConfirm={() => this.props.holidayStore!.delete(holiday.id)} />
                        </TableCell>
                      </TableRow>
                    )}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </Grid>
      </Grid>
    );
  }
}
