import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { ProjectStore } from '../../stores/projectStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import ProjectForm from './ProjectForm';
import compose from '../../utilities/compose';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { computed } from 'mobx';
import { FormValues, Project } from '../../types';
import { projectTemplate } from './projectSchema';

export interface Props extends RouteComponentProps {
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

  public render() {
    return (
      <ProjectForm
        title={'Projekt erstellen'}
        onSubmit={this.handleSubmit}
        project={projectTemplate as FormValues}
        submitted={this.state.submitted}
      />
    );
  }
}
