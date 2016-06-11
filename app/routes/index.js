import Ember from 'ember';

export default Ember.Route.extend( {
  model() {
    return Ember.$.getJSON( 'https://mobiliteit.stamplayapp.com/api/cobject/v1/report?page=1%26per_page=20' );
  }
} );
