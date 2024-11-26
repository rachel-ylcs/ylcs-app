import { createHttpClient } from './common';
import { parseAsctimeDate } from '../utils/util';

const client = createHttpClient('https://m.weibo.cn', {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 Mobile Safari/537.36',
    },
    afterResponse(response) {
        return response.json();
    },
    throwError: true,
});

export interface WeiboUser {
    /** 用户ID */
    userId: string;
    /** 昵称 */
    name: string;
    /** 头像 */
    avatar: string;
    /** 背景图 */
    background?: string;
    /** 位置 */
    location?: string;
    /** 个性签名 */
    signature?: string;
    /** 关注数 */
    followNum?: string;
    /** 粉丝数 */
    fansNum?: string;
}

export interface WeiboAlbum {
    /** 容器ID */
    containerId: string;
    /** 标题 */
    title: string;
    /** 数量 */
    num: string;
    /** 时间 */
    time: string;
    /** 图片url */
    pic: string;
}

export interface WeiboPreview {
    /** 缩略图url */
    url: string;
    /** 原图url */
    largeUrl: string;
    /** 视频url */
    videoUrl?: string;
}

export interface WeiboCard {
    /** 编号 */
    id: string;
    /** 用户 */
    user: WeiboUser;
    /** 时间 */
    time: Date;
    /** 内容 */
    text: string;
    /** 点赞数 */
    likeNum: number;
    /** 评论数 */
    commentNum: number;
    /** 转发数 */
    repostNum: number;
    /** 图片集 */
    pictures: WeiboPreview[];
}

export interface WeiboCommentItem {
    /** 用户 */
    user: WeiboUser;
    /** 时间 */
    time: Date;
    /** 内容 */
    text: string;
    /** 图片 */
    pic?: WeiboPreview;
}

export interface WeiboComment extends WeiboCommentItem {
    /** 楼中楼 */
    replies: WeiboCommentItem[];
}

export type WeiboUserStorageMap = {
    [key: string]: {
        name: string;
        containerId: string;
    }
};

const Container = {
    CHAOHUA: '10080848e33cc4065cd57c5503c2419cdea983_-_sort_time',
    searchUser(name: string): string {
        let encodeName = encodeURIComponent(name);
        return `100103type%3D3%26q%3D${encodeName}`;
    },
    weibo: (uid: string) => `107603${uid}`,
    album: (uid: string) => `107803${uid}`,
};

function parseCard(card: any): WeiboCard {
    let blogs = card.mblog;
    let user: WeiboUser = {
        userId: blogs.user.id,
        name: blogs.user.screen_name,
        avatar: blogs.user.avatar_hd,
        location: blogs.region_name?.split(' ').pop() || 'IP未知',
    };
    let time = parseAsctimeDate(blogs.created_at)!;
    let text = blogs.text;
    let likeNum = blogs.attitudes_count;
    let commentNum = blogs.comments_count;
    let repostNum = blogs.reposts_count;
    if (blogs.retweeted_status) {
        blogs = blogs.retweeted_status;
    }
    let pictures: WeiboPreview[] = [];
    if (blogs.pics) {
        for (let pic of blogs.pics) {
            pictures.push({ url: pic.url, largeUrl: pic.large.url });
        }
    } else if (blogs.page_info) {
        let pageInfo = blogs.page_info;
        if (pageInfo.type === 'video') {
            let videoPicUrl = pageInfo.page_pic.url;
            let urls = pageInfo.urls;
            let videoUrl = urls.mp4_720p_mp4 || urls.mp4_hd_mp4 || urls.mp4_ld_mp4;
            pictures.push({ url: videoPicUrl, largeUrl: videoPicUrl, videoUrl });
        }
    }
    return { id: blogs.id, user, time, text, likeNum, commentNum, repostNum, pictures };
}

function parseComment(comment: any): WeiboCommentItem {
    let user: WeiboUser = {
        userId: comment.user.id,
        name: comment.user.screen_name,
        avatar: comment.user.avatar_hd,
        location: comment.source ? comment.source.replace('来自', '') : 'IP未知',
    };
    let time = parseAsctimeDate(comment.created_at)!;
    return { user, time, text: comment.text };
}

