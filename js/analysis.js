function applySubmitFunction(genstates) {
	/***** FORM SUBMIT FUNCTION
	------------------------------------ */
	$('#theform').submit(function(e) {
		e.preventDefault();

		/***** Generate figure(s)
		------------------------------------ */
		var fullfig = '';
		var efficacyOrYearlength;
		efficacyOrYearchoice = $('input[name=efficacyOrYearfig]:checked').val() + 'fig';
		switch (efficacyOrYearchoice) {
			case 'efficacyfig':
				efficacyOrYearlength=$('input[name=efficacyfig]:checked').length;
				break;
			case 'yearfig':
				efficacyOrYearlength=$('input[name=yearfig]:checked').length;
				break;			
		};


		if (efficacyOrYearlength==0 || (efficacyOrYearchoice==0 && $('input[name=practicefig]:checked').length==0) ) {
			fullfig = '<p class="alert">The <em>Generate figure</em> option is selected, but insufficient parameters were selected to produce a figure. To generate a figure, please return to the <a href="#" onclick="$(\'body,html\').stop(true,true).animate({scrollTop: $(\'#figureparameters\').offset().top - $(\'header\').height()}, \'500\', \'swing\'); return false;">figure parameters form</a> and select an efficacy level or a year of adoption, and for a net returns figure, at least one management practice.</p>';

		} else {

			switch ( $('input[name=figuredisplay]:checked').val() ) {
				case 'yield':
					var efficacyOrYearfig = [];
					var fig = [];
					for (var j=0; j<efficacyOrYearlength; j++) {
						efficacyOrYearfig[j] = $('input[name=' + efficacyOrYearchoice + ']:checked:eq('+j+')').val();
						fig[j] =  '<a href="img/figures/' + $('select[name=region]').val().toUpperCase() + '-' + 'Yield' + efficacyOrYearfig[j] + '.png" class="swipebox"><img src="img/figures/' + $('select[name=region]').val().toUpperCase() + '-' + 'Yield' + efficacyOrYearfig[j] + '.png" style="width: 910px;" alt="Graphical result" /></a>'
						fullfig += fig[j];
					}
					break;
				case 'netreturns':
					var efficacyOrYearfig = [];
					var practicefig = [];
					var fig = [];
					for (var i=0; i<$('input[name=practicefig]:checked').length; i++) {
						practicefig[i] = $('input[name=practicefig]:checked:eq('+i+')').val();
						for (var j=0; j<efficacyOrYearlength; j++) {
							efficacyOrYearfig[j] = $('input[name=' + efficacyOrYearchoice + ']:checked:eq('+j+')').val();
							fig[i*$('input[name=practicefig]:checked').length+j] =  '<a href="img/figures/' + $('select[name=region]').val().toUpperCase() + '-' + practicefig[i].toUpperCase() + efficacyOrYearfig[j] + '.png" class="swipebox"><img src="img/figures/' + $('select[name=region]').val().toUpperCase() + '-' + practicefig[i].toUpperCase() + efficacyOrYearfig[j] + '.png" style="width: 910px;" alt="Graphical result" /></a>'
							fullfig += fig[i*$('input[name=practicefig]:checked').length+j];
						}
					}
					break;
			};

			fullfig += '</p>';

		};

		/***** Generate table
		------------------------------------ */
		d3.tsv("scenario-presets.tsv", function(data) {

			var tableparams = [];
			var inputs = [];
			var outputs = [];
			var inputkeys = [];
			inputkeys = ['dbp', 'hp', 'dp', '25', '50', '75', '3', '5', '10'];
			for (var inputindex in inputkeys) {
				inputs[inputkeys[inputindex]] = false;
			};
			var outputkeys = [];
			outputkeys = ['acdnb', 'aapo', 'lpy', 'ipt'];
			for (var outputindex in outputkeys) {
				outputs[outputkeys[outputindex]] = false;
			};

			var theFormDrivenOutputVarsArray = [];
			var a=0;

			var tableHeaders = Object.keys(data[0]).slice(1);

			$('input[name=practicetable]:checked').each(function() {
				var thisPractice = $(this).val().toUpperCase();
				$('input[name=efficacytable]:checked').each(function() {
					var thisEfficacy = $(this).val();
					$('input[name=adoptiontable]:checked').each(function() {
						var thisYear = 'y' + $(this).val();
						var theFormDrivenOutputVarName = $('select[name=region]').val() + thisPractice + thisEfficacy + thisYear;
						var thisIndex;
						for (var i in data) {
							if (data[i]['index']==theFormDrivenOutputVarName)
								thisIndex = i;							
						}
						theFormDrivenOutputVarsArray[a] = $.map(data[thisIndex], function(val, key) { return val; }).slice(1);
						a++;
					});
				});
			});

			var table = '';
			if ( theFormDrivenOutputVarsArray.length != 0 && $('input[name=outputtable]:checked').length != 0 ) {
				tableparams['inputs'] = inputs;
				tableparams['outputs'] = outputs;
				$('input[name$=table]:checked').each(function() {
					var element = $(this).attr('value');
					if ( $(this).attr('name') == 'outputtable' )
						tableparams.outputs[element] = true;
					else
						tableparams.inputs[element] = true;
				});

				var tablelabels = '';
				var tablerows = [];

				var the_input_keys = Object.keys(tableparams.inputs);
				var the_output_keys = Object.keys(tableparams.outputs);
				for (var j=0; j<theFormDrivenOutputVarsArray.length; j++) {
					tablerows[j] = '<tr><td>' + theFormDrivenOutputVarsArray[j][0] + '</td><td>' + theFormDrivenOutputVarsArray[j][1] + '</td><td>' + theFormDrivenOutputVarsArray[j][2] + '</td><td>' + theFormDrivenOutputVarsArray[j][3] + '</td>';
				}
				var i=0;
				for ( var param in tableparams.outputs ) {
					var the_key = the_output_keys[i];
					if ( tableparams.outputs[the_key] == true ) {
						tablelabels += '<td>' + tableHeaders[4+i] + '</td>';
						for (var j=0; j<theFormDrivenOutputVarsArray.length; j++) {
							tablerows[j] += '<td>' + theFormDrivenOutputVarsArray[j][4+i] + '</td>';
						}				
					}
					i++;
				};
				for (var j=0; j<theFormDrivenOutputVarsArray.length; j++) {
					tablerows[j] += '</tr>';
				}

				tablelabels = '<tr><td>' + tableHeaders[0] + '</td><td>' + tableHeaders[1] + '</td><td>' + tableHeaders[2] + '</td><td>' + tableHeaders[3] + '</td>' + tablelabels + '</tr>';

				table = '<section class="table-wrap"><h3>Output table</h3><table>' + tablelabels;
				for (var row=0; row<tablerows.length; row++) {
					table += tablerows[row];
				}
				table += '</table>';

				/*console.log(document.getElementById('acdnb').checked);

				if (document.getElementById('acdnb').checked == true) {
					table += '<p class="table-footnote"><strong>Additional cumulative discounted net benefits (ACDNB):</strong> The difference in cumulative net returns (returns - costs) per acre over 25 years between an infected vineyard where action is taken and an untreated infected vineyard. Current and future dollar amounts are in 2013 dollars and are discounted to 2013 using a 3% discount rate.</p>';
				}*/

				table += '</section>';
			} else {
				table = '<p class="alert">The <em>Generate table</em> option is selected, but insufficient parameters were selected to produce an output table. To generate a table, please return to the <a href="#" onclick="$(\'body,html\').stop(true,true).animate({scrollTop: $(\'#tableparameters\').offset().top - $(\'header\').height()}, \'500\', \'swing\'); return false;">table parameters form</a> and select at least one management practice, efficacy level, year of adoption, and output parameter.</p>';
			};

			/***** Add variable definitions section
			---------------------------------------- */

			var varDefs = '<section class="varDefs-printable"><h3 id="variabledefinitions">Variable definitions</h3><p><strong>Cumulative discounted net returns:</strong> The cumulative net returns (returns &minus; costs) per acre over 25 years for a healthy vineyard, an untreated infected vineyard, and infected vineyards where action is taken. Current and future dollar amounts are in 2013 dollars and are discounted to 2013 using a 3% discount rate. </p><p><a id="tablevars"></a></p><p><strong>Additional cumulative discounted net benefits (ACDNB):</strong> The difference in cumulative net returns (returns - costs) per acre over 25 years between an infected vineyard where action is taken and an untreated infected vineyard. Current and future dollar amounts are in 2013 dollars and are discounted to 2013 using a 3% discount rate. </p><p><strong>Last profitable year:</strong> The last year an infected vineyard generates positive annual net returns (returns - costs). This year is the same for discounted and nominal net returns. </p><p><strong>Age adoption pays off:</strong> The age when cumulative discounted net returns (returns – costs) for a treated infected vineyard exceed those from an untreated infected vineyard. </p><p><strong>Infection probability threshold:</strong> The probability of infection where expected cumulative discounted net returns from treating a vineyard equals the expected cumulative discounted net returns from not treating a vineyard. If you perceive a probability of infection less than this probability, then not treating the vineyard generates greater cumulative discounted net returns than a treated vineyard, and vice versa. </p></section>';

			/***** Generate assumptions table
			------------------------------------ */

			var assumptionsHeaders = ['Region', 'Price per ton ($)', 'Discount Rate', 'Cultivar', 'Additional Annual Cost per acre from Double Pruning', 'Additional Annual Cost per acre from Handpainting TopsinM', 'Annual Cultural Cost per acre &#8211; Year 0 &#8211; Establishing Vineyard', 'Annual Cultural Cost per acre &#8211; Year 1 &#8211; Establishing Vineyard', 'Annual Cultural Cost per acre &#8211; Year 2 &#8211; Establishing Vineyard', 'Annual Cultural Cost per acre &#8211; Year 3+ Established Vineyard', 'Annual yield per acre (Tons) &#8211; Year 0', 'Annual yield per acre (Tons) &#8211; Year 1', 'Annual yield per acre (Tons) &#8211; Year 2', 'Annual yield per acre (Tons) &#8211; Year 3', 'Annual yield per acre (Tons) &#8211; Year 4', 'Annual yield per acre (Tons) &#8211; Year 5+'];
			var assumptionsNapa = ['Napa', '$5,192', '3%', 'Cabernet Sauvignon', '$478', '$71', '$32,303', '$5,264', '$5,304', '$7,784','0','0','1','4.5','4.5','4.5'];
			var assumptionsNSJ = ['Northern San Joaquin', '$650', '3%', 'Cabernet Sauvignon', '$243', '$90', '$12,213', '$3,370', '$1,004', '$3,505','0','0','5','10','10','10'];
			var assumptionsCC = ['Central Coast', '$1,262', '3%', 'Cabernet Sauvignon', '$268', '$117', '$9,998', '$2,554', '$3,501', '$4,625','0','0','2.5','5','7.5','7.5'];
			var assumptionsLake = ['Lake', '$1,623', '3%', 'Cabernet Sauvignon', '$279', '$90', '$7,301', '$6,942', '$3,252', '$3,404','0','0','0.75','1.5','3.5','5.75'];
			var assumptionsSonoma = ['Sonoma', '$2,355', '3%', 'Cabernet Sauvignon', '$335', '$74', '$26,780', '$4,204', '$5,186', '$6,280','0','0','1.5','3.5','5','5'];
			var assumptionsArray = [{sonoma: assumptionsSonoma, nsj: assumptionsNSJ, cc: assumptionsCC, lake: assumptionsLake, napa: assumptionsNapa}];
			var assumptionstable = '<section class="assumptions-wrap"><h3>Parameter Values Used in Calculations</h3><table class="assumptionstable">';
			for (var i=0; i<assumptionsHeaders.length; i++) {
				assumptionstable += '<tr><td>' + assumptionsHeaders[i] + '</td><td>' + assumptionsArray[0][$('select[name=region]').val()][i] + '</td></tr>';
			};
			assumptionstable += '</table></section>';

			/***** Collate results
			------------------------------------ */

			var results = '<hr /><h2>Results</h2><p class="landscape-alert" style="font-style: italic;">Tap or click figures to view full-screen. On mobile devices, we recommend viewing your results in landscape mode.</p><p class="print-link"><a href="javascript:window.print()"><i class="fa fa-print" aria-hidden="true"></i> Print these results.</a></p><p class="figure-wrap">';
			if (genstates['figurestate'] == true)
				results += fullfig;
			if (genstates['tablestate'] == true)
				results += table;
			if (figurestate == true || tablestate == true)
				results += varDefs;
			results += assumptionstable + '<p class="print-link"><a href="javascript:window.print()"><i class="fa fa-print" aria-hidden="true"></i> Print these results.</a></p><p class="adjust-link"><a href="#page" onclick="$(\'body,html\').stop(true,true).animate({scrollTop: $(\'#theform\').offset().top - $(\'header\').height()}, \'500\', \'swing\');">Adjust parameters</a></p>';
			$('.results').html(results); // Write results to page

			/***** Style figure output width and jump to top of figs
			------------------------------------ */
			var figsAcross=1;
			if ( $('input[name=efficacyfig]:checked').length > 1 ) {
				figsAcross = $('input[name=efficacyfig]:checked').length;
			} else if ( $('input[name=practicefig]:checked').length > 1 && $('input[name=figuredisplay]').val() == 'netreturns' ) {
				figsAcross = $('input[name=practicefig]:checked').length;
			}
			if ( $( window ).width() / figsAcross < 910 ) {
				$('.results img').each(function() {
					$(this).css('width', 100/figsAcross - 1 + '%');
				})
			};
			$('body,html').stop(true,true).animate({scrollTop: $('#results').offset().top - $('header').height()}, '500', 'swing');
		});

	});
}