import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  credentials: true,
  methods: ['POST', 'DELETE', 'PUT', 'PATCH', 'GET'],
  origin: '*',
};

export default corsOptions;
