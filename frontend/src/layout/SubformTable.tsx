import { Column } from './Overview';
import { OverviewTable } from './OverviewTable';
import * as React from 'react';
import { SubformDialog } from '../form/SubformDialog';

interface Props<T> {
  values: T[];
  columns: Array<Column<T>>;
  title: string;
  renderForm: (index: number) => React.ReactNode;
  defaultValues: object;
  renderActions?: (e: T) => React.ReactNode;
}

export class SubformTable<T> extends React.Component<Props<T>> {
  public state = {
    editing: false,
    editIndex: undefined,
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
    // this.props.store.entity = undefined;
    this.setState({ editing: true });
  };

  public handleSubmit = () => Promise.resolve();

  public render() {
    // const entity = this.props.store.entity;

    return (
      <>
        <OverviewTable
          noSort
          columns={this.props.columns}
          // data={this.props.store.entities}
          data={this.props.values}
          onClickRow={this.handleClick}
        />
        {this.state.editIndex !== undefined && (
          <SubformDialog
            open
            onClose={this.handleClose}
            title={this.props.title}
            initialValues={this.props.values[this.state.editIndex!] || this.props.defaultValues}
            onSubmit={this.handleSubmit}
          >
            {this.props.renderForm(this.state.editIndex!)}
          </SubformDialog>
        )}
      </>
    );
  }
}
