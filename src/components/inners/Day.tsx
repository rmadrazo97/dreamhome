import React, { memo, useCallback } from 'react';
import {
    StyleSheet,
    Image,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import * as _ from 'lodash';

import { getThemedColors } from '../../helpers/Theme';
import { fomartCurrOut } from '../../helpers/currency';
import TextBold from '../ui/TextBold';
import TextRegular from '../ui/TextRegular';
import TextMedium from '../ui/TextMedium';

// Types
interface DayMarking {
    notPast?: boolean;
    disabled?: boolean;
    selected?: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    inPeriod?: boolean;
    singleDay?: boolean;
    prmeta?: string | number;
}

interface DayProps {
    state?: 'disabled' | 'today' | '';
    marking?: DayMarking;
    markingType?: 'dot' | 'period' | 'multi-dot' | 'multi-period' | 'custom';
    theme?: any;
    onPress?: (date: any) => void;
    onLongPress?: (date: any) => void;
    date?: any;
    style?: ViewStyle | TextStyle | ImageStyle;
    children?: React.ReactNode;
}

// Utility function
function shouldUpdate(a: any, b: any, paths: string[]): boolean {
    for (let i = 0; i < paths.length; i++) {
        const equals = _.isEqual(_.get(a, paths[i]), _.get(b, paths[i]));
        if (!equals) {
            return true;
        }
    }
    return false;
}

const Day: React.FC<DayProps> = memo(({
    state,
    marking,
    markingType,
    theme,
    onPress,
    onLongPress,
    date,
    style,
    children
}) => {
    const colors = getThemedColors() || {};

    const handleDayPress = useCallback(() => {
        if (onPress && date) {
            onPress(date);
        }
    }, [onPress, date]);

    // Extract marking properties with proper type checking
    const notPast = marking?.notPast === true;
    const disabled = marking?.disabled === true;
    const selected = marking?.selected === true;
    const startingDay = marking?.startingDay === true;
    const endingDay = marking?.endingDay === true;
    const inPeriod = marking?.inPeriod === true;
    const singleDay = marking?.singleDay === true;
    const prMeta = marking?.prmeta || '';

    // Build styles
    let cusStyle: ViewStyle[] = [{}];
    let dayStyle: TextStyle = {};
    let metaStyle: TextStyle = { color: colors.addressText };

    if (state === 'today') {
        cusStyle = [
            ...cusStyle,
            {
                borderTopLeftRadius: 22,
                borderBottomLeftRadius: 22,
                borderTopRightRadius: 22,
                borderBottomRightRadius: 22,
                borderWidth: 1,
                borderColor: '#000',
            }
        ];
        if (disabled) {
            cusStyle = [...cusStyle, { borderColor: colors.separator }];
        }
    }

    if (selected) {
        cusStyle = [...cusStyle, { backgroundColor: colors.appColor, borderWidth: 0 }];
        dayStyle = { color: '#FFF' };
        metaStyle = { color: '#FFF' };
    }

    if (inPeriod) {
        cusStyle = [...cusStyle, { backgroundColor: colors.appColor }];
        dayStyle = { color: '#FFF' };
        metaStyle = { color: '#FFF' };
    }

    // Past dates
    if (!notPast) {
        dayStyle = { color: colors.pastDay };
    }

    if (startingDay) {
        cusStyle = [
            ...cusStyle,
            {
                borderTopLeftRadius: 22,
                borderBottomLeftRadius: 22,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
            }
        ];
    }

    if (endingDay) {
        cusStyle = [
            ...cusStyle,
            {
                borderTopRightRadius: 22,
                borderBottomRightRadius: 22,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
            }
        ];
    }

    if (singleDay) {
        cusStyle = [...cusStyle, { borderRadius: 22 }];
    }

    if (disabled) {
        dayStyle = { color: colors.unavailableDay };
    }

const isDisabled = disabled || !notPast;

    return (
        <TouchableOpacity
            style={[styles.container, ...cusStyle, style]}
            onPress={handleDayPress}
            disabled={isDisabled}
        >
            {isDisabled ? (
                <TextMedium style={[styles.day, { color: colors.backBtn }, dayStyle]}>
                    {String(children)}
                </TextMedium>
            ) : (
                <TextBold style={[styles.day, dayStyle]}>
                    {String(children)}
                </TextBold>
            )}
            
            {!disabled && prMeta !== '' && (
                <TextRegular style={[styles.meta, { color: colors.addressText }, metaStyle]}>
                    {fomartCurrOut(prMeta)}
                </TextRegular>
            )}

            {disabled && (
                <Image
                    style={styles.disabledIcon}
                    source={require('../../../assets/icons/date_disabled.png')}
                />
            )}
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    return !shouldUpdate(prevProps, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress', 'theme']);
});

Day.displayName = 'Day';

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    day: {
        textAlign: 'center',
        fontSize: 13,
    } as TextStyle,
    meta: {
        textAlign: 'center',
        fontSize: 9,
    } as TextStyle,
    disabledIcon: {
        position: 'absolute',
        width: 15,
        height: 15,
    } as ImageStyle,
});

export default Day;
