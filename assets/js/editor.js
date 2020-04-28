( function( wp ) {

	const { __ }                         = wp.i18n;
	const { Fragment, createElement }    = wp.element;
	const { InspectorControls }          = wp.blockEditor;
	const { Placeholder }                = wp.components;
	
	wp.blocks.registerBlockType( 'barn2/wc-product-table', {
		title:    'Markdown Editor',
		icon:     'edit',
		category: 'formatting',
		attributes: {},
		supports: {
			html: false,
			align: [ 'wide', 'full' ],
		},

		edit: function ( props ) {

			const { attributes, setAttributes } = props;

			const blockStructure = createElement(
				Fragment,
				null,
				[
					/*createElement(
						InspectorControls,
						null,
						[
							createElement(
								PanelBody,
								{
									'title': __( '', 'soulsites-markdown' ),
								},
								[]
							),
						]
					),*/
					createElement(
						Placeholder,
						{
							label: 'This is block'
						}
					)
				]
			);

			return blockStructure;
		},

		save: function( props ) {

			return null;

		}
	} );

}( window.wp ) );
