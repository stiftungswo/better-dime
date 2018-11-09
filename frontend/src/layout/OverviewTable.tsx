import * as React from 'react';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel/TableSortLabel';
import TableBody from '@material-ui/core/TableBody/TableBody';
import { SafeClickableTableRow } from '../utilities/SafeClickableTableRow';
import { Column } from './Overview';
import { observer } from 'mobx-react';

function desc(a: any, b: any, orderBy: string): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort<T>(array: Array<T>, cmp: any): Array<T> {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]) as any;
}

function getSorting(order: Direction | undefined, orderBy: string) {
  return order === 'desc' ? (a: any, b: any) => desc(a, b, orderBy) : (a: any, b: any) => -desc(a, b, orderBy);
}

function format<T>(def: Column<T>, row: T): React.ReactNode {
  if (def.format) {
    return def.format(row);
  } else {
    return row[def.id];
  }
}

interface TableProps<T> {
  columns: Array<Column<T>>;
  renderActions?: (e: T) => React.ReactNode;
  data: Array<T>;
  onClickRow?: (e: T, index: number) => void;
  searchFilter?: (e: T) => boolean;
  noSort?: boolean;
}

interface TableState {
  orderBy: string;
  order: Direction | undefined;
}

type Direction = 'asc' | 'desc';

@observer
export class OverviewTable<T> extends React.Component<TableProps<T>, TableState> {
  constructor(props: TableProps<T>) {
    super(props);
    this.state = {
      order: 'desc',
      orderBy: 'id',
    };
  }

  public handleRequestSort = (event: React.MouseEvent<HTMLElement>, property: string) => {
    const orderBy = property;
    let order: Direction = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  public createSortHandler = (property: string) => (event: React.MouseEvent<HTMLElement>) => {
    this.handleRequestSort(event, property);
  };

  public handleRowClick = (row: T, index: number) => (e: React.MouseEvent<HTMLElement>) => {
    if (this.props.onClickRow) {
      this.props.onClickRow(row, index);
    }
  };

  public filterSearch = (arr: T[]) => {
    if (this.props.searchFilter) {
      return arr.filter(this.props.searchFilter);
    } else {
      return arr;
    }
  };

  public render() {
    const { columns, data, noSort } = this.props;
    const { order, orderBy } = this.state;
    const sortedData = noSort ? data : stableSort(this.filterSearch(data), getSorting(order, orderBy));
    return (
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={col.id} numeric={col.numeric} sortDirection={orderBy === col.id ? order : undefined}>
                <TableSortLabel active={orderBy === col.id} direction={order} onClick={this.createSortHandler(col.id)}>
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            {this.props.renderActions && <TableCell numeric>Aktionen</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow hover key={index} onClick={this.handleRowClick(row, index)} component={SafeClickableTableRow}>
              {columns.map(col => (
                <TableCell key={col.id} numeric={col.numeric}>
                  {format(col, row)}
                </TableCell>
              ))}
              {this.props.renderActions && <TableCell numeric>{this.props.renderActions(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
