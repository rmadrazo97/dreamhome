import {toNumber} from 'i18n-js';
import store from '../store';

export function old_fomartCurrOut(price, with_symbol = true) {
  price = parseFloat(price);
  if (isNaN(price)) price = 0;
  const {currency} = store.getState();
  if (currency != null) {
    price = parseFloat(price) * parseFloat(currency.rate);
    const decimal = parseInt(currency.decimal);
    if (decimal > 0) {
      const pattern = new RegExp(
        currency.dec_sep == '.'
          ? '(\\d)(?=(\\d{3})+\\.)'
          : `(\\d)(?=(\\d{3})+${currency.dec_sep})`,
        'g',
      );
      price = price
        .toFixed(decimal)
        .replace('.', currency.dec_sep)
        .replace(pattern, '$1' + currency.ths_sep);
    } else {
      price = (Math.round(price) + '').replace(
        /(\d)(?=(\d{3})+$)/g,
        '$1' + currency.ths_sep,
      );
    }
    if (with_symbol) {
      if (currency.sb_pos == 'left') price = currency.symbol + price;
      else if (currency.sb_pos == 'left_space')
        price = currency.symbol + ' ' + price;
      else if (currency.sb_pos == 'right_space') price += ' ' + currency.symbol;
      else price += currency.symbol;
    }
  } else if (with_symbol) {
    price = '$' + price;
  }

  return price;
}
// var dollarUSLocale = Intl.NumberFormat('en-US');

export function fomartCurrOut(price, with_symbol = true) {
  price = parseFloat(price);
  if (isNaN(price)) price = 0;
  const {currency} = store.getState();
  if (currency != null) {
    price = parseFloat(price) * parseFloat(currency.rate);
    const decimal = parseInt(currency.decimal);

    let suffix = '';
    if (price > 99999 && price < 1000000) {
      console.log('Ks: ', price);
      suffix = ' K';
      price = price / 1000;
    } else if (1000000 <= price) {
      console.log('Ms: ', price);
      suffix = ' M';
      price = price / 1000000;
    }

    if (decimal > 0) {
      const pattern = new RegExp(
        currency.dec_sep == '.'
          ? '(\\d)(?=(\\d{3})+\\.)'
          : `(\\d)(?=(\\d{3})+${currency.dec_sep})`,
        'g',
      );
      price = price
        .toFixed(decimal)
        .replace('.', currency.dec_sep)
        .replace(pattern, '$1' + currency.ths_sep);
    } else {
      price = (Math.round(price) + '').replace(
        /(\d)(?=(\d{3})+$)/g,
        '$1' + currency.ths_sep,
      );
    }

    if (with_symbol) {
      if (currency.sb_pos == 'left') price = currency.symbol + price + suffix;
      else if (currency.sb_pos == 'left_space')
        price = currency.symbol + ' ' + price + suffix;
      else if (currency.sb_pos == 'right_space')
        price += ' ' + currency.symbol + suffix;
      else price += currency.symbol + suffix;
    }
  } else if (with_symbol) {
    price = '$' + price;
  }

  return price;
}

export function formatNumber(num, decimal = 1) {
  num = parseFloat(num);
  if (isNaN(num)) return 0;
  return num.toFixed(decimal);
}

export function formatInt(num) {
  num = parseInt(num);
  if (isNaN(num)) return 0;
  return num;
}
export function formatFloat(num) {
  num = parseFloat(num);
  if (isNaN(num)) return 0;
  return num;
}

function inrange(min, number, max) {
  if (!isNaN(number) && number >= min && number <= max) {
    return true;
  } else {
    return false;
  }
}

export function valid_coords(number_lat, number_lng) {
  // did from component
  number_lat = parseFloat(number_lat);
  number_lng = parseFloat(number_lng);
  if (inrange(-90, number_lat, 90) && inrange(-180, number_lng, 180)) {
    return true;
  }
  return false;
}
