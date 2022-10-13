import React from 'react';
import { useIntl } from 'react-intl';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DimeCustomFieldProps, WidthToggle } from '../fields/common';
import Select from '../fields/Select';

export function ExportGroupingSelect(props: DimeCustomFieldProps<'project' | 'category'> & WidthToggle) {
  const intlText = wrapIntl(useIntl(), 'form.entity_select.export_grouping');
  const options = [
    {
      label: intlText('by_project'),
      value: 'project',
    },
    {
      label: intlText('by_category'),
      value: 'category',
    },
    {
      label: intlText('by_project_split'),
      value: 'project_split',
    },
  ];
  return <Select options={options} {...props} />;
}
