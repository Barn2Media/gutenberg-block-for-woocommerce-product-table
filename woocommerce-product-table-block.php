<?php
/**
 * The WooCommerce Product Table Gutenberg Interface.
 *
 * This file is included during the WordPress bootstrap process if the plugin is active.
 *
 * @package   Barn2/woocommerce-product-table/block
 * @author    Barn2 Plugins <info@barn2.co.uk>
 * @license   GPL-3.0
 * @copyright Barn2 Media Ltd
 *
 * @wordpress-plugin
 * Plugin Name:     WooCommerce Product Table Block
 * Plugin URI:      https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/
 * Description:     Integrate the WooCommerce Product Table plugin from a WordPress Editor block interface.
 * Version:         1.0
 * Author:          Barn2 Plugins
 * Author URI:      https://barn2.co.uk
 * Text Domain:     wpt-block
 * Domain Path:     /languages
 *
 * WC requires at least: 3.4
 * WC tested up to: 4.0.1
 *
 * Copyright:       Barn2 Media Ltd
 * License:         GNU General Public License v3.0
 * License URI:     http://www.gnu.org/licenses/gpl-3.0.html
 */

namespace Barn2\Plugin\WC_Product_Table_Block;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PLUGIN_VERSION = '1.0';
const PLUGIN_FILE    = __FILE__;

require_once __DIR__ . '/src/class-plugin.php';
