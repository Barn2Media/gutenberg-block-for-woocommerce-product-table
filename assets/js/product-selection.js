( function ( wp, nonce, data ) {
	"use strict";

	const { __ } = wp.i18n;
	const { createElement } = wp.element;
	const { Button, Icon, IconButton, ToggleControl } = wp.components;

	const { withState } = wp.compose;

	const el = createElement;

	if ( ! window.productTableBlockComponents ) {
		window.productTableBlockComponents = {};
	}

	const filterSelectionOptions = {
		'category': { label: 'Category', andor: true, for: 'category', multiple: true },
		'tag': { label: 'Tag', andor: true, for: 'tag', multiple: true },
		'cf': { label: 'Custom Field', andor: true, keypair: [ 'Key', 'Value' ], multiple: true, for: 'value' },
		'term': { label: 'Custom Taxonomy Term', keypair: [ 'Taxonomy', 'Term' ], multiple: true, for: 'value' },
		'attr': { attr: 'term', label: 'Attribute', keypair: [ 'Attribute', 'Term' ], for: 'attr', multiple: true },
		'year': { label: 'Year', for: 'value' },
		'month': { label: 'Month', for: 'value' },
		'day': { label: 'Day', for: 'value' },
		'status': { label: 'Product Status', for: 'status', values: [ 'publish', 'draft', 'private', 'pending', 'future', 'any' ], multiple: true },
		'include': { label: 'Include Products', description: 'Separate Product IDs with a comma', for: 'value' },
		'exclude': { label: 'Exclude Products', description: 'Separate Product IDs with a comma', for: 'value' },
		'exclude_category': { andor: true, label: 'Exclude Category', for: 'category', multiple: true },
		'user_products=true': { label: 'Previously Ordered Products' },
		//'variations=separate': { label: 'Show Variations' },
	};

	const createProductSelectionFilters = ( { filters, onDelete } ) => {

		let filterNodes = [];

		for ( let i in filters ) {
			let prettyValue = filters[i].value.replace(/,/g, ', ').replace(/\+/g, ' + ');
			let node = el(
				'li',
				{
					'data-index': i,
					'data-key': filters[i].key,
					'data-value': filters[i].value,
					key: 'table-column-' + i
				},
				[
					el(
						Icon,
						{
							icon: barn2_reorderIcon,
							alt: ''
						}
					),
					el(
						'span',
						{},
						[
							el( 'strong', {}, filterSelectionOptions[ filters[i].key ].label + ': ' ),
							prettyValue
						]
					),
					el(
						IconButton,
						{
							icon: barn2_deleteIcon,
							label: 'Remove Selection',
							'data-index': i,
							onClick: (e) => {
								onDelete( e.currentTarget.dataset.index );
							}
						}
					)
				]
			);
			filterNodes.push( node );
		}

		return filterNodes;

	}

	const getFilterSelectionOptions = () => {

		let optionNodes = [];

		optionNodes.push( el(
			'option',
			{ value: '' },
			__( '(Select a product option to add)', 'wpt-block' )
		) );

		for ( let key in filterSelectionOptions ) {

			optionNodes.push( el(
				'option',
				{
					value: key,
					'data-for': filterSelectionOptions[key].for,
					'data-key': filterSelectionOptions[key].attr || key,
					'data-multiple': filterSelectionOptions[key].multiple,
					'data-andor': filterSelectionOptions[key].andor,
					'data-description': filterSelectionOptions[key].description,
				},
				filterSelectionOptions[key].label
			) );

		}

		return optionNodes;

	};

	const getFilterSelectionOptionValues = ( values, recursive ) => {

		let optionNodes = [];

		optionNodes.push( el(
			'option',
			{ value: '' },
			__( '(Select a value)', 'wpt-block' )
		) );

		for ( let key in values ) {

			if ( recursive && values[key].terms ) {

				for ( let subkey in values[key].terms ) {
					optionNodes.push( el(
						'option',
						{ value: key + ':' + subkey, 'data-key': key },
						values[key].terms[subkey]
					) );
				}

			} else {

				if ( isNaN( key ) ) {

					optionNodes.push( el(
						'option',
						{ value: key },
						values[key].label
					) );

				} else {

					optionNodes.push( el(
						'option',
						{ value: values[key] },
						values[key]
					) );

				}

			}

		}

		return optionNodes;

	};

	const resetPanel = ( panel ) => {

		panel.classList.remove( 'allow-multiple' );
		panel.classList.remove( 'allow-andor' );

		let disabled = panel.querySelectorAll( '*[disabled]' );
		for( let option of disabled ) {
			option.disabled = false;
		}

		let selectors = panel.querySelectorAll( 'select,input' );
		for( let obj of selectors ) {
			obj.value = '';
			obj.classList.remove( 'visible' );
			obj.classList.remove( 'selected' );
			obj.classList.remove( 'ready' );
		}


		panel.querySelector( 'ul' ).innerHTML = '';

	};

	const selectProductOption = ( e, panel ) => {

		let self = e.currentTarget;
		let value = self.value;
		let thisOption = self.querySelector( `option[value="${value}"]` );

		panel.classList.remove( 'allow-multiple' );
		panel.classList.remove( 'allow-andor' );

		self.classList.remove( 'selected' );

		let options = self.parentNode.querySelectorAll( '.barn2-wc-product-table-block__new-option' );
		for( let option of options ) {
			option.classList.remove( 'visible' );
			option.value = '';
			option.setAttribute( 'placeholder', '' );
		}

		if ( thisOption.dataset.for ) {
			let selector = self.parentNode.querySelector( '.barn2-wc-product-table-block__new-option.' + thisOption.dataset.for );
			selector.classList.add( 'visible' );

			if ( thisOption.dataset.multiple ) {
				panel.classList.add( 'allow-multiple' );
			}
			if ( thisOption.dataset.andor ) {
				panel.classList.add( 'allow-andor' );
			}

			if ( thisOption.dataset.description ) {
				selector.setAttribute( 'placeholder', thisOption.dataset.description );
			}
		} else {
			self.classList.add( 'selected' );
		}

	};

	const selectProductKey = ( e ) => {

		let self = e.currentTarget;

		if ( self.value === '' ) {
			self.classList.remove( 'selected' );
		} else {
			self.classList.add( 'selected' );
		}

	};

	const selectProductAttr = ( e, modal ) => {

		let self = e.currentTarget;

		let attrValues = modal.querySelector( 'select.attr-values' );

		if ( self.value === '' ) {
			self.classList.remove( 'ready' );
			attrValues.classList.remove( 'visible' );
		} else {
			self.classList.add( 'ready' );
			attrValues.classList.add( 'visible' );
		}

		attrValues.value = '';

		let attrOptions = attrValues.querySelectorAll( 'option' );
		for ( let option of attrOptions ) {
			if ( option.dataset.key === self.value ) {
				option.style.display = '';
			} else {
				option.style.display = 'none';
			}
		}


	};

	const selectProductAttrValue = ( e ) => {

		let self = e.currentTarget;

		if ( self.value === '' ) {
			self.classList.remove( 'selected' );
		} else {
			self.classList.add( 'selected' );
		}

	};

	const selectProductValue = ( e ) => {

		let self = e.currentTarget;

		if ( self.value === '' ) {
			self.classList.remove( 'selected' );
		} else {
			self.classList.add( 'selected' );
		}

	};

	const addFilterSelection = ( panel, saveNewFilter ) => {

		let key = panel.querySelector( '.barn2-wc-product-table-block__add-new-selection' ),
			value = panel.querySelector( '.barn2-wc-product-table-block__new-option.selected' );

		key.disabled = true;

		if ( panel.classList.contains( 'allow-multiple' ) ) {

			let list = panel.querySelector( 'ul' ),
				item = document.createElement( 'li' );

			item.innerHTML = value.value;
			item.dataset.value = value.value;

			list.append( item );

			key.disabled = true;

			value.value = '';
			value.classList.remove( 'selected' );

			if ( value.tagName === 'SELECT' ) {

				let option = value.querySelector( `option[value="${value.value}"]` );
				if ( option ) {
					option.disabled = true;
				}

			}

		} else {

			let split = key.value.split( '=' );
			let newFilterKey = split[0];
			let newFilterValue = split.length > 1 ? split[1] : '';
			if ( split.length === 1 ) {
				newFilterValue = value.value;
			}

			saveNewFilter( { key: newFilterKey, value: newFilterValue } );
		}

	};

	const getNewFilter = ( panel, matchAll ) => {

		let key = panel.querySelector( '.barn2-wc-product-table-block__add-new-selection' ),
			values = panel.querySelectorAll( 'ul li' );

		let selectedOption = key.querySelector( `option[value="${key.value}"]` );

		let newFilterKey, newFilterValue;
		if ( values.length ) {

			newFilterKey = selectedOption.dataset.key;
			let joinChar = panel.classList.contains( 'allow-andor' ) && matchAll ? '+' : ',';
			let filters = [];
			for ( let li of values ) {
				filters.push( li.dataset.value );
			}

			newFilterValue = filters.join( joinChar );

		} else {
			let split = selectedOption.dataset.key.split( '=' );
			newFilterKey = split[0];
			newFilterValue = split.length > 1 ? split[1] : '';
		}

		return { key: newFilterKey, value: newFilterValue };

	};

	const getFiltersOrder = ( list ) => {

		let newColumnOrder = [];
		let columnsSelected = list.querySelectorAll( 'li' );

		for( let i = 0; i < columnsSelected.length; i += 1 ) {
			newColumnOrder.push( { key: columnsSelected[i].dataset.key, value: columnsSelected[i].dataset.value } );
		}

		return newColumnOrder;

	};

	window.productTableBlockComponents.ProductSelection = withState( {

		isMatchall: false,
		count: null

	} )( ( { isMatchall, count, attributes, saveFilters, setState } ) => {

		wp.apiFetch.use( wp.apiFetch.createNonceMiddleware( nonce ) );
		wp.apiFetch( {
			path: '/wc-product-table/v1/count',
			method: 'POST',
			data: { attrs: attributes }
		} ).then( res => {
			if ( count == null || res.count !== count ) {
				setState( { count: res.count } );
			}
		} );

		let { filters } = attributes;

		let filterSelectionsRef = wp.element.createRef();
		let newFilterPanelRef = wp.element.createRef();

		let addFilter = ( filter ) => {
			let newFilters = JSON.parse( JSON.stringify( filters ) );
			newFilters.push( filter );

			resetPanel( newFilterPanelRef.current );
			saveFilters( newFilters );
		};

		if ( count != null && count >= 100 ) {
			count = 'At least 100';
		}

		let	productElements = [
			el(
				'h3',
				{},
				[
					__( 'Products', 'wpt-block' ),
					el(
						'em',
						{},
						count != null ? `${count} products found` : 'Finding products...'
					)
				]
			),
			el(
				'ul',
				{ className: 'barn2-wc-product-table-block__product-filters', ref: filterSelectionsRef },
				createProductSelectionFilters( {
					filters,
					onDelete: ( index ) => {
						let newFilters = removeArrayIndex( filters, index );
						saveFilters( newFilters );
					}
				} )
			),
			el( 'p', { className: 'empty-options' }, __( '(Using global options)', 'wpt-block' ) ),
			el(
				'div',
				{
					className: 'barn2-wc-product-table-block__new-filter-panel',
					ref: newFilterPanelRef
				},
				[
					el(
						'select',
						{
							className: 'barn2-wc-product-table-block__add-new-selection',
							onChange: (e) => {
								selectProductOption( e, newFilterPanelRef.current );
							}
						},
						getFilterSelectionOptions()
					),
					el(
						'select',
						{ className: 'barn2-wc-product-table-block__new-option category', onChange: selectProductKey },
						getFilterSelectionOptionValues( data.categoryTerms )
					),
					el(
						'select',
						{ className: 'barn2-wc-product-table-block__new-option status', onChange: selectProductKey },
						getFilterSelectionOptionValues( filterSelectionOptions.status.values )
					),
					el(
						'select',
						{ className: 'barn2-wc-product-table-block__new-option tag', onChange: selectProductKey },
						getFilterSelectionOptionValues( data.tagTerms )
					),
					el(
						'select',
						{
							className: 'barn2-wc-product-table-block__new-option attr',
							onChange: ( e ) => {
								selectProductAttr( e, newFilterPanelRef.current );
							}
						},
						getFilterSelectionOptionValues( data.attributes )
					),
					el(
						'select',
						{ className: 'barn2-wc-product-table-block__new-option attr-values', onChange: selectProductAttrValue },
						getFilterSelectionOptionValues( data.attributes, true )
					),
					el(
						'input',
						{ className: 'barn2-wc-product-table-block__new-option value', onChange: selectProductValue }
					),
					el(
						Button,
						{
							className: 'is-secondary barn2-wc-product-table-block__add-filter-button',
							onClick: ( e ) => {
								addFilterSelection( newFilterPanelRef.current, addFilter );
							}
						},
						__( 'Add', 'wpt-block' )
					),
					el(
						'ul',
						{
							className: 'barn2-wc-product-table-block__new-filter-selections',
						}
					),
					el(
						ToggleControl,
						{
							className: 'barn2-wc-product-table-block__andor-toggle',
							label: __( 'Match all', 'wpt-block' ),
							checked: isMatchall,
							onChange: () => {
								setState( { isMatchall: ! isMatchall } );
							}
						}
					),
					el(
						Button,
						{
							className: 'is-primary barn2-wc-product-table-block__save-filter-button',
							onClick: (e) => {
								let newFilter = getNewFilter( newFilterPanelRef.current, isMatchall );
								addFilter( newFilter );
							}
						},
						__( 'Add Selection to Table', 'wpt-block' )
					),
					el(
						Button,
						{
							className: 'is-secondary barn2-wc-product-table-block__save-filter-button',
							onClick: (e) => {
								resetPanel( newFilterPanelRef.current );
							}
						},
						__( 'Reset', 'wpt-block' )
					)
				]
			)
		];

		waitForReference( filterSelectionsRef, ( ref ) => {
			if ( ! ref.classList.contains( 'ui-sortable' ) ) {
				let $sortRef = jQuery( ref );
				$sortRef.sortable( {
					update: function() {
						let newFilters = getFiltersOrder( ref );
						console.log( newFilters );
						$sortRef.sortable( 'cancel' );
						saveFilters( newFilters );
					}
				} );
			}
		} );

		return el(
			'div',
			{
				className: 'barn2-wc-product-table-block__products'
			},
			productElements
		);

	} );

} )( window.wp, typeof wcptbNonce !== 'undefined' ? wcptbNonce : null, typeof wcptbCatalog !== 'undefined' ? wcptbCatalog : null );