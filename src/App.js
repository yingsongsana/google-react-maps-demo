import React from 'react';
import './App.css';
import axios from 'axios'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'

class App extends React.Component {
constructor() {
  super() 
  this.state = {
    query: '',
    selectedPlace: ''
  }
}

updateQuery = (event) => {
  event.persist()
  this.setState({ query: event.target.value })
}

submitSearch = (event) => {
  event.preventDefault()
  console.log(this.state.query)
  console.log(process.env.REACT_APP_TEST)
  console.log(process.env.REACT_APP_CLIENT_ID)
  console.log(process.env.REACT_APP_CLIENT_SECRET)
  axios({
    url: `https://api.foursquare.com/v2/venues/explore?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&v=20180323&limit=10&ll=42.3601,-71.0589&query=${this.state.query}`,
    method: 'GET',
    })
    .then(console.log)
    .catch(alert)
  this.setState({ query: '' })
}

onMarkerClick = () => {
  alert('marker clicked')
}

render() {
  return (
    <div className="App">
      
        <form onSubmit={this.submitSearch}>
          <input value = {this.state.query} onChange={this.updateQuery}></input>
          <button>Search</button>
        </form>

        <Map google={this.props.google} zoom={14}>
 
          <Marker onClick={this.onMarkerClick}
                  name={'Current location'} />
  
          <InfoWindow onClose={this.onInfoWindowClose}>
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
              </div>
          </InfoWindow>
        </Map>
    </div>
  )
}
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(App)