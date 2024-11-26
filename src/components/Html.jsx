import React from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderHtml, { HTMLContentModel, defaultHTMLElementModels } from 'react-native-render-html';

const customHTMLElementModels = {
    img: defaultHTMLElementModels.img.extend({
        contentModel: HTMLContentModel.mixed,
    }),
};

export default function Html(props) {
    const navigation = useNavigation();

    const renderersProps = {
        a: {
            async onPress(event, href, htmlAttribs, target) {
                if (href.startsWith('http://') || href.startsWith('https://')) {
                    navigation.navigate('WebBrowser', { url: href });
                    return;
                }
                console.log('Cannot handle URL:', href);
                // if (await Linking.canOpenURL(href)) {
                //     return Linking.openURL(href);
                // }
            },
        },
    };

    return (
        <RenderHtml
            renderersProps={renderersProps}
            customHTMLElementModels={customHTMLElementModels}
            {...props}/>
    );
}
