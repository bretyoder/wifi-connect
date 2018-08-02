$('.chosen-select').chosen({disable_search_threshold: 10});

$(document).on('change', '.custom-file-input', function () {
	let fileName = $(this).val().replace(/\\/g, '/').replace(/.*\//, '');
	$(this).parent('.custom-file').find('.custom-file-label').text(fileName);
});

$("#settings").hide();
//$("#wifi-networks").hide();

$(function(){

	$('#wifi-networks-list').on('click', 'a', function (e) {
		e.preventDefault();

		$("#wifi-networks").hide();
		$("#settings").show();
	})

	$('#security-select').chosen().change(function (event) {
		$("option:selected", this).tab('show');
	});

	$('#eap-authentication').chosen().change(function (event) {
		$("option:selected", this).tab('show');

		if($(this).val() === 'tls') {
			$("#eap-username-password-pane").hide();
		} else {
			$("#eap-username-password-pane").show();
		}
	});

	var networks = undefined;

	function showHideEnterpriseSettings() {
		var security = $(this).find(':selected').attr('data-security');
		if(security === 'eap') {
			$('#identity-group').show();
		} else {
			$('#identity-group').hide();
		}
	}

	$('#ssid-select').change(showHideEnterpriseSettings);

	$('#connect-form').submit(function(ev){
		$.post('/connect', $('#connect-form').serialize(), function(data){
			$('.before-submit').hide();
			$('#submit-message').removeClass('hidden');
		});
		ev.preventDefault();
	});

	$.get('/networks', function(data){
		$('#wifi-networks-list').empty();

		networks = JSON.parse(data);
		$.each(networks, function(i, val){
			/*
			Reference view:

			<a href="#" class="list-group-item list-group-item-action">
			  <h5 class="d-flex">
				<span class="flex-grow-1">SSID</span>
				<i class="fas fa-check mr-3 light-icon"></i>
				<i class="fas fa-lock mr-3 light-icon"></i>
				<i class="fas fa-wifi strength-10"></i>
			  </h5>
			</a>
			*/

			let blackness = Math.round((val.strength - 1) / 10);
			let strengthClass = 'strength-' + blackness;

			let h5 = $('<h5 class="d-flex">')
				.append(
					$('<span class="flex-grow-1">')
						.text(val.ssid)
				);

			if (val.active === true) {
				h5.append($('<i class="fas fa-check mr-3 light-icon"></i>'));
			}

			if (val.security !== 'none') {
				h5.append($('<i class="fas fa-lock mr-3 light-icon"></i>'));
			}

			h5.append(
				$('<i class="fas fa-wifi"></i>')
					.addClass(strengthClass)
			);

			let link = $('<a href="#" class="list-group-item list-group-item-action">')
				.append(h5);

			$('#wifi-networks-list').append(link);
		});

		jQuery.proxy(showHideEnterpriseSettings, $('#ssid-select'))();
	});
});