import React, {useState, useCallback, useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

export default function FastAutoSizeImage(props) {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    const onLoad = useCallback((e) => {
        const { nativeEvent: { width, height } } = e;
        setDimensions({ width, height });
    }, []);

    const size = useMemo(() => {
        const { width, height } = dimensions;
        if (width === 0 || height === 0) {
            return { width: '100%', aspectRatio: 1 };
        }
        const { length, minLength, maxLength, autoHeight } = props;
        let longEdge = !autoHeight ? Math.max(width, height) : width;
        if (length) {
            let ratio = length / longEdge;
            return { width: width * ratio, height: height * ratio };
        } else if (maxLength) {
            let ratio = _.clamp(longEdge, minLength ?? 0, maxLength) / longEdge;
            return { width: width * ratio, height: height * ratio };
        } else {
            return { width: '100%', aspectRatio: 1 };
        }
    }, [dimensions, props]);

    console.debug('FastAutoSizeImage', props.source, dimensions, size);

    return (
        <FastImage
            resizeMode="contain"
            {...props}
            onLoad={onLoad}
            style={[size, props.style]}
        />
    );
}
