import React, { useState, useCallback } from 'react';
import { 
    Text,
    View,
    TouchableOpacity,
    ScrollView, 
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Alert
} from 'react-native';
import Slider from '@react-native-community/slider';

import { SafeAreaConsumer } from 'react-native-safe-area-context';

// import * as expoLocation from 'expo-location';
// import * as expoPermissions from 'expo-permissions';
import Geolocation from '@react-native-community/geolocation';


import {boldFontFamily} from '../constants/Colors';
import {translate} from "../helpers/i18n";
import {fomartCurrOut,formatNumber} from '../helpers/currency';


// import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { aweIcon } from '../helpers/helpers';


import TextRegular from '../components/ui/TextRegular';
import TextMedium from '../components/ui/TextMedium';
import TextHeavy from '../components/ui/TextHeavy';
import {MarkerSvg} from '../components/icons/ButtonSvgIcons';


import CloseButton from '../components/inners/CloseButton';
import BtnFull from '../components/ui/BtnFull';
import {RadioBtn,CheckboxBtn} from '../components/ui/UIs';

import CustomSlider from '../components/ui/Slider';
import { connect } from 'react-redux';

import {applyFilters} from '../actions/filter';

import {filterState} from '../reducers/initialState';
import { ThemeColors, NavigationProp } from '../types';

// Types
interface FilterState {
    orderby: string;
    distance: number;
    status: string;
    prices: number[];
    nearby: string;
    address_lat: number | string;
    address_lng: number | string;
    locs: string[];
    cats: string[];
    feas: string[];
    tags: string[];
    layout: string;
}

interface FilterScreenProps {
    navigation: NavigationProp;
    apColors: ThemeColors;
    site: {
        cats: any[];
        locs: any[];
        feas: any[];
        tags: any[];
        layout: any;
    };
    filter: FilterState;
    applyFilters: (filters: FilterState) => void;
}

