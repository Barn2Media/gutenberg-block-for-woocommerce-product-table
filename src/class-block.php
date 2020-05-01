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
			'draggable-sortable',
			Plugin::$assets_uri . 'js/sortable.min.js',
			array(),
			'1.0.0-beta.8',
		);

		wp_register_script(
			'barn2-wc-product-table-columns',
			Plugin::$assets_uri . 'js/table-columns.min.js',
			array( 'jquery-ui-sortable', 'wp-element', 'wp-i18n', 'wp-components', 'wp-compose' ),
			Plugin::$assets_version,
			true
		);

		wp_register_script(
			'barn2-wc-product-table-query',
			Plugin::$assets_uri . 'js/product-selection.min.js',
			array( 'wp-element', 'wp-i18n', 'wp-components', 'wp-compose', 'wp-api-fetch' ),
			Plugin::$assets_version,
			true
		);

		wp_register_script(
			'barn2-wc-product-table-settings',
			Plugin::$assets_uri . 'js/settings-panel.min.js',
			array( 'wp-element', 'wp-i18n', 'wp-components', 'wp-compose' ),
			Plugin::$assets_version,
			true
		);

		wp_register_script(
			'barn2-wc-product-table-block',
			Plugin::$assets_uri . 'js/editor.min.js',
			array( 'barn2-wc-product-table-columns', 'barn2-wc-product-table-query', 'barn2-wc-product-table-settings', 'wc-blocks', 'wp-blocks', 'wp-editor', 'wp-components', 'wp-element', 'wp-i18n' ),
			Plugin::$assets_version,
			true
		);

		$defaults = \WCPT_Settings::get_setting_table_defaults();
		if ( empty( $defaults['columns'] ) ) {
			$defaults['columns'] = explode( ',', \WC_Product_Table_Args::$default_args['columns'] );
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
					'id'                => array( 'heading' => __( 'ID', 'woocommerce-product-table' ), 'priority' => 8 ),
					'sku'               => array( 'heading' => __( 'SKU', 'woocommerce-product-table' ), 'priority' => 6 ),
					'name'              => array( 'heading' => __( 'Name', 'woocommerce-product-table' ), 'priority' => 1 ),
					'description'       => array( 'heading' => __( 'Description', 'woocommerce-product-table' ), 'priority' => 12 ),
					'short-description' => array( 'heading' => __( 'Summary', 'woocommerce-product-table' ), 'priority' => 11 ),
					'date'              => array( 'heading' => __( 'Date', 'woocommerce-product-table' ), 'priority' => 14 ),
					'categories'        => array( 'heading' => __( 'Categories', 'woocommerce-product-table' ), 'priority' => 9 ),
					'tags'              => array( 'heading' => __( 'Tags', 'woocommerce-product-table' ), 'priority' => 10 ),
					'image'             => array( 'heading' => __( 'Image', 'woocommerce-product-table' ), 'priority' => 4 ),
					'stock'             => array( 'heading' => __( 'Stock', 'woocommerce-product-table' ), 'priority' => 7 ),
					'reviews'           => array( 'heading' => __( 'Reviews', 'woocommerce-product-table' ), 'priority' => 13 ),
					'weight'            => array( 'heading' => __( 'Weight', 'woocommerce-product-table' ), 'priority' => 15 ),
					'dimensions'        => array( 'heading' => __( 'Dimensions', 'woocommerce-product-table' ), 'priority' => 16 ),
					'price'             => array( 'heading' => __( 'Price', 'woocommerce-product-table' ), 'priority' => 3 ),
					'add-to-cart'       => array( 'heading' => __( 'Buy', 'woocommerce-product-table' ), 'priority' => 2 ),
					'button'            => array( 'heading' => __( 'Details', 'woocommerce-product-table' ), 'priority' => 5 ),
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
