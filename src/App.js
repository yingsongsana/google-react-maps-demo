import React from 'react';
import './App.css';
import axios from 'axios'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

class App extends React.Component {
constructor() {
  super() 
  this.state = {
    query: '',
    center: '',
    selectedPlace: '',
    coordinates: {
      lat: null,
      lng: null
    }
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
  axios(`https://cors-anywhere.herokuapp.com/maps.googleapis.com/maps/api/place/findplacefromtext/json?input=general%20assembly&inputtype=textquery&fields=place_id,photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyBr0KBe6OYC3MKAmWh4nfTPQrCQT6ei-O8`, { crossdomain: true })
    .then(console.log)
    .catch(alert)
}

handleChange = address => {
  this.setState({ query: address })
}

handleSelect = async address => {
  const results = await geocodeByAddress(address)
  const coordinates = await getLatLng(results[0])
  console.log(coordinates)
  this.setState({ coordinates })
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
        <br/>
        <PlacesAutocomplete
          value={this.state.query}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </PlacesAutocomplete>

        <Map google={this.props.google} center={this.state.coordinates} zoom={14}>
 
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