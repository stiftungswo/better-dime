import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ServiceStore } from '../store/serviceStore';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import UnstyledLink from '../utilities/UnstyledLink';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import { ServiceListing } from './types';
import { MainStore } from '../store/mainStore';

export interface Props {
  serviceStore?: ServiceStore;
  mainStore?: MainStore;
}

@inject('serviceStore', 'mainStore')
@observer
export default class ServiceOverview extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.serviceStore!.fetchAll();
  }

  public navigateTo(id: number) {
    this.props.mainStore!.navigateTo(`/services/${id}`);
  }

  public render() {
    return (
      <Grid container={true} spacing={16}>
        <Grid item={true} xs={6}>
          <Typography component="h1" variant="h5">
            Services
          </Typography>
        </Grid>

        <Grid item={true} container={true} xs={6} justify={'flex-end'}>
          <Button variant="contained">
            Aktualisieren
            <RefreshIcon />
          </Button>
          <UnstyledLink to={'/services/new'}>
            <Button variant={'contained'} color={'primary'}>
              Hinzufügen
              <AddIcon />
            </Button>
          </UnstyledLink>
        </Grid>

        <Grid item={true} xs={12}>
          {this.props!.serviceStore!.services.length === 0 && <p>Keine Services.</p>}
          {this.props!.serviceStore!.services.length !== 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Beschreibung</TableCell>
                  <TableCell>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props!.serviceStore!.services.map((service: ServiceListing) => (
                  <TableRow key={service.id} hover onClick={() => this.navigateTo(service.id)}>
                    <TableCell>
                      {service.id} {service.archived && '[A]'}
                    </TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      <Button variant="text">
                        <FileCopyIcon />
                      </Button>
                      <Link to={`/services/${service.id}`}>
                        <Button variant={'text'}>
                          <EditIcon />
                        </Button>
                      </Link>
                      <Button variant={'text'}>
                        <ArchiveIcon />
                      </Button>
                      <Button variant={'text'}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Grid>
      </Grid>
    );
  }
}