const FilterScreen: React.FC<FilterScreenProps> = ({ 
    navigation, 
    apColors, 
    site, 
    filter, 
    applyFilters: applyFiltersAction 
}) => {
    const [state, setState] = useState<FilterState>({...filter});
    // Navigation options
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const resetFilter = useCallback(() => {
        setState({...filterState});
    }, []);

    const renderHeader = useCallback((cstyle = {}) => {
        return (
            <View style={[styles.navBar, apColors?.headerNavStyle, cstyle]}>
                <CloseButton 
                    color={apColors?.backBtn || '#000'} 
                    style={{width: 50}} 
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.filterTitle}>
                    <Text style={apColors?.headerTitleStyle}>{translate('filter','hTitle')}</Text>
                </View>
                <TouchableOpacity 
                    onPress={resetFilter} 
                    style={styles.filterBtn}
                >
                    <TextMedium style={[styles.filterText, {color: apColors?.appColor || '#007AFF'}]}>
                        {translate('filter','reset')}
                    </TextMedium>
                </TouchableOpacity>
            </View>
        );
    }, [apColors, navigation, resetFilter]);

    const onChange = useCallback((value: any, name: string) => {
        setState(prevState => ({...prevState, [name]: value}));
    }, []);
    const onSelectTax = useCallback((id: string, tax: string) => {
        setState(prevState => {
            const taxState = prevState[tax as keyof FilterState];
            if (taxState != null) {
                if (Array.isArray(taxState)) {
                    const newState = [...taxState];
                    const tidx = taxState.findIndex(tx => tx === id);
                    if (tidx !== -1) {
                        newState.splice(tidx, 1);
                    } else {
                        newState.push(id);
                    }
                    return {...prevState, [tax]: newState};
                } else {
                    return {...prevState, [tax]: [id]};
                }
            } else {
                return {...prevState, [tax]: [id]};
            }
        });
    }, []);
    const multiSliderValueCallback = useCallback((values: number[]) => {
        setState(prevState => ({...prevState, prices: values}));
    }, []);

    const getGeoLocation = useCallback(async () => {
        try {
            const location = await new Promise<any>((resolve, reject) => {
                Geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000
                });
            });
            
            if (location.coords) {
                const {latitude, longitude} = location.coords;
                setState(prevState => ({
                    ...prevState,
                    nearby: 'on',
                    address_lat: latitude,
                    address_lng: longitude,
                    locs: [],
                }));
            }
        } catch (error) {
            console.error('Location error:', error);
            Alert.alert(
                translate('location_error'),
                translate('location_error_message'),
                [{ text: translate('ok') }]
            );
        }
    }, []);
    const onNearBy = useCallback(async () => {
        if (state.nearby === 'on') {
            setState(prevState => ({
                ...prevState,
                nearby: 'off',
                address_lat: '',
                address_lng: ''
            }));
            return;
        }

        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization();
            await getGeoLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: translate('locrequest','title'),
                        message: translate('locrequest','message'),
                        buttonPositive: translate('ok'),
                        buttonNegative: translate('cancel'),
                        buttonNeutral: translate('ask_me_later'),
                    }
                );
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    await getGeoLocation();
                } else {
                    Alert.alert(
                        translate('locrequest','denied'),
                        translate('locrequest','denied_message'),
                        [{ text: translate('ok') }]
                    );
                }
            } catch (e) {
                console.error('Permission error:', e);
                Alert.alert(
                    translate('error'),
                    translate('permission_error'),
                    [{ text: translate('ok') }]
                );
            }
        }
    }, [state.nearby, getGeoLocation]);
    const handleApplyFilters = useCallback(() => {
        applyFiltersAction(state);
        navigation.goBack();
    }, [state, applyFiltersAction, navigation]);

    const {orderby, distance, status, prices, nearby} = state;
    const {cats, locs, feas, tags, layout} = site;

    return (
        <SafeAreaConsumer>
            {insets => (
                <View style={[
                    styles.container,
                    {
                        backgroundColor: apColors?.appBg || '#FFFFFF',
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right
                    }
                ]}>
                    <View style={{flex: 1}}>
                        {renderHeader()}
                        <View style={{flex: 1}}>
                            <ScrollView 
                                style={{flex: 1}} 
                                contentContainerStyle={styles.contentContainer}
                                showsVerticalScrollIndicator={false}
                            >
                                
                                <View style={styles.filterGroup}>
                                    <TextHeavy style={styles.filterLabel}>{translate('filter','categories')}</TextHeavy>
                                    
                                    <CatsGroup 
                                        data={cats} 
                                        value={state.cats} 
                                        showing={100} 
                                        onChange={(id) => onSelectTax(id, 'cats')} 
                                        apColors={apColors}
                                    />

                                    <CheckboxBtn 
                                        status={status === 'open' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange(status === 'open' ? '' : 'open', 'status')}
                                    >
                                        {translate('filter','open_now')}
                                    </CheckboxBtn>
                                </View>

                                <View style={styles.filterGroup}>
                                    <TextHeavy style={styles.filterLabel}>{translate('filter','facilities')}</TextHeavy>

                                    <FeasGroup 
                                        data={feas} 
                                        value={state.feas} 
                                        onChange={(id) => onSelectTax(id, 'feas')} 
                                        apColors={apColors}
                                    />
                                </View>

                                <View style={styles.filterGroup}>
                                    <TextHeavy style={styles.filterLabel}>{translate('filter','cities')}</TextHeavy>
                                    
                                    <LocsGroup 
                                        data={locs} 
                                        value={state.locs} 
                                        showing={100} 
                                        onChange={(id) => onSelectTax(id, 'locs')} 
                                        onNearBy={onNearBy} 
                                        nearBy={nearby} 
                                        apColors={apColors}
                                    />
                                </View>

                                {nearby === 'on' && (
                                    <View style={styles.filterGroup}>
                                        <TextHeavy style={styles.filterLabel}>{translate('filter','distance')}</TextHeavy>
                                        
                                        <Slider
                                            value={distance}
                                            onValueChange={(val) => onChange(val, 'distance')}
                                            style={{height: 40, width: '100%', flex: 1}}
                                            minimumValue={2}
                                            maximumValue={100}
                                            minimumTrackTintColor={apColors?.appColor || '#007AFF'}
                                            maximumTrackTintColor="#EAECEF"
                                        />

                                        <TextRegular style={styles.fSliderText}>
                                            {translate('filter','nearby', {count: formatNumber(distance)})}
                                        </TextRegular>
                                    </View>
                                )}

                                

                                <View style={styles.filterGroup}>
                                    <TextHeavy style={styles.filterLabel}>{translate('filter','price')}</TextHeavy>
                                    {Array.isArray(prices) && prices.length === 2 && (
                                        <View style={styles.fPriceVals}>
                                            <TextRegular style={styles.fSliderText}>
                                                {translate('filter','prices', { 
                                                    min: fomartCurrOut(prices[0]), 
                                                    max: fomartCurrOut(prices[1]) 
                                                })}
                                            </TextRegular>
                                        </View>
                                    )}
                                    <CustomSlider
                                        values={prices}
                                        min={0}
                                        max={1000000}
                                        onValuesChange={multiSliderValueCallback}
                                        apColors={apColors}
                                    />
                                </View>

                                    

                                <View style={styles.filterGroup}>
                                    <TextHeavy style={styles.filterLabel}>{translate('filter','layout')}</TextHeavy>

                                    <RadioGroup 
                                        data={layout} 
                                        value={state.layout} 
                                        onChange={(val) => onChange(val, 'layout')} 
                                        apColors={apColors}
                                    />
                                </View>

                                <View style={styles.filterGroup}>
                                    <TextHeavy style={styles.filterLabel}>{translate('filter','tags')}</TextHeavy>
                                    
                                    <TaxsGroup 
                                        data={tags} 
                                        value={state.tags} 
                                        showing={5} 
                                        onChange={(id) => onSelectTax(id, 'tags')} 
                                        apColors={apColors}
                                    />
                                </View>

                                <View style={styles.filterGroup}>
                                    <TextHeavy style={styles.filterLabel}>{translate('filter','sortby')}</TextHeavy>
                                    <RadioBtn 
                                        status={orderby === 'date' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange('date', 'orderby')}
                                    >
                                        {translate('filter','newest')}
                                    </RadioBtn>
                                    <RadioBtn 
                                        status={orderby === 'highest_rated' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange('highest_rated', 'orderby')}
                                    >
                                        {translate('filter','top_rated')}
                                    </RadioBtn>
                                    <RadioBtn 
                                        status={orderby === 'most_reviewed' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange('most_reviewed', 'orderby')}
                                    >
                                        {translate('filter','most_reviewed')}
                                    </RadioBtn>
                                    <RadioBtn 
                                        status={orderby === 'most_viewed' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange('most_viewed', 'orderby')}
                                    >
                                        {translate('filter','most_viewed')}
                                    </RadioBtn>
                                    <RadioBtn 
                                        status={orderby === 'most_liked' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange('most_liked', 'orderby')}
                                    >
                                        {translate('filter','most_liked')}
                                    </RadioBtn>
                                    <RadioBtn 
                                        status={orderby === 'price_high' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange('price_high', 'orderby')}
                                    >
                                        {translate('filter','price_high')}
                                    </RadioBtn>
                                    <RadioBtn 
                                        status={orderby === 'price_low' ? 'checked' : 'unchecked'} 
                                        style={[styles.radioBorder, {borderBottomColor: apColors?.separator || '#E0E0E0'}] as any}
                                        onPress={() => onChange('price_low', 'orderby')}
                                    >
                                        {translate('filter','price_low')}
                                    </RadioBtn>
                                </View>

                            </ScrollView>
                        </View>
                        <BtnFull 
                            style={{marginLeft: 30, marginRight: 30, marginBottom: 20}} 
                            onPress={handleApplyFilters}
                        >
                            {translate('filter','apply')}
                        </BtnFull>
                    </View>
                </View>
            )}
        </SafeAreaConsumer>
    );
};

