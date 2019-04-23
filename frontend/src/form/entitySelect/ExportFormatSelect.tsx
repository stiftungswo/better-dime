import React from 'react';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

const options = [
  {
    label: 'Nur E-Mail (Textdokument)',
    value: 1,
  },
  {
    label: 'Excel-Dokument',
    value: 2,
  },
];

export class ExportFormatSelect extends React.Component<DimeCustomFieldProps<number | null>> {
  render() {
    return <Select options={options} {...this.props} />;
  }
}
