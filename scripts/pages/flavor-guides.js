require([
		"modules/jquery-mozu",
		"hyprlive",
		"modules/backbone-mozu",
		"modules/api"], function ($, Hypr, Backbone, api) {

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
	/**
	 * Render model.
	 * Rearange category.
	 **/
	$(document).ready(function () {

		$('#jb-childcategory-container').empty();
		//var category = JSON.parse(flavour_Guides1);
		var category = flavour_Guides1;
		$(category).each(function (index, data) {
			$('#jb-childcategory-container').append(Hypr.getTemplate('pages/flavor-guides-item').render({
				model : data,
				index: index
			}));
		});
		var catCode = require.mozuData('pagecontext').categoryCode;
		$(category).each(function (index, data) {
			if(data.category == catCode){
				$(document).find('#flavor-List').append(Hypr.getTemplate('pages/flavor-guides-item').render({
					model : data,
					index: index
				}));
                // Flover guide navigation from header
                var myFlover = window.location.hash; 
                if(myFlover && myFlover == "#flavor-List"){
                    if($(document).find(myFlover).find('.jb-colapsing-title')){
                        $(document).find(myFlover).find('.jb-colapsing-title').trigger('click');
                    }
                    if($(document).find("#flavor-List")){
                        if($(window).width() <= 767){
                            $('html, body').animate({
                                scrollTop: $(document).find("#flavor-List").offset().top-100
                            }, 1500);
                        }else{
                            $('html, body').animate({
                                scrollTop: $(document).find("#flavor-List").offset().top
                            }, 500);
                        } 
                    }
                }
			}
		});

		/**
		 * Add click handler
		 **/
		$(document).find(".jb-colapsing-title").bind("click", function (e) {
			$(this).parent().find(".jb_contentfolder").slideToggle();
			if ($(this).find(".jb-category-title").attr("aria-expanded") == "false") {
				$(this).find(".jb-category-title").attr("aria-expanded", "true");
				$(this).find(".mz-desktop").attr("aria-expanded", "true");
				var lazyImages = $(document).find('.load-on-scroll');
                lazyImages.filter(function(image,v) {
                    $(v).attr('src',$(v).attr('data-src'));
                });
			} else {
				$(this).find(".jb-category-title").attr("aria-expanded", "false");
				$(this).find(".mz-desktop").attr("aria-expanded", "false");
			}
			if ($(this).find(".mz-mobile").css("display") == "block") {
				var temphtml = $(this).find(".mz-mobile").text();
				if (temphtml == "+") {
					$(this).find(".mz-mobile").text("-");
					$(this).find(".mz-mobile").attr({"title":"collapse, button, expanded", "aria-expanded":"true"});
					var lazyImagesMobile = $(document).find('.load-on-scroll');
                    lazyImagesMobile.filter(function(image,v) {
                        $(v).attr('src',$(v).attr('data-src'));
                    });
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

		/**
		 * 1. Re-arange the order of items if URL has value of 'guide'
		 *      1.1. currentItem = Get the first child.
		 *      1.2. newItem = Get the URL referenced item
		 *      1.3. newItem.insertBefore(currentItem);
		 *      1.4. Open the new Item div.
		 * 2. Else open the default first child item.
		 **/
		var guide = GetURLParameter('guide'); 
		if (guide) {
			var currentFirstItem = $('#jb-childcategory-container').children()[0];
			if ($('[data-mz-category-guide=' + guide + ']').length > 0) {
				$('[data-mz-category-guide=' + guide + ']').insertBefore(currentFirstItem);
				$('[data-mz-category-guide=' + guide + ']').find(".jb_contentfolder").slideToggle();
				$('[data-mz-category-guide=' + guide + ']').find(".mz-mobile").text('-');
				$('[data-mz-category-guide=' + guide + ']').find(".mz-mobile").attr({"title": "collapse, button, expanded", "aria-expanded":"true"});
				$('[data-mz-category-guide=' + guide + ']').attr("aria-expanded", "true");
				$('[data-mz-category-guide=' + guide + ']').find(".jb-category-title").attr("aria-expanded", "true");
				$('[data-mz-category-guide=' + guide + ']').find(".mz-desktop").attr("aria-expanded", "true");


			} else {
				$(currentFirstItem).find(".jb_contentfolder").slideToggle();
			}
		}
		if($(".jb-childcategory")){
			if( $(".jb-childcategory").attr('tabindex') == '-1'){
				$(".jb-childcategory").focus();
			}
		}
		
		setTimeout(function(){
		    // Flover guide navigation from header
            var myFlover = window.location.hash; 
            if(myFlover && myFlover == "#flavor-List" && !$('.jb_contentfolder').is(':visible')){
                if($(document).find(myFlover).find('.jb-colapsing-title')){
                    $(document).find(myFlover).find('.jb-colapsing-title').trigger('click');
                }
                if($(document).find("#flavor-List")){
                    if($(window).width() <= 767){
                        $('html, body').animate({
                            scrollTop: $(document).find("#flavor-List").offset().top-100
                        }, 1500);
                    }else{
                        $('html, body').animate({
                            scrollTop: $(document).find("#flavor-List").offset().top
                        }, 500);
                    } 
                }
            }
		},2000);
	});

	function GetURLParameter(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
		return '';
	}
});



