'use strict';

import fs from 'fs';

let configData = fs.readFileSync('config.json');
let configuration = JSON.parse(configData);
function toApiConfig(jsonConfig) {
    return {
        ...jsonConfig,
        getUrl: (path) => {
            return `http://${jsonConfig.host}:${jsonConfig.port}/${path}`
        },
        getValidAuthToken: () => {
            return jsonConfig.validAuthorization
        },
        getInvalidAuthToken: () => {
            return jsonConfig.invalidAuthorization
        }
    }
}
const apiConfig = toApiConfig(configuration);
export default apiConfig;