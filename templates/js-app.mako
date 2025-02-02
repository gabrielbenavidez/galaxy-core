<%namespace name="galaxy_client" file="/galaxy_client_app.mako" />
<!DOCTYPE HTML>
<html>
    <!--js-app.mako-->
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        ## For mobile browsers, don't scale up
        <meta name="viewport" content="maximum-scale=1.0">
        ## Force IE to standards mode, and prefer Google Chrome Frame if the user has already installed it
        <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">

        <title>
            Infotechsoft
        </title>
        
        ## relative href for site root
        <link rel="index" href="${ h.url_for( '/' ) }"/>
        
        ## TODO: use loaders to move everything but the essentials below the fold
        ${ h.css(
            'jquery-ui/smoothness/jquery-ui',
            'bootstrap-tour',
            'base'
        )}

    </head>

    <body scroll="no" class="full-content">
        ${ js_disabled_warning() }
        ${ javascripts() }
        ${ javascript_app() }
    </body>
</html>

<%def name="javascripts()">
    ${ h.js(
        'bundled/libs.chunk',
        'bundled/base.chunk'
    )}
    ${ h.js('bundled/' + js_app_name + '.bundled')}
</%def>

<%def name="javascript_entry()">
    ${ h.js('bundled/' + js_app_name + '.bundled')}
</%def>

<%def name="javascript_app()">

    <script type="text/javascript">
        console.debug("Initializing javascript application:", "${js_app_entry_fn}");

        // js-app.mako
        var options = ${ h.dumps( options ) };
        var bootstrapped = ${ h.dumps( bootstrapped ) };

        config.set({
            options: options,
            bootstrapped: bootstrapped,
            form_input_auto_focus: ${h.to_js_bool(form_input_auto_focus)}
        });
    </script>

    %if not form_input_auto_focus is UNDEFINED and form_input_auto_focus:
    <script type="text/javascript">
        $(document).ready( function() {
            // Auto Focus on first item on form
            if ( $("*:focus").html() == null ) {
                $(":input:not([type=hidden]):visible:enabled:first").focus();
            }
        });
    </script>
    %endif

    ${ galaxy_client.config_sentry(app) }
    %if app.config.ga_code:
        ${ galaxy_client.config_google_analytics(app.config.ga_code) }
    %endif

</%def>

<%def name="js_disabled_warning()">
    <noscript>
        <div class="overlay overlay-background noscript-overlay">
            <div>
                <h3 class="title">Javascript Required for Galaxy</h3>
                <div>
                    The Galaxy analysis interface requires a browser with Javascript enabled.<br>
                    Please enable Javascript and refresh this page.
                </div>
            </div>
        </div>
    </noscript>
</%def>
