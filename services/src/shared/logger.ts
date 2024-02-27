import * as bunyan from 'bunyan';

export const log = bunyan.createLogger({
    name: 'relevancy-compute',
    serializers: bunyan.stdSerializers,
    level: 'debug',
    src: true,
});
