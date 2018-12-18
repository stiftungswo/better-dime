import { Column } from './Overview';
import { OverviewTable } from './OverviewTable';
import * as React from 'react';
import { SubformDialog } from '../form/SubformDialog';
import { FormikProps, getIn } from 'formik';

interface Props<T> {
  columns: Array<Column<T>>;
  title: string;
  renderForm: (index: number, name: (s: string) => string) => React.ReactNode;
  defaultValues: object;
  renderActions?: (e: T) => React.ReactNode;
  name: string;
  formikProps: FormikProps<any>;
}

export class SubformTable<T> extends React.Component<Props<T>> {
  public state = {
    editing: false,
    editIndex: undefined,
  };

  public get values() {
    return this.props.formikProps.values[this.props.name];
  }

  public errorChecker = (index: number) => {
    const error = getIn(this.props.formikProps.errors, `${this.props.name}.${index}`);
    console.log('Error for ', index, error);
    return !!error;
  };

  public handleClick = async (entity: T, index: number) => {
    this.setState({
      editing: true,
      editIndex: index,
    });
  };

  public handleClose = () => {
    this.setState({ editIndex: undefined });
  };

  public handleAdd = () => {
    this.setState({ editing: true });
  };

  public handleSubmit = () => Promise.resolve();

  public render() {
    const name = (index: number) => (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;

    return (
      <>
        <OverviewTable
          noSort
          columns={this.props.columns}
          data={this.values}
          errorChecker={this.errorChecker}
          onClickRow={this.handleClick}
        />
        {this.state.editIndex !== undefined && (
          // maybe we could render those dialogs based on route, just as the full-page form views? does that make things easier?
          // ...probably not on subforms
          <SubformDialog
            open
            onClose={this.handleClose}
            title={this.props.title}
            initialValues={this.values[this.state.editIndex!] || this.props.defaultValues}
            onSubmit={this.handleSubmit}
          >
            {this.props.renderForm(this.state.editIndex!, name(this.state.editIndex!))}
          </SubformDialog>
        )}
      </>
    );
  }
}
