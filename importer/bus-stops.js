const request = require( 'request' );
const stamplay = require( 'stamplay' );
var _s = new stamplay( "mobiliteit", "5f9712b9eff418239bbda71aff71255e7d8e2b9f88f711ef9c5271bc397e11dc" );

request( 'http://opendata.vdl.lu/odaweb/index.jsp?describe=1', function ( error, response, body ) {
    if ( !error && response.statusCode == 200 ) {
        data = JSON.parse( body );
        for ( var i = 0; i < data.data.length; i++ ) {
            if ( data.data[ i ].i18n.fr.name.search( 'Ligne' ) != -1 ) {
                store_bus_stops( data.data[ i ].id );
            }
            else {
                console.log( '🙈 because its not a 🚌 line' )
            }
        }
    }
} );

function store_bus_stops( id ) {
    var myurl = "http://geojson.konnen.lu/reproject?url=http://opendata.vdl.lu/odaweb/?cat=" + id;
    request( myurl, function ( error, response, body ) {
        if ( !error && response.statusCode == 200 ) {
            data = JSON.parse( body );
            for ( var i = 0; i < data.features.length; i++ ) {
                var geo = data.features[ i ];
                switch ( geo.geometry.type ) {
                    //case 'LineString':
                    //console.log( 'path' );
                    //console.log( JSON.stringify( geo.geometry.coordinates ) )
                    //break;
                    case 'Point':
                        console.log( 'saving 🚏 ' + geo.properties.name );
                        _s.Object( 'stop' )
                            .save( {
                                'name': geo.properties.name,
                                '_geolocation': geo.geometry.coordinates
                            }, function ( err, res ) {
                                if ( err ) {
                                    console.log( '🚌 line ' + id + ' ❌ :' );
                                    console.log( err );
                                }
                                console.log( '🚌 line ' + id + '  ✅' );
                            } );
                        break;
                    default:
                        console.log( '🙈 because its not a 🚌 line' );
                        break;
                }
            }
        }
    } );
}
