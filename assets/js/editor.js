( function( wp, ptbComponents ) {
	"use strict";

	const { __ } = wp.i18n;
	const {
		Fragment,
		createElement,
		RawHTML
	} = wp.element;
	const { InspectorControls } = wp.blockEditor;
	const { Placeholder, Icon } = wp.components;

	const { ProductTableColumns, ProductSelection, SettingsPanel } = ptbComponents;

	const el = createElement;

	const tableIcon = el('svg',
		{
			xmlns: "http://www.w3.org/2000/svg",
			width: 24,
			height: 24,
			viewBox: "0 0 24 24"
		},
		wp.element.createElement( 'path',
			{
				d: "M4,21h15.893c1.103,0,2-0.897,2-2V7V5v0l0,0c0-1.103-0.897-2-2-2H4C2.897,3,2,3.897,2,5v14C2,20.103,2.897,21,4,21z M4,19 v-5h4v5H4z M14,7v5h-4V7H14z M8,7v5H4V7H8z M10,19v-5h4v5H10z M16,19v-5h3.894v5H16z M19.893,12H16V7h3.893V12z"
			}
		)
	);

	wp.blocks.registerBlockType( 'barn2/wc-product-table', {
		title:    'WooCommerce Product Table',
		icon:     tableIcon,
		category: 'woocommerce',
		attributes: {
			columns: {
				type: 'array',
				default: []
			},
			filters: {
				type: 'array',
				default: []
			},
			settings: {
				type: 'array',
				default: []
			}
		},
		supports: {
			customClassName: false,
			className: false,
			html: false,
			align: [ 'wide', 'full' ],
		},

		edit: function ( props ) {

			const { attributes, setAttributes } = props;

			const productPreviewRef = wp.element.createRef();

			let blockStructure;

			if ( typeof wcptbInvalid !== 'undefined' ) {

				let messageSplit = wcptbInvalid.message.split('%s'), message;
				
				if ( messageSplit.length > 1 ) {
					message = [
						messageSplit[0],
						el(
							'a',
							{ href: wcptbInvalid.link },
							wcptbInvalid.link_text
						),
						messageSplit[1]
					];
				} else {
					message = messageSplit[0];
				}
				

				blockStructure = el( 
					Placeholder,
					{ icon: tableIcon, label: 'Product Table', instructions: message }
				);

			} else {

				blockStructure = el(
					Fragment,
					null,
					[
						el(
							InspectorControls,
							null,
							[
								el(
									SettingsPanel,
									{
										onChange: ( newSettings ) => {
											//console.log( newSettings );
											setAttributes( { settings: newSettings } );
										},
										attributes
									}
								),
							]
						),
						el(
							'div',
							{ className: 'components-placeholder barn2-wc-product-table-block' },
							[
								el(
									'div',
									{ className: 'components-placeholder__label' },
									[
										el( Icon, { icon: tableIcon, alt: '' } ),
										__( 'Product Table', 'wpt-block' )
									]
								),
								el(
									'div',
									{ className: 'components-placeholder__fieldset' },
									[
										__( 'Lists products in a table view using the WooCommerce Product Table plugin.', 'wpt-block' ),
										el(
											'div',
											{ className: 'barn2-wc-product-table-block__options' },
											[
												el(
													ProductTableColumns,
													{
														columns: attributes.columns,
														saveColumns: ( newColumns ) => {
															//console.log( changed );
															setAttributes( { columns: newColumns } );
														}
													}
												),
												el(
													ProductSelection,
													{
														attributes,
														saveFilters: ( newFilters ) => {
															//console.log( changed );
															setAttributes( { filters: newFilters } );
														},
														ref: productPreviewRef
													}
												)
											]
										)
									],
									el(
										'p',
										{ className: 'additional-settings-notice' },
										__( "You can configure additional settings in the 'Block' tab in the sidebar.", 'wpt-block' )
									)
								)
							]
						)
					]
				);

			}

			

			return blockStructure;
		},

		save: function( props ) {

			let attrs = '';

			const { attributes } = props;

			if ( attributes ) {

				if ( attributes.columns && attributes.columns.length ) {
					attrs += ' columns="' + attributes.columns.join( ',' ) + '"';
				}

				if ( attributes.filters && attributes.filters.length ) {
					for ( let filter of attributes.filters ) {
						attrs += ` ${filter.key}="${filter.value}"`;
					}
				}

				if ( attributes.settings && attributes.settings.length ) {
					for ( let setting of attributes.settings ) {
						if ( setting.value === '' ) {
							continue;
						}
						if ( setting.key === 'additional' ) {
							attrs = `${setting.value} ` + attrs;
						} else if ( setting.key !== 'customFilters' ) {
							if ( setting.key === 'filters' && setting.value === 'custom' ) {
								continue;
							}
							attrs += ` ${setting.key}="${setting.value}"`;
						} else {
							attrs += ` filters="${setting.value}"`;
						}
					}
				}

				attrs = attrs.trim();
				if ( attrs.length ) {
					attrs = ' ' + attrs;
				}

			}

			return el(
				RawHTML,
				{},
				`[product_table${attrs}]`
			);

		}
	} );

} )( window.wp, window.productTableBlockComponents );