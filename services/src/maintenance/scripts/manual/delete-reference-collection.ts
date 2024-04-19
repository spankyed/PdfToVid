import * as sharedRepository from '~/shared/repository';
import { synchronizeDatabase } from './migration';

synchronizeDatabase();

await sharedRepository.chroma.deleteReferenceCollection()

