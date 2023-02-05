import React, { Fragment, useState } from 'react';
import Map from './Map';
import InputSearchList from './InputSearchList'
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {
		flexGrow: 1,
		margin: `2rem`
	},
	search: {
		marginRight: '2rem'
	},
	map: {
		marginRight: '2rem'
	},
}));

function Home(props) {
	const [google] = useState(props);
  	const classes = useStyles();

	return ( 
		<Fragment>
			<Grid container spacing={1} className={classes.root}>
				<Grid container item xs={12} md={4} spacing={3} >
					<InputSearchList className={classes.search}/>
				</Grid>
				<Grid container item xs={12} md={8} spacing={3} >
					<Map
						google={google}
						center={{lat: 3.1577, lng: 101.7122}}
						height='300px'
						zoom={15}
						className={classes.map}
					/>
				</Grid>
			</Grid>
		</Fragment> 
	);
}
 
export default Home;

