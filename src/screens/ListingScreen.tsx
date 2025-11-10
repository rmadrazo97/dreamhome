import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  Share,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import moment from 'moment';

import { fomartCurrOut, valid_coords } from '../helpers/currency';
import { translate } from "../helpers/i18n";
import SiteDetails from '../constants/SiteDetails';
import TextHeavy from '../components/ui/TextHeavy';
import TextRegular from '../components/ui/TextRegular';
import { ShareSvg, MoreSvg, ChatSvg } from '../components/icons/ButtonSvgIcons';
import BackButton from '../components/inners/BackButton';
import Tickets from '../components/inners/Tickets';
import LFaqs from '../components/inners/LFaqs';
import Members from '../components/inners/Members';
import LMenus from '../components/inners/LMenus';
import Address from '../components/inners/Address';
import PhotosGrid from '../components/inners/PhotosGrid';
import Features from '../components/inners/Features';
import Cats from '../components/inners/Cats';
import LHostedBy from '../components/inners/LHostedBy';
import Reviews from '../components/Reviews';
import AvailabilityModal from '../components/inners/AvailabilityModal';
import { ThemeColors, NavigationProp, Listing } from '../types';

// Types
interface ListingScreenState {
  listing: Listing | null;
  loading: boolean;
  refreshing: boolean;
  showAvailabilityModal: boolean;
}

interface ListingScreenProps {
  navigation: NavigationProp;
  apColors: ThemeColors;
  user: any;
  site: any;
  listing: any;
}

