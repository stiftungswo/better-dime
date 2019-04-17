import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainStore } from '../../stores/mainStore';
import { ProjectStore } from '../../stores/projectStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { FormValues, Project } from '../../types';
import compose from '../../utilities/compose';
import ProjectForm from './ProjectForm';
import { projectTemplate } from './projectSchema';

export interface Props extends RouteComponentProps {
  projectStore?: ProjectStore;
  mainStore?: MainStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('projectStore', 'mainStore'),
  observer,
)
export default class ProjectCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  constructor(props: Props) {
    super(props);
  }

  handleSubmit = (project: Project) => {
    return this.props.projectStore!.post(project).then(() => {
      this.setState({ submitted: true });
      const idOfNewProject = this.props!.projectStore!.project!.id;
      this.props.history.replace('/projects/' + idOfNewProject);
    });
  }

  render() {
    return (
      <ProjectForm
        title={'Projekt erstellen'}
        onSubmit={this.handleSubmit}
        project={
          {
            ...projectTemplate,
            accountant_id: this.props.mainStore!.userId!,
          } as FormValues
        }
        submitted={this.state.submitted}
      />
    );
  }
}
