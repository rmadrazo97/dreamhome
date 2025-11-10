import React, { useState, useMemo, useCallback } from 'react';
import { ThemeColors } from '../../types';
import {
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import DayCom from './Day';
import moment from 'moment';
import { mediumFontFamily } from '../../constants/Colors';

// Types
interface DateSelection {
    dateString: string;
    timestamp: number;
    year: number;
    month: number;
    day: number;
    metas?: {
        mbApps?: string;
        [key: string]: any;
    };
}

interface AvailabilityData {
    available?: { [key: string]: any };
    bookingType?: string;
    checkAvailable?: boolean;
    months_available?: number;
}

interface AvailabilityProps {
    availabilityData: AvailabilityData;
    onDatesSelect: (dates: DateSelection[]) => void;
    apColors: ThemeColors;
    style?: ViewStyle;
}

interface AvailabilityState {
    vals: DateSelection[];
}

const Availability: React.FC<AvailabilityProps> = ({
    availabilityData,
    onDatesSelect,
    apColors,
    style
}) => {
    const [state, setState] = useState<AvailabilityState>({
        vals: []
    });

    const { available, bookingType, checkAvailable, months_available } = availabilityData;

    const getMarkingType = useCallback((bkType?: string) => {
        if (bkType === 'hotel_rooms') return 'period';
        return 'dot';
    }, []);

    const getMonthNum = useCallback((month: number) => {
        const monthNum = month + 1;
        return monthNum < 10 ? `0${monthNum}` : monthNum.toString();
    }, []);

    const getDateNum = useCallback((date: number) => {
        return date < 10 ? `0${date}` : date.toString();
    }, []);

    const getCalendarDates = useCallback((modify: number) => {
        const dates: string[] = [];
        const currentDate = moment();
        const futureMonth = moment(currentDate).add(modify, 'M');
        const futureMonthEnd = moment(futureMonth).endOf('month');

        if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
            futureMonth.add(1, 'd');
        }

        for (let i = 0; i < 1000; i++) {
            const temp = moment(currentDate).add(i, 'd');
            if (temp.isAfter(futureMonthEnd)) break;
            dates.push(temp.format('YYYY-MM-DD'));
        }
        return dates;
    }, []);

    const onDayPress = useCallback((day: DateSelection) => {
        const tempDay = { ...day };
        
        // Add metas to day if available
        if (checkAvailable && available && available[day.dateString]) {
            tempDay.metas = available[day.dateString];
        }

        const markingType = getMarkingType(bookingType);
        let { vals } = state;

        if (markingType === 'period') {
            if (vals.length === 1) {
                const val1 = vals[0];
                if (day.timestamp <= val1.timestamp) {
                    vals = [tempDay];
                } else {
                    vals.push(tempDay);
                }
            } else {
                vals = [tempDay];
            }
        } else {
            vals = [tempDay];
        }

        onDatesSelect(vals);
        setState({ vals });
    }, [state, checkAvailable, available, bookingType, getMarkingType, onDatesSelect]);

    const monthsAvailable = useMemo(() => {
        const months = parseInt(String(months_available || 2));
        return isNaN(months) ? 2 : months - 1;
    }, [months_available]);

    const markedDates = useMemo(() => {
        const markingType = getMarkingType(bookingType);
        const { vals } = state;
        const markedDates: { [key: string]: any } = {};
        const calDates = getCalendarDates(monthsAvailable);

        // Perform date check for available check
        if (checkAvailable) {
            if (calDates.length) {
                calDates.forEach(cald => {
                    if (available && available[cald]) {
                        markedDates[cald] = { notPast: true, available: true };
                        const metas = available[cald];
                        if (metas && metas.mbApps && metas.mbApps !== '') {
                            markedDates[cald].prmeta = metas.mbApps;
                        }
                    } else {
                        markedDates[cald] = { notPast: true, disabled: true };
                    }
                });
            }
        } else {
            if (calDates.length) {
                calDates.forEach(cald => {
                    markedDates[cald] = { notPast: true };
                });
            }
        }

        // Handle selected dates
        if (Array.isArray(vals) && vals.length) {
            const val1 = vals[0];
            if (markingType === 'period') {
                markedDates[val1.dateString] = {
                    ...markedDates[val1.dateString],
                    selected: true,
                    startingDay: true,
                    endingDay: false
                };

                if (vals.length === 2) {
                    const val2 = vals[1];
                    const val1Year = val1.year;
                    const val1Month = val1.month;
                    const val1Day = val1.day;

                    // Loop for inside dates
                    for (let i = 1; i <= 365; i++) {
                        const temp = new Date(val1Year, val1Month - 1, val1Day + i);
                        if (temp.getTime() < val2.timestamp) {
                            const tmpY = temp.getFullYear();
                            const tmpM = getMonthNum(temp.getMonth());
                            const tmpD = getDateNum(temp.getDate());
                            const dateKey = `${tmpY}-${tmpM}-${tmpD}`;

                            markedDates[dateKey] = {
                                ...markedDates[dateKey],
                                inPeriod: true
                            };
                        } else {
                            break;
                        }
                    }

                    markedDates[val2.dateString] = {
                        ...markedDates[val2.dateString],
                        selected: true,
                        startingDay: false,
                        endingDay: true
                    };
                }
            } else {
                markedDates[val1.dateString] = {
                    ...markedDates[val1.dateString],
                    selected: true,
                    singleDay: true
                };
            }
        }

        return markedDates;
    }, [state, checkAvailable, available, bookingType, getMarkingType, monthsAvailable, getCalendarDates, getMonthNum, getDateNum]);

    const calendarTheme = useMemo(() => ({
        appColor: apColors.appColor,
        addressText: apColors.addressText,
        separator: apColors.separator,
        pastDay: apColors.pastDay,
        unavailableDay: apColors.unavailableDay,
        backBtn: apColors.backBtn,
        calendarBackground: apColors.secondBg,
        dayTextColor: apColors.tText,
        monthTextColor: apColors.tText,
        textDayFontFamily: mediumFontFamily,
        textMonthFontFamily: mediumFontFamily,
        textDayHeaderFontFamily: mediumFontFamily,
    }), [apColors]);

    return (
        <View style={[styles.container, { backgroundColor: apColors.appBg }, style]}>
            <CalendarList
                dayComponent={DayCom}
                pastScrollRange={0}
                futureScrollRange={monthsAvailable}
                scrollEnabled={true}
                showScrollIndicator={false}
                onDayPress={onDayPress}
                monthFormat="MMMM yyyy"
                hideExtraDays={true}
                disableMonthChange={true}
                firstDay={1}
                hideDayNames={false}
                showWeekNumbers={false}
                markedDates={markedDates}
                markingType={getMarkingType(bookingType)}
                theme={calendarTheme}
                calendarStyle={{ height: 380 }}
                style={{ height: '100%' }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
});

export default Availability;