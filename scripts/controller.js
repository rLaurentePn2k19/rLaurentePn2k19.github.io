$(document).ready(function () {
	$("body").css({ "height": "100%", "background-color": "black" })
	$(".card").css({ "height": "100%", "color": "black" })
	$(".h4").css("color", "black");
	$("#header_text").css({ "padding": "10px", "border-radius": "0px" })
	$("img").css("height","35px");
	//For connect button
	$('#connect_btn').click(function () {
		var connect = $("#input-broker-ws").val();
		client = mqtt.connect(connect);
		client.subscribe($("#topic").val());
		console.log('Connecting..');
		$("#display_status").text("Connecting");
		$("#display_status").removeClass("alert-secondary");
		$("#display_status").addClass("alert-warning");
		client.on("connect", function () {
			$("#display_status").text("Successfully connected");
			$("#display_status").removeClass("alert-warning");
			$("#display_status").addClass("alert alert-success");
			Swal.fire({
				type: 'success',
				title: 'You are successfully connected to the broker!',
				showConfirmButton: false,
				timer: 2500,
				animation: true
			})
			console.log("Successfully Connected");
		});
		//For Disconnect button
		$(".disconnect_btn").click(function () {
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be undo this",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, disconnect!'
			}).then((result) => {
				if (result.value) {
					client.end();
					Swal.fire(
						'Disconnected!',
						'Your are now disconnected to the broker!',
						'success'
					);
					$("#display_status").text("Disconnected");
					$("#display_status").removeClass("aalert alert-success");
					$("#display_status").addClass("alert-secondary");
				}
			})
		});
		//For Publish 
		$("#publish_btn").click(function () {
			var topic = $("#topic").val();
			var payload = $("#payload").val();
			if (topic == "" && payload == "") {
				client.publish("", "");
				Swal.fire({
					type: 'error',
					title: 'Oops...',
					text: 'Please provide inputs!',
					animation: false,
					customClass: {
						popup: 'animated tada'
					}
				});
			}
			else {
				client.publish(topic, payload, function (err) {
					if (err) {
						Swal.fire({
							type: 'error',
							title: 'Oops...',
							text: 'An error occurs!',
							animation: false,
							customClass: {
								popup: 'animated tada'
							}
						});
					} else {
						console.log("Publish { Topic: " + $("#topic").val() + ","+" Payload: "+ $("#payload").val() + "}");
						Swal.fire({
							title: 'Published successfully!',
							timer: 2500,
							animation: true
						});
					}
					console.log("Succesfully Published")
					var row = $("<tr>");
					$("<td>").text(topic).appendTo($(row));
					$("<td>").text(payload).appendTo($(row));
					$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
					$("#tbl-body-pub").append($(row));
				});
			}
		});
		//For Subscribe
		$("#subscribe_btn").click(function () {
			var subscribe = $("#topic-sub").val();
			var topic = $("#topic").val();
			if (subscribe != topic) {
				Swal.fire({
					type: 'error',
					title: 'Oops...',
					text: 'Topic is not available!',
					animation: false,
					customClass: {
						popup: 'animated tada'
					}
				});
			}
			else if (subscribe == topic && topic !== "") {
				client.subscribe(topic, function (err) {
					if (err) {
						Swal.fire({
							type: 'error',
							title: 'Oops...',
							text: 'An error occurs!',
							animation: false,
							customClass: {
								popup: 'animated tada'
							}
						});
					} else {
						var row = $("<tr>").attr("id", "mysub");
						$("<td>").text(topic).appendTo($(row));
						$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
						$("#tbl-body-sub").append($(row))
  					console.log("Subscribe { Topic: " + $("#topic-sub").val() + " }");
						Swal.fire({
							title: 'Subscribed successfully!',
							animation: true,
							timer: 2500,
						});
						console.log("Succesfully Subscribed ");
					}
				});
			}
		})
		//For Unsubscribe
		$("#unsubscribe_btn").click(function () {
			$("#topic-sub").val("");
			$("#mysub").remove();
			Swal.fire({
				title: 'Unsubrscribed successfully!',
				animation: true,
				timer: 2500,
			});
			console.log("Successfully Unsubscribed ");
		})
		client.on("message", function (topic, payload) {
			var row = $("<tr>");
			$("<td>").text(topic).appendTo($(row));
			$("<td>").text(payload).appendTo($(row));
			$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
			$("#tbl-body").append($(row));
		})
	});
})