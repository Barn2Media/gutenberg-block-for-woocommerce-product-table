<?php
/**
 * The WC Product Table Block Interface.
 *
 * This file is included during the WordPress bootstrap process if the plugin is active.
 *
 * @package   Barn2/woocommerce-product-table/block
 * @author    Barn2 Plugins <info@barn2.co.uk>
 * @license   GPL-3.0
 * @copyright Barn2 Media Ltd
 *
 * @wordpress-plugin
 * Plugin Name:     Gutenberg Block for WooCommerce Product Table
 * Plugin URI:      https://barn2.co.uk/wordpress-plugins/block-for-woo-product-table/
 * Description:     Adds an editor block to the WooCommerce Product Table plugin by Barn2, making it quick and easy to create product tables with the block editor.
 * Version:         1.0.8
 * Author:          Barn2 Plugins
 * Author URI:      https://barn2.co.uk
 * Text Domain:     block-for-woo-product-table
 * Domain Path:     /languages
 *
 * WC requires at least: 3.7
 * WC tested up to: 7.4.1
 *
 * Copyright:       Barn2 Media Ltd
 * License:         GNU General Public License v3.0
 * License URI:     http://www.gnu.org/licenses/gpl-3.0.html
 */

namespace Barn2\Plugin\WC_Product_Table_Block;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PLUGIN_VERSION = '1.0.8';
const PLUGIN_FILE    = __FILE__;

add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );

require_once __DIR__ . '/src/class-plugin.php';
