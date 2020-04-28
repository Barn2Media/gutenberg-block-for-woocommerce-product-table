<?php
/**
 * Setups REST interface for interacting with WC Product Table shortcode functionality
 *
 * @package   Barn2/woocommerce-product-table/block
 * @author    Barn2 Plugins <info@barn2.co.uk>
 * @license   GPL-3.0
 * @copyright Barn2 Media Ltd
 */

namespace Barn2\Plugin\WC_Product_Table_Block;

/**
 * The Gutenberg block class.
 */
class Rest {

	/**
	 * Class follows singleton pattern, this private variable stores the Plugin object
	 *
	 * @var $instance object
	 */
	private static $instance = null;

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

		$self = apply_filters( 'barn2_wcptb_rest_instance', new Rest() );

		$self->install();

		self::$instance = $self;

		do_action( 'barn2_wcptb_rest_init', $self );

		return $self;

	}

	/**
	 * Registers rest route with WP Rest
	 */
	public function install() {

	}

}

add_action( 'barn2_wcptb_installed', array( 'Barn2\Plugin\WC_Product_Table_Block\Rest', 'init' ) );