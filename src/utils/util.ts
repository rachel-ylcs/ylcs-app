/**
 * 微博使用 ANSI C's asctime() format
 */
export function parseAsctimeDate(dateStr: string): Date | null {
    const regex = /(\w{3}) (\w{3}) (\d{2}) (\d{2}):(\d{2}):(\d{2}) ([+-]\d{4}) (\d{4})/;
    let match = dateStr.match(regex);
    if (!match) {
        return null;
    }
    let [_, _dayOfWeek, month, day, hour, minute, second, _timezone, year] = match;
    const months: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    let date = new Date(parseInt(year), months[month], parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
    // let tzOffset = parseInt(timezone.slice(0, 3)) * 60 + parseInt(timezone.slice(3));
    // date.setUTCMinutes(date.getUTCMinutes() - tzOffset);
    return date;
}

/**
 * yyyy-MM-dd
 */
export function formatDate(date: Date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * HH:mm:ss
 */
export function formatTime(date: Date) {
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * yyyy-MM-dd HH:mm:ss
 */
export function formatDateTime(date: Date) {
    return `${formatDate(date)} ${formatTime(date)}`;
}

export const Links = {
    qq: (uid: string) => `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${uid}&card_type=person&source=qrcode`,
    qqGroup: (gid: string) => `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${gid}&card_type=group&source=qrcode`,
    taobao: (shopId: string) => `taobao://shop.m.taobao.com/shop/shop_index.htm?shop_id=${shopId}`,
    showstart: (mlink: string) => mlink,
    damai: (id: string) => `https://m.damai.cn/shows/item.html?itemId=${id}`,
    maoyan: (id: string) => `https://show.maoyan.com/qqw#/detail/${id}`,
};
