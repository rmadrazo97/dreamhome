import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';

import { translate } from '../../helpers/i18n';
import { fomartCurrOut } from '../../helpers/currency';
import TextRegular from '../ui/TextRegular';
import TextHeavy from '../ui/TextHeavy';
import Quantity from './Quantity';
import { ThemeColors, Ticket } from '../../types';

// Types
interface TicketsProps {
    tickets: Ticket[];
    apColors: ThemeColors;
    onSelectTickets: (tickets: Ticket[]) => void;
}

const Tickets: React.FC<TicketsProps> = ({ 
    tickets, 
    apColors, 
    onSelectTickets 
}) => {
    const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);

    const handleQuantityChange = useCallback((ticketId: string, quantity: number) => {
        const updatedTickets = selectedTickets.filter(t => t.id !== ticketId);
        
        if (quantity > 0) {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
                updatedTickets.push({ ...ticket, quantity });
            }
        }
        
        setSelectedTickets(updatedTickets);
        onSelectTickets(updatedTickets);
    }, [selectedTickets, tickets, onSelectTickets]);

    const getTicketQuantity = useCallback((ticketId: string) => {
        const selectedTicket = selectedTickets.find(t => t.id === ticketId);
        return selectedTicket ? selectedTicket.quantity : 0;
    }, [selectedTickets]);

    if (!tickets || tickets.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <TextRegular style={[styles.emptyText, { color: apColors.regularText }]}>
                    {translate('no_tickets_available')}
                </TextRegular>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {tickets.map((ticket) => (
                <View key={ticket.id} style={[styles.ticketCard, { 
                    backgroundColor: apColors.secondBg,
                    borderColor: apColors.separator
                }]}>
                    <View style={styles.ticketContent}>
                        {/* Ticket Image */}
                        {ticket.image && (
                            <Image
                                source={{ uri: ticket.image }}
                                style={styles.ticketImage}
                                resizeMode="cover"
                            />
                        )}

                        <View style={styles.ticketInfo}>
                            {/* Ticket Title */}
                            <TextHeavy style={[styles.ticketTitle, { color: apColors.hText }]}>
                                {ticket.title}
                            </TextHeavy>

                            {/* Ticket Description */}
                            {ticket.description && (
                                <TextRegular style={[styles.ticketDescription, { color: apColors.regularText }]}>
                                    {ticket.description}
                                </TextRegular>
                            )}

                            {/* Ticket Price */}
                            <View style={styles.priceContainer}>
                                <TextHeavy style={[styles.ticketPrice, { color: apColors.appColor }]}>
                                    {fomartCurrOut(ticket.price)}
                                </TextHeavy>
                                <TextRegular style={[styles.priceLabel, { color: apColors.addressText }]}>
                                    {translate('per_ticket')}
                                </TextRegular>
                            </View>
                        </View>
                    </View>

                    {/* Quantity Controls */}
                    <View style={styles.quantityContainer}>
                        <TextRegular style={[styles.quantityLabel, { color: apColors.regularText }]}>
                            {translate('quantity')}:
                        </TextRegular>
                        <Quantity
                            value={getTicketQuantity(ticket.id)}
                            max={ticket.max_quantity || 10}
                            apColors={apColors}
                            onChange={(qty) => handleQuantityChange(ticket.id, qty)}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    } as ViewStyle,
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    } as ViewStyle,
    emptyText: {
        fontSize: 16,
    } as TextStyle,
    ticketCard: {
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        padding: 15,
    } as ViewStyle,
    ticketContent: {
        flexDirection: 'row',
        marginBottom: 15,
    } as ViewStyle,
    ticketImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    } as ImageStyle,
    ticketInfo: {
        flex: 1,
    } as ViewStyle,
    ticketTitle: {
        fontSize: 16,
        marginBottom: 8,
    } as TextStyle,
    ticketDescription: {
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 20,
    } as TextStyle,
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    } as ViewStyle,
    ticketPrice: {
        fontSize: 18,
        marginRight: 8,
    } as TextStyle,
    priceLabel: {
        fontSize: 12,
    } as TextStyle,
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    } as ViewStyle,
    quantityLabel: {
        fontSize: 14,
    } as TextStyle,
});

export default Tickets;