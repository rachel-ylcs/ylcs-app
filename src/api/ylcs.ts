import { ImageRequireSource, Platform } from 'react-native';
import { createHttpClient } from './common';
import { encryptStorage } from '../store';
import { config } from '../config';
import { name as appName, version as appVer } from '../../app.json';

const client = createHttpClient(config.API_BASE_URL, {
    headers: {
        'User-Agent': `${appName}/${appVer} (${Platform.OS}; ${Platform.Version})`,
    },
    beforeRequest(url, data, init) {
        if (init.needAuth) {
            let headers = init.headers as Record<string, string>;
            data.token = headers.Authorization = encryptStorage.getString('token') || '';
        }
        return true;
    },
    async afterResponse(response) {
        let json = await response.json();
        if (json.code !== Code.SUCCESS) {
            throw new Error(json.msg);
        }
        return json;
    },
    throwError: true,
});

enum Code {
    SUCCESS = 0,
    FORBIDDEN = 1,
    UNAUTHORIZED = 2,
    FAILED = 3,
}

export interface Result<T> {
    code: Code;
    msg: string;
    data?: T;
}

export interface PhotoFolder {
    author: string;
    folders?: Record<string, PhotoFolder>;
    files?: string[];
    thumbnails?: string[];
}

export interface Login {
    token: string;
}

export interface UpdateToken {
    token: string;
}

export interface UserInfo {
    /** ID */
    uid: number;
    /** 昵称 */
    name: string;
    /** 邀请人 */
    inviterName?: string;
    /** 权限 */
    privilege?: number;
    /** 个性签名 */
    signature: string;
    /** 头衔 */
    label: string;
    /** 银币 */
    coin: number;
    /** 主题 */
    topics?: TopicPreview[];
}

export enum Permission {
    /** 备份 */
    BACKUP = 1,
    /** 美图 */
    ALBUM = 2,
    /** 话题 */
    TOPIC = 4,
    /** 保留 */
    UNUSED = 8,
    /** 账号管理 */
    ACCOUNT_ADMIN = 16,
    /** 话题管理 */
    TOPIC_ADMIN = 32,
    /** 日历管理 */
    CALENDAR_ADMIN = 64,
}

export class User implements UserInfo {
    uid!: number;
    name!: string;
    inviterName?: string;
    privilege?: number;
    signature!: string;
    label!: string;
    coin!: number;
    topics?: TopicPreview[];

    constructor(userInfo: UserInfo) {
        Object.assign(this, userInfo);
        this.topics = userInfo.topics?.map((topic) => new TopicPreview(topic));
    }

    get avatar() {
        return `${config.API_BASE_URL}/public/users/${this.uid}/avatar.webp`;
    }

    get wall() {
        return `${config.API_BASE_URL}/public/users/${this.uid}/wall.webp`;
    }

    get level() {
        return getLevelFromCoin(this.coin);
    }

    hasPermission(perm: Permission) {
        return (this.privilege! & perm) !== 0;
    }
}

export enum MailType {
    INFO = 1,
    CONFIRM = 2,
    DECISION = 4,
    INPUT = 8,
}

export interface Mail {
    mid: number;
    uid: number;
    ts: string;
    type: MailType;
    processed: boolean;
    title: string;
    content: string;
}

export interface Playlist {
    name: string;
    items: string[];
}

export class TopicPreview {
    tid!: number;
    uid!: number;
    name!: string;
    title!: string;
    pic!: string;
    isTop!: boolean;
    commentNum!: number;
    coinNum!: number;

    constructor(topic: any) {
        Object.assign(this, topic);
    }

    get picUrl() {
        return `${config.API_BASE_URL}/public/users/${this.uid}/pics/${this.pic}.webp`;
    }

    get avatar() {
        return `${config.API_BASE_URL}/public/users/${this.uid}/avatar.webp`;
    }
}

export class Comment {
    cid!: number;
    uid!: number;
    name!: string;
    ts!: string;
    content!: string;
    isTop!: boolean;
    label!: string;
    coin!: number;

    constructor(comment: any) {
        Object.assign(this, comment);
    }

    get level() {
        return getLevelFromCoin(this.coin);
    }

    get avatar() {
        return `${config.API_BASE_URL}/public/users/${this.uid}/avatar.webp`;
    }
}

