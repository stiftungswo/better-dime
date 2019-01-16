import React from 'react';
import Select from '../fields/Select';
import { DimeCustomFieldProps, WidthToggle } from '../fields/common';

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

export class ExportGroupingSelect extends React.Component<DimeCustomFieldProps<'project' | 'category'> & WidthToggle> {
  public render() {
    return <Select options={options} {...this.props} />;
  }
}
