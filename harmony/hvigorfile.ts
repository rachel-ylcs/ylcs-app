import * as fs from 'fs';
import { appTasks } from '@ohos/hvigor-ohos-plugin';

const appConfig = JSON.parse(fs.readFileSync('../app.json'));
console.log(`Building ylcs ${appConfig.version} (${appConfig.versionCode})`);

export default {
    system: appTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    plugins: [],       /* Custom plugin to extend the functionality of Hvigor. */
    config: {          /* https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hvigor-config-ohos-guide-V5 */
        ohos: {
            overrides: {
                appOpt: {
                    versionCode: appConfig.versionCode,
                    versionName: appConfig.version
                }
            }
        }
    }
}
