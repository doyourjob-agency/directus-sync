import { DataMapper, Field, IdMappers } from '../base';
import { Container, Service } from 'typedi';
import { LoggerService } from '../../logger';
import { FLOWS_COLLECTION } from './constants';
import { OperationsIdMapperClient } from '../operations';
import { FoldersIdMapperClient } from '../folders';
import { DirectusFlow } from './interfaces';

@Service()
export class FlowsDataMapper extends DataMapper<DirectusFlow> {
  protected fieldsToIgnore: Field<DirectusFlow, 'operations'>[] = [
    'date_created',
    'user_created',
    'operations',
  ];
  protected idMappers: IdMappers<DirectusFlow, 'folder'> = {
    operation: Container.get(OperationsIdMapperClient),
    folder: Container.get(FoldersIdMapperClient),
  };

  constructor(loggerService: LoggerService) {
    super(loggerService.getChild(FLOWS_COLLECTION));
  }
}
