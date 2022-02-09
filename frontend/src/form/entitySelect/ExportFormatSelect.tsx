import React from 'react';
import { useIntl } from 'react-intl';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

export function ExportFormatSelect(props: DimeCustomFieldProps<number | null>) {
  const intlText = wrapIntl(useIntl(), 'form.entity_select.export_format');
  const options = [
    {
      label: intlText('just_email_addresses'),
      value: 1,
    },
    {
      label: intlText('whole_excel_file'),
      value: 2,
    },
  ];
  return <Select options={options} {...props} />;
}
