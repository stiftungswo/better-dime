import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';
import {PaginatedData, ProjectCommentPreset, ProjectListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { MainStore } from './mainStore';

export class ProjectCommentPresetStore extends AbstractPaginatedStore<ProjectCommentPreset> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Kommentarvorlage',
      plural: 'die Kommentarvorlagen',
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
  }

  setEntities(e: ProjectCommentPreset[]) {
    this.projectCommentPresets = e;
  }

  @action
  protected async doFetchAll() {
    try {
      const res = await this.mainStore.apiV2.get<PaginatedData<ProjectCommentPreset>>('/project_comment_presets');
      this.projectCommentPresets = res.data.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Kommentarevorschläge');
    }
  }

  @action
  protected async doFetchFiltered() {
    try {
      const res = await this.mainStore.apiV2.get<PaginatedData<ProjectCommentPreset>>('/project_comment_presets', {
        params: this.getQueryParams(),
      });
      this.projectCommentPresets = res.data.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Kommentarevorschläge');
    }
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedData<ProjectCommentPreset>>('/project_comment_presets', {
      params: this.getPaginatedQueryParams(),
    });
    const page = res.data;
    this.projectCommentPresets = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<ProjectCommentPreset>('/project_comment_presets/' + id);
    this.projectCommentPreset = res.data;
  }

  @action
  protected async doPost(entity: ProjectCommentPreset): Promise<void> {
    const res = await this.mainStore.apiV2.post<ProjectCommentPreset>('/project_comment_presets', entity);
    this.projectCommentPreset = res.data;
  }

  @action
  protected async doPut(entity: ProjectCommentPreset): Promise<void> {
    const res = await this.mainStore.apiV2.put<ProjectCommentPreset>('/project_comment_presets/' + entity.id, entity);
    this.projectCommentPreset = res.data;
  }

  @action
  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.apiV2.delete('/project_comment_presets/' + id);
  }
}
