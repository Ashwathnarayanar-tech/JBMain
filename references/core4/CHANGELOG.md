Core4 Changelog
===============

v4.5.1
------
* Brought over updates from 1.17

v4.4.0
------
* Brought over multiple changes from Mozu release 1.16.25

v4.3.0
------
* Fixed bugs in `templates/modules/common/order-summary.hypr.live`.

v4.2.1
------
* Put back the CHANGELOG.md and the bower.json file, which caused build problems when removed.

v4.2.0
------
* Release notes in the [Developer Center](http://developer.mozu.com).

v4.0.7
------
* Fixed an issue where the back-button-cache in Firefox would preserve a product page in a loading state.
* Fixed an issue with the path to the error icon. in `stylesheets/variables.less`.
* Replaced `discountedTotal` with `discountedSubtotal` in `templates/modules/common/order-summary.hypr.live` to accurately reflect order totals.
* Added the updated, simplified `scripts/modules/api.js` wrapper around the Storefront SDK.
* Added new required low-level editor config to `theme.json` for reference purposes.
* Added the default admin editors to Core4 for reference purposes.

v4.0.6
------
* Fixed an issue in `scripts/modules/models-checkout.js` that prevented the "Enter New Address" option from working when the customer had saved addresses.
* Fixed an issue in `templates/modules/my-account/my-account-addressbook.hypr.live` that prevented some of the "Add new" links from working properly.
* Fixed an issue in `scripts/modules/models-customer.js` that prevented a customer from saving an address when address validation was enabled on the site.
* Fixed a rendering issue and added optimistic UI re-rendering in `scripts/pages/myaccount.js`.
