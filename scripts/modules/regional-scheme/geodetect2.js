define(["modules/jquery-mozu", "modules/api", "hyprlive", 'hyprlivecontext'], function($, api, Hypr, HyprLiveContext) {
  $(document).ready(function() {
//    console.log("geodetect2");
    if (HyprLiveContext.locals.pageContext.title === "Set International Cookie") {
//      console.log("Not performing geolocation - on Set International Cookie");
    } else if ($.cookie('browse_us_site') == 'true') {
//      console.log("don't bother user - they have elected to browse the US site");
    } else if ($.cookie('detected_country') == 'US') {
//      console.log('dont bother user - they have previously been detected as being in the US ');
    } else {
//      console.log("do the lookup");
      api.request('GET', 'https://websvc.jellybelly.com/geoip/check').then(function(res) {
        var detected_country = res.country_code;
        $.cookie('detected_country', detected_country, {
          expires: 365,
          path: '/'
        });
        if (detected_country != 'US') {
          var destination = getCountryDestination(detected_country);
          location.href = destination.url;
        }
      });
    }
  });
});

function getCountryDestination(cc) {
  var dest = [

    /* NORTH AMERICA */
    {
      countryCode: 'US',
      url: 'http://www.jellybelly.com'
    },
    {
      countryCode: 'CA',
      url: 'http://www.jellybellyinternational.com'
    },
    {
      countryCode: 'GL',
      url: 'http://www.jellybellyinternational.com'
    },
    {
      countryCode: 'MX',
      url: 'http://www.jellybellyespanol.com'
    },
    {
      countryCode: 'AI',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'AR',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'AW',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'BS',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'BB',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'BZ',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'BM',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'BO',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'BR',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'VG',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'KY',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'CL',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'CO',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'CR',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'CU',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'CW',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'DM',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'DO',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'EC',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'SV',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'FK',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'GP',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'GT',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'GY',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'HT',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'HN',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'JM',
      url: 'http://www.jellybellyespanol.com'
    },
    {
      countryCode: 'MS',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'NI',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'PA',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'PY',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'PE',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'PR',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'BL',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'KN',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'LC',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'MF',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'PM',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'VC',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'SR',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'TT',
      url: 'http://www.jellybellyespanol.com'
    },
    {
      countryCode: 'UY',
      url: 'http://www.jellybellyespanol.com'
    }, {
      countryCode: 'VE',
      url: 'http://www.jellybellyespanol.com'
    },

    /* AFRICA */
    {
      countryCode: 'DZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'AO',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BJ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BW',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BF',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BI',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CV',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CF',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CD',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'DJ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'EG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GQ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ER',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ET',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GW',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CI',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KE',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LS',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LR',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LY',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MW',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ML',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MR',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MU',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NE',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'RE',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'RW',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ST',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SC',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SL',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SO',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ZA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SS',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SD',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'UG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'EH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ZM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ZW',
      url: 'http://www.jellybellyinternational.com'
    },

    /* ASIA */
    {
      countryCode: 'AF',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'AM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'AZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BD',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BT',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CN',
      url: 'http://www.jellybelly.cn'
    }, {
      countryCode: 'GE',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'HK',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'IN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ID',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'IR',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'IQ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'IL',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'JP',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'JO',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KW',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LB',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MO',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MY',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MV',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NP',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KP',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'OM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'PK',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'PH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'QA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KR',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LK',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SY',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TW',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TJ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TR',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'AE',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'UZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'VN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'YE',
      url: 'http://www.jellybellyinternational.com'
    },

    /* AUSTRALIA/OCEANA */
    {
      countryCode: 'AS',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'AU',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'CK',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TL',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'FJ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'PF',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GU',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'KI',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'FM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NR',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NC',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NZ',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NU',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NF',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MP',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'PW',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'PG',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'PN',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'WS',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SB',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TK',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'TV',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'VU',
      url: 'http://www.jellybellyinternational.com'
    },

    /* EUROPE */
    {
      countryCode: 'AL',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'AD',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'AT',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'BY',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BE',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'BA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'BG',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'HR',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'CY',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'CZ',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'DK',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'EE',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'FO',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'FI',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'FR',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'DE',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'GI',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GR',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'HU',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'IS',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'IE',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'IM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'IT',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'XK',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LV',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'LI',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'LT',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'LU',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'MT',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'MK',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MD',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'MC',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'ME',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'NL',
      url: 'http://www.jellybellyintl.com'
    },
    {
      countryCode: 'PL',
      url: 'http://www.jellybellyintl.com'
    },
    {
      countryCode: 'NO',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'PT',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'RO',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'RU',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SM',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'RS',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'SK',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'SI',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'ES',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'SE',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'CH',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'UA',
      url: 'http://www.jellybellyinternational.com'
    }, {
      countryCode: 'GB',
      url: 'http://www.jellybellyintl.com'
    }, {
      countryCode: 'VA',
      url: 'http://www.jellybellyinternational.com'
    }
  ];
  return dest.find(function(c) {
    return c.countryCode == cc;
  }, cc);
}