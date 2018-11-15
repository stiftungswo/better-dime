import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { ProjectStore } from '../../stores/projectStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import ProjectForm from './ProjectForm';
import compose from '../../utilities/compose';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { computed } from 'mobx';
import { Project } from '../../types';

export interface Props extends RouteComponentProps, InjectedNotistackProps {
  projectStore?: ProjectStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('projectStore'),
  observer
)
export default class ProjectCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  constructor(props: Props) {
    super(props);
  }

  public handleSubmit = (project: Project) => {
    return this.props.projectStore!.post(project).then(() => {
      this.setState({ submitted: true });
      const idOfNewProject = this.props!.projectStore!.project!.id;
      this.props.history.replace('/projects/' + idOfNewProject);
    });
  };

  @computed
  get project(): any {
    return {
      id: undefined,
      name: '',
      description: '',
      deadline: '',
      fixed_price: '',
      positions: [],
    };
  }

  public render() {
    return <ProjectForm title={'Projekt erstellen'} onSubmit={this.handleSubmit} project={this.project} submitted={this.state.submitted} />;
  }
}
