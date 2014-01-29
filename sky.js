(function ( $ ) {

    $.sky = function ( element, options ) {

        var defaults = {
            endpoint: null,
            width: 800,
            height: 250,
            bgcolor: 'FFFFFE',
            fgcolor: '666666',
            minorGridLineColor: 'eeeeee',
            majorGridLineColor: 'eeeeee',
            areaMode: 'first',
            areaAlpha: '0.4',
            drawNullAsZero: false,
            from: '-7days',
            xFormat: '%b %d'
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $( element );

        /**
         * Initialize the sparkler and add the required JSONP elements on the page
         */
        plugin.init = function ( element ) {
            plugin.settings = $.extend( {}, defaults, options );

            $( '.sky-filter' ).click( function () {
                var filterElement = $(this);
                $element.each( function () {
                    var me = $( this );

                    if( filterElement.data( 'filter-type' ) && filterElement.data( 'filter-type' ) == 'time' && filterElement.data( 'filter-range' ) )
                    {
                        filterElement.parent().children().removeClass( 'active' );
                        filterElement.addClass( 'active' );

                        me.data( 'from', filterElement.data( 'filter-range' ) );

                        if( filterElement.data( 'x-format' ) )
                            me.data( 'xFormat', filterElement.data( 'x-format' ) );
                        else
                            me.data( 'xFormat', defaults.xFormat );
                    }

                    plugin.loadChart( me );
                } );
            } );

            $element.each( function () {
                // add the chart container image
                $( this ).append( '<img class="sky-graph-image" src="#"/>' );

                plugin.loadChart( $( this ) );
            } );
        };

        /**
         * Will generate a chart from a remote JSONP callback
         *
         * @param callback
         * @param url
         */
        plugin.loadChart = function ( element ) {

            console.log( element.data() );

            // parameterize the chart settings
            var graphSettings = $.extend( plugin.settings, element.data() );

            console.log( 'area=' + element.data( 'areaMode' ) );

            // handle setting area mode
            if( element.data( 'areaMode' ) )
                graphSettings.areaMode = element.data( 'areaMode' );

            var graphSettingsParams = $.param( graphSettings );

            // parameterize the chart targets
            var targets = element.find( '.sky-target' );
            targets.each( function () {
                var me = $( this );
                var target = me.data( 'target' );

                // handle showing another target that shows week-over-week
                if ( me.data( 'time-shift' ) )
                    target = 'timeShift(' + target + ',\'' + graphSettings.from + '\')';

                // handle colour wrapper
                if ( me.data( 'color' ) )
                    target = 'color(' + target + ',\'' + me.data( 'color' ) + '\')';

                // handle an alias wrapper
                if ( me.data( 'alias' ) )
                    target = 'alias(' + target + ',\'' + me.data( 'alias' ) + '\')';

                // handle a legend value wrapper
                if ( me.data( 'legend-value' ) )
                    target = 'legendValue(' + target + ',\'' + me.data( 'legend-value' ) + '\')';



                graphSettingsParams += '&target=' + target;
            } );


            // add a unique salt to bust local caching
            graphSettingsParams += '&salt=' + new Date().getTime();

            console.log( graphSettingsParams );

            element.find( 'img' ).attr( 'src', plugin.settings[ 'endpoint' ] + '?' + graphSettingsParams );
        };

        plugin.init( $element );
    };

    $.fn.sky = function ( options ) {
        return this.each( function () {
            if ( undefined == $( this ).data( 'sky' ) ) {
                var plugin = new $.sky( this, options );
                //$( this ).data( 'sky', plugin );
            }
        } );

    };
})( jQuery );