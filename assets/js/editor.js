( function( wp, ptbComponents, nonce ) {
	"use strict";

	const { __ } = wp.i18n;
	const {
		Fragment,
		createElement,
		RawHTML
	} = wp.element;
	const { InspectorControls } = wp.blockEditor;
	const { PanelBody } = wp.components;

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
			html: false,
			align: [ 'wide', 'full' ],
		},

		edit: function ( props ) {

			const { attributes, setAttributes } = props;

			const productPreviewRef = wp.element.createRef();

			let settings = attributes.custom;

			const blockStructure = el(
				Fragment,
				null,
				[
					el(
						InspectorControls,
						null,
						[
							el(
								PanelBody,
								{
									title: __( 'Custom Parameters', 'wpt-block' ),
								},
								[]
							),
						]
					),
					el(
						'div',
						{
							className: 'barn2-wc-product-table-block',
						},
						[
							//el( 'h2', {}, 'Barn2 WooCommerce Product Table Block' ),
							el(
								ProductTableColumns,
								{
									columns: attributes.columns,
									onChange: ( newColumns ) => {
										//console.log( changed );
										setAttributes( { columns: newColumns } );
									}
								}
							),
							el(
								ProductSelection,
								{
									columns: attributes.columns,
									onChange: ( newFilters ) => {
										//console.log( changed );
										setAttributes( { filters: newFilters } );
									},
									attributes: attributes,
									ref: productPreviewRef
								}
							),
							el(
								SettingsPanel,
								{
									onChange: ( newSettings ) => {
										//console.log( newSettings );
										setAttributes( { settings: newSettings } );
									},
									attributes
								}
							)
						]
					)
				]
			);

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
						if ( setting.key !== 'customFilters' ) {
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

} )( window.wp, window.productTableBlockComponents, wcptbNonce );