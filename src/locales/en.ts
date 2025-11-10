import React, { useState, useEffect, useCallback } from 'react';
export default {
    // home screen
    home: {
        search: 'Search',
        view_all: 'View all',
        lcount: {
            one: ' 1 listing',
            other: ' {{count}} listings',
            zero: 'No listing',
        },
        discoverNew: 'Propiedades Destacadas',
        popular: 'Popular this week',
        from: 'from',
        recommend: 'Recommend for you',
    },
    archive: {
        filter: 'Filter',
        no_results: 'Opps! No results found',
        no_more: 'No more listings to load',
    },
    slisting: {
        cats: 'CATEGORIES',
        facts: 'FACTS',
        feas: 'FEATURES',
        photos: 'PHOTOS',
        tags: 'TAGS',
        map: 'MAP',
        hosted_by: 'HOSTED BY',
        hosted_by_email: 'Email',
        hosted_by_phone: 'Phone',
        contact_address: 'Address',
        contact_email: 'Email',
        contact_phone: 'Phone',
        contact_web: 'Website',
        call_phone_error: 'Can not make a call to the phone number',
        view_room_images: 'View gallery',
        // event
        ticket_available: {
            one: '1 available',
            other: '{{count}} available',
            zero: 'Unavailable',
        },
        filter_all: 'All',
        reviews: 'REVIEWS',

        all_content: 'Show details',
        close_content: 'Close details',
        all_comments: 'Read all reviews',
        close_comments: 'Close reviews',
        write_review: 'Write a review',

        claim_listing: 'Claim listing',
        report_listing: 'Report listing',
        bookmark_listing: 'Bookmark listing',
        oops: 'Oops!',
        already_bookmarked: 'This listing has been bookmarked.',

        _ok: 'OK',
        title_ok: 'Listing bookmarked',
        title_wrong: 'Oops!',

        share: 'Share',
        share_email: 'Email',
        share_copylink: 'Copy link',
        share_sms: 'SMS',
        share_facebook: 'Facebook',
        share_twitter: 'Twitter',
        share_more: 'More',
        share_web: 'Visit website',

        link_copied: 'Listing url copied',
        email_subject: 'Email for {{listing}} listing',
        email_message: 'I want to booking {{listing}} listing. And here is the listing url: {{url}}',
        send_email_error: 'The mail can not be send',

        sms_message: 'I want to booking {{listing}} listing. And here is the listing url: {{url}}',
        send_sms_error: 'The sms can not be send',

        open_web_error: 'Can not open the site',

        share_dialog_title: 'Share listing',
        share_title: 'Share {{listing}}',
        share_message: 'I be love this {{listing}} listing',

    },

    // claim screen
    claim: {
        intro: 'Please provide your verification details',
        details: 'Additional info',
        send_claim: 'SUBMIT',
        done: 'DONE',
        try_again: 'TRY AGAIN',

        title_ok: 'Your claim is sent',
        title_wrong: 'Some thing went wrong',
        details_length: 'Your claim details is too short',

        listing: 'Listing: {{title}}',
    },
    report: {
        intro: 'Why are you reporting this listing?',
        details: 'Additional info',
        send_report: 'SUBMIT',
        done: 'DONE',
        try_again: 'TRY AGAIN',

        title_ok: 'Your report is sent',
        title_wrong: 'Some thing went wrong',
        details_length: 'Your report details is too short',

        listing: 'Listing: {{title}}',
    },
    reviews: {
        yname: 'Your name',
        yemail: 'Your email',
        ycomment: 'Your review',
        send_comment: 'SEND',
        done: 'DONE',
        try_again: 'TRY AGAIN',

        title_ok: 'Your review is sent',
        message_ok: '',
        title_wrong: 'Some thing went wrong',
        message_wrong: '',
        name_length: 'Your name is too short',
        email_length: 'Your email is too short',
        email_wrong: 'Please enter your real email address',
        review_length: 'Your review is too short',
    },
    chat: {
        hTitle: 'CONTACTS',
    },
    reply: {
        new_chat: 'Chat with author',
        no_more: 'No more replies to load',
        contacts: 'Contacts',
        send_listing: 'Send listing',
    },
    filter: {
        hTitle: 'FILTER',
        reset: 'Reset',
        apply: 'APPLY',
        newest: 'Newest',
        nearme: 'Near me',
        nearby: {
            one: 'Show listings nearby 1 km',
            other: 'Show listings nearby {{count}} km',
            zero: 'Nearby off',
        },
        prices: '{{min}} - {{max}}',

        categories: 'CATEGORIES',
        facilities: 'FACILITIES',
        open_now: 'Open now',
        cities: 'CITIES',
        distance: 'DISTANCE',
        price: 'PRICE',
        layout: 'LAYOUT',
        tags: 'TAGS',
        sortby: 'SORT BY',
        top_rated: 'Top Rated',
        most_reviewed: 'Most Reviewed',
        most_viewed: 'Most View',
        most_liked: 'Most Liked',
        price_high: 'Highest Price',
        price_low: 'Lowest Price',
    },
    // profile screen
    profile: {
        notis: 'Notifications',

        logout: 'Logout',
        chat: 'Chat',
        currency: 'Currency',
        language: 'Language',
        // chat: 'Chat',
        about_us: 'About us',
        help_center: 'Help center',
        privacy_policy: 'Privacy policy',
        terms_conditions: 'Terms & conditions',
        my_cards: 'My Cards',
    },
    // edit profile screen
    editprofile: {
        title: 'EDIT PROFILE',
        fname: 'First name',
        lname: 'Last name',
        dname: 'Display name',
        username: 'Username',
        description: 'Description',
        email: 'Registered email',
        contact_email: 'Contact email',
        phone: 'Phone',
        website: 'Website',
        address: 'Address',
        company: 'Company',
        gender: 'Gender',
        birth: 'Date of birth',
        save: 'SAVE',

        title_ok: 'Your profile is saved',
        message_ok: '',
        title_wrong: 'Some thing went wrong',
        message_wrong: '',
        done: 'DONE',
    },
    // notifications screen
    notifications: {
        title: 'NOTIFICATIONS',
        no_result: 'You have no notification',
        no_more: 'No more data to load',
    },
    currency: {
        title: 'CURRENCY',
        apply: 'CHANGE',
        no_currency: 'The site have no currecy',
        changed: 'Currency changed',
    },
    bookmarks: {
        no_results: 'Oops! No bookmarks found',
    },
    bookings: {
        no_results: 'You have no booking',
        no_more: 'No more booking to load',
        loading: 'Loading',
        total: 'Total',
        status: 'Status',
        // status
        pending: 'Pending review',
        canceled: 'Canceled',
        completed: 'Approved',
    },
    sbooking: {
        id: 'Booking ID',
        view_profile: 'view profile',
        listing: 'Listing',
        subtotal: 'Subtotal',
        taxes: 'Tax',
        fees: 'Fee',
        total: 'Total',
        payment: 'Payment method',
        checkin: 'Checkin',
        checkout: 'Checkout',

        tickets: 'Tickets',
        quantity: 'Quantity',
        slots: 'Slots',
        rooms: 'Hotel Rooms',
        menus: 'Menus',
        addservices: 'Additional services',

        cancel: 'Cancel booking',
        canceled_message: 'Booking canceled',

        notes: 'Notes',
        persons: 'Persons',
        adults: 'Adults',
        children: 'Children',
        infants: 'Infants',
    },
    // button tabs
    explore: "Explore",
    nearme: "Near Me",
    mybookings: 'My Bookings',
    bookmarksTab: 'Saved',
    profileMenu: 'Profile',
    // location request
    locrequest: {
        title: 'CTHthemes App',
        message: 'CTHthemes App would like to access your location',
        denied: 'Location permission denied',
    },
    // filter
    viewMore: 'Show more',
    viewLess: 'Close',
    km: 'km',
    cancel: 'Cancel',
    btn_ok: 'Ok',
    btn_close: 'Close',
    // screen titles
    dates_screen: 'SELECT DATES',
    bk_screen: 'BOOKING',
    bm_screen: 'BOOKMARKS',
    ck_screen: 'CHECKOUT',
    loc_screen: 'LOCATIONS',
    cat_screen: 'CATEGORIES',
    ac_screen: 'LISTINGS',
    chat_screen: 'Chats',
    reviews_screen: 'ADD REVIEW',
    claim_screen: 'CLAIM LISTING',
    report_screen: 'REPORT LISTING',
    currency_screen: 'CURRENCY',
    language_screen: 'LANGUAGE',
    bks_screen: 'BOOKINGS',
    sbk_screen: 'BOOKING DETAILS',
    // login screen
    login_hi: 'Hi',
    login_welcome: 'Welcome back!',
    user_email: 'Username/Email',
    password: 'Password',
    forget_password: 'Forget your password?',
    login: 'LOGIN',
    dont_have_account: 'Don\'t have an account?',
    sign_up: 'Sign Up',
    login_done: 'DONE',
    login_try_again: 'TRY AGAIN',
    login_wrong: 'Something went wrong',
    login_enter_email: 'Please enter your username/email',

    // forget password screen
    forget_title: 'Forget password',
    forget_message: 'Please enter your email address. You will receive a link to create new password via email.',
    forget_user_email: 'Username/Email',
    forget_done: 'DONE',
    forget_try_again: 'TRY AGAIN',
    forget_send: 'SEND',
    forget_wrong: 'Something went wrong',
    forget_enter_email: 'Please enter your username/email',
    forget_email_placeholder: 'Enter your email address',
    forget_invalid_email: 'Please enter a valid email address',
    forget_error_title: 'Error',
    forget_error_message: 'An error occurred. Please try again.',
    forget_sending: 'Sending...',
    // signup screen
    signup_title: 'Create an account',
    signup_username: 'Username',
    signup_email: 'Email',
    signup_password: 'Password',
    signup_done: 'DONE',
    signup_try_again: 'TRY AGAIN',
    signup_signup: 'SIGN UP',
    signup_terms: 'By clicking Sign Up you agree to the following ',
    signup_terms_conditions: 'Terms and Conditions',
    signup_wrong: 'Something went wrong',
    signup_enter_email: 'Please enter your username, email address and password',

    // checkout screen
    ck_notes: 'BOOKING NOTE',
    ck_notes_plh: 'Enter additional inquiries',
    ck_coupon_plh: 'Coupon code here',
    ck_payments: 'PAYMENT METHOD',
    ck_submit: 'Submit booking',

    ck_gohome: 'Continue Exploring',
    ck_go_booking: 'Go to bookings',
    ck_try_again: 'TRY AGAIN',
    ck_wrong: 'Something went wrong',
    ck_wrong_message: 'Contact us for more detials',
    ck_ok: 'Your booking is received',
    ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    checkout: {
        no_payment: 'Please select a payment method',
        waiting_payment: 'Waiting for payment',
    },
    // price per
    pernight: 'per night',
    perday: 'per day',
    perperson: 'per person',
    // booking screen
    bk_tickets: 'Tickets',
    bk_slots: 'Slots',
    bk_rooms: 'Rooms',
    bk_menus: 'Menus',
    bk_quantity: 'Quantity',
    bk_persons: 'Persons',
    bk_adults: 'Adults',
    bk_children: 'Children',
    bk_infants: 'Infants',
    booking: {

    },
    evt_start: 'Start at {{time}}',
    evt_end: 'End {{time}}',
    // for booking price per
    listing: {
        // single listing bottom
        single: {
            other: '{{price}}',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per listing.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One slot available, hurry up.',
            other: '{{count}} slots available.',
            zero: 'No slot available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per listing',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 night',
            other: 'x{{count}} nights',
            zero: 'One day selected',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Show dates',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },

    per_person: {
        // single listing bottom
        single: {
            other: 'From {{price}}/person',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per person.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One person available, hurry up.',
            other: '{{count}} persons available.',
            zero: 'No person available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per person',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 day',
            other: 'x{{count}} dats',
            zero: 'You must select a date',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Check available',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    per_night: {
        // single listing bottom
        single: {
            other: '{{price}}/NIGHT',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per person.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One slot available, hurry up.',
            other: '{{count}} slots available.',
            zero: 'No slot available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per night',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 night',
            other: 'x{{count}} nights',
            zero: 'One day selected',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Show dates',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    night_person: {
        // single listing bottom
        single: {
            other: '{{price}}/NIGHT',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per person.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One slot available, hurry up.',
            other: '{{count}} slots available.',
            zero: 'No slot available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per night',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 night',
            other: 'x{{count}} nights',
            zero: 'One day selected',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Show dates',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    per_day: {
        // single listing bottom
        single: {
            other: '{{price}}/DAY',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per slot.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One slot available, hurry up.',
            other: '{{count}} slots available.',
            zero: 'No slot available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per day',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 night',
            other: 'x{{count}} nights',
            zero: 'One day selected',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Show dates',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    day_person: {
        // single listing bottom
        single: {
            other: '{{price}}/DAY',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per slot.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One slot available, hurry up.',
            other: '{{count}} slots available.',
            zero: 'No slot available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per day',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 night',
            other: 'x{{count}} nights',
            zero: 'One day selected',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Show dates',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    per_hour: {
        // single listing bottom
        single: {
            other: '{{price}}/DAY',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per slot.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One slot available, hurry up.',
            other: '{{count}} slots available.',
            zero: 'No slot available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per day',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 night',
            other: 'x{{count}} nights',
            zero: 'One day selected',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Show dates',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    hour_person: {
        // single listing bottom
        single: {
            other: '{{price}}/DAY',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per slot.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One slot available, hurry up.',
            other: '{{count}} slots available.',
            zero: 'No slot available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: '{{price}} per day',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 night',
            other: 'x{{count}} nights',
            zero: 'One day selected',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Show dates',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    event_single: {
        // single listing bottom
        single: {
            other: 'From {{price}}/ticket',
            zero: 'Free booking',
        },

        // for tickets on available screen
        slot_price: '{{price}} per ticket.',
        slot_available: {
            one: ' One ticket available',
            other: ' {{count}} tickets available.',
            zero: 'No ticket available',
        },
        // for ticket available on booking screen
        bk_slot_avai: {
            one: 'One ticket available, hurry up.',
            other: '{{count}} tickets available.',
            zero: 'No ticket available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: 'From {{price}} per ticket',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 day',
            other: 'x{{count}} dats',
            zero: 'You must select a date',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Select tickets',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',


    },
    // restaurant
    none: {
        // single listing bottom
        single: {
            other: 'From {{price}}',
            zero: 'Free booking',
        },

        // for slots on available screen
        slot_price: '{{price}} per person.',
        slot_available: {
            one: ' One slot available',
            other: ' {{count}} slots available.',
            zero: 'No slot available',
        },
        // for slot available on booking screen
        bk_slot_avai: {
            one: 'One available, hurry up.',
            other: '{{count}} available.',
            zero: 'No available',
        },
        // for listing detail on booking screen
        bk_listing: {
            other: 'From {{price}}',
            zero: 'Free booking',
        },
        // for free booking on booking screen
        bk_free: 'Free booking',
        // for room adults on booking screen
        bk_room_adults: {
            one: 'One adult',
            other: 'Adults: {{count}}',
            zero: 'Not for adults',
        },
        // for room children on booking screen
        bk_room_children: {
            one: 'One children',
            other: 'Children: {{count}}',
            zero: 'Not for children',
        },
        // for room available on booking screen
        bk_room_avai: {
            one: 'One room available for booking.',
            other: '{{count}} rooms available for booking.',
            zero: 'No available room.',
        },
        // for checkin on booking screen
        bk_checkin: 'Checkin:',
        // for checkout on booking screen
        bk_checkout: 'Checkout:',
        // for days/nights on booking screen
        bk_days_nights: {
            one: 'x1 day',
            other: 'x{{count}} dats',
            zero: 'You must select a date',
        },
        bk_addservices: 'Additional services',
        // for subtotal on booking screen
        bk_subtotal: 'Subtotal',
        bk_tax: 'Tax',
        bk_fees: 'Additional Fees',
        bk_total: 'Total',
        // for booking buttons
        btn_book_now: 'Check available',
        btn_continue: 'Continue',
        btn_bk_book_now: 'Book now',
        // for checkout success popup
        ck_ok: 'Your booking is received',
        ck_ok_message: 'The listing author will contact with you soon. You can also login with your email to manage bookings.',
    },
    
    // Near screen translations
    search_nearby: 'Search nearby',
    nearby_listings: 'Nearby Listings',
    no_listings_found: 'No listings found',
    location_permission: 'Location Permission',
    location_permission_message: 'This app needs access to your location to show nearby listings.',
    ask_me_later: 'Ask me later',
    location_error: 'Location Error',
    location_error_message: 'Unable to get your current location. Please check your location settings.',
    get_location: 'Get Location',
    get_location_hint: 'Tap to get your current location',
    clear_search: 'Clear search',
    results: 'results',
    
    // Additional missing translations
    add_review: 'Add Review',
    address_copied: 'Address copied to clipboard',
    already_have_account: 'Already have an account?',
    anonymous: 'Anonymous',
    book_now: 'Book Now',
    choose_photo: 'Choose Photo',
    edit_profile: 'Edit Profile',
    failed_to_load_listing: 'Failed to load listing',
    first_name: 'First Name',
    last_name: 'Last Name',
    listing_not_found: 'Listing not found',
    loading_rooms: 'Loading rooms...',
    my_bookings: 'My Bookings',
    no_booking_data: 'No booking data available',
    no_menus_available: 'No menus available',
    no_person_slots_available: 'No person slots available',
    no_rooms_available: 'No rooms available',
    no_services_available: 'No services available',
    no_slots_available: 'No slots available',
    no_tickets_available: 'No tickets available',
    no_time_slots_available: 'No time slots available',
    permission_error: 'Permission Error',
    person_slots: 'Person Slots',
    proceed_to_checkout: 'Proceed to Checkout',
    register: 'Register',
    register_subtitle: 'Create your account',
    registration_error: 'Registration Error',
    registration_failed: 'Registration Failed',
    registration_success: 'Registration Successful',
    registration_success_message: 'Your account has been created successfully',
    select_date: 'Select Date',
    select_menus: 'Select Menus',
    select_photo: 'Select Photo',
    select_rooms: 'Select Rooms',
    select_services: 'Select Services',
    select_tickets: 'Select Tickets',
    select_time_slots: 'Select Time Slots',
    selected: 'Selected',
    show_all: 'Show All',
    show_less: 'Show Less',
    sign_in: 'Sign In',
    sign_in_subtitle: 'Sign in to your account',
    take_photo: 'Take Photo',
    time_slots: 'Time Slots',
    try_different_keywords: 'Try different keywords',
    unavailable: 'Unavailable',
    welcome_back: 'Welcome Back',
    zip_code: 'Zip Code',
    quantity: 'Quantity',
    persons: 'Persons',
    total: 'Total',
    
    // Error messages
    error: 'Error',
    ok: 'OK',
    loading: 'Loading',
    location: 'Location',
    per_night: 'per night',
    chat: 'Chat',
    
    // Additional missing translations from .tsx files
    by_registering_you_agree: 'By registering you agree to our',
    confirm_password_placeholder: 'Confirm your password',
    email_or_username: 'Email or Username',
    forgot_password: 'Forgot Password?',
    login_empty: 'Please enter your credentials',
    login_error: 'Login failed. Please try again.',
    password_requirements: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    passwords_do_not_match: 'Passwords do not match',
    username_invalid_chars: 'Username can only contain letters, numbers, and underscores',
    username_min_length: 'Username must be at least 3 characters long',
    username_required: 'Username is required',
    email_required: 'Email is required',
    email_invalid: 'Please enter a valid email address',
    password_required: 'Password is required',
    password_min_length: 'Password must be at least 6 characters long',
    confirm_password_required: 'Please confirm your password',
    create_account: 'Create Account',
    booking_success: 'Booking Successful',
    booking_confirmed: 'Your booking has been confirmed',
    booking_failed: 'Booking Failed',
    booking_error: 'An error occurred while processing your booking',
    booking_summary: 'Booking Summary',
    personal_information: 'Personal Information',
    address_information: 'Address Information',
    payment_method: 'Payment Method',
    cash_payment: 'Cash Payment',
    online_payment: 'Online Payment',
    enter_first_name: 'Enter your first name',
    enter_last_name: 'Enter your last name',
    enter_email: 'Enter your email address',
    enter_phone: 'Enter your phone number',
    enter_address: 'Enter your address',
    enter_city: 'Enter your city',
    enter_zip_code: 'Enter your zip code',
    enter_country: 'Enter your country',
    enter_notes: 'Enter any additional notes',
    confirm_booking: 'Confirm Booking',
    display_name: 'Display Name',
    enter_display_name: 'Enter your display name',
    enter_company: 'Enter your company name',
    date_of_birth: 'Date of Birth',
    enter_description: 'Enter your description',
    profile_updated: 'Profile Updated',
    profile_updated_successfully: 'Your profile has been updated successfully',
    search_placeholder: 'Search for listings...',
    search_something: 'Search for something',
    no_results_found: 'No results found',
    
    // Missing keys from registration screen
    username: 'Username',
    enter_username: 'Enter your username',
    email: 'Email',
    enter_password: 'Enter your password',
    confirm_password: 'Confirm Password',
    terms_conditions: 'Terms & Conditions',
    and: 'and',
    privacy_policy: 'Privacy Policy',
    
    // Missing keys from explore/home screens
    nearby: 'Nearby',
    categories: 'Categories',
    discover_new: 'Discover New',
    view_all: 'View All',
};