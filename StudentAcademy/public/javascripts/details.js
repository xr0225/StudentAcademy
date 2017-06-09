$(document).ready(function () {
    $('.btnOrderLiterature').click(function () {        
        $.ajax({
            type: 'POST',
            url: '/delete',
            dataType: 'JSON',
            data: { name: $(this).val(), age: $(this).attr('data-value') },
            success: function (resultData) {
                console.log('success');
                location.reload();
            }
        });
    });
    $('.back').click(function () {
        alert('d');
        $.ajax({
            type: 'GET',
            url: '/back',
            dataType: 'JSON',
            success: function (resultData) {
                console.log('back to list');                
            }
        });
    });
});