// Redux connection
const mapStateToProps = (state: any) => ({
    site: state.site,
    filter: state.filter,
    apColors: state.apColors,
});

const mapDispatchToProps = {
    applyFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterScreen);

interface GroupProps {
    data: any[];
    value: string[];
    showing?: number;
    onChange: (id: string) => void;
    apColors: ThemeColors;
    style?: any;
    viewMore?: string;
    viewLess?: string;
}

const CatsGroup: React.FC<GroupProps> = (props) => {
    const [showAll, toggleShowAll] = useState(false);
    let childJsx = [],
        hasMore = false,
        dfShow = props.showing != null ? props.showing : 3;
        if (props.data != null && Array.isArray(props.data) && props.data.length > 0) {
            const filteredItems = props.data.filter(itm => itm.count > 0);
            const showingDatas = !showAll && filteredItems.length > dfShow ? filteredItems.slice(0, dfShow) : filteredItems;
            if (filteredItems.length > dfShow) {
                hasMore = true;
            }
            showingDatas.forEach(tax => {
                const {id, title, icon} = tax;
                let cStyle = styles.catIconWrap;
                let cIStyle = styles.catIcon;

                if (props.value.findIndex(slid => slid === id) !== -1) {
                    cStyle = [cStyle, {
                        borderColor: props.apColors?.appColor || '#007AFF',
                        backgroundColor: props.apColors?.appColor || '#007AFF',
                    }] as any;
                    cIStyle = [cIStyle, styles.catIconSelected] as any;
                } 
                childJsx.push(
                    <TouchableOpacity key={id} style={styles.catWrap} onPress={() => props.onChange(id)}>
                        <View style={cStyle}>
                            {icon != null && icon !== '' && <FontAwesome5 name={aweIcon(icon)} style={cIStyle}/>}
                        </View>
                        <TextMedium style={styles.catText}>{title}</TextMedium>
                    </TouchableOpacity>
                );
            });
        }
    return (
        <View style={[styles.catsGroup,props?.style]}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{}}>{childJsx}</ScrollView>
            { hasMore && <TouchableOpacity style={styles.moreLess} onPress={()=>toggleShowAll(!showAll)}>
                <TextMedium style={[styles.moreLessText,{color: props.apColors?.appColor || '#007AFF',}]}>{ 
                    showAll ? 
                    (props.viewLess != null ? props.viewLess : translate('viewLess')) : 
                    (props.viewMore != null ? props.viewMore : translate('viewMore')) 
                }</TextMedium>
            </TouchableOpacity> }
        </View>
    )
}
interface LocsGroupProps extends GroupProps {
    onNearBy: () => void;
    nearBy: string;
}

