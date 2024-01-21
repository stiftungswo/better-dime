import {inject, observer} from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import {EffortStore} from '../../stores/effortStore';
import {ProjectCategoryStore} from '../../stores/projectCategoryStore';
import {ProjectStore} from '../../stores/projectStore';
import {Category} from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import {DimeCustomFieldProps} from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
    effortStore?: EffortStore;
    projectCategoryStore?: ProjectCategoryStore;
    projectStore?: ProjectStore;
    projectId?: number | null;
    intl?: IntlShape;
}

@compose(
    injectIntl,
    inject('effortStore', 'projectStore', 'projectCategoryStore'),
    observer,
)
export class ProjectCategorySelect extends React.Component<Props> {
    get options() {
        if (this.props.projectId === undefined || this.props.projectId === null) {
            return this.props
                .projectCategoryStore!.entities.filter((e: Category) => !e.archived || this.props.value === e.id)
                .map(e => ({
                    value: e.id,
                    label: e.name,
                }));
        } else {
            if (this.props.effortStore!.selectedProject) {
                const categoryIds = this.props.effortStore!.selectedProject!.category_distributions.map(cd => cd.category_id);

                return this.props
                    .projectCategoryStore!
                    .entities
                    .filter((e: Category) => !e.archived || this.props.value === e.id)
                    .filter((e: Category) => categoryIds.includes(e.id))
                    .map(e => ({
                        value: e.id,
                        label: e.name,
                    }));
            } else {
                return [];
            }
        }
    }

    componentDidMount() {
        this.updateProjectInStore();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.projectId !== prevProps.projectId) {
            this.props.onChange(null);
            this.updateProjectInStore();
        }
    }

    render() {
        const intlText = wrapIntl(this.props.intl!, 'form.entity_select.project_position_select');
        if (this.props.projectId) {
            if (this.props.projectStore!.project) {
                return <Select options={this.options} {...this.props} />;
            } else {
                return <Select options={[]} isDisabled isLoading placeholder={intlText('wait_fetching')} {...this.props} />;
            }
        } else {
            return <Select options={this.options} {...this.props} />;
        }
    }

    protected async updateProjectInStore() {
        if (this.props.projectId) {
            await this.props.projectStore!.fetchOne(this.props.projectId);
            this.props.effortStore!.selectedProject = this.props.projectStore!.project;
        }
    }
}
