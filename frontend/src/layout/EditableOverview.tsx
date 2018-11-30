import { AbstractStore } from '../stores/abstractStore';
import Overview, { Column, SearchFilter } from './Overview';
import { FormikBag, FormikProps } from 'formik';
import * as React from 'react';
import { FormDialog } from '../form/FormDialog';
import { HandleFormikSubmit, Listing } from '../types';
import { Schema } from 'yup';
import { Omit } from '@material-ui/core';

interface Props<T> {
  archivable?: boolean;
  //tslint:disable-next-line:no-any ; the first type doesn't matter at all here and makes typing much more verbose
  store: AbstractStore<any, T>;
  columns: Array<Column<T>>;
  title: string;
  renderForm: (props: FormikProps<T>) => React.ReactNode;
  defaultValues: object;
  //tslint:disable-next-line:no-any ;
  schema: Schema<any>;
  searchFilter?: SearchFilter<T>;
  renderActions?: (e: T) => React.ReactNode;
}

export class EditableOverview<T extends Listing> extends React.Component<Props<T>> {
  public state = {
    editing: false,
  };

  public handleClick = async (entity: T) => {
    this.props.store!.entity = entity;
    this.setState({ editing: true });
  };

  public handleClose = () => {
    this.setState({ editing: false });
  };

  public handleSubmit = (entity: T) => {
    if (this.props.store.entity) {
      this.props.store!.put(entity).then(() => this.setState({ editing: false }));
    } else {
      this.props.store!.post(entity).then(() => this.setState({ editing: false }));
    }
    return Promise.resolve();
  };

  public handleAdd = () => {
    this.props.store.entity = undefined;
    this.setState({ editing: true });
  };

  public render() {
    const entity = this.props.store.entity;

    return (
      <>
        <Overview
          archivable={this.props.archivable}
          title={this.props.title}
          store={this.props.store}
          columns={this.props.columns}
          addAction={this.handleAdd}
          onClickRow={this.handleClick}
          searchFilter={this.props.searchFilter}
          renderActions={this.props.renderActions}
        />
        {this.state.editing && (
          <FormDialog
            open
            onClose={this.handleClose}
            title={this.props.title}
            initialValues={entity || this.props.defaultValues}
            validationSchema={this.props.schema}
            onSubmit={this.handleSubmit}
            render={this.props.renderForm}
          />
        )}
      </>
    );
  }
}
