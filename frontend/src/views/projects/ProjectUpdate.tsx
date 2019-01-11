import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import ProjectForm from './ProjectForm';
import compose from '../../utilities/compose';
import { ProjectStore } from '../../stores/projectStore';
import { FormValues, Project } from '../../types';
import { toJS } from 'mobx';

interface ProjectDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<ProjectDetailRouterProps> {
  projectStore?: ProjectStore;
}

@compose(
  inject('projectStore'),
  observer
)
export default class ProjectUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.projectStore!.fetchOne(Number(props.match.params.id));
  }

  public handleSubmit = (project: Project) => {
    return this.props.projectStore!.put(project);
  };

  public get project() {
    const project = this.props.projectStore!.project;
    if (project) {
      return {
        //it's important to detach the mobx proxy before passing it into formik - formik's deepClone can fall into endless recursions with those proxies.
        ...toJS(project),
        fixed_price: project.fixed_price || '',
      };
    } else {
      return undefined;
    }
  }

  public render() {
    const project = this.project;
    const title = project ? `${project.name} - Projekt` : 'Projekte bearbeiten';

    return <ProjectForm title={title} onSubmit={this.handleSubmit} project={project as FormValues} />;
  }
}
