var noble = require( 'noble' );
var bleno = require( 'bleno' );

var settings = require( './config/settings' );
var central = require( './lib/central' );
var peripheral = require( './lib/peripheral' )
    .init();

// Central Boot-up.
noble.on( 'stateChange', function ( state ) {
    if ( state === 'poweredOn' ) {

        // Begin scanning
        console.log( 'CEN: Scanning...' );
        noble.startScanning( [ settings.uuids.service.formatted ], true );
    } else {
        noble.stopScanning();
    }
} )

// Central Discovery
noble.on( 'discover', function ( peripheral ) {
    central.connect( peripheral );
} )

// Peripheral Boot-up
bleno.on( 'stateChange', function ( state ) {
    if ( state === 'poweredOn' ) {

        // Begin advertising
        bleno.startAdvertising( settings.deviceName, [ settings.uuids.service.pure ], function ( err ) {
            if ( err ) {
                console.log( 'PER: ' + err );
            }
        } );
    } else {
        bleno.stopAdvertising();
    }
} );

// Peripheral Discovery.
bleno.on( 'accept', peripheral.accept );
bleno.on( 'advertisingStart', peripheral.handle );
