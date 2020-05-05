( function ( wp, settings ) {
	"use strict";

	const { __ } = wp.i18n;
	const { createElement } = wp.element;
	const { Button, IconButton, Icon } = wp.components;

	const el = createElement;

	if ( ! window.productTableBlockComponents ) {
		window.productTableBlockComponents = {};
	}

	const getTableColumnOrder = ( container ) => {

		let newColumnOrder = [];
		let columnsSelected = container.querySelectorAll( 'li' );

		for( let i = 0; i < columnsSelected.length; i += 1 ) {
			newColumnOrder.push( columnsSelected[i].dataset.slug );
		}

		return newColumnOrder;
	}

	const getTableColumnOptions = () => {

		let options = [
			el(
				'option',
				{ value: '', key: 0 },
				__( '(Select a table column to add)', 'wpt-block' )
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


	const createTableColumns = ( { columnRef, columns, onChange } ) => {

		let columnNodes = [];

		for ( let i in columns ) {

			let labelSplit = columns[i].split(':');
			let label = [
				el( 'strong', {}, settings.columnLabels[ labelSplit[0] ].heading )
			];
			if ( labelSplit.length > 1 ) {
				label.push(
					el( 'em', {}, labelSplit[1] )
				);
			}

			let node = el(
				'li',
				{
					'data-slug': columns[i],
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
					el( 'span', {}, label ),
					el(
						IconButton,
						{
							icon: barn2_deleteIcon,
							label: 'Remove Column',
							'data-index': i,
							onClick: (e) => {
								onChange( { newColumns: removeArrayIndex( columns, e.currentTarget.dataset.index ) } );
							}
						}
					)
				]
			);
			columnNodes.push( node );
		}

		waitForReference( columnRef, ( ref ) => {
			if ( ! ref.classList.contains( 'ui-sortable' ) ) {
				let $sortRef = jQuery( ref );
				$sortRef.sortable( {
					update: function() {
						let newColumns = getTableColumnOrder( ref );
						$sortRef.sortable( 'cancel' );
						onChange( { newColumns } );
					}
				} );
			}
		} );

		return el(
			'ul',
			{
				className: 'barn2-wc-product-table-block__columns-selected',
				ref: columnRef,
				'data-columns': columns.join( ',' )
			},
			columnNodes
		);

	}

	/*window.productTableBlockComponents.ProductTableColumns = withState( {

		columnsHaveChanged: false,
		modalOpened: false,
		newColumns: null,

	} )( ( { columnsHaveChanged, modalOpened, newColumns, columns, onChange, setState } ) => {*/

	window.productTableBlockComponents.ProductTableColumns = ( { columns, saveColumns } ) => {

		//let tableHeaderColumns = [], firstRun = false, sortable;
		let componentClassName = 'barn2-wc-product-table-block__columns';

		let	columnElements = [
			el( 'h3', {}, __( 'Table Columns', 'wpt-block' ) )
		];

		let columnRef = wp.element.createRef();

		columnElements.push( createTableColumns( {
			columnRef,
			columns: columns,
			onChange: ( { newColumns } ) => {
				saveColumns( newColumns );
			}
		} ) );

		columnElements.push( el( 'p', { className: 'empty-options' }, __( '(Using global options)', 'wpt-block' ) ) );

		let selectionRef = wp.element.createRef();
		let attrRef = wp.element.createRef();
		let customRef = wp.element.createRef();

		columnElements.push( el(
			'select',
			{
				className: 'barn2-wc-product-table-block__column-selector',
				onChange: selectTableColumn,
				ref: selectionRef,
			},
			getTableColumnOptions()
		) );

		columnElements.push( el(
			'select',
			{
				className: 'barn2-wc-product-table-block__attribute-selector',
				onChange: selectTableColumnEntry,
				ref: attrRef
			},
			getTableColumnAttributeOptions()
		) );

		columnElements.push( el(
			'input',
			{
				className: 'barn2-wc-product-table-block__custom-input',
				onChange: selectTableColumnEntry,
				ref: customRef
			}
		) );

		columnElements.push( el(
			Button,
			{
				className: 'components-button is-secondary barn2-wc-product-table-block__add-column-button',
				onClick: (e) => {
					let newColumns = getTableColumnOrder( columnRef.current );
					newColumns = addTableColumn( {
						selection: selectionRef.current,
						attr: attrRef.current,
						custom: customRef.current,
						columns: newColumns
					} );
					saveColumns( newColumns );
				},
			},
			__( 'Add', 'wpt-block' )
		) );

		return el(
			'div',
			{
				className: componentClassName
			},
			columnElements
		);

	};

} )( window.wp, typeof wcptbSettings !== 'undefined' ? wcptbSettings : null );