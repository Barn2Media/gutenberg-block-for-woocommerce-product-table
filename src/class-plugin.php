<?php
/**
 * Instantiates plugin logic, checks requirements, throws warnings.
 * This file is included during the WordPress bootstrap process if the plugin is active.
 *
 * @package   Barn2/woocommerce-product-table/block
 * @author    Barn2 Plugins <info@barn2.co.uk>
 * @license   GPL-3.0
 * @copyright Barn2 Media Ltd
 */

namespace Barn2\Plugin\WC_Product_Table_Block;

/**
 * The main plugin class.
 */
class Plugin {

	/**
	 * Class follows singleton pattern, this private variable stores the Plugin object
	 *
	 * @var $instance object
	 */
	private static $instance = null;

	/**
	 * Class follows singleton pattern, this private variable stores the Plugin object
	 *
	 * @var $instance object
	 */
	public static $assets_uri = null;

	/**
	 * Unique version number of compiled assets which assists with cache busting enqueued assets
	 * 
	 * @var $assets_version string
	 */
	public static $assets_version = null;

	/**
	 * Class constructor, does nothing. Run install
	 */
	public function __construct() {}

	/**
	 * Access the instantiated Plugin object
	 */
	public static function instance() {
		return self::$instance;
	}

	/**
	 * Initalizes an WC Product Table Block plugin instance.
	 */
	public static function init() {

		$self = apply_filters( 'barn2_wc_product_table_block_instance', new Plugin() );

		$self->install();

		self::$instance = $self;

		do_action( 'barn2_wc_product_table_block_init', $self );

		return $self;

	}

	/**
	 * Checks environment requirements and attaches actions for plugin functionality
	 */
	private function install() {

		if ( ! $this->is_plugin_compatible() ) {
			add_action( 'admin_notices', array( $this, 'requirement_notices' ) );
			return;
		}

		self::$assets_uri     = plugins_url( 'assets/', PLUGIN_FILE );
		self::$assets_version = WP_DEBUG ? time() : PLUGIN_VERSION;

		require_once __DIR__ . '/class-block.php';
		require_once __DIR__ . '/class-rest.php';

		do_action( 'barn2_wcptb_installed', $this );

	}

	/**
	 * Runs through all compatibility checks for plugin
	 */
	private function is_plugin_compatible() {
		return $this->is_php_version_safe()
			&& $this->is_wordpress_safe()
			&& $this->is_woocommerce_safe()
			&& $this->is_wpt_safe();
	}

	/**
	 * Checks to ensure the server PHP version is compatible with this plugin
	 */
	public function is_php_version_safe() {
		return version_compare( PHP_VERSION, '7.1.0', '>=' );
	}

	/**
	 * Checks to ensure WordPress is Gutenberg compatible
	 */
	public function is_wordpress_safe() {
		global $wp_version;
		return function_exists( 'register_block_type' ) && version_compare( $wp_version, '5.3.0', '>=' );
	}

	/**
	 * Checks to ensure WooCommerce is active
	 */
	public function is_woocommerce_safe() {
		return class_exists( 'woocommerce' );
	}

	/**
	 * Checks to ensure WooCommerce Product Table plugin is active
	 */
	public function is_wpt_safe() {
		return function_exists( 'Barn2\Plugin\WC_Product_Table\wpt' );
	}

	/**
	 * Outputs warnings to admin screen if plugin initialization failed.
	 */
	public function requirement_notices() {

		$message = '';

		if ( ! $this->is_php_version_safe() ) {
			$messages .= '<li>' . esc_html( __( 'PHP must be running on version 7.1 or above to use this plugin.', 'wpt-block' ) ) . '</li>';
		}

		if ( ! $this->is_wordpress_safe() ) {
			$messages .= '<li>' . esc_html( __( 'This plugin requires WordPress 5.3 or above', 'wpt-block' ) ) . '</li>';
		}

		if ( ! $this->is_woocommerce_safe() ) {
			$messages .= '<li>' . esc_html( __( 'This plugin requires WooCommerce to be active', 'wpt-block' ) ) . '</li>';
		}

		if ( ! $this->is_wpt_safe() ) {
			$messages .= '<li>' . esc_html( __( 'This plugin requires the WooCommerce Product Table plugin to be active', 'wpt-block' ) ) . '</li>';
		}

		if ( empty( $messages ) ) {
			return;
		}

		echo '<div class="notice notice-error">';
		echo '<p>' . esc_html( __( 'The WooCommerce Product Table Block plugin is active but not functioning!', 'wpt-block' ) ) . '</p>';
		echo '<ul>';
		echo $messages;
		echo '</ul></div>';

	}

}

add_action( 'plugins_loaded', array( 'Barn2\Plugin\WC_Product_Table_Block\Plugin', 'init' ) );