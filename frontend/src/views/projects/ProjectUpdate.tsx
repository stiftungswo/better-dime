import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ProjectStore } from '../../stores/projectStore';
import { FormValues, Project } from '../../types';
import compose from '../../utilities/compose';
import ProjectForm from './ProjectForm';

interface ProjectDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<ProjectDetailRouterProps> {
  projectStore?: ProjectStore;
}

@compose(
  inject('projectStore'),
  observer,
)
export default class ProjectUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.projectStore!.fetchOne(Number(props.match.params.id));
  }

  handleSubmit = (project: Project) => {
    return this.props.projectStore!.put(project);
  }

  get project() {
    const project = this.props.projectStore!.project;
    if (project) {
      // it's important to detach the mobx proxy before passing it into formik
      // formik's deepClone can fall into endless recursions with those proxies.
      return toJS(project);
    } else {
      return undefined;
    }
  }

  render() {
    const project = this.project;
    const title = project ? `${project.name} - Projekt` : 'Projekte bearbeiten';

    return <ProjectForm title={title} onSubmit={this.handleSubmit} project={project as FormValues} />;
  }
}
