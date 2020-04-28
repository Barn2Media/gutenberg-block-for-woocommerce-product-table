<?php
/**
 * Initializes the Gutenberg Block and applies render filters (if necessary)
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
class Block {

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

		$self = apply_filters( 'barn2_wcptb_block_instance', new Block() );
		
		self::$instance = $self;

		add_action( 'init', array( $self, 'install' ) );

		do_action( 'barn2_wcptb_block_init', $self );

		return $self;

	}

	/**
	 * Registers block with Gutenberg store and registers appropriate editor styles and scripts
	 */
	public function install() {
		
		wp_register_style(
			"barn2-wc-product-table-block",
			Plugin::$assets_uri . "css/editor.min.css",
			array(),
			Plugin::$assets_version
		);

		wp_register_script(
			"barn2-wc-product-table-block",
			Plugin::$assets_uri . "js/editor.min.js",
			array(),
			Plugin::$assets_version
		);

		register_block_type(
			"barn2/wc-product-table",
			array(
				"editor_style"  => "barn2-wc-product-table-block",
				"editor_script" => "barn2-wc-product-table-block",
			)
		);

	}

}

add_action( 'barn2_wcptb_installed', array( 'Barn2\Plugin\WC_Product_Table_Block\Block', 'init' ) );