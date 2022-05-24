import { action, computed, makeObservable, observable, override } from 'mobx';
import moment from 'moment';
import { ProjectComment, ProjectCommentListing, ProjectEffortFilter } from '../types';
import {Cache} from '../utilities/Cache';
import { AbstractStore } from './abstractStore';
import { apiDateFormat } from './apiStore';
import { MainStore } from './mainStore';

export class ProjectCommentStore extends AbstractStore<ProjectComment> {

  projectComment?: ProjectComment = undefined;
  projectComments: ProjectCommentListing[] = [];

  editing: boolean = false;

  projectCommentTemplate: ProjectComment = {
    comment: '',
    date: moment(),
    project_id: undefined,
  };

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable<ProjectCommentStore, 'doPost' | 'doFetchOne' | 'doPut' | 'doDelete'>(this, {
      projectComment: observable,
      projectComments: observable,
      editing: observable,
      projectCommentTemplate: observable,
      entities: computed,
      entity: computed,
      fetchWithProjectEffortFilter: action,
      move: action,
      doPost: override,
      doFetchOne: action,
      doPut: override,
      doDelete: override,
    });
  }

  get entities(): ProjectCommentListing[] {
    return this.projectComments;
  }

  get entity(): ProjectComment | undefined {
    return this.projectComment;
  }

  set entity(projectComment: ProjectComment | undefined) {
    this.projectComment = projectComment;
  }

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Der Projektkommentar',
      plural: 'Die Projektkommentare',
    };
  }

  async fetchWithProjectEffortFilter(filter: ProjectEffortFilter) {
    try {
      const res = await this.mainStore.apiV2.get<ProjectCommentListing[]>('/project_comments', {
        params: {
          start: filter.start.format(apiDateFormat),
          end: filter.end.format(apiDateFormat),
          project_ids: filter.projectIds ? filter.projectIds.join(',') : '',
        },
      });
      this.projectComments = res.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Projektkommentare');
    }
  }

  async move(commentIds: number[], targetProject: number) {
    await this.notifyProgress(() =>
      this.mainStore.apiV2.put('project_comments/move', {
        comment_ids: commentIds,
        project_id: targetProject,
      }),
    );
    Cache.invalidateAllActiveCaches();
  }

  protected async doPost(entity: ProjectComment): Promise<void> {
    const res = await this.mainStore.apiV2.post<ProjectComment>('/project_comments', entity);
    this.projectComment = res.data;
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<ProjectComment>('/project_comments/' + id);
    this.projectComment = res.data;
  }

  protected async doPut(entity: ProjectComment): Promise<void> {
    const res = await this.mainStore.apiV2.put<ProjectComment>('/project_comments/' + entity.id, entity);
    this.projectComment = res.data;
  }

  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.apiV2.delete('/project_comments/' + id);
  }
}
