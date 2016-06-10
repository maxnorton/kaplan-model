function getGenstates() {
	var genstates = { 
		'figurestate' : document.getElementById('figuregen').checked,
		'tablestate' : document.getElementById('tablegen').checked
	}
	return genstates;
}

function mobileSubstitutions() {
	if ($(window).width() < 1023) {
		$('.efficacy-info .table-style').html('<a href="img/efficacy-table01.png" class="swipebox"><i class="fa fa-table" aria-hidden="true"></i> Open reference table');
		$('.variable-definitions table:nth-of-type(3)').html('<a href="img/variable-table03.png" class="swipebox"><i class="fa fa-table" aria-hidden="true"></i> Open reference table').css('border', '0 none');
		$('.hide-for-tablets').css('display', 'none');
	}
	if ($(window).width() < 768) {
		$('.variable-definitions table:nth-of-type(1)').html('<a href="img/variable-table01.png" class="swipebox"><i class="fa fa-table" aria-hidden="true"></i> Open reference table').css('border', '0 none');
		$('.variable-definitions table:nth-of-type(2)').html('<a href="img/variable-table02.png" class="swipebox"><i class="fa fa-table" aria-hidden="true"></i> Open reference table').css('border', '0 none');
		$('.custom-instructions table').html('<a href="img/custom-instructions-table01.png" class="swipebox"><i class="fa fa-table" aria-hidden="true"></i> Open reference table').css('border', '0 none');
		$('.hide-for-phones').css('display', 'none');
	}
}

function scrollToHash() {
	if (window.location.hash) {
		var hash = window.location.hash;
		$('body,html').stop(true,true).animate({scrollTop: $(hash).offset().top - $('header').height()}, '500', 'swing');
	};
}

function styleGlossaryLinks() {
	$('.glossary-link').prepend('<i class="fa fa-question-circle"></i>');
	$('.glossary-inline-link').click( function(event) {
		event.preventDefault();
		$(this).stop().siblings('.glossary-inline').toggle('fast');
	});
}

function toggleFormOptions() {
	/***** Toggle input options when gentable, genfigure are switched on/off
		------------------------------------ */

		var genstates = getGenstates();

		$('input[name=figuregen]').change(function() {
			genstates['figurestate'] = $(this).prop('checked');
			$('fieldset.figure').each(function() {
				$(this).prop('disabled', !genstates['figurestate']);
				var textColor = (genstates['figurestate']) ? '' : '#999999';
				$(this).add($(this).find('a')).add($(this).find('i')).add($(this).find('.glossary-inline')).add($(this).find('label[for=efficacyOrYearfig]')).add('.' + efficacyOrYearchoice + '-wrap').css('color', textColor);
			});
		});
		$('input[name=tablegen]').change(function() {
			genstates['tablestate'] = $(this).prop('checked');
			$('fieldset.table').each(function() {
				$(this).prop('disabled', !genstates['tablestate']);
				var textColor = (genstates['tablestate']) ? '' : '#999999';
				$(this).add($(this).find('a')).add($(this).find('i')).add($(this).find('.glossary-inline')).css('color', textColor);
			});
		});

		/***** Toggle input options when choosing between efficacy and year vars for figure
		------------------------------------ */

		var efficacyOrYearchoice = '';
		$('input[name=efficacyOrYearfig]').change(function() {
			efficacyOrYearchoice = $(this).val() + 'fig';
			var efficacyOrYeardisabledvar;
			switch (efficacyOrYearchoice) {
				case 'efficacyfig':
					efficacyOrYeardisabledvar = 'yearfig';
					break;
				default:
					efficacyOrYeardisabledvar = 'efficacyfig';
			}
			$('.' + efficacyOrYearchoice + '-wrap').add('.' + efficacyOrYearchoice + '-wrap a').add('.' + efficacyOrYearchoice + '-wrap i').css('color', '');
			$('.' + efficacyOrYeardisabledvar + '-wrap').add('.' + efficacyOrYeardisabledvar + '-wrap a').add('.' + efficacyOrYeardisabledvar + '-wrap i').css('color', '#999999');
			$('input[name=' + efficacyOrYearchoice + ']').each(function() {
				$(this).prop('disabled', false);
			});
			$('input[name=' + efficacyOrYeardisabledvar + ']').each(function() {
				$(this).prop('disabled', true);
			});
		});
		var efficacyOrYearselected = new Boolean(false);
		$('input[name=efficacyfig]').one('change', function() {
			if (efficacyOrYearselected==false) {
				efficacyOrYearselected = true;
				$('input[name=efficacyOrYearfig][value=efficacy]').attr('checked', true).change();
			};
		});
		$('input[name=yearfig]').one('change', function() {
			if (efficacyOrYearselected==false) {
				efficacyOrYearselected = true;
				$('input[name=efficacyOrYearfig][value=year]').attr('checked', true).change();
			}
		});	
}