const ListingScreen: React.FC<ListingScreenProps> = ({ navigation, apColors, listing: listingFromStore }) => {
  const [state, setState] = useState<ListingScreenState>({
    listing: null,
    loading: true,
    refreshing: false,
    showAvailabilityModal: false,
  });

  // Navigation options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const fetchListing = useCallback(async () => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));
      
      // Get listing ID from route params
      const currentRoute = navigation.getState().routes.find(r => r.name === 'Listing');
      const listingId = currentRoute?.params && 'id' in currentRoute.params ? currentRoute.params.id : null;
      
      if (!listingId) {
        Alert.alert(translate('error'), translate('listing_not_found'));
        navigation.goBack();
        return;
      }

      // Try to get from Redux store first
      if (listingFromStore && listingFromStore.ID === listingId) {
        setState(prevState => ({
          ...prevState,
          listing: listingFromStore,
          loading: false,
          refreshing: false
        }));
        return;
      }

      // Fetch from API - endpoint requires ID and start date (YYYY-MM-DD format)
      // Based on API: /cththemes/v1/listings/{id}/{start_date}
      const dayStart = moment().format('YYYY-MM-DD');
      const apiUrl = `${SiteDetails.url}wp-json/cththemes/v1/listings/${listingId}/${dayStart}`;
      
      console.log("Listing API URL:", apiUrl);
      
      const response = await axios({
        method: 'GET',
        url: apiUrl,
      }).catch(err => {
        console.error('Error fetching listing:', err);
        return null;
      });
      
      console.log('Listing API response:', response?.data);

      if (response?.data) {
        setState(prevState => ({
          ...prevState,
          listing: response.data,
          loading: false,
          refreshing: false
        }));
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      setState(prevState => ({
        ...prevState,
        loading: false,
        refreshing: false
      }));
      Alert.alert(translate('error'), translate('failed_to_load_listing'));
    }
  }, [navigation, listingFromStore]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleRefresh = useCallback(() => {
    setState(prevState => ({ ...prevState, refreshing: true }));
    fetchListing();
  }, [fetchListing]);

  const handleShare = useCallback(async () => {
    if (!state.listing) return;

    try {
      await Share.share({
        message: `${state.listing.title} - ${state.listing.address}`,
        url: `https://example.com/listing/${state.listing.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [state.listing]);



  const handleCloseAvailabilityModal = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      showAvailabilityModal: false
    }));
  }, []);

  const handleBooking = useCallback(() => {
    if (!state.listing) return;
    
    navigation.navigate('Booking', {
      listingId: state.listing.ID,
      listing: state.listing
    });
  }, [navigation, state.listing]);

  const { listing, loading, refreshing, showAvailabilityModal } = state;

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: apColors.appBg }]}>
        <View style={styles.header}>
          <BackButton color={apColors.backBtn} onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: apColors.regularText }]}>
            {translate('loading') + '...'}
          </Text>
        </View>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.container, { backgroundColor: apColors.appBg }]}>
        <View style={styles.header}>
          <BackButton color={apColors.backBtn} onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: apColors.regularText }]}>
            {translate('listing_not_found')}
          </Text>
        </View>
      </View>
    );
  }
  console.log("Listing:", listing);
  return (
    <SafeAreaConsumer>
      {insets => (
        <View style={[styles.container, { 
          backgroundColor: apColors.appBg,
          paddingTop: insets?.top || 0,
          paddingLeft: insets?.left || 0,
          paddingRight: insets?.right || 0
        }]}>
          <View style={styles.header}>
            <BackButton color={apColors.backBtn} onPress={() => navigation.goBack()} />
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <ShareSvg color={apColors.backBtn} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreSvg color={apColors.backBtn} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={apColors.appColor}
              />
            }
          >
            {/* Hero Image */}
            {listing.thumbnail && (
              <Image
                source={{ uri: listing.thumbnail }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            )}

            {/* Content */}
            <View style={styles.content}>
              {listing.title && (
                <TextHeavy style={[styles.title, { color: apColors.hText }]}>
                  {listing.title || ''}
                </TextHeavy>
              )}

              {listing.address && (
                <Address 
                  address={listing.address}
                />
              )}

              {listing.rating && typeof listing.rating === 'object' && (
                <Reviews 
                  rating={listing.rating} 
                  showNum={true} 
                  style={styles.reviews}
                />
              )}

              {(listing.price != null && listing.price !== '' && 
                (typeof listing.price === 'string' || typeof listing.price === 'number')) && (
                <View style={styles.priceContainer}>
                  <TextHeavy style={[styles.price, { color: apColors.appColor }]}>
                    {fomartCurrOut(listing.price)}
                  </TextHeavy>
                  <TextRegular style={[styles.priceLabel, { color: apColors.addressText }]}>
                    {translate('per_night')}
                  </TextRegular>
                </View>
              )}

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <Features 
                  data={listing.features.map((feature: any) => ({ 
                    id: feature.id || 0, 
                    name: feature.name || '', 
                    icon: feature.icon || '' 
                  }))} 
                  apColors={apColors} 
                />
              )}
              <View style={{height: 10}} />
              {/* Categories */}
              {(listing as any).cats && (listing as any).cats.length > 0 && (
                <Cats data={(listing as any).cats} apColors={apColors} />
              )}

              {/* Host */}
              {listing.host && (
                <LHostedBy 
                  post={listing.host as any} 
                  apColors={apColors} 
                />
              )}
              <View style={{height: 10}} />
              {/* Photos Grid */}
              {(listing as any).photos && (listing as any).photos.length > 0 && (
                <PhotosGrid 
                  photos={(listing as any).photos} 
                  apColors={apColors} 
                />
              )}
              <View style={{height: 10}} />
              {/* Map */}
              {listing.latitude && listing.longitude && valid_coords(listing.latitude, listing.longitude) && (
                <View style={styles.mapContainer}>
                  <TextHeavy style={[styles.sectionTitle, { color: apColors.hText }]}>
                    {translate('location')}
                  </TextHeavy>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: listing.latitude,
                      longitude: listing.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: listing.latitude,
                        longitude: listing.longitude,
                      }}
                      title={listing.title || ''}
                    />
                  </MapView>
                </View>
              )}

              {/* FAQ */}
              {(listing as any).lfaqs && (listing as any).lfaqs.length > 0 && (
                <LFaqs data={(listing as any).lfaqs} />
              )}

              {/* Tickets */}
              {(listing as any).tickets && (listing as any).tickets.length > 0 && (
                <Tickets data={(listing as any).tickets} />
              )}

              {/* Members */}
              {(listing as any).lmembers && (listing as any).lmembers.length > 0 && (
                <Members data={(listing as any).lmembers} />
              )}

              {/* Menus */}
              {(listing as any).lmenus && (listing as any).lmenus.length > 0 && (
                <LMenus data={(listing as any).lmenus} apColors={apColors} />
              )}
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={[styles.bottomActions, { backgroundColor: apColors.appBg, borderTopColor: apColors.separator }]}>
            <TouchableOpacity 
              style={[styles.chatButton, { borderColor: apColors.appColor }]}
              onPress={() => {
                const rootNavigation = navigation.getParent()?.getParent();
                if (rootNavigation) {
                  rootNavigation.navigate('ChatStack', { screen: 'Chat' });
                } else {
                  navigation.navigate('ChatStack' as any, { screen: 'Chat' } as any);
                }
              }}
            >
              <ChatSvg color={apColors.appColor} />
              <TextRegular style={[styles.chatButtonText, { color: apColors.appColor }]}>
                {translate('chat')}
              </TextRegular>
            </TouchableOpacity>

            {/* <Button
              style={styles.bookButton}
              onPress={handleBooking}
            > */}
            <TouchableOpacity style={{...styles.bookButton, backgroundColor: apColors.appColor}} onPress={handleBooking}>
              <TextHeavy style={[styles.bookButtonText]}>
                {translate('book_now')}
              </TextHeavy>
            </TouchableOpacity>
            {/* </Button> */}
          </View>

          {/* Availability Modal */}
          {showAvailabilityModal && (
            <AvailabilityModal
              showDates={showAvailabilityModal}
              _onCloseDates={handleCloseAvailabilityModal}
            />
          )}
        </View>
      )}
    </SafeAreaConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  } as ViewStyle,
  headerActions: {
    flexDirection: 'row',
  } as ViewStyle,
  headerButton: {
    padding: 10,
    marginLeft: 10,
  } as ViewStyle,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  loadingText: {
    fontSize: 16,
  } as TextStyle,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  errorText: {
    fontSize: 16,
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  heroImage: {
    width: '100%',
    height: 250,
  } as ImageStyle,
  content: {
    padding: 15,
  } as ViewStyle,
  title: {
    fontSize: 24,
    marginBottom: 10,
  } as TextStyle,
  reviews: {
    marginBottom: 15,
  } as ViewStyle,
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    marginTop: 10,
  } as ViewStyle,
  price: {
    fontSize: 28,
    marginRight: 10,
  } as TextStyle,
  priceLabel: {
    fontSize: 16,
  } as TextStyle,
  mapContainer: {
    marginVertical: 20,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  } as TextStyle,
  map: {
    height: 200,
    borderRadius: 8,
  } as ViewStyle,
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
  } as ViewStyle,
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 8,
  } as ViewStyle,
  chatButtonText: {
    marginLeft: 8,
    fontSize: 16,
  } as TextStyle,
  bookButton: {
    flex: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
  } as TextStyle,
});

// Redux connection
const mapStateToProps = (state: any) => ({
    apColors: state.apColors,
    user: state.user,
    site: state.site,
    listing: state.listing,
});

export default connect(mapStateToProps)(ListingScreen);
