$.ajax({
    url: 'http://localhost:8084/wb-com/messages',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ id: "629380cb0798bad9943933fe", data: "Cm6Ng13AcPe89piIMuhMGtD/wjr8hwjCidFw0FTr0CX5+Z1VlFAOKThX1VxN14fQukUkkzcOLRGtgd8fb2kMWxol/u+Mh8BY/fo5skPgwbtUbWveqTY4QHnewXWo4p8qiZgTBNfe0RIEtPtQ3w35cWeDZzaE1iuoKMMqgmaw4t6X0bO9jlL3f+Ay+Qszgg8Ma52Bzjtfwy1wJnl5rH89mcfYKbY47i09ZneI14OkF2KV63JTCskGK13WHbBJaj6Wyq2ox4fk47XBLn0+q4ZF/l+Rlar5NjfWOUWE5YgDD62gKHZaAuDgEEnEk1cWcrJdDcYFApOoOM8PkO4crpfr2A==" }),
    dataType: 'json',
    success: function( data, textStatus, jQxhr ){
        userList(data.users);
    },
}, function(err) {
    console.log(err);
});

function userList(list) {
    var users = document.getElementById("asaasa");

    for(var i = 0; i < list.length; i++) {
        users.appendChild(getUser(list[i].id, list[i].username));
    }

    function getUser(id, username) {
        var user = document.createElement("li");
        var a = document.createElement("a");
        a.onclick = function () {
            alert("Hello "+username);
        }
        a.className = "text-base text-gray-900 dark:text-gray-200 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 group";
        a.innerHTML = "<svg class='w-6 h-6 text-gray-500 dark:text-gray-200 group-hover:text-sky-500 dark:group-hover:text-gray-200 transition duration-75'" +
            "xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>" +
            "<path stroke-linecap='round' stroke-linejoin='round' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />" +
            "</svg><span class='ml-3'>" + username + "</span>";
        user.appendChild(a);
        return user;
    }
}