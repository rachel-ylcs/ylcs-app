import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Animated } from 'react-native';
import ReAnimated, { interpolate, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    tabBarItem: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    tabBarItemLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    tabBarIndicator: {
        position: 'absolute',
        left: 0,
        bottom: 8,
        height: 6,
        zIndex: -1,
        backgroundColor: 'steelblue',
        borderRadius: 3,
    },
});

const TabBarItem = forwardRef(function (props, ref) {
    return (
        <TouchableWithoutFeedback onPress={() => props.onPress(props.index)}>
            <View ref={ref} style={styles.tabBarItem}>
                <Animated.Text style={[styles.tabBarItemLabel, {
                    opacity: props.opacity,
                    fontWeight: props.fontWeight,
                }]}>
                    {props.label}
                </Animated.Text>
            </View>
        </TouchableWithoutFeedback>
    );
});

function TabBarIndicator(props) {
    const animation = useSharedValue(0);
    const inputRange = props.navigationState.routes.map((x, i) => i);

    useEffect(() => {
        const id = props.position.addListener((value) => {
            animation.value = value.value;
        });

        return () => props.position.removeListener(id);
    }, [animation, props.position]);

    const animatedStyle = useAnimatedStyle(() => {
        const width = interpolate(
            animation.value,
            inputRange,
            props.measures.map(m => m.width - 24),
        );
        const translateX = interpolate(
            animation.value,
            inputRange,
            props.measures.map(m => m.x + 12),
        );

        return {
            width,
            transform: [{ translateX }],
        };
    }, [props.measures]);

    return (
        <ReAnimated.View style={[styles.tabBarIndicator, animatedStyle]} />
    );
}

export default function TabBar(props) {
    const containerRef = useRef();
    const itemRefs = Array.from({ length: props.navigationState.routes.length })
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            .map(() => useRef());
    const [measures, setMeasures] = useState([]);
    const inputRange = props.navigationState.routes.map((x, i) => i);

    useEffect(() => {
        const measureValues = [];

        setTimeout(() => {
            itemRefs.forEach(ref => {
                if (!ref.current) {
                    return;
                }
                ref.current.measureLayout(
                    containerRef.current,
                    (x, y, width, height) => {
                        measureValues.push({ x, y, width, height });
                        if (measureValues.length === itemRefs.length) {
                            setMeasures(measureValues);
                        }
                    }
                );
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View ref={containerRef} style={[styles.tabBar, props.styles]}>
            {props.navigationState.routes.map((route, i) => {
                const opacity = props.position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(inputIndex =>
                        inputIndex === i ? 1 : 0.4,
                    ),
                });
                const fontWeight = props.navigationState.index === i ? '600' : 'normal';

                return (
                    <TabBarItem
                        key={i}
                        ref={itemRefs[i]}
                        navigationState={props.navigationState}
                        index={i}
                        label={route.title}
                        onPress={props.onIndexChange}
                        opacity={opacity}
                        fontWeight={fontWeight} />
                );
            })}
            {measures.length > 0 && (
                <TabBarIndicator
                    navigationState={props.navigationState}
                    position={props.position}
                    measures={measures} />
            )}
        </View>
    );
}
