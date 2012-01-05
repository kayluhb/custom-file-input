(function($) {
    var CustomFile = function(el, opts) {
        //Defaults are below
        var settings = $.extend({}, $.fn.customFile.defaults, opts),
        $el = $(el), klass = 'custom-file', hover = '-hover', focus = '-focus',
        //create custom control container
        upload = $('<p class="' + klass + ' ' + $el.attr('class') + '"></p>'),
        //create custom control button
        button = $('<span class="' + klass + '-button" aria-hidden="true">' + settings.text + '</span>').appendTo(upload),
        //create custom control feedback
        feedback = $('<span class="' + klass + '-feedback" aria-hidden="true"></span>');
        if (settings.status) {
            feedback.appendTo(upload);
        }
         //add class for CSS
        $el.addClass(klass + '-input')
            .mouseover(function(){ upload.addClass(klass + hover); })
            .mouseout(function(){ upload.removeClass(klass + hover); })
            .focus(function(){
	              upload.addClass(klass + focus); 
	              $el.data('val', $el.val());
            })
            .blur(function(){ 
	              upload.removeClass(klass + focus);
	              $(this).trigger('checkChange');
             })
            .bind('checkChange', function(){
	              if ($el.val() && $el.val() != $el.data('val')){
		                $el.trigger('change');
	              }
            })
            .bind('change',function(){
                if (!settings.status) { return; }
	              //get file name
	              var fileName = $(this).val().split(/\\/).pop(),
	              //get file extension
	              fileExt = klass + '-ext-' + fileName.split('.').pop().toLowerCase();
	              //update the feedback
	              feedback
		              .text(fileName) //set feedback text to filename
		              .removeClass(feedback.data('fileExt') || '') //remove any existing file extension class
		              .addClass(fileExt) //add file extension class
		              .data('fileExt', fileExt) //store file extension for class removal on next change
		              .addClass(klass + '-feedback-populated'); //add class to show populated state
            })
            .click(function(){ //for IE and Opera, make sure change fires after choosing a file, using an async callback
	              $el.data('val', $el.val());
	              setTimeout(function(){
		                $el.trigger('checkChange');
	              },100);
            });
        //on mousemove, keep file input under the cursor to steal click
        upload
	          .mousemove(function(e){
		            $el.css({
			            'left': e.pageX - upload.offset().left - $el.outerWidth() + 20, //position right side 20px right of cursor X)
			            'top': e.pageY - upload.offset().top - $(window).scrollTop() - 3
		            });	
	          })
	          .insertAfter($el); //insert after the input
        $el.appendTo(upload).css({ opacity:0 });
    };
    $.fn.customFile = function(options) {
        return this.each(function(idx, el) {
            var $el = $(this), key = 'customFile';
            // Return early if this element already has a plugin instance
            if ($el.data(key)) { return; }
            // Pass options to plugin constructor
            var customFile = new CustomFile(this, options);
            // Store plugin object in this element's data
            $el.data(key, customFile);
        });
    };
    // default settings
    $.fn.customFile.defaults = { status:true, text: 'Choose File' };
})(jQuery);