export class Topic {
    tid!: number;
    ts!: string;
    title!: string;
    content!: string;
    pics!: string[];
    isTop!: boolean;
    coinNum!: number;
    commentNum!: number;
    uid!: number;
    name!: string;
    label!: string;
    coin!: number;
    comments!: Comment[];

    constructor(topic: any) {
        Object.assign(this, topic);
        this.comments = topic.comments.map((comment: any) => new Comment(comment));
    }

    get level() {
        return getLevelFromCoin(this.coin);
    }

    get avatar() {
        return `${config.API_BASE_URL}/public/users/${this.uid}/avatar.webp`;
    }

    picUrl(pic: string) {
        return `${config.API_BASE_URL}/public/users/${this.uid}/pics/${pic}.webp`;
    }
}

export interface PostTopic {
    tid: number;
    pic?: string;
}

export interface PostComment {
    cid: number;
    ts: string;
}

export interface ShowActivityPreview {
    ts: string;
    title: string;
}

export class ShowActivity implements ShowActivityPreview {
    ts!: string;
    title!: string;
    content!: string;
    pics!: string[];
    showstart?: string;
    damai?: string;
    maoyan?: string;

    constructor(activity: any) {
        Object.assign(this, activity);
    }

    picUrl(pic: string) {
        return `${config.API_BASE_URL}/public/activity/${pic}.webp`;
    }
}

// 喜欢我们 anyscript 吗
function parsePhotoFolder(folder: any, author?: any) {
    const IMG_HOST_URL = 'https://img.picgo.net/';

    if (!folder.author) {
        folder.author = author;
    }
    if (folder.folders) {
        for (let key in folder.folders) {
            folder.folders[key] = parsePhotoFolder(folder.folders[key], folder.author);
        }
    }
    if (folder.files) {
        let files = folder.files as string[];
        folder.files = files.map(file => IMG_HOST_URL + file);
        folder.thumbnails = files.map(file => {
            let indexOfDot = file.lastIndexOf('.');
            if (indexOfDot > -1) {
                return `${IMG_HOST_URL}${file.slice(0, indexOfDot)}.md${file.slice(indexOfDot)}`;
            } else {
                return `${IMG_HOST_URL}${file}.md`;
            }
        });
    }
    return folder;
}

export interface LevelInfo {
    level: number;
    coins: number;
    name: string;
    background: ImageRequireSource;
}

const LEVEL_BACKGROUNDS: Record<string, ImageRequireSource> = {
    fucaoweiying: require('../assets/images/level_bg/fucaoweiying.webp'),
    fenghuaxueyue: require('../assets/images/level_bg/fenghuaxueyue.webp'),
    liuli: require('../assets/images/level_bg/liuli.webp'),
    shanseyouwuzhong: require('../assets/images/level_bg/shanseyouwuzhong.webp'),
};

export const LEVELS_TABLE: LevelInfo[] = [
    { level: 1, coins: 0, name: '风露婆娑', background: LEVEL_BACKGROUNDS.fucaoweiying },
    { level: 2, coins: 5, name: '剑心琴魄', background: LEVEL_BACKGROUNDS.fucaoweiying },
    { level: 3, coins: 10, name: '梦外篝火', background: LEVEL_BACKGROUNDS.fucaoweiying },
    { level: 4, coins: 20, name: '烈火胜情爱', background: LEVEL_BACKGROUNDS.fucaoweiying },
    { level: 5, coins: 30, name: '青山撞入怀', background: LEVEL_BACKGROUNDS.fucaoweiying },
    { level: 6, coins: 50, name: '雨久苔如海', background: LEVEL_BACKGROUNDS.fenghuaxueyue },
    { level: 7, coins: 75, name: '明雪澄岚', background: LEVEL_BACKGROUNDS.fenghuaxueyue },
    { level: 8, coins: 100, name: '春风韵尾', background: LEVEL_BACKGROUNDS.fenghuaxueyue },
    { level: 9, coins: 125, name: '银河万顷', background: LEVEL_BACKGROUNDS.fenghuaxueyue },
    { level: 10, coins: 150, name: '山川蝴蝶', background: LEVEL_BACKGROUNDS.fenghuaxueyue },
    { level: 11, coins: 200, name: '薄暮忽晚', background: LEVEL_BACKGROUNDS.liuli },
    { level: 12, coins: 250, name: '沧流彼岸', background: LEVEL_BACKGROUNDS.liuli },
    { level: 13, coins: 300, name: '清荷玉盏', background: LEVEL_BACKGROUNDS.liuli },
    { level: 14, coins: 350, name: '颜如舜华', background: LEVEL_BACKGROUNDS.liuli },
    { level: 15, coins: 400, name: '逃奔风月', background: LEVEL_BACKGROUNDS.liuli },
    { level: 16, coins: 500, name: '自在盈缺', background: LEVEL_BACKGROUNDS.shanseyouwuzhong },
    { level: 17, coins: 600, name: '青鸟遁烟', background: LEVEL_BACKGROUNDS.shanseyouwuzhong },
    { level: 18, coins: 700, name: '天生妙罗帷', background: LEVEL_BACKGROUNDS.shanseyouwuzhong },
    { level: 19, coins: 800, name: '梦醒般惊蜕', background: LEVEL_BACKGROUNDS.shanseyouwuzhong },
    { level: 20, coins: 900, name: '韶华的结尾', background: LEVEL_BACKGROUNDS.shanseyouwuzhong },
];

