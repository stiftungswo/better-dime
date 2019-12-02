import { action, computed, observable } from 'mobx';
import {ProjectCommentPreset, ProjectEffortFilter} from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class ProjectCommentPresetStore extends AbstractStore<ProjectCommentPreset> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'der Kommentarvorschlag',
      plural: 'die Kommentarvorschläge',
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

  @action
  protected async doFetchAll() {
    try {
      const res = await this.mainStore.api.get<ProjectCommentPreset[]>('/project_comment_presets');
      this.projectCommentPresets = res.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Kommentarevorschläge');
    }
  }

  @action
  protected async doFetchFiltered() {
    try {
      const res = await this.mainStore.api.get<ProjectCommentPreset[]>('/project_comment_presets', {
        params: this.getQueryParams(),
      });
      this.projectCommentPresets = res.data;
    } catch (e) {
      this.mainStore.displayError('Fehler beim laden der Kommentarevorschläge');
    }
  }

  @action
  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<ProjectCommentPreset>('/project_comment_presets/' + id);
    this.projectCommentPreset = res.data;
  }

  @action
  protected async doPost(entity: ProjectCommentPreset): Promise<void> {
    const res = await this.mainStore.api.post<ProjectCommentPreset>('/project_comment_presets', entity);
    this.projectCommentPreset = res.data;
  }

  @action
  protected async doPut(entity: ProjectCommentPreset): Promise<void> {
    const res = await this.mainStore.api.put<ProjectCommentPreset>('/project_comment_presets/' + entity.id, entity);
    this.projectCommentPreset = res.data;
  }

  @action
  protected async doDelete(id: number): Promise<void> {
    await this.mainStore.api.delete('/project_comment_presets/' + id);
  }
}
