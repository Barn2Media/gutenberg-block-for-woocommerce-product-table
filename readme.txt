=== Gutenberg Block for WooCommerce Product Table ===
Plugin Name: Gutenberg Block for WooCommerce Product Table
Contributors: barn2media
Donate link: https://barn2.co.uk
Tags: gutenberg block, blocks, block, product table, order form
Requires at least: 6.1
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.11
License: GPL-3.0
License URI: https://www.gnu.org/licenses/gpl.html

A WordPress editor block which implements the options found in the WooCommerce Product Table shortcode

== Description ==

*Note: Since building this block plugin, we have added an interactive table builder to the main WooCommerce Product Table plugin. This makes it easy to create product tables and insert them into the block editor or any page builder. While you can still use the block plugin, it is no longer actively being developed and we recommend using the built-in table builder instead, which has more features.*

Gutenberg Block for WooCommerce Product Table adds a user-friendly editor block to the [WooCommerce Product Table](https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt) plugin by Barn2, providing an easier way for Gutenberg users to create product tables. It requires WooCommerce Product Table (available separately) to work.

WooCommerce Product Table lists products in a quick order form layout designed to increase your sales and average order value. Instead of having to visit a separate page for each product, customers can select products, quantities and variations from the product table and quickly add them to the cart.

WooCommerce Product Table is highly flexible and you can choose which products to include, a wide range of column options, filters, instant AJAX search, add to cart button styles, and more.

*Gutenberg Block for WooCommerce Product Table* makes it easy to insert product tables anywhere on your site using the Gutenberg editor. This gives you full control over your product tables.

https://www.youtube.com/watch?v=yEsK8KEi0mk

= BLOCK OPTIONS =

You can use the WooCommerce Product Table editor block to add as many product tables as you like. You can even add multiple tables to the same page.

By default, each product table will inherit the global options from the WooCommerce Product Table plugin settings page. You can override the following options for each individual block:

* **Select your product table columns:**
  * Choose from SKU, ID, product name, description, short description, date published, categories, tags, reviews/star rating, stock, weight, dimensions, price, add to cart, button, attribute, custom field, and custom taxonomy
  * Change the order of columns
  * Rename columns

* **Select which products to include in the table:**
  * List all products, or select specific products based on category, tag, custom field, custom taxonomy, attribute, year, month, day, status, ID, or list previously ordered products by the current user.
  * Exclude specific products or categories.
* **Add to cart column settings:**
  * Add to cart button - choose from button, checkbox, or both.
  * Quantity picker.
  * Variations - display as dropdowns, list each variation on its own row of the table, or link to the single product page.

* **Product filters** - Add filter dropdowns above the table so that customers can refine the list by category, tag, attribute, or custom taxonomy.
* **Additional options** - You can also use any of the other 50+ options that are available in the WooCommerce Product Table plugin.

= HOW TO USE THE BLOCK =

