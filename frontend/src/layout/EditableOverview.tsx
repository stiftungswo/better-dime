import { Omit } from '@material-ui/core';
import { FormikBag, FormikProps } from 'formik';
import * as React from 'react';
import { Schema } from 'yup';
import { FormDialog } from '../form/FormDialog';
import { AbstractStore } from '../stores/abstractStore';
import { HandleFormikSubmit, Listing } from '../types';
import Overview, { Column, SearchFilter } from './Overview';

interface Props<T> {
  archivable?: boolean;
  searchable?: boolean;
  // tslint:disable-next-line:no-any ; the first type doesn't matter at all here and makes typing much more verbose
  store: AbstractStore<any, T>;
  columns: Array<Column<T>>;
  title: string;
  renderForm: (props: FormikProps<T>) => React.ReactNode;
  defaultValues: object;
  // tslint:disable-next-line:no-any ;
  schema: Schema<any>;
  renderActions?: (e: T) => React.ReactNode;
  onSubmit?: (entity: T) => Promise<void>;
}

export class EditableOverview<T extends Listing> extends React.Component<Props<T>> {
  state = {
    editing: false,
  };

  handleClick = async (entity: T) => {
    this.props.store!.entity = entity;
    this.setState({ editing: true });
  }

  handleClose = () => {
    this.setState({ editing: false });
  }

  handleSubmit = (entity: T) => {
    if (this.props.onSubmit) {
      return this.props.onSubmit(entity).then(this.handleClose).catch(this.handleClose);
    } else {
      if (this.props.store.entity) {
        this.props.store!.put(entity).then(this.handleClose).catch(this.handleClose);
      } else {
        this.props.store!.post(entity).then(this.handleClose).catch(this.handleClose);
      }
      return Promise.resolve();
    }
  }

  handleAdd = () => {
    this.props.store.entity = undefined;
    this.setState({ editing: true });
  }

  render() {
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
          renderActions={this.props.renderActions}
          searchable={this.props.searchable}
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