function getLevelFromCoin(coin: number) {
    for (let i = LEVELS_TABLE.length - 1; i >= 0; i--) {
        if (coin >= LEVELS_TABLE[i].coins) {
            return LEVELS_TABLE[i];
        }
    }
    return LEVELS_TABLE[0];
}

export const CommonAPI = {
    _apiPrefix: '/common',

    async getPhotos(): Promise<Result<PhotoFolder>> {
        let json = await client.post(`${this._apiPrefix}/getPhotos`);
        if (json.code === Code.SUCCESS) {
            json.data = parsePhotoFolder(json.data);
        }
        return json;
    },

    async getServerInfo(): Promise<Result<any>> {
        return await client.post(`${this._apiPrefix}/getServerInfo`);
    },
};

export const UserAPI = {
    _apiPrefix: '/user',

    async login(name: string, pwd: string): Promise<Result<Login>> {
        return await client.post(`${this._apiPrefix}/login`, {
            name,
            pwd,
        });
    },

    async logout(): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/logoff`, {}, {
            needAuth: true,
        });
    },

    async updateToken(): Promise<Result<UpdateToken>> {
        return await client.post(`${this._apiPrefix}/updateToken`, {}, {
            needAuth: true,
        });
    },

    async register(name: string, pwd: string, inviterName: string): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/register`, {
            name,
            pwd,
            inviterName,
        });
    },

    async forgetPassword(name: string, pwd: string): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/forgotPassword`, {
            name,
            pwd,
        });
    },

    async getInfo(): Promise<Result<User>> {
        let result = await client.post(`${this._apiPrefix}/getInfo`, {}, {
            needAuth: true,
        }) as Result<any>;
        if (result.code === Code.SUCCESS) {
            result.data = new User(result.data);
        }
        return result;
    },

    async updateName(name: string): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/updateName`, {
            name,
        }, {
            needAuth: true,
        });
    },

    async updateAvatar(filename: string): Promise<Result<never>> {
        return await client.postForm(`${this._apiPrefix}/updateAvatar`, {
            avatar: filename,
        }, {
            needAuth: true,
        });
    },

    async updateSignature(signature: string): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/updateSignature`, {
            signature,
        }, {
            needAuth: true,
        });
    },

    async updateBackground(filename: string): Promise<Result<never>> {
        return await client.postForm(`${this._apiPrefix}/updateWall`, {
            wall: filename,
        }, {
            needAuth: true,
        });
    },

    async uploadPlaylist(playlist: Record<string, Playlist>): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/uploadPlaylist`, {
            playlist,
        }, {
            needAuth: true,
        });
    },

    async downloadPlaylist(): Promise<Result<Record<string, Playlist>>> {
        return await client.post(`${this._apiPrefix}/downloadPlaylist`, {}, {
            needAuth: true,
        });
    },

    async signin(): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/signin`, {}, {
            needAuth: true,
        });
    },

    async sendFeedback(content: string): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/sendFeedback`, {
            content,
        }, {
            needAuth: true,
        });
    },

    async download4KPic(): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/download4KPic`, {}, {
            needAuth: true,
        });
    },

    async getMail(): Promise<Result<Mail[]>> {
        return await client.post(`${this._apiPrefix}/getMail`, {}, {
            needAuth: true,
        });
    },

    async processMail(mid: number, confirm: boolean): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/processMail`, {
            mid,
            confirm,
        }, {
            needAuth: true,
        });
    },

    async deleteMail(mid: number): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/deleteMail`, {
            mid,
        }, {
            needAuth: true,
        });
    },

    async getProfile(uid: number): Promise<Result<User>> {
        let result = await client.post(`${this._apiPrefix}/getProfile`, {
            uid,
        }) as Result<any>;
        if (result.code === Code.SUCCESS) {
            result.data = new User(result.data);
        }
        return result;
    },

    async getLatestTopic(upper: number = 2147483647): Promise<Result<TopicPreview[]>> {
        let result = await client.post(`${this._apiPrefix}/getLatestTopic`, {
            upper,
        }) as Result<any[]>;
        if (result.code === Code.SUCCESS) {
            result.data = result.data!.map((topic) => {
                return new TopicPreview(topic);
            });
        }
        return result;
    },

    async getHotTopic(offset: number = 0): Promise<Result<TopicPreview[]>> {
        let result = await client.post(`${this._apiPrefix}/getHotTopic`, {
            offset,
        }) as Result<any[]>;
        if (result.code === Code.SUCCESS) {
            result.data = result.data!.map((topic) => {
                return new TopicPreview(topic);
            });
        }
        return result;
    },

    async getTopic(tid: number): Promise<Result<Topic>> {
        let result = await client.post(`${this._apiPrefix}/getTopic`, {
            tid,
        }) as Result<any>;
        if (result.code === Code.SUCCESS) {
            result.data = new Topic(result.data);
        }
        return result;
    },

    async postTopic(title: string, content: string, pics: _SourceUri[] = []): Promise<Result<PostTopic>> {
        let files: Record<string, _SourceUri> = {};
        pics.forEach((pic, index) => {
            files[`pic${index + 1}`] = pic;
        });
        return await client.postForm(`${this._apiPrefix}/sendTopic`, {
            title,
            content,
            ...files,
        }, {
            needAuth: true,
        });
    },

    async postComment(tid: number, content: string): Promise<Result<PostComment>> {
        return await client.post(`${this._apiPrefix}/sendComment`, {
            tid,
            content,
        }, {
            needAuth: true,
        });
    },

    async giveCoin(desUid: number, tid: number, value: number): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/sendCoin`, {
            desUid,
            tid,
            value,
        }, {
            needAuth: true,
        });
    },

    async deleteComment(tid: number, cid: number): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/deleteComment`, {
            tid,
            cid,
        }, {
            needAuth: true,
        });
    },

    async pinComment(tid: number, cid: number, type: boolean): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/updateCommentTop`, {
            tid,
            cid,
            type,
        }, {
            needAuth: true,
        });
    },

    async deleteTopic(tid: number): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/deleteTopic`, {
            tid,
        }, {
            needAuth: true,
        });
    },

    async pinTopic(tid: number, type: boolean): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/updateTopicTop`, {
            tid,
            type,
        }, {
            needAuth: true,
        });
    },

    async getActivities(): Promise<Result<ShowActivityPreview[]>> {
        return await client.post(`${this._apiPrefix}/getActivities`);
    },

    async getActivityInfo(ts: string): Promise<Result<ShowActivity>> {
        let result = await client.post(`${this._apiPrefix}/getActivityInfo`, {
            ts,
        }) as Result<any>;
        if (result.code === Code.SUCCESS) {
            result.data = new ShowActivity(result.data);
        }
        return result;
    },

    async addActivity(show: ShowActivity): Promise<Result<never>> {
        return await client.postForm(`${this._apiPrefix}/addActivity`, {
            ...show,
        }, {
            needAuth: true,
        });
    },

    async deleteActivity(ts: string): Promise<Result<never>> {
        return await client.post(`${this._apiPrefix}/deleteActivity`, {
            ts,
        }, {
            needAuth: true,
        });
    },
};