const LocsGroup: React.FC<LocsGroupProps> = (props) => {
    const [showAll, toggleShowAll] = useState(false);
    let childJsx = [],
        hasMore = false,
        dfShow = props.showing != null ? props.showing : 3;
        if (props.data != null && Array.isArray(props.data) && props.data.length > 0) {
        const filteredItems = props.data.filter(itm => itm.count > 0 );
        const showingDatas = !showAll && filteredItems.length > dfShow ? filteredItems.slice(0, dfShow) : filteredItems;
        if (filteredItems.length > dfShow) {
            hasMore = true;
        }
        showingDatas.forEach(tax => {
            let cStyle = styles.locWrap;
            let cTStyle = styles.locText;
            if (props.value.findIndex(slid => slid === tax.id) !== -1) {
                cStyle = [cStyle, styles.taxSelected, {borderColor: props.apColors?.appColor || '#007AFF', shadowColor: props.apColors?.shadowCl || '#000'}] as any;
                cTStyle = [cTStyle, {color: props.apColors?.appColor || '#007AFF'}] as any;
            } 
            childJsx.push(<TouchableOpacity key={tax.id} style={cStyle} onPress={()=>props.onChange(tax.id)}>
                    <TextMedium style={cTStyle}>{tax.title}</TextMedium>
                </TouchableOpacity>)
        });
    }
    let nbStyle = styles.nearbyWrap,
        nbTStyle = styles.locText;
            if (props.nearBy != null && props.nearBy === 'on') {
        nbStyle = [nbStyle, styles.taxSelected, {borderColor: props.apColors?.appColor || '#007AFF', shadowColor: props.apColors?.shadowCl || '#000'}] as any;
        nbTStyle = [nbTStyle, {color: props.apColors?.appColor || '#007AFF'}] as any;
    }
    childJsx.unshift(<TouchableOpacity key="nearby" style={nbStyle} onPress={()=>props.onNearBy()}>
                    <MarkerSvg style={{marginRight: 7}} color={props.nearBy != null && props.nearBy === 'on' ? props.apColors?.appColor || '#007AFF' : '#CCC'}/>
                    <TextMedium style={nbTStyle}>{translate('filter','nearme')}</TextMedium>
                </TouchableOpacity>)
    return (
        <View style={[styles.taxsGroup,props?.style]}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{}}>{childJsx}</ScrollView>
            { hasMore && <TouchableOpacity style={styles.moreLess} onPress={()=>toggleShowAll(!showAll)}>
                <TextMedium style={[styles.moreLessText,{color: props.apColors?.appColor || '#007AFF',}]}>{ 
                    showAll ? 
                    (props.viewLess != null ? props.viewLess : translate('viewLess')) : 
                    (props.viewMore != null ? props.viewMore : translate('viewMore')) 
                }</TextMedium>
            </TouchableOpacity> }
        </View>
    )
}
const TaxsGroup: React.FC<GroupProps> = (props) => {
    const [showAll, toggleShowAll] = useState(false);
    let childJsx = [],
        hasMore = false,
        dfShow = props.showing != null ? props.showing : 3;
        if (props.data != null && Array.isArray(props.data) && props.data.length > 0) {
        const filteredItems = props.data.filter(itm => itm.count > 0 );
        const showingDatas = !showAll && filteredItems.length > dfShow ? filteredItems.slice(0, dfShow) : filteredItems;
        if (filteredItems.length > dfShow) {
            hasMore = true;
        }
        showingDatas.forEach(tax => {
            let cStyle = styles.taxWrap;
            let cTStyle = styles.taxText;
            if (props.value.findIndex(slid => slid === tax.id) !== -1) {
                cStyle = [cStyle, styles.taxSelected, {borderColor: props.apColors?.appColor || '#007AFF', shadowColor: props.apColors?.shadowCl || '#000'}] as any;
                cTStyle = [cTStyle, {color: props.apColors?.appColor || '#007AFF'}] as any;
            } 
            childJsx.push(<TouchableOpacity key={tax.id} style={cStyle} onPress={()=>props.onChange(tax.id)}>
                    <TextMedium style={cTStyle}>{tax.title}</TextMedium>
                </TouchableOpacity>)
        });
    }
    return (
        <View style={[styles.taxsGroup,props?.style]}>
            {childJsx}
            { hasMore && <TouchableOpacity style={styles.moreLess} onPress={()=>toggleShowAll(!showAll)}>
                <TextMedium style={[styles.moreLessText,{color: props.apColors?.appColor || '#007AFF',}]}>{ 
                    showAll ? 
                    (props.viewLess != null ? props.viewLess : translate('viewLess')) : 
                    (props.viewMore != null ? props.viewMore : translate('viewMore')) 
                }</TextMedium>
            </TouchableOpacity> }
        </View>
    )
}
const FeasGroup: React.FC<GroupProps> = (props) => {
    const [showAll, toggleShowAll] = useState(false);
    let childJsx = [],
        hasMore = false,
        dfShow = props.showing != null ? props.showing : 3;
        if (props.data != null && Array.isArray(props.data) && props.data.length > 0) {
        const filteredItems = props.data.filter(itm => itm.count > 0 );
        const showingDatas = !showAll && filteredItems.length > dfShow ? filteredItems.slice(0, dfShow) : filteredItems;
        if (filteredItems.length > dfShow) {
            hasMore = true;
        }
        showingDatas.forEach(tax => {
            const checked = props.value != null && props.value.findIndex(slid => slid === tax.id) !== -1 ? 'checked' : 'unchecked';
            childJsx.push(  <CheckboxBtn key={tax.id}
                                status={ checked } 
                                style={[styles.radioBorder, {borderBottomColor: props.apColors?.separator || '#E0E0E0'}] as any}
                                onPress={ ()=> props.onChange(tax.id) }
                            >{tax.title}</CheckboxBtn> )
        });
    }
    return (
        <View style={[styles.checkboxGroup,props?.style]}>
            {childJsx}
            { hasMore && <TouchableOpacity style={styles.moreLess} onPress={()=>toggleShowAll(!showAll)}>
                <TextMedium style={[styles.moreLessText,{color: props.apColors?.appColor || '#007AFF',}]}>{ 
                    showAll ? 
                    (props.viewLess != null ? props.viewLess : translate('viewLess')) : 
                    (props.viewMore != null ? props.viewMore : translate('viewMore')) 
                }</TextMedium>
            </TouchableOpacity> }
        </View>
    )
}
interface RadioGroupProps {
    data: any;
    value: string;
    onChange: (val: string) => void;
    apColors: ThemeColors;
    style?: any;
    showing?: number;
    viewMore?: string;
    viewLess?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = (props) => {
    const [showAll, toggleShowAll] = useState(false);
    let childJsx = [],
        hasMore = false,
        dfShow = props.showing != null ? props.showing : 3;
    if (props.data != null && props.data instanceof Object && !Array.isArray(props.data)) {
        const objLength = Object.keys(props.data).length,
            showing = !showAll && objLength > dfShow ? dfShow : objLength;
        if (objLength > dfShow) {
            hasMore = true;
        }
        let sCount = 1;
        for(let k in props.data){
            if (sCount > showing) break;
            const checked = props.value != null && props.value === k ? 'checked' : 'unchecked';
            childJsx.push(  <RadioBtn key={k}
                                status={ checked } 
                                style={[styles.radioBorder, {borderBottomColor: props.apColors?.separator || '#E0E0E0'}] as any}
                                onPress={ ()=> props.onChange(k) }
                            >{props.data[k]}</RadioBtn> )
            sCount++;
        }
    }
    return (
        <View style={[styles.checkboxGroup,props?.style]}>
            {childJsx}
            { hasMore && <TouchableOpacity style={styles.moreLess} onPress={()=>toggleShowAll(!showAll)}>
                <TextMedium style={[styles.moreLessText,{color: props.apColors?.appColor || '#007AFF',}]}>{ 
                    showAll ? 
                    (props.viewLess != null ? props.viewLess : translate('viewLess')) : 
                    (props.viewMore != null ? props.viewMore : translate('viewMore')) 
                }</TextMedium>
            </TouchableOpacity> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navBar: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 7,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1,
    },
    filterTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterBtn: {
        height: 28, 
        width: 50,
        justifyContent: 'center'
    },
    filterText: {
        fontSize: 17,
        textAlign: 'right',
    },
    contentContainer: {
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    filterGroup: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 17,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    // cats
    catWrap: {
        paddingRight: 15,
    },
    catIconWrap: {
        height: 64,
        width: 64,
        borderRadius: 32, 
        overflow: 'hidden',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#CCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    catIcon: {
        fontSize: 35,
        color: '#CCC'
    },
    catIconSelected: {
        color: '#FFF'
    },
    catText: {
        fontSize: 15,
        textAlign: 'center',
    },
    // locs
    locWrap: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#EAECEF',
        borderRadius: 25,
        marginRight: 7,
        marginBottom: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locText: {
        fontSize: 15,
        lineHeight: 20,
        textAlignVertical: 'center',
    },
    nearbyWrap: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#EAECEF',
        borderRadius: 25,
        marginRight: 7,
        marginBottom: 7,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // tax
    taxsGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    taxWrap: {
        paddingVertical: 7,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: '#EAECEF',
        borderRadius: 25,
        marginRight: 7,
        marginBottom: 7,
    },
    taxSelected: {
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,  
        elevation: 1,
    },
    taxText: {
        fontSize: 15,
    },
    checkboxGroup: {
        flex: 1,
    },
    // radio
    labelStyle: {
        fontFamily: boldFontFamily,
        fontSize: 17, 
    },
    radioBorder: {
        borderBottomWidth: 1,
    },
    // more less button
    moreLess: {
        paddingTop: 15,
    },
    moreLessText: {
        fontSize: 15,
        textDecorationLine: 'underline',
    },
    fPriceVals: {
        marginBottom: 10,
    },
    fSliderText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    catsGroup: {
        marginBottom: 15,
    },
});
