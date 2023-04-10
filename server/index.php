<?php
    header('Access-Control-Allow-Origin: *'); 
    header('Content-Type: application/json');

$charset = 'utf8';
$host = 'localhost';
$dbName = 'chatdb';
$dbUsername = 'root';
$dbPassword = '';

try {

    $db = new PDO("mysql:host={$host};dbname={$dbName}" , $dbUsername , $dbPassword);
    if($_SERVER["REQUEST_METHOD"] === 'POST'){
        if(isset($_POST)){
            switch($_POST['action']){
                case 'get-user':
                    $selectQuery = $db->prepare("select * from users where user_name = :name and user_surname = :surname");
                    $selectQuery->execute(["name" => $_POST['name'] , "surname" => $_POST['surname']]);
                    $select = $selectQuery->fetch(PDO::FETCH_ASSOC);
                    if($select){echo json_encode($select);}
                    else json_encode("Hata olustu uye bulunamadı!");

                    break;

                    case 'add-message':
                       $addMessageQuery = $db->prepare("insert into conversations set
                                                        sender_id = :sender_id,
                                                        receiver_id = :receiver_id,
                                                        chat_message = :message");
                        $addMessageQuery->execute([
                            "sender_id" => $_POST['sender_id'],
                            "receiver_id" => $_POST['receiver_id'],
                            "message" => $_POST['message']
                        ]);
                        $addMessage = $addMessageQuery;
                        if($addMessage){
                            $getConversationQuery = $db->prepare("select * from conversations where
                            (sender_id = :sender_id or sender_id = :receiver_id) and
                            (receiver_id = :sender_id or receiver_id = :receiver_id)");
                            $getConversationQuery->execute([
                            "sender_id" => $_POST['sender_id'],
                            "receiver_id" => $_POST['receiver_id']
                            ]);
                            $getConversation = $getConversationQuery->fetchAll(PDO::FETCH_ASSOC);
                            echo json_encode($getConversation);
                        }
                        else json_encode("failed");
                        break;
                    case 'get-receiver':
                       $receiverQuery = $db->prepare("select * from users where user_id = :receiver_id");
                       $receiverQuery->execute(["receiver_id" => $_POST['receiver_id']]);
                       $receiver = $receiverQuery->fetch(PDO::FETCH_ASSOC);
                       if($receiver){echo json_encode($receiver);}
                       else  echo json_encode("Gönderici Üye Bulunamadı!"); 
                        break;
                    case 'get-users':
                        $usersQuery = $db->prepare("select * from users where user_id != :id");
                        $usersQuery->execute([ "id" => $_POST['user_id']]);
                        $users = $usersQuery->fetchAll(PDO::FETCH_ASSOC);
                        if($users) echo json_encode($users);
                        else echo json_encode("Kullanıcılar Bulunamadı!");
                        break;
                    case 'get-conversation':
                        $getConversationQuery = $db->prepare("select * from conversations where
                                                        (sender_id = :sender_id or sender_id = :receiver_id) and
                                                        (receiver_id = :sender_id or receiver_id = :receiver_id)");
                        $getConversationQuery->execute([
                            "sender_id" => $_POST['sender_id'],
                            "receiver_id" => $_POST['receiver_id']
                        ]);
                        $getConversation = $getConversationQuery->fetchAll(PDO::FETCH_ASSOC);
                        if($getConversation){echo json_encode($getConversation);}
                        else echo json_encode("sohbet bulunamadı");
                        break;
            }
          
        }
    }
}
catch(PDOException $e) {
    print $e->getMessage();
}
