
define([
    'underscore',
    'modules/jquery-mozu',
    'modules/models-product', 
    'modules/url-dispatcher',
    'modules/intent-emitter',
    'modules/get-partial-view',
    'hyprlive',
    'modules/api',
    'modules/cart-monitor',
    'modules/minicart',
    (location.href.indexOf('beanboozled-fiery-five') > -1 ? 'pages/fiery-five-challenge' : 'pages/beanboozled-challenge'),
    'modules/models-faceting',
    'shim!vendor/jquery.quickview[jquery=jQuery]',
    'shim!vendor/owl.carousel[jquery=jQuery]>jQuery', 
    'shim!vendor/jquery-colorbox/jquery.colorbox[jquery=jQuery]>jQuery'
], function(_, $, ProductModels, UrlDispatcher, IntentEmitter, getPartialView, Hypr, api, CartMonitor,MiniCart,custom,FacetingModels) {    
    // flavor guide option on render the view. for the Brand landing section.
    var flavour_Guides1 = [
        {
            "name" : "Jelly Belly Official Flavors",
            "shopName" : "Official Flavors",
            "category" : "335",
            "guide" : "original50",
            "description" : "The most amazing, delightful and delicious collection of gourmet jelly beans is an adventure in taste. The best and most popular flavors we&apos;ve made are gathered in the Official flavors, your guide to discovering each and every one. Whatever your preferences we are absolutely sure there is a flavor here for you.  Eating Directions: Savor one flavor at a time to experience the true and distinctive taste of each Jelly Belly bean. Or, experiment by combining flavors in a Jelly Belly Recipe to create an entirely original taste experience.",
            "childcategories" : [{
                    "name" : "A&W&reg; Cream Soda",
                    "slug" : "13",
                    "image" : "Cream-Soda-Signature-ns_fg.jpg"
                }, {
                    "name" : "A&W&reg; Root Beer",
                    "slug" : "73",
                    "image" : "Root-Beer-Signature-ns_fg.jpg"
                }, {
                    "name" : "Berry Blue",
                    "slug" : "66",
                    "image" : "Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Blueberry",
                    "slug" : "67",
                    "image" : "Blueberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Bubble Gum",
                    "slug" : "18",
                    "image" : "Bubble-Gum-Signature-ns_fg.jpg"
                }, {
                    "name" : "Buttered Popcorn",
                    "slug" : "68",
                    "image" : "Buttered-Popcorn-Signature-ns_fg.jpg"
                }, {
                    "name" : "Cantaloupe",
                    "slug" : "69",
                    "image" : "Cantaloupe-Signature-ns_fg.jpg"
                }, {
                    "name" : "Cappuccino",
                    "slug" : "70",
                    "image" : "Cappuccino-Signature-ns_fg.jpg"
                }, {
                    "name" : "Caramel Corn",
                    "slug" : "71",
                    "image" : "Caramel-Corn-Signature-ns_fg.jpg"
                }, {
                    "name" : "Chili Mango",
                    "slug" : "189",
                    "image" : "Chili-Mango-Signature-ns_fg.jpg"
                }, {
                    "name" : "Chocolate Pudding",
                    "slug" : "74",
                    "image" : "Chocolate-Pudding-Signature-ns_fg.jpg"
                }, {
                    "name" : "Cinnamon",
                    "slug" : "75",
                    "image" : "Cinnamon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "14",
                    "image" : "Coconut-Signature-ns_fg.jpg"
                }, {
                    "name" : "Cotton Candy",
                    "slug" : "15",
                    "image" : "Cotton-Candy-Signature-ns_fg.jpg"
                }, {
                    "name" : "Crushed Pineapple",
                    "slug" : "76",
                    "image" : "Crushed-Pineapple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Dr Pepper&reg;",
                    "slug" : "77",
                    "image" : "Dr-Pepper-Signature-ns_fg.jpg"
                }, {
                    "name" : "French Vanilla",
                    "slug" : "16",
                    "image" : "French-Vanilla-Signature-ns-2_fg.jpg"
                }, {
                    "name" : "Green Apple",
                    "slug" : "79",
                    "image" : "Green-Apple-Signature-ns-copy_fg.jpg"
                }, {
                    "name" : "Island Punch",
                    "slug" : "80",
                    "image" : "Island-Punch-Signature-ns_fg.jpg"
                }, {
                    "name" : "Juicy Pear",
                    "slug" : "81",
                    "image" : "Juicy-Pear-Signature-ns_fg.jpg"
                }, {
                    "name" : "Kiwi",
                    "slug" : "274",
                    "image" : "Kiwi-Signature-ns_fg.jpg"
                }, {
                    "name" : "Lemon Drop",
                    "slug" : "83",
                    "image" : "Lemon-Drop-Signature-ns_fg.jpg"
                }, {
                    "name" : "Lemon Lime",
                    "slug" : "85",
                    "image" : "Lemon-Lime-Signature-ns_fg.jpg"
                }, {
                    "name" : "Licorice",
                    "slug" : "86",
                    "image" : "Licorice-Signature-ns_fg.jpg"
                }, {
                    "name" : "Mango",
                    "slug" : "87",
                    "image" : "Mango-Signature-ns_fg.jpg"
                }, {
                    "name" : "Margarita",
                    "slug" : "88",
                    "image" : "Margarita-Signature-ns_fg.jpg"
                }, {
                    "name" : "Mixed Berry Smoothie",
                    "slug" : "190",
                    "image" : "Mixed-Berry-Smoothie-ns_fg.jpg"
                }, {
                    "name" : "Orange Sherbet",
                    "slug" : "91",
                    "image" : "Orange-Sherbet-Signature-ns_fg.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "92",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Pina Colada",
                    "slug" : "93",
                    "image" : "Pina-Colada-Signature-ns_fg.jpg"
                }, {
                    "name" : "Plum",
                    "slug" : "95",
                    "image" : "Plum-Signature-ns_fg.jpg"
                }, {
                    "name" : "Pomegranate",
                    "slug" : "96",
                    "image" : "pom-Signature_LD-Spot_NEW(fin)-ns_fg.jpg"
                }, {
                    "name" : "Raspberry",
                    "slug" : "97",
                    "image" : "Raspberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Red Apple",
                    "slug" : "98",
                    "image" : "Red-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sizzling Cinnamon",
                    "slug" : "99",
                    "image" : "Sizzling-Cinnamon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Cherry",
                    "slug" : "191",
                    "image" : "Sour-Cherry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Cheesecake",
                    "slug" : "17",
                    "image" : "Strawberry-Cheesecake-Sig-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Daiquiri",
                    "slug" : "100",
                    "image" : "Strawberry-Daiquiri-Sig-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Jam",
                    "slug" : "101",
                    "image" : "Strawberry-Jam-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Lemon",
                    "slug" : "84",
                    "image" : "Lemon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Lime",
                    "slug" : "185",
                    "image" : "Lime-Sunkist-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Orange",
                    "slug" : "90",
                    "image" : "Orange-Juice-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Pink Grapefruit",
                    "slug" : "94",
                    "image" : "Pink-Grapefruit-Signature-new-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Tangerine",
                    "slug" : "102",
                    "image" : "TangerineSignatureSK-ns_fg.jpg"
                }, {
                    "name" : "Toasted Marshmallow",
                    "slug" : "103",
                    "image" : "Toasted-Marshmallow-Sig-ns_fg.jpg"
                }, {
                    "name" : "Top Banana",
                    "slug" : "104",
                    "image" : "Top-Banana-Signature-ns_fg.jpg"
                }, {
                    "name" : "Tutti-Fruitti",
                    "slug" : "105",
                    "image" : "Tutti-Fruitti-Signature-ns_fg.jpg"
                }, {
                    "name" : "Very Cherry",
                    "slug" : "106",
                    "image" : "Very-Cherry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Watermelon",
                    "slug" : "107",
                    "image" : "Watermelon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Wild Blackberry",
                    "slug" : "108",
                    "image" : "Wild-Blackberry-Signature-ns_fg.jpg"
                }
            ]
        },
        /*{
            "name" : "BeanBoozled&reg; 3rd Edition Flavors",
            "shopName" : "BeanBoozled&reg; Flavors",
            "category" : "341",
            "guide" : "beanboozled",
            "description" : "BeanBoozled&reg; 3rd Edition collection dares you to compare some of our tastiest, most popular flavors with our weird and wild flavors. But here's the catch - you won't know which ones are which! The Black Licorice bean looks exactly like the Skunk Spray bean! Sweet, luscious Caramel Corn might also be Moldy Cheese. You may think you're tasting our world-famous Buttered Popcorn bean, but what you'll be biting into could actually be Rotten Egg. The only way to find out what beans you're getting is to eat them!",
            "childcategories" : [{
                    "name" : "Berry Blue",
                    "slug" : "341",
                    "image" : "berryBlue.jpg"
                }, {
                    "name" : "Toothpaste",
                    "slug" : "341",
                    "image" : "berryBlue.jpg"
                }, {
                    "name" : "Buttered Popcorn",
                    "slug" : "341",
                    "image" : "popcorn.jpg"
                }, {
                    "name" : "Rotten Egg",
                    "slug" : "341",
                    "image" : "popcorn.jpg"
                }, {
                    "name" : "Caramel Corn",
                    "slug" : "341",
                    "image" : "CarmelCorn.jpg"
                }, {
                    "name" : "Moldy Cheese",
                    "slug" : "341",
                    "image" : "CarmelCorn.jpg"
                }, {
                    "name" : "Chocolate Pudding",
                    "slug" : "341",
                    "image" : "ChocolatePudding.jpg"
                }, {
                    "name" : "Canned Dog Food",
                    "slug" : "341",
                    "image" : "ChocolatePudding.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "341",
                    "image" : "Coconut.jpg"
                }, {
                    "name" : "Baby Wipes",
                    "slug" : "341",
                    "image" :
                    "Coconut.jpg"
                }, {
                    "name" : "Juicy Pear",
                    "slug" : "341",
                    "image" : "Pear.jpg"
                }, {
                    "name" : "Booger",
                    "slug" : "341",
                    "image" : "Pear.jpg"
                }, {
                    "name" : "Lime",
                    "slug" : "341",
                    "image" : "lime.jpg"
                }, {
                    "name" : "Lawn Clippings",
                    "slug" : "341",
                    "image" : "lime.jpg"
                }, {
                    "name" : "Licorice",
                    "slug" : "341",
                    "image" : "Licorice.jpg"
                }, {
                    "name" : "Skunk Spray",
                    "slug" : "341",
                    "image" : "Licorice.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "341",
                    "image" : "Peach.jpg"
                }, {
                    "name" : "Barf",
                    "slug" : "341",
                    "image" : "Peach.jpg"
                }, {
                    "name" : "Tutti-Fruitti",
                    "slug" : "341",
                    "image" : "tuttiFruitti.jpg"
                }, {
                    "name" : "Stinky Socks",
                    "slug" : "341",
                    "image" : "tuttiFruitti.jpg"

                }
            ]
        },
        */
        {
            "name" : "BeanBoozled&reg; 5th Edition Flavors",
            "shopName" : "BeanBoozled&reg; Flavors",
            "category" : "341",
            "guide" : "beanboozled",
            "description" : "BeanBoozled&reg; 5th Edition is the latest collection of weird and wild flavors paired with our tastiest and most popular flavors. But here&apos;s the catch - you won&apos;t know which ones are which! The new 5th Edition introduces two new pairings: the delightful Birthday Cake jelly bean looks exactly like Dirty Dishwater! Popular Toasted Marshmallow might also be Stink Bug. The only way to find out what beans you're getting is to eat them! ",
            "childcategories" : [{
                    "name" : "Dirty Dishwater",
                    "slug" : "341",
                    "image" : "Birthdaycake-Signature-ns_fg.jpg"
                }, {
                    "name" : "Birthday Cake",
                    "slug" : "341",
                    "image" : "Birthdaycake-Signature-ns_fg.jpg"
                }, {
                    "name" : "Stink Bug",
                    "slug" : "341",
                    "image" : "Toasted-Marshmallow-Sig-ns_fg.jpg"
                }, {
                    "name" : "Toasted Marshmallow",
                    "slug" : "341",
                    "image" : "Toasted-Marshmallow-Sig-ns_fg.jpg"
                }, {
                    "name" : "Dead Fish",
                    "slug" : "341",
                    "image" : "Strawberry-Banana-Smoothie-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Banana Smoothie",
                    "slug" : "341",
                    "image" : "Strawberry-Banana-Smoothie-ns_fg.jpg"
                }, {
                    "name" : "Spoiled Milk",
                    "slug" : "341",
                    "image" : "Coconut-Signature-ns_fg.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "341",
                    "image" : "Coconut-Signature-ns_fg.jpg"
                }, {
                    "name" : "Toothpaste",
                    "slug" : "341",
                    "image" : "Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Berry Blue",
                    "slug" : "341",
                    "image" : "Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Rotten Egg",
                    "slug" : "341",
                    "image" : "Buttered-Popcorn-Signature-ns_fg.jpg"
                }, {
                    "name" : "Buttered Popcorn",
                    "slug" : "341",
                    "image" : "Buttered-Popcorn-Signature-ns_fg.jpg"
                }, {
                    "name" : "Canned Dog Food",
                    "slug" : "341",
                    "image" : "Chocolate-Pudding-Signature-ns_fg.jpg"
                }, {
                    "name" : "Chocolate Pudding",
                    "slug" : "341",
                    "image" : "Chocolate-Pudding-Signature-ns_fg.jpg"
                }, {
                    "name" : "Booger",
                    "slug" : "341",
                    "image" : "Juicy-Pear-Signature-ns_fg.jpg"
                }, {
                    "name" : "Juicy Pear",
                    "slug" : "341",
                    "image" : "Juicy-Pear-Signature-ns_fg.jpg"
                }, {
                    "name" : "Barf",
                    "slug" : "341",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "341",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Stinky Socks",
                    "slug" : "341",
                    "image" : "Tutti-Fruitti-Signature-ns_fg.jpg"

                }, {
                    "name" : "Tutti-Fruitti",
                    "slug" : "341",
                    "image" : "Tutti-Fruitti-Signature-ns_fg.jpg"
                }
            ]
        },{
            "name" : "BeanBoozled&reg; Minion Edition Flavors",
            "shopName" : "BeanBoozled&reg; Flavors",
            "category" : "715",
            "guide" : "beanboozled-minion",
            "description" : 'BeanBoozled has been "Minionized" with a new mix of 10 delicious flavors (like Ba-na-na) paired along with 10 wild flavors (like Minion Fart). Dare to compare by spinning the included spinner wheel to see what flavor pair you will land. Will you get BeanBoozled?',
            "childcategories" : [{
                    "name" : "Minion Fart",
                    "slug" : "715",
                    "image" : "Sour-Apple-Signature-minions2.jpg"
                }, {
                    "name" : "Sour Apple",
                    "slug" : "715",
                    "image" : "Sour-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Pencil Shavings",
                    "slug" : "715",
                    "image" : "Top-Banana-Signature-minions.jpg"
                }, {
                    "name" : "Ba-na-na",
                    "slug" : "715",
                    "image" : "Top-Banana-Signature-ns_fg.jpg"
                }, {
                    "name" : "Dead Fish",
                    "slug" : "715",
                    "image" : "Strawberry-Banana-Smoothie-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Banana Smoothie",
                    "slug" : "715",
                    "image" : "Strawberry-Banana-Smoothie-ns_fg.jpg"
                }, {
                    "name" : "Spoiled Milk",
                    "slug" : "715",
                    "image" : "Coconut-Signature-ns_fg.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "715",
                    "image" : "Coconut-Signature-ns_fg.jpg"
                }, {
                    "name" : "Toothpaste",
                    "slug" : "715",
                    "image" : "Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Berry Blue",
                    "slug" : "715",
                    "image" : "Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Rotten Egg",
                    "slug" : "715",
                    "image" : "Buttered-Popcorn-Signature-ns_fg.jpg"
                }, {
                    "name" : "Buttered Popcorn",
                    "slug" : "715",
                    "image" : "Buttered-Popcorn-Signature-ns_fg.jpg"
                }, {
                    "name" : "Canned Dog Food",
                    "slug" : "715",
                    "image" : "Chocolate-Pudding-Signature-ns_fg.jpg"
                }, {
                    "name" : "Chocolate Pudding",
                    "slug" : "715",
                    "image" : "Chocolate-Pudding-Signature-ns_fg.jpg"
                }, {
                    "name" : "Booger",
                    "slug" : "715",
                    "image" : "Juicy-Pear-Signature-ns_fg.jpg"
                }, {
                    "name" : "Juicy Pear",
                    "slug" : "715",
                    "image" : "Juicy-Pear-Signature-ns_fg.jpg"
                }, {
                    "name" : "Barf",
                    "slug" : "715",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "715",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Stinky Socks",
                    "slug" : "715",
                    "image" : "Tutti-Fruitti-Signature-ns_fg.jpg"

                }, {
                    "name" : "Tutti-Fruitti",
                    "slug" : "715",
                    "image" : "Tutti-Fruitti-Signature-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Mixed Emotions&trade; Flavors",
            "shopName" : "Mixed Emotions&trade; Flavors",
            "category" : "711",
            "guide" : "mixed-emotions",
            "description" : "Jelly Belly favorite flavors of jelly beans are paired with an emotion, and imprinted with a face to show off those feelings. Happy tastes like refreshing lemon, playful teases the taste buds with sour apple, grumpy sears like sizzling cinnamon, sad envelopes you in berry blue and love warms the soul with Orange Crush&reg;. Enjoy each flavor individually, or combine to create your own delicious mix of emotions.",
            "childcategories" : [{
                    "name" : "Happy Lemon",
                    "slug" : "711",
                    "image" : "Lemon-Signature-face_fg.jpg"
                }, {
                    "name" : "Grumpy Sizzling Cinnamon",
                    "slug" : "711",
                    "image" : "Sizzling-Cinnamon-Signature-Face_fg.jpg"
                }, {
                    "name" : "Playful Sour Apple",
                    "slug" : "711",
                    "image" : "Sour-Apple-Signature-Face_fg.jpg"
                }, {
                    "name" : "Sad Berry Blue",
                    "slug" : "711",
                    "image" : "Berry-Blue-Signature-face_fg.jpg"
                }, {
                    "name" : "Love Orange Crush",
                    "slug" : "711",
                    "image" : "Orng_Crush_Bean-Face_fg.jpg"
                }
            ]
        },{
            "name" : "Krispy Kreme Doughnuts&reg; Flavors",
            "shopName" : "Krispy Kreme Doughnuts&reg; Flavors",
            "category" : "721",
            "guide" : "krispyKreme",
            "description" : "The Krispy Kreme Doughnuts&reg; mix contains five delicious flavors inspired by the doughnut treats.",
            "childcategories" : [{
                    "name" : "Original Glazed",
                    "slug" : "721",
                    "image" : "KK_glazed-Signature-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Iced",
                    "slug" : "721",
                    "image" : "KK_Strawberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Chocolate Iced with Sprinkles",
                    "slug" : "721",
                    "image" : "KK_ChocolateSprinklesSignature-ns_fg.jpg"
                }, {
                    "name" : "Glazed Blueberry Cake",
                    "slug" : "721",
                    "image" : "KK_blueberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Cinnamon Apple Filled",
                    "slug" : "721",
                    "image" : "KK_appleSignature-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Organic Jelly Beans Flavors",
            "shopName" : "Jelly Belly&reg; Organic Flavors",
            "category" : "560",
            "guide" : "organic",
            "description" : "Tempting Organic Jelly Beans are USDA-certified organic, made with non-GMO ingredients, and as delicious as you&apos;ve come to expect from Jelly Belly gourmet treats.",
            "childcategories" : [{
                    "name" : "Berry",
                    "slug" : "559",
                    "image" : "OrgBean_Berry-ns_fg.jpg"
                }, {
                    "name" : "Blueberry",
                    "slug" : "559",
                    "image" : "OrgBean_Blueberry-ns_fg.jpg"
                }, {
                    "name" : "Cherry",
                    "slug" : "559",
                    "image" : "OrgBean_Cherry-ns_fg.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "559",
                    "image" : "OrgBean_Coconut-ns_fg.jpg"
                }, {
                    "name" : "Lemon",
                    "slug" : "559",
                    "image" : "OrgBean_Lemon-ns_fg.jpg"
                }, {
                    "name" : "Orange",
                    "slug" : "559",
                    "image" : "OrgBean_Orange-ns_fg.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "559",
                    "image" : "OrgBean_Peach_fg.jpg"
                }, {
                    "name" : "Pear",
                    "slug" : "559",
                    "image" : "OrgBean_Pear-ns_fg.jpg"
                }, {
                    "name" : "Red Apple",
                    "slug" : "559",
                    "image" : "OrgBean_RedApple-ns_fg.jpg"
                }, {
                    "name" : "Strawberry",
                    "slug" : "559",
                    "image" : "OrgBean_Strawberry-ns_fg.jpg"
                }, {
                    "name" : "Cherry Peach Smoothie",
                    "slug" : "559",
                    "image" : "FG-Organic_CherryPeach_1.jpg"
                }, {
                    "name" : "Mixed Berry Smoothie",
                    "slug" : "559",
                    "image" : "FG-Organic_MixedBerry_1.jpg"
                }, {
                    "name" : "Orange Mango Smoothie",
                    "slug" : "559",
                    "image" : "FG-Organic_MangoOrange.jpg"
                }, {
                    "name" : "Pineapple Coconut Smoothie",
                    "slug" : "559",
                    "image" : "FG-Organic_PineappleCoconut_1.jpg"
                }, {
                    "name" : "Strawberry Banana Smoothie",
                    "slug" : "559",
                    "image" : "FG-Organic_StrawberryBanan.jpg"
                }
            ]
        },{
            "name" : "Jewel Jelly Beans Flavors",
            "shopName" : "Jewel Jelly Beans Flavors",
            "category" : "46",
            "guide" : "jewelBeans",
            "description" : "Popular Jelly Belly jelly bean flavors finished with a beautiful pearlescent sheen!",
            "childcategories" : [{
                    "name" : "Jewel Berry Blue",
                    "slug" : "476",
                    "image" : "Jewel_Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Blueberry",
                    "slug" : "477",
                    "image" : "Jewel_Blueberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Bubble Gum",
                    "slug" : "478",
                    "image" : "Jewel_Bubble-Gum-Signature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Champagne",
                    "slug" : "46",
                    "image" : "Jewel_ChampagneSignature_ns_new_fg.jpg"
                }, {
                    "name" : "Jewel Cream Soda",
                    "slug" : "479",
                    "image" : "Jewel_Cream-Soda-Signature-ns-2_fg.jpg"
                }, {
                    "name" : "Jewel Ginger Ale",
                    "slug" : "480",
                    "image" : "Jewel_GingerAleSignature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Grape Soda",
                    "slug" : "46",
                    "image" : "Jewel_GrapeSodaSignature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Green Apple",
                    "slug" : "46",
                    "image" : "Jewel_Green-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Island Punch",
                    "slug" : "46",
                    "image" : "Jewel_IslandPunch-ns_fg.jpg"
                }, {
                    "name" : "Jewel Orange",
                    "slug" : "481",
                    "image" : "Jewel_Orange-Signature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Sour Apple",
                    "slug" : "482",
                    "image" : "Jewel_Sour-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Sour Lemon",
                    "slug" : "46",
                    "image" : "Jewel_SourLemon-Signature-ns_fg.jpg"
                },
                /*{
                    "name" : "Jewel Cream Soda",
                    "slug" : "46",
                    "image" : "CreamSodaJewelBean.png"
                }, {
                    "name" : "Jewel Berry Blue",
                    "slug" : "66",
                    "image" : "BerryBlueJewelBean.png"
                }, {
                    "name" : "Jewel Orange",
                    "slug" : "90",
                    "image" : "OrangeJewelBean.png"
                },
                */
                {
                    "name" : "Jewel Very Cherry",
                    "slug" : "483",
                    "image" : "Jewel_Very-Cherry2-Signature-ns_fg.jpg"
                }, {
                    "name" : "Jewel Wild Black Berry",
                    "slug" : "46",
                    "image" : "Jewel_WildBlackberry2-Signature-ns_fg.jpg"
                }
            ]
        },
        /*
        {
            "name" : "Rookie Flavors&reg; Flavors",
            "shopName" : "Rookie Flavors&reg; Flavors",
            "category" : "335",
            "guide" : "rookie",
            "description" : "The newest Jelly Belly jelly bean flavors hope to become official flavors someday. Until then try these latest innovations. Rookie flavors change from time to time, so make this page a regular stop to find out about new flavors. In this collection, you will enjoy 7UP, Grape Crush, Orange Crush, Pomegranate Cosmo, Mojito, Peach Bellini and TABASCO&reg;.",
            "childcategories" : [{
                    "name" : "7UP&reg;",
                    "slug" : "72",
                    "image" : "7UP.jpg"
                }, {
                    "name" : "Grape Crush&reg;",
                    "slug" : "78",
                    "image" : "GrapeCrush.jpg"
                }, {
                    "name" : "Orange Crush&reg;",
                    "slug" : "89",
                    "image" : "OrgCrush.jpg"
                }, {
                    "name" : "TABASCO&reg;",
                    "slug" : "346",
                    "image" : "tabasco.jpg"
                }, {
                    "name" : "Birthday Cake Remix&trade;",
                    "slug" : "162",
                    "image" : "cs_birthdayCake.jpg"
                }
            ]
        },
        */
        {
            "name" : "Kids Mix Flavors",
            "shopName" : "Kids Mix Flavors",
            "category" : "234",
            "guide" : "kids",
            "description" : "Kids know what they like and they\'re more than happy to tell you. We asked hundreds of kids to choose their most favorite Jelly Belly jelly bean flavors. The result is this kid-approved collection the whole family will enjoy!",
            "childcategories" : [{
                    "name" : "Berry Blue",
                    "slug" : "66",
                    "image" : "Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Blueberry",
                    "slug" : "67",
                    "image" : "Blueberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Bubble Gum",
                    "slug" : "18",
                    "image" : "Bubble-Gum-Signature-ns_fg.jpg"
                }, {
                    "name" : "Buttered Popcorn",
                    "slug" : "68",
                    "image" : "Buttered-Popcorn-Signature-ns_fg.jpg"
                }, {
                    "name" : "Chocolate Pudding",
                    "slug" : "74",
                    "image" : "Chocolate-Pudding-Signature-ns_fg.jpg"
                }, {
                    "name" : "Cotton Candy",
                    "slug" : "15",
                    "image" : "Cotton-Candy-Signature-ns_fg.jpg"
                }, {
                    "name" : "Green Apple",
                    "slug" : "79",
                    "image" : "Green-Apple-Signature-ns-copy_fg.jpg"
                }, {
                    "name" : "Lemon Lime",
                    "slug" : "85",
                    "image" : "Lemon-Lime-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Lemon",
                    "slug" : "84",
                    "image" : "Lemon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Orange Sherbet",
                    "slug" : "91",
                    "image" : "Orange-Sherbet-Signature-ns_fg.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "92",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Raspberry",
                    "slug" : "97",
                    "image" : "Raspberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Red Apple",
                    "slug" : "98",
                    "image" : "Red-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Apple",
                    "slug" : "474",
                    "image" : "Sour-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Cherry",
                    "slug" : "191",
                    "image" : "Sour-Cherry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Jam",
                    "slug" : "101",
                    "image" : "Strawberry-Jam-Signature-ns_fg.jpg"
                }, {
                    "name" : "Toasted Marshmallow",
                    "slug" : "103",
                    "image" : "Toasted-Marshmallow-Sig-ns_fg.jpg"
                }, {
                    "name" : "Tutti-Fruitti",
                    "slug" : "105",
                    "image" : "Tutti-Fruitti-Signature-ns_fg.jpg"
                }, {
                    "name" : "Very Cherry",
                    "slug" : "106",
                    "image" : "Very-Cherry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Watermelon",
                    "slug" : "107",
                    "image" : "Watermelon-Signature-ns_fg.jpg"
                }
            ]
        },
        /*
        {
            "name" : "Jelly Bean Chocolate Dips&reg; Flavors",
            "shopName" : "Chocolate Dips&reg; Flavors",
            "category" : "340",
            "guide" : "dips",
            "description" : "No flavor combination is quite as decadent as juicy fruit smothered in rich dark chocolate. These are our most popular beans...with a succulent twist.",
            "childcategories" : [{
                    "name" : "Mint",
                    "slug" : "340",
                    "image" : "dips_mint.jpg"
                }, {
                    "name" : "Orange",
                    "slug" : "340",
                    "image" : "dips_orange.jpg"
                }, {
                    "name" : "Strawberry",
                    "slug" : "340",
                    "image" : "dips_strawberry.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "340",
                    "image" : "dips_coconut.jpg"
                }, {
                    "name" : "Very Cherry",
                    "slug" : "106",
                    "image" : "dips_cherry.jpg"
                }, {
                    "name" : "Raspberry",
                    "slug" : "340",
                    "image" : "dips_raspberry.jpg"
                }
            ]
        },
        */
        {
            "name" : "Sunkist&reg; Citrus Mix Flavors",
            "shopName" : "Citrus Mix Flavors",
            "category" : "879",
            "guide" : "citrus",
            "description" : "Our favorite citrus flavors are all together in one mouthwatering mix. A little bit tart, a little bit sweet, and always refreshing and sunny. In this collection, you will enjoy Sunkist Orange, Sunkist Pink Grapefruit, Sunkist Lemon, Sunkist Tangerine and Sunkist Lime. Refresh your taste buds!",
            "childcategories" : [{
                    "name" : "Sunkist&reg; Lemon",
                    "slug" : "84",
                    "image" : "Lemon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Lime",
                    "slug" : "185",
                    "image" : "Lime-Sunkist-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Orange",
                    "slug" : "90",
                    "image" : "Orange-Juice-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Pink Grapefruit",
                    "slug" : "94",
                    "image" : "Pink-Grapefruit-Signature-new-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Tangerine",
                    "slug" : "102",
                    "image" : "TangerineSignatureSK-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Soda Pop Shoppe&reg; Flavors",
            "shopName" : "Soda Pop Shoppe Flavors",
            "category" : "884",
            "guide" : "sodaPop",
            "description" : "The Soda Pop Shoppe&reg; quenches your thirst for your favorite soft drinks. Find out which genuine soda brands have been given the Jelly Belly treatment.",
            "childcategories" : [{
                    "name" : "7UP",
                    "slug" : "72",
                    "image" : "7up_Bean-ns_fg.jpg"
                }, {
                    "name" : "A&W&reg; Cream Soda",
                    "slug" : "13",
                    "image" : "Cream-Soda-Signature-ns_fg.jpg"
                }, {
                    "name" : "A&W&reg; Root Beer",
                    "slug" : "73",
                    "image" : "Root-Beer-Signature-ns_fg.jpg"
                }, {
                    "name" : "Dr Pepper&reg;",
                    "slug" : "77",
                    "image" : "Dr-Pepper-Signature-ns_fg.jpg"
                }, {
                    "name" : "Orange Crush",
                    "slug" : "89",
                    "image" : "Orng_Crush_Bean-ns_fg.jpg"
                }, {
                    "name" : "Grape Crush",
                    "slug" : "78",
                    "image" : "Grape_Crush_Bean-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Snapple&trade; Mix Flavors",
            "shopName" : "Snapple&trade; Mix Flavors",
            "category" : "223",
            "guide" : "snapple",
            "description" : "Five 100% natural flavors based on Snapple juice drinks. Just like the juices you love, they\'re Made from The Best Stuff on Earth&trade;!",
            "childcategories" : [{
                    "name" : "Cranberry Raspberry",
                    "slug" : "223",
                    "image" : "Snapple-Cranberry-Raspberry-Signature_fg.jpg"
                }, {
                    "name" : "Fruit Punch",
                    "slug" : "223",
                    "image" : "Snapple-Fruit-Punch-Signature_fg.jpg"
                }, {
                    "name" : "Kiwi Strawberry",
                    "slug" : "223",
                    "image" : "Snapple-Kiwi-Strawberry-Signature_fg.jpg"
                }, {
                    "name" : "Mango Madness",
                    "slug" : "223",
                    "image" : "Snapple-Mango-Madness-Signature-ns_fg.jpg"
                }, {
                    "name" : "Pink Lemonade",
                    "slug" : "223",
                    "image" : "Snapple-Pink-Lemonade-Signature-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Cold Stone&reg; Flavors",
            "shopName" : "Cold Stone&reg; Flavors",
            "category" : "157",
            "guide" : "coldStone",
            "description" : "The Cold Stone&reg; Ice Cream Parlor Mix&reg; contains five delicious flavors inspired by Cold Stone Creamery&reg; treats.",
            "childcategories" : [{
                    "name" : "Our Strawberry Blonde&reg;",
                    "slug" : "157",
                    "image" : "strawberryblonde_fg.jpg"
                }, {
                    "name" : "Apple Pie a la Cold Stone&reg;",
                    "slug" : "157",
                    "image" : "Apple-Pie-Signature-ns_fg.jpg"
                }, {
                    "name" : "Mint Mint Chocolate Chocolate Chip&reg;",
                    "slug" : "157",
                    "image" : "MintchipSignature_fg.jpg"
                }, {
                    "name" : "Birthday Cake Remix&reg;",
                    "slug" : "157",
                    "image" : "Birthdaycake-Signature-ns_fg.jpg"
                }, {
                    "name" : "Chocolate Devotion&reg;",
                    "slug" : "157",
                    "image" : "chocolatedevotion_fg.jpg"
                }
            ]
        },{
            "name" : "Superfruit Flavors",
            "shopName" : "Superfruit Flavors",
            "category" : "471",
            "guide" : "superfruit",
            "description" : "Superfruit Mix includes five exciting flavors bursting with fresh fruit taste. They\'re all made with real fruit juices and purees, as well as all natural flavors and colors from natural sources.",
            "childcategories" : [{
                    "name" : "Acai Berry",
                    "slug" : "471",
                    "image" : "acaiberry_fg.jpg"
                }, {
                    "name" : "Barbados Cherry",
                    "slug" : "471",
                    "image" : "barbadoscherry_fg.jpg"
                }, {
                    "name" : "Blueberry",
                    "slug" : "67",
                    "image" : "blueberry_fg.jpg"
                }, {
                    "name" : "Cranberry",
                    "slug" : "471",
                    "image" : "sf_cranberry_fg.jpg"
                }, {
                    "name" : "Pomegranate",
                    "slug" : "96",
                    "image" : "sf_pomegranate_fg.jpg"
                }
            ]
        },{
            "name" : "Sport Beans&reg; Flavors",
            "shopName" : "Sport Beans&reg; Flavors",
            "category" : "336",
            "guide" : "sportBeans",
            "description" : "Sport Beans&reg; refill your energy levels and taste great too! Find out what flavors are available here.",
            "childcategories" : [{
                    "name" : "Berry",
                    "slug" : "336",
                    "image" : "BerryPurple_SB_new-formula_fg.jpg"
                }, {
                    "name" : "Fruit Punch",
                    "slug" : "336",
                    "image" : "FruitPunch_SB_new-formula_fg.jpg"
                }, {
                    "name" : "Green Apple",
                    "slug" : "336",
                    "image" : "Green_Apple_SB_fg.jpg"
                }, {
                    "name" : "Juicy Pear",
                    "slug" : "336",
                    "image" : "Juicy_Pear_SB_fg.jpg"
                }, {
                    "name" : "Lemon Lime",
                    "slug" : "336",
                    "image" : "Lime_yellow_SB_new-formula_fg.jpg"
                }, {
                    "name" : "Orange",
                    "slug" : "336",
                    "image" : "Orange_SB_new-formula_fg.jpg"
                }, {
                    "name" : "Strawberry Banana Smoothie",
                    "slug" : "336",
                    "image" : "Strawberry-Banana-Smoothie-ns_fg_1.jpg"
                }, {
                    "name" : "Cherry (Extreme Sport Beans&reg;)",
                    "slug" : "336",
                    "image" : "Chery_XSB_new-formula_fg.jpg"
                }, {
                    "name" : "Watermelon (Extreme Sport Beans&reg;)",
                    "slug" : "336",
                    "image" : "Watermelon_red_XSB_new-formula_fg.jpg"
                }, {
                    "name" : "Pomegranate (Extreme Sport Beans&reg;)",
                    "slug" : "336",
                    "image" : "SB_ExtrmPomSignature-ns_fg2.jpg"
                }
            ]
        },
        /* {
            "name" : "Fruit Bowl Flavors",
            "shopName" : "Fruit Bowl Flavors",
            "category" : "/search?query=fruit+bowl&sortBy=",
            "guide" : "fruitBowl",
            "description" : "Vibrant, juicy and so right on you won\'t believe your taste buds. Each flavor is distinct and special, so explore one at a time for the full flavor adventure. No wild flavors here, just the best of the best of our fruit-inspired collection, many of them made with real juice, purees and flavor essence. In this collection, you will enjoy Blueberry, Coconut, Grape, Green Apple, Juicy Pear, Lemon, Lemon Lime, Peach, Pink Grapefruit, Plum, Raspberry, Red Apple, Tangerine, Top Banana, Very Cherry and Watermelon.",
            "childcategories" : [{
                    "name" : "Blueberry",
                    "slug" : "67",
                    "image" : "Blueberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "14",
                    "image" : "Coconut-Signature-ns_fg.jpg"
                }, {
                    "name" : "Pomegranate",
                    "slug" : "96",
                    "image" : "pom-Signature_LD-Spot_NEW(fin)-ns_fg.jpg"
                }, {
                    "name" : "Green Apple",
                    "slug" : "79",
                    "image" : "Green-Apple-Signature-ns-copy_fg.jpg"
                }, {
                    "name" : "Juicy Pear",
                    "slug" : "81",
                    "image" : "Juicy-Pear-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Lemon",
                    "slug" : "84",
                    "image" : "Lemon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Lemon Lime",
                    "slug" : "85",
                    "image" : "Lemon-Lime-Signature-ns_fg.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "92",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Pink Grapefruit",
                    "slug" : "94",
                    "image" : "Pink-Grapefruit-Signature-new-ns_fg.jpg"
                }, {
                    "name" : "Plum",
                    "slug" : "95",
                    "image" : "Plum-Signature-ns_fg.jpg"
                }, {
                    "name" : "Raspberry",
                    "slug" : "97",
                    "image" : "Raspberry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Red Apple",
                    "slug" : "98",
                    "image" : "Red-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Tangerine",
                    "slug" : "102",
                    "image" : "TangerineSignatureSK-ns_fg.jpg"
                }, {
                    "name" : "Top Banana",
                    "slug" : "104",
                    "image" : "Top-Banana-Signature-ns_fg.jpg"
                }, {
                    "name" : "Very Cherry",
                    "slug" : "106",
                    "image" : "Very-Cherry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Watermelon",
                    "slug" : "107",
                    "image" : "Watermelon-Signature-ns_fg.jpg"
                }
            ]
        },
        */
        {
            "name" : "Cocktail Classics&reg; Flavors",
            "shopName" : "Cocktail Classics&reg; Flavors",
            "category" : "228",
            "guide" : "cocktail",
            "description" : "This is a modern twist on the classic cocktail. No shaking or stirring necessary. All the flavor without the alcohol, this collection is ideal for celebrations large and small. This mix includes Margarita, Mojito, Peach Bellini, Pina Colada, Pomegranate Cosmo and Strawberry Daiquiri.",
            "childcategories" : [{
                    "name" : "Margarita",
                    "slug" : "88",
                    "image" : "Margarita-Signature-ns_fg.jpg"
                }, {
                    "name" : "Mojito",
                    "slug" : "228",
                    "image" : "Mojito-Signature-ns3screen-best_fg.jpg"
                }, {
                    "name" : "Peach Bellini",
                    "slug" : "228",
                    "image" : "Peach-Bellini-Signature-ns_fg.jpg"
                }, {
                    "name" : "Pina Colada",
                    "slug" : "228",
                    "image" : "Pina-Colada-Signature-ns_fg.jpg"
                }, {
                    "name" : "Pomegranate Cosmo",
                    "slug" : "228",
                    "image" : "Pom-Cosmo2_fg.jpg"
                }, {
                    "name" : "Strawberry Daiquiri",
                    "slug" : "228",
                    "image" : "Strawberry-Daiquiri-Sig-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Sours Flavors",
            "shopName" : "Sours Flavors",
            "category" : "472",
            "guide" : "sours",
            "description" : "Thrill your taste buds with the lip-puckering Jelly Belly Sours flavors of fruits with a hint of sour.This mix includes Sour Lemon, Sour Cherry, Sour Grape, Sour Apple and Sour Orange.",
            "childcategories" : [{
                    "name" : "Sour Apple",
                    "slug" : "474",
                    "image" : "Sour-Apple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Cherry",
                    "slug" : "191",
                    "image" : "Sour-Cherry-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Grape",
                    "slug" : "472",
                    "image" : "Sour-Grape-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Lemon",
                    "slug" : "472",
                    "image" : "Sour-Lemon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Orange",
                    "slug" : "472",
                    "image" : "Sour-Orange-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sour Peach",
                    "slug" : "472",
                    "image" : "Sour-Peach-Signature-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Sugar-Free Assorted Flavors",
            "shopName" : "Sugar-Free Assorted Flavors",
            "category" : "338",
            "guide" : "sugarFree",
            "description" : "Check out our assortment of Sugar-Free Jelly Belly jelly beans. They\'re just as sweet as the originals!",
            "childcategories" : [{
                    "name" : "Sugar-Free Cherry",
                    "slug" : "338",
                    "image" : "SF_CHERRY_fg.jpg"
                }, {
                    "name" : "Sugar-Free Sizzling Cinnamon",
                    "slug" : "338",
                    "image" : "SF_SizzlingCinnamon_fg.jpg"
                }, {
                    "name" : "Sugar-Free Green Apple",
                    "slug" : "338",
                    "image" : "SF_GreenApple_fg.jpg"
                }, {
                    "name" : "Sugar-Free Juicy Pear",
                    "slug" : "338",
                    "image" : "SF_JuicyPear_fg.jpg"
                }, {
                    "name" : "Sugar-Free Lemon",
                    "slug" : "338",
                    "image" : "SF_Lemon_fg.jpg"
                }, {
                    "name" : "Sugar-Free Licorice",
                    "slug" : "338",
                    "image" : "SF_Licorice_fg.jpg"
                }, {
                    "name" : "Sugar-Free Pineapple",
                    "slug" : "338",
                    "image" : "SF_Pineapple_fg.jpg"
                }, {
                    "name" : "Sugar-Free Buttered Popcorn",
                    "slug" : "338",
                    "image" : "SF_ButteredPopcorn_fg.jpg"
                }, {
                    "name" : "Sugar-Free Strawberry",
                    "slug" : "338",
                    "image" : "SF_Strawberry_fg.jpg"
                }, {
                    "name" : "Sugar-Free Tangerine",
                    "slug" : "338",
                    "image" : "SF_Tangerine_fg.jpg"
                }
            ]
        },{
            "name" : "Tropical Mix Flavors",
            "shopName" : "Tropical Mix Flavors",
            "category" : "297",
            "guide" : "tropical",
            "description" : "Whisk yourself away to a tropical paradise with the Jelly Belly Tropical Mix. Our tropical mix includes 16 of our most exotic flavors, including Pina Colada, Strawberry Daiquiri, Island Punch, and Coconut. Eat them and think about white sand beaches and blue ocean water!",
            "childcategories" : [{
                    "name" : "Berry Blue",
                    "slug" : "66",
                    "image" : "Berry-Blue-Signature-ns_fg.jpg"
                }, {
                    "name" : "Cantaloupe",
                    "slug" : "69",
                    "image" : "Cantaloupe-Signature-ns_fg.jpg"
                }, {
                    "name" : "Coconut",
                    "slug" : "14",
                    "image" : "Coconut-Signature-ns_fg.jpg"
                }, {
                    "name" : "Crushed Pineapple",
                    "slug" : "76",
                    "image" : "Crushed-Pineapple-Signature-ns_fg.jpg"
                }, {
                    "name" : "Green Apple",
                    "slug" : "79",
                    "image" : "Green-Apple-Signature-ns-copy_fg.jpg"
                }, {
                    "name" : "Island Punch",
                    "slug" : "80",
                    "image" : "Island-Punch-Signature-ns_fg.jpg"
                }, {
                    "name" : "Kiwi",
                    "slug" : "274",
                    "image" : "Kiwi-Signature-ns_fg.jpg"
                }, {
                    "name" : "Lemon Lime",
                    "slug" : "85",
                    "image" : "Lemon-Lime-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Lemon",
                    "slug" : "84",
                    "image" : "Lemon-Signature-ns_fg.jpg"
                }, {
                    "name" : "Mango",
                    "slug" : "87",
                    "image" : "Mango-Signature-ns_fg.jpg"
                }, {
                    "name" : "Peach",
                    "slug" : "92",
                    "image" : "Peach-Signature-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Pink Grapefruit",
                    "slug" : "94",
                    "image" : "Pink-Grapefruit-Signature-new-ns_fg.jpg"
                }, {
                    "name" : "Pina Colada",
                    "slug" : "93",
                    "image" : "Pina-Colada-Signature-ns_fg.jpg"
                }, {
                    "name" : "Strawberry Daiquiri",
                    "slug" : "100",
                    "image" : "Strawberry-Daiquiri-Sig-ns_fg.jpg"
                }, {
                    "name" : "Sunkist&reg; Tangerine",
                    "slug" : "102",
                    "image" : "TangerineSignatureSK-ns_fg.jpg"
                }, {
                    "name" : "Top Banana",
                    "slug" : "104",
                    "image" : "Top-Banana-Signature-ns_fg.jpg"
                }
            ]
        },{
            "name" : "Harry Potter&trade; Bertie Bott\'s Every Flavor Beans&trade;",
            "shopName" : "Harry Potter&trade; Flavors",
            "category" : "633",
            "guide" : "bertieBotts",
            "description" : "Harry Potter\'s favorite candy has returned! Get a box of tasty jelly beans blended with weird, wild ones!",
            "childcategories" : [{
                    "name" : "Banana",
                    "slug" : "344",
                    "image" : "TopBanana-Signature_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Black Pepper",
                    "slug" : "344",
                    "image" : "Black-Pepper_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Blueberry",
                    "slug" : "344",
                    "image" : "Blueberry_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Booger",
                    "slug" : "344",
                    "image" : "JuicyPearSignatureBB-ns_fg.jpg"
                }, {
                    "name" : "Candyfloss",
                    "slug" : "344",
                    "image" : "CottonCandy-Signature_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Cherry",
                    "slug" : "344",
                    "image" : "Cherry_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Cinnamon",
                    "slug" : "344",
                    "image" : "CinnamonSignatureBB-ns_fg.jpg"
                }, {
                    "name" : "Dirt",
                    "slug" : "344",
                    "image" : "Dirt_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Earthworm",
                    "slug" : "344",
                    "image" : "StrawberryJamSignatureBB-ns_fg.jpg"
                }, {
                    "name" : "Earwax",
                    "slug" : "344",
                    "image" : "Earwax_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Grass",
                    "slug" : "344",
                    "image" : "Grass_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Green Apple",
                    "slug" : "344",
                    "image" : "GreenApple-Signature_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Lemon",
                    "slug" : "344",
                    "image" : "LemonSignatureBB-ns_fg.jpg"
                }, {
                    "name" : "Marshmallow",
                    "slug" : "344",
                    "image" : "Marshmallow_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Rotten Egg",
                    "slug" : "344",
                    "image" : "ButteredPopcornSignatureBB-ns_fg.jpg"
                }, {
                    "name" : "Sausage",
                    "slug" : "344",
                    "image" : "Sausage-ns_fg.jpg"
                }, {
                    "name" : "Soap",
                    "slug" : "344",
                    "image" : "Soap_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Tutti-Fruitti",
                    "slug" : "344",
                    "image" : "Tutti-Frutti_BertieB-ns_fg.jpg"
                }, {
                    "name" : "Vomit",
                    "slug" : "344",
                    "image" : "PeachSignatureBB-ns_fg.jpg"
                }, {
                    "name" : "Watermelon",
                    "slug" : "344",
                    "image" : "Watermelon-Signature_BertieB-ns_fg.jpg"
                }
            ]
        }
    ];
    function factory(conf) {

        var _$body = conf.$body;      
        var _dispatcher = UrlDispatcher;
        var ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND'; 
        var promodel ,flag,lastpage,loadMore = false, loadAll = window.loadAll = false;
        var defaultpagesize = window.defaultpagesize = 20;        
        
        function updateUi(response) {
            var url = response.canonicalUrl;
            var $oattr;
            var info_url;
            if(loadMore) {
                $oattr = $(response.body).find("ul#mz-productlist-list > li");
                var str = '';
                var length =  $(document).find('.mz-productlist-grid').children().length;
                var itemtofocus;
                $oattr.each(function(j) {
                    var td = length + j + 1;
                    itemtofocus = td;
                    $(this).attr("data-griddercontent", "#" + td);          
                    str = str+ $(this)[0].outerHTML;      
                });
                window.loadmore=loadMore;
                _$body.find("ul#mz-productlist-list").append(str); 
                _$body.find(".load-more-prod").html($(response.body).find(".load-more-prod").html());
                _$body.find("label.mz-pagingcontrols-pagesize-label").html($(response.body).find("label.mz-pagingcontrols-pagesize-label").html());
                var data= require.mozuData('facetedproducts') ;
                info_url = getUrlParms(window.location.href);  
                if(info_url.pageSize){
                    if((parseInt(info_url.startIndex,10)+parseInt(info_url.pageSize,10)) > data.totalCount){
                        lastpage = data.totalCount;
                    }else{   
                        lastpage =  (parseInt(info_url.startIndex,10)+parseInt(info_url.pageSize,10));  
                    } 
                }else{ 
                    if((parseInt(info_url.startIndex,10)+window.defaultpagesize) > data.totalCount){
                        lastpage = data.totalCount;
                    }else{ 
                        lastpage =  (parseInt(info_url.startIndex,10)+window.defaultpagesize);   
                    }  
                }
                if(info_url.startIndex && data.pageSize){    
                    $(document).find('.jb-result-details .heading-jb-result').html($(document).find('.jb-result-details .heading-jb-result').html().split('-')[0]+" - "+lastpage+" of "+$(document).find('.jb-result-details .heading-jb-result').html().split('-')[1].split('of')[1]); 
                }
                if(window.loadAll && (parseInt(lastpage,10) < parseInt(data.totalCount,10))){  
                    if(window.pageFlag){window.pageValue = info_url.startIndex;window.pageFlag = false;}
                    $(document).find('#load-all').click();
                }else{  
                    window.loadAll = false;  
                }   
                //var remainingCount = (data.totalCount-lastpage)>500?500:(data.totalCount-parseInt(lastpage,10));
                $(document).find('#load-all').html('Show All ('+data.totalCount+')');
                $(document).find('div[data-mz-productlist]').removeClass('is-loading'); 
                setTimeout(function(){  
                    //$(document).find('.gridder-list[data-griddercontent="#'+(itemtofocus-(window.defaultpagesize-1))+'"]').find('a').first().focus();
                    //alert(parseInt(info_url.startIndex,10)+1);
                    var lastValue = window.pageFlag === 0 ? (parseInt(info_url.startIndex,10)+1):window.pageValue;
                    $(document).find('.gridder-list[data-griddercontent="#'+lastValue+'"]').find('a').first().focus();   
                }, 1000);    
                promodel= new FacetingModels.FacetedProductCollection(data);   
                // promodel.get('items').push(JSON.parse($(response.body)[2].innerHTML).items); 
                initRecProd();
                //labelShow();
                // initilizeBrandSec(); 
                window.updatecatfilter();    
            }else{ 
                setTimeout(function(){
                    $('#preloader').fadeOut();  
                    $('#preloaderoverlay').delay(350).fadeOut('slow'); 
                    custom.customObject.os();
                    custom.customObject.autoload();
                    initilizeBrandSec(); 
                    if($(document).find('.selected-facet-value').length >= 1){
                        $(document).find('.clear-all-outer-btn').addClass('active');
                    }else{
                        $(document).find('.clear-all-outer-btn').removeClass('active');    
                    }
                },1000);
                _$body.html($(response.body).find(".mz-l-container").children());  
                var data1= require.mozuData('facetedproducts') ;  
                info_url = getUrlParms(window.location.href); 
                $(document).find('div[data-mz-productlist]').removeClass('is-loading'); 
                var count =1; $(document).find('.gridder-list').each(function(){
                    $(this).attr('data-griddercontent','#'+count);
                    count++; 
                });
                setTimeout(function(){ 
                    $(document).find('.gridder-list[data-griddercontent="#1"]').find('.mz-productlisting-image').find('a').focus();   
                }, 1000); 
                promodel= new FacetingModels.FacetedProductCollection(data1); 
                initRecProd();
                //labelShow(); 
                //initilizeBrandSec();
                window.updatecatfilter(); 
            } 
            
            if($(document).find('.selected-facet-value').length >= 1){
                $(document).find('.clear-all-outer-btn').addClass('active');
            }else{
                $(document).find('.clear-all-outer-btn').removeClass('active');    
            }
            if($(document).find('.selected-facet-mobile').length >= 1){
                $(document).find('.tz-mobileSelected-filter').addClass('active');  
                $(document).find('.mz-refine-search').addClass('active');
            }else{
                $(document).find('.tz-mobileSelected-filter').removeClass('active');
                $(document).find('.mz-refine-search').removeClass('active'); 
            }
            
            if (url) _dispatcher.replace(url);
                
            _$body.removeClass('mz-loading'); 
            
        }
        
        function initilizeBrandSec(){
            // flavor guide issue.
            var category = flavour_Guides1;
            var catCode = require.mozuData('pagecontext').categoryCode;
            $(category).each(function (index, data) {
                if(data.category == catCode){
                    $(document).find('#flavor-List').append(Hypr.getTemplate('pages/flavor-guides-item').render({
                        model : data,
                        index: index
                    }));
                }
            });

            // accordian functionality after render
            $(document).find(".jb-colapsing-title").bind("click", function (e) {
                $(this).parent().find(".jb_contentfolder").slideToggle();
                if ($(this).find(".jb-category-title").attr("aria-expanded") == "false") {
                    $(this).find(".jb-category-title").attr("aria-expanded", "true");
                    $(this).find(".mz-desktop").attr("aria-expanded", "true");
                    } else {
                    $(this).find(".jb-category-title").attr("aria-expanded", "false");
                    $(this).find(".mz-desktop").attr("aria-expanded", "false");
                    }
                if ($(this).find(".mz-mobile").css("display") == "block") {
                    var temphtml = $(this).find(".mz-mobile").text();
                    if (temphtml == "+") {
                        $(this).find(".mz-mobile").text("-");
                        $(this).find(".mz-mobile").attr({"title":"collapse, button, expanded", "aria-expanded":"true"});
                    } else {
                        $(this).find(".mz-mobile").text("+");
                        $(this).find(".mz-mobile").attr({"title":"expand, button, collapsed", "aria-expanded":"false"});
                    }
                }
            });

            $(document).find(".jb-colapsing-title").bind("keydown", function (e) {
                if(e.keyCode == 13 || e.keyCode == 32) {
                    $(this).trigger('click');
                }
            });


            // sub category cur.
            var owl2 = $(document).find('.sub-cat-list');
            var navigation = $(window).width() > 1024?false:true;
            owl2.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            if($(window).width() <= 767){
                owl2.owlCarousel({  
                    loop: true, 
                    margin: 10,
                    dots: false,
                    autoPlay: false,  
                    pagination: false,   
                    nav: false,     
                    navText:false,
                    slideBy: 1,
                    items: 2,
                    center: true,   
                    stagePadding: 80,
                    responsive: {    
                        0: {
                            items: 1
                        },
                        400: {
                            items: 1
                        },
                        600: {
                            items: 1
                        },
                        800: {
                            items: 4   
                        } 
                    } 
                });  
            }else{
                owl2.owlCarousel({  
                    loop: false, 
                    margin: 25,
                    dots: false,
                    autoPlay: false,  
                    pagination: false,   
                    nav: navigation,     
                    navText:false,
                    slideBy: 1,
                    items: 2,
                    center: false,
                    responsive: {    
                        0: {
                            items: 1
                        },
                        400: {
                            items: 1
                        },
                        600: {
                            items: 3
                        },
                        800: {
                            items: 3   
                        }, 
                        1025: {
                            items: 4
                        },
                        1440: {
                            items: 4
                        }
                    } 
                });   
            }

            // event to trigger browser resize.
            setTimeout(function(){
                if($(window).width() > 767){
                    if($(window).width() > 1440){ 
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',($(window).width()-1440)/2);
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','600px'); 
                    }else{
                        if($(window).width() < 1175){
                            $(document).find('.a-spotText').css('font-size',"14px");
                            $(document).find('.a-spotContentHeading').css('font-size',"26px");
                        }else{
                            $(document).find('.a-spotText').css('font-size',"1.2vw");
                            $(document).find('.a-spotContentHeading').css('font-size',"2.3vw");   
                        }
                        var newHeigth = 500-((1440 - $(window).width())/3);
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('height', newHeigth);
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').css('height', newHeigth);   
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',0); 
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                        $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','45%');  
                    }
                    $(window).resize(function(){ 
                        if($(window).width() > 1440){
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',($(window).width()-1440)/2);
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','600px'); 
                        }else{
                            if($(window).width() < 1175){
                                $(document).find('.a-spotText').css('font-size',"14px");
                                $(document).find('.a-spotContentHeading').css('font-size',"26px");
                            }else{
                                $(document).find('.a-spotText').css('font-size',"1.2vw");
                                $(document).find('.a-spotContentHeading').css('font-size',"2.3vw");   
                            }
                            var newHeigth = 500-((1440 - $(window).width())/3);
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('height', newHeigth);
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').css('height', newHeigth);   
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('left',0); 
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').css('left',($(window).width()-$(document).find('.brand-dicreption').find('.a-spot-cointainer').find('img').width())/2);
                            $(document).find('.brand-dicreption').find('.a-spot-cointainer').find('.A-spotContent').css('width','45%');  
                        }
                    });
                }
            },1000);
        }

        // function labelShow(){
        //     var one_day=1000*60*60*24;     
        //     var comingSoonData = Hypr.getThemeSetting('comingSoonThresholds').split(',');
        //     var comingSoon = [];
        //     _.each(comingSoonData, function(pair) { var tmpArray = pair.split('='); 
        //         comingSoon[tmpArray[0]] = parseInt(tmpArray[1],10);
        //     });
        //     $('.mz-productlist-item').each(function(){
        //         var productDate =$(this).attr('createDate').substring(0,10).replace(/\//g,'-').trim(); 
        //         var currentDate = $('#currentDate').text();
        //         var x = productDate.split('-'); 
        //         var y = currentDate.split('-');   
        //         var date1 = new Date(x[2],x[0]-1,x[1]);     
        //         var date2 = new Date(y[2],y[1]-1,y[0]);
        //         var days = Math.ceil((date2.getTime()-date1.getTime())/(one_day)); 
    
        //         if($(this).attr('productType') !== "Gift Certificate"){
        //             if ( days >= 0 && $(this).attr('onlineStockAvailable') === 0) {
        //                 $('div[data-mz-product='+$(this).attr('data-mz-product')+']').find('.product-sale-new-label').show().css({ "background-color" : "#000099", "line-height" : "8px"}).html("<span style='font-size: 10px;'>COMING</span><br><span style='font-size: 9px;'>SOON</span>");
        //             }else if(days <= Hypr.getThemeSetting('newLabelThreshold') && days >= 0 && $(this).attr('price') == $(this).attr('salePrice')){
        //                 $('div[data-mz-product='+$(this).attr('data-mz-product')+']').find('.product-sale-new-label').show();
        //             }
        //         }
        //     });    
        // }
         
        function initRecProd(){
            $(document).find('.recommended-product').show();
        } 
        
        function getUrlParms(url) {
            var vars = [], hash;
            var hashes = url.slice(url.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars; 
        }
        
        function showError(error) {
            _$body.find('[data-mz-messages]').text(error.message);
        }

        function intentToUrl(e) {
            loadMore=false; 
            $(document).find('div[data-mz-productlist]').addClass('is-loading'); 
            var oldurl = window.location.pathname+window.location.search; 
            if($(e.currentTarget).hasClass('mz-facetingform-clearall')){
                $(document).find('.selected-facet-value').remove();  
                $('.clear-all-outer-btn').removeClass('active');   
                $(document).find('.item-name').removeClass('mz-facetform-selected');
            } 
            e.preventDefault(); 
            var elm = e.target;
            var url;
            if (elm.tagName.toLowerCase() === "select") { 
                elm = elm.options[elm.selectedIndex];
            }
            
            if(elm.getAttribute('data-mz-url')){
                url = elm.getAttribute('data-mz-url') || elm.getAttribute('href') || '';
            }
            else if($(elm).siblings().attr('data-mz-url')){
                url=$(elm).siblings().attr('data-mz-url');
            }
            else{
                url = elm.parentElement.getAttribute('data-mz-url') || elm.parentElement.getAttribute('href') || elm.getAttribute('href') || '';
            }
            if (url && url[0] != "/") {
                var parser = document.createElement('a');
                parser.href = url;
                url = parser.pathname + parser.search;
                url = window.location.pathname + parser.search;
                if(elm.getAttribute('rel')=="next"){
                    loadMore=true;
                }else if(elm.getAttribute('rel')=="all"){
                    loadMore=true;
                    window.loadAll = true;
                }else{
                    loadMore=false;
                }
            }
            var strurl = '',hashes = [],i = 0,hash = [];
            var params = getUrlParms(url);
            if(params.pageSize && params.pageSize > window.defaultpagesize){
                hashes = url.slice(url.indexOf('?') + 1).split('&');
                strurl = url.split('?')[0]+"?";
                for(i = 0; i < hashes.length; i++){  
                    hash = hashes[i].split('='); 
                    if(hash[0] == "startIndex" && parseInt(hash[1]) != parseInt(elm.getAttribute('lastInedx'))) strurl = strurl+"startIndex="+elm.getAttribute('lastInedx')+"&";
                    if(hash[0] == "startIndex" && params.pageSize == 500 && parseInt(hash[1]) == parseInt(elm.getAttribute('lastInedx'))) strurl = strurl+"startIndex="+elm.getAttribute('lastInedx')+"&";
                    if(hash[0] == "startIndex" && params.pageSize != 500 && parseInt(hash[1]) == parseInt(elm.getAttribute('lastInedx'))) strurl = strurl+hashes[i]+"&"; 
                    if(hash[0] != "pageSize" && hash[0] != "startIndex") strurl = strurl+hashes[i]+"&"; 
                    if(elm.getAttribute('rel')=="next-old" && hash[0] == "pageSize") strurl = strurl+hashes[i]+"&";
                } 
                if(strurl.substr(strurl.length - 1) == '&') strurl = strurl.substring(0,strurl.length - 1);   
                if(elm.getAttribute('rel') != "next-old" && elm.getAttribute('rel') != "all") strurl = strurl +"&pageSize="+window.defaultpagesize; 
                if(elm.getAttribute('rel') == "all") strurl = strurl +"&pageSize=500"; 
                if(strurl.indexOf('startIndex') == -1) strurl = strurl +"&startIndex="+elm.getAttribute('lastInedx');   
            }else if(elm.getAttribute('rel') == "all"){
                hashes = url.slice(url.indexOf('?') + 1).split('&');
                strurl = url.split('?')[0]+"?";
                for(i = 0; i < hashes.length; i++){          
                    hash = hashes[i].split('='); 
                    if(hash[0] == "startIndex" && parseInt(hash[1]) != parseInt(elm.getAttribute('lastInedx'))) strurl = strurl+"startIndex="+elm.getAttribute('lastInedx')+"&"; 
                    if(hash[0] == "startIndex" && parseInt(hash[1]) == parseInt(elm.getAttribute('lastInedx'))) strurl = strurl+hashes[i]+"&"; 
                    if(hash[0] != "pageSize" && hash[0] != "startIndex") strurl = strurl+hashes[i]+"&"; 
                    if(elm.getAttribute('rel')=="next-old" && hash[0] == "pageSize") strurl = strurl+hashes[i]+"&";
                } 
                if(strurl.substr(strurl.length - 1) == '&') strurl = strurl.substring(0,strurl.length - 1);   
                if(elm.getAttribute('rel') != "next-old" && elm.getAttribute('rel') != "all") strurl = strurl +"&pageSize="+window.defaultpagesize; 
                if(elm.getAttribute('rel') == "all") strurl = strurl +"&pageSize=500"; 
            }  
            if(url == oldurl) $(document).find('.jb-inner-overlay').hide();
            if(strurl && strurl !== ''){ return strurl; }else{ return url;}  
        }

        var navigationIntents = IntentEmitter(  
            _$body,
            [   
                'click [data-mz-pagingcontrols] a',
                'click [data-mz-pagenumbers] a',
                //'click a[data-mz-facet-value]',
                'click [data-mz-action="clearFacets"]',
                //'click [data-mz-facet-value]',
                'change [data-mz-value="pageSize"]',
                'change [data-mz-value="sortBy"]',
                'click  [data-mz-value="sortMob"]',
                'click #color1',
                'click #load-more',
                'click #load-all',
                'click .mz-reset-filter' 
            ], 
            intentToUrl
        );

        navigationIntents.on('data', function(url, e) {
            if (url && _dispatcher.send(url)) {
                _$body.addClass('mz-loading');
                e.preventDefault();
            }
        });

        _dispatcher.onChange(function(url) {
            getPartialView(url, conf.template).then(updateUi, showError);   
        });
        
        function formcustomurl(){
            var required_url = window.location.href;
            var data_url = '';
            var url_main = '?';
            if(decodeURIComponent(required_url).split('?').length > 1){
                if( decodeURIComponent(required_url).split('?')[1] != "#maincontent"){ 
                    required_url = decodeURIComponent(required_url).split('?')[1].split('&');
                    for(var i =0; i< required_url.length;i++ ){
                        if(required_url[i].indexOf("facetValueFilter") == -1 && required_url[i].indexOf("startIndex")){ 
                            url_main = url_main+required_url[i];    
                        }    
                    }
                }
            }
            if(url_main.length > 1){
                data_url = data_url+'&facetValueFilter=';   
            }else{
                data_url = data_url+'facetValueFilter=';     
            }   
            var selecterfilterobj = $(document).find('.facet-name-list').find('.selected-facet-value').filter(':visible');
            selecterfilterobj.each(function(){
                var filter = $(this).attr('url-component'); 
                data_url = data_url+filter+',';
            }); 
            var needed_url = url_main+data_url;  
            return needed_url; 
        }
        
        $(document).on('click','.apply-filter-button',function(e){
            var needed_url = formcustomurl();
            $(e.currentTarget).attr('data-mz-url',needed_url);  
            var url=intentToUrl(e);
            //  setFacetValueMobile(e);
            if(url){
                if (url && _dispatcher.send(url)) { 
                    _$body.addClass('mz-loading'); 
                    e.preventDefault(); 
                }    
            }          
        });
        
        $(document).on('keydown','.apply-filter-button',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                $(document.activeElement).click();   
            }    
        });
        
        $(document).on('keydown','.mz-facetingform-clearall',function(e){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                $(document.activeElement).click();   
            }    
        });
        
        $(document).on('click','.cross-btn-facets',function(e){
            $(e.currentTarget).parents('.item-name').remove();
            var needed_url = formcustomurl();
            $('.hidden-element-to-apply').attr('data-mz-url',needed_url);
            $('.hidden-element-to-apply').click();
        });
        
        $(document).on('keydown','.cross-btn-facets',function(e){
            if(e.which == 13 || e.which == 32){ 
                $(document.activeElement).remove(); 
                var needed_url = formcustomurl(); 
                $('.hidden-element-to-apply').attr('data-mz-url',needed_url);
                $('.hidden-element-to-apply').click();
            }
        });
        
        $(document).on('click','.hidden-element-to-apply',function(e){
            var url=intentToUrl(e);
            //  setFacetValueMobile(e);
            if(url){
                if (url && _dispatcher.send(url)) { 
                    _$body.addClass('mz-loading'); 
                    e.preventDefault(); 
                }    
            }     
        });
        
        $(document).on('keydown','#load-more',function(e){
            if(e.which == 32){
                var url=intentToUrl(e);
                if(url){
                    if (url && _dispatcher.send(url)) {
                        _$body.addClass('mz-loading'); 
                        e.preventDefault(); 
                    }    
                }      
            }
        });
         
        $(document).on('click','.tzPopup-Done',function(e){
           
            var required_url = window.location.href;
            var data_url = '';
            var url_main = '?';
            var filter_url = "";
            if(decodeURIComponent(required_url).split('?').length > 1){
                required_url = decodeURIComponent(required_url).split('?')[1].split('&');
                for(var i =0; i< required_url.length;i++ ){
                    if(required_url[i].indexOf("facetValueFilter") == -1 && required_url[i].indexOf("startIndex")){ 
                        url_main = url_main+required_url[i];    
                    } else if(required_url[i].indexOf("facetValueFilter")){
                        filter_url = required_url[i].split('=')[1] ;   
                    }  
                }
            } 
            if($(document).find('.tzPopup-content .selected-facet-mobile').length > 0 || ($(document).find('.tzPopup-content .selected-facet-mobile').length < 1 && filter_url.length > 0)){
                if(url_main.length > 1){
                    data_url = data_url+'&facetValueFilter=';   
                }else{
                    data_url = data_url+'facetValueFilter=';     
                }   
                $(document).find('.tzPopup-content .selected-facet-mobile').each(function(){
                    var filter = $(this).children('a').attr('attr-require'); 
                    data_url = data_url+filter+',';
                }); 
                var needed_url = url_main+data_url;  
                $(e.currentTarget).attr('data-mz-url',needed_url);  
                var url=intentToUrl(e);
                //  setFacetValueMobile(e);
                if(url){
                    if (url && _dispatcher.send(url)) { 
                        _$body.addClass('mz-loading'); 
                        e.preventDefault(); 
                    }    
                } 
            }
        });
 
        $(document).on('click','.remove-filter-one',function(e){ 
            var valreq = $(e.currentTarget).attr('attr-filter'); 
            $(this).parents('.selected-facet-mobile').remove();
            $(document).find('.mz1-facetingform-value').each(function(){
                if($(this).attr('data-mz-facet-value-mobile')==valreq){
                    $(this).parents('li').removeClass('mz-facetform-selected');
                    $(this).find('.mz1-selectcolr').hide(); 
                }
            }); 
            if($(document).find('.selected-facet-mobile').filter(':visible').length >= 1){
                $(document).find('.tz-mobileSelected-filter').addClass('active');  
                $(document).find('.mz-refine-search').addClass('active');
            }else{
                $(document).find('.tz-mobileSelected-filter').removeClass('active');
                $(document).find('.mz-refine-search').removeClass('active'); 
            }
        }); 
         
        $(document).on('click','.mz-reset-filter',function(e){
            var url=intentToUrl(e);
                //  setFacetValueMobile(e);
                if(url){
                    if (url && _dispatcher.send(url)) { 
                        _$body.addClass('mz-loading'); 
                        e.preventDefault(); 
                    }    
                }    
                $(document).find('.selected-facet-mobile').remove(); 
                $(document).find('.mz-facetform-selected').removeClass('mz-facetform-selected');
                $(document).find('.tz-mobileSelected-filter').removeClass('active');
                $(document).find('.mz-refine-search').removeClass('active');
         });
        
        $(document).on('click','.item-name',function(e){    
             if($( window  ).width() <= 767){
                // var url=intentToUrl(e);
                // //  setFacetValueMobile(e);
                // if(url){
                //     if (url && _dispatcher.send(url)) {
                //         _$body.addClass('mz-loading'); 
                //         e.preventDefault(); 
                //     }    
                // }  
            //}else{  
                // mobile filter altreation for endless plp
                var ele;    
                if($(e.currentTarget).hasClass('item-name')){
                    ele = $(e.currentTarget).find('span.mz1-facetingform-value');
                }else{
                    ele = $(e.currentTarget);
                } 
                filterfun.mobileaddfilters(ele); 
            }
          
        });
        

    } 
   
    $(document).ready(function(){
        // custom function.
        console.log("Custom");
        console.log(custom.customObject);
        console.log("Custom");
        setTimeout(function(){
            $('#preloader').fadeOut();  
            $('#preloaderoverlay').delay(350).fadeOut('slow'); 
            custom.customObject.os();
            custom.customObject.autoload();
        },1000);
        
        
        //pagination mobile
        var pageValue = window.pageValue = 0;
        var pageFlag = window.pageFlag = true;
        var page = parseInt($('.mob-current').html(),10);
        if($('.mob-previous')){
            $('.mob-previous').html(page-1);
        } 
        $(document).find('.mz-l-sidebaritem-new').each(function(){
            if($(this).html().trim() === ''){
                $(this).remove();      
            }
        });
         
        // flover collection link validation
        $(document).find('.jb-childChildrenCategories-container a').click(function(e){ 
            e.preventDefault();
            var reqar = $(e.currentTarget).attr("href").split("/");
            var myar = window.location.pathname.split("/");
            if(myar[myar.length-2] == "c" && (myar[myar.length-1] == reqar[reqar.length-1])){
                if($(window).width() > 767){
                    $("html, body").animate({ 
                        scrollTop: $(document).find("#shop-all").offset().top - 50   
                    },1000);
                }else{
                    $("html, body").animate({ 
                        scrollTop: $(document).find("#shop-all").offset().top - 150      
                    },1000);
                }
            }else{
                window.location = $(e.currentTarget).attr("href");
            }
        });
        
        // allign elements center if there are less then 3 products
        $(document).find('.mz-l-sidebaritem').each(function(){
            if($(this).hasClass('g-category') || $(this).hasClass('g-brand') || $(this).hasClass('g-flavour') || $(this).hasClass('g-taste')){
                if($(this).find('ul li').length < 3){
                    $(this).find('ul').addClass('lessClass');
                }    
            }
        });
        
        // new filters reset all button
        if($(document).find('.selected-facet-value').length >= 1){
            $(document).find('.clear-all-outer-btn').addClass('active');
        }else{
            $(document).find('.clear-all-outer-btn').removeClass('active');    
        }
        
        // select first element in mobile filter
        $(document).find(".mz-l-sidebaritem-new").first().find('h4').addClass('selected');
        $(document).find(".mz-l-sidebaritem-new").first().find('h4').find('span').removeClass('mz-close-facet');
        $(document).find(".mz-l-sidebaritem-new").first().find('h4').find('span').addClass('mz-open-facet');
        
        // new filters changes mobile
        if($(document).find('.selected-facet-mobile').length >= 1){
            $(document).find('.tz-mobileSelected-filter').addClass('active');  
            $(document).find('.mz-refine-search').addClass('active');
        }else{
            $(document).find('.tz-mobileSelected-filter').removeClass('active');
            $(document).find('.mz-refine-search').removeClass('active'); 
        }
        
        //Incrementing Data Attributes
        var $oattr = $('[data-griddercontent]');
        $oattr.each(function(j) {
            var td = j+1;
            $(this).attr("data-griddercontent", "#" + td); 
        });
            
        var width= $(window).width();
        
        //mobile  
        $(document).on('click','[jb-mobSort]',function (e) {
            $('.mz-pagesort-mobile').slideDown('slow');
            $('.jb-mobile-sort').focus();
            loopmobilesort();
        });  
        
        // loop in mobile sort
        function loopmobilesort(){ 
            window.sortinputs = $(document).find('.jb-mobile-sort').find('.jb-mobile-sort-cancel,[data-mz-value="sortMob"]').filter(':visible');   
            window.sortfirstInput = window.sortinputs.first();
            window.sortlastInput = window.sortinputs.last(); 
            
             // if current element is last, get focus to first element on tab press.
            window.sortlastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.sortfirstInput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.sortfirstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.sortlastInput.focus();  
                }
            }); 
        }
        
        // mobile sort close button
        $(document).on('click','.jb-mobile-sort-icon,.jb-mobile-sort-cancel-label',function(){  
            // $('.mz-pagesort-mobile').slideUp('slow');
            $('.mz-pagesort-mobile').hide();
        });  
        $(document).on('keypress','.jb-mobile-sort-cancel', function( e ) {
            if ( e.which == 13 ) {
                e.preventDefault();
                //$('.mz-pagesort-mobile').slideUp('slow');
                $('.mz-pagesort-mobile').hide();
                $(document).find('[jb-mobsort]').find('a').focus();  
            }
        });
        $(document).on('keypress','[data-mz-value="sortMob"]', function(e) {
            if(e.which == 13){
                $(this).trigger('click');
            } 
        });
        var $facetPanelMobile = $('[data-mz-facets-mobile]');
        if ($facetPanelMobile.length > 0) {
            // Mobile Refine 
            $('.tz-Facets').each(function() { 
                $('<div id="tz-refinePopup" class="mz-mobile"><div tabindex="0" id="tz-mobilePopmenu"><span tabindex="0" role="button" aria-label="click to close overlay" class="tzPopup-exit"></span></span><div class="tzPopup-body"><div class="tzPopup-content"></div></div></div><div id="tzMoboverlay"></div></div>')
                .appendTo('body').find('.tzPopup-content').append($(this).html());
                $(this).empty(); 
                }).promise()
                .done(function() {
            });
            
            $(document).on('click','#tzMoboverlay,#tz-refinePopup .tzPopup-exit, .tzPopup-cancel',function (e) {
                e.preventDefault();
                $('#tz-mobilePopmenu.visible').addClass('transitioning').removeClass('visible');
                $('html').removeClass('overlay'); 
                $('#tz-refinePopup').hide();
                $('body').css({'overflow' : 'visible'});// making the body visible
                setTimeout(function () {
                    $('#tz-mobilePopmenu').removeClass('transitioning');
                }, 200); 
                $('.tz-mobRefine').focus();
            });
            $(document).on("keypress",'.cancel-btn-container',function(e) {
                if ( e.which == 13 ) {
                    e.preventDefault();
                    $(this).trigger('click');
                }
            });
            $(document).on('click','.tz-mobRefine', function(e) {
                e.preventDefault(); 
                $('#tz-refinePopup').slideDown('slow');
                $('html').addClass('overlay');
                $('#tz-mobilePopmenu').addClass('visible');
                $('body').css({'overflow' : 'hidden'});
                $('#tz-refinePopup').find('#tz-mobilePopmenu').focus(); 
                filterfun.loopfilterheadmobile();
            });
            $(document).on("click",'.tzPopup-Done',function(e){
                $('#tz-mobilePopmenu.visible').addClass('transitioning').removeClass('visible');
                $('html').removeClass('overlay'); 
                $('#tz-refinePopup').hide();
                $('body').css({'overflow' : 'visible'});// making body visible
                setTimeout(function () {
                    $('#tz-mobilePopmenu').removeClass('transitioning');
                }, 200);
            });
            $(document).on("keypress",'.tzPopup-Done',function(e){
                if ( e.which == 13 ) {
                    e.preventDefault();
                    $(this).trigger('click');
                }
            });
            $(document).on('click', '.tz-mobileSelected-filter a', function(e) {
                e.preventDefault();
                var self = $(this);
                var facet=self.attr('class');
                var selectedFacets = $('[data-mz-facet-value-mobile]');
                for(var i=0;i<selectedFacets.length;i++){
                    if($(selectedFacets[i]).attr('data-mz-facet-value-mobile') == facet){
                        $(selectedFacets[i]).click();
                    }
                }
                setTimeout(function() {self.parent('span').remove();}, 500);
            });
        } 
        var countitems = window.countitems = function(count){
            if(Math.floor(($(document).find('.g-category').find('.mz-facetingform-facet').find('.category').length-count)/3) == (($(document).find('.g-category').find('.mz-facetingform-facet').find('.category').length-count)/3)){
                return Math.floor(($(document).find('.g-category').find('.mz-facetingform-facet').find('.category').length-count)/3)-1;
            }else{ 
                return Math.floor(($(document).find('.g-category').find('.mz-facetingform-facet').find('.category').length-count)/3);
            }
        };
        var updatecatfilter = window.updatecatfilter = function(){
            if($(document).find('body').hasClass('mz-searchresults')){
                var skip_ele = 0;
                var counter = 0;
                var str1 = '',str2 = '',str3 = '';
                var div_item_count = window.countitems(0);
                var r1 = 0, r2 = 0, r3 = 0;
                var smallcount = 0;
                $(document).find('.g-category').find('.mz-facetingform-facet').find('.category').each(function(){
                    if($(this).find('.cat-name-container').find('.mz-facetingform-link').html() == "Color"){
                        str1 += "<div class='item-container'>"+$(this)[0].outerHTML+$(this).next('.sub-cat-list')[0].outerHTML+"</div>";
                        skip_ele++;
                        if(smallcount <= div_item_count){
                            r1++;    
                        }else if(smallcount <= (div_item_count*2) && smallcount > div_item_count){
                            r2++;
                        }else{
                            r3++;
                        }
                    }else if($(this).find('.cat-name-container').find('.mz-facetingform-link').html() == "Taste"){ 
                        str2 += "<div class='item-container'>"+$(this)[0].outerHTML+$(this).next('.sub-cat-list')[0].outerHTML+"</div>";    
                        skip_ele++;
                        if(smallcount <= div_item_count){
                            r1++;    
                        }else if(smallcount <= (div_item_count*2) && smallcount > div_item_count){
                            r2++;
                        }else{
                            r3++;
                        }
                    }else if($(this).find('.cat-name-container').find('.mz-facetingform-link').html() == "Brand"){
                        str3 += "<div class='item-container'>"+$(this)[0].outerHTML+$(this).next('.sub-cat-list')[0].outerHTML+"</div>";
                        skip_ele++;
                        if(smallcount <= div_item_count){
                            r1++;    
                        }else if(smallcount <= (div_item_count*2) && smallcount > div_item_count){
                            r2++;
                        }else{
                            r3++;
                        } 
                    } 
                    smallcount++;
                }); 
                
                $(document).find('.g-category').find('.mz-facetingform-facet').find('.category').each(function(){
                    if(counter <= (div_item_count-1+r1)){
                        if($(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Color" && $(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Taste" && $(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Brand"){
                            str1 += "<div class='item-container'>"+$(this)[0].outerHTML+$(this).next('.sub-cat-list')[0].outerHTML+"</div>";
                        }
                    }else if(counter <= (((div_item_count)*2)+1+r2)){   
                        if($(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Color" && $(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Taste" && $(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Brand"){
                            str2 += "<div class='item-container'>"+$(this)[0].outerHTML+$(this).next('.sub-cat-list')[0].outerHTML+"</div>";
                        }
                    }else{ 
                        if($(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Color" && $(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Taste" && $(this).find('.cat-name-container').find('.mz-facetingform-link').html() != "Brand"){
                            str3 += "<div class='item-container'>"+$(this)[0].outerHTML+$(this).next('.sub-cat-list')[0].outerHTML+"</div>";
                        }
                    } 
                    counter++; 
                });
                var maindiv = "<div class='main-container'><div class='first-container sub-container'>"+str1+"</div><div class='second-container sub-container'>"+str2+"</div><div class='third-container sub-container'>"+str3+"</div></div>";
                $(document).find('.g-category').find('.mz-facetingform-facet').html(maindiv); 
            }
        };
        window.updatecatfilter(); 
    });  

    var newLabel=function(){
        var one_day=1000*60*60*24;     
        var comingSoonData = []; // Hypr.getThemeSetting('comingSoonThresholds').split(',');
        var comingSoon = [];
        _.each(comingSoonData, function(pair) { var tmpArray = pair.split('='); 
            comingSoon[tmpArray[0]] = parseInt(tmpArray[1],10);
        });
        $('.mz-productlist-item').each(function(){
            var productDate =$(this).attr('createDate').substring(0,10).replace(/\//g,'-').trim(); 
            var currentDate = $('#currentDate').text();
            var x = productDate.split('-'); 
            var y = currentDate.split('-');   
            var date1 = new Date(x[2],x[0]-1,x[1]);     
            var date2 = new Date(y[2],y[1]-1,y[0]);
            var days = Math.ceil((date2.getTime()-date1.getTime())/(one_day)); 

            if($(this).attr('productType') !== "Gift Certificate"){
                if ( days >= 0 && $(this).attr('onlineStockAvailable') === 0) {
                    $('div[data-mz-product='+$(this).attr('data-mz-product')+']').find('.product-sale-new-label').show().css({ "background-color" : "#000099", "line-height" : "8px"}).html("<span style='font-size: 10px;'>COMING</span><br><span style='font-size: 9px;'>SOON</span>");
                }else if(days <= Hypr.getThemeSetting('newLabelThreshold') && days >= 0 && $(this).attr('price') == $(this).attr('salePrice')){
                    $('div[data-mz-product='+$(this).attr('data-mz-product')+']').find('.product-sale-new-label').show();
                }
            }
        });
    };   
    //newLabel(); 
    // function notifymedilog(){
    //     window.notifyinputs = $(document).find('#cboxContent').find('select, input, textarea, button, a').filter(':visible');   
    //     window.notifyfirstInput = window.notifyinputs.first();
    //     window.notifylastInput = window.notifyinputs.last(); 
        
    //      // if current element is last, get focus to first element on tab press.
    //     window.notifylastInput.on('keydown', function (e) {
    //        if ((e.which === 9 && !e.shiftKey)) {
    //            e.preventDefault();
    //            window.notifyfirstInput.focus(); 
    //        }
    //     });
        
    //     // if current element is first, get focus to last element on tab+shift press.
    //     window.notifyfirstInput.on('keydown', function (e) {
    //         if ((e.which === 9 && e.shiftKey)) {
    //             e.preventDefault();
    //             window.notifylastInput.focus();  
    //         }
    //     }); 
    // }
    
    var $prevTarget;
    // $(document).on('click','.jb-out-of-stock', function(e) {
    //     var emailVal = '';
    //     if(require.mozuData('user').isAuthenticated){
    //         emailVal = require.mozuData('user').email;
    //     }
    //     $prevTarget = $(e.target);
    //     $.colorbox({
    //         open : true,
    //         maxWidth : "100%",
    //         maxHeight : "100%",
    //         scrolling : false,
    //         fadeOut : 500,
    //         html : "<div id='notify-me-dialog' tabindex='0' style='padding: 30px;' role='dialog' aria-labelledby='Noiify me sign up dialog'><form><span>Enter your email address to be notified when this item is back in stock.</span><br><input tabindex='0' style='margin-top: 10px;' class='notify-me-email-plp' id='notify-me-email' type='text' aria-label='Enter email address text field' value='"+emailVal+"'><a tabindex='0' href='javascript:void(0);' role='button' aria-label='notify me' class='notify-me-plp-rti-popup' id='notify-me-button' data-mz-location-code = '"+ e.target.getAttribute('data-mz-location-code')+"'data-mz-product-code='" + e.target.getAttribute('data-mz-product-code') + "'>Notify Me</a></form></div>", //"/resources/intl/geolocate.html",
    //         overlayClose : true,
    //         trapFocus: false, 
    //         onComplete : function () {
    //             $('#cboxClose').show().attr({'role':'button','aria-label':'close dialog'});
    //             $('#cboxLoadedContent').css({
    //                 background : "#ffffff"
    //             });
    //             $('#notify-me-dialog').focus();
    //             notifymedilog(); 
    //         }
    //     });
    // });
    // notifymedilog();
    
     
    // $(document).on('click','#cboxClose',function(e) {
    //     $(document).find($prevTarget).focus();
    // });
    
    // $(document).on('keyup','#notify-me-email',function(e){
    //     $('.errormsgpopup').hide();    
    // });
    
    // $(document).on('click','#notify-me-button', function(e) {
    //     if($('#notify-me-email').val().trim()  !== ''){
    //         var user = require.mozuData('user'),
    //             location = $(e.currentTarget).attr('data-mz-location-code');
    //             var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //             var patt = new RegExp(re);
    //         if(patt.test($('#notify-me-email').val().trim())){    
    //         api.create('instockrequest', {
    //             email: $('#notify-me-email').val(),
    //                 customerId: user.accountId,
    //             productCode: e.target.getAttribute('data-mz-product-code'), 
    //                 locationCode:location
    //         }).then(function (xhr) {
    //             $("#notify-me-dialog").fadeOut(500, function () { $("#notify-me-dialog").empty().html("<div class='success-msg' tabindex='0'>Thank you! We'll let you know when we have more.</div>").fadeIn(500); });
    //             setTimeout(function(){ notifymedilog(); $("#notify-me-dialog").find('.success-msg').focus(); }, 1200);
    //         }, function (xhr) {
    //             $('[data-mz-message-bar]').hide();
    //             if(xhr.errorCode == "VALIDATION_CONFLICT"){
    //                 $('[data-mz-message-bar]').hide(); 
    //                 $('#notify-me-button').next('.errormsgpopup').remove();
    //                 $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Please enter valid email address.</div>'); 
    //                 $("#notify-me-dialog").find('.errormsgpopup').focus();
    //             }else if(xhr.errorCode != "ITEM_ALREADY_EXISTS"){   
    //                 //$("#notify-me-dialog").fadeOut(500, function () { $('[data-mz-message-bar]').hide(); $("#notify-me-dialog").empty().html(xhr.items[0].message).fadeIn(500); $("#notify-me-dialog").css('color','red');  }); 
    //                 $('[data-mz-message-bar]').hide();
    //                 $('#notify-me-button').next('.errormsgpopup').remove();
    //                 if(xhr.items.length){ 
    //                     $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">'+xhr.items[0].message+'</div>');
    //                     $("#notify-me-dialog").find('.errormsgpopup').focus();
    //                     }else{
    //                         $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">'+xhr.message+'</div>');
    //                         $("#notify-me-dialog").find('.errormsgpopup').focus();
    //                     }    
    //                 }else{
    //                     $('[data-mz-message-bar]').hide();
    //                     $('#notify-me-button').next('.errormsgpopup').remove();
    //                     $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Email id you have provided already subscribed for back in stock notification.</div>');
    //                     $("#notify-me-dialog").find('.errormsgpopup').focus();
    //                 }    
    //                 $('[data-mz-message-bar]').hide();
    //             });
    //         }else{
    //             $('#notify-me-button').next('.errormsgpopup').remove();  
    //             $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Please enter valid email address.</div>');
    //             $("#notify-me-dialog").find('.errormsgpopup').focus();
    //         }
    //     }else{/*Error: */
    //         $('#notify-me-button').next('.errormsgpopup').remove();  
    //         $('#notify-me-button').after('<div style="color:red;font-size: 12px;" class="errormsgpopup" tabindex="0">Error: Please enter valid email address.</div>');
    //         $("#notify-me-dialog").find('.errormsgpopup').focus();
    //     } 
    // });  

    // $(document).on('keypress', '#notify-me-email', function (e) {
    //     if (e.which === 13) {
    //         e.preventDefault();
    //         $('#notify-me-button').trigger('click');
    //         return false;
    //     }
    // });

    var quickViewFun = {
        showquickview: function(e){
            var id = $(e.currentTarget).parents('.gridder-list').attr('data-griddercontent');
            var html = quickViewFun.makeHtml(id.replace("#",""));
            var selectedProduct = $(e.currentTarget).parent('[data-mz-product]').data('mz-product');
            var flag = false;
            if(!$('.gridder-show').is(':visible')){
                flag = true;
            }
            $('.gridder-show').remove(); 
            $('.gridder-list').removeClass('selectedItem');  
            $('.gridder-list[data-griddercontent="'+id+'"]').after(html);
            $('.gridder-list[data-griddercontent="'+id+'"]').addClass('selectedItem'); 
            $("html, body").animate({ 
                scrollTop: $(document).find(".selectedItem").offset().top - 80   
            }, {
                duration: 200
            });
            if(flag){
                $('.gridder-show').slideDown();   
            }else{
                $('.gridder-show').show();         
            } 
            $('.gridder-list[data-griddercontent="'+id+'"]').next('.gridder-show').focus();  
            quickViewFun.isAddedToWishlist(selectedProduct);
            quickViewFun.activateloopinginquickview();
        },   
        makeHtml: function(id){
            var str = '<div id="'+id+'" class="gridder-show" tabindex="-1">';    
            str = str + '<div class="gridder-padding"><div class="gridder-navigation"><a href="javascript:void(0)" class="gridder-close">Close</a><a href="javascript:void(0)" class="gridder-nav prev ">Previous</a><a href="javascript:void(0)" class="gridder-nav next ">Next</a></div><div class="gridder-expanded-content">'; 
            str = str + $(document).find('.gridder-list[data-griddercontent="#'+id+'"]').html();  
            str = str + '</div></div></div>';
            return str;
        },
        closeQuickView: function(e){
            e.preventDefault();
            $("html, body").animate({ 
                scrollTop: $(document).find(".selectedItem").offset().top - 80 
            }, {
                duration: 200
            });
            var contentid = $(e.currentTarget).parents('.gridder-show').attr('id');
            $(e.currentTarget).parents('.gridder-show').slideUp(500);   
            setTimeout(function(){
                $(document).find('.gridder-show').remove();     
            },500);
            $('.gridder-list[data-griddercontent="#'+contentid+'"]').removeClass('selectedItem'); 
            $('.gridder-list[data-griddercontent="#'+contentid+'"]').find('.mz-productlisting-image').find('a').focus();  
        },
        activateloopinginquickview: function(){
            window.inputs = $(document).find('.gridder-show').find('select, input, textarea, button, a ').filter(':visible'); 
            window.firstInput = window.inputs.first();
            window.lastInput = window.inputs.last(); 
            
            // if current element is last, get focus to first element on tab press.
            window.lastInput.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                   e.preventDefault();
                   window.firstInput.focus(); 
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.firstInput.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) {
                    e.preventDefault();
                    window.lastInput.focus(); 
                }
            });  
        },
        /* JEL-214 */
        isAddedToWishlist: function(quickViewPrdCode) {
            $('.add-to-wishlist-c>a').text('Wishlist').addClass('add-to-wishlist').removeClass('added-to-wishlist');
            $('a.add-to-wishlist').css('cursor','pointer');
            if(require.mozuData("user").isAuthenticated) {
                api.get('wishlist').then(function(response) {
                var wishlistCount = response.data.items.length;
                    for (var i = 0; i < wishlistCount; i++) {
                        var wistlistItemCount = response.data.items[i].items.length;
                        for (var j = 0; j < wistlistItemCount; j++) {
                            var productCode = response.data.items[i].items[j].product.productCode;
        
                            if(quickViewPrdCode.toString() === productCode) {
                                $('.add-to-wishlist-c>a').text(Hypr.getLabel('addedToWishlist')).removeClass('add-to-wishlist').addClass('added-to-wishlist');
                                $('a.added-to-wishlist').css('cursor','not-allowed');
                                $('.add-to-wishlist-c>a').removeClass('add-to-wishlist-qv');
                                $('.add-to-wishlist-c>a').addClass('added-to-wishlist-qv');
                            }
                        }
                    }
                });
            }
        }
    }; 

    $(document).on('click','.img-overlay',function(e){ 
        quickViewFun.showquickview(e);
    });

    $(document).on('click','.gridder-close',function(e){  
        quickViewFun.closeQuickView(e);
    });
    
    $(document).on('click', '.mz-l-sidebaritem-new h4', function (e) {
        //  if ($(this).attr("class") !== "selected") {
            // $(".mz-l-sidebaritem-new ul").slideUp();
            // $(".showfirstitem").removeClass("showfirstitem");
            // $(".mz-l-sidebaritem-new h4").removeClass("selected");
            // $(".mz-l-sidebaritem-new h4").find("span").removeClass("mz-open-facet");
            // $(".mz-l-sidebaritem-new h4").find("span").addClass("mz-close-facet");
            // $(this).parent().find(".mz-facetingform-facet").slideDown();
            // $(this).addClass("selected");
            // if ($(this).find("span").hasClass("mz-close-facet")) {
            //     $(this).find("span").removeClass('mz-close-facet');
            //     $(this).find("span").addClass('mz-open-facet');
            // }
        //  }else{
            // $(".mz-l-sidebaritem-new ul").slideUp(); 
            // $(".showfirstitem").removeClass("showfirstitem");
            // $(".mz-l-sidebaritem-new h4").removeClass("selected");
            // $(".mz-l-sidebaritem-new h4").find("span").removeClass("mz-open-facet");
            // $(".mz-l-sidebaritem-new h4").find("span").addClass("mz-close-facet");
        //  }
        
        // optimized code for accodian mobile
        filterfun.mobileaccordianfun($(e.currentTarget)); 
        
    }); 
    
    
    
    $(document).on('keydown','.mz-l-sidebaritem-new h4', function (e){
        if(e.which == 13 || e.which == 32){
            e.preventDefault();
            filterfun.mobileaccordianfun($(document.activeElement)); 
        }//else if(e.which == 27){
        //      e.preventDefault();
        //      filterfun.mobileaccordianfun($(document.activeElement)); 
        // }       
    });
    
    var inputs = window.inputs ;
    var firstInput = window.firstInput ;
    var lastInput = window.lastInput ; 

    var notifyinputs = window.notifyinputs; 
    var notifyfirstInput = window.notifyfirstInput;
    var notifylastInput = window.notifylastInput; 
    
    $(document).on('keydown','.img-overlay',function(e){
        if ((e.which === 9 && e.shiftKey)) {
            e.preventDefault();
            if($(e.currentTarget).parents('.gridder-list').prev().length){
                $(e.currentTarget).parents('.gridder-list').prev().find('.jb-buy-product').find('a').focus();   
            }
            else if($(e.currentTarget).parents('.gridder-list').prev().length === 0) {
                $(document).find('.jb-pagecontrols').find('.mz-pagingcontrols-pagesort-dropdown').focus();
            } 
        }
        else if( e.which === 9 ) {
            e.preventDefault();
            $(e.currentTarget).next().find('a:first').focus();
        }
    });
    // new filter functions 
    var filterfun = {
        openclosefunction: function(ele){
            if(ele.hasClass('active')){
                ele.removeClass('active'); 
                $(document).find('.filter-list,.pointer-filter').removeClass('active');
                $(document).find('.facets-type-list').find('.facete-type-li').attr('aria-expanded',false);
                ele.attr('aria-expanded',false);
                ele.focus();
                $(document).find('.facets-type-list').find('.facete-type-li').removeClass('active');
                $(document).find('.facet-name-list').find('.mz-l-sidebaritem').removeClass('active');
                $(document).find('.mz-l-paginatedlist').css('min-height','');
            }else{  
                ele.addClass('active'); 
                ele.attr('aria-expanded',true);
                $(document).find('.filter-list,.pointer-filter').addClass('active'); 
                //$(document).find('.filter-list,.pointer-filter').focus();
                $(document).find('.facets-type-list').find('.facete-type-li').first().focus();
                $(document).find('.facets-type-list').find('.facete-type-li').first().attr('aria-expanded',true);
                $(document).find('.facets-type-list').find('.facete-type-li').first().addClass('active');
                $(document).find('.facet-name-list').find('.mz-l-sidebaritem.'+$.trim($(document).find('.facets-type-list').find('.facete-type-li').first().attr('data-attr'))).addClass('active'); 
                this.loopfilterhead();
                $(document).find('.mz-l-paginatedlist').css('min-height','300px');
            } 
        },
        closefunction: function(ele){
            ele.find('.arrow').addClass('down');  
            ele.find('.arrow').removeClass('up');
            $(document).find('.filter-list,.pointer-filter').removeClass('active');
            ele.focus();
            $(document).find('.facets-header').attr('aria-expanded',false);
            $(document).find('.facets-type-list').find('.facete-type-li').attr('aria-expanded',false);
            $(document).find('.facets-type-list').find('.facete-type-li').removeClass('active');
            $(document).find('.facet-name-list').find('.mz-l-sidebaritem').removeClass('active'); 
            $(document).find('.facets-header').focus();
        },
        changefiltertype: function(ele){
            $(document).find('.facets-type-list').find('.facete-type-li').removeClass('active');
            $(document).find('.facet-name-list').find('.mz-l-sidebaritem').removeClass('active');
            $(document).find('.facets-type-list').find('.facete-type-li').attr('aria-expanded',false);
            ele.addClass('active');
            ele.attr('aria-expanded',true);
            $(document).find('.facet-name-list').find('.mz-l-sidebaritem.'+$.trim(ele.attr('data-attr'))).addClass('active');
            if($(document).find('.mz-l-sidebaritem.active').find('.item-name').filter(':visible').first().attr('tabindex') === "0"){
                $(document).find('.mz-l-sidebaritem.active').find('.item-name').filter(':visible').first().focus();
            }else{
                $(document).find('.mz-l-sidebaritem.active').find('.item-name').filter(':visible').first().find('a').focus();    
            }
            this.loopfilteritems(); 
        },
        addfilter: function(ele){
            if(!ele.hasClass('mz-facetform-selected') && !ele.hasClass('category') && !ele.parents().hasClass('category')){
                var valuetodisplay;
                if(ele.attr('value-to-display')){
                    valuetodisplay =  ele.attr('value-to-display');   
                }else{
                    valuetodisplay =  ele.find('[value-to-display]').attr('value-to-display');    
                }
                var str = '<li role="contentinfo" aria-label="'+ele.attr("aria-label")+'" tabindex="0" class="item-name '+ele.attr("attr-name-type")+' selected-facet-value  mz-facetform-selected " url-component="'+ele.attr("url-component")+'"><label class="mz-facetingform-valuelabel mz1-facetingform-value" data-mz-facet-value="'+ele.attr("url-component")+'" >'+valuetodisplay+'</label><span tabindex="0" role="button" aria-label="remove-facet '+ele.attr("aria-label")+'" class="cross-btn-facets">X</span></li>';
                $(document).find('.mz-facetingform-selected').find('ul.mz-facetingform-facet').append(str); 
                ele.addClass('mz-facetform-selected');
                if($(document).find('.selected-facet-value').length >= 1){
                    $('.clear-all-outer-btn').addClass('active');
                }else{
                    $('.clear-all-outer-btn').removeClass('active');    
                }
            }else if(ele.hasClass('mz-facetform-selected')){
                ele.removeClass('mz-facetform-selected');
                $(document).find('.filter-list-selected').find('.selected-facet-value').each(function(){
                    if($(this).attr('url-component') == ele.attr("url-component")){
                        $(this).remove();   
                    }
                });    
            }
        },
        handalescpforitem:function(ele){
            $(document).find('.facete-type-ul').find('.facete-type-li.active').focus();  
            this.loopfilterhead(); 
        },
        handalescpforheaditem:function(ele){
            $(document).find('.facets-header').find('.container-filter').find('.arrow').addClass('down');  
            $(document).find('.facets-header').find('.container-filter').find('.arrow').removeClass('up');
            $(document).find('.filter-list,.pointer-filter').removeClass('active');
            ele.focus();
            $(document).find('.facets-header').attr('aria-expanded',false);
            $(document).find('.facets-type-list').find('.facete-type-li').attr('aria-expanded',false);
            $(document).find('.facets-type-list').find('.facete-type-li').removeClass('active');
            $(document).find('.facet-name-list').find('.mz-l-sidebaritem').removeClass('active'); 
            $(document).find('.facets-header').focus();
        },
        categoryaccordian:function(ele){
            if($( window  ).width() > 767){
                if(!ele.hasClass('active')){
                    $(document).find('.item-name').attr('aria-expanded',false);
                    $(document).find('.item-name').removeClass('active');
                    $(document).find('.item-container').find('.sub-cat-list').slideUp('slow');
                    ele.addClass('active');
                    ele.attr('aria-expanded',true);
                    ele.parents('.item-container').find('.sub-cat-list').slideDown('slow');
                    $(document).find('.item-name.active').parents('.item-container').find('.sub-cat-list').find('.item-name-submenu').first().find('a').focus();
                    this.loopfiltersubitems();
                }else{
                    $(document).find('.item-name.active').focus(); 
                    ele.removeClass('active');
                    ele.attr('aria-expanded',false);
                    ele.parents('.item-container').find('.sub-cat-list').slideUp('slow'); 
                    this.loopfilteritems(); 
                }
            }
        },
        mobileaccordianfun: function(ele){
            if(!ele.parents('.mz-l-sidebaritem-new').hasClass("selected")){ 
                $(".mz-l-sidebaritem-new ul").slideUp();    
                $(".mz-l-sidebaritem-new").removeClass("selected");
                ele.parent().find(".mz-facetingform-facet").slideDown();
                ele.parents('.mz-l-sidebaritem-new').addClass("selected");
                ele.parents('.mz-l-sidebaritem-new').find('.item-name').filter(':visible').first().focus();
                this.loopfilteritemsmobile();
            }else{
                $(".mz-l-sidebaritem-new ul").slideUp();   
                $(".mz-l-sidebaritem-new").removeClass("selected");  
                ele.focus(); 
                this.loopfilterheadmobile();
            }
        },
        mobileaccordianescpfun:function(){
            $(".mz-l-sidebaritem-new.selected h4").focus();
            $(".mz-l-sidebaritem-new ul").slideUp();  
            $(".mz-l-sidebaritem-new").removeClass("selected"); 
            this.loopfilterheadmobile();
        },
        handalescpforsubitem:function(ele){ 
            this.categoryaccordian($('.item-name.active'));
        },
        mobileaddfilters:function(ele){
            if(!ele.hasClass('remove-filter-one') && !ele.parents('li').hasClass('mz-facetform-selected') && ele.html() !== ''){
                var valuetoshow = ele.prev().attr('data-mz-facet-titel-mobile');
                var valuetoappend = ele.prev().attr('data-mz-facet-value-mobile');
                var faceteid = ele.prev().attr('data-mz-facet-label-mobile'); 
                var facetname = ele.prev().attr('data-mz-facet');
                var ratingValue = ele.prev().attr('rating-facet');
                if(!valuetoappend){
                    valuetoshow = ele.attr('data-mz-facet-titel-mobile');
                    valuetoappend = ele.attr('data-mz-facet-value-mobile');      
                    faceteid = ele.attr('data-mz-facet-label-mobile');
                    facetname = ele.attr('data-mz-facet');
                    ratingValue = ele.attr('rating-facet'); 
                }  
                var stringtoappend = ''; 
                if(facetname){
                    if(facetname.indexOf("Price") == -1 && facetname.indexOf("tenant~ratingforfacet") == -1){  
                        stringtoappend = '<span role="contentinfo" aria-label="'+valuetoshow+'" tabindex="0" class="selected-facet-mobile">'+valuetoshow+'<a role="button" aria-label="remove-facet '+valuetoshow+'" tabindex="0" href="javascript:void(0);" attr-filter="'+valuetoappend+'" attr-require="'+facetname+':'+valuetoappend+'" class="remove-filter-one" id="'+faceteid+'">X</a></span>';
                        //$(document).find('.selected-facet-mobile .'+valuetoappend).length;
                    }else{  
                        if(facetname.indexOf("tenant~ratingforfacet") > -1){ 
                            stringtoappend = '<span role="contentinfo" aria-label="'+valuetoshow+'" tabindex="0" class="selected-facet-mobile">'+ratingValue+'<a role="button" aria-label="remove-facet '+valuetoshow+'" tabindex="0" href="javascript:void(0);" attr-filter="'+valuetoappend+'" attr-require="'+valuetoappend+'" class="remove-filter-one" id="'+faceteid+'">X</a></span>';
                        //$(document).find('.selected-facet-mobile .'+valuetoappend).length;
                        }else if(facetname.indexOf("Price") > -1){
                            stringtoappend = '<span role="contentinfo" aria-label="'+valuetoshow+' $" tabindex="0" class="selected-facet-mobile">'+valuetoshow+'<a role="button" aria-label="remove-facet '+valuetoshow+'" tabindex="0" href="javascript:void(0);" attr-filter="'+valuetoappend+'" attr-require="'+valuetoappend+'" class="remove-filter-one" id="'+faceteid+'">X</a></span>';
                        }
                        else{
                            stringtoappend = '<span role="contentinfo" aria-label="'+valuetoshow+'" tabindex="0" class="selected-facet-mobile">'+valuetoshow+'<a role="button" aria-label="remove-facet '+valuetoshow+'" tabindex="0" href="javascript:void(0);" attr-filter="'+valuetoappend+'" attr-require="'+valuetoappend+'" class="remove-filter-one" id="'+faceteid+'">X</a></span>';
                        }
                    }
                    ele.parents('li').addClass('mz-facetform-selected'); 
                    ele.find('.mz1-selectcolr').show();  
                    $(document).find('.tz-mobileSelected-filter').append(stringtoappend);
                    if($(document).find('.selected-facet-mobile').length >= 1){
                        $(document).find('.tz-mobileSelected-filter').addClass('active');  
                        $(document).find('.mz-refine-search').addClass('active');
                    }else{
                        $(document).find('.tz-mobileSelected-filter').removeClass('active');
                        $(document).find('.mz-refine-search').removeClass('active'); 
                    }
                }
            }
        },
        mobilecataccordian:function(ele){
            if($( window  ).width() <= 767){
                if(!ele.hasClass('active')){
                    $(document).find('.mobile-category').removeClass('active');
                    $(document).find('.sub-cat-list-mobile').slideUp();
                    ele.addClass('active');
                    ele.find('.sub-cat-list-mobile').slideDown(); 
                    ele.find('.sub-cat-list-mobile').find('.item-name-submenu-mobile').filter(':visible').first().find('a').focus();
                    this.loopsubmenucatitemsmobile();
                }else{
                    $(document).find('.mobile-category.active').focus();
                    $(document).find('.mobile-category').removeClass('active');
                    $(document).find('.sub-cat-list-mobile').slideUp();  
                    this.loopfilteritemsmobile();
                }
            }
        },
        handelescpmobilesubmenu:function(){
            $(document).find('.mobile-category.active').focus();
            $(document).find('.mobile-category').removeClass('active');
            $(document).find('.sub-cat-list-mobile').slideUp();  
            this.loopfilteritemsmobile();
        },
        loopsubmenucatitemsmobile:function(){
            this.commonloopfun($(document).find('.mobile-category.active').find('.item-name-submenu-mobile').filter(':visible'));
        },
        loopfiltersubitems:function(){
            this.commonloopfun($(document).find('.item-name.active').find('.sub-cat-list').find('.item-name-submenu').filter(':visible'));
            // window.filterheadinputs = $(document).find('.item-name.active').find('.sub-cat-list').find('.item-name-submenu').filter(':visible');   
            // window.filterheadfirstInput = window.filterheadinputs.first();
            // window.filterheadlastInput = window.filterheadinputs.last();             
        },
        loopfilteritemsmobile:function(){
            this.commonloopfun($(document).find('.mz-l-sidebaritem-new.selected').find('.item-name').filter(':visible'));
        },
        loopfilterheadmobile:function(){ 
            this.commonloopfun($(document).find('#tz-mobilePopmenu').find('.tzPopup-Done,.cancel-btn-container,.mz-l-sidebaritem-new h4').filter(':visible'));
        }, 
        loopfilterhead:function(){
            this.commonloopfun($(document).find('.filter-list').find('.mz-facetingform-clearall,.item-name,.apply-filter-button,.mz-facetingform-clearall').filter(':visible')); 
        }, 
        loopfilteritems:function(){
            this.commonloopfun($(document).find('.filter-list.active').find('.mz-facetingform-clearall,.item-name,.apply-filter-button,.mz-facetingform-clearall').filter(':visible'));
        },
        commonloopfun:function(inputs){
            window.inputs = inputs;    
            window.first = window.inputs.first();
            window.last = window.inputs.last(); 
            
             // if current element is last, get focus to first element on tab press.
            window.last.on('keydown', function (e) {
               if ((e.which === 9 && !e.shiftKey)) {
                    e.preventDefault();
                    if(window.first.attr('tabindex') === "0"){
                        window.first.focus(); 
                    }else{
                        window.first.find('[tabindex="0"]').focus();   
                    }
               }
            });
            
            // if current element is first, get focus to last element on tab+shift press.
            window.first.on('keydown', function (e) {
                if ((e.which === 9 && e.shiftKey)) { 
                    e.preventDefault();
                    if(window.last.attr('tabindex') === "0"){
                        window.last.focus();  
                    }else{
                        window.last.find('[tabindex="0"]').focus();      
                    }
                }
            });          
        } 
    };
    
    $(document).on('keydown','.item-name-submenu-mobile a',function(e){
        if(e.which == 27){
            e.preventDefault();
            filterfun.handelescpmobilesubmenu();    
        }else if(e.which == 13 || e.which == 32){
            e.preventDefault();
            window.location = window.location.origin+$(e.currentTarget).attr('href');
        }
    });
    
    $(document).on('click','.mobile-category',function(e){
        filterfun.mobilecataccordian($(e.currentTarget));  
    });
    
    $(document).on('keydown','.mobile-category',function(e){
        if(e.which == 13 || e.which == 32){
            e.preventDefault();
            filterfun.mobilecataccordian($(document.activeElement));
        }else if(e.which == 27){
            e.preventDefault();    
        }   
    });
    
    $(document).on('keydown','.cancel-btn-container',function(e){
        if(e.which == 13 || e.which == 32){
            e.preventDefault();
            //filterfun.changefiltertype($(document.activeElement));
            $(document.activeElement).find('.tzPopup-cancel').click();
        }else if(e.which == 27){
            // e.preventDefault();
            // filterfun.handalescpforheaditem($(document.activeElement));
        }    
    });
    
    $(document).on('click','.facete-type-li',function(e){
        filterfun.changefiltertype($(e.currentTarget));    
    });
    
    $(document).on('keydown','.facete-type-li',function(e){
        if(e.which == 13 || e.which == 32){
            e.preventDefault();
            filterfun.changefiltertype($(document.activeElement));
        }else if(e.which == 27){
            e.preventDefault();
            filterfun.handalescpforheaditem($(document.activeElement));
        } 
    });
    
    $(document).on('click','.facets-header',function(e){
        filterfun.openclosefunction($(e.currentTarget));   
    });
    
    $(document).on('keydown','.facets-header',function(e){
        if(e.which == 13 || e.which == 32){
            e.preventDefault();
            filterfun.openclosefunction($(document.activeElement));  
        }
    });

    $(document).on('click', '.cross-icon', function(e){
        var ele = $(e.target).parents('.mz-l-sidebar.mz-desktop-filters').find('.facets-header');
        ele.removeClass('active'); 
        $(document).find('.filter-list,.pointer-filter').removeClass('active');
        $(document).find('.facets-type-list').find('.facete-type-li').attr('aria-expanded',false);
        ele.attr('aria-expanded',false);
        ele.focus();
        $(document).find('.facets-type-list').find('.facete-type-li').removeClass('active');
        $(document).find('.facet-name-list').find('.mz-l-sidebaritem').removeClass('active');
        $(document).find('.mz-l-paginatedlist').css('min-height','');   
    });

    $(document).on('keydown','.cross-icon',function(e){
        if(e.which == 13 || e.which == 32){
            e.preventDefault();
            filterfun.openclosefunction($(document.activeElement));  
        }
    });
    
    $(document).on('click','.filter-list .item-name',function(e){ 
        if($( window  ).width() > 767){ 
            filterfun.addfilter($(e.currentTarget));  
        }
    });
    
    $(document).on('keydown','.item-name',function(e){ 
        if($( window  ).width() > 767){
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                filterfun.addfilter($(document.activeElement));
            }else if(e.which == 27){
                e.preventDefault();
                if($(e.target).hasClass('item-name')){
                    filterfun.handalescpforitem($(document.activeElement));
                }
            }
        }else{
            if(e.which == 13 || e.which == 32){
                e.preventDefault();
                var ele;    
                if($(document.activeElement).hasClass('item-name')){
                    ele = $(document.activeElement).find('span.mz1-facetingform-value');
                }else{
                    ele = $(document.activeElement);
                } 
                if(!ele.parents('.item-name').hasClass('category'))
                    filterfun.mobileaddfilters(ele); 
            }else if(e.which == 27){
                e.preventDefault();
                if($(e.target).hasClass('item-name')){
                    filterfun.mobileaccordianescpfun($(document.activeElement));
                }
            }    
        }
    }); 
    
    $(document).on('keydown','.apply-filter-button,.mz-facetingform-clearall',function(e){
        if(e.which == 27){
            e.preventDefault();
            filterfun.handalescpforitem($(document.activeElement)); 
        }   
    });
    
    // $(document).on('click', function(e){ 
    //     if(!$(e.target).hasClass('facets-container') && !$(e.target).parents().hasClass('facets-container')){
    //         if($('.filter-list').hasClass('active')){
    //             filterfun.closefunction($(e.currentTarget)); 
    //         }
    //     }
    // });
    
    $(document).on('click','.item-name.category',function(e){
        if(!$(document.activeElement).hasClass('sub-cat-list') && !$(document.activeElement).parents().hasClass('sub-cat-list')){
            filterfun.categoryaccordian($(e.currentTarget)); 
        }
    });
    
    $(document).on('keydown','.item-name.category',function(e){
        if($( window  ).width() > 767){
            if(e.which == 13 || e.which == 32){
                if(!$(document.activeElement).hasClass('sub-cat-list') && !$(document.activeElement).parents().hasClass('sub-cat-list')){
                    e.preventDefault();
                    filterfun.categoryaccordian($(document.activeElement));
                }
            }else if(e.which == 27){
                e.preventDefault();
                if($(e.target).hasClass('item-name')){
                    filterfun.handalescpforitem($(document.activeElement));
                }
            }
        }
    });
    
    $(document).on('keydown','.item-name-submenu a',function(e){
        if(e.which == 27){
            e.preventDefault();
            filterfun.handalescpforsubitem($(document.activeElement));
        }else if(e.which == 13 || e.which == 32){
            window.location = window.location.origin+$(e.currentTarget).attr('href');
        }   
    });
     
    $(document).on('keydown', '.cat-name-container a',function(e){
        if(e.which == 13 || e.which == 32){
            window.location = window.location.origin+$(e.currentTarget).attr('href');
        }       
    });
    
    
    return {
        createFacetedCollectionViews: factory
    };
    

});


