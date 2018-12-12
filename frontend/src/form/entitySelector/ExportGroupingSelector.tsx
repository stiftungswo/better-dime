import React from 'react';
import Select from '../fields/Select';
import { FormProps } from '../fields/common';

const options = [
  {
    label: 'Nach Projekt gruppiert',
    value: 'project',
  },
  {
    label: 'Nach Projekt-Kategorie gruppiert',
    value: 'category',
  },
];

export class ExportGroupingSelector extends React.Component<FormProps> {
  public render() {
    return <Select options={options} {...this.props} />;
  }
}
