( function ( wp, settings ) {
	"use strict";

	const { __ } = wp.i18n;
	const { createElement } = wp.element;
	const { Button, IconButton } = wp.components;

	const { withState } = wp.compose;

	const el = createElement;

	if ( ! window.productTableBlockComponents ) {
		window.productTableBlockComponents = {};
	}

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

	const getTableColumnLabel = ( type ) => {

		if ( settings.columnLabels[type] ) {
			return settings.columnLabels[type].heading;
		} else {
			return type;
		}

	}

	const getTableColumnOrder = ( container ) => {

		console.log( container );

		let newColumnOrder = [];
		let columnsSelected = container.querySelectorAll( 'li' );

		console.log( columnsSelected );

		for( let i = 0; i < columnsSelected.length; i += 1 ) {
			newColumnOrder.push( columnsSelected[i].dataset.slug );
		}

		console.log( newColumnOrder );

		return newColumnOrder;
	}

	const getTableColumnOptions = () => {

		let options = [
			el(
				'option',
				{ value: '', key: 0 },
				__( '(Select a column to add)', 'wpt-block' )
			)
		];
		for ( var slug in settings.columnLabels ) {
			options.push( el(
				'option',
				{ value: slug, key: slug },
				settings.columnLabels[slug].heading
			) );
		}

		return options;

	};

	const getTableColumnAttributeOptions = () => {

		let options = [
			el(
				'option',
				{ value: '', key: 0 },
				__( '(Select an attribute)', 'wpt-block' )
			)
		];
		console.log( settings.columnLabels.att.values );
		for ( let index in settings.columnLabels.att.values ) {
			let attr = settings.columnLabels.att.values[index];
			options.push( el(
				'option',
				{ value: attr.attribute_name, key: attr.attribute_id },
				attr.attribute_label
			) );
		}

		return options;

	};

	const addTableColumn = ( { selection, attr, custom, columns } ) => {

		if ( selection.value === 'att' ) {
			columns.push( selection.value + ':' + attr.value );
		} else if ( selection.value === 'tax' || selection.value === 'cf' ) {
			columns.push( selection.value + ':' + custom.value );
		} else {
			columns.push( selection.value );
		}

		attr.value = '';
		attr.classList.remove( 'selected' );

		custom.value = '';
		custom.classList.remove( 'selected' );

		selection.value = '';
		selection.classList.remove( 'selected' );
		selection.classList.remove( 'select-attribute' );
		selection.classList.remove( 'select-custom' );

		return columns;

	};


	const selectTableColumn = ( e ) => {

		e.currentTarget.classList.remove( 'selected' );
		e.currentTarget.classList.remove( 'select-attribute' );
		e.currentTarget.classList.remove( 'select-custom' );

		if ( e.currentTarget.value === 'att' ) {
			e.currentTarget.classList.add( 'select-attribute' );
		} else if ( e.currentTarget.value === 'cf' || e.currentTarget.value === 'tax' ) {
			e.currentTarget.classList.add( 'select-custom' );
		} else {
			e.currentTarget.classList.add( 'selected' );
		}

	};

	const selectTableColumnEntry = ( e ) => {

		if ( e.currentTarget.value === '' ) {
			e.currentTarget.classList.remove( 'selected' );
		} else {
			e.currentTarget.classList.add( 'selected' );
		}

	};

	const removeArrayIndex = ( array, index ) => {

		let newArray = [];

		for ( var i in array ) {
			if ( i !== index ) {
				newArray.push( array[i] );
			}
		}

		return newArray;

	}

	const createTableColumns = ( { ref, columns, onChange } ) => {

		let columnNodes = [];

		for ( let i in columns ) {
			let node = el(
				'li',
				{
					'data-slug': columns[i],
					key: 'table-column-' + i
				},
				[
					columns[i],
					el(
						IconButton,
						{
							icon: deleteIcon,
							label: 'Remove Column',
							'data-index': i,
							onClick: (e) => {
								onChange( removeArrayIndex( columns, e.currentTarget.dataset.index ) );
							}
						}
					)
				]
			);
			columnNodes.push( node );
		}

		return el(
			'ul',
			{
				className: 'table-column-options',
				ref: ref,
				'data-columns': columns.join( ',' )
			},
			columnNodes
		);

	}

	const createTableHeaderColumn = ( colSlug ) => {

		let colType;
		let colSplit = colSlug.indexOf( ':' );
		if ( colSplit !== -1 ) {
			colType = colSlug.substring( 0, colSplit );
		} else {
			colType = colSlug;
		}

		return el(
			'span',
			{
				className: 'col-' + colType
			},
			getTableColumnLabel( colType )
		);

	}

	window.productTableBlockComponents.ProductTableColumns = withState( {

		columnsHaveChanged: false,
		modalOpened: false,
		newColumns: null,

	} )( ( { columnsHaveChanged, modalOpened, newColumns, columns, onChange, setState } ) => {

		let tableHeaderColumns = [], firstRun = false, sortable;
		let componentClassName = 'product-table-column-preview wc-product-table woocommerce dataTable';

		if ( ! newColumns ) {
			newColumns = [];
			firstRun = true;
		}

		if ( ! columns || columns.length === 0 ) {
			componentClassName += ' default';
			for ( var col of settings.defaultValues.columns ) {
				tableHeaderColumns.push( createTableHeaderColumn( col ) );
			}
		} else {
			for ( var col of columns ) {
				tableHeaderColumns.push( createTableHeaderColumn( col ) );
				if ( firstRun ) {
					newColumns.push( col );
				}
			}
		}

		let popupClassName = 'customize-column-modal';
		if ( columnsHaveChanged ) {
			popupClassName += ' changed';
		}
		if ( modalOpened ) {
			popupClassName += ' opened';
		}

		let columnRef = wp.element.createRef();
		let selectionRef = wp.element.createRef();
		let attrRef = wp.element.createRef();
		let customRef = wp.element.createRef();

		let columnPopup = el(
			'div',
			{ className: popupClassName },
			[
				el( 'h3', {}, __( 'Modify Table Columns', 'wpt-block' ) ),
				el(
					Button,
					{
						className: 'save-table-columns-button',
						onClick: ( e ) => {
							if ( onChange ) {
								onChange( newColumns );
							}
							setState( { columnsHaveChanged: false, modalOpened: false } );
						},
					},
					__( 'Save', 'wpt-block' )
				),
				createTableColumns( {
					ref: columnRef,
					columns: newColumns,
					onChange: ( columns ) => {
						setState( { columnsHaveChanged: true, newColumns: columns } );
					}
				} ),
				el( 'p', { className: 'empty-options' }, __( '(Using global options)', 'wpt-block' ) ),
				el(
					'select',
					{
						className: 'new-table-column-selection',
						onChange: selectTableColumn,
						ref: selectionRef,
					},
					getTableColumnOptions()
				),
				el(
					'select',
					{
						className: 'new-table-column-attribute-selection',
						onChange: selectTableColumnEntry,
						ref: attrRef
					},
					getTableColumnAttributeOptions()
				),
				el(
					'input',
					{
						className: 'new-table-column-custom-entry',
						onChange: selectTableColumnEntry,
						ref: customRef
					},
				),
				el(
					Button,
					{
						className: 'add-table-column-button',
						onClick: (e) => {
							newColumns = getTableColumnOrder( columnRef.current );
							newColumns = addTableColumn( {
								selection: selectionRef.current,
								attr: attrRef.current,
								custom: customRef.current,
								columns: newColumns
							} );

							console.log( newColumns );
							setState( { columnsHaveChanged: true, newColumns } );
						},
					},
					__( 'Add', 'wpt-block' )
				),
			]
		);

		tableHeaderColumns.push( el(
			Button,
			{
				className: 'customize-columns',
				'aria-expanded': modalOpened ? 'true' : 'false',
				onClick: (e) => {
					setState( { modalOpened: ! modalOpened } );
				}
			},
			__( 'Customize Columns', 'wpt-block' )
		) );

		tableHeaderColumns.push( columnPopup );

		waitForReference( columnRef, ( ref ) => {
			if ( ! ref.classList.contains( 'ui-sortable' ) ) {
				let $sortRef = jQuery( ref );
				$sortRef.sortable( {
					update: function( e, ui ) {
						let newOrder = getTableColumnOrder( ref );
						$sortRef.sortable( 'cancel' );
						setState( {
							columnsHaveChanged: true,
							newColumns: newOrder
						} );
					}
				} );
			}
		} );

		return el(
			'div',
			{
				className: componentClassName
			},
			tableHeaderColumns
		);

	} );

	const waitForReference = ( ref, ready ) => {

		if ( ref.current ) {
			ready( ref.current );
		} else {
			window.setTimeout( waitForReference, 100, ref, ready );
		}

	}

} )( window.wp, wcptbSettings );