1. First make sure [WooCommerce](https://wordpress.org/plugins/woocommerce/), **Gutenberg Block for WooCommerce Product Table** and [WooCommerce Product Table](https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt) are all installed.
2. Next, go to any page or post that uses the Block (Gutenberg) editor and click the + icon to add a new block.
3. Navigate to the ‘WooCommerce’ section and find the block called ‘WooCommerce Product Table’, or type ‘WooCommerce Product Table’ into the search box. This will insert the WooCommerce Product Table block into the editor.
4. By default, the block will list all your products and will inherit the global options from the [WooCommerce Product Table plugin settings page.](https://barn2.co.uk/kb/product-table-settings-page/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt) You can override these by setting options directly in the Gutenberg block:
  * **Table Columns** - Use the ‘Add column’ dropdown to select which columns to include in the WooCommerce Product Table. You can re-order columns using drag and drop, and rename columns by clicking the pencil icon. [Read more about the product table columns.](https://barn2.co.uk/kb/product-table-columns/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt)
  * **Products** - Use the ‘Select products’ dropdown to list specific products in the table. For example, you can select products by ID, category, tag, attribute, custom field value, custom taxonomy term, date, status, and more. There are also options to exclude products from the table based on category or ID. [Read more about listing specific products.](https://barn2.co.uk/kb/wpt-include-exclude/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt)
  * You will find additional block settings in the ‘Block’ tab of the Editor sidebar. Use these to configure the add to cart column of the table; add filter dropdowns above the table; and to use any of the [additional options](https://barn2.co.uk/kb/product-table-options/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt) available in WooCommerce Product Table.
5. Finally, update or Preview the page to view the product table on the front end of your website.
6. Repeat steps 2-5 to add more product tables.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/block-for-woocommerce-product-table` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Add your block to any page

== Frequently Asked Questions ==

= Can I add more than one product table? =
Yes, you can create as many product tables as you like. Simply add the ‘WooCommerce Product Table’ block wherever you wish to insert a table. You can add multiple tables to the same page.

Tip: If you are adding several product tables to the same page then we recommend enabling the lazy load option on the [WooCommerce Product Table plugin settings page](https://barn2.co.uk/kb/product-table-settings-page/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt). This will prevent any performance problems from listing large numbers of products on one page.

= What if I don’t have WooCommerce Product Table? =
*Gutenberg Block for WooCommerce Product Table* is an add-on for [WooCommerce Product Table](https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt) and is not designed to be used separately. It only works with the premium WooCommerce Product Table plugin by Barn2, and not other plugins with similar names. [Sign up for a free trial](https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/#pricing).

= Can I create product tables if I’m not using Gutenberg? =
Yes, [WooCommerce Product Table](https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/?utm_source=wporg&utm_medium=freeplugin&utm_campaign=gutenbergwpt&utm_content=gutenbergwpt) comes with a built-in table builder which works with all WordPress editors and page builders. Simply install WooCommerce Product Table and go to *Products > Product Tables > Add New* to create tables. The final page of the table builder provides a shortcode which you can use to insert the table anywhere on your site. You can also enable tables automatically on your main shop page templates, without having to use a block or shortcode.

== Screenshots ==

1. Adds a Gutenberg block for WooCommerce Product Table, allowing you to insert product tables anywhere!
2. Configure your product table settings directly in the Gutenberg block.
3. When used together with the WooCommerce Product Table plugin, the Gutenberg block displays a fully functional order form.

== Changelog ==

= 1.0.11 =
* Tested with the latest version of WordPress and WooCommerce
* Added the integration with PHP 8.3
* Integrated with the latest version of WooCommerce Product Table

<!-- more -->

= 1.0.10 =
* Updated the Screenshots
* Tested up to WordPress 6.5.2 and WooCommerce 8.8.2

= 1.0.9 =
* Declare HPOS compatibility 
* Tested up to WordPress 6.2.2 and WooCommerce 7.8.2

= 1.0.8 = 
* Compatibility update with WC 7.4.1 

= 1.0.7 =
* Compatibility update with WP 6.1.1 and WC 7.1.0

= 1.0.6 =
* Compatibility update with WP 6.0 and WC 6.5
* Improved options of column select box

= 1.0.5 =
* Compatibility update
* Fixed incorrect use of `$l10n` in `WP_Scripts::locate()`

= 1.0.4 =
* Replaced edit button on table columns with WP 5.6 compatible version
* Updated calls to WooCommerce Product Table classes and functions to use version 2.8 namespaces and classes
* Added compatibility layer to retain functionality with older versions of WPT

= 1.0.3 =
* Changed language of plugin warnings to alert user of free trial when WPT plugin is not installed

= 1.0.2 =
* Fixed issue with REST API permission notice

= 1.0.1 =
* No functional changes, updated repository tags

= 1.0 =
* Initial release

== Upgrade Notice ==

= 1.0 =
This is the initial release version
