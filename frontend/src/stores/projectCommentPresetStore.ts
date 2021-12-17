import * as _ from 'lodash';
import { action, computed, makeObservable, observable, override, runInAction } from 'mobx';
import {PaginatedData, ProjectCommentPreset, ProjectListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class ProjectCommentPresetStore extends AbstractPaginatedStore<ProjectCommentPreset> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Die Kommentarvorlage',
      plural: 'Die Kommentarvorlagen',
    };
  }

  @computed
  get entities(): ProjectCommentPreset[] {
    return this.projectCommentPresets;
  }

  @computed
  get entity(): ProjectCommentPreset | undefined {
    return this.projectCommentPreset;
  }

  set entity(projectComment: ProjectCommentPreset | undefined) {
    this.projectCommentPreset = projectComment;
  }

  @observable
  editing: boolean = false;

  @observable
  projectCommentPresetTemplate: ProjectCommentPreset = {
    comment_preset: '',
  };

  @observable
  projectCommentPresets: ProjectCommentPreset[] = [];

  @observable
  projectCommentPreset?: ProjectCommentPreset;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  setEntities(e: ProjectCommentPreset[]) {
    this.projectCommentPresets = e;
  }

  protected async doFetchAll() {
    try {
      const res = await this.mainStore.apiV2.get<PaginatedData<ProjectCommentPreset>>('/project_comment_presets');
      runInAction(() => { this.projectCommentPresets = res.data.data; });
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Kommentarevorschläge');
    }
  }

  protected async doFetchFiltered() {
    try {
      const res = await this.mainStore.apiV2.get<PaginatedData<ProjectCommentPreset>>('/project_comment_presets', {
        params: this.getQueryParams(),
      });
      runInAction(() => { this.projectCommentPresets = res.data.data; });
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Kommentarevorschläge');
    }
  }

  protected async doFetchAllPaginated(): Promise<void> {
    this.mainStore.apiV2.get<PaginatedData<ProjectCommentPreset>>('/project_comment_presets', { params: this.getPaginatedQueryParams() }).then(action(res => {
      const page = res.data;
      this.projectCommentPresets = page.data;
      this.pageInfo = _.omit(page, 'data');
    }));
  }

  protected async doFetchOne(id: number) {
    this.mainStore.apiV2.get<ProjectCommentPreset>('/project_comment_presets/' + id).then(
      action(res => { this.projectCommentPreset = res.data; }),
    );
  }

  protected async doPost(entity: ProjectCommentPreset): Promise<void> {
    this.mainStore.apiV2.post<ProjectCommentPreset>('/project_comment_presets', entity).then(
      action(res => { this.projectCommentPreset = res.data; }),
    );
  }

  protected async doPut(entity: ProjectCommentPreset): Promise<void> {
    this.mainStore.apiV2.put<ProjectCommentPreset>('/project_comment_presets/' + entity.id, entity).then(
      action(res => { this.projectCommentPreset = res.data; }),
    );
  }

  @override
  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.apiV2.delete('/project_comment_presets/' + id);
  }
}
