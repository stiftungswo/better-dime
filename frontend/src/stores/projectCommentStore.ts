import { AbstractStore } from './abstractStore';
import { ProjectComment, ProjectEffortFilter } from '../types';
import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { MainStore } from './mainStore';
import { apiDateFormat } from './apiStore';

export class ProjectCommentStore extends AbstractStore<ProjectComment> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'der Projektkommentar',
      plural: 'die Projektkommentare',
    };
  }

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @observable
  public editing: boolean = false;

  @observable
  public projectCommentTemplate: ProjectComment = {
    comment: '',
    date: moment(),
    project_id: undefined,
  };

  @observable
  public projectComments: ProjectComment[] = [];

  @observable
  public projectComment?: ProjectComment;

  @computed
  get entities(): Array<ProjectComment> {
    return this.projectComments;
  }

  @computed
  get entity(): ProjectComment | undefined {
    return this.projectComment;
  }

  set entity(projectComment: ProjectComment | undefined) {
    this.projectComment = projectComment;
  }

  @action
  public async fetchFiltered(filter: ProjectEffortFilter) {
    try {
      const res = await this.mainStore.api.get<ProjectComment[]>('/project_comments', {
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
    const res = await this.mainStore.api.get<ProjectComment>('/project_comments/' + id);
    this.projectComment = res.data;
  }

  @action
  protected async doPost(entity: ProjectComment): Promise<void> {
    const res = await this.mainStore.api.post<ProjectComment>('/project_comments/', entity);
    this.projectComment = res.data;
  }

  @action
  protected async doPut(entity: ProjectComment): Promise<void> {
    const res = await this.mainStore.api.put<ProjectComment>('/project_comments/' + entity.id, entity);
    this.projectComment = res.data;
  }

  @action
  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.api.delete('/project_comments/' + id);
  }
}
