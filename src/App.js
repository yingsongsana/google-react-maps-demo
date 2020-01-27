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

handleChange = address => {
  this.setState({ query: address })
}

handleSelect = async address => {
  const results = await geocodeByAddress(address)
  const coordinates = await getLatLng(results[0])
  console.log(results)
  console.log(coordinates)
  this.setState({ coordinates })
  this.setState({ selectedPlace: results[0].place_id })
}

onMarkerClick = () => {
  alert('marker clicked')
}

render() {
  return (
    <div className="App">

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
                  position={this.state.coordinates}
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