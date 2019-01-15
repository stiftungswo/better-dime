import React from 'react';
import Select from '../fields/Select';
import { DimeCustomFieldProps } from '../fields/common';

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

export class ExportFormatSelector extends React.Component<DimeCustomFieldProps<number | null>> {
  public render() {
    return <Select options={options} {...this.props} />;
  }
}
