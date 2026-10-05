import { DataMapper, Field, IdMappers } from '../base';

import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { SETTINGS_COLLECTION } from './constants';
import { DirectusSettings } from './interfaces';
import { RolesIdMapperClient } from '../roles';
import { FoldersIdMapperClient } from '../folders';

@Service()
export class SettingsDataMapper extends DataMapper<DirectusSettings> {
  protected fieldsToIgnore: Field<
    DirectusSettings,
    'public_favicon' | 'project_id' | 'license_key' | 'license_token'
  >[] = [
    // These fields are not relevant meanwhile assets are not supported
    'project_logo',
    'public_foreground',
    'public_background',
    'public_favicon',
    // Not relevant for migrations. URL are different for each environment. Can be set with env variables.
    'project_url',
    // Not relevant for migrations. ID is different for each environment.
    'project_id',
    // Not relevant for migrations. License is specific to each environment and cannot be changed through the API.
    'license_key',
    'license_token',
  ];
  protected idMappers: IdMappers<DirectusSettings, 'public_registration_role'> =
    {
      public_registration_role: Container.get(RolesIdMapperClient),
      storage_default_folder: Container.get(FoldersIdMapperClient),
    };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(SETTINGS_COLLECTION));
  }
}
