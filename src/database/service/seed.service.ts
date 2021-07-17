import { Injectable, Logger } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class EntitySeedService<T, U> {
  private readonly repository: Repository<T>;

  constructor(public entity: T = null, public seedData: U = null) {
    Logger.log(`Started seeding ${this.entity['name']}`, 'EntitySeedService');
    this.repository = getConnection().getRepository(this.entity['name']);
    this._seed().then(() => {
      Logger.log(`Finished seeding ${this.entity['name']}`, 'EntitySeedService');
    });
  }

  private async _seed() {
    if (this.repository && this.seedData) {
      try {
        await this.repository.save(this.seedData);
      } catch (error) {
        Logger.error(error, null, 'EntitySeedService');
      }
    }
  }
}
