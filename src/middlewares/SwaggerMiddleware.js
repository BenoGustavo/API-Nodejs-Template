import swaggerUI from 'swagger-ui-express';
import yamljs from 'yamljs';
import path from 'path';


const swaggerSpec = yamljs.load(path.resolve(__dirname, '../../swagger.yaml'));
/**
 * Configures the Swagger UI
 */
export const swaggerMiddleware = [swaggerUI.serve, swaggerUI.setup(swaggerSpec)];