import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  NavigationProp,
  Listing,
  FilterState,
  ListingScreenState,
  User,
} from '../types';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { filterListings } from '../helpers/store';
import NavigationService from '../helpers/NavigationService';
import { translate } from '../helpers/i18n';
import { extractPostParams } from '../helpers/store';
import { MapSvg } from '../components/icons/ButtonSvgIcons';
import LList from '../components/inners/LList';
import LCard from '../components/inners/LCard';
import TextRegular from '../components/ui/TextRegular';
import Loader from '../components/Loader';
import { connect, useSelector } from 'react-redux';
import { themedColors } from '../constants/Colors';

// Types
interface ArchiveScreenProps {
  navigation: NavigationProp;
  filter: FilterState;
  listings: ListingScreenState;
  user: User;
}

interface ReduxState {
  filter: FilterState;
  listings: ListingScreenState;
  user: User;
}

interface ArchiveState {
  filter: FilterState;
  paged: number;
}

const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  navigation,
  filter,
  listings,
}) => {
  const apColors = useSelector((state: any) => state.apColors) || themedColors.default;
  const [state, setState] = useState<ArchiveState>({
    filter: {
      cats: [],
      locs: [],
      feas: [],
      tags: [],
      prices: [0, 10000000],
      nearby: 'off',
      address_lat: '',
      address_lng: '',
      distance: 10,
      orderby: 'date',
      layout: 'list',
      status: '',
    },
    paged: 1,
  });

  const prevFilterRef = useRef<FilterState>(filter);

  // Compare state function
  const compareState = useCallback((v1: any, v2: any): boolean => {
    if (typeof v1 !== typeof v2) {
      return false;
    }

    if (typeof v1 === 'function') {
      return v1.toString() === v2.toString();
    }

    if (v1 instanceof Array && v2 instanceof Array) {
      if (v1.length !== v2.length) return false;

      for (let i = 0; i < v1.length; i++) {
        if (v1[i] instanceof Object && v2[i] instanceof Object) {
          if (!compareState(v1[i], v2[i])) {
            return false;
          }
        } else if (v1[i] !== v2[i]) {
          return false;
        }
      }
      return true;
    } else if (v1 instanceof Object && v2 instanceof Object) {
      const keys1 = Object.keys(v1);
      const keys2 = Object.keys(v2);

      if (keys1.length !== keys2.length) return false;

      for (let k of keys1) {
        if (!compareState(v1[k], v2[k])) {
          return false;
        }
      }
      return true;
    } else {
      return v1 === v2;
    }
  }, []);

  // Update state when filter changes
  useEffect(() => {
    if (!compareState(filter, prevFilterRef.current)) {
      const newState = { ...filter, paged: 1 };
      filterListings({ ...newState, paged: 1 });
      setState(prevState => ({ ...prevState, filter: newState, paged: 1 }));
      prevFilterRef.current = filter;
    }
  }, [filter, compareState]);

  const goToListing = useCallback((p: Listing) => {
    NavigationService.navigate('Listing', extractPostParams(p));
  }, []);

  const onEndReached = useCallback(() => {
    setState(prev => {
      const params = { ...prev.filter, paged: prev.paged + 1 };
      filterListings(params, true);
      return { ...prev, paged: prev.paged + 1 };
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Listing }) => {
      const CardComponent = state.filter?.layout === 'grid' ? LCard : LList;
      return (
        <CardComponent
          post={item}
          onPress={() => goToListing(item)}
          bookmarks={[]}
        />
      );
    },
    [state.filter?.layout, goToListing],
  );

  const keyExtractor = useCallback((item: Listing) => String(item.ID || item.id || Math.random()), []);

  const loading = listings.loading || false;
  const items = (listings as any).items || [];
  const cardCols = state.filter?.layout === 'grid' ? 2 : 1;
  const flatListStyle =
    state.filter?.layout === 'grid'
      ? [styles.flatListGrid, { backgroundColor: apColors.secondBg }]
      : styles.flatList;

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.listEmpty}>
        <TextRegular style={[styles.emptyText, { color: apColors.lMoreText }]}>
          {translate('archive', 'no_results', {})}
        </TextRegular>
      </View>
    ),
    [apColors.lMoreText],
  );

  const ListFooterComponent = useCallback(
    () => (
      <View style={styles.listFooter}>
        {loading && <ActivityIndicator animating={true} />}
        {items.length > 0 && (
          <TextRegular
            style={[styles.noMoreText, { color: apColors.lMoreText }]}
          >
            {translate('archive', 'no_more', {})}
          </TextRegular>
        )}
      </View>
    ),
    [loading, items.length, apColors.lMoreText],
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: apColors.appBg,
        },
      ]}
      edges={['top']}
    >
      {loading && <Loader loading={true} />}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={flatListStyle}
        numColumns={cardCols}
        key={cardCols}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Map')}
        style={styles.viewMapWrap}
      >
        <MapSvg color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Map the redux state to your props
const mapStateToProps = (state: any): ReduxState => ({
  filter: state.filter,
  listings: state.listings,
  user: state.user,
});

// Map your action creators to your props
const mapDispatchToProps = {};

// Export your component as a default export
export default connect(mapStateToProps, mapDispatchToProps)(ArchiveScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  filterBtn: {
    marginRight: 10,
    height: 28,
    width: 50,
    justifyContent: 'center',
  } as ViewStyle,
  filterText: {
    fontSize: 17,
    textAlign: 'right',
  } as TextStyle,
  flatList: {
    paddingHorizontal: 15,
  } as ViewStyle,
  flatListGrid: {
    paddingHorizontal: 7.5,
    paddingTop: 15,
  } as ViewStyle,
  listEmpty: {
    paddingVertical: 20,
  } as ViewStyle,
  listFooter: {
    paddingVertical: 20,
  } as ViewStyle,
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  } as TextStyle,
  noMoreText: {
    fontSize: 15,
    textAlign: 'center',
  } as TextStyle,
  viewMapWrap: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 200,
    backgroundColor: '#CCC',
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});
