import { AbstractStore } from './abstractStore';
import { ProjectComment, ProjectEffort, ProjectEffortListing } from '../types';
import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { MainStore } from './mainStore';
import { TimetrackFilterStore } from './timetrackFilterStore';

export class ProjectCommentStore extends AbstractStore<ProjectComment> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'der Projektkommentar',
      plural: 'die Projektkommentare',
    };
  }

  constructor(mainStore: MainStore, private timetrackFilterStore: TimetrackFilterStore) {
    super(mainStore);
  }

  @observable
  public editing: boolean = false;

  @observable
  public projectCommentTemplate: ProjectComment = {
    comment: '',
    date: moment().format('YYYY-MM-DD'),
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
  protected async doFetchAll() {
    let baseIndex = '/project_comments';

    if (this.timetrackFilterStore.filter) {
      baseIndex += '?start=' + this.timetrackFilterStore.filter.start;
      baseIndex += '&end=' + this.timetrackFilterStore.filter.end;
    }

    const res = await this.mainStore.api.get<ProjectComment[]>(baseIndex);
    this.projectComments = res.data;
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
    this.fetchAll();
  }

  @action
  protected async doPut(entity: ProjectComment): Promise<void> {
    const res = await this.mainStore.api.put<ProjectComment>('/project_comments/' + entity.id, entity);
    this.projectComment = res.data;
    this.fetchAll();
  }
}
