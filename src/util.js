/* ######## UTIL ############# */

window.jumpui = window.jumpui || {};
jumpui.util = jumpui.util || {};

jumpui.util.serializeForm = function($el) {
    if ( $el == undefined || !$el.length ) { 
		throw "No elements found in the form";
	}

    var data = {},
      lookup = data; //current reference of data

      $el.find(':input[type!="checkbox"][type!="radio"], input:checked').each(function() {
        // data[a][b] becomes [ data, a, b ]
        var named = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(','),
            cap = named.length - 1,
            i = 0;

        // Ensure that only elements with valid `name` properties will be serialized
        if ( named[ 0 ] ) {
          for ( ; i < cap; i++ ) {
              // move down the tree - create objects or array if necessary
              lookup = lookup[ named[i] ] = lookup[ named[i] ] ||
                  ( named[i+1] == "" ? [] : {} );
          }

          // at the end, psuh or assign the value
          if ( lookup.length != undefined ) {
               lookup.push( $(this).val() );
          }else {
				if(lookup[ named[ cap ] ]){
					if(_.isArray(lookup[named[cap]])){
						lookup[named[cap]].push( $(this).val());
					}else{
						lookup[named[ cap ]] = [lookup[ named[ cap ]], $(this).val()];
					}
				}else{
					if($(this).attr("data-field") == "array"){
						lookup[ named[ cap ] ]  = [$(this).val()];
					}else{
                		lookup[ named[ cap ] ]  = $(this).val();
					}
				}
          }

          // assign the reference back to root
          lookup = data;

        }
      });

    return data;
};

