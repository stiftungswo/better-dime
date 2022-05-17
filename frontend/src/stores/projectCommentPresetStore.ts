import * as _ from 'lodash';
import { action, computed, makeObservable, observable, override } from 'mobx';
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

  get entities(): ProjectCommentPreset[] {
    return this.projectCommentPresets;
  }

  get entity(): ProjectCommentPreset | undefined {
    return this.projectCommentPreset;
  }

  set entity(projectComment: ProjectCommentPreset | undefined) {
    this.projectCommentPreset = projectComment;
  }

  editing: boolean = false;

  projectCommentPresetTemplate: ProjectCommentPreset = {
    comment_preset: '',
  };

  projectCommentPresets: ProjectCommentPreset[] = [];

  projectCommentPreset?: ProjectCommentPreset = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable<ProjectCommentPresetStore, 'doFetchAll' | 'doFetchFiltered' | 'doFetchOne' | 'doPost' | 'doPut' | 'doDelete'>(this, {
      entities: computed,
      entity: computed,
      editing: observable,
      projectCommentPresetTemplate: observable,
      projectCommentPresets: observable,
      projectCommentPreset: observable,
      doFetchAll: action,
      doFetchFiltered: action,
      doFetchOne: action,
      doPost: override,
      doPut: override,
      doDelete: override,
    });
  }

  setEntities(e: ProjectCommentPreset[]) {
    this.projectCommentPresets = e;
  }

  protected async doFetchAll() {
    try {
      const res = await this.mainStore.apiV2.get<PaginatedData<ProjectCommentPreset>>('/project_comment_presets');
      this.projectCommentPresets = res.data.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Kommentarevorschläge');
    }
  }

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

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.apiV2.get<ProjectCommentPreset>('/project_comment_presets/' + id);
    this.projectCommentPreset = res.data;
  }

  protected async doPost(entity: ProjectCommentPreset): Promise<void> {
    const res = await this.mainStore.apiV2.post<ProjectCommentPreset>('/project_comment_presets', entity);
    this.projectCommentPreset = res.data;
  }

  protected async doPut(entity: ProjectCommentPreset): Promise<void> {
    const res = await this.mainStore.apiV2.put<ProjectCommentPreset>('/project_comment_presets/' + entity.id, entity);
    this.projectCommentPreset = res.data;
  }

  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.apiV2.delete('/project_comment_presets/' + id);
  }
}
