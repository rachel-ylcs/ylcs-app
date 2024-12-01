import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import Marking from 'react-native-calendars/src/calendar/day/marking';
import { SolarDay, LunarMonth, SolarFestival } from 'tyme4ts';

LocaleConfig.locales['zh'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    amDesignator: 'AM',
    pmDesignator: 'PM',
};
LocaleConfig.defaultLocale = 'zh';

LunarMonth.NAMES[10] = '腊月';
LunarMonth.NAMES[11] = '冬月';
SolarFestival.NAMES = ['元旦', '妇女节', '植树节', '劳动节', '青年节', '儿童节', '建党节', '建军节', '教师节', '国庆节'];

const styles = StyleSheet.create({
    day: {
        height: 48,
        alignItems: 'center',
    },
    today: {
        borderBottomColor: 'green',
        borderBottomWidth: 1,
    },
    dayText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    daySubText: {
        height: 16,
        textAlignVertical: 'center',
        fontSize: 12,
        color: 'black',
    },
    holidayText: {
        color: 'deeppink',
    },
    disabledText: {
        color: 'lightgray',
    },
    selectedText: {
        color: 'steelblue',
    },
    todayText: {
        color: 'green',
    },
    inactiveText: {
        color: 'lightgray',
    },
});

function getLunarOrFestival(date) {
    let solarDay = SolarDay.fromYmd(date.year, date.month, date.day);
    let lunarDay = solarDay.getLunarDay();

    // 计算休息日和调休
    let holiday = solarDay.getLegalHoliday();
    let weekIndex = solarDay.getWeek().getIndex();
    let weekend = weekIndex === 6 || weekIndex === 0;
    if (holiday) {
        weekend = !holiday.isWork();
    }

    // 查询公历节日
    let festival = solarDay.getFestival();
    if (festival) {
        return [festival.getName(), weekend];
    }

    // 查询农历节日
    festival = lunarDay.getFestival();
    if (festival) {
        return [festival.getName(), weekend];
    }

    // 查询二十四节气
    let jieqi = solarDay.getTerm();
    if (jieqi && jieqi.getJulianDay().getSolarDay().equals(solarDay)) {
        return [jieqi.getName(), weekend];
    }

    // 如果为初一则返回农历月名称
    if (lunarDay.getDay() === 1) {
        return [lunarDay.getLunarMonth().getName(), weekend];
    }

    // 返回农历日名称
    return [lunarDay.getName(), weekend];
}

export function CalendarDay(props) {
    const { theme, date, onPress, onLongPress, markingType, marking, state, children } = props;
    const [name, isWeekend] = getLunarOrFestival(date);

    const isSelected = marking?.selected !== undefined ? marking.selected : state === 'selected';
    const isDisabled = marking?.disabled !== undefined ? marking.disabled : state === 'disabled';
    const isInactive = marking?.inactive !== undefined ? marking.inactive : state === 'inactive';
    const isToday = marking?.today !== undefined ? marking.today : state === 'today';

    const textStyles = [];
    if (isWeekend) {
        textStyles.push(styles.holidayText);
    }
    if (isDisabled) {
        textStyles.push(styles.disabledText);
    }
    if (isSelected || marking) {
        textStyles.push(styles.selectedText);
    }
    if (isToday) {
        textStyles.push(styles.todayText);
    }
    if (isInactive) {
        textStyles.push(styles.inactiveText);
    }

    const renderMarking = () => {
        const { marked, dotColor, dots, periods } = marking || {};

        return (
            <Marking
                type={markingType}
                theme={theme}
                marked={markingType === Marking.markings.MULTI_DOT ? true : marked}
                selected={isSelected}
                disabled={isDisabled}
                inactive={isInactive}
                today={isToday}
                dotColor={dotColor}
                dots={dots}
                periods={periods}
            />
        );
    };

    return (
        <TouchableWithoutFeedback onPress={(e) => onPress?.(date)} onLongPress={(e) => onLongPress?.(date)}>
            <View style={[styles.day, isToday ? styles.today : undefined]}>
                <Text style={[styles.dayText, textStyles]}>{children}</Text>
                <Text style={[styles.daySubText, textStyles]} adjustsFontSizeToFit={true} numberOfLines={1}>{marking?.title ?? name}</Text>
                {renderMarking()}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default function EventCalendar(props) {
    const [width, setWidth] = useState();

    return (
        <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
            {width && <CalendarList
                key={width}
                theme={{
                    'textSectionTitleColor': 'black',
                    'stylesheet.calendar.header': {
                        header: {
                            flexDirection: 'row',
                            paddingHorizontal: 0,
                            marginTop: 6,
                        },
                        monthText: {
                            fontSize: 18,
                            color: 'black',
                            margin: 5,
                        },
                    },
                }}
                monthFormat="yyyy年MM月"
                hideArrows={true}
                // renderHeader={}
                dayComponent={CalendarDay}
                firstDay={1}
                hideExtraDays={false}
                showSixWeeks={true}
                markedDates={props.markedDates}
                onDayPress={props.onDayPress}
                calendarWidth={width}
                staticHeader={true}
                horizontal={true}
                pagingEnabled={true}
            />}
        </View>
    );
}
