import React, { useMemo } from 'react';
import { ThemeColors, Ticket } from '../../types';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    useColorScheme,
    ViewStyle,
    TextStyle,
} from 'react-native';
import getThemedColors from '../../helpers/Theme';
import { translate } from "../../helpers/i18n";
import { fomartCurrOut } from '../../helpers/currency';
import TextBold from '../../components/ui/TextBold';
import TextRegular from '../../components/ui/TextRegular';

// Types
interface TicketsProps {
    data: Ticket[];
    style?: ViewStyle;
}

interface TicketItemProps {
    data: Ticket;
}

const TicketItem: React.FC<TicketItemProps> = ({ data }) => {
    const colors = getThemedColors(useColorScheme());
    const { name, price, available } = data;

    return (
        <View style={[styles.itemWrap, { backgroundColor: colors.appColor }]}>
            <View style={styles.itemInner}>
                <View style={styles.itemLeft}>
                    <TextBold style={styles.itemTitle}>{name}</TextBold>
                    <TextRegular style={styles.itemAvai}>
                        {translate('slisting', 'ticket_available', { count: available || 0 })}
                    </TextRegular>
                </View>
                <View style={[styles.itemRight, { borderLeftColor: colors.appBg }]}>
                    <View style={[styles.itemDecorTop, { backgroundColor: colors.appBg }]} />
                    <View style={[styles.itemDecorBot, { backgroundColor: colors.appBg }]} />
                    <TextBold style={styles.priceText}>{fomartCurrOut(price)}</TextBold>
                </View>
            </View>
        </View>
    );
};

const Tickets: React.FC<TicketsProps> = ({ data, style }) => {
    const ticketItems = useMemo(() => {
        return data.map((ticket, index) => (
            <TicketItem key={ticket.id || index} data={ticket} />
        ));
    }, [data]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.childsWrap}>{ticketItems}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Container styles
    } as ViewStyle,
    childsWrap: {
        marginBottom: -15,
    } as ViewStyle,
    itemWrap: {
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 15,
    } as ViewStyle,
    itemInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    } as ViewStyle,
    itemLeft: {
        padding: 15,
        flex: 1,
    } as ViewStyle,
    itemRight: {
        padding: 15,
        borderLeftWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    } as ViewStyle,
    itemDecorTop: {
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        top: -4,
        left: -4,
    } as ViewStyle,
    itemDecorBot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        bottom: -4,
        left: -4,
    } as ViewStyle,
    itemTitle: {
        fontSize: 15,
        color: '#FFF',
        marginBottom: 10,
    } as TextStyle,
    priceText: {
        fontSize: 20,
        color: '#FFF',
    } as TextStyle,
    itemAvai: {
        fontSize: 13,
        color: '#EAECEF',
    } as TextStyle,
});

export default Tickets;