export default {
    async searchUser(name: string): Promise<WeiboUser[]> {
        const json = await client.get(`https://m.weibo.cn/api/container/getIndex?containerid=${Container.searchUser(name)}&page_type=searchall`);
        try {
            let result: WeiboUser[] = [];
            for (let group of json.data.cards) {
                if (group.card_type !== 11) {
                    continue;
                }
                for (let card of group.card_group) {
                    if (card.card_type !== 10) {
                        continue;
                    }
                    result.push({
                        userId: card.user.id,
                        name: card.user.screen_name,
                        avatar: card.user.avatar_hd,
                    });
                }
            }
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getUserInfo(uid: string): Promise<WeiboUser | null> {
        const json = await client.get(`/api/container/getIndex?type=uid&value=${uid}`);
        try {
            let userInfo = json.data.userInfo;
            return {
                userId: userInfo.id,
                name: userInfo.screen_name,
                avatar: userInfo.avatar_hd,
                background: userInfo.cover_image_phone,
                signature: userInfo.description,
                followNum: userInfo.follow_count.toString(),
                fansNum: userInfo.followers_count_str || userInfo.followers_count.toString(),
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getUserAlbum(uid: string): Promise<WeiboAlbum[]> {
        const json = await client.get(`/api/container/getIndex?type=uid&value=$uid&containerid=${Container.album(uid)}`);
        try {
            let result: WeiboAlbum[] = [];
            for (let card of json.data.cards) {
                if (!card.itemid.endswith('albumeach')) {
                    continue;
                }
                for (let album of card.card_group) {
                    if (album.card_type === '8') {
                        let schemeUrl = new URL(album.scheme);
                        result.push({
                            containerId: schemeUrl.searchParams.get('containerid')!,
                            title: album.title_sub,
                            num: album.desc1,
                            time: album.desc2,
                            pic: album.pic,
                        });
                    }
                }
            }
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getUserAlbumPics(containerId: string, page: number, limit: number): Promise<{
        count: number;
        pics: WeiboPreview[];
    }> {
        const json = await client.get(`/api/container/getSecond?containerid=${containerId}&count=${limit}&page=${page}`);
        try {
            let data = json.data;
            let result: WeiboPreview[] = [];
            for (let card of data.cards) {
                for (let pic of card.pics) {
                    result.push({ url: pic.pic_middle, largeUrl: pic.pic_ori });
                }
            }
            return {
                count: data.count,
                pics: result.slice(0, limit),
            };
        } catch (error) {
            console.error(error);
            return {
                count: 0,
                pics: [],
            };
        }
    },

    async getWeibo(uid: string, containerId: string): Promise<WeiboCard[]> {
        const json = await client.get(`/api/container/getIndex?type=uid&value=${uid}&containerid=${containerId}`);
        try {
            let result: WeiboCard[] = [];
            for (let card of json.data.cards) {
                if (card.card_type !== 9) { // 非微博类型
                    continue;
                }
                result.push(parseCard(card));
            }
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getAllWeibo(weiboUsers: WeiboUserStorageMap): Promise<WeiboCard[]> {
        let result: WeiboCard[] = [];
        for (let [key, value] of Object.entries(weiboUsers)) {
            result = result.concat(await this.getWeibo(key, value.containerId));
        }
        result.sort((a, b) => {
            let date1 = new Date(a.time);
            let date2 = new Date(b.time);
            return date2.getTime() - date1.getTime();
        });
        return result;
    },

    async getDetails(id: string): Promise<WeiboComment[]> {
        const json = await client.get(`/comments/hotflow?id=${id}&mid=${id}`);
        try {
            let result: WeiboComment[] = [];
            for (let item of json.data.data) {
                let comment: WeiboComment = { ...parseComment(item), replies: [] };
                if (item.pic) {
                    comment.pic = {
                        url: item.pic.url,
                        largeUrl: item.pic.large.url,
                    };
                }
                if (Array.isArray(item.comments)) {
                    for (let item2 of item.comments) {
                        comment.replies.push(parseComment(item2));
                    }
                }
                result.push(comment);
            }
            return result;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getChaohua(sinceId: number): Promise<{
        newSinceId: number;
        cards: WeiboCard[];
    }> {
        const json = await client.get(`/api/container/getIndex?containerid=${Container.CHAOHUA}&type=uid&value=2266537042&since_id=${sinceId}`);
        try {
            let data = json.data;
            let result: WeiboCard[] = [];
            for (let card of data.cards) {
                try {
                    if (card.card_type === '11') {
                        if (card.card_group) {
                            for (let subCard of card.card_group) {
                                result.push(parseCard(subCard));
                            }
                        }
                    } else if (card.card_type === '9') {
                        result.push(parseCard(card));
                    }
                } catch (_) {}
            }
            return {
                newSinceId: data.pageInfo.since_id,
                cards: result,
            };
        } catch (error) {
            console.error(error);
            return {
                newSinceId: 0,
                cards: [],
            };
        }
    },
};
