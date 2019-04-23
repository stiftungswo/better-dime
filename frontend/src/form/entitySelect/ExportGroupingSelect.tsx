import React from 'react';
import { DimeCustomFieldProps, WidthToggle } from '../fields/common';
import Select from '../fields/Select';

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
  render() {
    return <Select options={options} {...this.props} />;
  }
}
