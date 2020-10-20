require([
    "modules/jquery-mozu"
], function($) {
    $(document).ready(function() {
        // Donations
        $('#step2a input').click(function(e) {
            switch ($(e.target).val()) {
                case 'Yes':
                    $('#step3a').slideDown();
                    break;
                case 'No':
                    showAlertMessage();
                    break;
            }
        });

        $('#step3a input').click(function(e) {
            switch ($(e.target).val()) {
                case 'Yes':
                    showAlertMessage();
                    break;
                case 'No':
                    $('#step4a').slideDown();
                    break;
            }
        });

        $('#step4a input').click(function(e) {
            switch ($(e.target).val()) {
                case 'Yes':
                    $('#step5a').slideDown();
                    break;
                case 'No':
                    showAlertMessage();
                    break;
            }
        });

        $('#step5a input').click(function(e) {
            switch ($(e.target).val()) {
                case 'Yes':
                    showAlertMessage();
                    break;
                case 'No':
                    $('#step6a').slideDown();
                    break;
            }
        });

        $('#step6a input').click(function(e) {
            $('#step7a').slideDown();
        });


        function showAlertMessage() {
            alert('Thank you for your interest in Jelly Belly Candy Company. Based on the information you have provided, we regret we cannot proceed any further. We currently consider requests for certain types of support from organizations within our outreach focus and meeting eligibility requirements.');
        }
    });

});