import React, { Fragment, useEffect, useState } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import { GoogleMapsAPI } from '../client-config';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { addInputSearch } from "../redux/actions";
import { TextField } from '@material-ui/core';

Geocode.setApiKey( GoogleMapsAPI );
Geocode.enableDebug();

const useStyles = makeStyles((theme) => ({
	root: {
	  marginRight: `2rem`,
	},
	mapAutoComplete: {
		width: '100%',
		height: '40px',
		paddingLeft: '16px',
		marginTop: '2px',
		marginBottom: '500px'
	},
	map: {
		
	},
	form: {
		marginTop: `4rem`
	},
	textField: {
		width: '-webkit-fill-available',
		marginTop: `1rem`
	}
}));

function Map(props) {
	const classes = useStyles();

	let [address,setAddress] = useState('');
	let [city,setCity] = useState('');
	let [area,setArea] = useState('');	
	let [state,setState] = useState('');
	let [country,setCountry] = useState('');
	let [mapPosition,setMapPosition] = useState({lat: props.center.lat, lng: props.center.lng});
	let [markerPosition,setMarkerPosition] = useState({lat: props.center.lat, lng: props.center.lng});
	let [, setInput] = useState('');

	useEffect(() => {
		Geocode.fromLatLng( mapPosition.lat , mapPosition.lng ).then(
			response => {
				let addressArray =  response.results[0].address_components;
				address = response.results[0].formatted_address;
				city = getCity( addressArray );
				area = getArea( addressArray );
				state = getState( addressArray );
				country = getCountry( addressArray );

				console.log( 'city', city, area, state );

				setAddress(address);
				setCity( city );
				// setArea( area );
				// setState( state );
				setCountry( country )
			},
			error => {
				console.error( error );
			}
		);
	},[])

	const getCity = ( addressArray ) => {
		let city = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};

	const getArea = ( addressArray ) => {
		let area = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	};
	const getState = ( addressArray ) => {
		let state = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	};

	const getCountry = ( addressArray ) => {
		let country = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'country' === addressArray[ i ].types[0] ) {
					country = addressArray[ i ].long_name;
					return country;
				}
			}
		}
	};

	const onChange = ( event ) => {
		setInput(event.target.value);
	};

	const onInfoWindowClose = ( event ) => {

	};

	const onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
			newLng = event.latLng.lng();

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				let addressArray =  response.results[0].address_components;
				address = response.results[0].formatted_address;
				city = getCity( addressArray );
				area = getArea( addressArray );
				state = getState( addressArray );
				country = getCountry( addressArray );

				setAddress(address);
				setCity( city );
				setArea( area );
				setState( state );
				setCountry( country );
				setMarkerPosition({ lat: newLat, lng: newLng });
				setMapPosition({ lat: newLat, lng: newLng });
			},
			error => {
				console.error(error);
			}
		);
	};

	const onPlaceSelected = ( place ) => {
		if (!place.geometry || !place.geometry.location) {
            window.alert(
              "No details available for input: '" + place.name + "'"
            );
            return;
          }

		let addressArray =  place.address_components,
		latValue = place.geometry.location.lat(),
		lngValue = place.geometry.location.lng();
		address = place.formatted_address;
		city = getCity( addressArray );
		area = getArea( addressArray );
		state = getState( addressArray );
		country = getCountry( addressArray );

		setAddress(address);
		setCity( city );
		setArea( area );
		setState( state );
		setCountry( country );
		setMarkerPosition({ lat: latValue, lng: lngValue });
		setMapPosition({ lat: latValue, lng: lngValue });

		let inputPlace = (city ? city + ', ': '') +  area + ', ' + state + ', ' + country
		props.addInputSearch(inputPlace);
	};

	const AsyncMap = withScriptjs(
		withGoogleMap(
			props => (
				<GoogleMap google={ props.google }
				defaultZoom={ 15 }
				defaultCenter={{ lat: mapPosition.lat, lng: mapPosition.lng }}
				>
					{/* InfoWindow on top of marker */}
					<InfoWindow
						onClose={onInfoWindowClose}
						position={{ lat: ( markerPosition.lat + 0.0018 ), lng: markerPosition.lng }}
					>
						<div>
							<span style={{ padding: 0, margin: 0 }}>{ address }</span>
						</div>
					</InfoWindow>
					{/*Marker*/}
					<Marker 
						google={props.google}
						name={'Dolores park'}
						draggable={true}
						onDragEnd={ onMarkerDragEnd }
						position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
					/>
					<Marker />
					{/* For Auto complete Search Box */}
					<Autocomplete 
						className={classes.mapAutoComplete}
						onPlaceSelected={ onPlaceSelected }
						types={['(regions)']}
					/>
				</GoogleMap>
			)
		)
	);
	
	return (
		<Fragment>
			{ props.center.lat !== undefined && (
				<div className={classes.root}>
					<div className={classes.map}>
						<AsyncMap
							googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
							loadingElement={
								<div style={{ height: `100%` }} />
							}
							containerElement={
								<div style={{ height: props.height }} />
							}
							mapElement={
								<div style={{ height: `100%` }} />
							}
						/>
					</div>
					<div className={classes.form}>
						<TextField className={classes.textField} id="standard-basic" label="City" onChange={ onChange } value={ city } InputProps={{ readOnly: true }} variant="outlined"/>
						<TextField className={classes.textField} id="standard-basic" label="Area" onChange={ onChange } value={ area } InputProps={{ readOnly: true }} variant="outlined"/>
						<TextField className={classes.textField} id="standard-basic" label="State" onChange={ onChange } value={ state } InputProps={{ readOnly: true }} variant="outlined"/>
						<TextField className={classes.textField} id="standard-basic" label="Country" onChange={ onChange } value={ country } InputProps={{ readOnly: true }} variant="outlined"/>
						<TextField className={classes.textField} id="standard-basic" label="Address" onChange={ onChange } value={ address } InputProps={{ readOnly: true }} variant="outlined"/>
					</div>
				</div>
			)}
			{ props.center.lat === undefined && (
				<div style={{height: props.height}} />
			)}
	   </Fragment>
	 );
}

export default connect(null, { addInputSearch })(React.memo((Map)));
  

