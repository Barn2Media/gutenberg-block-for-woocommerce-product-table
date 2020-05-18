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
	 * Default labels for column slugs
	 *
	 * @var $instance array
	 */
	private static $column_defaults = null;

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

		add_action( 'init', array( $self, 'install' ), 20 );

		do_action( 'barn2_wcptb_block_init', $self );

		return $self;

	}

	/**
	 * Registers block with Gutenberg store and registers appropriate editor styles and scripts
	 */
	public function install() {

		wp_register_style(
			'barn2-wc-product-table-block',
			Plugin::$assets_uri . 'css/editor.min.css',
			array(),
			Plugin::$assets_version
		);

		wp_register_script(
			'barn2-wc-product-table-columns-common',
			Plugin::$assets_uri . 'js/common.min.js',
			array( 'jquery-ui-sortable', 'wp-element', 'wp-i18n', 'wp-components', 'wp-compose' ),
			Plugin::$assets_version,
			true
		);

		wp_register_script(
			'barn2-wc-product-table-columns',
			Plugin::$assets_uri . 'js/table-columns.min.js',
			array( 'barn2-wc-product-table-columns-common', 'jquery-ui-sortable', 'wp-element', 'wp-i18n', 'wp-components', 'wp-compose' ),
			Plugin::$assets_version,
			true
		);

		wp_register_script(
			'barn2-wc-product-table-query',
			Plugin::$assets_uri . 'js/product-selection.min.js',
			array( 'barn2-wc-product-table-columns-common', 'jquery-ui-sortable', 'wp-element', 'wp-i18n', 'wp-components', 'wp-compose', 'wp-api-fetch' ),
			Plugin::$assets_version,
			true
		);

		wp_register_script(
			'barn2-wc-product-table-settings',
			Plugin::$assets_uri . 'js/settings-panel.min.js',
			array( 'barn2-wc-product-table-columns-common', 'wp-element', 'wp-i18n', 'wp-components', 'wp-compose' ),
			Plugin::$assets_version,
			true
		);

		wp_register_script(
			'barn2-wc-product-table-block',
			Plugin::$assets_uri . 'js/editor.min.js',
			array( 'barn2-wc-product-table-columns-common', 'barn2-wc-product-table-columns', 'barn2-wc-product-table-query', 'barn2-wc-product-table-settings', 'wc-blocks', 'wp-blocks', 'wp-editor', 'wp-components', 'wp-element', 'wp-i18n' ),
			Plugin::$assets_version,
			true
		);

		if ( ! Plugin::is_wpt_safe() ) {

			wp_localize_script(
				'barn2-wc-product-table-block',
				'wcptbInvalid',
				[
					// translators: %s is the plugin name
					'message' => __( 'Warning! This block is an add-on for the %s plugin, which is not currently installed. Please install the plugin before continuing.', 'wpt-block' ),
					'link_text' => __( 'WooCommerce Product Table', 'wpt-block' ),
					'link' => 'https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/?utm_source=plugin&utm_medium=wptblock&utm_campaign=wptaddblock&utm_content=wptblockdashboard'
				]
			);

		} elseif ( ! Plugin::is_woocommerce_safe() ) {

			wp_localize_script(
				'barn2-wc-product-table-block',
				'wcptbInvalid',
				[
					'no_woo' => true,
					'message' => __( 'Warning! This block requires WooCommerce to function.', 'wpt-block' ),
					'link_text' => __( 'WooCommerce Product Table', 'wpt-block' ),
					'link' => 'https://barn2.co.uk/wordpress-plugins/woocommerce-product-table/?utm_source=plugin&utm_medium=wptblock&utm_campaign=wptaddblock&utm_content=wptblockdashboard'
				]
			);

		} else {

			$defaults = \WCPT_Settings::get_setting_table_defaults();
			if ( empty( $defaults['columns'] ) ) {
				$defaults['columns'] = \WC_Product_Table_Args::$default_args['columns'];
			}
			if ( ! empty( $defaults['columns'] ) ) {
				$defaults['columns'] = explode( ',', $defaults['columns'] );
				foreach ( $defaults['columns'] as &$column ) {
					$column = trim( $column );
				}
			}

			wp_localize_script(
				'barn2-wc-product-table-columns',
				'wcptbSettings',
				[
					'columnLabels'  => self::column_defaults(),
					'defaultValues' => $defaults,
				]
			);

			wp_localize_script(
				'barn2-wc-product-table-query',
				'wcptbNonce',
				wp_create_nonce( 'wp_rest' )
			);

			wp_localize_script(
				'barn2-wc-product-table-query',
				'wcptbCatalog',
				[
					'categoryTerms' => self::get_product_category_terms(),
					'tagTerms'      => self::get_tag_terms(),
					'attributes'    => self::get_product_attributes(),
				]
			);

		}

		wp_localize_script(
			'barn2-wc-product-table-block',
			'wcptbPreviewImage',
			plugins_url( 'assets/images/block-preview.jpg', __DIR__ )
		);

		register_block_type(
			'barn2/wc-product-table',
			array(
				'editor_style'  => 'barn2-wc-product-table-block',
				'editor_script' => 'barn2-wc-product-table-block',
			)
		);

	}

	/**
	 * Get the default column headings and responsive priorities.
	 * (Copied from Barn2/woocommerce-product-table:class-wc-product-table-columns.php)
	 *
	 * @return array The column defaults
	 */
	private static function column_defaults() {

		if ( ! self::$column_defaults ) {

			self::$column_defaults = apply_filters(
				'wc_product_table_column_defaults',
				array(
					'sku'               => array( 'heading' => __( 'SKU', 'wpt-block' ), 'priority' => 6 ),
					'id'                => array( 'heading' => __( 'ID', 'wpt-block' ), 'priority' => 8 ),
					'name'              => array( 'heading' => __( 'Name', 'wpt-block' ), 'priority' => 1 ),
					'description'       => array( 'heading' => __( 'Description', 'wpt-block' ), 'priority' => 12 ),
					'short-description' => array( 'heading' => __( 'Short Description', 'wpt-block' ), 'priority' => 11 ),
					'date'              => array( 'heading' => __( 'Date', 'wpt-block' ), 'priority' => 14 ),
					'categories'        => array( 'heading' => __( 'Categories', 'wpt-block' ), 'priority' => 9 ),
					'tags'              => array( 'heading' => __( 'Tags', 'wpt-block' ), 'priority' => 10 ),
					'image'             => array( 'heading' => __( 'Image', 'wpt-block' ), 'priority' => 4 ),
					'reviews'           => array( 'heading' => __( 'Reviews', 'wpt-block' ), 'priority' => 13 ),
					'stock'             => array( 'heading' => __( 'Stock', 'wpt-block' ), 'priority' => 7 ),
					'weight'            => array( 'heading' => __( 'Weight', 'wpt-block' ), 'priority' => 15 ),
					'dimensions'        => array( 'heading' => __( 'Dimensions', 'wpt-block' ), 'priority' => 16 ),
					'price'             => array( 'heading' => __( 'Price', 'wpt-block' ), 'priority' => 3 ),
					'add-to-cart'       => array( 'heading' => __( 'Add to Cart', 'wpt-block' ), 'priority' => 2 ),
					'button'            => array( 'heading' => __( 'Button', 'wpt-block' ), 'priority' => 5 ),
					'att'               => array( 
						'heading' => __( 'Product Attribute', 'wpt-block' ), 
						'values'  => wc_get_attribute_taxonomies(),
					),
					'cf'                => array( 'heading' => __( 'Custom Field Value', 'wpt-block' ), 'placeholder' => __( 'Enter a customer meta key', 'wpt-block' ) ),
					'tax'               => array( 'heading' => __( 'Custom Taxonomy', 'wpt-block' ), 'placeholder' => __( 'Enter a taxonomy name', 'wpt-block' )  )
				)
			);
		}

		return self::$column_defaults;
	}

	/**
	 * Get product categories which are used for creating product selection queries
	 *
	 * @return array A list of product categories
	 */
	private static function get_product_category_terms() {

		$product_categories = get_terms( 'product_cat', [ 'hide_empty' => false ] );

		$return = [];
		foreach ( $product_categories as $cat ) {
			$return[ $cat->slug ] = [ 'label' => $cat->name ];
		}

		return $return;
	}

	/**
	 * Get product tags which are used for creating product selection queries
	 *
	 * @return array A list of product categories
	 */
	private static function get_tag_terms() {

		$tags = get_terms( 'product_tag', [ 'hide_empty' => false ] );

		$return = [];
		foreach ( $tags as $tag ) {
			$return[ $tag->slug ] = [ 'label' => $tag->name ];
		}

		return $return;

	}

	/**
	 * Get product tags which are used for creating product selection queries
	 *
	 * @return array A list of product categories
	 */
	private static function get_product_attributes() {

		$taxonomies = wc_get_attribute_taxonomies();

		$return = [];

		foreach ( $taxonomies as $tax ) {
			$terms = get_terms( 'pa_' . $tax->attribute_name, [ 'hide_empty' => false ] );
			$return[ 'pa_' . $tax->attribute_name ] = [
				'label' => $tax->attribute_label,
				'terms' => [],
			];
			foreach ( $terms as $term ) {
				$return[ 'pa_' . $tax->attribute_name ][ 'terms' ][ $term->slug ] = $term->name;
			}
		}

		$return['product_visibility'] = [
			'label' => 'Visibility',
			'terms' => [
				'featured'   => 'Featured',
				'outofstock' => 'Out of Stock',
			],
		];

		return $return;
	}
}

add_action( 'barn2_wcptb_installed', array( 'Barn2\Plugin\WC_Product_Table_Block\Block', 'init' ) );
