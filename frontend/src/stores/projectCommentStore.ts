import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { ProjectComment, ProjectEffortFilter } from '../types';
import { AbstractStore } from './abstractStore';
import { apiDateFormat } from './apiStore';
import { MainStore } from './mainStore';

export class ProjectCommentStore extends AbstractStore<ProjectComment> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'der Projektkommentar',
      plural: 'die Projektkommentare',
    };
  }

  @computed
  get entities(): ProjectComment[] {
    return this.projectComments;
  }

  @computed
  get entity(): ProjectComment | undefined {
    return this.projectComment;
  }

  set entity(projectComment: ProjectComment | undefined) {
    this.projectComment = projectComment;
  }

  @observable
  editing: boolean = false;

  @observable
  projectCommentTemplate: ProjectComment = {
    comment: '',
    date: moment(),
    project_id: undefined,
  };

  @observable
  projectComments: ProjectComment[] = [];

  @observable
  projectComment?: ProjectComment;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  async fetchWithProjectEffortFilter(filter: ProjectEffortFilter) {
    try {
      const res = await this.mainStore.apiV2.get<ProjectComment[]>('/project_comments', {
        params: {
          start: filter.start.format(apiDateFormat),
          end: filter.end.format(apiDateFormat),
        },
      });
      this.projectComments = res.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Projektkommentare');
    }
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<ProjectComment>('/project_comments/' + id);
    this.projectComment = res.data;
  }

  @action
  protected async doPost(entity: ProjectComment): Promise<void> {
    const res = await this.mainStore.apiV2.post<ProjectComment>('/project_comments', entity);
    this.projectComment = res.data;
  }

  @action
  protected async doPut(entity: ProjectComment): Promise<void> {
    const res = await this.mainStore.apiV2.put<ProjectComment>('/project_comments/' + entity.id, entity);
    this.projectComment = res.data;
  }

  @action
  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.apiV2.delete('/project_comments/' + id);
  }
}
