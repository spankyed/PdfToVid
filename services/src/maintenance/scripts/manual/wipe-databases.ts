import * as sharedRepository from '~/shared/repository';
import { synchronizeDatabase } from './migration';
import { setConfigSettings } from '~/shared/utils/set-config';

synchronizeDatabase();

await sharedRepository.chroma.deleteReferenceCollection()

await setConfigSettings({ isNewUser: true })


