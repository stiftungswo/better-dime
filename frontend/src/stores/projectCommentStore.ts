import { action, computed, makeObservable, observable, override } from 'mobx';
import moment from 'moment';
import { ProjectComment, ProjectCommentListing, ProjectEffortFilter } from '../types';
import {Cache} from '../utilities/Cache';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { apiDateFormat } from './apiStore';
import { MainStore } from './mainStore';

export class ProjectCommentStore extends AbstractSimpleStore<ProjectComment, ProjectCommentListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Projektkommentar',
      plural: 'Die Projektkommentare',
    };
  }
  protected get entityUrlName(): string {
    return 'project_comments';
  }
  // I didn't feel like changing every .projectComment to .entity
  @computed
  get projectComment(): ProjectComment | undefined {
    return this.entity;
  }
  set projectComment(entity: ProjectComment | undefined) {
    this.entity = entity;
  }

  @observable
  editing: boolean = false;

  @observable
  projectCommentTemplate: ProjectComment = {
    comment: '',
    date: moment(),
    project_id: undefined,
  };

  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: false,
      canDelete: true,
      canDuplicate: false,
      canFetchOne: true,
      canPostPut: true,
    });
    makeObservable(this);
  }

  @action
  async fetchWithProjectEffortFilter(filter: ProjectEffortFilter) {
    try {
      const res = await this.mainStore.apiV2.get<ProjectCommentListing[]>('/project_comments', {
        params: {
          start: filter.start.format(apiDateFormat),
          end: filter.end.format(apiDateFormat),
          project_ids: filter.projectIds ? filter.projectIds.join(',') : '',
        },
      });
      this.storedEntities = res.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Projektkommentare');
    }
  }

  @action
  async move(commentIds: number[], targetProject: number) {
    await this.notifyProgress(() =>
      this.mainStore.apiV2.put('project_comments/move', {
        comment_ids: commentIds,
        project_id: targetProject,
      }),
    );
    Cache.invalidateAllActiveCaches();
  }
}
