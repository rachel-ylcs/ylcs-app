import NewsPage from './pages/News';
import DiscoveryPage from './pages/Discovery';
import MusicPage from './pages/Music';
import WorldPage from './pages/World';
import MePage from './pages/Me';
import WeiboDetailPage from './pages/WeiboDetail';
import WeiboUserPage from './pages/WeiboUser';
import TopicDetailPage from './pages/TopicDetail';
import UserPage from './pages/User';
import PostTopicPage from './pages/PostTopic';
import GalleryPage from './pages/Gallery';
import ScanCodePage from './pages/ScanCode';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';
import MailboxPage from './pages/Mailbox';
import EventDetailPage from './pages/EventDetail';
import PreviewPage from './pages/Preview';
import WebBrowserPage from './pages/WebBroswer';

export const navs = [
    {
        name: 'News',
        title: '资讯',
        icon: {
            inactive: require('./assets/images/news_inactive.webp'),
            active: require('./assets/images/news_active.webp'),
        },
        component: NewsPage,
    },
    {
        name: 'Discovery',
        title: '发现',
        icon: {
            inactive: require('./assets/images/discovery_inactive.webp'),
            active: require('./assets/images/discovery_active.webp'),
        },
        component: DiscoveryPage,
    },
    {
        name: 'Music',
        title: '听歌',
        icon: {
            inactive: require('./assets/images/music_inactive.webp'),
            active: require('./assets/images/music_active.webp'),
        },
        component: MusicPage,
    },
    {
        name: 'World',
        title: '世界',
        icon: {
            inactive: require('./assets/images/world_inactive.webp'),
            active: require('./assets/images/world_active.webp'),
        },
        component: WorldPage,
    },
    {
        name: 'Me',
        title: '小银子',
        icon: Math.random() * 100 > 1 ? {
            inactive: require('./assets/images/me_inactive.webp'),
            active: require('./assets/images/me_active.webp'),
        } : {
            inactive: require('./assets/images/dog_inactive.webp'),
            active: require('./assets/images/dog_active.webp'),
        },
        component: MePage,
    },
];

export const routes = [
    {
        name: 'WeiboDetail',
        option: { title: '微博正文' },
        component: WeiboDetailPage,
    },
    {
        name: 'WeiboUser',
        option: { title: '微博用户' },
        component: WeiboUserPage,
    },
    {
        name: 'TopicDetail',
        option: { title: '帖子正文' },
        component: TopicDetailPage,
    },
    {
        name: 'User',
        option: { title: '用户' },
        component: UserPage,
    },
    {
        name: 'PostTopic',
        option: { title: '发图文' },
        component: PostTopicPage,
    },
    {
        name: 'Gallery',
        option: { title: '美图' },
        component: GalleryPage,
    },
    {
        name: 'ScanCode',
        option: { title: '扫码' },
        component: ScanCodePage,
    },
    {
        name: 'Settings',
        option: { title: '设置' },
        component: SettingsPage,
    },
    {
        name: 'Login',
        option: { title: '登录' },
        component: LoginPage,
    },
    {
        name: 'Mailbox',
        option: { title: '邮箱' },
        component: MailboxPage,
    },
    {
        name: 'EventDetail',
        option: { title: '活动详情' },
        component: EventDetailPage,
    },
    {
        name: 'Preview',
        option: { title: '预览', headerShown: false },
        component: PreviewPage,
    },
    {
        name: 'WebBrowser',
        option: { title: '' },
        component: WebBrowserPage,
    },
];
