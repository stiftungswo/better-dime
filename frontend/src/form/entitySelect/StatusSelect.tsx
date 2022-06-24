import * as React from 'react';
import { useIntl } from 'react-intl';
import wrapIntl from '../../utilities/wrapIntl';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

type Props = DimeCustomFieldProps<number>;

const statuses = {
  0: 'draft',
  1: 'offered',
  2: 'confirmed',
  3: 'rejected',
};

export function StatusSelect(props: Props) {
    const intl = useIntl();
    const intlText = wrapIntl(intl, 'form.select.status');
    const options = Object.keys(statuses).map(id => ({
      value: Number(id),
      label: intlText(statuses[id]),
    }));
    return <Select options={options} {...props} />;
}
