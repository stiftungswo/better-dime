import { inject, observer } from 'mobx-react';
import * as React from 'react';
import {ProjectCommentPresetStore} from '../../stores/projectCommentPresetStore';
import {ProjectCommentStore} from '../../stores/projectCommentStore';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  projectCommentPresetStore?: ProjectCommentPresetStore;
  projectCommentStore?: ProjectCommentStore;
}

@compose(
  inject('projectCommentStore', 'projectCommentPresetStore'),
  observer,
)
export class ProjectCommentPresetSelect<T> extends React.Component<Props<T>> {
  state = {
    createdOptions: [] as any,
  };

  componentDidMount(): void {
    if (this.props.projectCommentStore!.projectComment != null) {
      this.state.createdOptions.push({
        value: this.props.projectCommentStore!.projectComment!.comment,
        label: `${this.props.projectCommentStore!.projectComment!.comment}`,
      });
    }
  }

  get options() {
    const loadedOptions = this.props.projectCommentPresetStore!.entities
      .map(e => ({
        value: e.comment_preset,
        label: `${e.comment_preset}`,
      }));
    const filteredCreated = this.state.createdOptions.filter((e: any) => {
      return loadedOptions.findIndex((l: any) => l.value === e.value) < 0;
    });
    return loadedOptions.concat(filteredCreated);
  }

  addOption = (option: any) => {
    if (this.state.createdOptions.findIndex((e: any) => e.value === option.value) < 0) {
      this.state.createdOptions.push({
        value: option.value,
        label: `${option.label}`,
      });
    }
  }

  onCreate = (created: any) => {
    if (Array.isArray(created)) {
      created.forEach((e: any) => {
        this.addOption(e);
      });
    } else {
      this.addOption(created);
    }
  }

  render() {
    return <Select creatable options={this.options} onCreate={this.onCreate} {...this.props} />;
  }
}
