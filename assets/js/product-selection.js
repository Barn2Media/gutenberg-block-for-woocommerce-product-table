( function ( wp, nonce, data ) {
	"use strict";

	const { __ } = wp.i18n;
	const { createElement } = wp.element;
	const { Button, IconButton, ToggleControl } = wp.components;

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

	const deleteIcon = el(
		'svg',
		{
			xmlns: "http://www.w3.org/2000/svg",
			width: 16,
			height: 16,
			viewBox: "0 0 24 24"
		},
		el( 'path',
			{
				d: "M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M16.207,14.793l-1.414,1.414L12,13.414 l-2.793,2.793l-1.414-1.414L10.586,12L7.793,9.207l1.414-1.414L12,10.586l2.793-2.793l1.414,1.414L13.414,12L16.207,14.793z"
			}
		)
	);

	const createProductSelectionFilters = ( { filters, onDelete } ) => {

		let filterNodes = [];

		for ( let i in filters ) {
			let node = el(
				'li',
				{
					'data-index': i,
					'data-key': filters[i].key,
					'data-value': filters[i].value,
					key: 'table-column-' + i
				},
				[
					filters[i].key + '=' + filters[i].value,
					el(
						IconButton,
						{
							icon: deleteIcon,
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
			__( '(Select a product option)', 'wpt-block' )
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

	const resetModal = ( modal ) => {

		modal.classList.remove( 'allow-multiple' );
		modal.classList.remove( 'allow-andor' );

		let disabled = modal.querySelectorAll( '*[disabled]' );
		for( let option of disabled ) {
			option.disabled = false;
		}

		let selectors = modal.querySelectorAll( 'select,input' );
		for( let obj of selectors ) {
			obj.value = '';
			obj.classList.remove( 'visible' );
			obj.classList.remove( 'selected' );
			obj.classList.remove( 'ready' );
		}


		modal.querySelector( 'ul' ).innerHTML = '';

	};

	const selectProductOption = ( e, modal ) => {

		let self = e.currentTarget;
		let value = self.value;
		let thisOption = self.querySelector( `option[value="${value}"]` );

		modal.classList.remove( 'allow-multiple' );
		modal.classList.remove( 'allow-andor' );

		self.classList.remove( 'selected' );

		let options = self.parentNode.querySelectorAll( '.customize-filter-new-option' );
		for( let option of options ) {
			option.classList.remove( 'visible' );
			option.value = '';
			option.setAttribute( 'placeholder', '' );
		}
		
		if ( thisOption.dataset.for ) {
			let selector = self.parentNode.querySelector( '.customize-filter-new-option.' + thisOption.dataset.for );
			selector.classList.add( 'visible' );

			if ( thisOption.dataset.multiple ) {
				modal.classList.add( 'allow-multiple' );
			}
			if ( thisOption.dataset.andor ) {
				modal.classList.add( 'allow-andor' );
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

	const addFilterSelection = ( modal, saveNewFilter ) => {

		modal.querySelector( '.customize-filter-add-new-selection' ).disabled = true;

		let key = modal.querySelector( '.customize-filter-add-new-selection' ),
			value = modal.querySelector( '.customize-filter-new-option.selected' );

		if ( modal.classList.contains( 'allow-multiple' ) ) {

			let list = modal.querySelector( 'ul' ),
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

	const getNewFilter = ( modal, matchAll ) => {

		let key = modal.querySelector( '.customize-filter-add-new-selection' ),
			values = modal.querySelectorAll( 'ul li' );

		let selectedOption = key.querySelector( `option[value="${key.value}"]` );

		let newFilterKey, newFilterValue;
		if ( values.length ) {

			newFilterKey = selectedOption.dataset.key;
			let joinChar = modal.classList.contains( 'allow-andor' ) && matchAll ? '+' : ',';
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

		let addFilter = ( filter ) => {
			let newFilters = JSON.parse( JSON.stringify( filters ) );
			newFilters.push( filter );
			saveFilters( newFilters );
		};

		let temporaryFilterSelectionsRef = wp.element.createRef();
		let newFilterPanelRef = wp.element.createRef();

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
				{ className: 'barn2-wc-product-table-block__product-filters' },
				createProductSelectionFilters( {
					filters,
					onDelete: ( index ) => {
						let newFilters = [];
						for ( let i in filters ) {
							if ( i !== index ) {
								newFilters.push( filters[i] );
							}
						}
						saveFilters( newFilters );
					}
				} )
			),
			el(
				'div',
				{ 
					className: 'barn2-wc-product-table-block__new-filter-panel',
					ref: newFilterPanelRef
				},
				[
					el(
						'ul',
						{ 
							className: 'barn2-wc-product-table-block__new-filter-selections',
							ref: temporaryFilterSelectionsRef,
						}
					),
					el( 'p', { className: 'empty-options' }, __( '(Using global options)', 'wpt-block' ) ),
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
							className: 'barn2-wc-product-table-block__add-filter-button',
							onClick: ( e ) => {
								addFilterSelection( newFilterPanelRef.current, addFilter );
							}
						},
						__( 'Add', 'wpt-block' )
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
							className: 'barn2-wc-product-table-block__save-filter-button',
							onClick: (e) => {
								let newFilter = getNewFilter( newFilterPanelRef.current, isMatchall );
								addFilter( newFilter );
							}
						},
						__( 'Save', 'wpt-block' )
					),
				]
			)
		];


		return el(
			'div',
			{
				className: 'barn2-wc-product-table-block__products'
			},
			productElements
		);

		/*
			[
				,
				
				
			]
		);
		*/

	} );

} )( window.wp, wcptbNonce, wcptbCatalog );