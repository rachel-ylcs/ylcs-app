import React, { useRef, useEffect } from 'react';
import { requireNativeComponent, UIManager, findNodeHandle } from 'react-native';

const NativeMusicView = requireNativeComponent('RNMusicView');

const createFragment = (viewId) =>
    UIManager.dispatchViewManagerCommand(
        viewId,
        UIManager.RNMusicView.Commands.create.toString(),
        [viewId],
    );

export default function MusicPlayer() {
    const ref = useRef(null);

    useEffect(() => {
        const viewId = findNodeHandle(ref.current);
        createFragment(viewId);
    }, []);

    return (
        <NativeMusicView
            ref={ref}
            style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
        />
    );
}
