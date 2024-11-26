import React, { useState, useEffect, useMemo } from 'react';
import { Image } from 'react-native';
import _ from 'lodash';

export default function AdaptiveImage(props) {
    const { source, defaultSource } = props;

    let defaultState = { width: 0, height: 0 };
    if (defaultSource) {
        let assetSource = Image.resolveAssetSource(defaultSource);
        defaultState.width = assetSource.width;
        defaultState.height = assetSource.height;
    }
    const [dimensions, setDimensions] = useState(defaultState);

    useEffect(() => {
        let cancelled = false;
        if (source?.uri) {
            Image.getSize(source.uri, (width, height) => {
                if (cancelled) {
                    return;
                }
                setDimensions({ width, height });
            });
        } else {
            let assetSource = Image.resolveAssetSource(source);
            setDimensions({ width: assetSource.width, height: assetSource.height });
        }
        return () => {
            cancelled = true;
        };
    }, [source]);

    const size = useMemo(() => {
        const { width, height } = dimensions;
        if (width === 0 || height === 0) {
            return {};
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

    return <Image {...props} style={[size, props.style]} />;
}
