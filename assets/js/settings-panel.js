( function ( wp, nonce, data ) {
	"use strict";

	const { __ } = wp.i18n;
	const { createElement } = wp.element;
	const { Button, SelectControl, TextControl, TextareaControl, PanelBody } = wp.components;

	const { withState } = wp.compose;

	const el = createElement;

	if ( ! window.productTableBlockComponents ) {
		window.productTableBlockComponents = {};
	}

	window.productTableBlockComponents.SettingsPanel = withState( {

		modalOpened: false

	} )( ( { modalOpened, onChange, attributes, setState } ) => {

		let tableSettingsModalRef = wp.element.createRef();

		let settings = {};
		for ( let setting of attributes.settings ) {
			settings[setting.key] = setting.value;
		}

		let changeSetting = ( key, value ) => {
			settings[key] = value;
			let newSettings = [];
			for ( let key in settings ) {
				newSettings.push( { key, value: settings[key] } );
			}
			onChange( newSettings );
		};

		return [
			el(
				PanelBody,
				{ title: __( 'Add to Cart Column Settings', 'wpt-block' ) },
				[
					el(
						SelectControl,
						{
							label: __( 'Add to Cart Button', 'wpt-block' ),
							value: settings.cart_button,
							options: [
								{ value: '', label: __( '(Use global option)', 'wpt-block' ) },
								{ value: 'button', label: __( 'Button', 'wpt-block' ) },
								{ value: 'checkbox', label: __( 'Checkbox', 'wpt-block' ) },
								{ value: 'button_checkbox', label: __( 'Button and Checkbox', 'wpt-block' ) },
							],
							onChange: ( value ) => {
								changeSetting( 'cart_button', value );
							},
							help: [
								__( "How 'Add to Cart' buttons are displayed in the table. ", 'wpt-block' ),
								el(
									'a',
									{ href: 'https://barn2.co.uk/kb/add-to-cart-buttons', target: '_blank' },
									__( 'Read More', 'wpt-block' )
								)
							]
						}
					),
					el(
						SelectControl,
						{
							label: __( 'Quantities', 'wpt-block' ),
							value: settings.show_quantity,
							options: [
								{ value: '', label: __( '(Use global option)', 'wpt-block' ) },
								{ value: 'true', label: __( 'Show in add to cart column', 'wpt-block' ) },
								{ value: 'false', label: __( 'Do not show quantity selectors', 'wpt-block' ) },
							],
							onChange: ( value ) => {
								changeSetting( 'show_quantity', value );
							}
						},
					),
					el(
						SelectControl,
						{
							label: __( 'Variations', 'wpt-block' ),
							value: settings.variations,
							options: [
								{ value: '', label: __( '(Use global option)', 'wpt-block' ) },
								{ value: 'false', label: __( 'Link to product page', 'wpt-block' ) },
								{ value: 'dropdown', label: __( 'Dropdowns in add to cart column', 'wpt-block' ) },
								{ value: 'separate', label: __( 'Separate rows in table', 'wpt-block' ) },
							],
							onChange: ( value ) => {
								changeSetting( 'variations', value );
							},
							help: [
								__( 'How to display options for variable products. ', 'wpt-block' ),
								el(
									'a',
									{ href: 'https://barn2.co.uk/kb/product-variations', target: '_blank' },
									__( 'Read More', 'wpt-block' )
								)
							]
						}
					)
				]
			),
			el(
				PanelBody,
				{ title: __( 'Table Controls', 'wpt-block' ) },
				[
					el(
						SelectControl,
						{
							label: __( 'Product Filters', 'wpt-block' ),
							value: settings.filters,
							options: [
								{ value: '', label: __( '(Use global option)', 'wpt-block' ) },
								{ value: 'false', label: __( 'Disabled', 'wpt-block' ) },
								{ value: 'true', label: __( 'Show based on columns in table', 'wpt-block' ) },
								{ value: 'custom', label: __( 'Custom', 'wpt-block' ) },
							],
							onChange: ( value ) => {
								if ( value !== 'custom' ) {
									changeSetting( 'customFilters', '' );
								}
								changeSetting( 'filters', value );
							},
							help: [
								__( 'Dropdown lists to filter the table by category, tag, attribute, or custom taxonomy. ', 'wpt-block' ),
								el(
									'a',
									{ href: 'https://barn2.co.uk/kb/wpt-filters/#filter-dropdowns', target: '_blank' },
									__( 'Read More', 'wpt-block' )
								)
							]
						}
					),
					el(
						'div',
						{
							className: 'barn2-wc-product-table-block__custom-filter-option',
							'aria-hidden': settings.filters && settings.filters === 'custom' ? 'false' : 'true'
						},
						[
							el(
								TextControl,
								{
									label: __( 'Custom Product Filters', 'wpt-block' ),
									value: settings.customFilters,
									onChange: ( value ) => {
										changeSetting( 'customFilters', value );
									}
								}
							)
						]
					),
				]
			),
			el(
				PanelBody,
				{ title: __( 'Additional Options', 'wpt-block' ), initialOpen: false },
				[
					el(
						'p',
						{},
						[
							__( 'You can configure additional options globally on the  ', 'wpt-block' ),
							el( 
								'a',
								{ href: '/wp-admin/admin.php?page=wc-settings&tab=products&section=product-table', target: '_blank' },
								__( 'WooCommerce Product Table settings page', 'wpt-block' )
							),
							__( ', or by adding them below with one option per line (e.g. sort_by="name").', 'wpt-block' ),
							el( 
								'a',
								{ href: 'https://barn2.co.uk/kb/product-table-options/%5D%22', target: '_blank' },
								__( 'See full list of options.', 'wpt-block' )
							)
						]
					),
					el(
						TextareaControl,
						{
							label: __( 'Additional Shortcode Attributes', 'wpt-block' ),
							value: settings.additional,
							onChange: ( value ) => {
								changeSetting( 'additional', value );
							}
						}
					)
				]
			)
		];

	} );

} )( window.wp );