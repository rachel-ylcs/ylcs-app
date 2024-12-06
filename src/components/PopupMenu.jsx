import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableHighlight, Modal, useWindowDimensions } from 'react-native';

const styles = StyleSheet.create({
    mask: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(127, 127, 127, 0.2)',
    },
    menu: {
        position: 'absolute',
        backgroundColor: '#424242',
        borderRadius: 5,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#606060',
        borderTopWidth: 0.25,
        borderBottomColor: '#606060',
        borderBottomWidth: 0.25,
    },
    itemText: {
        fontSize: 18,
        color: 'white',
        paddingHorizontal: 40,
        paddingVertical: 20,
    },
});

export default function PopupMenu({ children, anchor, visible, onClose }) {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [anchorSize, setAnchorSize] = useState({ height: 0, width: 0, left: 0, top: 0 });
    const [menuSize, setMenuSize] = useState({ height: 0, width: 0 });
    const containerRef = useRef(null);

    if (anchorSize.height === 0 && anchorSize.width === 0) {
        containerRef.current?.measureInWindow?.((left, top, width, height) => {
            setAnchorSize({ height, width, left, top });
        });
    }

    const menuPosition = {
        top: anchorSize.top + anchorSize.height,
        left: anchorSize.left + anchorSize.width / 2 - menuSize.width / 2,
    };

    if (menuPosition.top + menuSize.height > windowHeight) {
        menuPosition.top = anchorSize.top - menuSize.height;
    }

    if (menuPosition.left < 0) {
        menuPosition.left = 0;
    }

    if (menuPosition.left + menuSize.width > windowWidth) {
        menuPosition.left = windowWidth - menuSize.width;
    }

    menuPosition.top += 15;
    menuPosition.left -= 15;

    return (
        <View ref={containerRef} collapsable={false}>
            {anchor}

            <Modal visible={visible} onRequestClose={onClose} animationType="fade" transparent>
                <TouchableWithoutFeedback onPress={onClose} accessible={false}>
                    <View style={styles.mask}>
                        <View style={[styles.menu, menuPosition]} onLayout={(e) => {
                            const { width, height } = e.nativeEvent.layout;
                            setMenuSize({ width, height });
                        }}>
                            {children}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

PopupMenu.Item = ({ icon, text, onPress }) => {
    return (
        <TouchableHighlight underlayColor="#303030" onPress={onPress}>
            <View style={styles.item}>
                {icon}
                <Text style={styles.itemText}>{text}</Text>
            </View>
        </TouchableHighlight>
    );
};
