import {action, observable} from 'mobx';
import {Cache} from '../utilities/Cache';
import {AbstractStore} from './abstractStore';
import {MainStore} from './mainStore';

/**
 * This class extends the AbstractStore to cache its data
 */
export class AbstractCachedStore<T, OverviewType = T> extends AbstractStore<T, OverviewType> {

  // a simple cache for for fetchAll results with a single cache line
  @observable
  private fetchAllCache: Cache = new Cache(1, this.constructor.name + 'fAllCache');
  // a fully associative cache for for fetchOne results with 20 cache lines
  @observable
  private fetchOneCache: Cache = new Cache(20, this.constructor.name + 'fOneCache');

  constructor(protected mainStore: MainStore) {
    super(mainStore);
  }

  @action
  async fetchAll() {
    const cached = this.fetchAllCache.fetchAll();

    if (cached != null) {
      this.setEntities(cached[0]);
      return;
    } else {
      return super.fetchAll().then(nothing => {
        this.fetchAllCache.put(this.entities);
      });
    }
  }

  @action
  async fetchOne(id: number) {
    const cached = this.fetchOneCache.fetchOne(id);

    if (cached != null) {
      this.entity = cached;
      return;
    } else {
      return super.fetchOne(id).then(nothing => {
        this.fetchOneCache.put(this.entity);
      });
    }
  }

  @action
  async post(entity: T) {
    return super.post(entity);
  }

  @action
  async put(entity: T) {
    return super.put(entity);
  }

  @action
  async delete(id: number) {
    return super.delete(id);
  }

  @action
  async duplicate(id: number): Promise<T> {
    return super.duplicate(id);
  }

  @action
  async archive(id: number, archived: boolean) {
    return super.archive(id, archived);
  }
}
